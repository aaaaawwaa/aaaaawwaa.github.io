#!/usr/bin/env node
// LumenTrace learning bridge: validate the single-source concept map.
// Checks schema, unique IDs, prerequisite DAG, published page existence, and bridge anchors.
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { map: "learning-map.json", repo: "." };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--map") out.map = argv[++i];
    else if (argv[i] === "--repo") out.repo = argv[++i];
    else if (argv[i] === "--json") out.json = true;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const mapPath = path.resolve(args.map);
const repo = path.resolve(args.repo);
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);

let data;
try {
  data = JSON.parse(fs.readFileSync(mapPath, "utf8"));
} catch (error) {
  console.error("FAIL: cannot read map: " + mapPath + " (" + error.message + ")");
  process.exit(1);
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isSlug = (value) => typeof value === "string" && value !== "" && value.split("/").every((part) => slugPattern.test(part));
const contentRoot = path.join(repo, "content");
const pageFile = (slug) => path.join(contentRoot, slug + ".md");
const pageExists = (slug) => isSlug(slug) && fs.existsSync(pageFile(slug));

if (!fs.existsSync(contentRoot)) {
  fail("content directory not found: " + contentRoot);
}

if (data.schemaVersion !== 1) fail("schemaVersion must be 1");
if (typeof data.topic !== "string" || data.topic.trim() === "") fail("topic missing");
if (!data.overview || !isSlug(data.overview.page)) fail("overview.page invalid");
else if (!pageExists(data.overview.page)) fail("overview.page has no Markdown: " + data.overview.page);

const bridge = data.bridge;
if (!bridge || !isSlug(bridge.page)) {
  fail("bridge.page invalid");
} else {
  if (!pageExists(bridge.page)) fail("bridge.page has no Markdown: " + bridge.page);
  if (typeof bridge.anchor !== "string" || !slugPattern.test(bridge.anchor)) fail("bridge.anchor invalid");
  else if (pageExists(bridge.page)) {
    const text = fs.readFileSync(pageFile(bridge.page), "utf8");
    if (!text.includes('id="' + bridge.anchor + '"')) fail("bridge anchor missing in " + bridge.page + ": " + bridge.anchor);
  }
}

const concepts = Array.isArray(data.concepts) ? data.concepts : [];
if (concepts.length === 0) fail("concepts must be a non-empty array");
const byId = new Map();
const requiredModes = ["intuition", "derivation", "reference"];
const pageTextCache = new Map();
function pageText(slug) {
  if (!pageTextCache.has(slug)) {
    pageTextCache.set(slug, pageExists(slug) ? fs.readFileSync(pageFile(slug), "utf8") : "");
  }
  return pageTextCache.get(slug);
}

for (let i = 0; i < concepts.length; i++) {
  const concept = concepts[i];
  const at = "concepts[" + i + "]";
  if (typeof concept.id !== "string" || !slugPattern.test(concept.id)) fail(at + ".id invalid");
  else if (byId.has(concept.id)) fail("duplicate concept id: " + concept.id);
  if (typeof concept.title !== "string" || concept.title.trim() === "") fail(at + ".title missing");
  if (concept.type !== undefined && !["concept", "prerequisite"].includes(concept.type)) fail(at + ".type invalid");
  for (const key of ["overviewPage", "sourcePage"]) {
    if (!isSlug(concept[key])) fail(at + "." + key + " invalid");
    else if (!pageExists(concept[key])) fail(at + "." + key + " has no Markdown: " + concept[key]);
  }
  if (concept.relatedLabPage !== undefined) {
    if (!isSlug(concept.relatedLabPage)) fail(at + ".relatedLabPage invalid");
    else if (!pageExists(concept.relatedLabPage)) fail(at + ".relatedLabPage has no Markdown: " + concept.relatedLabPage);
  }
  if (!Array.isArray(concept.prerequisites)) fail(at + ".prerequisites must be an array");
  if (!Array.isArray(concept.learningModes) || !requiredModes.every((mode) => concept.learningModes.includes(mode))) {
    fail(at + ".learningModes missing intuition/derivation/reference");
  }
  if (typeof concept.rescueSummary !== "string" || concept.rescueSummary.trim() === "") fail(at + ".rescueSummary missing");
  const conceptBridgePage = concept.bridgePage || concept.overviewPage;
  let conceptBridgeAnchor = concept.bridgeAnchor;
  if (!conceptBridgeAnchor && bridge && conceptBridgePage === bridge.page) conceptBridgeAnchor = bridge.anchor;
  if (concept.bridgePage !== undefined) {
    if (!isSlug(concept.bridgePage)) fail(at + ".bridgePage invalid");
    else if (!pageExists(concept.bridgePage)) fail(at + ".bridgePage has no Markdown: " + concept.bridgePage);
  }
  if (typeof conceptBridgeAnchor !== "string" || !slugPattern.test(conceptBridgeAnchor)) {
    fail(at + ".bridgeAnchor missing for " + conceptBridgePage);
  } else if (pageExists(conceptBridgePage) && !pageText(conceptBridgePage).includes('id="' + conceptBridgeAnchor + '"')) {
    fail(at + ".bridgeAnchor missing in " + conceptBridgePage + ": " + conceptBridgeAnchor);
  }
  if (concept.rescueAnchor !== undefined) {
    if (typeof concept.rescueAnchor !== "string" || !slugPattern.test(concept.rescueAnchor)) fail(at + ".rescueAnchor invalid");
    else if (pageExists(conceptBridgePage) && !pageText(conceptBridgePage).includes('id="' + concept.rescueAnchor + '"')) {
      fail(at + ".rescueAnchor missing in " + conceptBridgePage + ": " + concept.rescueAnchor);
    }
  }
  if (typeof concept.id === "string") byId.set(concept.id, concept);
}

for (const concept of concepts) {
  for (const prerequisite of concept.prerequisites || []) {
    if (prerequisite === concept.id) fail(concept.id + ": self dependency");
    else if (!byId.has(prerequisite)) fail(concept.id + ": unknown prerequisite " + prerequisite);
  }
}

const state = new Map();
function walk(id, stack) {
  const seen = state.get(id);
  if (seen === 2) return;
  if (seen === 1) {
    fail("dependency cycle: " + stack.concat(id).join(" -> "));
    return;
  }
  state.set(id, 1);
  const concept = byId.get(id);
  for (const prerequisite of (concept && concept.prerequisites) || []) {
    if (byId.has(prerequisite)) walk(prerequisite, stack.concat(id));
  }
  state.set(id, 2);
}
for (const id of byId.keys()) walk(id, []);

const reachable = concepts.find((concept) => concept.id === "autocorrelation");
if (reachable) {
  const prereqs = reachable.prerequisites || [];
  for (const wanted of ["expectation", "random-process"]) {
    if (!prereqs.includes(wanted)) warnings.push("autocorrelation does not declare prerequisite " + wanted);
  }
} else {
  warnings.push("no autocorrelation concept in map");
}

for (const message of warnings) console.log("WARN: " + message);
for (const message of errors) console.error("FAIL: " + message);
if (errors.length > 0) {
  console.error("learning map check failed: " + errors.length + " problem(s)");
  process.exit(1);
}
console.log("PASS: " + concepts.length + " concepts; ids unique; prerequisites form a DAG; pages and bridge anchors exist.");
