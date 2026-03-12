import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { handleSearchControls } from './tools/search-controls.js';
import { handleGetControl } from './tools/get-control.js';
import { handleListControls } from './tools/list-controls.js';
import { handleGetFramework } from './tools/get-framework.js';
import { handleListFrameworks } from './tools/list-frameworks.js';
import { handleCompareControls } from './tools/compare-controls.js';
import { handleGetIsoMapping } from './tools/get-iso-mapping.js';
import { handleSearchBySector } from './tools/search-by-sector.js';
import { handleAbout } from './tools/about.js';
import { handleListSources } from './tools/list-sources.js';
import { handleCheckDataFreshness } from './tools/check-data-freshness.js';

const server = new McpServer({
  name: 'finnish-standards-mcp',
  version: '1.0.0',
});

server.tool(
  'search_controls',
  'Search Finnish government cybersecurity and information security controls by keyword (Finnish or English). Covers Julkri, Katakri, NCSC-FI guidelines, Tietosuojavaltuutetun ohjeet, VAHTI, and Kanta security requirements.',
  {
    query: z.string().describe('Search query in Finnish or English'),
    framework_id: z.string().optional().describe('Filter by framework ID (e.g. "julkri", "katakri")'),
    category: z.string().optional().describe('Filter by control category'),
    language: z.enum(['nl', 'en']).optional().describe('Language preference for results (nl=Finnish, en=English)'),
    limit: z.number().optional().describe('Maximum number of results to return'),
    offset: z.number().optional().describe('Number of results to skip for pagination'),
  },
  async (args) => handleSearchControls(args),
);

server.tool(
  'get_control',
  'Retrieve a specific Finnish security control by its unique ID, including full text, implementation guidance, and framework metadata.',
  {
    control_id: z.string().describe('Unique identifier of the control (e.g. "julkri:HAL-01", "katakri:T-01")'),
  },
  async (args) => handleGetControl(args),
);

server.tool(
  'list_controls',
  'List all controls in a specified Finnish security framework, with optional filtering by category or level.',
  {
    framework_id: z.string().describe('Framework to list controls from (e.g. "julkri", "katakri")'),
    category: z.string().optional().describe('Filter by category within the framework'),
    level: z.string().optional().describe('Filter by control level or tier'),
    language: z.string().optional().describe('Language preference for result labels'),
    limit: z.number().optional().describe('Maximum number of controls to return'),
    offset: z.number().optional().describe('Number of controls to skip for pagination'),
  },
  async (args) => handleListControls(args),
);

server.tool(
  'get_framework',
  'Retrieve metadata for a specific Finnish security framework: name, version, issuing body, scope, and summary statistics.',
  {
    framework_id: z.string().describe('Framework identifier (e.g. "julkri", "katakri", "ncsc-fi-ohjeet")'),
  },
  async (args) => handleGetFramework(args),
);

server.tool(
  'list_frameworks',
  'List all Finnish security and information security frameworks available in this MCP server, including Julkri, Katakri, NCSC-FI, Tietosuoja, VAHTI, and Kanta.',
  {},
  async () => handleListFrameworks(),
);

server.tool(
  'compare_controls',
  'Compare how a security topic is addressed across multiple Finnish frameworks simultaneously. Returns matching controls from each specified framework for the given query.',
  {
    query: z.string().describe('Security topic or requirement to compare across frameworks'),
    framework_ids: z.array(z.string()).describe('List of framework IDs to compare (e.g. ["julkri", "katakri"])'),
  },
  async (args) => handleCompareControls(args),
);

server.tool(
  'get_iso_mapping',
  'Find Finnish framework controls that map to a given ISO 27001/27002 control reference. Returns Julkri, Katakri, and other Finnish controls aligned to the specified ISO control.',
  {
    iso_control: z.string().describe('ISO 27001/27002 control reference (e.g. "5.1", "8.15")'),
  },
  async (args) => handleGetIsoMapping(args),
);

server.tool(
  'search_by_sector',
  'Search Finnish security controls relevant to a specific sector (e.g. healthcare, government). Optionally narrow results with a keyword query.',
  {
    sector: z.string().describe('Target sector (e.g. "healthcare", "government", "energy")'),
    query: z.string().optional().describe('Optional keyword query to narrow results within the sector'),
  },
  async (args) => handleSearchBySector(args),
);

server.tool(
  'about',
  'Return a description of this MCP server: what it covers, which Finnish security frameworks are included, data sources, and usage guidance.',
  {},
  async () => handleAbout(),
);

server.tool(
  'list_sources',
  'List all primary data sources used in this MCP server, including source URLs, issuing organisations, version numbers, and last-updated dates for each Finnish security framework.',
  {},
  async () => handleListSources(),
);

server.tool(
  'check_data_freshness',
  'Check whether the embedded Finnish security framework data is current. Returns the last-updated date for each framework and flags any sources that may be outdated.',
  {},
  async () => handleCheckDataFreshness(),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error starting finnish-standards-mcp:', err);
  process.exit(1);
});
