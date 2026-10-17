---
name: wiki
description: Sets up and maintains a Markdown wiki inside a repository that agents keep current, in the "LLM wiki" style. Use when asked to create a project wiki, add a source to it, answer a question from it, update it after a code change, check it for broken links or stale pages, or reorganize it.
---

# Wiki

A project wiki is a folder of Markdown pages that explains the project: what its parts do,
why it works the way it does, and where the evidence is. People read it. Agents maintain it.
Each new source, question, or code change should leave it a little more complete and
accurate.

This follows the "LLM wiki" pattern: keep raw sources, write pages that summarize and
connect them, and keep an index and a log so the whole thing stays navigable.

## Repo rules come first

If the repository already has a wiki, read its schema or instructions file (often
`wiki/README.md`, `wiki/AGENTS.md`, or `wiki/schema.md`) before changing anything. Its
layout, metadata, link style, and commands win over the defaults here. Use the repo's wiki
scripts when they exist, and don't hand-edit files they generate.

## The parts

| Part        | What it is                                                        | Who edits it                   |
| ----------- | ----------------------------------------------------------------- | ------------------------------ |
| **Sources** | Copies of raw material: issues, PRs, articles, notes, transcripts | Added once, then never changed |
| **Pages**   | Written explanations of topics, citing sources and code           | Updated whenever facts change  |
| **Schema**  | One file with the wiki's rules: layout, metadata, conventions     | Changed deliberately           |
| **Index**   | A list of every page with a one-line summary                      | Regenerated, or kept complete  |
| **Log**     | A dated, append-only list of changes to the wiki                  | One entry per operation        |

A default layout, for a new wiki:

```text
wiki/
├── README.md     # what the wiki is and how to use it
├── schema.md     # the rules (the one place they're written down)
├── index.md      # every page, one line each
├── log.md        # what changed, newest last
├── pages/        # topic pages
└── sources/      # raw material, unchanged after it's added
```

A small project can stop there. Add subfolders only when there are enough pages that
people can't find things.

## Who's right when sources disagree

Write down, in the schema, which source wins for each kind of claim. For most software
projects:

- **How the code behaves today:** the code and its tests.
- **What was decided, and why:** the decision record, issue, or PR where it was decided.
- **What's planned or in progress:** the issue tracker or roadmap.

When a page and its authority disagree, fix the page, and keep a short note of what changed
if the old belief is worth remembering. Never edit a source to make it agree.

## Pages

- **One topic per page,** with a clear title. Update the existing page rather than adding a
  near-duplicate.
- **Cite what you claim.** Link to the source or name the file. A reader should be able to
  check any important statement.
- **Use relative Markdown links** (`[Parser](parser.md)`) unless the wiki already uses
  another style.
- **Keep frontmatter small.** A useful minimum:

  ```yaml
  ---
  title: Parser
  summary: How input files are read and validated.
  sources: [sources/issue-42.md]
  code: [src/parser.ts]
  updated: 2026-01-31
  ---
  ```

  Add fields only when a person or a script will use them.

- **Every page is reachable** from the index and from at least one related page.

## Operations

### Set up a new wiki

1. Look at what docs already exist and who reads them. Don't duplicate a working docs site.
2. Propose the layout and schema to the user, and agree on it before writing pages.
3. Create `README.md`, `schema.md`, `index.md`, and `log.md`.
4. Write a few pages for the most important parts of the project, then stop and check with
   the user before filling in the rest.
5. Point the repo's agent instructions (`AGENTS.md`, `CLAUDE.md`) at the schema, rather
   than copying the rules into them.

### Add a source

1. Save the raw material under `sources/`, with where it came from and when.
2. Read all of it.
3. Find every existing page it affects, and update them. Create a new page only for a topic
   that has none.
4. Note anything in it that contradicts current pages, and resolve it using the authority
   rules.
5. Update the index and add a log entry.

Saving a source without updating any pages isn't finished. The pages are what people read.

### Answer a question

1. Start from the index, then search page titles and text.
2. Read the relevant pages, and check important claims against their sources or the code.
3. Answer with links to the pages and evidence you used. Say where they disagree or where
   the wiki has no answer.
4. If the answer is new and likely to be asked again, offer to add it to the wiki.

### Update after a code change

When a change alters how something works:

1. Search the wiki for the files, functions, and terms the change touched.
2. Update every affected page in the same PR as the code change.
3. Update the index if titles or summaries changed, and add a log entry.

### Check the wiki's health

Look for:

- broken links, and code paths that no longer exist;
- pages with no inbound links;
- duplicate pages on the same topic;
- sources that no page cites;
- pages that disagree with each other or with the code;
- an index that's missing pages or lists deleted ones.

Fix mechanical problems, such as links and the index, directly. Report judgment calls,
such as merging pages or deciding which claim is right, to the user.

## Log entries

Add one entry per operation, at the end of `log.md`:

```markdown
## 2026-01-31 14:05 UTC: ingest | Issue 42, empty input lines

Added the issue as a source and updated the parser page's validation section.
```

Always include the time and timezone so entries on the same day stay in order.

## Don't

- Edit a source after adding it.
- Restructure or rename large parts of the wiki without asking.
- Delete pages because they're outdated. Mark them outdated and link to what replaced them.
- Write the same rules in several places. The schema is the one copy.
- Treat the wiki as more authoritative than the code it describes.
- Write to an external system (Confluence, Notion, an issue tracker) without the user's
  approval.
