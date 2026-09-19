# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues on **`devjamezzz/tarot`** (the deployed baseline). Use the `gh` CLI for all operations.

**Always pass `--repo devjamezzz/tarot`.** This clone has two remotes — `origin` (`reyatelehealth2026-crypto/mystic-main`) and `tarot` (`devjamezzz/tarot`) — so don't let `gh` infer the repo from `git remote`.

## Conventions

- **Create an issue**: `gh issue create --repo devjamezzz/tarot --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --repo devjamezzz/tarot --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --repo devjamezzz/tarot --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --repo devjamezzz/tarot --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --repo devjamezzz/tarot --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --repo devjamezzz/tarot --comment "..."`

## When a skill says "publish to the issue tracker"

Create a GitHub issue on `devjamezzz/tarot`.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --repo devjamezzz/tarot --comments`.
