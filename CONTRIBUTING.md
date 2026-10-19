# Contributing

Thanks for helping. Read [INTENTION.md](INTENTION.md) first. It says what belongs in this
repository, what doesn't, and how skills are written.

## Setup

You need Git and Node.js (the version in [`.nvmrc`](.nvmrc)). Then:

```bash
git clone https://github.com/lggarrison/agent-skills.git
cd agent-skills
npm ci
```

Node.js is only for the checks. The skills themselves are plain Markdown.

## Checks

Run this before opening a pull request. CI runs the same command.

```bash
npm run check
```

It runs:

- `npm run format:check`: Prettier on every Markdown, YAML, and JSON file. Fix problems
  with `npm run format`.
- `npm run check:skills`: every `skills/<name>/SKILL.md` has a `name` that matches its
  folder and a `description`, every skill is in the README table and linked from
  `.claude/skills/`, and every relative link in a Markdown file points at a file that
  exists.

## Adding or changing a skill

Agents working here get these steps from the repository-only
[`adding-a-skill`](.claude/skills/adding-a-skill/SKILL.md) skill.

- Work through the
  [checklist in INTENTION.md](INTENTION.md#checklist-for-a-new-or-changed-skill).
- Add a line under `Unreleased` in [CHANGELOG.md](CHANGELOG.md).
- For a new skill, link it into `.claude/skills/` so Claude Code loads it while working in
  this repository: `ln -s ../../skills/<name> .claude/skills/<name>`.
- Try the skill in a real repository with at least one agent before opening the PR, and
  say in the PR which agent you used.

## Branches and commits

- Branch from `main` and open pull requests against `main`.
- Name branches `<type>/<name>/<branch-description>`, for example
  `feature/lacy/add-security-policy`, as the
  [`github` skill](skills/github/SKILL.md#creating-a-pr-from-a-branch) describes.
  `<name>` is the person the work is for, never an agent's or bot's name. The description
  says what the branch changes in a few hyphenated words, never a random or generated
  name.
- Write commit messages as a short imperative sentence, for example
  `Add a branch-naming rule to the github skill`. Keep each commit to one logical change.

## Review

The maintainer reviews every pull request against [INTENTION.md](INTENTION.md). A PR is
ready to merge when CI passes and review comments are resolved. Squash merges keep `main`
to one commit per PR.

## Security

Don't report security problems in issues or PRs. See [SECURITY.md](SECURITY.md).
