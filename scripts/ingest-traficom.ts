// scripts/ingest-traficom.ts
// Generates Traficom cybersecurity regulations and recommendations.
// Source: Traficom (Liikenne- ja viestintavirasto) — Finnish Transport and Communications Agency.
// Covers: telecom network security regulations, IoT security, cloud security,
// DNS security, email security, and EU cybersecurity certification (EUCC).

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'traficom-maaraykset.json');

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
  implementation_guidance?: string;
  verification_guidance?: string;
  source_url?: string;
}

const controls: Control[] = [
  // === Viestintaverkkojen tietoturva (Communications Network Security) ===
  // Traficom Maarays 67 — binding for telecom operators
  {
    control_number: 'TRAF-VV-01',
    title_nl: 'Viestintaverkon tietoturvan hallintajarjestelma',
    title: 'Communications network security management system',
    description_nl: 'Teleyrityksen on toteutettava tietoturvan hallintajarjestelma, joka kattaa viestintaverkkojen ja -palveluiden suojauksen. Hallintajarjestelman on perustuttava riskiarviointiin.',
    description: 'A telecommunications operator shall implement a security management system covering protection of communications networks and services. The management system shall be based on risk assessment.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '5.1',
    source_url: 'https://www.traficom.fi/fi/viestinta/viestintaverkot/viestintaverkkojen-ja-palvelujen-tietoturva',
  },
  {
    control_number: 'TRAF-VV-02',
    title_nl: 'Viestintaverkon hairiotilanteisiin varautuminen',
    title: 'Communications network incident preparedness',
    description_nl: 'Teleyrityksen on varauduttava viestintaverkkojen hairioihin ja niista toipumiseen. Varautumissuunnitelma on testattava vuosittain.',
    description: 'A telecommunications operator shall prepare for network disruptions and recovery. The preparedness plan shall be tested annually.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '5.29',
  },
  {
    control_number: 'TRAF-VV-03',
    title_nl: 'Viestintaverkon fyysinen suojaus',
    title: 'Communications network physical protection',
    description_nl: 'Viestintaverkon kriittiset laitteet ja solmupisteet on suojattava fyysiselta luvattomalta paasylta ja ymparistouhin.',
    description: 'Critical equipment and nodes of the communications network shall be protected against physical unauthorized access and environmental threats.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '7.1',
  },
  {
    control_number: 'TRAF-VV-04',
    title_nl: 'Viestintaverkon liikenteen valvonta',
    title: 'Communications network traffic monitoring',
    description_nl: 'Teleyrityksen on valvottava viestintaverkon liikennetta poikkeamien ja tietoturvauhkien havaitsemiseksi. Valvonnan on katettava verkon kriittiset osat.',
    description: 'A telecommunications operator shall monitor network traffic to detect anomalies and security threats. Monitoring shall cover critical parts of the network.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '8.16',
  },
  {
    control_number: 'TRAF-VV-05',
    title_nl: 'Viestintaverkon paasynhallinta',
    title: 'Communications network access management',
    description_nl: 'Viestintaverkon yllapitoon kaytettavien jarjestelmien paasynhallinta on toteutettava vahvalla todennuksella. Etakaytto on suojattava salauksella.',
    description: 'Access management for systems used to manage the communications network shall use strong authentication. Remote access shall be secured with encryption.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '8.5',
  },
  {
    control_number: 'TRAF-VV-06',
    title_nl: 'Viestintaverkon laitteiden koventaminen',
    title: 'Communications network device hardening',
    description_nl: 'Viestintaverkon laitteet on kovennettava poistamalla tarpeettomat palvelut ja oletussalasanat. Laitteiden ohjelmistot on pidettava ajan tasalla.',
    description: 'Communications network devices shall be hardened by removing unnecessary services and default passwords. Device firmware shall be kept up to date.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '8.9',
  },
  {
    control_number: 'TRAF-VV-07',
    title_nl: 'Viestintaverkon segmentointi',
    title: 'Communications network segmentation',
    description_nl: 'Viestintaverkko on segmentoitava siten, etta hairion vaikutus rajoittuu mahdollisimman pienelle alueelle. Hallintaverkko on eristettava tuotantoverkosta.',
    description: 'The communications network shall be segmented so that the impact of disruption is limited to the smallest possible area. The management network shall be isolated from the production network.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '8.22',
  },
  {
    control_number: 'TRAF-VV-08',
    title_nl: 'Hairiotilanteista ilmoittaminen',
    title: 'Incident reporting',
    description_nl: 'Teleyrityksen on ilmoitettava merkittavista tietoturvahairiotilanteista Traficomille maaratyssa aikataulussa. Ilmoituksen on sisallettava hairion laajuus ja vaikutukset.',
    description: 'A telecommunications operator shall report significant security incidents to Traficom within the specified timeframe. The report shall include the scope and impact of the incident.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '5.24',
  },
  {
    control_number: 'TRAF-VV-09',
    title_nl: 'Signalointiliikenteen suojaus',
    title: 'Signalling traffic protection',
    description_nl: 'SS7- ja Diameter-signalointiliikenteen suojaus on toteutettava luvattoman kayton ja vaarinkayton estamiseksi.',
    description: 'SS7 and Diameter signalling traffic protection shall be implemented to prevent unauthorized use and abuse.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'mandatory',
    iso_mapping: '8.20',
  },
  {
    control_number: 'TRAF-VV-10',
    title_nl: 'Reitityksen turvallisuus',
    title: 'Routing security',
    description_nl: 'Internet-reitityksen turvallisuus on varmistettava RPKI-tekniikalla tai vastaavalla menetelmalla. BGP-reitityksen eheys on suojattava.',
    description: 'Internet routing security shall be ensured with RPKI or equivalent technology. BGP routing integrity shall be protected.',
    category: 'Viestintaverkkojen tietoturva',
    level: 'recommended',
    iso_mapping: '8.20',
  },

  // === Sahkoisen viestinnan tietoturva (Electronic Communications Security) ===
  {
    control_number: 'TRAF-SV-01',
    title_nl: 'Sahkopostipalvelun suojaus',
    title: 'Email service protection',
    description_nl: 'Sahkopostipalveluntarjoajan on toteutettava SPF-, DKIM- ja DMARC-suojaukset lahtevalle ja saapuvalle sahkopostille.',
    description: 'An email service provider shall implement SPF, DKIM, and DMARC protections for outgoing and incoming email.',
    category: 'Sahkoisen viestinnan tietoturva',
    level: 'mandatory',
    iso_mapping: '8.23',
    source_url: 'https://www.kyberturvallisuuskeskus.fi/fi/ohjeet-ja-oppaat/sahkopostin-tietoturva',
  },
  {
    control_number: 'TRAF-SV-02',
    title_nl: 'STARTTLS-salaus',
    title: 'STARTTLS encryption',
    description_nl: 'Sahkopostipalvelimien valinen liikenne on salattava STARTTLS-tekniikalla. MTA-STS-kaytanto on suositeltavaa.',
    description: 'Traffic between email servers shall be encrypted with STARTTLS. MTA-STS policy is recommended.',
    category: 'Sahkoisen viestinnan tietoturva',
    level: 'mandatory',
    iso_mapping: '8.24',
  },
  {
    control_number: 'TRAF-SV-03',
    title_nl: 'DANE-tuki sahkopostille',
    title: 'DANE support for email',
    description_nl: 'DANE (DNS-Based Authentication of Named Entities) -tuki sahkopostille on suositeltavaa sahkopostin liikennesalauksen varmentamiseksi.',
    description: 'DANE (DNS-Based Authentication of Named Entities) support for email is recommended to verify email transport encryption.',
    category: 'Sahkoisen viestinnan tietoturva',
    level: 'recommended',
    iso_mapping: '8.24',
  },
  {
    control_number: 'TRAF-SV-04',
    title_nl: 'Viestintapalveluiden kayttajatodennus',
    title: 'Communications service user authentication',
    description_nl: 'Viestintapalveluiden kayttajien todennus on toteutettava turvallisesti. Monivaiheinen todennus on suositeltavaa.',
    description: 'User authentication for communications services shall be implemented securely. Multi-factor authentication is recommended.',
    category: 'Sahkoisen viestinnan tietoturva',
    level: 'mandatory',
    iso_mapping: '8.5',
  },

  // === IoT-tietoturva (IoT Security) ===
  {
    control_number: 'TRAF-IOT-01',
    title_nl: 'IoT-laitteiden oletusasetukset',
    title: 'IoT device default settings',
    description_nl: 'IoT-laitteiden oletussalasanat on vaihdettava ennen kayttoonottoa. Laitteiden oletusasetukset on muutettava turvallisiksi.',
    description: 'IoT device default passwords shall be changed before deployment. Device default settings shall be configured securely.',
    category: 'IoT-tietoturva',
    iso_mapping: '8.9',
    source_url: 'https://www.kyberturvallisuuskeskus.fi/fi/ohjeet-ja-oppaat/iot-tietoturva',
  },
  {
    control_number: 'TRAF-IOT-02',
    title_nl: 'IoT-laitteiden paivitysmekanismi',
    title: 'IoT device update mechanism',
    description_nl: 'IoT-laitteissa on oltava turvallinen ohjelmistopaivitysmekanismi. Paivitysten eheys on varmistettava digitaalisella allekirjoituksella.',
    description: 'IoT devices shall have a secure software update mechanism. Update integrity shall be verified with digital signatures.',
    category: 'IoT-tietoturva',
    iso_mapping: '8.8',
  },
  {
    control_number: 'TRAF-IOT-03',
    title_nl: 'IoT-laitteiden verkkoeristys',
    title: 'IoT device network isolation',
    description_nl: 'IoT-laitteet on eristettava omaan verkkosegmenttiin. IoT-laitteiden paasynhallinta muihin verkkoihin on rajoitettava.',
    description: 'IoT devices shall be isolated in their own network segment. IoT device access to other networks shall be restricted.',
    category: 'IoT-tietoturva',
    iso_mapping: '8.22',
  },
  {
    control_number: 'TRAF-IOT-04',
    title_nl: 'IoT-laitteiden tiedonsiirron salaus',
    title: 'IoT device data transfer encryption',
    description_nl: 'IoT-laitteiden tiedonsiirto on salattava. Salausmenetelmien on oltava riittavia laitteen suorituskykyyn nahden.',
    description: 'IoT device data transfer shall be encrypted. Encryption methods shall be adequate for the device capabilities.',
    category: 'IoT-tietoturva',
    iso_mapping: '8.24',
  },
  {
    control_number: 'TRAF-IOT-05',
    title_nl: 'IoT-laitteiden haavoittuvuuksien hallinta',
    title: 'IoT device vulnerability management',
    description_nl: 'IoT-laitteiden haavoittuvuudet on tunnistettava ja korjattava. Valmistajan on ilmoitettava tunnetuista haavoittuvuuksista.',
    description: 'IoT device vulnerabilities shall be identified and remediated. The manufacturer shall disclose known vulnerabilities.',
    category: 'IoT-tietoturva',
    iso_mapping: '8.8',
  },
  {
    control_number: 'TRAF-IOT-06',
    title_nl: 'IoT-laitteiden kaytostapoistosuunnitelma',
    title: 'IoT device decommissioning plan',
    description_nl: 'IoT-laitteiden kaytostapoistosuunnitelma on laadittava. Laitteiden tiedot on tyhjennettava turvallisesti ennen kaytosta poistoa.',
    description: 'An IoT device decommissioning plan shall be prepared. Device data shall be securely erased before decommissioning.',
    category: 'IoT-tietoturva',
    iso_mapping: '8.10',
  },
  {
    control_number: 'TRAF-IOT-07',
    title_nl: 'IoT-laitteiden henkilotietojen suoja',
    title: 'IoT device personal data protection',
    description_nl: 'IoT-laitteiden keraaman henkilotiedon kasittely on toteutettava GDPR:n mukaisesti. Kayttajalle on annettava tieto keratyista tiedoista.',
    description: 'Processing of personal data collected by IoT devices shall comply with GDPR. The user shall be informed about collected data.',
    category: 'IoT-tietoturva',
    iso_mapping: '5.34',
  },

  // === Pilvipalveluiden tietoturva (Cloud Security) ===
  {
    control_number: 'TRAF-PIL-01',
    title_nl: 'Pilvipalvelun tietoturva-arviointi',
    title: 'Cloud service security assessment',
    description_nl: 'Pilvipalvelun tietoturva on arvioitava ennen kayttoonottoa. Arvioinnin on katettava tietojen sijainti, salaus, paasynhallinta ja varmuuskopiointi.',
    description: 'Cloud service security shall be assessed before adoption. Assessment shall cover data location, encryption, access management, and backup.',
    category: 'Pilvipalveluiden tietoturva',
    iso_mapping: '5.23',
    source_url: 'https://www.kyberturvallisuuskeskus.fi/fi/ohjeet-ja-oppaat/pilvipalveluiden-tietoturva',
  },
  {
    control_number: 'TRAF-PIL-02',
    title_nl: 'Pilvipalvelun sopimukselliset vaatimukset',
    title: 'Cloud service contractual requirements',
    description_nl: 'Pilvipalvelusopimukseen on sisallytettava tietoturvavelvoitteet: tietojen kasittely, sailytys, poistaminen, hairiotilanteista ilmoittaminen ja auditointi.',
    description: 'Cloud service contracts shall include security obligations: data processing, storage, deletion, incident notification, and audit rights.',
    category: 'Pilvipalveluiden tietoturva',
    iso_mapping: '5.19',
  },
  {
    control_number: 'TRAF-PIL-03',
    title_nl: 'Pilvipalvelun tietosuojavaatimukset',
    title: 'Cloud service data protection requirements',
    description_nl: 'Pilvipalvelussa kasiteltavien henkilotietojen sijainti on selvitettava. EU/ETA-alueen ulkopuolinen kasittely edellyttaa lisisuojatoimia.',
    description: 'The location of personal data processed in cloud services shall be determined. Processing outside EU/EEA requires additional safeguards.',
    category: 'Pilvipalveluiden tietoturva',
    iso_mapping: '5.34',
  },
  {
    control_number: 'TRAF-PIL-04',
    title_nl: 'Pilvipalvelun saatavuuden varmistaminen',
    title: 'Cloud service availability assurance',
    description_nl: 'Pilvipalvelun saatavuustaso on maariteltava sopimuksessa (SLA). Varasuunnitelma on laadittava pilvipalvelun hairiotilanteiden varalle.',
    description: 'Cloud service availability level shall be defined in the contract (SLA). A contingency plan shall be prepared for cloud service disruptions.',
    category: 'Pilvipalveluiden tietoturva',
    iso_mapping: '5.23',
  },
  {
    control_number: 'TRAF-PIL-05',
    title_nl: 'Pilvipalvelun lokitus',
    title: 'Cloud service logging',
    description_nl: 'Pilvipalvelun tapahtumat on lokitettava ja lokit on oltava asiakkaan saatavilla. Lokitietojen sailytysaika on maariteltava.',
    description: 'Cloud service events shall be logged and logs shall be available to the customer. Log retention period shall be defined.',
    category: 'Pilvipalveluiden tietoturva',
    iso_mapping: '8.15',
  },

  // === DNS-turvallisuus (DNS Security) ===
  {
    control_number: 'TRAF-DNS-01',
    title_nl: 'DNSSEC-allekirjoitus',
    title: 'DNSSEC signing',
    description_nl: 'DNS-vyohykkeet on allekirjoitettava DNSSEC-tekniikalla. Avaintenhallinnan on noudatettava hyvaksyttyja kaytantoja.',
    description: 'DNS zones shall be signed with DNSSEC. Key management shall follow accepted practices.',
    category: 'DNS-turvallisuus',
    iso_mapping: '8.20',
    source_url: 'https://www.kyberturvallisuuskeskus.fi/fi/ohjeet-ja-oppaat/dns-turvallisuus',
  },
  {
    control_number: 'TRAF-DNS-02',
    title_nl: 'DNS-palvelimen koventaminen',
    title: 'DNS server hardening',
    description_nl: 'DNS-palvelimet on kovennettava poistamalla tarpeettomat palvelut ja rajoittamalla rekursiiviset kyselyt.',
    description: 'DNS servers shall be hardened by removing unnecessary services and restricting recursive queries.',
    category: 'DNS-turvallisuus',
    iso_mapping: '8.9',
  },
  {
    control_number: 'TRAF-DNS-03',
    title_nl: 'DNS over HTTPS / DNS over TLS',
    title: 'DNS over HTTPS / DNS over TLS',
    description_nl: 'DoH (DNS over HTTPS) tai DoT (DNS over TLS) -tuki on suositeltavaa DNS-kyselyjen luottamuksellisuuden suojaamiseksi.',
    description: 'DoH (DNS over HTTPS) or DoT (DNS over TLS) support is recommended to protect DNS query confidentiality.',
    category: 'DNS-turvallisuus',
    iso_mapping: '8.24',
  },
  {
    control_number: 'TRAF-DNS-04',
    title_nl: 'DNS-palvelun saatavuus',
    title: 'DNS service availability',
    description_nl: 'DNS-palvelun saatavuus on varmistettava kahdentamalla palvelimet ja kayttamalla maantieteellisesti hajautettuja nimipalvelimia.',
    description: 'DNS service availability shall be ensured by redundant servers and geographically distributed name servers.',
    category: 'DNS-turvallisuus',
    iso_mapping: '8.14',
  },
  {
    control_number: 'TRAF-DNS-05',
    title_nl: 'DNS-vastausten eheys',
    title: 'DNS response integrity',
    description_nl: 'DNS-vastausten eheys on varmistettava. DNS cache poisoning -hyokkayksien torjuntaan on toteutettava asianmukaiset suojaukset.',
    description: 'DNS response integrity shall be ensured. Appropriate protections shall be implemented to prevent DNS cache poisoning attacks.',
    category: 'DNS-turvallisuus',
    iso_mapping: '8.20',
  },

  // === Kyberturvallisuussertifiointi EUCC (EU Cybersecurity Certification) ===
  {
    control_number: 'TRAF-EUCC-01',
    title_nl: 'EUCC-sertifiointiin valmistautuminen',
    title: 'EUCC certification preparation',
    description_nl: 'Organisaation on arvioitava EUCC-sertifioinnin tarpeellisuus tuotteilleen tai palveluilleen. Arvioinnin on perustuttava EU:n kyberturvallisuusasetuksen vaatimuksiin.',
    description: 'The organization shall assess the need for EUCC certification for its products or services. Assessment shall be based on EU Cybersecurity Act requirements.',
    category: 'Kyberturvallisuussertifiointi',
    source_url: 'https://www.traficom.fi/fi/viestinta/kyberturvallisuus/kyberturvallisuussertifiointi',
  },
  {
    control_number: 'TRAF-EUCC-02',
    title_nl: 'Tuotteen tietoturva-arviointi',
    title: 'Product security assessment',
    description_nl: 'EUCC-sertifioitavan tuotteen tietoturva on arvioitava Common Criteria -standardin mukaisesti (ISO/IEC 15408).',
    description: 'Security of a product to be EUCC certified shall be assessed according to the Common Criteria standard (ISO/IEC 15408).',
    category: 'Kyberturvallisuussertifiointi',
  },
  {
    control_number: 'TRAF-EUCC-03',
    title_nl: 'Haavoittuvuusanalyysi',
    title: 'Vulnerability analysis',
    description_nl: 'EUCC-sertifioinnissa on suoritettava haavoittuvuusanalyysi, joka kattaa tunnetut haavoittuvuudet ja hyokkaysskenaarioita.',
    description: 'EUCC certification requires a vulnerability analysis covering known vulnerabilities and attack scenarios.',
    category: 'Kyberturvallisuussertifiointi',
    iso_mapping: '8.8',
  },
  {
    control_number: 'TRAF-EUCC-04',
    title_nl: 'Sertifikaatin yllapito',
    title: 'Certificate maintenance',
    description_nl: 'EUCC-sertifikaatin voimassaolon aikana tuotteen tietoturvaa on yllapidettava ja merkittavista muutoksista on ilmoitettava sertifiointielimelle.',
    description: 'During EUCC certificate validity, product security shall be maintained and significant changes reported to the certification body.',
    category: 'Kyberturvallisuussertifiointi',
  },

  // === Kyberturvallisuuden tilannekuva (Situational Awareness) ===
  {
    control_number: 'TRAF-TK-01',
    title_nl: 'Kyberuhkatilannekuvan seuranta',
    title: 'Cyber threat situational awareness monitoring',
    description_nl: 'Organisaation on seurattava NCSC-FI:n julkaisemaa kyberturvallisuuden tilannekuvaa ja reagoitava siita ilmeneviin uhkiin.',
    description: 'The organization shall monitor the cybersecurity situational awareness published by NCSC-FI and respond to identified threats.',
    category: 'Kyberturvallisuuden tilannekuva',
    iso_mapping: '5.7',
    source_url: 'https://www.kyberturvallisuuskeskus.fi/fi/tilannekuva',
  },
  {
    control_number: 'TRAF-TK-02',
    title_nl: 'Uhkatiedon jakaminen',
    title: 'Threat intelligence sharing',
    description_nl: 'Organisaation on osallistuttava uhkatiedon jakamiseen NCSC-FI:n ja toimialan yhteistyoverkostojen kanssa.',
    description: 'The organization shall participate in threat intelligence sharing with NCSC-FI and sector collaboration networks.',
    category: 'Kyberturvallisuuden tilannekuva',
    iso_mapping: '5.7',
  },
  {
    control_number: 'TRAF-TK-03',
    title_nl: 'Tietoturva-ilmoitusten kasittely',
    title: 'Security advisory processing',
    description_nl: 'NCSC-FI:n julkaisemat tietoturvailmoitukset on arvioitava viipymatta ja tarvittavat toimenpiteet on toteutettava.',
    description: 'Security advisories published by NCSC-FI shall be assessed promptly and necessary actions implemented.',
    category: 'Kyberturvallisuuden tilannekuva',
    iso_mapping: '8.8',
  },
  {
    control_number: 'TRAF-TK-04',
    title_nl: 'Automaattinen havainnointi',
    title: 'Automated detection',
    description_nl: 'Kyberuhkien automaattinen havainnointi on toteutettava SIEM-jarjestelmalla tai vastaavalla. Havainnoinnin on katettava verkkoliikenne ja jarjestelmalokit.',
    description: 'Automated cyber threat detection shall be implemented with a SIEM system or equivalent. Detection shall cover network traffic and system logs.',
    category: 'Kyberturvallisuuden tilannekuva',
    iso_mapping: '8.16',
  },
];

const output = {
  framework: {
    id: 'traficom-maaraykset',
    name: 'Traficom Cybersecurity Regulations and Recommendations',
    name_nl: 'Traficomin kyberturvallisuusmaaraykset ja -suositukset',
    issuing_body: 'Liikenne- ja viestintavirasto Traficom',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Cybersecurity regulations (binding for telecom operators) and recommendations from Traficom. Covers communications network security, electronic communications security, IoT security, cloud security, DNS security, EU cybersecurity certification (EUCC), and situational awareness.',
    scope_sectors: ['telecom', 'digital_infrastructure', 'iot'],
    structure_description: 'Organized by domain: communications network security (binding regulations), electronic communications security (email, DANE), IoT security, cloud security, DNS security, EUCC certification, and situational awareness.',
    source_url: 'https://www.traficom.fi/fi/viestinta/kyberturvallisuus',
    license: 'Public sector publication',
    language: 'fi+en',
  },
  controls,
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Traficom: ${controls.length} controls written to ${OUTPUT_FILE}`);
