---
name: pr-review
description: "Code review rules for pull requests. Use when reviewing a PR or a diff, or re-reviewing a PR after new commits: what to flag, the severity bar, the comment format, and how to converge over review rounds instead of raising new minor issues every time."
---

# PR review

These rules are for any reviewer, human or agent (Copilot code review, Claude, and others).
The sister skill [`github`](../github/SKILL.md) covers the author's side: fixing comments,
replying, and asking for the next review. Where the repo's own review rules (`AGENTS.md`,
`CONTRIBUTING.md`, a style guide) conflict with this skill, the repo's rules win.

The goal of a review is to get a correct PR merged. It isn't to find something to say.
"No issues found" is a good outcome.

## The bar for a finding

Post a finding only if you can name a **realistic failure**: a real caller, input, or
setup, and the wrong result it produces. If you can't write that scenario in a sentence or
two, don't post it.

| Severity       | Use for                                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Blocking**   | Wrong results on a common path, security holes, data loss, a broken build or tests, a breaking change to a public API, or a clear break of a rule written down in the repo |
| **Should fix** | A real bug on a less common path, a missing test for new behavior, or docs or instructions that would lead a reader to do the wrong thing in a normal case                 |
| **Nit**        | Naming, wording, or small clarity fixes. Optional by definition. At most three per review, and only in the first round                                                     |

Don't post:

- Hypotheticals that need unrealistic input, a misconfigured environment, or an attacker
  who already has the access the attack would give them.
- Defensive code for a case no caller can reach ("consider adding a null check").
- Anything a formatter, linter, or type checker in the repo already enforces.
- Personal preference between two reasonable approaches.
- Performance concerns with no hot path or measurement behind them.
- Requests to widen the PR: features, refactors, or cleanups it didn't set out to do.
- Problems in code the PR didn't change, unless the PR makes them worse. If something
  serious is there anyway, mention it once, marked **pre-existing, not blocking**.

For docs, skills, and other instructions, ask one question: would a reader following this
text do the wrong thing in a normal case? Gaps for rare setups are nits at most. Don't ask
for every edge case to be spelled out.

## Converging over rounds

A PR should get quieter with each review, not noisier.

- **Round 1** (first review): the full diff, every severity, nits capped as above.
- **Round 2 and later** (new commits since your last review):
  - Review **only what changed since your last review**, and check whether your earlier
    findings were fixed.
  - Don't raise new findings on code you already reviewed and that hasn't changed. If you
    missed something there, post it only if it's **blocking**.
  - No nits.
  - Don't re-raise a finding the author answered with a reason, unless you have new
    evidence that the reason is wrong. Disagreement alone isn't new evidence.
- If nothing meets the bar, say so in one line and stop. Don't pad the review.

## Writing findings

- One issue per comment, anchored to the line it's about.
- Start with the severity: `Blocking:`, `Should fix:`, or `Nit:`.
- Then the failure scenario in one or two sentences, then the smallest fix that works.
- At most **five** findings per review, most severe first. If there are more, list the
  rest briefly in the summary. Merge duplicates into one comment that lists every place.
- Be specific and neutral. No praise padding, no hedged "you might want to consider".

## The summary

End with a short summary:

1. A verdict: **Approve**, **Approve with nits**, or **Changes requested** (only when
   there's at least one blocking finding).
2. Counts by severity.
3. On round 2 or later: which earlier findings are now fixed, and which are still open.

## Reviewing as an agent in a loop

When another agent is fixing your findings and asking you for the next review:

- Treat the author's replies as part of the review. "Fixed in abc1234" means check that
  commit. "Leaving as is, because…" means the finding is closed unless the reason is wrong.
- After three rounds, post only blocking findings, and say that the remaining items are
  the author's call.
