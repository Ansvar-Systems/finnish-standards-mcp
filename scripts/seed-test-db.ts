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

insertFramework.run('traficom-maaraykset', 'Traficom Cybersecurity Regulations and Recommendations', 'Traficomin kyberturvallisuusmaaraykset ja -suositukset', 'Liikenne- ja viestintavirasto Traficom', '2024', '2024-01-01', 'Cybersecurity regulations and recommendations from Traficom', '["telecom","digital_infrastructure","iot"]', 'Communications network security, electronic communications, IoT, cloud, DNS, EUCC, situational awareness', 'https://www.traficom.fi/fi/viestinta/kyberturvallisuus', 'Public sector publication', 'fi+en');

insertFramework.run('dvv-tiedonhallinta', 'DVV Information Management Requirements', 'DVV:n tiedonhallintavaatimukset', 'Digi- ja vaestotietovirasto (DVV)', '2024', '2024-01-01', 'Information management requirements implementing the Information Management Act', '["government"]', 'Tiedonhallintalaki, Suomi.fi services, eService security, security assessment', 'https://www.suomidigi.fi/ohjeet-ja-tuki/tiedonhallinta', 'Public sector publication', 'fi+en');

insertFramework.run('kyberturvallisuuslaki', 'Finnish Cybersecurity Legislation', 'Suomen kyberturvallisuuslainsaadanto', 'Eduskunta / Traficom', '2025', '2025-01-01', 'Key Finnish cybersecurity and information management legislation', '["government","energy","telecom","transport","healthcare","finance","water","digital_infrastructure"]', 'NIS2 implementation, Tiedonhallintalaki, Sahkoisen viestinnan palvelulaki, Turvallisuusselvityslaki', 'https://www.finlex.fi/fi/laki/', 'Public sector publication', 'fi+en');

insertFramework.run('finanssivalvonta', 'FIN-FSA ICT and Cybersecurity Requirements', 'Finanssivalvonnan ICT- ja kyberturvallisuusvaatimukset', 'Finanssivalvonta (FIN-FSA)', '2025', '2025-01-01', 'ICT and cybersecurity requirements for Finnish financial sector entities', '["finance"]', 'ICT risk management, operational risk, outsourcing, DORA, security baseline', 'https://www.finanssivalvonta.fi/saantely/maaraykset-ja-ohjeet/', 'Public sector publication', 'fi+en');

insertFramework.run('terveydenhuolto-tietoturva', 'Healthcare IT Security Requirements', 'Terveydenhuollon tietojarjestelmien tietoturvavaatimukset', 'THL / Valvira / STM', '2024', '2024-01-01', 'Comprehensive healthcare IT security requirements from Finnish health authorities', '["healthcare"]', 'Electronic prescriptions, patient information systems, Valvira, STM, Kanta certification, regional health IT', 'https://thl.fi/tietojarjestelmapalvelut', 'Public sector publication', 'fi+en');

insertFramework.run('energia-liikenne', 'Energy and Transport Cybersecurity Requirements', 'Energia- ja liikennesektorin kyberturvallisuusvaatimukset', 'Energiavirasto / Vaylavirasto / HVK / LVM / Suomen Pankki', '2024', '2024-01-01', 'Cybersecurity requirements for Finnish energy and transport sectors', '["energy","transport","finance","water"]', 'Energy, transport infrastructure, emergency supply, cyber strategy, payment systems', 'https://energiavirasto.fi/', 'Public sector publication', 'fi+en');

insertFramework.run('kansalliset-standardit', 'Finnish National Standards and Recommendations', 'Suomen kansalliset standardit ja suositukset', 'SFS / JUHTA / Kuntaliitto / Hyvinvointialueet', '2024', '2024-01-01', 'Finnish national standards and public sector recommendations for information security', '["government","healthcare","education","municipal"]', 'ISO 27001 Finnish adoption, SFS 5900, JHS, Kuntaliitto, hospital districts, defence forces public guidance', 'https://sfs.fi/standardit/', 'Public sector publication', 'fi+en');

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

