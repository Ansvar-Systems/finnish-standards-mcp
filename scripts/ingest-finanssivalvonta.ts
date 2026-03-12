// scripts/ingest-finanssivalvonta.ts
// Generates Finanssivalvonta (FIN-FSA) ICT and cybersecurity requirements.
// Source: Finanssivalvonta — Finnish Financial Supervisory Authority.
// Covers: ICT risk management, operational risk requirements, outsourcing, DORA implementation.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'finanssivalvonta.json');

mkdirSync(DATA_DIR, { recursive: true });

interface Control {
  control_number: string;
  title_nl: string;
  title?: string;
  description_nl: string;
  description?: string;
  category: string;
  subcategory?: string;
  level?: string;
  iso_mapping?: string;
  source_url?: string;
}

const controls: Control[] = [
  // === ICT-riskien hallinta (ICT Risk Management) ===
  {
    control_number: 'FIVA-ICT-01',
    title_nl: 'ICT-riskien hallintakehikko',
    title: 'ICT risk management framework',
    description_nl: 'Finanssialan toimijan on toteutettava kattava ICT-riskien hallintakehikko, joka on osa operatiivisten riskien hallintaa.',
    description: 'A financial sector entity shall implement a comprehensive ICT risk management framework as part of operational risk management.',
    category: 'ICT-riskien hallinta',
    iso_mapping: '5.1',
    source_url: 'https://www.finanssivalvonta.fi/saantely/maaraykset-ja-ohjeet/',
  },
  {
    control_number: 'FIVA-ICT-02',
    title_nl: 'ICT-strategia ja -hallintamalli',
    title: 'ICT strategy and governance model',
    description_nl: 'Toimijalla on oltava johdon hyvaksyma ICT-strategia ja hallintamalli, joka maarittelee ICT-riskienhallinnan organisoinnin ja vastuut.',
    description: 'The entity shall have a management-approved ICT strategy and governance model defining the organization and responsibilities of ICT risk management.',
    category: 'ICT-riskien hallinta',
    iso_mapping: '5.2',
  },
  {
    control_number: 'FIVA-ICT-03',
    title_nl: 'ICT-riskien tunnistaminen ja arviointi',
    title: 'ICT risk identification and assessment',
    description_nl: 'ICT-riskit on tunnistettava, arvioitava ja luokiteltava saannollisesti. Arvioinnin on katettava kyberturvallisuusriskit, jatkuvuusriskit ja kolmansien osapuolten riskit.',
    description: 'ICT risks shall be identified, assessed, and classified regularly. Assessment shall cover cybersecurity risks, continuity risks, and third-party risks.',
    category: 'ICT-riskien hallinta',
    iso_mapping: '5.3',
  },
  {
    control_number: 'FIVA-ICT-04',
    title_nl: 'ICT-jarjestelmien inventaario',
    title: 'ICT system inventory',
    description_nl: 'Toimijalla on oltava ajan tasalla oleva inventaario kaikista ICT-jarjestelmista, mukaan lukien niiden kriittisyysluokittelu.',
    description: 'The entity shall maintain an up-to-date inventory of all ICT systems, including their criticality classification.',
    category: 'ICT-riskien hallinta',
    iso_mapping: '5.9',
  },
  {
    control_number: 'FIVA-ICT-05',
    title_nl: 'ICT-liiketoiminnan jatkuvuussuunnittelu',
    title: 'ICT business continuity planning',
    description_nl: 'Toimijalla on oltava ICT-jatkuvuussuunnitelma, joka kattaa kriittisten jarjestelmien toipumissuunnitelmat, palautumisaikatavoitteet ja -testausksen.',
    description: 'The entity shall have an ICT continuity plan covering recovery plans for critical systems, recovery time objectives, and testing.',
    category: 'ICT-riskien hallinta',
    iso_mapping: '5.29',
  },
  {
    control_number: 'FIVA-ICT-06',
    title_nl: 'ICT-poikkeamien hallinta',
    title: 'ICT incident management',
    description_nl: 'Toimijalla on oltava menettelyt ICT-poikkeamien havaitsemiseen, luokitteluun, kasittelyyn ja raportointiin. Merkittavista poikkeamista on raportoitava Finanssivalvonnalle.',
    description: 'The entity shall have procedures for detecting, classifying, handling, and reporting ICT incidents. Significant incidents shall be reported to FIN-FSA.',
    category: 'ICT-riskien hallinta',
    iso_mapping: '5.24',
  },
  {
    control_number: 'FIVA-ICT-07',
    title_nl: 'Kyberturvallisuustestaus',
    title: 'Cybersecurity testing',
    description_nl: 'Toimijan on suoritettava saannollista kyberturvallisuustestausta, mukaan lukien haavoittuvuusskannaukset, penetraatiotestaus ja uhkajohtoiset testaukset (TLPT).',
    description: 'The entity shall conduct regular cybersecurity testing, including vulnerability scanning, penetration testing, and threat-led penetration testing (TLPT).',
    category: 'ICT-riskien hallinta',
    iso_mapping: '8.34',
  },
  {
    control_number: 'FIVA-ICT-08',
    title_nl: 'Muutoshallinta ja julkaisuhallinta',
    title: 'Change and release management',
    description_nl: 'ICT-jarjestelmien muutokset on hallittava muutoshallintamenettelylla. Muutosten tietoturvavaikutukset on arvioitava ennen toteutusta.',
    description: 'ICT system changes shall be managed through a change management process. Security impacts of changes shall be assessed before implementation.',
    category: 'ICT-riskien hallinta',
    iso_mapping: '8.32',
  },

  // === Operatiivisten riskien hallinta (Operational Risk Management) ===
  {
    control_number: 'FIVA-OPER-01',
    title_nl: 'Operatiivisten riskien hallintapolitiikka',
    title: 'Operational risk management policy',
    description_nl: 'Toimijalla on oltava johdon hyvaksyma operatiivisten riskien hallintapolitiikka, joka kattaa ICT-riskit, tietoturvariskit ja liiketoiminnan jatkuvuusriskit.',
    description: 'The entity shall have a management-approved operational risk management policy covering ICT risks, security risks, and business continuity risks.',
    category: 'Operatiivisten riskien hallinta',
    iso_mapping: '5.1',
  },
  {
    control_number: 'FIVA-OPER-02',
    title_nl: 'Operatiivisten riskien raportointi',
    title: 'Operational risk reporting',
    description_nl: 'Operatiivisista riskeista ja toteutuneista tappioista on raportoitava johdolle saannollisesti. Merkittavista tapahtumista on raportoitava Finanssivalvonnalle.',
    description: 'Operational risks and realized losses shall be reported to management regularly. Significant events shall be reported to FIN-FSA.',
    category: 'Operatiivisten riskien hallinta',
    iso_mapping: '5.5',
  },
  {
    control_number: 'FIVA-OPER-03',
    title_nl: 'Sisaisen valvonnan jarjestelmat',
    title: 'Internal control systems',
    description_nl: 'Toimijalla on oltava tehokkaat sisaisen valvonnan jarjestelmat, jotka kattavat ICT-prosessit ja tietoturvallisuuden.',
    description: 'The entity shall have effective internal control systems covering ICT processes and information security.',
    category: 'Operatiivisten riskien hallinta',
    iso_mapping: '5.35',
  },

  // === Ulkoistamisvaatimukset (Outsourcing Requirements) ===
  {
    control_number: 'FIVA-ULK-01',
    title_nl: 'Ulkoistamispolitiikka',
    title: 'Outsourcing policy',
    description_nl: 'Toimijalla on oltava ulkoistamispolitiikka, joka maarittelee ulkoistamisen periaatteet, riskienhallinnan ja valvonnan vaatimukset.',
    description: 'The entity shall have an outsourcing policy defining outsourcing principles, risk management, and oversight requirements.',
    category: 'Ulkoistamisvaatimukset',
    iso_mapping: '5.19',
    source_url: 'https://www.finanssivalvonta.fi/saantely/maaraykset-ja-ohjeet/',
  },
  {
    control_number: 'FIVA-ULK-02',
    title_nl: 'Kriittisten toimintojen ulkoistaminen',
    title: 'Critical function outsourcing',
    description_nl: 'Kriittisten tai tarkeiden toimintojen ulkoistamisesta on ilmoitettava Finanssivalvonnalle etukateisesti. Kriittisyysarviointi on suoritettava ennen ulkoistamista.',
    description: 'Outsourcing of critical or important functions shall be notified to FIN-FSA in advance. A criticality assessment shall be performed before outsourcing.',
    category: 'Ulkoistamisvaatimukset',
    iso_mapping: '5.19',
  },
  {
    control_number: 'FIVA-ULK-03',
    title_nl: 'Ulkoistussopimukset',
    title: 'Outsourcing agreements',
    description_nl: 'Ulkoistussopimuksiin on sisallytettava tietoturvavaatimukset, auditointioikeudet, hairiotilanteista ilmoittaminen ja irtisanomisehdot.',
    description: 'Outsourcing agreements shall include security requirements, audit rights, incident notification, and termination conditions.',
    category: 'Ulkoistamisvaatimukset',
    iso_mapping: '5.20',
  },
  {
    control_number: 'FIVA-ULK-04',
    title_nl: 'Pilvipalveluiden ulkoistaminen',
    title: 'Cloud service outsourcing',
    description_nl: 'Pilvipalveluiden kayttoon liittyvat riskit on arvioitava erikseen. Tietojen sijainti ja lakien soveltaminen on selvitettava.',
    description: 'Risks related to cloud service usage shall be assessed separately. Data location and applicable legislation shall be determined.',
    category: 'Ulkoistamisvaatimukset',
    iso_mapping: '5.23',
  },
  {
    control_number: 'FIVA-ULK-05',
    title_nl: 'Ulkoistusten valvonta',
    title: 'Outsourcing oversight',
    description_nl: 'Toimijan on valvottava ulkoistettuja toimintoja ja arvioitava palveluntarjoajan suoriutumista saannollisesti.',
    description: 'The entity shall monitor outsourced functions and assess service provider performance regularly.',
    category: 'Ulkoistamisvaatimukset',
    iso_mapping: '5.22',
  },

  // === DORA-implementointi (DORA Implementation) ===
  {
    control_number: 'FIVA-DORA-01',
    title_nl: 'Digitaalisen toimintakyvyn varmistaminen',
    title: 'Digital operational resilience assurance',
    description_nl: 'Finanssialan toimijan on varmistettava digitaalinen toimintakykynsyvyys DORA-asetuksen mukaisesti. Tama kattaa ICT-riskienhallinnan, poikkeamaraportoinnin, testauksen ja ulkoistusten hallinnan.',
    description: 'A financial sector entity shall ensure its digital operational resilience in accordance with the DORA regulation. This covers ICT risk management, incident reporting, testing, and outsourcing management.',
    category: 'DORA-implementointi',
    iso_mapping: '5.1',
    source_url: 'https://www.finanssivalvonta.fi/saantely/dora/',
  },
  {
    control_number: 'FIVA-DORA-02',
    title_nl: 'ICT-kolmansien osapuolten riskien hallinta',
    title: 'ICT third-party risk management',
    description_nl: 'Toimijan on yllapidettava rekisteria kaikista ICT-kolmannen osapuolen sopimuksista. Kriittiset ICT-kolmannen osapuolen palveluntarjoajat on tunnistettava.',
    description: 'The entity shall maintain a register of all ICT third-party contracts. Critical ICT third-party service providers shall be identified.',
    category: 'DORA-implementointi',
    iso_mapping: '5.19',
  },
  {
    control_number: 'FIVA-DORA-03',
    title_nl: 'Uhkajohtoiset penetraatiotestaukset (TLPT)',
    title: 'Threat-led penetration testing (TLPT)',
    description_nl: 'Merkittavien toimijoiden on suoritettava uhkajohtoiset penetraatiotestaukset (TLPT) TIBER-FI-kehikon mukaisesti vahintaan kolmen vuoden valein.',
    description: 'Significant entities shall conduct threat-led penetration testing (TLPT) according to the TIBER-FI framework at least every three years.',
    category: 'DORA-implementointi',
    iso_mapping: '8.34',
  },
  {
    control_number: 'FIVA-DORA-04',
    title_nl: 'ICT-poikkeamien luokittelu ja raportointi',
    title: 'ICT incident classification and reporting',
    description_nl: 'ICT-poikkeamat on luokiteltava merkittavyytensa mukaan. Merkittavista poikkeamista on raportoitava Finanssivalvonnalle maaratyn aikataulun mukaisesti.',
    description: 'ICT incidents shall be classified by significance. Significant incidents shall be reported to FIN-FSA according to the specified timeline.',
    category: 'DORA-implementointi',
    iso_mapping: '5.24',
  },
  {
    control_number: 'FIVA-DORA-05',
    title_nl: 'Tietojenvaihtosopimukset',
    title: 'Information sharing arrangements',
    description_nl: 'Toimijat voivat osallistua kyberuhkatietojen vaihtoon luotettavien yhteenliittymien kautta. Tietojenvaihdon on noudatettava tietosuojalainsaadantoa.',
    description: 'Entities may participate in cyber threat intelligence sharing through trusted arrangements. Information sharing shall comply with data protection legislation.',
    category: 'DORA-implementointi',
    iso_mapping: '5.7',
  },

  // === Tietoturvallisuuden perustaso (Security Baseline) ===
  {
    control_number: 'FIVA-TTP-01',
    title_nl: 'Paasynhallinta',
    title: 'Access management',
    description_nl: 'Finanssialan tietojarjestelmien paasynhallinta on toteutettava vahimman oikeuden periaatteella. Etuoikeutettujen kayttajien hallinta on erityisen valvottua.',
    description: 'Access management for financial sector information systems shall follow the principle of least privilege. Privileged user management shall be particularly controlled.',
    category: 'Tietoturvallisuuden perustaso',
    iso_mapping: '5.15',
  },
  {
    control_number: 'FIVA-TTP-02',
    title_nl: 'Tietojen salaus',
    title: 'Data encryption',
    description_nl: 'Finanssialan arkaluonteiset tiedot on salattava levossa ja siirrossa. Salausmenetelmien on noudatettava alan standardeja.',
    description: 'Sensitive financial sector data shall be encrypted at rest and in transit. Encryption methods shall follow industry standards.',
    category: 'Tietoturvallisuuden perustaso',
    iso_mapping: '8.24',
  },
  {
    control_number: 'FIVA-TTP-03',
    title_nl: 'Verkon turvallisuus',
    title: 'Network security',
    description_nl: 'Finanssialan tietoverkot on segmentoitava ja suojattava. Kriittiset jarjestelmat on eristettava omiin verkkosegmentteihin.',
    description: 'Financial sector networks shall be segmented and protected. Critical systems shall be isolated in their own network segments.',
    category: 'Tietoturvallisuuden perustaso',
    iso_mapping: '8.22',
  },
  {
    control_number: 'FIVA-TTP-04',
    title_nl: 'Lokitus ja valvonta',
    title: 'Logging and monitoring',
    description_nl: 'Finanssialan tietojarjestelmien tapahtumat on lokitettava kattavasti. Lokitietoja on analysoitava poikkeamien havaitsemiseksi.',
    description: 'Financial sector information system events shall be logged comprehensively. Log data shall be analyzed for anomaly detection.',
    category: 'Tietoturvallisuuden perustaso',
    iso_mapping: '8.15',
  },
  {
    control_number: 'FIVA-TTP-05',
    title_nl: 'Asiakkaiden tunnistaminen ja todennus',
    title: 'Customer identification and authentication',
    description_nl: 'Finanssipalveluiden asiakkaiden tunnistaminen on toteutettava vahvalla todennuksella PSD2-maksupalveludirektiivin mukaisesti.',
    description: 'Financial service customer identification shall use strong authentication in accordance with the PSD2 Payment Services Directive.',
    category: 'Tietoturvallisuuden perustaso',
    iso_mapping: '8.5',
  },
];

const output = {
  framework: {
    id: 'finanssivalvonta',
    name: 'FIN-FSA ICT and Cybersecurity Requirements',
    name_nl: 'Finanssivalvonnan ICT- ja kyberturvallisuusvaatimukset',
    issuing_body: 'Finanssivalvonta (FIN-FSA)',
    version: '2025',
    effective_date: '2025-01-01',
    scope: 'ICT and cybersecurity requirements for Finnish financial sector entities from Finanssivalvonta (FIN-FSA). Covers ICT risk management, operational risk requirements, outsourcing, DORA implementation (TIBER-FI), and security baseline requirements.',
    scope_sectors: ['finance'],
    structure_description: 'Organized by requirement area: ICT risk management, operational risk management, outsourcing requirements, DORA implementation, and security baseline.',
    source_url: 'https://www.finanssivalvonta.fi/saantely/maaraykset-ja-ohjeet/',
    license: 'Public sector publication',
    language: 'fi+en',
  },
  controls,
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Finanssivalvonta: ${controls.length} controls written to ${OUTPUT_FILE}`);
