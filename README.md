# Prune

A plugin to help you cut wasteful agentic behaviors from your coding sessions.
Works with Claude Code, GitHub Copilot CLI, and Codex.

Prune reviews the visible session, a supplied transcript, or a workflow you
identify. It recommends up to three evidence-backed cuts while preserving
correctness, required checks, and user approvals. Changes to files or persistent
instructions require an explicit implementation request.

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

Once these files are committed and pushed to the default branch, Claude Code
can install the plugin persistently:

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