// Traficom controls
insertControl.run('traficom-maaraykset:TRAF-VV-01', 'traficom-maaraykset', 'TRAF-VV-01', 'Communications network security management system', 'Viestintaverkon tietoturvan hallintajarjestelma', 'A telecommunications operator shall implement a security management system covering protection of communications networks and services.', 'Teleyrityksen on toteutettava tietoturvan hallintajarjestelma, joka kattaa viestintaverkkojen ja -palveluiden suojauksen.', 'Viestintaverkkojen tietoturva', null, 'mandatory', '5.1', null, null, 'https://www.traficom.fi/fi/viestinta/viestintaverkot/viestintaverkkojen-ja-palvelujen-tietoturva');

// DVV controls
insertControl.run('dvv-tiedonhallinta:DVV-SFI-01', 'dvv-tiedonhallinta', 'DVV-SFI-01', 'Suomi.fi identification usage', 'Suomi.fi-tunnistuksen kaytto', 'Public administration electronic services shall use Suomi.fi identification or equivalent reliable electronic identification.', 'Julkisen hallinnon sahkoisissa asiointipalveluissa on kaytettava Suomi.fi-tunnistusta tai vastaavaa luotettavaa sahkoista tunnistamista.', 'Suomi.fi-palveluiden tietoturva', null, null, '8.5', null, null, null);

// Kyberturvallisuuslaki controls
insertControl.run('kyberturvallisuuslaki:NIS2-FI-03', 'kyberturvallisuuslaki', 'NIS2-FI-03', 'Incident reporting obligation', 'Poikkeamaraportointivelvoite', 'Significant security incidents shall be reported to the supervisory authority (Traficom) within 24 hours of detection.', 'Merkittavista tietoturvapoikkeamista on ilmoitettava valvontaviranomaiselle (Traficom) 24 tunnin kuluessa havaitsemisesta.', 'Kyberturvallisuuslaki (NIS2)', null, null, '5.24', null, null, null);

// Finanssivalvonta controls
insertControl.run('finanssivalvonta:FIVA-DORA-01', 'finanssivalvonta', 'FIVA-DORA-01', 'Digital operational resilience assurance', 'Digitaalisen toimintakyvyn varmistaminen', 'A financial sector entity shall ensure its digital operational resilience in accordance with the DORA regulation.', 'Finanssialan toimijan on varmistettava digitaalinen toimintakykynsyvyys DORA-asetuksen mukaisesti.', 'DORA-implementointi', null, null, '5.1', null, null, null);

// Terveydenhuolto controls
insertControl.run('terveydenhuolto-tietoturva:THL-RES-01', 'terveydenhuolto-tietoturva', 'THL-RES-01', 'Electronic prescription signing', 'Sahkoisen laakemaarayksen allekirjoitus', 'Electronic prescriptions shall be signed with the prescriber personal healthcare professional card (TEO card).', 'Sahkoinen laakemaarays on allekirjoitettava laakaarin henkilokohtaisella terveydenhuollon ammattikortilla (TEO-kortti).', 'Sahkoinen laakemaarays', null, null, '8.24', null, null, null);

// Energia-liikenne controls
insertControl.run('energia-liikenne:ENER-02', 'energia-liikenne', 'ENER-02', 'Electricity grid control system protection', 'Sahkoverkon valvontajarjestelmien suojaus', 'Electricity grid SCADA and EMS systems shall be isolated from the office network and protected against unauthorized access.', 'Sahkoverkon SCADA- ja EMS-jarjestelmat on eristettava toimistoverkosta ja suojattava luvattomalta paasylta.', 'Energiasektorin kyberturvallisuus', null, null, '8.22', null, null, null);

// Kansalliset standardit controls
insertControl.run('kansalliset-standardit:KUNTA-01', 'kansalliset-standardit', 'KUNTA-01', 'Municipal security policy', 'Kunnan tietoturvapolitiikka', 'A municipality shall prepare a security policy considering municipal characteristics.', 'Kunnan on laadittava tietoturvapolitiikka, joka huomioi kunnan erityispiirteet.', 'Kuntaliitto tietoturva', null, null, '5.1', null, null, null);

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
