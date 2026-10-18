# agent-skills

General-purpose [agent skills](https://agentskills.io) for Claude Code, Cursor, GitHub
Copilot, and other agents that read `SKILL.md` files. Free for anyone to use under the
[MIT License](LICENSE).

| Skill                                                        | Use when                                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [`github`](skills/github/SKILL.md)                           | Opening a PR, updating its title or body, working through review comments, or watching a PR for comments and CI failures |
| [`pr-review`](skills/pr-review/SKILL.md)                     | Reviewing a PR or diff, or re-reviewing after new commits: what to flag, severity, and converging over rounds            |
| [`generating-roadmaps`](skills/generating-roadmaps/SKILL.md) | Creating, updating, or reviewing a project roadmap                                                                       |
| [`wiki`](skills/wiki/SKILL.md)                               | Creating, ingesting into, querying, or maintaining a project wiki                                                        |
| [`repo-setup`](skills/repo-setup/SKILL.md)                   | Bootstrapping a new repo, or auditing one for its license, security policy, templates, CI, and tooling                   |
| [`unit-testing`](skills/unit-testing/SKILL.md)               | Writing, fixing, or reviewing unit tests, including bug-fix tests and flaky tests                                        |
| [`e2e-testing`](skills/e2e-testing/SKILL.md)                 | Writing, debugging, or reviewing browser, CLI, or API end-to-end tests, including flaky ones                             |

`github` and `pr-review` refer to each other, so install them together. The same goes for
`unit-testing` and `e2e-testing`.

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

Issues and pull requests are welcome. Read [INTENTION.md](INTENTION.md) first. It says
what belongs in this repo, what doesn't, and has a checklist for new or changed skills.
