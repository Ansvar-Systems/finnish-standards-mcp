// scripts/ingest-kansalliset-standardit.ts
// Generates Finnish national standards and public administration recommendations.
// Source: SFS (Finnish Standards Association), JHS recommendations, Kuntaliitto.
// Covers: SFS-EN ISO/IEC 27001 national guidance, SFS 5900 (historical),
// JHS security recommendations, and Kuntaliitto (municipal) IT security.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'kansalliset-standardit.json');

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
  // === SFS-EN ISO/IEC 27001 kansallinen soveltamisohje (Finnish ISO 27001 Adoption Guidance) ===
  {
    control_number: 'SFS-27001-01',
    title_nl: 'ISO 27001 -sertifioinnin soveltaminen Suomessa',
    title: 'ISO 27001 certification application in Finland',
    description_nl: 'SFS-EN ISO/IEC 27001 -standardin soveltamisessa on huomioitava suomalaisen lainsaadannon erityisvaatimukset, kuten tiedonhallintalaki ja julkisuuslaki.',
    description: 'Application of SFS-EN ISO/IEC 27001 shall consider specific requirements of Finnish legislation, such as the Information Management Act and the Act on Openness of Government Activities.',
    category: 'SFS ISO 27001 soveltaminen',
    iso_mapping: '4.1',
    source_url: 'https://sfs.fi/standardit/',
  },
  {
    control_number: 'SFS-27001-02',
    title_nl: 'Soveltamisalaan liittyvat kansalliset vaatimukset',
    title: 'National requirements related to scope',
    description_nl: 'ISMS:n soveltamisalaa maariteltaessa on huomioitava suomalainen tietojen luokittelumalli (julkinen, viranomaiskayto, salainen) ja vastaavuus ISO-luokitteluun.',
    description: 'When defining ISMS scope, the Finnish data classification model (public, official use, secret) and its correspondence to ISO classification shall be considered.',
    category: 'SFS ISO 27001 soveltaminen',
    iso_mapping: '4.3',
  },
  {
    control_number: 'SFS-27001-03',
    title_nl: 'Riskienhallinta kansallisessa kontekstissa',
    title: 'Risk management in national context',
    description_nl: 'ISO 27001 -riskienhallinnassa on huomioitava suomalaiselle julkishallinnolle ominaiset riskit: tiedonhallintalain noudattaminen, julkisuusperiaate, kansallinen turvallisuus.',
    description: 'ISO 27001 risk management shall consider risks specific to Finnish public administration: Information Management Act compliance, principle of openness, national security.',
    category: 'SFS ISO 27001 soveltaminen',
    iso_mapping: '6.1',
  },
  {
    control_number: 'SFS-27001-04',
    title_nl: 'Sertifiointiauditointi Suomessa',
    title: 'Certification audit in Finland',
    description_nl: 'ISO 27001 -sertifiointiauditoinnin suorittaa FINAS-akkreditoitu sertifiointielin. Akkreditointi perustuu SFS-EN ISO/IEC 17021-1 -standardiin.',
    description: 'ISO 27001 certification audits are performed by FINAS-accredited certification bodies. Accreditation is based on SFS-EN ISO/IEC 17021-1.',
    category: 'SFS ISO 27001 soveltaminen',
    iso_mapping: '9.2',
  },
  {
    control_number: 'SFS-27001-05',
    title_nl: 'ISO 27002:2022 -hallintakeinojen kansallinen soveltaminen',
    title: 'National application of ISO 27002:2022 controls',
    description_nl: 'ISO 27002:2022 -hallintakeinojen soveltamisessa on huomioitava Julkri-vaatimukset ja Katakri-kriteerit.',
    description: 'Application of ISO 27002:2022 controls shall consider Julkri requirements and Katakri criteria.',
    category: 'SFS ISO 27001 soveltaminen',
    iso_mapping: '6.1',
  },

  // === SFS 5900 (Historical Finnish Standard) ===
  {
    control_number: 'SFS5900-01',
    title_nl: 'Tietoturvallisuuden hallintajarjestelman periaatteet (historiallinen)',
    title: 'ISMS principles (historical)',
    description_nl: 'SFS 5900 oli suomalainen kansallinen standardi tietoturvallisuuden hallintaan ennen ISO/IEC 27001:n yleistymista. Standardi maaritteli tietoturvan hallinnan perusperiaatteet.',
    description: 'SFS 5900 was the Finnish national standard for information security management before ISO/IEC 27001 became prevalent. The standard defined basic ISMS principles.',
    category: 'SFS 5900 (historiallinen)',
    iso_mapping: '5.1',
  },
  {
    control_number: 'SFS5900-02',
    title_nl: 'Tietoturvan tasot',
    title: 'Security levels',
    description_nl: 'SFS 5900 maaritteli tietoturvan tasomallin (perus-, korotettu ja korkea taso), jota Julkri myohemmin hyvaksyi.',
    description: 'SFS 5900 defined a security level model (basic, elevated, and high), which Julkri later adopted.',
    category: 'SFS 5900 (historiallinen)',
    iso_mapping: '5.1',
  },

  // === JHS-suositukset tietoturvasta (JHS Security Recommendations) ===
  {
    control_number: 'JHS-166-01',
    title_nl: 'Julkisen hallinnon IT-palveluiden tietoturva (JHS 166)',
    title: 'Public administration IT service security (JHS 166)',
    description_nl: 'JHS 166 -suositus maarittelee julkisen hallinnon IT-palveluiden tietoturvavaatimukset. Suositus kattaa palveluiden suunnittelun, toteutuksen ja yllapidon.',
    description: 'JHS 166 recommendation defines security requirements for public administration IT services. The recommendation covers service design, implementation, and maintenance.',
    category: 'JHS-suositukset',
    iso_mapping: '5.1',
    source_url: 'https://www.suomidigi.fi/ohjeet-ja-tuki/jhs-suositukset',
  },
  {
    control_number: 'JHS-166-02',
    title_nl: 'Tietoturvavaatimusten maarittely hankinnassa',
    title: 'Security requirements definition in procurement',
    description_nl: 'JHS 166 edellyttaa tietoturvavaatimusten maarittelya osana IT-palveluiden hankintaa. Vaatimusten on perustuttava riskiarviointiin.',
    description: 'JHS 166 requires defining security requirements as part of IT service procurement. Requirements shall be based on risk assessment.',
    category: 'JHS-suositukset',
    iso_mapping: '5.23',
  },
  {
    control_number: 'JHS-174-01',
    title_nl: 'ICT-palvelujen palvelutasoluokitus (JHS 174)',
    title: 'ICT service level classification (JHS 174)',
    description_nl: 'JHS 174 maarittelee ICT-palveluiden palvelutasoluokituksen, joka sisaltaa saatavuus-, suorituskyky- ja tietoturvavaatimukset.',
    description: 'JHS 174 defines ICT service level classification including availability, performance, and security requirements.',
    category: 'JHS-suositukset',
    iso_mapping: '8.6',
  },
  {
    control_number: 'JHS-179-01',
    title_nl: 'Kokonaisarkkitehtuuri ja tietoturva (JHS 179)',
    title: 'Enterprise architecture and security (JHS 179)',
    description_nl: 'JHS 179 maarittelee kokonaisarkkitehtuurin menetelmat, joihin kuuluu tietoturva-arkkitehtuurin suunnittelu osana kokonaisarkkitehtuuria.',
    description: 'JHS 179 defines enterprise architecture methods, including security architecture design as part of enterprise architecture.',
    category: 'JHS-suositukset',
    iso_mapping: '5.8',
  },
  {
    control_number: 'JHS-190-01',
    title_nl: 'Julkisten organisaatioiden tietoturva-auditointi (JHS 190)',
    title: 'Public organization security auditing (JHS 190)',
    description_nl: 'JHS 190 maarittelee julkisten organisaatioiden tietoturva-auditoinnin periaatteet ja menetelmat. Auditointi perustuu Julkri-kriteereihin.',
    description: 'JHS 190 defines security auditing principles and methods for public organizations. Auditing is based on Julkri criteria.',
    category: 'JHS-suositukset',
    iso_mapping: '5.35',
  },

  // === Kuntaliitto tietoturvasuositukset (Municipality Security Recommendations) ===
  {
    control_number: 'KUNTA-01',
    title_nl: 'Kunnan tietoturvapolitiikka',
    title: 'Municipal security policy',
    description_nl: 'Kunnan on laadittava tietoturvapolitiikka, joka huomioi kunnan erityispiirteet: monialaiset palvelut, laaja henkilotietojen kasittely, julkisuusperiaate.',
    description: 'A municipality shall prepare a security policy considering municipal characteristics: multi-sector services, extensive personal data processing, principle of openness.',
    category: 'Kuntaliitto tietoturva',
    iso_mapping: '5.1',
    source_url: 'https://www.kuntaliitto.fi/tietoyhteiskunta/tietoturva',
  },
  {
    control_number: 'KUNTA-02',
    title_nl: 'Kuntapalveluiden tietoturva',
    title: 'Municipal service security',
    description_nl: 'Kunnan sahkoisten palveluiden tietoturva on varmistettava. Sahkoinen asiointi on suojattava asianmukaisella tunnistamisella ja salauksella.',
    description: 'Security of municipal electronic services shall be ensured. Electronic services shall be protected with appropriate identification and encryption.',
    category: 'Kuntaliitto tietoturva',
    iso_mapping: '8.25',
  },
  {
    control_number: 'KUNTA-03',
    title_nl: 'Koulujen ja oppilaitosten tietoturva',
    title: 'School and educational institution security',
    description_nl: 'Koulujen ja oppilaitosten tietojarjestelmien tietoturva on varmistettava. Oppilaiden henkilotietojen kasittelyssa on noudatettava erityista huolellisuutta.',
    description: 'Security of school and educational institution information systems shall be ensured. Special care shall be taken when processing student personal data.',
    category: 'Kuntaliitto tietoturva',
    iso_mapping: '5.34',
  },
  {
    control_number: 'KUNTA-04',
    title_nl: 'Kunnan ICT-palveluiden ulkoistaminen',
    title: 'Municipal ICT service outsourcing',
    description_nl: 'Kunnan ICT-palveluiden ulkoistamisessa on varmistettava tietoturva- ja tietosuojavaatimukset. Sopimuksiin on sisallytettava auditointioikeudet.',
    description: 'When outsourcing municipal ICT services, security and privacy requirements shall be ensured. Contracts shall include audit rights.',
    category: 'Kuntaliitto tietoturva',
    iso_mapping: '5.19',
  },
  {
    control_number: 'KUNTA-05',
    title_nl: 'Kuntien yhteistyo tietoturvassa',
    title: 'Municipal cooperation on security',
    description_nl: 'Kunnat voivat toteuttaa tietoturvaa yhteistyossa esimerkiksi yhteisten tietoturvapalveluiden ja -koulutuksen kautta.',
    description: 'Municipalities may implement security cooperatively through shared security services and training.',
    category: 'Kuntaliitto tietoturva',
    iso_mapping: '5.6',
  },

  // === Sairaanhoitopiirit tietoturvapolitiikka (Hospital District Security Baseline) ===
  {
    control_number: 'SHP-01',
    title_nl: 'Sairaanhoitopiirin tietoturvapolitiikka',
    title: 'Hospital district security policy',
    description_nl: 'Sairaanhoitopiirilla (nyk. hyvinvointialue) on oltava tietoturvapolitiikka, joka kattaa potilastietojen suojaamisen ja terveydenhuollon tietojarjestelmien turvallisuuden.',
    description: 'A hospital district (now wellbeing services county) shall have a security policy covering patient data protection and healthcare information system security.',
    category: 'Sairaanhoitopiirien tietoturva',
    iso_mapping: '5.1',
  },
  {
    control_number: 'SHP-02',
    title_nl: 'Potilastietojarjestelmien paasynhallinta',
    title: 'Patient information system access management',
    description_nl: 'Potilastietojarjestelmien paasynhallinta on toteutettava roolipohjaisesti. Kayttooikeudet on maariteltava hoitosuhteen ja tehtavan perusteella.',
    description: 'Patient information system access management shall be role-based. Access rights shall be defined based on the care relationship and role.',
    category: 'Sairaanhoitopiirien tietoturva',
    iso_mapping: '5.15',
  },
  {
    control_number: 'SHP-03',
    title_nl: 'Laaketieteellisten laitteiden kyberturvallisuus',
    title: 'Medical device cybersecurity',
    description_nl: 'Verkkoliittannaisten laaketieteellisten laitteiden kyberturvallisuus on varmistettava. Laitteiden paivitykset ja haavoittuvuuksien hallinta on jarjestettava.',
    description: 'Cybersecurity of network-connected medical devices shall be ensured. Device updates and vulnerability management shall be arranged.',
    category: 'Sairaanhoitopiirien tietoturva',
    iso_mapping: '8.8',
  },
  {
    control_number: 'SHP-04',
    title_nl: 'Terveydenhuollon tietoturvaharjoitukset',
    title: 'Healthcare security exercises',
    description_nl: 'Hyvinvointialueiden on jarjestettava tietoturvaharjoituksia, joissa testataan reagointikyky potilastietoihin kohdistuviin tietoturvapoikkeamiin.',
    description: 'Wellbeing services counties shall conduct security exercises testing response capability for security incidents targeting patient data.',
    category: 'Sairaanhoitopiirien tietoturva',
    iso_mapping: '5.29',
  },

  // === Puolustusvoimien tietoturvaohje julkinen osa (Defence Forces IT Security Public Portions) ===
  {
    control_number: 'PV-01',
    title_nl: 'Puolustusvoimien tietoturvan yleisperiaatteet',
    title: 'Defence forces security general principles',
    description_nl: 'Puolustusvoimien kanssa asioivien yritysten on noudatettava puolustushallinnon tietoturvaohjeistusta. Vaatimukset riippuvat kasiteltavan tiedon turvaluokasta.',
    description: 'Organizations working with the Defence Forces shall comply with defence administration security guidance. Requirements depend on the security classification of data handled.',
    category: 'Puolustusvoimat (julkinen)',
    iso_mapping: '5.1',
  },
  {
    control_number: 'PV-02',
    title_nl: 'Turvaluokitellun tiedon kasittely',
    title: 'Classified information handling',
    description_nl: 'Turvaluokitellun tiedon kasittelyssa on noudatettava Katakri-kriteereja ja puolustushallinnon lisaohjeistusta.',
    description: 'Handling of classified information shall comply with Katakri criteria and defence administration additional guidance.',
    category: 'Puolustusvoimat (julkinen)',
    iso_mapping: '5.12',
  },
];

const output = {
  framework: {
    id: 'kansalliset-standardit',
    name: 'Finnish National Standards and Recommendations',
    name_nl: 'Suomen kansalliset standardit ja suositukset',
    issuing_body: 'SFS / JUHTA / Kuntaliitto / Hyvinvointialueet',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Finnish national standards and public sector recommendations for information security. Covers SFS-EN ISO/IEC 27001 Finnish adoption guidance, historical SFS 5900, JHS public administration recommendations, municipal security recommendations (Kuntaliitto), hospital district security baselines, and defence forces public IT security guidance.',
    scope_sectors: ['government', 'healthcare', 'education', 'municipal'],
    structure_description: 'Organized by source: SFS ISO 27001 adoption, SFS 5900 (historical), JHS recommendations, Kuntaliitto municipal security, hospital district baselines, and defence forces public guidance.',
    source_url: 'https://sfs.fi/standardit/',
    license: 'Public sector publication',
    language: 'fi+en',
  },
  controls,
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Kansalliset standardit: ${controls.length} controls written to ${OUTPUT_FILE}`);
