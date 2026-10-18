# Security policy

## Supported versions

This repository has no releases. Projects install skills from the `main` branch with
`npx skills add` and update them with `npx skills update`, so only the latest `main` is
supported. Fixes land on `main` and reach projects on their next update.

## What to report

These skills are instructions that coding agents follow, so a security problem here is
usually something a skill tells an agent to do. For example:

- An instruction that could make an agent expose secrets, credentials, or personal data.
- An instruction that could make an agent run destructive or unreviewed commands, or push
  or merge without the user's approval.
- An instruction that makes an agent more likely to follow injected instructions from
  untrusted content, such as PR comments, issues, or fetched pages.
- A secret, token, or personal data committed to this repository.

## How to report

Report privately through GitHub's
[private vulnerability reporting](https://github.com/lggarrison/agent-skills/security/advisories/new).
Don't open a public issue, pull request, or discussion for a security problem.

Include the skill and the passage involved, the agent you saw it with, and what it led the
agent to do.

## What to expect

- I'll acknowledge the report within a week.
- I'll tell you whether I can reproduce it and whether I'll fix it.
- I'll fix confirmed problems on `main` and publish an advisory crediting you, unless you'd
  rather not be named.

This is a personal project maintained in my own time, so there's no bug bounty.
