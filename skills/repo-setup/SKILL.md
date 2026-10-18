---
name: repo-setup
description:
  Sets up or audits a repository's baseline files, including license, security policy,
  contributing guide, README, editor and Git hygiene, PR and issue templates, Dependabot,
  CI, and for Node.js/TypeScript projects the lint, format, test, hook, and publish
  tooling. Includes starter PR and issue templates. Use when bootstrapping a new
  repository, adding missing community or GitHub files to an existing one, or checking a
  repository against a new-repo checklist.
---

# Repo setup

A new repository needs the same baseline every time: a license, a way to report security
problems, a README, templates that make PRs and issues useful, and CI that runs the same
checks a contributor runs locally. This skill is a checklist for that baseline and a way
to work through it.

## Repo rules come first

Read what the repository already has before adding anything: `AGENTS.md` / `CLAUDE.md`,
`CONTRIBUTING.md`, existing `.github/` files, the package manifest and its scripts, and
any CI config. Where they set a convention (default branch, license, tooling, file
locations), follow it. Never overwrite an existing file to match a template here. Extend
it, or leave it and mention the gap.

## Workflow

### 1. Pin down the ask

- **Bootstrap:** a new or nearly empty repository. Work the whole checklist.
- **Fill gaps:** an existing repository is missing some of it. Add only what's missing.
- **Audit:** report what's missing or weak, and change nothing.

### 2. Take inventory

List which checklist files exist, and read the manifest (`package.json`, `pyproject.toml`,
`go.mod`, `Cargo.toml`, and so on) for the language, the scripts, and whether the project
is published. Find the default branch with `git remote show origin` or
`gh repo view --json defaultBranchRef`. Don't ask the user anything you can learn this
way.

### 3. Ask about the judgment calls

These are the user's decisions. Ask once, in one short round, and recommend where the
evidence supports it:

- **License,** and the copyright holder's name.
- **Security contact:** GitHub private vulnerability reporting, an email address, or both.
- **Code of conduct contact,** if adding one.
- **PR base branch,** if it isn't the default branch.
- **Published or not:** to a package registry, or as a release artifact.
- **CI matrix:** which operating systems and runtime versions to support.

### 4. Write the files

