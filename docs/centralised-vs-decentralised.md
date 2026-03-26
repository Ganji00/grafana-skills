# grafana/skills: Governance Model — Design Document

| Field | Value |
|---|---|
| **Author(s)** | |
| **Created** | 2026-03-25 |
| **Status** | Draft |
| **Reviewer(s)** | |
| **Informed** | Community Team, Developer Experience, Plugin Tools, grafanacloud-skills maintainers |
| **Delivery Plan** | TBD based on consensus |

---

## Background

### Why this question is being asked now

This came out of a `#licensing` Slack thread where someone asked whether a skill from an internal repo could be made public for a community meetup talk. That surfaced three things happening in parallel:

1. **Community demand already exists.** Searching for `grafana` on [skills.sh](https://skills.sh/?q=grafana) shows active interest from developers looking for Grafana-specific agent skills.
2. **Multiple repos are moving toward publishing skills independently.** `grafana/skills` was bootstrapped. `grafanacloud-skills` is preparing to publish. `grafana/ai-marketplace` is already live. Each is a reasonable response to real demand — and each is a separate install command with separate conventions.
3. **The consolidation question came up immediately.** The answer was _"we should!"_ — but no agreed model exists yet.

This doc exists to resolve that before the fragmentation becomes hard to undo.

### The three public repos

| Repo | What it does |
|---|---|
| [`grafana/ai-marketplace`](https://github.com/grafana/ai-marketplace) | Grafana MCP server (40+ tools) + assistant plugin. Gives agents *access* to Grafana data — dashboards, metrics, logs, alerts. Already in the Cursor marketplace. |
| [`grafana/skills`](https://github.com/grafana/skills) | Teaches agents *how to work with Grafana* — queries, dashboards, plugins, configs. Works on OSS and Cloud. |
| [`grafana/docker-otel-lgtm`](https://github.com/grafana/docker-otel-lgtm) | OSS LGTM stack in a container. Adding MCP support ([PR #1156](https://github.com/grafana/docker-otel-lgtm/pull/1156)) to connect AI assistants to a local Grafana stack. |

The distinction between `ai-marketplace` and `grafana/skills` matters: MCP tools are the *execution* layer — they give agents a way to call Grafana APIs. Skills are the *instruction* layer — they teach agents how to perform a task. They are complementary.

### The OSS-to-Cloud funnel

`docker-otel-lgtm` is where many developers first encounter Grafana. Skills that work on OSS and naturally surface Cloud capabilities strengthen that funnel without a hard sell:

```
docker-otel-lgtm  →  grafana/skills  →  grafana/ai-marketplace
(OSS entry point)    (teaches how)       (Cloud-native execution)
```

This requires a single, coherent entry point for skills. Multiple disconnected repos make it impossible to tell this story.

### Official skills on skills.sh

[skills.sh/official](https://skills.sh/official) lists skills published directly by the companies that build major technologies — Anthropic, Cloudflare, Firebase, GitHub, Microsoft, OpenAI, Vercel, and 100+ others. These are surfaced separately from community skills as authoritative, first-party guidance. Companies can have multiple repos listed (Microsoft has 23, Vercel has 23); the leaderboard aggregates install counts across all of them.

Grafana is not on this list yet. Any public repo with valid SKILL.md files gets indexed automatically once users install it. The question is therefore not whether Grafana can be listed, but how strong the signal is: a single canonical repo concentrates install counts and builds leaderboard ranking faster than installs scattered across many team repos. It is also the difference between a developer finding `grafana/skills` and knowing immediately what to install, versus having to discover the right repo themselves.

### Industry patterns

| Pattern | Examples | Characteristics |
|---|---|---|
| Centralised + curated | `anthropics/skills`, `microsoft/skills` | Single repo, PR-based, simple install, listed on skills.sh/official |
| Team-owned repos | `supabase/agent-skills`, `letta-ai/skills` | Each team ships independently, fragmented across an org |
| Aggregator index | "awesome-*" lists | Discovery layer only; install story fragmented |

---

## Problem

1. **Fragmentation is the current trajectory.** `grafana/ai-marketplace`, `grafanacloud-skills`, and `grafana/skills` already exist as separate repos. Without a consolidation model, this multiplies.
2. **Skills without a home get stuck.** The meetup speaker had no clear answer for where to send people to install the skill they wanted to share.
3. **The OSS funnel requires one entry point.** `docker-otel-lgtm` needs one URL to link to, not one per team.
4. **Quality drifts without shared conventions.** Skills in different repos adopt different formats, making agent behaviour inconsistent.

---

## Goals

1. **Single install story** — one command installs the canonical set of public Grafana skills
2. **Domain ownership** — each skill is maintained by the team with domain expertise; no single team is a review bottleneck
3. **OSS funnel** — one coherent entry point, works on OSS Grafana, naturally surfaces Cloud capabilities
4. **Public safety** — no internal credentials, URLs, or private tooling; enforced at review time
5. **Shared conventions** — linting and frontmatter spec enforced by CI regardless of which team contributes

---

## Proposals

---

### Proposal 0: Decentralised — each team publishes from their own repo

Each team publishes from their own repo. No shared home. No coordination required.

This is the current trajectory — it already exists in practice.

```
grafana/ai-marketplace  ← live
grafanacloud-skills     ← preparing to publish
grafana/alloy           ← hypothetical
grafana/loki            ← hypothetical
community-org/skills    ← uncoordinated
```

```bash
npx skills add grafana/ai-marketplace
npx skills add grafana/grafanacloud-skills
npx skills add grafana/alloy
# one command per repo
```

| Pros | Cons |
|---|---|
| Zero central coordination needed | Fragmentation is already the problem — this formalises it |
| Each team ships on their own cadence | No single install command for "Grafana skills" |
| Clear line of ownership per repo | Community contributors have no destination |
| | skills.sh signal fragmented — weaker community momentum |
| | OSS funnel incoherent — multiple entry points, no single story |
| | Quality and conventions diverge without a shared standard |

---

### Proposal 1: Centralised distribution, domain ownership via CODEOWNERS

`grafana/skills` is the single canonical home. Contributions come via PR. **Ownership is distributed via CODEOWNERS** — each plugin section is reviewed by the team with domain expertise, so no single team is a gatekeeper. This mirrors how shared internal repos at Grafana already work.

```
grafana/skills/
  skills/
    grafana-core/               ← CODEOWNERS: @grafana/dashboards-team
      promql/
      grafana-dashboard/
      alloy-config/
    grafana-cloud/
      log-aggregation-loki/     ← CODEOWNERS: @grafana/loki-team
      distributed-tracing-tempo/  ← CODEOWNERS: @grafana/tempo-team
      metrics-prometheus/       ← CODEOWNERS: @grafana/mimir-team
    grafana-plugins/            ← CODEOWNERS: @grafana/plugin-tools-team
      plugin-bundle-size/
      react-19-plugin-migration/
  CODEOWNERS
```

```bash
npx skills add grafana/skills          # all tools
claude plugin install grafana-core@grafana-skills
claude plugin install grafana-cloud@grafana-skills
```

A PR adding a Loki skill automatically requests review from `@grafana/loki-team`. Plugin skills go to `@grafana/plugin-tools-team`. The top-level `@grafana/skills-maintainers` group handles governance only — new sections, cross-cutting changes.

```
skills/grafana-cloud/log-aggregation-loki/        @grafana/loki-team
skills/grafana-cloud/distributed-tracing-tempo/   @grafana/tempo-team
skills/grafana-plugins/                           @grafana/plugin-tools-team
skills/grafana-core/                              @grafana/dashboards-team
*                                                 @grafana/skills-maintainers
```

OSS-to-Cloud integration in skill content is natural and lightweight:

```markdown
# Log Aggregation with Loki

Works with: docker-otel-lgtm, Loki OSS, Grafana Cloud

...OSS content...

## With Grafana Cloud
The Grafana MCP server lets your agent query Loki directly:
claude mcp add grafana/ai-marketplace
```

| Pros | Cons |
|---|---|
| Single install command — one entry point for the community and for `docker-otel-lgtm` | Teams PR to `grafana/skills` rather than a repo they fully own |
| CODEOWNERS eliminates the bottleneck — domain teams review their own sections | Neglected CODEOWNER sections lead to stale skills over time |
| Resolves the fragmentation described in P0 | Lightweight governance needed to add new CODEOWNER sections |
| Strong, unified skills.sh signal builds community momentum | |
| `grafanacloud-skills` content can migrate here progressively under CODEOWNERS | |
| Low overhead for contributing teams — one PR, not a new repo | |

---

### Proposal 2: Federated — `grafana/skills` as index only

`grafana/skills` lists vetted repos but hosts no product skills itself. Teams own and maintain separate repos.

```
grafana/skills/          ← index + lint tooling only
  INDEX.md

grafanacloud-skills      ← Grafana Cloud team
grafana/ai-marketplace   ← MCP team
grafana/alloy skills/    ← Alloy team (hypothetical)
```

```bash
npx skills add grafana/skills           # installs nothing useful
npx skills add grafana/grafanacloud-skills
npx skills add grafana/alloy
```

| Pros | Cons |
|---|---|
| Full team autonomy | Formalises P0 without solving any of its problems |
| No central PR required | `npx skills add grafana/skills` installs almost nothing |
| Teams control release cadence | Most teams won't create a dedicated skills repo |
| | Community contributors still have no single destination |
| | OSS funnel story still requires users to pick the right repo |
| | INDEX.md curation needs an owner with no clear candidate |

---

## Comparison

| Factor | P0 Decentralised | P1 CODEOWNERS | P2 Federated |
|---|---|---|---|
| Install story | Per-repo, fragmented | Single command | Per-repo, fragmented |
| Review routing | None | Automatic via CODEOWNERS | None |
| Community contribution home | None | `grafana/skills` PRs | INDEX.md only |
| skills.sh presence | Fragmented | Single strong entry | Fragmented |
| OSS funnel coherence | Weak | Strong | Weak |
| Team setup overhead | High — own repo per team | Low — one PR + CODEOWNER entry | High — own repo per team |
| Resolves current fragmentation | No | Yes | No — formalises it |

---

## Open questions

1. **Who bootstraps `@grafana/skills-maintainers`?** The top-level CODEOWNER group handles governance until enough domain teams are enrolled. Which team takes this on initially?

2. **`docker-otel-lgtm` skills placement.** OSS LGTM skills (PromQL, LogQL, dashboards) fit naturally in `grafana-core`. Should they live here and be linked from `docker-otel-lgtm` docs, or authored in `docker-otel-lgtm` and listed in an index?

3. **`grafanacloud-skills` migration path.** The team has expressed intent to publish soon. Does content go to `grafana/skills/grafana-cloud/` under their CODEOWNER section, or does `grafanacloud-skills` publish separately and consolidate later?

4. **Grafana Verified tier.** The [Grafana public dashboard library](https://grafana.com/grafana/dashboards/) distinguishes Grafana-authored from community dashboards. Should `grafana/skills` carry an equivalent badge for skills authored by Grafana product teams vs. community contributors?

5. **Public/internal boundary enforcement.** Skills must not reference internal service names, URLs, or credentials. Is this CODEOWNERS responsibility, CI checks, or both?

---

## References

- [`grafana/ai-marketplace`](https://github.com/grafana/ai-marketplace)
- [`grafana/docker-otel-lgtm` PR #1156](https://github.com/grafana/docker-otel-lgtm/pull/1156)
- [skills.sh — grafana search](https://skills.sh/?q=grafana)
- [Agent Skills specification](https://agentskills.io)
- [`anthropics/skills`](https://github.com/anthropics/skills)
- [`microsoft/skills`](https://github.com/microsoft/skills)
- [GitHub Issue #14467 — Org-wide shared CLAUDE.md](https://github.com/anthropics/claude-code/issues/14467)
- Grafana Private Skills Registry design doc
