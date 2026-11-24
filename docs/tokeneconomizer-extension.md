# TokenEconomizer extension plan

## Goal and boundary

Extend [TokenEconomizer](https://github.com/microsoft/TokenEconomizer) with
optional, evidence-backed Prune diagnostics that work on the first supplied
session. The extension observes and recommends; it does not manage execution.
Keep the existing Prune skill usable without Python, hooks, API keys, or the
extension.

This document records the delivered code and remaining joint real-session
acceptance, not measured real-world savings. The reviewed upstream baseline is commit
[`e7cc7598bd013bf71011ae49c27f6c3e14c22ac4`](https://github.com/microsoft/TokenEconomizer/tree/e7cc7598bd013bf71011ae49c27f6c3e14c22ac4),
reviewed on 2026-11-24.

No budget enforcement, agent spawning or termination, model switching, settings
changes, automatic skill persistence, or private-history collection belongs in
this extension. Host capabilities such as depth limits and event-driven waiting
are recommendations, not controls to implement.

## Repository and reuse strategy

Create a thin upstream-tracking fork; do not replace this repository with the
fork. Keep Prune-specific code isolated in `tokeneconomizer.prune`
namespace and contribute generic parser or accounting fixes upstream. Retain the
upstream MIT license and copyright notices; distinguish any reused Prune material
covered by this repository's Apache-2.0 license.

Reuse the [trace readers](https://github.com/microsoft/TokenEconomizer/blob/e7cc7598bd013bf71011ae49c27f6c3e14c22ac4/tokeneconomizer/trace/__init__.py),
`ledger`, and `pricing`. Preserve the existing
[`DomainAdapter` and `Stage` boundaries](https://github.com/microsoft/TokenEconomizer/blob/e7cc7598bd013bf71011ae49c27f6c3e14c22ac4/docs/ARCHITECTURE.md).
Do not reuse `LiveController`, deny-list application, or loop-guard redirects as
the diagnostics execution path. Their live behavior is not review-only.

Start with a standalone, explicit-input review command. Installing or using
Prune diagnostics must not install or enable TokenEconomizer's existing live
hooks. Users who separately enable those mechanisms retain their existing
behavior; the Prune path must not toggle them.

## Plan review adjustments

- Bring the standalone command and reporting forward so the first detectors can
  be tested without any live plugin initialization. The `te prune` dispatch must
  also bypass host-state discovery and state permission changes.
- Separate input format from the invoking agent. Use `--input-host` for review
  inputs; a host adapter's existing `te --host` argument must not constrain them.
- Do not infer historical input state from the current checkout. Duplicate
  investigation and verification need contemporaneous fingerprints and purpose
  evidence; overfetch and model-use judgments need task context. Implemented
  checks abstain when their required evidence is absent.
- Require explicit notification capability before classifying running-state
  repeats as waste. Unparsed tool activity must break comparisons and appear in
  coverage limits, not be mistaken for an absence of intervening work.

## Implementation progress (2026-11-24)

The fork exists at [JayDJayG/TokenEconomizer](https://github.com/JayDJayG/TokenEconomizer).
Its development checkout is `C:\git\TokenEconomizer`, with `origin` pointing to
the fork and `upstream` to Microsoft. The implementation is published on the
fork's `main`. Each delivery had a new branch, local validation, a commit/push,
and a confirmed merge before the next branch was created:

1. **Evidence foundation:** exact-byte digests, source lines, native timestamps,
   actor/model/usage enrichment, digest-bound optional annotations.
   [JayDJayG/TokenEconomizer#1](https://github.com/JayDJayG/TokenEconomizer/pull/1).
2. **Duplicate investigation:** equivalent successful reads/searches with
   contemporaneous complete input-state and purpose evidence.
   [JayDJayG/TokenEconomizer#2](https://github.com/JayDJayG/TokenEconomizer/pull/2).
3. **Output overfetch:** measured avoidable bytes with explicit sufficient
   recorded-result line selections, never size-only judgments.
   [JayDJayG/TokenEconomizer#3](https://github.com/JayDJayG/TokenEconomizer/pull/3).
4. **Redundant verification:** deterministic unchanged passing checks while
   preserving required reruns, failures, selectors and unresolved concerns.
   [JayDJayG/TokenEconomizer#4](https://github.com/JayDJayG/TokenEconomizer/pull/4).
5. **Agent structure:** task-scoped graph lower bounds, supplied budget
   observations and evidence-backed duplicate delegation.
   [JayDJayG/TokenEconomizer#5](https://github.com/JayDJayG/TokenEconomizer/pull/5).
6. **Context/communication:** verified unnecessary verbatim forwarding and
   unchanged agent-to-agent ping-pong with conservative ordering.
   [JayDJayG/TokenEconomizer#6](https://github.com/JayDJayG/TokenEconomizer/pull/6).
7. **Workflow patterns:** supported batching, lexical scope drift, repeated
   visible planning and reusable-procedure candidates.
   [JayDJayG/TokenEconomizer#7](https://github.com/JayDJayG/TokenEconomizer/pull/7).
8. **Models/costs:** approved routing-policy observations, cache-aware
   estimates, explicit billing, overlap guards and worker/review overhead.
   [JayDJayG/TokenEconomizer#8](https://github.com/JayDJayG/TokenEconomizer/pull/8).
9. **Trace calibration:** labeled replay, all-pattern counts, abstention
   metrics and synthetic host-format regression vectors.
   [JayDJayG/TokenEconomizer#9](https://github.com/JayDJayG/TokenEconomizer/pull/9).
10. **Cost/quality evaluation:** explicit paired-run manifests, consistent
    monetary bases, retained failures and measured local replay overhead.
    [JayDJayG/TokenEconomizer#10](https://github.com/JayDJayG/TokenEconomizer/pull/10).
11. **Optional integration:** disabled-by-default `PruneReviewStage`, explicit
    absolute inputs, bounded caller-owned reports and unchanged launch hooks.
    [JayDJayG/TokenEconomizer#11](https://github.com/JayDJayG/TokenEconomizer/pull/11).

`python -m tokeneconomizer.prune`, `te-prune`, and `te prune` support `review`,
`calibrate`, and `compare`. The invoking host does not select the input format;
use optional `--input-host` for review or per-case manifest fields. No live
state discovery, hooks, model calls, or settings changes occur on these paths.
New output files are created exclusively, never overwritten. Reports retain at
most three cuts and cap detailed source/usage/graph/case metadata, while all
supplied inputs still contribute to aggregate detection and accounting.

Polling requires structured status results and precision-safe non-blocking
requests; running-state repeats also require explicit notification support.
Intent-dependent checks require supplied purpose, historical state, sufficiency,
ancestry or approved-quality evidence. An annotation proves which transcript
was reviewed, not the independent truth of the caller's assertions.

Final runtime validation: **389 passed, 5 existing platform skips** across the
Prune suites and affected parser/package/config/launcher/ledger/pricing checks.
Read-only and no-network/process/live-state behavior is tested. No dependencies
were added. This fork reports no hosted CI checks; these are local results.

The untouched full upstream baseline had 1,768 passes, 42 skips, and 38
pre-existing failures on this Windows environment. Most are POSIX/WSL/path
assumptions in the experiment tests; one concerns an existing Pi launcher on
PATH. Those unrelated issues were recorded, not changed.

All eleven implementation deliveries are merged. Genuine sanitized sessions
have not been supplied, so real-session calibration and controlled cost/quality
acceptance remain open. Checked-in vectors are explicitly synthetic, not actual
user captures; replay cannot establish real savings or causal improvements.
The portable Prune plugin remains instruction-only, with its existing validation
and no mandatory Python runtime or hooks.

## Implementation phases

### 1. Establish the fork and baseline

Fork upstream at a recorded commit, configure an upstream remote, and run its
existing tests before adding diagnostics. Keep the core standard-library-only
and preserve existing plugin entry points and public interfaces.

Deliverable: a recorded baseline, a clear boundary for Prune-owned code, and
retained license notices. See the progress section for the established fork and
baseline limitations.

### 2. Normalize explicitly supplied evidence

Build a read-only pipeline:

```text
explicit transcript paths
  -> upstream readers and host-specific metadata
  -> normalized review events and capability coverage
  -> deterministic checks
  -> deduplicated, ranked findings and evidence limitations
```

Start with the three clients Prune already supports: Claude Code, Copilot CLI,
and Codex. Record event and source references, tool calls and results, timestamps
where available, and optional agent ancestry, completion state, input
fingerprints, model identity, and token/cache usage.

The existing normalized tool-call trajectory does not provide every diagnostic
field. Supplement it from explicit host metadata without changing its public
shape. Missing fields stay unknown; never fabricate ancestry from timing or
infer unchanged inputs merely from the absence of edits.

Deliverable: representative synthetic fixtures for each supported format, a
capability report, unsupported-activity limits and malformed-input errors. No automatic discovery
of unrelated sessions, network requests, or paid model calls.

### 3. Ship high-confidence, first-session checks

Implement duplicate reads/searches, output overfetch, redundant verification,
and avoidable agent-status polling first. Use small deterministic checks over
the supplied evidence, not a new model judging every call or a cross-session
learning warm-up.

Duplicate-work and verification findings require equivalent requests and
relevant input-state evidence. For checks, account for selectors, source and test
changes, configuration, dependencies, and environment; preserve explicit reruns,
new failures, and unresolved concerns. Do not execute a test to diagnose a rerun.

Polling checks distinguish repeated unchanged status reads from completion
notifications, necessary fallback waiting, and useful retrieval of new results.
Output-size checks need evidence that a smaller result could answer the question;
size alone is not a finding. Preserve failure details and references to full
evidence instead of silently discarding it.

Deliverable: each finding contains its observed evidence, why the work was
avoidable, a replacement or stopping condition, and required safeguards.

### 4. Add orchestration and workflow diagnostics

Build an agent graph only where explicit relationships exist. Review depth,
per-parent fan-out, total spawns, duplicated investigation, worker context
multiplication, and unproductive agent-to-agent exchanges. Compare against task
needs, useful outputs, and any supplied budget, not a universal agent-count cap.

Then cover fragmented calls, exploration and scope drift, repeated visible
planning, candidate procedures for reusable skills, and unnecessary narrative
or context duplication. Treat intent-dependent conclusions conservatively.

Model-use recommendations require model identity and observable task evidence;
token volume alone does not prove a reasoning model was unnecessary. Missing
metadata makes a check unassessable, not passed. Recommend host-level budgets,
waiting, and routing without changing any of them.

Deliverable: graph and workflow findings with explicit coverage limits,
including cases where independent parallelism or coordination is justified.

### 5. Integrate concise, optional reporting

Add a `te prune review` command in the fork that reads only named inputs
and returns JSON or Markdown. Persist reports only to an explicitly requested
output path. Rank and deduplicate overlapping checks into at most three
high-confidence cuts, with capability limits reported separately.

Document how the existing Prune skill can use the optional report without
requiring the runtime for ordinary reviews. Keep worker briefs and model-facing
evidence bounded; do not pass the entire transcript to another agent. No reviewer
subagents or model side calls are needed for the initial implementation.

The explicitly enabled `PruneReviewStage.after_task` integration reports only;
its default is disabled and all task-launch hooks remain unchanged.

Deliverable: a review-only command and a portable workflow that still works when
the extension is absent.

### 6. Validate correctness, overhead, and usefulness

Add focused regression fixtures for true waste, justified repetition or
parallelism, required reruns, missing metadata, and malformed traces. Verify that
reviews do not spawn agents, call models, alter settings or budgets, persist
skills, or read inputs outside the supplied scope.

Run targeted new tests plus upstream compatibility tests. Keep this repository's
existing `npm test` checks passing; do not make runtime dependencies mandatory
for the instruction-only package.

Offline trace replay measures detection quality and review overhead, not savings
from unchanged historical behavior. Use controlled task comparisons with and
without following the recommendations to evaluate cost and task success. Include
all worker and review overhead, account for cache pricing, and avoid double
counting child usage already included in parent totals.

Separate measured usage, priced estimates, and actual billing. Leave unsupported
cost fields unavailable; do not advertise savings from token counts alone.

Deliverable: evidence-backed findings, acceptable false-positive behavior, and
measured review overhead without weakened correctness or approvals.

## Joint acceptance scenarios

Next, test these eleven scenario groups together using explicitly supplied,
sanitized real exports. Keep recordings local and out of git; redact credentials
and private content before sharing. Preserve structural fields, call IDs,
timelines, relationships, outcomes and usage; regenerate transcript SHA-256
bindings after redaction. Never reconstruct historical state from today's
checkout or fabricate missing annotations.

1. **Evidence and polling:** Claude/Copilot/Codex exports, repeated completed
   retrieval and unchanged running polls; preserve blocking waits, progress,
   new prompts, missing outcomes and hosts without notifications.
2. **Reads/searches:** unchanged equivalent investigation versus changed input,
   a new question, overlap or required rereads.
3. **Overfetch:** a genuinely sufficient smaller selection versus large useful
   output, missing sufficiency evidence and failures whose details must remain.
4. **Verification:** identical passing deterministic checks versus required
   reruns, changed selectors/environment, fresh failures and unresolved concerns.
5. **Agents:** nested depth/fan-out/total-spawn observations and duplicated
   completed investigation versus justified independent workers or missing ancestry.
6. **Context/communication:** whole-history/raw-output copies with proven
   smaller-brief sufficiency, and unchanged ping-pong versus useful coordination.
7. **Workflows:** serial independent calls, scope drift, repeated visible plans
   and recurring complete procedures versus dependencies, new progress or hidden reasoning.
8. **Models/accounting:** billed model versus approved policy, cache breakdowns,
   mixed-model USD, unknown prices, duplicate receipts and parent/child overlap.
9. **Calibration:** label real positive, negative and unassessable examples for
   each supported pattern; inspect false positives/negatives and abstentions,
   including patterns outside the three-cut display.
10. **Controlled evaluation:** matched baseline/candidate tasks with all
    execution/worker/paid-review/legacy costs and required checks/approvals;
    retain failures and reject cheaper failures, mismatched controls or missing costs.
11. **Optional reporter:** disabled no-op and enabled explicit absolute inputs,
    unchanged launch settings/task outcomes, bounded reports and visible errors
    without directory discovery or stale success.

Use `calibrate` to check detection labels and `compare` for recorded paired-run
cost/quality differences. Their JSON manifests explicitly name inputs; ordinary
report references never grant access. Model-facing output remains bounded, and
later paid report ingestion must be recorded separately. The real-session
acceptance and savings claims stay unverified until these joint checks succeed.
