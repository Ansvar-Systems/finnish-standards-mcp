# Tools -- Finnish Standards MCP

> 11 tools across 4 categories: search, lookup, comparison, and meta

---

## Search Tools

### `search_controls`

Full-text search across all Finnish cybersecurity controls using FTS5. Returns controls ranked by relevance from the combined Julkri, NCSC-FI, Tietosuoja, Katakri, VAHTI, and Kanta datasets. Use this when you need to find controls by keyword without knowing the framework.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Search terms, e.g. `"tietoturva"`, `"encryption"`, `"lokitus"` |
| `framework_id` | string | No | Restrict results to one framework, e.g. `"julkri"`, `"katakri"`, `"ncsc-fi-ohjeet"` |
| `category` | string | No | Filter by control category, e.g. `"Hallinnollinen tietoturva"` |
| `language` | `"fi"` \| `"en"` | No | Preferred display language for titles. Defaults to Finnish (`"fi"`). Controls without an English title always show Finnish. |
| `limit` | integer | No | Maximum results to return. Default: `20`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Framework`, `Category`, `Level` plus a `total_results` count above the table.

**Example:**
```
"Which Finnish government controls address access management?"
-> search_controls({ query: "paasynohjaus", language: "fi" })

"Find Julkri controls on encryption"
-> search_controls({ query: "salaus", framework_id: "julkri" })
```

**Data sources:** All 6 frameworks (Julkri, NCSC-FI, Tietosuoja, Katakri, VAHTI, Kanta)

**Limitations:**
- FTS5 phrase search: special characters (`"`, `^`, `*`, `-`, `:`) are stripped from the query before matching
- Searches bilingual content -- a Finnish-only query may miss English-only descriptions in the same control
- Does not support wildcard or regex patterns
- Relevance ranking is FTS5 rank, not semantic similarity

---

### `search_by_sector`

Returns frameworks applicable to a specific sector, optionally filtered by a keyword query within those frameworks. Use this to scope a compliance review to a particular industry before drilling into controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `sector` | string | Yes | One of: `government`, `healthcare`, `finance`, `energy`, `telecom`, `transport`, `water`, `digital_infrastructure`, `education` |
| `query` | string | No | Optional keyword search within the sector's frameworks |

**Returns:** A Markdown table of matching frameworks (ID, name, issuing body, version, control count, language). If `query` is provided, a second table lists matching controls within those frameworks (top 10 per framework, ranked by FTS5 relevance).

**Example:**
```
"What security frameworks apply to Finnish healthcare organizations?"
-> search_by_sector({ sector: "healthcare" })

"Which government controls cover logging?"
-> search_by_sector({ sector: "government", query: "lokitus" })
```

**Data sources:** Framework `scope_sectors` metadata + FTS5 on controls

**Limitations:**
- Sector taxonomy is fixed to the 9 values listed above
- A framework appears only if it was ingested with sector metadata -- frameworks without `scope_sectors` are not returned
- Query within sector does not cross-search frameworks not assigned to that sector

---

## Lookup Tools

### `get_control`

Retrieves the full record for a single control by its database ID. Returns the complete bilingual description, implementation guidance, verification guidance, ISO 27002 mapping, and source URL. Use this after `search_controls` or `list_controls` to get the full text of a specific control.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `control_id` | string | Yes | The control's database ID, e.g. `"julkri:HAL-01"`, `"katakri:T-01"`, `"kanta-tietoturva:KAN-LOK-01"` |

**Returns:** A structured Markdown document with control number, Finnish and English titles, framework and issuing body, category, level, ISO 27002 mapping, Finnish description (`Kuvaus`), English description, implementation guidance, verification guidance, and source URL.

**Example:**
```
"Give me the full text of Julkri control HAL-01"
-> get_control({ control_id: "julkri:HAL-01" })
```

**Data sources:** `controls` table joined to `frameworks`

**Limitations:**
- Returns a `NO_MATCH` error if the ID does not exist -- use `search_controls` or `list_controls` to discover valid IDs
- Implementation guidance and verification guidance may be absent for some controls
- Not all controls have English descriptions -- Finnish is always present

---

### `get_framework`

