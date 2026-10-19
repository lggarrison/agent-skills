// Checks that every skill has valid frontmatter, a README entry, and a link in
// `.claude/skills/`, and that relative links in Markdown files point at files that
// exist. Run with `npm run check:skills`.

import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  statSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const claudeSkillsDir = join(root, ".claude", "skills");
const errors = [];

// Limits from the Agent Skills specification (https://agentskills.io).
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NAME_MAX = 64;
const DESCRIPTION_MAX = 1024;

function readFrontmatter(file) {
  const match = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fields = {};
  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const field = lines[i].match(/^([a-z][\w-]*):\s*(.*)$/);
    if (!field) continue;
    let value = field[2];
    // A value can continue on indented lines (a plain scalar or a `|` / `>` block).
    if (value === "" || value === "|" || value === ">") value = "";
    while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
      value += " " + lines[++i].trim();
    }
    fields[field[1]] = value.trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
  }
  return fields;
}

const readme = readFileSync(join(root, "README.md"), "utf8");

for (const name of readdirSync(skillsDir)) {
  const dir = join(skillsDir, name);
  if (!statSync(dir).isDirectory()) continue;
  const file = join(dir, "SKILL.md");
  const where = relative(root, file);
  if (!existsSync(file)) {
    errors.push(`skills/${name}: missing SKILL.md`);
    continue;
  }
  const fields = readFrontmatter(file);
  if (!fields) {
    errors.push(`${where}: missing frontmatter`);
    continue;
  }
  if (fields.name !== name) {
    errors.push(
      `${where}: name "${fields.name ?? ""}" doesn't match its folder "${name}"`,
    );
  }
  if (!NAME_PATTERN.test(name) || name.length > NAME_MAX) {
    errors.push(
      `${where}: name must be lowercase letters, digits, and hyphens, at most ${NAME_MAX} characters`,
    );
  }
  if (!fields.description) {
    errors.push(`${where}: missing description`);
  } else if (fields.description.length > DESCRIPTION_MAX) {
    errors.push(
      `${where}: description is ${fields.description.length} characters, over ${DESCRIPTION_MAX}`,
    );
  }
  if (!readme.includes(`(skills/${name}/SKILL.md)`)) {
    errors.push(`README.md: no entry for skills/${name}/SKILL.md`);
  }
  // Claude Code loads a repo's skills from `.claude/skills/`, so each skill is linked there.
  const link = join(claudeSkillsDir, name);
  const target = `../../skills/${name}`;
  if (!lstatSync(link, { throwIfNoEntry: false })?.isSymbolicLink()) {
    errors.push(`.claude/skills/${name}: missing symlink to ${target}`);
  } else if (readlinkSync(link) !== target) {
    errors.push(`.claude/skills/${name}: should link to ${target}`);
  }
}

const linked = existsSync(claudeSkillsDir) ? readdirSync(claudeSkillsDir) : [];
for (const name of linked) {
  if (!existsSync(join(skillsDir, name, "SKILL.md"))) {
    errors.push(`.claude/skills/${name}: no matching skills/${name}/SKILL.md`);
  }
}

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") && entry.name !== ".github") return [];
    if (entry.name === "node_modules") return [];
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

for (const file of markdownFiles(root)) {
  const text = readFileSync(file, "utf8")
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, "")
    .replace(/`[^`\n]*`/g, "");
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#")) continue;
    const path = decodeURIComponent(target.split("#")[0]);
    if (!existsSync(join(dirname(file), path))) {
      errors.push(`${relative(root, file)}: broken link ${target}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log("Skills and links OK.");
