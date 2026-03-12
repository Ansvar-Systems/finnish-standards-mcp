// src/tools/list-sources.ts
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { successResponse } from '../response-meta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SourceEntry {
  id: string;
  authority: string;
  name: string;
  retrieval_method: string;
  license: string;
  url?: string;
}

const FALLBACK_SOURCES: SourceEntry[] = [
  {
    id: 'Julkri',
    authority: 'Digi- ja vaestotietovirasto (DVV)',
    name: 'Julkisen hallinnon tietoturvakriteeri (Julkri)',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://www.suomidigi.fi/ohjeet-ja-tuki/tiedonhallinta/julkri',
  },
  {
    id: 'NCSC-FI',
    authority: 'Traficom / NCSC-FI (Kyberturvallisuuskeskus)',
    name: 'NCSC-FI Kyberturvallisuusohjeet',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://www.kyberturvallisuuskeskus.fi/fi/ohjeet-ja-oppaat',
  },
  {
    id: 'Tietosuoja',
    authority: 'Tietosuojavaltuutetun toimisto',
    name: 'Tietosuojavaltuutetun ohjeet',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://tietosuoja.fi/ohjeet',
  },
  {
    id: 'Katakri',
    authority: 'Puolustusministerio',
    name: 'Kansallinen turvallisuusauditointikriteeristo (Katakri)',
    retrieval_method: 'Static download (PDF)',
    license: 'Public sector publication',
    url: 'https://www.defmin.fi/puolustushallinto/puolustushallinnon_turvallisuustoiminta/katakri',
  },
  {
    id: 'VAHTI',
    authority: 'Valtiovarainministerio (VM)',
    name: 'Vahti-ohjeet (Valtionhallinnon tietoturvaohjeistus)',
    retrieval_method: 'Static download (PDF)',
    license: 'Public sector publication',
    url: 'https://vm.fi/vahti',
  },
  {
    id: 'Kanta',
    authority: 'Kela / THL',
    name: 'Kanta-palvelujen tietoturvavaatimukset',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://www.kanta.fi/tietoturva',
  },
];

export function handleListSources() {
  let sources: SourceEntry[] = FALLBACK_SOURCES;

  const sourcesPath = join(__dirname, '..', '..', 'sources.yml');
  if (existsSync(sourcesPath)) {
    try {
      // Parse simple YAML list — avoid a YAML dependency by using basic parsing
      // Full YAML parsing would require a dependency; for now use fallback if file exists but let it override
      const raw = readFileSync(sourcesPath, 'utf-8');
      // If the file exists, it's used as a signal that sources were customised.
      // A full YAML parser is not available without adding a dependency, so we
      // use the fallback list but note it was found.
      void raw; // file read but not parsed without yaml dep
    } catch {
      // Ignore read errors — use fallback
    }
  }

  const lines: string[] = [];

  lines.push('## Data Sources');
  lines.push('');
  lines.push(
    'This MCP server aggregates Finnish government cybersecurity standards from the following authoritative sources:'
  );
  lines.push('');
  lines.push('| ID | Authority | Standard / Document | Retrieval method | License |');
  lines.push('|----|-----------|---------------------|-----------------|---------|');

  for (const src of sources) {
    const nameCell = src.url ? `[${src.name}](${src.url})` : src.name;
    lines.push(`| ${src.id} | ${src.authority} | ${nameCell} | ${src.retrieval_method} | ${src.license} |`);
  }

  lines.push('');
  lines.push(`**Total sources:** ${sources.length}`);
  lines.push('');
  lines.push(
    '> All data is extracted from public Finnish government publications. ' +
    'This tool is a reference aid — verify critical compliance decisions against the originals.'
  );

  return successResponse(lines.join('\n'));
}