Returns metadata for a single framework: issuing body, version, effective date, language, scope, control count, category breakdown, and source URL. Use this to understand what a framework covers before listing its controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"julkri"`, `"katakri"`, `"ncsc-fi-ohjeet"`, `"tietosuoja-ohjeet"`, `"vahti"`, `"kanta-tietoturva"` |

**Returns:** A Markdown document with framework name (Finnish and English), issuing body, version, language, control count, effective date, sectors, scope description, structure description, license, and a category breakdown table.

**Example:**
```
"What is the Julkri framework and how many controls does it have?"
-> get_framework({ framework_id: "julkri" })
```

**Data sources:** `frameworks` table, `controls` aggregate

**Limitations:**
- Does not return the controls themselves -- use `list_controls` to enumerate them
- Sector and scope fields depend on ingestion quality; some frameworks may have incomplete metadata

---

## Comparison Tools

### `list_controls`

Lists all controls in a framework, with optional filtering by category and level. Returns a paginated table. Use this to browse a complete framework or to enumerate controls within a specific control category.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"julkri"`, `"katakri"` |
| `category` | string | No | Filter to one category, e.g. `"Hallinnollinen tietoturva"` |
| `level` | string | No | Filter by assurance level: `"P"`, `"K"`, `"KO"` (Julkri) or `"IV"`, `"III"`, `"II"` (Katakri) |
| `language` | `"fi"` \| `"en"` | No | Preferred display language for titles. Defaults to Finnish. |
| `limit` | integer | No | Maximum results. Default: `50`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Category`, `Level` plus a `total_results` count.

**Example:**
```
"List all Julkri controls at P (basic) level"
-> list_controls({ framework_id: "julkri", level: "P" })

"Show me all Katakri technical security controls"
-> list_controls({ framework_id: "katakri", category: "Tekninen tietoturvallisuus" })
```

**Data sources:** `controls` table

**Limitations:**
- Category and level values must match exactly as stored in the database -- use `get_framework` to see the available categories first
- Default limit of 50 may truncate large frameworks (Julkri has 79 controls)

---

### `compare_controls`

Searches the same keyword query across 2-4 frameworks simultaneously and shows the top 5 matching controls per framework side by side. Use this to compare how different Finnish standards treat the same topic.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Topic to compare, e.g. `"tietoturva"`, `"lokitus"`, `"salaus"` |
| `framework_ids` | string[] | Yes | 2 to 4 framework IDs, e.g. `["julkri", "katakri"]` or `["julkri", "ncsc-fi-ohjeet", "vahti", "kanta-tietoturva"]` |

**Returns:** A Markdown section per framework showing the control number, title, and a 150-character snippet of the Finnish description for up to 5 matching controls.

**Example:**
```
"How do Julkri and Katakri differ in their approach to encryption?"
-> compare_controls({ query: "salaus", framework_ids: ["julkri", "katakri"] })

"Compare logging requirements across Julkri, NCSC-FI, and Kanta"
-> compare_controls({ query: "lokitus", framework_ids: ["julkri", "ncsc-fi-ohjeet", "kanta-tietoturva"] })
```

**Data sources:** FTS5 on `controls` filtered by `framework_id`

**Limitations:**
- Returns at most 5 controls per framework -- not a full comparison of all matching controls
- Snippets are truncated at 150 characters; use `get_control` for full text
- Both frameworks must be in the database; passing an unknown ID silently returns zero results for that framework

---

### `get_iso_mapping`

Returns all Finnish controls that map to a specific ISO 27002:2022 control number. Use this to find which Finnish standards implement a given ISO requirement, or to check Finnish compliance coverage for an ISO audit.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `iso_control` | string | Yes | ISO 27002:2022 control reference, e.g. `"5.1"`, `"8.15"`, `"8.24"` |

**Returns:** A Markdown table grouped by framework, listing each Finnish control mapped to that ISO reference (ID, control number, title).

**Example:**
```
"Which Finnish controls implement ISO 27002 control 5.1 (Information security policies)?"
-> get_iso_mapping({ iso_control: "5.1" })

