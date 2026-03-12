# Coverage -- Finnish Standards MCP

> Last verified: 2026-03-12 | Database version: 0.1.0

This document declares exactly what data the Finnish Standards MCP contains, what it does not contain, and the limitations of each source. It is the contract with users.

---

## What's Included

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| Julkri (Julkisen hallinnon tietoturvakriteeri) | DVV | 79 controls | 2020 | Full | Annual |
| NCSC-FI Kyberturvallisuusohjeet | Traficom / NCSC-FI | 49 controls | 2024 | Full | Annual |
| Tietosuojavaltuutetun ohjeet | Tietosuojavaltuutetun toimisto | 32 controls | 2024 | Full | Annual |
| Katakri (Kansallinen turvallisuusauditointikriteeristo) | Puolustusministerio | 35 controls | 2020 | Full | Annual |
| VAHTI-ohjeet | Valtiovarainministerio (VM) | 32 controls | 2024 | Full | Annual |
| Kanta-palvelujen tietoturvavaatimukset | Kela / THL | 26 controls | 2024 | Full | Annual |

**Total:** 11 tools, 253 controls, database built from 6 authoritative Finnish sources.

---

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| Kyberturvallisuuslaki (NIS2 implementation) | Finnish NIS2 transposition under preparation -- not yet in force | Yes -- planned once law enters force |
| Suomi.fi security requirements | Separate requirements for Suomi.fi identity and service gateway | Yes -- v0.2 |
| FICORA legacy directives | Superseded by NCSC-FI guidelines under Traficom | No |
| Tiedonhallintalaki (Information Management Act) | Procedural law, not a control catalog -- operational requirements covered by Julkri | No |
| ISO/IEC 27001:2022 (full standard) | Commercial ISO standard -- reference mappings included via `iso_mapping` field, full text excluded | No |
| CIS Controls v8 | International framework -- out of scope for Finnish-specific MCP | No |
| ENISA guidelines | EU-level guidance -- see EU Regulations MCP | No |

---

## Limitations

- **Snapshot data, not live.** The database is a point-in-time extract. Standards may be updated between database rebuilds. The `check_data_freshness` tool reports the last-fetched date for each source.
- **Finnish as primary language.** All controls have Finnish titles and descriptions. English translations are provided where available. Some controls may have limited English content.
- **ISO mapping is partial.** Not all controls have `iso_mapping` populated. Julkri has the most complete ISO 27002:2022 mapping; other frameworks have varying coverage. `get_iso_mapping` only returns controls with an explicit mapping.
- **No case law or enforcement decisions.** The database contains normative controls only, not interpretive guidance or enforcement decisions from the Data Protection Ombudsman or other authorities.
- **Sector metadata may be incomplete.** Frameworks are tagged with `scope_sectors` values during ingestion. If a framework's sector coverage is broader than what's tagged, `search_by_sector` may not surface it.
- **Not a legal opinion.** Compliance with these standards is not verified by this tool. The tool provides structured access to control text -- whether a specific system or process meets a control is a judgment that requires qualified assessment.

---

## Data Freshness Schedule

| Source | Refresh Schedule | Last Refresh | Next Expected |
|--------|-----------------|-------------|---------------|
| Julkri | Annual | 2026-03-12 | 2027-01-01 |
| NCSC-FI Ohjeet | Annual | 2026-03-12 | 2027-01-01 |
| Tietosuoja Ohjeet | Annual | 2026-03-12 | 2027-01-01 |
| Katakri | Annual | 2026-03-12 | 2027-01-01 |
| VAHTI | Annual | 2026-03-12 | 2027-01-01 |
| Kanta | Annual | 2026-03-12 | 2027-01-01 |

To check current freshness status programmatically, call the `check_data_freshness` tool.

The ingestion pipeline (`ingest.yml`) runs on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

---

## Regulatory Mapping

This table maps Finnish laws and regulations to the frameworks in this MCP that implement or operationalize them.

| Regulation / Law | Relevant Frameworks | Notes |
|-----------------|---------------------|-------|
| Tiedonhallintalaki (906/2019) | Julkri, VAHTI | Information Management Act governs public sector data handling; Julkri operationalizes its security requirements |
| EU GDPR / Tietosuojalaki (1050/2018) | Tietosuoja, Julkri, Kanta | Data protection -- Article 32 technical measures |
| Laki potilaan asemasta ja oikeuksista (785/1992) | Kanta | Patient rights -- requires audit logging and access controls for health records |
| Turvallisuusselvityslaki (726/2014) | Katakri | Security clearance -- Katakri provides the audit criteria for organizations handling classified information |
| Kyberturvallisuuslaki (NIS2 transposition) | NCSC-FI | Finnish NIS2 implementation -- under preparation, will affect critical infrastructure operators |
| Laki julkisen hallinnon tiedonhallinnasta | Julkri, VAHTI | Public sector information management obligations |

---

## Sector-Specific Coverage

### Government (Valtionhallinto, kunnat)

- **Included:** Julkri (full, 79 controls), VAHTI (full, 32 controls), NCSC-FI (applicable guidelines)
- **Gap:** Suomi.fi-specific security requirements not yet included
- **Gap:** Municipality-specific guidance (Kuntaliitto) not included

### Healthcare (Terveydenhuolto)

- **Included:** Kanta (full, 26 controls), Tietosuoja (GDPR-related data protection controls)
- **Gap:** Valvira-specific patient data system certification requirements not separated as individual controls
- **Gap:** THL-specific statistical data handling requirements not included

### Critical Infrastructure (Energy, Telecom, Transport, Water)

- **Included:** NCSC-FI (full, 49 controls covering ICS/SCADA, web, email, network)
- **Gap:** Sector-specific Traficom requirements for telecom operators not yet separated
- **Gap:** Energiavirasto-specific energy sector guidelines not included

### Finance (Rahoitussektori)

- **Included:** Tietosuoja (GDPR-related data protection controls)
- **Gap:** Finanssivalvonta (FIN-FSA) specific cybersecurity guidance not included
- **Gap:** EBA ICT Risk guidelines (EU-level) -- see EU Regulations MCP

### Defense (Puolustus)

- **Included:** Katakri (full, 35 controls at IV/III/II classification levels)
- **Gap:** Puolustusvoimat internal technical directives -- classified, not publicly available
