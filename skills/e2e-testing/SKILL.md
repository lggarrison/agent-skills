---
name: e2e-testing
description: Writes, debugs, and reviews end-to-end tests that drive a whole app through a browser, a CLI, or an API the way a user would. Covers choosing which journeys deserve an e2e test, stable locators, waiting on conditions instead of time, isolated test data, debugging failures from traces, and fixing flaky tests at the cause. Examples use Playwright. Use when adding or changing an e2e test, an e2e test fails or is flaky in CI, or reviewing e2e tests in a diff.
---

# End-to-end testing

An end-to-end test runs the real app, built and started the way users get it, and drives it
from the outside: a browser clicking through pages, a shell running a CLI, or a client
calling an API. It catches what unit tests can't: wiring, configuration, routing, and the
seams between parts. It's also the slowest and most fragile kind of test, so every one has
to earn its place and be written to give the same answer every run.

The sister skill [`unit-testing`](../unit-testing/SKILL.md) covers tests of single units.
When a behavior can be checked at either level, check it with a unit test.

## Repo rules come first

Use the repository's e2e framework, config, folder, fixtures, and scripts. Read the
existing tests and the config (`playwright.config.*`, `cypress.config.*`, and so on)
before writing one, and match them. `AGENTS.md`, `CONTRIBUTING.md`, and the package
scripts say how e2e tests are run and against what. Where they conflict with this skill,
they win. Examples here use Playwright. Apply the same rules with the repo's tool.

## What deserves an e2e test

- **Critical journeys:** sign up, sign in, the core task the product exists for, checkout,
  and anything that has broken in production before.
- **Integration points:** a page that needs the real backend, auth, or routing to work.
- **One happy path per journey,** plus the failures a user would actually hit (a wrong
  password, a declined payment).

Push everything else down to unit tests: every validation rule, every formatting case,
every branch of a calculation. An e2e suite that tries to cover all cases becomes too slow
to run and too flaky to trust.

## Locators

Find elements the way a user does, so tests survive markup and style changes.

- **Prefer, in order:** role and accessible name (`getByRole('button', { name: 'Save' })`),
  label (`getByLabel('Email')`), visible text, then a test ID (`getByTestId`) when nothing
  user-facing is stable.
- **Avoid:** CSS classes, XPath, `nth-child`, and element positions. They break when the
  layout changes and say nothing about what the user sees.
- If an element can't be found by role or label, that's often an accessibility bug. Say
  so rather than reaching for a brittle selector.

## Waiting

Never wait a fixed time. `sleep`, `waitForTimeout`, and `setTimeout` are too short on a
slow CI machine and waste time on a fast one.

- Use assertions that retry until they pass or time out:
  `await expect(page.getByRole('alert')).toHaveText('Saved')`.
- Wait for the condition the user would wait for: an element visible, a URL changed, a
  response received (`page.waitForResponse`), a file written.
- Don't raise timeouts to fix a failure. If something legitimately takes long, raise the
  timeout for that one step and say why.
- Don't force actions past the framework's checks (`{ force: true }`). If a click needs
  forcing, something is covering the element or it isn't ready, and a real user would hit
  the same problem.

## Test data and isolation

- **Each test sets up its own state** and passes alone, in any order, and in parallel
  with the others. No test depends on another having run first.
- **Make data unique per test** (a generated email or ID), so parallel workers and
  retries don't collide.
- **Set up through the back door.** Create users and records through an API, a seed
  script, or a fixture, not by clicking through the UI. Only the journey under test goes
  through the UI.
- **Sign in once and reuse it.** Save the authenticated state in a setup step
  (Playwright's `storageState`) instead of logging in through the form in every test.
- **Fake only what you don't own.** Stub third-party services (payments, email, maps) at
  the network boundary with `page.route()` or a local fake. Keep your own frontend,
  backend, and database real, or it isn't an end-to-end test.

## CLI and API end-to-end tests

The same rules apply without a browser:

- Run the built artifact, the same way users run it, not the source through a test-only
  entry point.
- Give each test a fresh temp directory as its working directory, and point `HOME`,
  config paths, and caches into it, so tests don't read or change the developer's real
  files.
- Assert the exit code, stdout, stderr, and the files created, separately. A test that only
  checks "it didn't throw" misses wrong output.
- Strip or freeze what changes between runs (timestamps, temp paths, durations) before
  comparing output.

## When a test fails

Read the evidence before changing anything.

1. **Get the artifacts.** Turn on traces, screenshots, and video for failures
   (Playwright: `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`), and open the
   trace from the CI run (`npx playwright show-trace <trace.zip>`). The trace shows the
   page, network, and console at each step.
2. **Decide whose bug it is.** If the app is wrong, fix the app; the test did its job. If
   the test is wrong, fix the test. If the environment is wrong (a service down, a port in
   use), fix the setup.
3. **Reproduce it** with the same command, browser, and settings CI uses, including
   headless mode and worker count.
4. **For a flaky test, find the race.** The usual causes: a fixed wait, acting before
   the page is ready, data shared with another test, or an animation or toast covering
   the element. Fix that cause, then run the test many times in a row
   (`npx playwright test <file> --repeat-each=20 --retries=0`) before calling it fixed.

CI retries can keep a pipeline green, but a test that passed only on retry is still
failing. Treat "flaky" in a report as a bug to fix, not a status. Never skip, delete, or
quarantine a test to get green without the user's agreement, and never loosen an
assertion to make it pass.

## Checklist

Before handing over e2e tests, or when reviewing them:

- [ ] The journey needs an e2e test. Cases a unit test can check are unit tests.
- [ ] Locators use role, label, text, or a test ID. No CSS chains or XPath.
- [ ] No fixed waits, forced actions, or raised global timeouts.
- [ ] Each test creates its own unique data and passes alone and in parallel.
- [ ] Only third-party services are stubbed.
- [ ] Failures leave a trace or screenshot in CI.
- [ ] The new or fixed test passed many times in a row with retries off.