"Show me all Finnish framework controls that map to ISO 27002 8.15 (Logging)"
-> get_iso_mapping({ iso_control: "8.15" })
```

**Data sources:** `controls.iso_mapping` field

**Limitations:**
- Only returns controls with an exact `iso_mapping` match -- controls without ISO mapping are not included
- ISO mapping coverage varies by framework: Julkri has the most complete ISO 27002:2022 mapping
- Does not support partial matches or range queries (e.g. `"5.x"` will not match)

---

## Meta Tools

### `list_frameworks`

Returns a summary table of all frameworks in the database. No parameters required. Use this to discover which frameworks are available before calling `get_framework` or `list_controls`.

**Parameters:** None

**Returns:** A Markdown table listing framework ID, name, issuing body, version, control count, language, and sectors for each framework in the database.

**Example:**
```
"What Finnish cybersecurity frameworks does this MCP cover?"
-> list_frameworks()
```

**Data sources:** `frameworks` table joined to control counts

**Limitations:**
- Lists only frameworks loaded in the current database build -- reflects ingestion coverage
- Sector data may be empty for frameworks ingested without sector metadata

---

### `about`

Returns server metadata: version, category, schema version, database build date, and coverage statistics (framework count, control count, database size). Use this to check the current version and data state of the MCP.

**Parameters:** None

**Returns:** A Markdown document with server name, version, category, schema version, database build date, and a coverage metrics table (frameworks, controls, database size in MB).

**Example:**
```
"What version of the Finnish Standards MCP is running and when was it last updated?"
-> about()
```

**Data sources:** `db_metadata` table

**Limitations:**
- Database build date reflects when the SQLite database was compiled, not the publication date of the source standards
- Call `check_data_freshness` for per-source freshness status

---

### `list_sources`

Returns the data provenance table: for each source, the authority, standard name, retrieval method, and license. Use this to understand where the data comes from before relying on it in a compliance decision.

**Parameters:** None

**Returns:** A Markdown table with columns `ID`, `Authority`, `Standard / Document`, `Retrieval method`, `License`. Includes a disclaimer note about verifying against authoritative sources.

**Example:**
```
"Where does this MCP get its data from, and what are the licenses?"
-> list_sources()
```

**Data sources:** Hardcoded provenance list (sourced from `sources.yml`)

**Limitations:**
- The fallback list is hardcoded; full YAML parsing requires an optional dependency not included in the default build
- Does not show per-source item counts or last-refresh dates -- use `check_data_freshness` for that

---

### `check_data_freshness`

Reports how current each data source is against its expected refresh schedule. Returns a per-source status: `Current`, `Due in N days`, or `OVERDUE (N days)`. Use this to verify the database is not stale before using it for compliance decisions.

**Parameters:** None

**Returns:** A Markdown table with columns `Source`, `Last fetched`, `Refresh window`, `Status`. Includes a summary of any overdue or due-soon sources and instructions to trigger a data update.

**Example:**
```
"Is the Finnish Standards MCP data up to date?"
-> check_data_freshness()
```

**Data sources:** `data/coverage.json` (generated by `npm run coverage:update`)

**Limitations:**
- Returns a "no coverage data" message if `coverage.json` has not been generated yet -- run `npm run coverage:update` after first build
- Status is based on the `last_fetched` date in `coverage.json`, not a live check of upstream sources
- `OVERDUE` status means the data is past its scheduled refresh window, not necessarily that the data has changed

---

## Finnish Cybersecurity Glossary

This glossary covers terms used in Finnish government cybersecurity standards that appear as parameters, category names, or framework identifiers in the tools above.

| Term | Expansion | Meaning |
|------|-----------|---------|
| **Julkri** | Julkisen hallinnon tietoturvakriteeri | Government information security criteria. Mandatory baseline for Finnish government organizations. Issued by DVV. Three assurance levels: P (Basic), K (Elevated), KO (High). |
| **Katakri** | Kansallinen turvallisuusauditointikriteeristo | National security audit criteria. For organizations handling classified information. Issued by Puolustusministerio. Three levels: IV, III, II. |
| **NCSC-FI** | Kyberturvallisuuskeskus (National Cyber Security Centre Finland) | Part of Traficom. Issues cybersecurity guidelines for critical infrastructure, web security, email security (SPF/DKIM/DMARC), and ICS/SCADA systems. |
| **Tietosuoja** | Tietosuojavaltuutetun ohjeet | Data Protection Ombudsman's guidance. Covers GDPR Art. 32 technical measures, DPIA, breach management, and data subject rights. |
| **VAHTI** | Valtionhallinnon tietoturvaohjeistus | Government information security guidelines. Issued by Valtiovarainministerio (VM). Covers ICT contingency, log management, personnel security, and ISMS. |
| **Kanta** | Kanta-palvelut | National health data services operated by Kela. Security requirements cover patient data logging (12-year retention), access management, and certificate-based authentication. |
| **DVV** | Digi- ja vaestotietovirasto | Digital and Population Data Services Agency. Issues Julkri. |
| **Traficom** | Liikenne- ja viestintavirasto | Finnish Transport and Communications Agency. Hosts NCSC-FI. |
| **VM** | Valtiovarainministerio | Ministry of Finance. Issues VAHTI guidelines. |
| **Puolustusministerio** | -- | Ministry of Defence. Issues Katakri. |
| **THL** | Terveyden ja hyvinvoinnin laitos | Finnish Institute for Health and Welfare. Co-manages Kanta requirements with Kela. |
| **Tiedonhallinta** | -- | Information management. Central concept in Finnish public sector IT governance under the Tiedonhallintalaki (Information Management Act). |
| **Tietoturvallisuus** | -- | Information security. The overarching term used across Finnish frameworks for confidentiality, integrity, and availability. |
| **Kyberturvallisuus** | -- | Cybersecurity. Used specifically by NCSC-FI for network and system security topics. |
| **Lokitus** | -- | Logging. Required by Julkri, Kanta, and NCSC-FI for audit trail and incident investigation. |
| **Paasynohjaus** | -- | Access control. Required across all 6 frameworks with varying specificity. |
| **Salaus** | -- | Encryption. Required by Katakri for classified information and by Kanta for data transfer security. |
