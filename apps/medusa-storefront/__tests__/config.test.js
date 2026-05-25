/**
 * Tests for Cloudflare Workers deployment configuration changes:
 *
 * - package.json: `cf:deploy` script migrated from `wrangler pages deploy`
 *   to `wrangler deploy` (Workers Assets model)
 * - wrangler.toml: `[site]` + `bucket` replaced with `[assets]` + `directory`
 *   + `binding = "ASSETS"` (Workers Assets model)
 */

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readPackageJson() {
  const raw = fs.readFileSync(path.join(ROOT, "package.json"), "utf8");
  return JSON.parse(raw);
}

function readWranglerToml() {
  return fs.readFileSync(path.join(ROOT, "wrangler.toml"), "utf8");
}

/**
 * Minimal TOML section parser.
 * Returns an object whose keys are section headers (e.g. "assets", "vars")
 * and values are objects of key = value pairs within that section.
 * Top-level (no header) key/value pairs are stored under the "" key.
 */
function parseTomlSections(tomlContent) {
  const sections = { "": {} };
  let currentSection = "";

  for (const rawLine of tomlContent.split("\n")) {
    const line = rawLine.trim();

    // Skip blank lines and comments
    if (!line || line.startsWith("#")) continue;

    // Section header: [name]
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      sections[currentSection] = {};
      continue;
    }

    // Key = value (quoted or unquoted)
    const kvMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();
      // Strip surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      // Strip inline array brackets
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/^"|"$/g, ""));
      }
      sections[currentSection][key] = value;
    }
  }

  return sections;
}

// ---------------------------------------------------------------------------
// package.json – cf:deploy script
// ---------------------------------------------------------------------------

describe("package.json – cf:deploy script", () => {
  let pkg;

  test("package.json is readable and valid JSON", () => {
    assert.doesNotThrow(() => {
      pkg = readPackageJson();
    });
    assert.ok(pkg, "package.json should parse to a truthy value");
  });

  test("cf:deploy script is defined", () => {
    pkg = pkg ?? readPackageJson();
    assert.ok(
      pkg.scripts && typeof pkg.scripts["cf:deploy"] === "string",
      'scripts["cf:deploy"] must exist'
    );
  });

  test("cf:deploy uses `wrangler deploy` (Workers Assets command)", () => {
    pkg = pkg ?? readPackageJson();
    assert.equal(
      pkg.scripts["cf:deploy"],
      "wrangler deploy",
      'cf:deploy must be "wrangler deploy"'
    );
  });

  test("cf:deploy does NOT use the deprecated `wrangler pages deploy`", () => {
    pkg = pkg ?? readPackageJson();
    assert.notEqual(
      pkg.scripts["cf:deploy"],
      "wrangler pages deploy",
      'cf:deploy must not be the deprecated "wrangler pages deploy"'
    );
  });

  test("cf:deploy does not contain the word 'pages'", () => {
    pkg = pkg ?? readPackageJson();
    assert.ok(
      !pkg.scripts["cf:deploy"].includes("pages"),
      'cf:deploy must not reference "pages" (deprecated Workers Sites / Pages sub-command)'
    );
  });

  test("other scripts are unchanged", () => {
    pkg = pkg ?? readPackageJson();
    assert.equal(pkg.scripts["dev"], "next dev -p 8000");
    assert.equal(pkg.scripts["build"], "next build");
    assert.equal(
      pkg.scripts["build:cloudflare"],
      "npx @opennextjs/cloudflare build"
    );
    assert.equal(pkg.scripts["start"], "next start");
    assert.equal(pkg.scripts["lint"], "next lint");
    assert.equal(pkg.scripts["cf:typegen"], "wrangler types");
  });
});

// ---------------------------------------------------------------------------
// wrangler.toml – [assets] section (Workers Assets model)
// ---------------------------------------------------------------------------

