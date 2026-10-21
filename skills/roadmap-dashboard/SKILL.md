---
name: roadmap-dashboard
description: Builds and maintains a status dashboard from the roadmap files in one or more repositories, showing what's completed, in progress, and not started, with an overview page, a page per repository, and a plain-English explanation of each work item. Use when asked to create a roadmap dashboard or progress report, refresh one, add or remove a repository from one, or show what a roadmap's items mean.
---

# Roadmap dashboard

A roadmap dashboard answers "where is each project, and what's left?" without opening
every roadmap file. It reads the roadmaps where they live, counts their work items by
status, and explains each item in a sentence. The roadmap files stay the source of truth:
the dashboard never edits them, and never shows a number they don't support.

## Repo rules come first

Before reading anything, check each repository's own conventions: `AGENTS.md`,
`CLAUDE.md`, `CONTRIBUTING.md`, and any index page for its roadmaps. They say where
roadmaps live, which branch is current, and what the statuses mean. Where they differ from
this skill, they win. Roadmaps written with the
[`generating-roadmaps`](../generating-roadmaps/SKILL.md) skill follow the format below.

## Finding the roadmaps

- Look in the places repos usually keep them: `ROADMAP.md`, a `ROADMAP/` folder with one
  file per release, `docs/`, and wiki or concept pages whose path contains `roadmap`.
  Search file paths for `roadmap` as well, since the root listing misses nested ones.
- Read from the branch the repo says is current, which isn't always the default one.
- Skip index pages, open-question lists, and pages with no work items. Tell the user
  which files you skipped and why.
- For a private repository, use the access the agent already has (the `gh` CLI, a git
  remote, or a browser session the user signed in to). Never ask the user to paste a token
  or password into the chat.
- Confirm the list of roadmaps with the user before the first build.

## Reading work items

Work items come in two shapes, and one repo can use both:

- **Sections**, as `generating-roadmaps` writes them: a heading such as
  `### R-001: <title>`, followed by a `- **Status:** <status>` line.
- **Table rows:** a row in a Markdown table whose header starts with `Id` and has a
  `Status` column.

IDs look like `R-001`, `ADV-01`, or `P0-04`. Skip open-decision and open-question tables
(IDs such as `D-001` or `OQ-01`).

Map each status to one of three groups. Show the original status too, so "blocked" isn't
lost inside "not started".

| Status in the file           | Group       |
| ---------------------------- | ----------- |
| `done`, `✅`                 | Completed   |
| `in-progress`, `in_progress` | In progress |
| `🟡` (partial)               | In progress |
| `planned`, `ready`, `⬜`     | Not started |
| `blocked`, `🚧`              | Not started |
| `❓` (undefined)             | Not started |
| `dropped`, `🚫` (retired)    | Not counted |

If a repo uses other statuses, ask the user how to group them rather than guessing.

- An item's phase is the nearest heading above it that isn't its own: the phase heading
  over an item's section, or the heading over its table. Items under a "Completed"
  heading keep the phase their ID prefix names.
- Item IDs can repeat across roadmaps in one repo. Key each item by repo, roadmap, and ID
  together.
- If a roadmap has its own summary table of counts, compare your counts with it and tell
  the user about any difference. Don't change either to make them match.
- If an item's notes say it's done but its status doesn't, keep the status and point out
  the mismatch.

## Explaining each item

Give every item a one- or two-sentence explanation in plain language, written from its
acceptance criteria or notes. Say what the item delivers, not how it's tested. Add
"Blocked on …" or "Partly done: …" where the file says so. Label the column as a summary,
so readers know the roadmap's own wording is in the file, and link each ID to its file.

## Building the dashboard

Keep the data apart from the page: one list of items, each with its repo, roadmap, phase,
ID, name, explanation, status, group, dependencies, done date, file link, and the date it
was read. Work out every count from that list, so adding or removing a repo changes only
the data.

The dashboard has:

- an **overview page** with totals for each group, a bar per repository, and a table of
  every roadmap with its progress;
- a **page per repository** with the same totals for that repo, progress by roadmap and by
  phase, and lists of its items in progress, not started, and completed, each with its
  explanation, a filter by roadmap, and a search box;
- the date the roadmaps were read, and a way to refresh.

If the agent has a dashboard or artifact tool, build it there. Otherwise write one
self-contained HTML file with the data inlined and no external scripts, and give the user
its path. A Markdown report with the same sections works where HTML can't be viewed.

## Refreshing

A dashboard over private repositories usually can't read them by itself. Make the refresh
control say how to refresh: what to ask the agent, or which command to run.

When asked to refresh:

1. Re-read every tracked roadmap, and search each repo again for new roadmap files.
2. Keep the explanations of items whose notes haven't changed, and write new ones only for
   new or changed items.
3. Replace the data and update the "read on" date.
4. Tell the user what changed: items that moved between groups, and items added or
   removed.

## Adding or removing a repository

- **Adding:** find its roadmaps and confirm them with the user, read and explain its
  items, and add them to the data. Its page should appear without changes to the page
  code.
- **Removing:** drop its items from the data. Don't delete anything in the repository
  itself.

## Before you finish

- [ ] Every count comes from the item list, and the list matches the roadmap files.
- [ ] Each item has a status, a group, an explanation, and a link to its file.
- [ ] Skipped files and count mismatches are reported to the user.
- [ ] The dashboard shows when the roadmaps were read and how to refresh it.
