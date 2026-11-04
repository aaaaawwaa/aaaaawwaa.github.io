import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validator = path.join(repoRoot, "scripts", "validate-learning-map.mjs");

function runValidator(args, cwd) {
  return spawnSync(process.execPath, [validator, ...args], { cwd, encoding: "utf8" });
}

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lt-bridge-"));
  const write = (relative, content) => {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  write("content/signal-processing/random-processes.md", [
    "# 随机过程与随机信号",
    '<details id="concept-bridge-autocorrelation" class="lt-bridge">',
    "<summary>概念学习卡</summary>",
    "</details>",
    '<details id="concept-bridge-expectation" class="lt-bridge">',
    "<summary>数学期望</summary>",
    "</details>",
    '<details id="concept-bridge-random-process" class="lt-bridge">',
    "<summary>随机过程与样本函数</summary>",
    "</details>",
  ].join("\n"));
  write("content/vault-notes/random-signals/02-expectation-variance.md", "# 数学期望与方差\n");
  write("content/vault-notes/random-signals/03-definition-and-sample-functions.md", "# 随机过程的定义与样本函数\n");
  write("content/vault-notes/random-signals/04-autocorrelation-autocovariance.md", "# 自相关与自协方差\n");
  write("content/interactive-labs/random-processes-lab.md", "# 随机过程与样本函数实验\n");
  const map = {
    schemaVersion: 1,
    topic: "random-processes",
    overview: { page: "signal-processing/random-processes", label: "随机过程与随机信号" },
    bridge: { page: "signal-processing/random-processes", anchor: "concept-bridge-autocorrelation" },
    concepts: [
      {
        id: "random-process",
        title: "随机过程与样本函数",
        overviewPage: "signal-processing/random-processes",
        sourcePage: "vault-notes/random-signals/03-definition-and-sample-functions",
        prerequisites: [],
        learningModes: ["intuition", "derivation", "reference"],
        rescueAnchor: "concept-bridge-random-process",
        rescueSummary: "固定时刻是随机变量，固定样本是样本函数。",
      },
      {
        id: "expectation",
        title: "数学期望",
        overviewPage: "signal-processing/random-processes",
        sourcePage: "vault-notes/random-signals/02-expectation-variance",
        prerequisites: [],
        learningModes: ["intuition", "derivation", "reference"],
        rescueAnchor: "concept-bridge-expectation",
        rescueSummary: "按概率加权的平均。",
      },
      {
        id: "autocorrelation",
        title: "自相关函数",
        overviewPage: "signal-processing/random-processes",
        sourcePage: "vault-notes/random-signals/04-autocorrelation-autocovariance",
        prerequisites: ["random-process", "expectation"],
        learningModes: ["intuition", "derivation", "reference"],
        relatedLabPage: "interactive-labs/random-processes-lab",
        rescueAnchor: "concept-bridge-autocorrelation",
        rescueSummary: "两个时刻取值的集合平均。",
      },
    ],
  };
  write("learning-map.json", JSON.stringify(map, null, 2));
  return { root, map };
}

test("the repository learning map passes", () => {
  const result = runValidator(["--repo", repoRoot], repoRoot);
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /PASS: /);
});

test("a valid fixture passes and reports concept count", () => {
  const fixture = makeFixture();
  const result = runValidator(["--map", "learning-map.json", "--repo", "."], fixture.root);
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /PASS: 3 concepts/);
});

test("a dependency cycle is rejected", () => {
  const fixture = makeFixture();
  const map = fixture.map;
  map.concepts[0].prerequisites = ["autocorrelation"];
  fs.writeFileSync(path.join(fixture.root, "learning-map.json"), JSON.stringify(map));
  const result = runValidator(["--repo", "."], fixture.root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /dependency cycle/);
});

test("an unknown prerequisite is rejected", () => {
  const fixture = makeFixture();
  const map = fixture.map;
  map.concepts[2].prerequisites = ["expectation", "not-a-concept"];
  fs.writeFileSync(path.join(fixture.root, "learning-map.json"), JSON.stringify(map));
  const result = runValidator(["--repo", "."], fixture.root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown prerequisite not-a-concept/);
});

test("a missing source page is rejected", () => {
  const fixture = makeFixture();
  const map = fixture.map;
  map.concepts[1].sourcePage = "vault-notes/random-signals/99-missing-note";
  fs.writeFileSync(path.join(fixture.root, "learning-map.json"), JSON.stringify(map));
  const result = runValidator(["--repo", "."], fixture.root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /has no Markdown: vault-notes\/random-signals\/99-missing-note/);
});

test("a missing bridge anchor is rejected", () => {
  const fixture = makeFixture();
  const map = fixture.map;
  map.bridge.anchor = "concept-bridge-missing";
  fs.writeFileSync(path.join(fixture.root, "learning-map.json"), JSON.stringify(map));
  const result = runValidator(["--repo", "."], fixture.root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /bridge anchor missing/);
});

test("a per-concept bridge page without its own anchor is rejected", () => {
  const fixture = makeFixture();
  const map = fixture.map;
  fs.mkdirSync(path.join(fixture.root, "content", "signal-processing"), { recursive: true });
  fs.writeFileSync(path.join(fixture.root, "content", "signal-processing", "second-page.md"), "# second\n");
  map.concepts.push({
    id: "second-concept",
    title: "第二概念",
    overviewPage: "signal-processing/second-page",
    sourcePage: "vault-notes/random-signals/02-expectation-variance",
    prerequisites: ["expectation"],
    learningModes: ["intuition", "derivation", "reference"],
    rescueSummary: "测试用。",
  });
  fs.writeFileSync(path.join(fixture.root, "learning-map.json"), JSON.stringify(map));
  const result = runValidator(["--repo", "."], fixture.root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /bridgeAnchor missing for signal-processing\/second-page/);
});

test("a rescue anchor missing from the concept bridge page is rejected", () => {
  const fixture = makeFixture();
  const map = fixture.map;
  map.concepts[1].rescueAnchor = "concept-bridge-not-there";
  fs.writeFileSync(path.join(fixture.root, "learning-map.json"), JSON.stringify(map));
  const result = runValidator(["--repo", "."], fixture.root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /rescueAnchor missing in signal-processing\/random-processes/);
});

test("every bridge card page exposes the three-depth switcher", () => {
  const map = JSON.parse(fs.readFileSync(path.join(repoRoot, "learning-map.json"), "utf8"));
  for (const concept of map.concepts) {
    const page = concept.bridgePage || concept.overviewPage;
    const source = fs.readFileSync(path.join(repoRoot, "content", page + ".md"), "utf8");
    assert.match(source, /class="lt-depth-tabs"/, page + " is missing depth tabs");
    const radios = (source.match(/class="lt-depth /g) || []).length;
    assert.ok(radios >= 3, page + " exposes " + radios + " depth radios (expected >= 3)");
  }
});
