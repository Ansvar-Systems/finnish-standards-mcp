// scripts/ingest-terveydenhuolto.ts
// Generates Finnish healthcare IT security requirements beyond Kanta.
// Source: THL, Valvira, STM — healthcare information system and data protection requirements.
// Covers: electronic prescriptions, patient information systems, Valvira IT requirements,
// STM security guidance, Kanta certification expansion, and Apotti/Epic requirements.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'terveydenhuolto-tietoturva.json');

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
  // === THL: Sahkoisen laakemaarayksen tietoturva (Electronic Prescription Security) ===
  {
    control_number: 'THL-RES-01',
    title_nl: 'Sahkoisen laakemaarayksen allekirjoitus',
    title: 'Electronic prescription signing',
    description_nl: 'Sahkoinen laakemaarays on allekirjoitettava laakaarin henkilokohtaisella terveydenhuollon ammattikortilla (TEO-kortti). Organisaatiovarmennetta ei saa kayttaa allekirjoitukseen.',
    description: 'Electronic prescriptions shall be signed with the prescriber personal healthcare professional card (TEO card). Organization certificates shall not be used for signing.',
    category: 'Sahkoinen laakemaarays',
    iso_mapping: '8.24',
    source_url: 'https://www.kanta.fi/sahkoinen-resepti',
  },
  {
    control_number: 'THL-RES-02',
    title_nl: 'Laakemaaraystietojen suojaus',
    title: 'Prescription data protection',
    description_nl: 'Laakemaaraystiedot on suojattava siirrossa ja tallennuksessa. Tietojen katseluoikeuksia on rajoitettava hoitosuhteen perusteella.',
    description: 'Prescription data shall be protected in transit and storage. Viewing rights shall be restricted based on the care relationship.',
    category: 'Sahkoinen laakemaarays',
    iso_mapping: '5.15',
  },
  {
    control_number: 'THL-RES-03',
    title_nl: 'Laakemaaraysten lokitus',
    title: 'Prescription logging',
    description_nl: 'Kaikki laakemaaraysten katselu-, laadinta- ja toimitustapahtumien on oltava lokitettuja. Lokitiedot on sailytettava vahintaan 12 vuotta.',
    description: 'All prescription viewing, creation, and dispensing events shall be logged. Log data shall be retained for at least 12 years.',
    category: 'Sahkoinen laakemaarays',
    iso_mapping: '8.15',
  },
  {
    control_number: 'THL-RES-04',
    title_nl: 'Apteekkijarjestelmien vaatimukset',
    title: 'Pharmacy system requirements',
    description_nl: 'Apteekkijarjestelmien on taytettava Kanta-palveluiden tietoturvavaatimukset ja tuettava sahkoisten laakemaaraysten turvallista kasittelya.',
    description: 'Pharmacy systems shall meet Kanta services security requirements and support secure handling of electronic prescriptions.',
    category: 'Sahkoinen laakemaarays',
  },

  // === THL: Potilastietojarjestelmien vaatimukset (Patient Information System Requirements) ===
  {
    control_number: 'THL-PTJ-01',
    title_nl: 'Potilastietojarjestelman luokkavaatimukset',
    title: 'Patient information system class requirements',
    description_nl: 'Potilastietojarjestelmat jaetaan A- ja B-luokkiin. A-luokan jarjestelman on lapaistava THL:n olennaiset vaatimukset kattava sertifiointi.',
    description: 'Patient information systems are divided into Class A and Class B. Class A systems shall pass THL comprehensive essential requirements certification.',
    category: 'Potilastietojarjestelmat',
    source_url: 'https://thl.fi/tietojarjestelmapalvelut/tiedonhallinta-sosiaali-ja-terveysalalla',
  },
  {
    control_number: 'THL-PTJ-02',
    title_nl: 'Kayttajien tunnistaminen ja roolipohjainen paasynhallinta',
    title: 'User identification and role-based access control',
    description_nl: 'Potilastietojarjestelmassa on toteutettava roolipohjainen paasynhallinta. Kayttajan ammattioikeudet on tarkistettava Valviran Terhikki-rekisterista.',
    description: 'Role-based access control shall be implemented in patient information systems. User professional rights shall be verified from the Valvira Terhikki register.',
    category: 'Potilastietojarjestelmat',
    iso_mapping: '5.15',
  },
  {
    control_number: 'THL-PTJ-03',
    title_nl: 'Hatakayttomenettely',
    title: 'Emergency access procedure',
    description_nl: 'Potilastietojarjestelmassa on oltava hatakayttomenettely, joka mahdollistaa potilastietojen katselun hatadilanteessa tavanomaisesta paasynohjaussta poiketen. Hatakaytoista on luotava lokimerkinta.',
    description: 'Patient information systems shall have an emergency access procedure enabling patient data viewing in emergencies outside normal access control. Emergency access shall be logged.',
    category: 'Potilastietojarjestelmat',
    iso_mapping: '5.15',
  },
  {
    control_number: 'THL-PTJ-04',
    title_nl: 'Rakenteinen potilaskertomus',
    title: 'Structured patient record',
    description_nl: 'Potilastietojarjestelman on tuettava rakenteista potilaskertomusta (CDA R2). Tietorakenteiden on noudatettava THL:n maarityksia.',
    description: 'Patient information systems shall support the structured patient record (CDA R2). Data structures shall follow THL specifications.',
    category: 'Potilastietojarjestelmat',
  },
  {
    control_number: 'THL-PTJ-05',
    title_nl: 'Jarjestelman saatavuusvaatimukset',
    title: 'System availability requirements',
    description_nl: 'Potilastietojarjestelman saatavuuden on oltava riittava turvallisen hoidon takaamiseksi. Varajarjestelyt on laadittava hairiotilanteita varten.',
    description: 'Patient information system availability shall be sufficient to ensure safe care. Backup arrangements shall be prepared for disruptions.',
    category: 'Potilastietojarjestelmat',
    iso_mapping: '8.14',
  },
  {
    control_number: 'THL-PTJ-06',
    title_nl: 'Tietojen eheys ja oikeellisuus',
    title: 'Data integrity and accuracy',
    description_nl: 'Potilastietojen eheys on varmistettava tiedon tallennuksen, muokkauksen ja siirron aikana. Tietojen muutoshistoria on sailytettava.',
    description: 'Patient data integrity shall be ensured during storage, modification, and transfer. Data change history shall be retained.',
    category: 'Potilastietojarjestelmat',
    iso_mapping: '8.24',
  },

  // === Valviran tietojarjestelmavaatimukset (Valvira IT System Requirements) ===
  {
    control_number: 'VALV-01',
    title_nl: 'Terveydenhuollon ammattihenkilorekisterin tarkistus',
    title: 'Healthcare professional register verification',
    description_nl: 'Tietojarjestelmien on tarkistettava kayttajan ammattioikeudet Valviran Terhikki-rekisterista ennen paasynhallinta myontamista potilastietoihin.',
    description: 'Information systems shall verify user professional rights from the Valvira Terhikki register before granting access to patient data.',
    category: 'Valviran vaatimukset',
    iso_mapping: '8.5',
    source_url: 'https://www.valvira.fi/terveydenhuolto/terveydenhuollon_tietojarjestelmat',
  },
  {
    control_number: 'VALV-02',
    title_nl: 'Omavalvontaohjelma',
    title: 'Self-monitoring programme',
    description_nl: 'Sosiaali- ja terveydenhuollon palveluntuottajan on laadittava omavalvontaohjelma, joka kattaa tietoturvallisuuden ja tietosuojan.',
    description: 'Social and healthcare service providers shall prepare a self-monitoring programme covering information security and data protection.',
    category: 'Valviran vaatimukset',
    iso_mapping: '5.35',
  },
  {
    control_number: 'VALV-03',
    title_nl: 'Potilasturvallisuusilmoitukset',
    title: 'Patient safety notifications',
    description_nl: 'Tietojarjestelmavioista, jotka vaarantavat potilasturvallisuuden, on ilmoitettava Valviralle viipymatta.',
    description: 'Information system failures that endanger patient safety shall be reported to Valvira without delay.',
    category: 'Valviran vaatimukset',
    iso_mapping: '5.24',
  },
  {
    control_number: 'VALV-04',
    title_nl: 'Laiteturvallisuus ja CE-merkinta',
    title: 'Device safety and CE marking',
    description_nl: 'Laakinnallisiksi laitteiksi luokiteltavien tietojarjestelmien on taytettava EU:n MDR-asetuksen vaatimukset ja CE-merkinta.',
    description: 'Information systems classified as medical devices shall meet EU MDR regulation requirements and CE marking.',
    category: 'Valviran vaatimukset',
  },

  // === STM tietoturvaohje (Ministry of Social Affairs Security Guidance) ===
  {
    control_number: 'STM-01',
    title_nl: 'Sosiaali- ja terveystietojen suojaaminen',
    title: 'Social and health data protection',
    description_nl: 'Sosiaali- ja terveystiedot on suojattava erityisina henkilotietoryhmina. Kasittelyyn on oltava nimenomainen oikeusperuste.',
    description: 'Social and health data shall be protected as special categories of personal data. Processing requires an explicit legal basis.',
    category: 'STM tietoturvaohje',
    iso_mapping: '5.34',
    source_url: 'https://stm.fi/tietosuoja',
  },
  {
    control_number: 'STM-02',
    title_nl: 'Asiakas- ja potilastietojen luovutus',
    title: 'Client and patient data disclosure',
    description_nl: 'Asiakas- ja potilastietojen luovuttaminen on toteutettava lainsaadannon mukaisesti. Luovutukset on lokitettava ja potilasta on informoitava.',
    description: 'Client and patient data disclosure shall be implemented in accordance with legislation. Disclosures shall be logged and the patient informed.',
    category: 'STM tietoturvaohje',
    iso_mapping: '5.14',
  },
  {
    control_number: 'STM-03',
    title_nl: 'Tietoturvallisuuskoulutus terveydenhuollossa',
    title: 'Security training in healthcare',
    description_nl: 'Terveydenhuollon henkilostolle on jarjestettava saannollista tietoturva- ja tietosuojakoulutusta, joka kattaa potilastietojen turvallisen kasittelyn.',
    description: 'Healthcare personnel shall receive regular security and privacy training covering secure handling of patient data.',
    category: 'STM tietoturvaohje',
    iso_mapping: '6.3',
  },
  {
    control_number: 'STM-04',
    title_nl: 'Tietoturvapoikkeamien hallinta terveydenhuollossa',
    title: 'Security incident management in healthcare',
    description_nl: 'Terveydenhuollon tietoturvapoikkeamiin on reagoitava viipymatta. Potilastietoihin kohdistuvista loukkauksista on ilmoitettava tietosuojavaltuutetulle ja tarvittaessa Valviralle.',
    description: 'Healthcare security incidents shall be responded to without delay. Breaches involving patient data shall be reported to the Data Protection Ombudsman and to Valvira if necessary.',
    category: 'STM tietoturvaohje',
    iso_mapping: '5.24',
  },
  {
    control_number: 'STM-05',
    title_nl: 'Terveydenhuollon tietojarjestelmien hankinnat',
    title: 'Healthcare IT system procurement',
    description_nl: 'Terveydenhuollon tietojarjestelmien hankinnassa on maariteltava tietoturva- ja tietosuojavaatimukset osana hankintakriteereja.',
    description: 'Information security and data protection requirements shall be defined as part of procurement criteria for healthcare IT systems.',
    category: 'STM tietoturvaohje',
    iso_mapping: '5.23',
  },

  // === Kanta-sertifiointivaatimukset (Kanta Certification Requirements) ===
  {
    control_number: 'KSER-01',
    title_nl: 'Olennaiset vaatimukset -sertifiointi',
    title: 'Essential requirements certification',
    description_nl: 'A-luokan potilastietojarjestelman on lapaistava olennaiset vaatimukset -sertifiointi ennen Kanta-palveluihin liittymista. Sertifiointi kattaa toiminnalliset ja tietoturvavaatimukset.',
    description: 'Class A patient information systems shall pass essential requirements certification before connecting to Kanta services. Certification covers functional and security requirements.',
    category: 'Kanta-sertifiointi',
    source_url: 'https://thl.fi/tietojarjestelmapalvelut/olennaiset-vaatimukset',
  },
  {
    control_number: 'KSER-02',
    title_nl: 'Yhteistestaus Kanta-palveluiden kanssa',
    title: 'Integration testing with Kanta services',
    description_nl: 'Tietojarjestelmien on lapaistava yhteistestaus Kanta-palveluiden kanssa ennen tuotantokayttoa. Testauksen on katettava tiedonsiirron eheys ja tietoturva.',
    description: 'Information systems shall pass integration testing with Kanta services before production use. Testing shall cover data transfer integrity and security.',
    category: 'Kanta-sertifiointi',
    iso_mapping: '8.29',
  },
  {
    control_number: 'KSER-03',
    title_nl: 'Sertifioinnin yllapito',
    title: 'Certification maintenance',
    description_nl: 'Sertifioidun jarjestelman merkittavat muutokset edellyttavat uudelleensertifiointia. Sertifioinnin voimassaoloa on seurattava.',
    description: 'Significant changes to a certified system require recertification. Certification validity shall be monitored.',
    category: 'Kanta-sertifiointi',
  },
  {
    control_number: 'KSER-04',
    title_nl: 'Tietosuojan vaikutustenarviointi terveydenhuollossa',
    title: 'DPIA in healthcare',
    description_nl: 'Potilastietojarjestelman kayttoonoton yhteydessa on suoritettava tietosuojan vaikutustenarviointi (DPIA), joka kattaa potilastietojen kasittelyn riskit.',
    description: 'A data protection impact assessment (DPIA) shall be conducted when deploying a patient information system, covering risks of patient data processing.',
    category: 'Kanta-sertifiointi',
    iso_mapping: '5.34',
  },

  // === Alueelliset terveys-IT-vaatimukset (Regional Health IT Requirements) ===
  {
    control_number: 'ALUE-01',
    title_nl: 'Alueellisen tietojarjestelman integraatioturvallisuus',
    title: 'Regional system integration security',
    description_nl: 'Alueellisten terveydenhuollon tietojarjestelmien (kuten Apotti/Epic) integraatioiden tietoturva on varmistettava standardoitujen rajapintojen kautta.',
    description: 'Security of regional healthcare information system (such as Apotti/Epic) integrations shall be ensured through standardized interfaces.',
    category: 'Alueelliset vaatimukset',
    iso_mapping: '8.25',
  },
  {
    control_number: 'ALUE-02',
    title_nl: 'Tietojen yhteiskaytto alueen sisalla',
    title: 'Data sharing within region',
    description_nl: 'Tietojen yhteiskaytto alueen terveydenhuollon toimijoiden kesken on toteutettava turvallisesti ja lainsaadannon mukaisesti.',
    description: 'Data sharing between regional healthcare providers shall be implemented securely and in accordance with legislation.',
    category: 'Alueelliset vaatimukset',
    iso_mapping: '5.14',
  },
  {
    control_number: 'ALUE-03',
    title_nl: 'Moniasiakkuuden hallinta',
    title: 'Multi-tenancy management',
    description_nl: 'Alueellisen jarjestelman on eristettava eri organisaatioiden tiedot toisistaan. Paasynhallinta on toteutettava organisaatiorajat huomioiden.',
    description: 'The regional system shall isolate data of different organizations from each other. Access management shall be implemented considering organizational boundaries.',
    category: 'Alueelliset vaatimukset',
    iso_mapping: '5.15',
  },
];

const output = {
  framework: {
    id: 'terveydenhuolto-tietoturva',
    name: 'Healthcare IT Security Requirements',
    name_nl: 'Terveydenhuollon tietojarjestelmien tietoturvavaatimukset',
    issuing_body: 'THL / Valvira / STM',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Comprehensive healthcare IT security requirements from Finnish health authorities. Covers electronic prescription security, patient information system requirements, Valvira IT requirements, Ministry of Social Affairs guidance, Kanta certification, and regional health IT platform requirements.',
    scope_sectors: ['healthcare'],
    structure_description: 'Organized by authority and domain: THL electronic prescriptions, THL patient information systems, Valvira requirements, STM security guidance, Kanta certification, and regional health IT requirements.',
    source_url: 'https://thl.fi/tietojarjestelmapalvelut',
    license: 'Public sector publication',
    language: 'fi+en',
  },
  controls,
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Terveydenhuolto: ${controls.length} controls written to ${OUTPUT_FILE}`);
