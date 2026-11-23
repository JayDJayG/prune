import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (...parts) =>
  JSON.parse(readFileSync(join(root, ...parts), "utf8"));

const portable = readJson("plugin.json");
const claude = readJson(".claude-plugin", "plugin.json");
const codex = readJson(".codex-plugin", "plugin.json");
const claudeMarketplace = readJson(".claude-plugin", "marketplace.json");
const codexMarketplace = readJson(".agents", "plugins", "marketplace.json");

test("portable and compatibility manifests describe the same release", () => {
  assert.equal(
    portable.$schema,
    "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  );
  assert.match(portable.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);

  for (const manifest of [claude, codex]) {
    for (const [key, value] of Object.entries(portable)) {
      if (key !== "$schema" && key !== "extensions") {
        assert.deepEqual(manifest[key], value, `Mismatched manifest ${key}`);
      }
    }
  }

  const tooling = readJson("package.json");
  for (const key of ["name", "version", "description", "license"]) {
    assert.equal(tooling[key], portable[key], `Mismatched package ${key}`);
  }
});

test("all clients discover the same shared skill payload", () => {
  const skillsRoot = join(root, "skills");
  assert.equal(resolve(root, claude.skills), skillsRoot);
  assert.equal(resolve(root, codex.skills), skillsRoot);

  const skills = readdirSync(skillsRoot, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory(),
  );
  assert.ok(skills.length > 0, "The plugin must ship a functional skill");

  for (const skill of skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const source = readFileSync(join(skillsRoot, skill.name, "SKILL.md"), "utf8");
    const document = source.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]+)$/);
    assert.ok(document, `${skill.name} needs frontmatter and instructions`);
    const [, frontmatter, body] = document;
    assert.match(frontmatter, new RegExp(`^name: ${skill.name}\\r?$`, "m"));
    const description = frontmatter.match(/^description: (.+)\r?$/m);
    assert.ok(description, `${skill.name} needs a single-line description`);
    assert.ok(description[1].trim().length > 0);
    assert.ok(description[1].trim().length <= 1024);
    assert.ok(body.trim().length > 0, `${skill.name} needs instructions`);
  }
});

test("Claude and Copilot marketplace entries resolve to the plugin root", () => {
  assert.ok(claudeMarketplace.owner.name);
  const entry = claudeMarketplace.plugins.find(
    (plugin) => plugin.name === portable.name,
  );
  assert.ok(entry, "The marketplace must list this plugin");
  assert.equal(resolve(root, entry.source), root);
  assert.equal(entry.description, portable.description);
});

test("Codex marketplace entries resolve to the same installable plugin", () => {
  assert.equal(codexMarketplace.name, claudeMarketplace.name);
  const entry = codexMarketplace.plugins.find(
    (plugin) => plugin.name === portable.name,
  );
  assert.ok(entry, "The Codex marketplace must list this plugin");
  assert.equal(entry.source.source, "local");
  assert.ok(entry.source.path.startsWith("./"));
  assert.equal(resolve(root, entry.source.path), root);
  assert.ok(
    ["AVAILABLE", "INSTALLED_BY_DEFAULT", "NOT_AVAILABLE"].includes(
      entry.policy.installation,
    ),
  );
  assert.ok(["ON_INSTALL", "ON_USE"].includes(entry.policy.authentication));
  assert.ok(entry.category);
});