Work the [checklist](#checklist) top to bottom, and skip sections that don't apply.

- **Fetch canonical text; don't recall it.** Get license text from
  `gh api licenses/<spdx-id> --jq .body` (for example `mit` or `apache-2.0`), then fill in
  the year and holder. Get a code of conduct from its official source, such as the
  Contributor Covenant.
- **Adapt the templates.** Start from [`templates/`](templates/). Replace every
  `<placeholder>`, and change the commands to ones that exist in this repo. A template
  that lists a script the repo doesn't have is worse than no template.
- **One list of checks.** The PR template checklist, `CONTRIBUTING.md`, the pre-commit
  hook, and CI should all name the same commands. When one changes, change the others.
- **Ask before changing settings.** Branch protection, rulesets, and private vulnerability
  reporting are repository settings, not files. Propose them and apply them only when the
  user agrees.

### 5. Check it

- [ ] Every command named in a template, hook, or CI job runs locally and passes.
- [ ] No `<placeholder>` is left in any file.
- [ ] Issue forms and workflows are valid YAML. Issue forms only appear on the default
      branch, so check them there after merging.
- [ ] Links resolve, including the security policy URL.
- [ ] The repo's own format and lint checks pass on the new files.

### 6. Report

Say what you added, what you left alone and why, the repository settings you proposed, and
any judgment calls still open.

## Checklist

**R** is required, **rec** is recommended, and **opt** is optional.

### Tools

- **R** `git`, and the language runtime and package manager.
- **rec** A runtime version manager (`nvm`, `fnm`, `pyenv`, and so on) matching the pinned
  version file.
- **rec** `gh`, authenticated with `gh auth login`, for maintainers.

### Legal and community

- **R** `LICENSE`.
- **R** `SECURITY.md`: supported versions, how to report privately, and what reporters can
  expect after reporting.
- **rec** `CONTRIBUTING.md`: setup, the checks to run, branch and commit conventions, and
  how PRs are reviewed.
- **rec** `CODE_OF_CONDUCT.md`, with a real enforcement contact.
- **rec** `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com) format.

### Documentation

- **R** `README.md`: what it is, how to install it, a minimal usage example, and links to
  `CONTRIBUTING.md`, `SECURITY.md`, and the license.
- **opt** `AGENTS.md`: the vendor-neutral entry point for coding agents. Give the commands
  to run and the rules to follow, and link to other docs rather than repeating them.
- **opt** `RELEASING.md`, for published projects. See [Publishing](#publishing).

### Editor and Git hygiene

- **R** `.gitignore` for the language, the build output, and local environment files.
- **rec** `.gitattributes` with `* text=auto eol=lf`, so line endings don't churn between
  operating systems.
- **rec** `.editorconfig` for charset, final newline, and indentation.

### GitHub templates and automation

If the repository isn't on GitHub, use the host's equivalents.

- **rec** `.github/PULL_REQUEST_TEMPLATE.md`. See [Templates](#templates).
- **rec** Issue forms in `.github/ISSUE_TEMPLATE/`: `bug_report.yml`,
  `feature_request.yml`, and a `config.yml` that turns off blank issues and points
  security reports to the private channel. See [Templates](#templates).
- **rec** `.github/dependabot.yml`, with one entry for each package ecosystem the repo
  uses, plus `github-actions`.
- **R** `.github/workflows/ci.yml`, running the same checks as the PR template on every PR
  and every push to the default branch.
- **opt** `.github/release.yml`, to group generated release notes by label.
- **opt** `.github/workflows/release.yml`, for published projects only.
- **rec** Branch protection or a ruleset on the default branch that requires CI. This is a
  setting, so ask first.

### Node.js and TypeScript

Skip this section for other languages, and apply the same ideas with that ecosystem's
tools: a pinned runtime version, a formatter, a linter, a test runner, a single "check
everything" command, and a CI matrix.

**Runtime and metadata**

- **rec** `.nvmrc`, and `engines.node` in `package.json`, agreeing with each other.
- **R** `package.json` `repository`, `homepage`, `bugs`, `license`, and `author`.
- **rec** `"type": "module"` for native ESM.

**TypeScript** (TypeScript projects only)

- **R** `typescript` and a `tsconfig.json`, with an `npm run build` that compiles.
- Don't convert a JavaScript project to TypeScript. For a new project, whether to use
  TypeScript is the user's call.

**Format and lint**

- **rec** Prettier (`.prettierrc.json`, `.prettierignore`) and an ESLint flat config.
- **rec** Scripts `lint`, `lint:fix`, `format`, and `format:check`.

**Unit tests**

- **R** An `npm test` that runs the unit tests.
- **rec** Vitest, with tests next to the code (`src/**/*.test.ts`) and shared fixtures in
  `test/`.

**End-to-end tests** (opt, for projects with a UI or browser flows)

- **rec** `@playwright/test`, a `playwright.config.ts`, and tests in `e2e/`.
- **rec** An `npm run test:e2e` script.
- **rec** `playwright-report/`, `test-results/`, and `blob-report/` in `.gitignore`.
- **rec** A CI job that installs browsers with `npx playwright install --with-deps` and
  uploads the report when a test fails.
- **opt** For a CLI with no browser, run end-to-end tests through a separate Vitest config
  instead.

**Git hooks** (local development only)

- **rec** Husky with a `pre-commit` hook that runs lint-staged.
- **rec** A `prepare` script that skips installing Husky when `CI` is set or
  `NODE_ENV=production`, so installs in CI and production don't fail.
- **opt** A `pre-push` hook that runs the unit tests.

**Quality gate**

- **rec** One script, such as `check`, that runs lint, `format:check`, the unit tests, the
  build, and the end-to-end tests in that order. CI and contributors both run it.
- **rec** A CI matrix across the supported operating systems and Node.js versions.

### Publishing

For projects released to a package registry. These are opt for everything else.

- **rec** A `"files"` allowlist in `package.json` (or `.npmignore`), checked with
  `npm pack --dry-run`.
- **rec** A `prepublishOnly` script that runs the build.
- **rec** Publishing from CI with npm Trusted Publishing (OIDC, `id-token: write`), so no
  long-lived token is stored as a secret.
- **rec** `RELEASING.md` covering how versions are chosen (semver), how a release is
  tagged, the checks that block a bad tag, and how to roll back.

## Templates

| File                                                                                           | Copy to                                      |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`templates/PULL_REQUEST_TEMPLATE.md`](templates/PULL_REQUEST_TEMPLATE.md)                     | `.github/PULL_REQUEST_TEMPLATE.md`           |
| [`templates/ISSUE_TEMPLATE/bug_report.yml`](templates/ISSUE_TEMPLATE/bug_report.yml)           | `.github/ISSUE_TEMPLATE/bug_report.yml`      |
| [`templates/ISSUE_TEMPLATE/feature_request.yml`](templates/ISSUE_TEMPLATE/feature_request.yml) | `.github/ISSUE_TEMPLATE/feature_request.yml` |
| [`templates/ISSUE_TEMPLATE/config.yml`](templates/ISSUE_TEMPLATE/config.yml)                   | `.github/ISSUE_TEMPLATE/config.yml`          |

Placeholders are written `<like-this>`. For example, replace `<runtime-version-command>`
with `node --version`, `python --version`, or `go version`. The other commands in the
templates are examples from a Node.js project. Replace them with the repo's own.
