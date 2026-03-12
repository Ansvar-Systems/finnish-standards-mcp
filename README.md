# Finnish Standards MCP

[![npm version](https://img.shields.io/npm/v/@ansvar/finnish-standards-mcp)](https://www.npmjs.com/package/@ansvar/finnish-standards-mcp)
[![CI](https://github.com/Ansvar-Systems/finnish-standards-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/finnish-standards-mcp/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-ansvar.ai%2Fmcp-blue)](https://ansvar.ai/mcp)

Structured access to Finnish government cybersecurity and information security standards: Julkri (DVV), Katakri (Puolustusministerio), NCSC-FI guidelines (Traficom), Tietosuojavaltuutetun ohjeet, VAHTI (VM), and Kanta health services security requirements. Bilingual Finnish/English with FTS search, ISO 27002:2022 cross-references, and sector-based filtering.

Part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- specialist MCP servers for compliance and security intelligence.

---

## Quick Start

### Remote endpoint (no installation)

Add to your MCP client config:

```json
{
  "mcpServers": {
    "finnish-standards": {
      "url": "https://finnish-standards-mcp.vercel.app/mcp"
    }
  }
}
```

### Local (stdio via npx)

**Claude Desktop** -- edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "finnish-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/finnish-standards-mcp"]
    }
  }
}
```

**Cursor** -- edit `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "finnish-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/finnish-standards-mcp"]
    }
  }
}
```

**VS Code / GitHub Copilot** -- add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "finnish-standards": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ansvar/finnish-standards-mcp"]
    }
  }
}
```

---

## What's Included

| Source | Authority | Items | Language | Refresh |
|--------|-----------|-------|----------|---------|
| Julkri (Julkisen hallinnon tietoturvakriteeri) | DVV | 79 controls | FI+EN | Annual |
| NCSC-FI Kyberturvallisuusohjeet | Traficom / NCSC-FI | 49 controls | FI+EN | Annual |
| Tietosuojavaltuutetun ohjeet | Tietosuojavaltuutetun toimisto | 32 controls | FI+EN | Annual |
| Katakri (Kansallinen turvallisuusauditointikriteeristo) | Puolustusministerio | 35 controls | FI+EN | Annual |
| VAHTI-ohjeet | Valtiovarainministerio (VM) | 32 controls | FI+EN | Annual |
| Kanta-palvelujen tietoturvavaatimukset | Kela / THL | 26 controls | FI+EN | Annual |

**Total:** 253 controls across 6 frameworks.

For full coverage details, see [COVERAGE.md](COVERAGE.md).

---

## What's NOT Included

| Gap | Status |
|-----|--------|
| Kyberturvallisuuslaki (NIS2 implementation) | Planned -- Finnish NIS2 transposition under preparation |
| Suomi.fi requirements | Planned for v0.2 |
| FICORA legacy directives | Not planned -- superseded by NCSC-FI guidelines |
| ISO/IEC 27001:2022 full text | Excluded -- commercial ISO license; ISO cross-references available via `get_iso_mapping` |

