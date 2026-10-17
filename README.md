# agent-skills

General-purpose [agent skills](https://agentskills.io) for Claude Code, Cursor, GitHub
Copilot, and other agents that read `SKILL.md` files.

| Skill                                                        | Use when                                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [`github`](skills/github/SKILL.md)                           | Opening a PR, updating its title or body, working through review comments, or watching a PR for comments and CI failures |
| [`pr-review`](skills/pr-review/SKILL.md)                     | Reviewing a PR or diff, or re-reviewing after new commits: what to flag, severity, and converging over rounds            |
| [`generating-roadmaps`](skills/generating-roadmaps/SKILL.md) | Creating, updating, or reviewing a project roadmap                                                                       |
| [`wiki`](skills/wiki/SKILL.md)                               | Creating, ingesting into, querying, or maintaining a project wiki                                                        |

`github` and `pr-review` refer to each other, so install them together.

## Install

Skills are installed with the [`skills`](https://github.com/vercel-labs/skills) CLI. From
the root of the project:

```bash
npx skills add lggarrison/agent-skills            # pick skills and agents interactively
npx skills add lggarrison/agent-skills --all      # every skill, every detected agent
npx skills add lggarrison/agent-skills --skill github --skill pr-review
npx skills add lggarrison/agent-skills --list     # see what's available
```

Commit the installed files (`.agents/skills/`, `.claude/skills/`, and so on) so that
teammates, CI, and cloud agent sessions, which all start from a fresh clone, get them too.
Add `--copy` if anything that reads the repo doesn't follow symlinks.

To install for yourself across all projects instead, add `-g`.

## Update

```bash
npx skills update -p        # project skills
npx skills update github    # one skill
```

Review the diff and commit it like any other change.

## Project-specific rules

These skills are deliberately generic. Each one tells the agent to read the repo's own rules
first (`AGENTS.md` / `CLAUDE.md`, `CONTRIBUTING.md`, the PR template, a wiki schema) and to
let them win. Put project specifics there, for example where roadmaps live or which commands
validate the wiki, rather than editing an installed `SKILL.md`. An edited copy is overwritten
by the next `npx skills update`.

## Contributing

Each skill is `skills/<name>/SKILL.md`, with `name` and `description` frontmatter. Keep skills
free of references to any one project, and keep relative links between skills
(`../pr-review/SKILL.md`) working by installing linked skills together.
