---
name: your-skill-name
description: >
  Clear description of what this skill does and when to use it.
  Use when the user asks about X or wants to work with Y.
  Include specific trigger phrases so agents auto-load it correctly.
  Max 1024 characters.
# Optional fields:
# user-invocable: true        # Whether user can invoke with /skill-name (default: true)
# disable-model-invocation: false  # Whether to prevent agent auto-loading (default: false)
# compatibility: "Claude Code, Cursor"
# license: Apache-2.0
---

# Your Skill Title

## Overview

Brief introduction to what this skill covers and what it helps with.

## Key Concepts

Document the important concepts, patterns, or syntax that AI agents won't already know.
Focus on Grafana-specific knowledge — don't explain general programming concepts.

## Examples

Concrete examples with code blocks are more effective than explanations.

```promql
# Example query
rate(http_requests_total[5m])
```

## Common Patterns

Describe the most frequently needed patterns or configurations.

## Best Practices

- List recommendations specific to this skill's domain
- Include common pitfalls to avoid
- Reference official docs where helpful
