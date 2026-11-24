# Prune

A plugin to help you cut wasteful agentic behaviors from your coding sessions.
Works with Claude Code, GitHub Copilot CLI, and Codex.

Prune reviews the visible session, a supplied transcript, or a workflow you
identify. It recommends up to three evidence-backed cuts while preserving
correctness, required checks, and user approvals. Changes to files or persistent
instructions require an explicit implementation request.

## What Prune checks

Prune looks for successful-but-redundant work as well as failing loops:

- **Repeated investigation:** reads, searches, or probes that answer no new
  question; broad exploration after the relevant file or decision is known.
- **Output overfetch:** whole files, unbounded logs, or unfiltered tool results
  when a range, symbol, or smaller result would answer the question.
- **Fragmented calls:** independent reads, requests, or related test selectors
  run separately when the tool supports batching.
- **Redundant verification:** passing checks repeated without relevant changes,
  a new failure, or an unresolved concern. Required reruns still belong.
- **Polling waste:** repeated agent-status reads with no new information,
  especially when completion notifications are available; rereading entire
  worker histories instead of new results.
- **Agent proliferation and duplication:** delegation whose setup exceeds its
  benefit, parent and worker duplicating an investigation, or nesting and fan-out
  with no justified contribution. Review depth, per-parent fan-out, and total
  spawns separately; concurrency alone does not bound total spend.
- **Context multiplication and ping-pong:** entire conversations or raw outputs
  passed to every worker, repeated coordination without new evidence or a
  decision, and duplicated instructions, plans, or recaps.
- **Repeated deliberation and scope drift:** visible planning or rediscovery
  that could reuse a verified procedure or skill; speculative abstractions,
  unrelated changes, and tooling outside the requested outcome.
- **Model overuse:** large reasoning models used for observable routine parsing,
  filtering, or transformations that deterministic tools could perform. Any
  recommendation to use a cheaper model must preserve task quality.

These are review targets, not automatic violations. A useful finding needs an
observed example, an explanation of the avoidable work, and a concrete
replacement or stopping condition. More agents or tool calls alone are not
evidence of waste.

## Scope and limits

**Prune diagnoses orchestration waste; it does not control execution.** It can
recommend depth, fan-out, or total-spawn budgets, event-driven waiting, smaller
worker briefs, and model-routing policies. It does not enforce budgets, spawn or
terminate agents, switch models, or alter host or harness settings.

Reviews use only the visible session, user-supplied transcripts, or identified
workflow files. Prune does not silently collect private session history. Missing
agent ancestry, completion events, input-state evidence, model identity, or usage
data must be reported as a limitation, not invented. Visible planning can be
reviewed; hidden reasoning cannot. The absence of an edit event does not prove
that inputs stayed unchanged.

Keep necessary investigation, required checks, failure details, security and
accessibility safeguards, and user approvals. Report at most three
high-confidence cuts; do not manufacture findings or token, timing, or cost
savings. Reusable-skill suggestions remain recommendations until the user
explicitly requests their creation or persistence.

## TokenEconomizer extension

