# Grafana Skills

[![Validate Marketplace](https://github.com/grafana/skills/actions/workflows/validate.yml/badge.svg)](https://github.com/grafana/skills/actions/workflows/validate.yml)
[![Lint Skills](https://github.com/grafana/skills/actions/workflows/lint-skills.yml/badge.svg)](https://github.com/grafana/skills/actions/workflows/lint-skills.yml)

Public skills for working with Grafana, Prometheus, Loki, Tempo, Pyroscope, k6, and the broader LGTM observability
stack. Compatible with Claude Code, Cursor, Codex, and any tool supporting the
[Agent Skills](https://agentskills.io) open standard.

## Installation

### npx grafana-skills (recommended)

The official Grafana CLI installs skills directly from this repo with no setup required:

```bash
# Install all skills in a plugin group
npx grafana-skills add grafana-plugins
npx grafana-skills add grafana-core
npx grafana-skills add grafana-cloud

# Install a single skill
npx grafana-skills add grafana-plugins --skill plugin-bundle-size

# Target a specific tool only
npx grafana-skills add grafana-plugins --platform cursor

# See what's available
npx grafana-skills list
npx grafana-skills info grafana-plugins
npx grafana-skills search "bundle"

# Preview without writing files
npx grafana-skills add grafana-plugins --dry-run
```

Skills are written to `.claude/skills/` and `.cursor/skills/` in your project root and tracked in `.grafana-skills.lock.json`.

```bash
# Reinstall from lockfile (useful in CI or after cloning)
npx grafana-skills install

# Update to latest skills from GitHub
npx grafana-skills update
```

### Claude Code

```bash
# Add this marketplace
claude plugin marketplace add grafana/skills

# Install the plugin(s) you want
claude plugin install grafana-plugins@grafana-skills
claude plugin install grafana-core@grafana-skills
claude plugin install grafana-cloud@grafana-skills
```

### Cursor

1. Open **Cursor Settings** - **Rules, Skills, Subagents**
2. Click **+ New** next to **Rules**
3. Select **Add from GitHub**
4. Enter: `https://github.com/grafana/skills`

Skills stay synced with the repository automatically.

### Codex and other tools

Any tool following the [Agent Skills](https://agentskills.io) standard or the `skills/` directory convention:

```bash
npx skills add grafana/skills
```

---

## Available Skills

Skills are organized into plugin groups. All skill files live under `skills/<plugin-name>/`.

### grafana-core

Core Grafana concepts — dashboards, panels, PromQL, and visualization.

*Coming soon.*

### grafana-cloud

Grafana Cloud — Loki, Tempo, Pyroscope, and the LGTM observability stack.

*Coming soon.*

### grafana-plugins

Skills for building Grafana plugins — bundle optimisation, code splitting, and plugin development.

| Skill | Description |
|-------|-------------|
| `plugin-bundle-size` | Optimise Grafana app plugin bundle size using React.lazy, Suspense, and webpack code splitting |
| `react-19-plugin-migration` | Migrate a Grafana plugin to React 19 compatibility |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a new skill.

Quick start:

1. Copy `template/SKILL.md` to `skills/<your-skill-name>/SKILL.md`
2. Fill in the frontmatter and content
3. Run `./scripts/lint-skills.sh skills` to validate
4. Open a PR

## Repository Structure

```
grafana-skills/
├── .claude-plugin/marketplace.json   # Claude Code marketplace manifest
├── .cursor-plugin/marketplace.json   # Cursor marketplace manifest (identical)
├── .agents-plugin/marketplace.json   # Codex marketplace manifest (identical)
├── skill-registry.json               # Machine-readable manifest for grafana-skills CLI
├── skills/                           # All skills, grouped by plugin
│   ├── grafana-core/
│   ├── grafana-cloud/
│   └── grafana-plugins/
│       ├── plugin-bundle-size/SKILL.md
│       └── react-19-plugin-migration/SKILL.md
├── packages/cli/                     # npx grafana-skills CLI source
├── template/SKILL.md                 # Starter template for new skills
├── scripts/lint-skills.sh            # Local skill validation
└── .github/workflows/                # CI validation + CLI publish
```

## License

Apache License 2.0 - see [LICENSE](LICENSE).
