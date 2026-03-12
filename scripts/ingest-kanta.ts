// scripts/ingest-kanta.ts
// Generates Kanta-palvelujen tietoturvavaatimukset (Kanta Health Services Security Requirements).
// Source: Kela / THL — Security requirements for Kanta national health data services.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'kanta-tietoturva.json');

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
  // Kayttovaltuushallinta (Access Management)
  { control_number: 'KAN-KV-01', title_nl: 'Kayttovaltuushallinnan periaatteet', title: 'Access management principles', description_nl: 'Kanta-palveluihin liittyvien jarjestelmien kayttovaltuushallinta on toteutettava vahimman oikeuden periaatteella. Kayttooikeudet on sidottava ammatilliseen rooliin.', description: 'Access management for Kanta-connected systems shall follow the principle of least privilege. Access rights shall be tied to professional role.', category: 'Kayttovaltuushallinta', iso_mapping: '5.15', source_url: 'https://www.kanta.fi/tietoturva' },
  { control_number: 'KAN-KV-02', title_nl: 'Terveydenhuollon ammattihenkilon tunnistaminen', title: 'Healthcare professional identification', description_nl: 'Kanta-palveluja kayttavan terveydenhuollon ammattihenkilon henkilollisyys on varmennettava terveydenhuollon ammattikortin (TEO-kortin) tai vastaavan vahvan tunnistautumisen avulla.', description: 'Identity of healthcare professionals using Kanta services shall be verified using a healthcare professional card (TEO card) or equivalent strong authentication.', category: 'Kayttovaltuushallinta', iso_mapping: '8.5' },
  { control_number: 'KAN-KV-03', title_nl: 'Potilaan tunnistaminen', title: 'Patient identification', description_nl: 'Potilaan henkilollisyys on varmennettava luotettavasti ennen potilastietojen hakua Kanta-palveluista.', description: 'Patient identity shall be reliably verified before retrieving patient records from Kanta services.', category: 'Kayttovaltuushallinta', iso_mapping: '8.5' },
  { control_number: 'KAN-KV-04', title_nl: 'Kayttooikeuksien katselmointi', title: 'Access rights review', description_nl: 'Kanta-palveluihin liittyvat kayttooikeudet on katselmoitava vahintaan vuosittain ja tarpeettomat oikeudet on poistettava.', description: 'Access rights to Kanta services shall be reviewed at least annually and unnecessary rights removed.', category: 'Kayttovaltuushallinta', iso_mapping: '5.18' },

  // Lokitus ja valvonta (Logging and Monitoring)
  { control_number: 'KAN-LOK-01', title_nl: 'Potilastietojen kasittelyn lokitus', title: 'Patient data processing logging', description_nl: 'Kaikki potilastietojen kasittelytapahtumat on lokitettava: tietojen katselu, tallennus, muuttaminen, tulostus ja lahettaminen.', description: 'All patient data processing events shall be logged: viewing, saving, modification, printing, and sending.', category: 'Lokitus ja valvonta', iso_mapping: '8.15' },
  { control_number: 'KAN-LOK-02', title_nl: 'Lokitietojen sisalto', title: 'Log data content', description_nl: 'Lokitietojen on sisallettava vahintaan: kayttajan tunniste, tapahtuman tyyppi, kohteena oleva potilas, aikaleima ja kaytettava jarjestelma.', description: 'Log data shall contain at minimum: user identifier, event type, target patient, timestamp, and system used.', category: 'Lokitus ja valvonta', iso_mapping: '8.15' },
  { control_number: 'KAN-LOK-03', title_nl: 'Lokitietojen sailytys', title: 'Log data retention', description_nl: 'Potilastietojen kasittelya koskevat lokitiedot on sailytettava vahintaan 12 vuotta.', description: 'Log data concerning patient data processing shall be retained for at least 12 years.', category: 'Lokitus ja valvonta', iso_mapping: '8.15' },
  { control_number: 'KAN-LOK-04', title_nl: 'Lokitietojen valvonta', title: 'Log data monitoring', description_nl: 'Lokitietoja on valvottava saannollisesti luvattoman kayton havaitsemiseksi. Poikkeamahavainnot on tutkittava.', description: 'Log data shall be monitored regularly to detect unauthorized use. Anomalies shall be investigated.', category: 'Lokitus ja valvonta', iso_mapping: '8.16' },
  { control_number: 'KAN-LOK-05', title_nl: 'Potilaan tarkastusoikeus lokitietoihin', title: 'Patient right to access log data', description_nl: 'Potilaalla on oikeus saada tiedot siita, keita hanen potilastietojaan on kasitellyt. Lokitiedot on oltava potilaan saatavilla.', description: 'The patient has the right to know who has accessed their patient data. Log data shall be available to the patient.', category: 'Lokitus ja valvonta' },

  // Tiedonsiirron turvallisuus (Data Transfer Security)
  { control_number: 'KAN-SII-01', title_nl: 'Kanta-yhteyden salaus', title: 'Kanta connection encryption', description_nl: 'Kanta-palveluihin muodostettava yhteys on salattava vahintaan TLS 1.2 -tasoisella salauksella.', description: 'Connections to Kanta services shall be encrypted with at least TLS 1.2 level encryption.', category: 'Tiedonsiirron turvallisuus', iso_mapping: '8.24' },
  { control_number: 'KAN-SII-02', title_nl: 'Viestin eheyden varmistaminen', title: 'Message integrity verification', description_nl: 'Kanta-palveluihin lahetettavien ja niista vastaanotettavien viestien eheys on varmistettava digitaalisella allekirjoituksella.', description: 'Integrity of messages sent to and received from Kanta services shall be verified with digital signatures.', category: 'Tiedonsiirron turvallisuus', iso_mapping: '8.24' },
  { control_number: 'KAN-SII-03', title_nl: 'Tiedonsiirrossa kaytettavat standardit', title: 'Data transfer standards', description_nl: 'Kanta-palveluiden tiedonsiirrossa on kaytettava HL7 CDA R2 -standardia ja Kanta-maarityksia.', description: 'Kanta data transfer shall use the HL7 CDA R2 standard and Kanta specifications.', category: 'Tiedonsiirron turvallisuus' },

  // Varmennevaatimukset (Certificate Requirements)
  { control_number: 'KAN-VAR-01', title_nl: 'Organisaatiovarmenne', title: 'Organization certificate', description_nl: 'Kanta-palveluihin liittyvalla organisaatiolla on oltava Vaestorekisterikeskuksen myontama organisaatiovarmenne.', description: 'Organizations connecting to Kanta services shall have an organization certificate issued by the Population Register Centre.', category: 'Varmennevaatimukset', iso_mapping: '8.24' },
  { control_number: 'KAN-VAR-02', title_nl: 'Ammattihenkilon varmenne', title: 'Professional certificate', description_nl: 'Terveydenhuollon ammattihenkiloilla on oltava terveydenhuollon ammattikortti (TEO-kortti) tai vastaava toimikorttipohjainen varmenne.', description: 'Healthcare professionals shall have a healthcare professional card (TEO card) or equivalent smart card-based certificate.', category: 'Varmennevaatimukset', iso_mapping: '8.5' },
  { control_number: 'KAN-VAR-03', title_nl: 'Varmenteiden hallinta', title: 'Certificate management', description_nl: 'Varmenteiden voimassaoloaikaa on seurattava ja vanhenevat varmenteet on uusittava ajoissa. Kompromissoituneet varmenteet on peruutettava viipymatta.', description: 'Certificate validity shall be monitored and expiring certificates renewed in time. Compromised certificates shall be revoked promptly.', category: 'Varmennevaatimukset', iso_mapping: '8.24' },

  // Potilastietojarjestelman vaatimukset (Patient Record System Requirements)
  { control_number: 'KAN-PTJ-01', title_nl: 'A-luokan jarjestelmasertifiointi', title: 'Class A system certification', description_nl: 'Kanta-palveluihin liitettavan potilastietojarjestelman on lapaistava A-luokan sertifiointi.', description: 'Patient record systems connecting to Kanta services shall pass Class A certification.', category: 'Potilastietojarjestelman vaatimukset' },
  { control_number: 'KAN-PTJ-02', title_nl: 'Rakenteinen kirjaaminen', title: 'Structured documentation', description_nl: 'Potilastietojarjestelman on tuettava rakenteista kirjaamista Kanta-maaritysten mukaisesti.', description: 'The patient record system shall support structured documentation according to Kanta specifications.', category: 'Potilastietojarjestelman vaatimukset' },
  { control_number: 'KAN-PTJ-03', title_nl: 'Tietojen eheys', title: 'Data integrity', description_nl: 'Potilastietojarjestelman on varmistettava potilastietojen eheys tallennuksen ja siirron aikana.', description: 'The patient record system shall ensure patient data integrity during storage and transfer.', category: 'Potilastietojarjestelman vaatimukset', iso_mapping: '8.24' },
  { control_number: 'KAN-PTJ-04', title_nl: 'Suostumusten hallinta', title: 'Consent management', description_nl: 'Potilastietojarjestelman on tuettava potilaan suostumuksen ja kieltojen hallintaa Kanta-maaritysten mukaisesti.', description: 'The patient record system shall support patient consent and prohibition management according to Kanta specifications.', category: 'Potilastietojarjestelman vaatimukset' },

  // Tietoturvallisuuden hallinta (Security Management)
  { control_number: 'KAN-HAL-01', title_nl: 'Tietoturvasuunnitelma', title: 'Security plan', description_nl: 'Kanta-palveluihin liittyva organisaatio on laadittava tietoturvasuunnitelma, joka kattaa Kanta-kayton erityisvaatimukset.', description: 'Organizations connecting to Kanta services shall prepare a security plan covering Kanta-specific requirements.', category: 'Tietoturvallisuuden hallinta', iso_mapping: '5.1' },
  { control_number: 'KAN-HAL-02', title_nl: 'Tietoturvan omavalvonta', title: 'Security self-monitoring', description_nl: 'Organisaation on suoritettava tietoturvan omavalvontaa, joka kattaa Kanta-vaatimusten noudattamisen seurannan.', description: 'The organization shall perform security self-monitoring covering compliance monitoring of Kanta requirements.', category: 'Tietoturvallisuuden hallinta', iso_mapping: '5.35' },
  { control_number: 'KAN-HAL-03', title_nl: 'Henkiloston koulutus', title: 'Personnel training', description_nl: 'Kanta-palveluja kayttavalle henkilostolle on jarjestettava koulutus potilastietojen turvallisesta kasittelysta ja tietosuojavaatimuksista.', description: 'Training on secure patient data handling and privacy requirements shall be provided to personnel using Kanta services.', category: 'Tietoturvallisuuden hallinta', iso_mapping: '6.3' },
  { control_number: 'KAN-HAL-04', title_nl: 'Hairiotilanteisiin varautuminen', title: 'Incident preparedness', description_nl: 'Organisaation on varauduttava Kanta-palveluiden hairioihin varajarjestelmilla ja manuaalisilla toimintatavoilla.', description: 'The organization shall prepare for Kanta service disruptions with backup systems and manual procedures.', category: 'Tietoturvallisuuden hallinta', iso_mapping: '5.29' },

  // Tietosuoja (Data Protection)
  { control_number: 'KAN-TSU-01', title_nl: 'Potilaan informointi', title: 'Patient notification', description_nl: 'Potilasta on informoitava Kanta-palvelujen kaytosta, potilastietojen kasittelysta ja potilaan oikeuksista.', description: 'The patient shall be informed about Kanta service usage, patient data processing, and patient rights.', category: 'Tietosuoja' },
  { control_number: 'KAN-TSU-02', title_nl: 'Kielto-oikeus', title: 'Right to prohibit', description_nl: 'Potilaan oikeus kieltaa tietojensa luovutus Kanta-palveluista on toteutettava jarjestelmassa.', description: 'The patient right to prohibit disclosure of their data from Kanta services shall be implemented in the system.', category: 'Tietosuoja' },
  { control_number: 'KAN-TSU-03', title_nl: 'Tietoturvaloukkausten ilmoittaminen', title: 'Breach notification', description_nl: 'Potilastietoihin kohdistuvista tietoturvaloukkauksista on ilmoitettava Valviralle ja tietosuojavaltuutetulle saadettyjen maaraaikojen puitteissa.', description: 'Breaches involving patient data shall be reported to Valvira and the Data Protection Ombudsman within required timeframes.', category: 'Tietosuoja', iso_mapping: '5.24' },
];

const output = {
  framework: {
    id: 'kanta-tietoturva',
    name: 'Kanta Health Services Security Requirements',
    name_nl: 'Kanta-palvelujen tietoturvavaatimukset',
    issuing_body: 'Kela / THL',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Security requirements for organizations connecting to Kanta national health data services (Patient Data Repository, Prescription Centre, My Kanta Pages). Covers access management, logging, data transfer security, certificate requirements, and patient record system certification.',
    scope_sectors: ['healthcare'],
    structure_description: 'Organized by requirement domain: access management, logging and monitoring, data transfer security, certificate requirements, patient record system requirements, security management, and data protection.',
    source_url: 'https://www.kanta.fi/tietoturva',
    license: 'Public sector publication',
    language: 'fi+en',
  },
  controls,
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Kanta: ${controls.length} controls written to ${OUTPUT_FILE}`);
