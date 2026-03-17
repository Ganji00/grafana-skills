# Grafana Skills

[![Validate Marketplace](https://github.com/grafana/skills/actions/workflows/validate.yml/badge.svg)](https://github.com/grafana/skills/actions/workflows/validate.yml)
[![Lint Skills](https://github.com/grafana/skills/actions/workflows/lint-skills.yml/badge.svg)](https://github.com/grafana/skills/actions/workflows/lint-skills.yml)

Public skills for working with Grafana, Prometheus, Loki, Tempo, Pyroscope, k6, and the broader LGTM observability
stack. Compatible with Claude Code, Cursor, and any tool supporting the
[Agent Skills](https://agentskills.io) open standard.

## Installation

### Claude Code

```bash
# Add this marketplace
claude plugin marketplace add grafana/skills

# Install the plugin(s) you want
claude plugin install grafana-plugins@grafana-skills
```

### Cursor

1. Open **Cursor Settings** - **Rules, Skills, Subagents**
2. Click **+ New** next to **Rules**
3. Select **Add from GitHub**
4. Enter: `https://github.com/grafana/skills`

Skills stay synced with the repository automatically.

### npx skills (and other tools)

Any tool using the [vercel-labs/skills](https://github.com/vercel-labs/skills) CLI or the `skills/` directory
convention can install directly:

```bash
npx skills add grafana/skills
```

---

## Available Skills

Skills are organized into logical groups (plugins) for installation purposes. All skill files live in `skills/`.

### grafana-plugins

Skills for building Grafana plugins — bundle optimisation, code splitting, and plugin development.

| Skill | Description |
|-------|-------------|
| `plugin-bundle-size` | Optimise Grafana app plugin bundle size using React.lazy, Suspense, and webpack code splitting |

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
├── skills/                           # All skills (flat, one dir per skill)
│   └── <skill-name>/SKILL.md
├── template/SKILL.md                 # Starter template for new skills
├── scripts/lint-skills.sh            # Local skill validation
└── .github/workflows/                # CI validation
```

## License

Apache License 2.0 - see [LICENSE](LICENSE).
