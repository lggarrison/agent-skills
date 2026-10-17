# Intention

This file says what this repository is for and what belongs in it. When adding or changing a
skill, check it against this file first. If a change doesn't fit, it belongs somewhere else.

## Purpose

A small set of general-purpose agent skills, shared publicly for anyone to use in their own
projects. I use them across mine. Keeping them in one place means every project gets the
same version, and improvements land everywhere with `npx skills update`.

## Ownership

- I write these skills on my own time, on my own equipment.
- They're published under the [MIT License](LICENSE), so anyone may use, change, and share
  them.
- Contributions must be the contributor's own work, free to share under the same license.

## What belongs here

- **Skills that work in any repository.** A skill describes a way of working, such as a PR
  workflow, a review bar, a roadmap format, or wiki upkeep. It doesn't describe a
  particular project.
- **Plain instructions.** Markdown that Claude Code, Cursor, GitHub Copilot, and other
  agents that read `SKILL.md` can all follow. No dependency on one vendor's features
  unless the skill says so and offers a fallback.
- **Short, specific guidance.** Rules an agent can follow and a reviewer can check. Cut
  anything an agent would do correctly without being told.

## What doesn't belong here

- **Anything from an employer or client,** mine or a contributor's. No code, docs, prompts,
  internal tool names, hostnames, processes, or text copied or adapted from work
  repositories, work chats, or work systems. Not even with names changed. When it's unclear
  where something came from, write it fresh instead of copying it.
- **Project-specific rules.** Where a project keeps its roadmaps, which commands check its
  wiki, its domain rules: those go in that project's `AGENTS.md`, `CLAUDE.md`, or its own
  local skills. Every skill here tells the agent that the repo's own rules win.
- **Secrets,** tokens, account IDs, or personal data.
- **Tooling.** Scripts and CLIs live in their own packages. For example,
  [`llm-wiki-manager`](https://github.com/lggarrison/llm-wiki-manager) scaffolds and lints
  wikis, and the `wiki` skill here tells agents how to work in one.

## How skills are written

- Each skill is `skills/<name>/SKILL.md`, with `name` and `description` frontmatter. The
  description says what the skill does and when to use it, because that's what agents read
  to decide whether to load it.
- Each skill opens by deferring to the repository's own rules.
- Skills may link to each other with relative paths (`../pr-review/SKILL.md`). Skills that
  link to each other are installed together, and the README says so.
- No references to any one project: no repo names, package scripts, or file paths that only
  exist in one codebase.

## How skills are shared

- Projects install with the [`skills`](https://github.com/vercel-labs/skills) CLI and
  commit the installed copies, so cloud agents and teammates get them from a fresh clone.
- Projects never edit an installed copy. A fix goes here, then out to projects with
  `npx skills update`.

## Checklist for a new or changed skill

- [ ] The author's own work, not taken from an employer or client.
- [ ] Useful in more than one repository.
- [ ] No project names, paths, scripts, secrets, or personal data.
- [ ] Defers to the repo's own rules.
- [ ] Frontmatter `description` says what it does and when to use it.
- [ ] README table updated.
