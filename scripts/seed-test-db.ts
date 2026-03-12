// scripts/seed-test-db.ts
// Builds a minimal test database at data/standards.db for development and testing.
// Uses @ansvar/mcp-sqlite (WASM-based, CommonJS loaded via createRequire).

import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'standards.db');

// Ensure the data directory exists
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const require = createRequire(import.meta.url);
const { Database } = require('@ansvar/mcp-sqlite');
const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS frameworks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_nl TEXT,
  issuing_body TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_date TEXT,
  scope TEXT,
  scope_sectors TEXT,
  structure_description TEXT,
  source_url TEXT,
  license TEXT,
  language TEXT NOT NULL DEFAULT 'fi'
);

CREATE TABLE IF NOT EXISTS controls (
  id TEXT PRIMARY KEY,
  framework_id TEXT NOT NULL REFERENCES frameworks(id),
  control_number TEXT NOT NULL,
  title TEXT,
  title_nl TEXT NOT NULL,
  description TEXT,
  description_nl TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  level TEXT,
  iso_mapping TEXT,
  implementation_guidance TEXT,
  verification_guidance TEXT,
  source_url TEXT
);

CREATE VIRTUAL TABLE IF NOT EXISTS controls_fts USING fts5(
  id,
  title,
  title_nl,
  description,
  description_nl,
  category,
  content='controls',
  content_rowid='rowid'
);

CREATE TABLE IF NOT EXISTS db_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

const insertFramework = db.prepare(
  'INSERT OR REPLACE INTO frameworks (id, name, name_nl, issuing_body, version, effective_date, scope, scope_sectors, structure_description, source_url, license, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

insertFramework.run('julkri', 'Government Information Security Criteria (Julkri)', 'Julkisen hallinnon tietoturvakriteeri (Julkri)', 'Digi- ja vaestotietovirasto (DVV)', '2020', '2020-01-01', 'Mandatory information security baseline for Finnish government organizations', '["government"]', 'Seven security domains (HAL, HEN, FYY, TLV, TJA, TAI, KAY) with three assurance levels: P (Basic), K (Elevated), KO (High)', 'https://www.suomidigi.fi/ohjeet-ja-tuki/tiedonhallinta/julkri', 'Public sector publication', 'fi+en');

insertFramework.run('katakri', 'National Security Audit Criteria (Katakri)', 'Kansallinen turvallisuusauditointikriteeristo (Katakri)', 'Puolustusministerio', '2020', '2020-01-01', 'Security audit criteria for organizations handling classified information', '["government"]', 'Three areas: T (Security Management), F (Physical Security), I (Technical Security). Three levels: IV, III, II.', 'https://www.defmin.fi/puolustushallinto/puolustushallinnon_turvallisuustoiminta/katakri', 'Public sector publication', 'fi+en');

insertFramework.run('kanta-tietoturva', 'Kanta Health Services Security Requirements', 'Kanta-palvelujen tietoturvavaatimukset', 'Kela / THL', '2024', '2024-01-01', 'Security requirements for organizations connecting to Kanta national health data services', '["healthcare"]', 'Access management, logging, data transfer, certificates, patient record systems, security management, data protection', 'https://www.kanta.fi/tietoturva', 'Public sector publication', 'fi+en');

const insertControl = db.prepare(
  'INSERT OR REPLACE INTO controls (id, framework_id, control_number, title, title_nl, description, description_nl, category, subcategory, level, iso_mapping, implementation_guidance, verification_guidance, source_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

// Julkri controls
insertControl.run('julkri:HAL-01', 'julkri', 'HAL-01', 'Information security policy', 'Tietoturvapolitiikka', 'The organization shall have a management-approved information security policy that defines security objectives, principles, and responsibilities.', 'Organisaatiolla on oltava johdon hyvaksyma tietoturvapolitiikka, joka maarittelee tietoturvallisuuden tavoitteet, periaatteet ja vastuut.', 'Hallinnollinen tietoturva', null, 'P', '5.1', 'Laadi tietoturvapolitiikka, joka kattaa organisaation tietoturvallisuuden tavoitteet, vastuut ja toteuttamisen periaatteet.', 'Tarkista, etta tietoturvapolitiikka on olemassa, johdon hyvaksyma, ja katselmoitu viimeisen 12 kuukauden aikana.', 'https://www.suomidigi.fi/ohjeet-ja-tuki/tiedonhallinta/julkri');

insertControl.run('julkri:TJA-03', 'julkri', 'TJA-03', 'Logging', 'Lokitus', 'Information system events shall be logged comprehensively. Log data shall be protected against modification and retained for a sufficient period.', 'Tietojarjestelmien tapahtumat on lokitettava kattavasti. Lokitiedot on suojattava muutoksilta ja sailytettava riittavan kauan.', 'Tietojarjestelma turvallisuus', null, 'P', '8.15', null, null, null);

insertControl.run('julkri:KAY-02', 'julkri', 'KAY-02', 'Vulnerability management', 'Haavoittuvuushallinta', 'Information system vulnerabilities shall be identified through regular checks and remediated based on risk assessment.', 'Tietojarjestelmien haavoittuvuudet on tunnistettava saannollisilla tarkistuksilla ja korjattava riskinarvioinnin perusteella.', 'Kayttoturvallisuus', null, 'P', '8.8', null, null, null);

// Katakri controls
insertControl.run('katakri:T-01', 'katakri', 'T-01', 'Security policy', 'Turvallisuuspolitiikka', 'The organization shall have a management-approved security policy covering national security aspects.', 'Organisaatiolla on oltava johdon hyvaksyma turvallisuuspolitiikka, joka kattaa kansallisen turvallisuuden nakokulman.', 'Turvallisuusjohtaminen', null, 'IV', '5.1', null, null, null);

insertControl.run('katakri:I-03', 'katakri', 'I-03', 'Encryption methods', 'Salausmenetelmat', 'Approved encryption methods and products shall be used for encrypting classified information.', 'Salassa pidettavien tietojen salaukseen on kaytettava turvallisuusviranomaisen hyvaksymia salausmenetelmia ja -tuotteita.', 'Tekninen tietoturvallisuus', null, 'IV', '8.24', null, null, null);

// Kanta controls
insertControl.run('kanta-tietoturva:KAN-LOK-01', 'kanta-tietoturva', 'KAN-LOK-01', 'Patient data processing logging', 'Potilastietojen kasittelyn lokitus', 'All patient data processing events shall be logged: viewing, saving, modification, printing, and sending.', 'Kaikki potilastietojen kasittelytapahtumat on lokitettava: tietojen katselu, tallennus, muuttaminen, tulostus ja lahettaminen.', 'Lokitus ja valvonta', null, null, '8.15', null, null, null);

db.exec("INSERT INTO controls_fts(controls_fts) VALUES('rebuild')");

const insertMeta = db.prepare('INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)');
insertMeta.run('schema_version', '1.0');
insertMeta.run('category', 'domain_intelligence');
insertMeta.run('mcp_name', 'Finnish Standards MCP');
insertMeta.run('database_built', new Date().toISOString().split('T')[0]);
insertMeta.run('database_version', '0.1.0');

db.pragma('journal_mode=DELETE');
db.exec('VACUUM');
db.close();

console.log('Test database seeded at data/standards.db');
