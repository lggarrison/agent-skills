---
name: adding-a-skill
description: How to add a new skill to this repository, or change an existing one, so it fits INTENTION.md and passes the checks. Use when asked to create, rename, split, or substantially change a skill in skills/. This skill is for this repository only and isn't published.
---

# Adding or changing a skill in this repository

This repository publishes general-purpose skills from `skills/`. This skill lives in
`.claude/skills/` as a real folder rather than a link, so it's used here and never
installed into other projects. [INTENTION.md](../../../INTENTION.md) and
[CONTRIBUTING.md](../../../CONTRIBUTING.md) are the source of truth. When they disagree
with this skill, they win.

If a `skill-creator` skill is available, use it for drafting and testing the skill's
content. This skill covers what this repository needs on top of that.

## 1. Check that it belongs

Read INTENTION.md first. A skill belongs in `skills/` only if it:

- works in any repository and describes a way of working, not a particular project;
- is plain Markdown any agent can follow, with no dependency on one vendor's features
  unless it says so and offers a fallback;
- is the author's own work, with nothing taken from an employer or client.

If it only makes sense in one project, it belongs in that project's `CLAUDE.md`,
`AGENTS.md`, or local skills. If it only applies to this repository, put it in
`.claude/skills/<name>/` as a real folder, like this one, and skip steps 3 and 4 below.
If it needs a script or CLI, the tooling goes in its own package and the skill tells
agents how to use it.

## 2. Write it

- Create `skills/<name>/SKILL.md`. `<name>` is lowercase letters, digits, and hyphens, at
  most 64 characters. The frontmatter `name` must match the folder.
- The `description` says what the skill does and when to use it, in at most 1,024
  characters. Agents read only this when deciding whether to load the skill, so name the
  requests that should trigger it.
- Open by deferring to the repository's own rules. Look at how the existing skills do it.
- Keep it short and specific: rules an agent can follow and a reviewer can check. Cut
  anything an agent would do correctly without being told.
- No project names, paths, package scripts, internal tool names, secrets, or personal
  data.
- Link to sibling skills with relative paths (`../pr-review/SKILL.md`). If two skills
  link to each other, say in the README that they're installed together.

## 3. Wire it up

- Add a row to the skills table in [README.md](../../../README.md): the skill's link and
  when to use it.
- Link it for Claude Code: `ln -s ../../skills/<name> .claude/skills/<name>`.
- Add a line under `Unreleased` in [CHANGELOG.md](../../../CHANGELOG.md), under `Added`
  or `Changed`.

## 4. When changing an existing skill

- Update its `description` if what it does or when to use it changed, and its README row
  if its use changed.
- When you rename a heading, search the other skills and docs for links to its old anchor
  (`grep -rn '#old-anchor' .`). `npm run check` checks that linked files exist, but not
  anchors.
- When renaming a skill, rename its folder, its `name`, its README row, and its symlink,
  and update every link to it.

## 5. Check and open the PR

- Run `npm run check` and fix everything it reports. Use `npm run format` for formatting.
- Try the skill in a real repository with at least one agent, and say in the PR which
  agent you used.
- Work through the checklist in INTENTION.md, then open the PR with the `github` skill.
  The repository's PR template has the same checklist.