The optional [TokenEconomizer fork](https://github.com/JayDJayG/TokenEconomizer)
now includes evidence normalization, the detector families above, agent graphs,
cache-aware cost reporting, labeled trace calibration, offline cost/quality
comparisons, and a disabled-by-default after-task reporter. All eleven runtime
deliveries were tested and merged separately into the fork's `main`.
Intent-dependent checks need supporting annotations; missing evidence remains
unassessable. Synthetic regression fixtures are not real-session validation.

The runtime is not bundled with this plugin, which remains instruction-only.
The [extension plan](docs/tokeneconomizer-extension.md) records the working
implemented scope, merged deliveries, validation, and eleven joint acceptance
scenarios. From a checkout of the fork (Python 3.10 or later):

```powershell
Set-Location -LiteralPath 'C:\git\TokenEconomizer'
python -m tokeneconomizer.prune review 'C:\sessions\events.jsonl' --format json
python -m tokeneconomizer.prune calibrate 'C:\sessions\calibration.json' --format json
python -m tokeneconomizer.prune compare 'C:\sessions\comparison.json' --format json
```

Supply the bounded report to the Prune skill as evidence. Review opens only
named inputs; calibration/comparison use explicitly supplied input manifests.
See the fork's [runtime guide](https://github.com/JayDJayG/TokenEconomizer/blob/main/docs/PRUNE.md)
for evidence schemas and optional `PruneReviewStage` usage. No live-plugin or
hook installation is needed, and diagnostics never change launch settings.

Runtime validation: **389 tests passed, 5 platform skips**. The fork has no
hosted CI checks; these are local results. Genuine-session calibration and
controlled cost/quality acceptance remain to be tested together. No real-world
savings are claimed.

## Install from a checkout

Run these commands from the repository root with a recent version of your CLI
that supports plugins. The plugin is instruction-only: no build, dependency
installation, API keys, hooks, or MCP servers are required.

### Claude Code

```powershell
claude --plugin-dir .
```

This loads Prune for the current session. Invoke:

```text
/prune:prune Review this session for avoidable investigation and redundant checks.
```

Older Claude Code releases can reject Windows paths when registering a local
marketplace. Direct loading avoids that registration step.

### GitHub Copilot CLI

```powershell
copilot plugin marketplace add .
copilot plugin install prune@prune
```

Start a new Copilot session and ask:

```text
Use the prune skill to review this session for wasteful agentic behavior.
```

Use `/skills` to inspect available skills. For development without installing,
use `copilot --plugin-dir .` instead.

### Codex

```powershell
codex plugin marketplace add .
codex plugin add prune@prune
```

Start a new Codex session, then invoke:

```text
$prune Review this session for avoidable investigation and redundant checks.
```

Use `/skills` to find the skill. Local plugin installs use a cached copy; after
editing the plugin, remove and add it again to refresh the installed payload.

### Install from GitHub

The plugin is available on the default branch. Claude Code can install it
persistently:

```powershell
claude plugin marketplace add JayDJayG/prune
claude plugin install prune@prune
```

For Copilot and Codex, replace `.` in the marketplace-add commands above with
`JayDJayG/prune`. The `prune@prune` identifier stays the same.

## Repository layout

```text
plugin.json                         Portable Agent Plugins manifest
.claude-plugin\plugin.json          Claude Code compatibility manifest
.claude-plugin\marketplace.json     Claude Code and Copilot marketplace
.codex-plugin\plugin.json           Codex compatibility metadata
.agents\plugins\marketplace.json    Codex marketplace
skills\prune\SKILL.md                Shared skill, loaded by all three clients
docs\tokeneconomizer-extension.md    Review-only extension implementation plan
tests\plugin.test.mjs                Package consistency and discovery checks
.github\workflows\validate.yml       Automated validation
```

The root manifest uses the Agent Plugins 1.0 format for Copilot and Codex.
Compatibility manifests point at the same `skills` directory; there are no
generated copies or platform-specific skill instructions to keep in sync.
The plugin is opt-in, not an always-on enforcement hook.

## Development

Node.js 22 or later is needed only for repository validation:

```powershell
npm test
```

No `npm install` is necessary. Tests check release metadata consistency, shared
skill discovery, and marketplace paths. When releasing, keep the version and
shared metadata aligned in `plugin.json`, both compatibility manifests, and
`package.json`.

Validate the Claude manifests with the CLI as well:

```powershell
claude plugin validate .\.claude-plugin\plugin.json
claude plugin validate .\.claude-plugin\marketplace.json
```

Packaging was informed by [Impeccable](https://github.com/pbakaus/impeccable)
and the official references for
[Claude Code](https://code.claude.com/docs/en/plugins-reference),
[Copilot CLI](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference),
and [Codex](https://developers.openai.com/plugins/build/plugins). Prune uses
one portable skill rather than a provider-specific build pipeline.

## License

[Apache-2.0](LICENSE).
