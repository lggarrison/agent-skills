---
name: generating-roadmaps
description: Writes and maintains project roadmaps as Markdown files in the repository. Each roadmap has phases, work items with stable IDs and checkable acceptance criteria, explicit dependencies, a list of unresolved decisions, and a changelog. Use when asked to create, update, reconcile with recent work, restructure, or review a roadmap or delivery plan.
---

# Generating roadmaps

A roadmap is a plan the next person can pick up and act on without the conversation that
produced it. It says what the project is trying to reach, in what order, how anyone will
know each piece is done, and which questions are still open. It lives in the repository
next to the code it describes, so it's reviewed and versioned like everything else.

A roadmap records decisions. It doesn't make them. When something hasn't been decided,
the roadmap says so.

## Repo rules come first

Before writing anything, look for the repository's own conventions: `AGENTS.md`,
`CLAUDE.md`, `CONTRIBUTING.md`, a docs or wiki schema, and any existing roadmap. They
decide where roadmaps go, what metadata they carry, how issues are linked, and which checks
to run. Where they conflict with this skill, they win. Follow an existing roadmap's format
rather than introducing a second one.

## Workflow

### 1. Pin down the ask

Work out which of these the user wants, because each needs a different amount of work:

- **New roadmap:** for a project, a feature, a migration, a test effort, and so on.
- **Update:** add or change items, re-order phases, record a decision.
- **Reconcile:** bring an existing roadmap in line with what has actually shipped.
- **Review:** read a roadmap and report gaps, without rewriting it.

### 2. Gather evidence before asking

Read what the project already knows: the relevant code and tests, open and recently closed
issues, merged and open PRs, existing docs, and the commit history for the area. Note what
exists today, what's already in progress, and what's been tried before.

Anything you can learn this way, don't ask the user.

### 3. Ask about the judgment calls

A roadmap is only as good as the decisions behind it, and most of those belong to the user.
Ask in short rounds rather than one long list, and explain why a question matters when the
trade-off isn't obvious. Good topics:

- **Goal:** what outcome makes this effort worth doing, and how will anyone know it's met?
- **Scope:** what's explicitly out? What must not change (APIs, data formats, behavior)?
- **Constraints:** deadlines, releases, people, budget, platforms.
- **Priorities:** if only half of this ships, which half?
- **Risk:** what's least understood, and should it be tackled first?
- **Done:** which tests, metrics, or reviews count as proof?

Offer a recommendation when the evidence supports one. Always let the user answer "not
decided yet". That answer goes in **Open decisions**, not in a guess.

For a small update, skip straight to writing. For a new roadmap, expect two or three
rounds.

### 4. Choose a shape

- **One file** (`ROADMAP.md`, or a name that fits the repo) for most roadmaps.
- **A directory** (`roadmaps/<slug>/README.md` plus supporting pages) only when the plan
  needs long supporting material, such as research notes, a design sketch, or test
  matrices, that would bury the work items. The main page still owns every work-item ID.

### 5. Write it

Use the [template](#template) below. Rules that keep it useful over time:

- **Stable IDs.** Give every work item an ID such as `R-001`. Never renumber, and never
  reuse an ID. Dropped work stays in the file, marked `dropped`, with the reason.
- **Phases have exit criteria.** Each phase says what is true when it's finished. Order
  phases by dependency first, then by risk, then by value.
- **Acceptance criteria are checkable.** Write criteria someone can verify: a test that
  passes, a command that succeeds, a measurable number. Avoid words like "robust",
  "improved", and "clean".
- **Dependencies are explicit.** List them by ID. Call out anything outside the team's
  control, such as another repo, a vendor, or a decision.
- **Link evidence by full URL** or repository-relative path, so links survive being copied
  elsewhere.
- **Describe the plan, not the meeting.** Present tense, current state. History goes in
  the changelog.

### 6. Check it

Before handing it over:

- [ ] Every item has an ID, a status, and at least one acceptance criterion.
- [ ] Every dependency points to an ID that exists.
- [ ] No phase depends on a later phase.
- [ ] Every undecided question is under **Open decisions**, not hidden in an item.
- [ ] Links resolve, and file paths exist.
- [ ] The repo's formatting and docs checks pass.
- [ ] The changelog has an entry for this change.

### 7. Report

Tell the user what you created or changed, the decisions you recorded, and the questions
that are still open.

## Reconciling a roadmap with reality

Roadmaps drift as work lands. To reconcile one:

1. List the items that aren't `done` or `dropped`.
2. For each one, look for merged PRs, closed issues, and code that satisfies its
   acceptance criteria.
3. Mark an item `done` only when every criterion is met. Link the evidence.
4. If the work shipped differently from the plan, update the item to say what actually
   happened, and note the difference in the changelog.
5. Add any new work you discover as new items with new IDs.
6. Summarize the changes for the user. Ask before dropping anything.

## Reviewing a roadmap

When asked only to review, don't rewrite. Report, most important first:

- goals or phases with no way to tell when they're done;
- items with vague acceptance criteria;
- missing or circular dependencies;
- decisions presented as settled that the evidence doesn't support;
- items the code or issue tracker shows are already done, or no longer relevant;
- missing risks: the hardest or least understood parts scheduled late.

## Template

```markdown
# <Project or feature> roadmap

**Goal:** <the outcome, in one or two sentences>
**Status:** <draft | active | complete | superseded>
**Last updated:** <YYYY-MM-DD>

## Context

Why this work matters now, what exists today, and links to the evidence.

## Scope

- **In:** …
- **Out:** …
- **Must not change:** …

## Status legend

| Status        | Meaning                                         |
| ------------- | ----------------------------------------------- |
| `planned`     | Agreed, not started                             |
| `in-progress` | Someone is working on it                        |
| `blocked`     | Waiting on a dependency or decision (say which) |
| `done`        | Every acceptance criterion met, with evidence   |
| `dropped`     | Not doing it (say why)                          |

## Phase 1: <name>

**Exit criteria:** <what is true when this phase is finished>

### R-001: <short title>

- **Status:** planned
- **Why:** <the problem this solves>
- **Acceptance criteria:**
  - [ ] <checkable statement>
- **Depends on:** <IDs, or "none">
- **Evidence:** <issue, PR, or file links>

## Phase 2: <name>

…

## Open decisions

| ID    | Question | Options | Blocks | Owner |
| ----- | -------- | ------- | ------ | ----- |
| D-001 | …        | …       | R-004  | …     |

## Risks

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |

## Changelog

- <YYYY-MM-DD>: <what changed and why>
```

Drop sections that don't apply. A small roadmap might be just a goal, one phase, and a
changelog.

## Don't

- Invent a decision because the roadmap looks incomplete without it.
- Pad the plan with generic items ("add documentation", "improve tests") that have no
  specific outcome.
- Renumber items, or delete dropped ones.
- Mark work `done` from a PR title alone without checking the criteria.
- Copy a roadmap's whole contents into issues, or the reverse. Link instead.