describe("wrangler.toml – [assets] section", () => {
  let toml;
  let sections;

  test("wrangler.toml is readable", () => {
    assert.doesNotThrow(() => {
      toml = readWranglerToml();
    });
    assert.ok(typeof toml === "string" && toml.length > 0);
  });

  test("wrangler.toml contains an [assets] section header", () => {
    toml = toml ?? readWranglerToml();
    assert.ok(
      toml.includes("[assets]"),
      "wrangler.toml must declare an [assets] section"
    );
  });

  test("[assets].directory is set to .open-next/assets", () => {
    toml = toml ?? readWranglerToml();
    sections = sections ?? parseTomlSections(toml);
    assert.ok(
      sections["assets"],
      "[assets] section must be parsed from wrangler.toml"
    );
    assert.equal(
      sections["assets"]["directory"],
      ".open-next/assets",
      '[assets].directory must equal ".open-next/assets"'
    );
  });

  test("[assets].binding is set to ASSETS", () => {
    toml = toml ?? readWranglerToml();
    sections = sections ?? parseTomlSections(toml);
    assert.equal(
      sections["assets"]["binding"],
      "ASSETS",
      '[assets].binding must equal "ASSETS"'
    );
  });

  test("wrangler.toml does NOT contain the deprecated [site] section", () => {
    toml = toml ?? readWranglerToml();
    // Match [site] as a standalone section header (not part of a longer name)
    assert.ok(
      !/^\[site\]\s*$/m.test(toml),
      "wrangler.toml must not contain the deprecated [site] section"
    );
  });

  test("wrangler.toml does NOT use the deprecated `bucket` key under [site]", () => {
    toml = toml ?? readWranglerToml();
    sections = sections ?? parseTomlSections(toml);
    assert.ok(
      !sections["site"],
      "[site] section must not exist in wrangler.toml"
    );
  });

  test("[assets] section uses `directory` not `bucket`", () => {
    toml = toml ?? readWranglerToml();
    sections = sections ?? parseTomlSections(toml);
    assert.ok(
      sections["assets"]["directory"] !== undefined,
      "[assets].directory must be present"
    );
    assert.ok(
      sections["assets"]["bucket"] === undefined,
      "[assets].bucket must not be present (deprecated Workers Sites key)"
    );
  });

  test("top-level worker configuration is intact", () => {
    toml = toml ?? readWranglerToml();
    sections = sections ?? parseTomlSections(toml);
    const root = sections[""];
    assert.equal(root["name"], "nemuzoo");
    assert.equal(root["main"], ".open-next/worker.js");
    assert.equal(root["compatibility_date"], "2025-05-01");
  });

  test("[vars].NODE_ENV remains set to production", () => {
    toml = toml ?? readWranglerToml();
    sections = sections ?? parseTomlSections(toml);
    assert.ok(sections["vars"], "[vars] section must exist");
    assert.equal(
      sections["vars"]["NODE_ENV"],
      "production",
      "NODE_ENV must be production"
    );
  });

  // Regression: ensure the assets path points inside .open-next (not a stale
  // path that would cause static-asset 404s in production).
  test("regression – [assets].directory is inside .open-next to prevent static 404s", () => {
    toml = toml ?? readWranglerToml();
    sections = sections ?? parseTomlSections(toml);
    assert.ok(
      sections["assets"]["directory"].startsWith(".open-next"),
      "[assets].directory must reference a path inside .open-next"
    );
  });
});

// ---------------------------------------------------------------------------
// Cross-file consistency checks
// ---------------------------------------------------------------------------

describe("cross-file consistency – package.json and wrangler.toml", () => {
  test("cf:deploy script is `wrangler deploy` and wrangler.toml uses [assets] (both use the Workers Assets model)", () => {
    const pkg = readPackageJson();
    const toml = readWranglerToml();

    // Workers Assets model: script must be `wrangler deploy`
    assert.equal(pkg.scripts["cf:deploy"], "wrangler deploy");

    // Workers Assets model: config must have [assets] not [site]
    assert.ok(toml.includes("[assets]"));
    assert.ok(!/^\[site\]\s*$/m.test(toml));
  });
});