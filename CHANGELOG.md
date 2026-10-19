# Changelog

All notable changes to the skills in this repository are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This repository has no releases.
Projects pick up changes from `main` with `npx skills update`, so entries are grouped by
the date they landed.

## [Unreleased]

### Added

- `SECURITY.md`, `CONTRIBUTING.md`, this changelog, PR and issue templates, Dependabot,
  and a CI workflow that runs `npm run check`.

### Changed

- `github`: branches are named `<type>/<name>/<branch-description>`, for example
  `feature/alex/csv-export`, and the description says what the branch changes, never a
  random or generated name. Types are `feature`, `fix`, `docs`, `chore`, `refactor`, and
  `test`, so `feat/` is now `feature/`.
- `github`: after opening a PR, request a Copilot review at the Lite effort level and ask
  the user whether to watch the PR. Copilot review requests now have their own section,
  which skips duplicate requests and says which effort level ran.
- `github`: Copilot comments that hold up are fixed and replied to, nits included, and
  each round of fixes gets a new Copilot review, up to five rounds (was three).

## 2026-10-17

### Added

- `repo-setup`, `unit-testing`, and `e2e-testing` skills.
- `github`, `pr-review`, `generating-roadmaps`, and `wiki` skills.
- `INTENTION.md`, describing what belongs in this repository.
