---
name: unit-testing
description: Writes, fixes, and reviews unit tests that check behavior, fail when the code is wrong, and give the same result on every run. Covers proving a test can fail, test-first bug fixes, what to mock, removing nondeterminism, and fixing a failing test without weakening it. Use when adding or changing code that needs tests, fixing a bug, a unit test is failing or flaky, or reviewing tests in a diff.
---

# Unit testing

A unit test exists to fail when the code is wrong. One that passes no matter what the code
does is worse than none, because it tells the next person the code is covered. Everything
here serves two properties: the test fails for a real bug, and it gives the same answer on
every run.

The sister skill [`e2e-testing`](../e2e-testing/SKILL.md) covers tests that drive the
whole system through a browser, a CLI, or an API. When a behavior can be checked at either
level, check it here. Unit tests are faster, more precise, and less flaky.

## Repo rules come first

Use the repository's test runner, file layout, naming, helpers, and fixtures. Read a few
existing tests near the code before writing one, and match them. `AGENTS.md`,
`CONTRIBUTING.md`, and the package scripts say how tests are run. Where they conflict with
this skill, they win. Don't add a second test framework or assertion library.

## What to test

Test behavior through the unit's public interface: given these inputs, it returns this,
throws that, or produces this side effect at a boundary. Don't test private helpers
directly, and don't assert on internal call order or call counts unless the call is itself
the behavior (a request sent, a message published).

For each behavior, think through the cases that tend to break:

- empty, one, and many;
- the boundaries of every range: zero, negatives, the maximum, off by one;
- invalid input and every error path the code handles on purpose;
- inputs that look the same but aren't: `null` and missing, `0` and `""`, Unicode,
  whitespace, time zones.

Write the cases the code actually handles or should handle. Don't pad the suite to raise a
coverage number.

## How to write one

- **One behavior per test,** named for that behavior: `rejects an expired token`, not
  `test validate 3`. A failure message should say what broke without opening the file.
- **Arrange, act, assert.** Build inputs in the test, or with a helper whose name says
  what it builds, so a reader sees the important values without jumping elsewhere.
- **Assert the exact result.** Check the value, not that something is truthy. Check an
  error's type or message, not only that something was thrown.
- **Await everything async.** A test that starts a promise and doesn't await it, or
  asserts inside a callback that never runs, passes without checking anything.
- **No logic in tests.** No loops or conditionals that decide what to assert. Use the
  runner's parameterized tests (`test.each`, `@pytest.mark.parametrize`, table tests)
  for many cases.

## Prove it can fail

Before trusting a new test, see it fail for the right reason:

- **Bug fix:** write the test first, run it against the unfixed code, and confirm it fails
  with the bug's symptom. Then fix the code and watch it pass.
- **New code:** break the code on purpose (flip a condition, return early, change a
  constant), run the test, confirm it fails, then undo the change.

If the test still passes with the code broken, it isn't testing that code. Fix the test.

## Mocks and fakes

Replace things at the edges of the system, not inside it:

- **Replace:** the network, the clock, randomness, the file system when it's slow or
  shared, and third-party services.
- **Keep real:** the unit under test, and the code it calls inside the same module or
  package. Mocking those tests the mock.

Prefer a small fake (an in-memory store, a fixed clock) over a mock that scripts every
call. Where the code reads the time, a random value, or the environment, pass it in or
use the runner's fake timers, rather than patching globals ad hoc.

## Same answer every run

A test that sometimes fails costs everyone time and teaches people to ignore red builds.
Remove the usual causes:

- **Time:** freeze the clock, and set the time zone and locale when output depends on them.
- **Randomness:** seed it, or inject the source.
- **Order:** don't depend on the order of tests, of hash or set iteration, or of
  concurrent work. Sort before comparing when order isn't the behavior.
- **Shared state:** reset globals, singletons, module caches, environment variables, and
  temp files after every test. Each test must pass alone and in any order.
- **Real I/O:** no real network. Use a fresh temp directory per test for file work.
- **Waiting:** never `sleep` to wait for async work. Await it, or advance fake timers.

To check a fix for a flaky test, run that test many times in a row, and in random order if
the runner supports it, before calling it fixed.

## When a test fails

Find out which is wrong, the code or the test, before changing either.

- If the code is wrong, fix the code. The test did its job.
- If the test is wrong (it encodes a mistaken expectation, or the behavior changed on
  purpose), change the test, and say in the commit why the old expectation no longer
  holds.
- Never get to green by deleting or skipping a test, loosening an assertion, catching the
  error, or copying the actual output into the expected value without checking it. Delete
  a test only when the behavior it checks was removed on purpose.
- Snapshot updates get the same care: read the snapshot diff, and accept it only when
  every change is intended.

## Checklist

Before handing over tests, or when reviewing them:

- [ ] Each new test was seen to fail, against the bug or a deliberate break.
- [ ] Tests check behavior through the public interface, not internals.
- [ ] Assertions are exact, and every async call is awaited.
- [ ] Only boundaries are mocked.
- [ ] No real time, randomness, network, or shared state. Each test passes alone.
- [ ] No test was skipped, deleted, or weakened to get green.
- [ ] The single test, then the whole suite, pass with the repo's own command.
