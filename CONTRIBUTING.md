# Contributing to Resumy

Thank you for contributing.

This guide explains how to contribute safely and consistently.

## Branch Policy (Required)

All contribution work must go through the dev branch.

- Do not open pull requests directly to main.
- Do not push changes directly to main.
- Create your feature/fix branch from dev, then open a PR targeting dev.

Recommended flow:

```bash
# after forking and cloning
git fetch origin
git checkout dev
git pull origin dev

# create your working branch from dev
git checkout -b feat/short-description
```

When your work is ready:

```bash
git add .
git commit -m "feat: short description"
git push origin feat/short-description
```

Then open a Pull Request with:

- Base branch: dev
- Compare branch: your feature branch

If a maintainer asks for direct push access, push only to dev unless explicitly instructed otherwise.

## Pull Request Requirements

Every PR should include a detailed description.

Use this structure:

1. What changed
2. Why it changed
3. How it was implemented
4. How it was tested
5. Any migration or environment impact

For UI changes, include visuals when possible:

- Before/after screenshots, or
- A short GIF/video

If visuals are not possible, explain why in the PR body.

## Local Quality Checks

Before opening your PR, run:

```bash
pnpm lint
pnpm type-check
pnpm build
```

If a command fails due to unrelated repository issues, mention that in the PR.

## Coding Expectations

- Follow existing TypeScript, React, and Next.js patterns
- Keep changes focused and minimal
- Avoid unrelated refactors in the same PR
- Update docs when behavior/setup changes

## Commit Message Style

Use clear commit messages. Conventional-style prefixes are preferred:

- feat: new feature
- fix: bug fix
- docs: documentation only
- refactor: code restructure without behavior change
- chore: maintenance tasks

## Reporting Bugs and Requesting Features

Open a GitHub issue with:

- Clear title and summary
- Reproduction steps (for bugs)
- Expected vs actual behavior
- Screenshots/logs if relevant

## Code of Conduct

By participating, you agree to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