For the complete gap list, see [COVERAGE.md -- What's NOT Included](COVERAGE.md#whats-not-included).

---

## Available Tools

| Tool | Category | Description |
|------|----------|-------------|
| `search_controls` | Search | Full-text search across all 6 frameworks. Returns controls ranked by FTS5 relevance. |
| `search_by_sector` | Search | Returns frameworks for a sector (`government`, `healthcare`, `finance`, etc.), optionally filtered by keyword. |
| `get_control` | Lookup | Full record for a single control: bilingual description, implementation guidance, ISO mapping. |
| `get_framework` | Lookup | Metadata for a framework: issuing body, version, control count, category breakdown. |
| `list_controls` | Lookup | All controls in a framework, filterable by category and level. Paginated. |
| `compare_controls` | Comparison | Side-by-side comparison of the same topic across 2-4 frameworks. |
| `get_iso_mapping` | Comparison | All Finnish controls mapped to a given ISO 27002:2022 control reference. |
| `list_frameworks` | Meta | Lists all frameworks in the database with summary stats. |
| `about` | Meta | Server version, build date, and coverage statistics. |
| `list_sources` | Meta | Data provenance: authority, standard name, retrieval method, license for each source. |
| `check_data_freshness` | Meta | Per-source freshness status against the expected refresh schedule. |

For full parameter documentation, return formats, and examples, see [TOOLS.md](TOOLS.md).

---

## Data Sources & Freshness

| Source | Last Refresh | Refresh Schedule |
|--------|-------------|-----------------|
| Julkri | 2026-03-12 | Annual |
| NCSC-FI Ohjeet | 2026-03-12 | Annual |
| Tietosuoja Ohjeet | 2026-03-12 | Annual |
| Katakri | 2026-03-12 | Annual |
| VAHTI | 2026-03-12 | Annual |
| Kanta | 2026-03-12 | Annual |

The `ingest.yml` workflow runs automatically on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

To check freshness at runtime, call `check_data_freshness`. Full source provenance and licenses: [sources.yml](sources.yml).

---

## Security

This repository runs 6-layer automated security scanning on every push and weekly:

| Layer | Tool | What it checks |
|-------|------|----------------|
| Static analysis | CodeQL | Code vulnerabilities |
| SAST | Semgrep | Security anti-patterns |
| Container / dependency scan | Trivy | Known CVEs in dependencies |
| Secret detection | Gitleaks | Leaked credentials |
| Supply chain | OSSF Scorecard | Repository security posture |
| Dependency updates | Dependabot | Automated dependency PRs |

---

## Disclaimer

**THIS TOOL IS NOT PROFESSIONAL ADVICE.**

This MCP provides structured access to Finnish cybersecurity standards sourced from authoritative publications. It is provided for informational and research purposes only.

- Verify critical compliance decisions against the original standards
- Data is a snapshot -- sources update, and there may be a delay between upstream changes and database refresh
- See [DISCLAIMER.md](DISCLAIMER.md) for the full disclaimer and no-warranty statement

---

## Ansvar MCP Network

This server is part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- 149 specialist MCP servers covering legislation, compliance frameworks, and cybersecurity standards.

| Category | Servers | Coverage |
|----------|---------|----------|
| Law MCPs | 108 | 119 countries, 668K+ laws |
| EU Regulations | 1 | 61 regulations, 4,054 articles |
| Security frameworks | 1 | 262 frameworks, 1,451 SCF controls |
| Domain-specific | ~48 | CVE, STRIDE, sanctions, OWASP, healthcare, financial, and more |

Browse the full directory at [ansvar.ai/mcp](https://ansvar.ai/mcp).

---

## Development

### Branch strategy

`feature-branch -> PR to dev -> verify on dev -> PR to main -> deploy`

Never push directly to `main`. `main` triggers npm publish and Vercel deployment.

### Setup

```bash
git clone https://github.com/Ansvar-Systems/finnish-standards-mcp.git
cd finnish-standards-mcp
npm install
npm run build
npm test
```

### Ingestion

```bash
# Full pipeline: ingest all 6 frameworks -> build DB -> update coverage
npm run ingest:full

# Individual steps
npm run build:db         # Rebuild SQLite database
npm run coverage:update  # Regenerate coverage.json and COVERAGE.md

# Check freshness
npm run freshness:check
```

### Pre-deploy verification

```bash
npm run build            # Gate 1: build
npm run lint             # Gate 2: TypeScript strict
npm test                 # Gate 3: unit tests
npm run test:contract    # Gate 4: golden contract tests
npm run coverage:verify  # Gate 6: coverage consistency
```

---

## License & Data Licenses

**Code:** [Apache-2.0](LICENSE)

**Data licenses by source:**

| Source | License |
|--------|---------|
| Julkri (DVV) | Public sector publication |
| NCSC-FI (Traficom) | Public sector publication |
| Tietosuojavaltuutetun ohjeet | Public sector publication |
| Katakri (Puolustusministerio) | Public sector publication |
| VAHTI (VM) | Public sector publication |
| Kanta (Kela / THL) | Public sector publication |

All data is extracted from publicly available authoritative Finnish government publications. Zero AI-generated content in the database. See [sources.yml](sources.yml) for complete provenance.
