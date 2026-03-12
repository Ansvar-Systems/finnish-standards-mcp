// scripts/ingest-tietosuoja.ts
// Generates Tietosuojavaltuutetun ohjeet (Data Protection Ombudsman Guidance).
// Source: Tietosuojavaltuutetun toimisto — Finnish DPA technical/organizational measures.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'tietosuoja-ohjeet.json');

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
  source_url?: string;
}

const controls: Control[] = [
  // Paasynhallinta (Access Management)
  { control_number: 'TSV-01', title_nl: 'Paasynhallintakaytanto', title: 'Access management policy', description_nl: 'Rekisterinpitajan on maariteltava paasynhallintakaytanto, joka rajoittaa henkilotietojen kasittelyoikeuden vain niihin henkiloihin, joiden tyotehtavat sita edellyttavat.', description: 'The controller shall define an access management policy restricting personal data processing rights to persons whose duties require it.', category: 'Paasynhallinta', iso_mapping: '5.15', source_url: 'https://tietosuoja.fi/ohjeet' },
  { control_number: 'TSV-02', title_nl: 'Kayttooikeuksien katselmointi', title: 'Access rights review', description_nl: 'Henkilotietojen kasittelyyn liittyvat kayttooikeudet on katselmoitava saannollisesti ja tarpeettomat oikeudet on poistettava.', description: 'Access rights related to personal data processing shall be reviewed regularly and unnecessary rights removed.', category: 'Paasynhallinta', iso_mapping: '5.18' },
  { control_number: 'TSV-03', title_nl: 'Todentaminen ja valtuuttaminen', title: 'Authentication and authorization', description_nl: 'Henkilotietojarjestelmiin paasynhallinta on toteutettava vahvalla todennuksella. Kriittisissa jarjestelmissa on kaytettava monivaiheista todennusta.', description: 'Access control to personal data systems shall use strong authentication. Multi-factor authentication shall be used for critical systems.', category: 'Paasynhallinta', iso_mapping: '8.5' },

  // Salaus (Encryption)
  { control_number: 'TSV-04', title_nl: 'Henkilotietojen salaus levossa', title: 'Personal data encryption at rest', description_nl: 'Henkilotiedot on salattava tallennettaessa tietokantoihin ja tietovalineille. Erityisten henkilotietoryhmien salaus on pakollista.', description: 'Personal data shall be encrypted when stored in databases and media. Encryption of special category data is mandatory.', category: 'Salaus', iso_mapping: '8.24' },
  { control_number: 'TSV-05', title_nl: 'Henkilotietojen salaus siirrossa', title: 'Personal data encryption in transit', description_nl: 'Henkilotiedot on salattava siirrettaessa verkon yli. TLS 1.2+ on minimivaatimus.', description: 'Personal data shall be encrypted when transferred over networks. TLS 1.2+ is the minimum requirement.', category: 'Salaus', iso_mapping: '8.24' },
  { control_number: 'TSV-06', title_nl: 'Salausavainten hallinta', title: 'Encryption key management', description_nl: 'Salausavainten luominen, sailyttaminen, jakaminen ja havittaminen on toteutettava suunnitellusti ja dokumentoidusti.', description: 'Creation, storage, distribution, and destruction of encryption keys shall be planned and documented.', category: 'Salaus', iso_mapping: '8.24' },

  // Pseudonymisointi ja anonymisointi
  { control_number: 'TSV-07', title_nl: 'Pseudonymisointi', title: 'Pseudonymization', description_nl: 'Henkilotiedot on pseudonymisoitava aina kun se on mahdollista. Pseudonyymiavaimet on sailytettava erillaan pseudonymisoiduista tiedoista.', description: 'Personal data shall be pseudonymized whenever possible. Pseudonym keys shall be stored separately from pseudonymized data.', category: 'Pseudonymisointi ja anonymisointi', iso_mapping: '8.11' },
  { control_number: 'TSV-08', title_nl: 'Anonymisointi', title: 'Anonymization', description_nl: 'Tiedot on anonymisoitava aina kun kasittelytarkoitus sen mahdollistaa. Anonymisoinnin riittavyys on arvioitava uudelleentunnistamisriskin nakoekulmasta.', description: 'Data shall be anonymized when the processing purpose allows. Adequacy of anonymization shall be assessed from a re-identification risk perspective.', category: 'Pseudonymisointi ja anonymisointi', iso_mapping: '8.11' },
  { control_number: 'TSV-09', title_nl: 'Tiedon minimointi', title: 'Data minimization', description_nl: 'Henkilotietojen kasittely on rajoitettava kasittelytarkoituksen kannalta tarpeellisiin tietoihin. Ylimaaraiset tiedot on poistettava.', description: 'Personal data processing shall be limited to data necessary for the processing purpose. Excess data shall be deleted.', category: 'Pseudonymisointi ja anonymisointi' },

  // Varmuuskopiointi ja palautuminen
  { control_number: 'TSV-10', title_nl: 'Henkilotietojen varmuuskopiointi', title: 'Personal data backup', description_nl: 'Henkilotietojen varmuuskopiot on laadittava saannollisesti. Varmuuskopiot on salattava ja niiden paasynhallinta on toteutettava.', description: 'Personal data backups shall be made regularly. Backups shall be encrypted and access-controlled.', category: 'Varmuuskopiointi ja palautuminen', iso_mapping: '8.13' },
  { control_number: 'TSV-11', title_nl: 'Palautumiskyky', title: 'Recovery capability', description_nl: 'Kyky palauttaa henkilotiedot tietomurron tai jarjestelmavian jalkeen on varmistettava ja testattava.', description: 'The ability to restore personal data after a breach or system failure shall be ensured and tested.', category: 'Varmuuskopiointi ja palautuminen', iso_mapping: '8.14' },

  // Lokitietojen hallinta
  { control_number: 'TSV-12', title_nl: 'Kasittelytapahtumien lokitus', title: 'Processing event logging', description_nl: 'Henkilotietojen kasittelytapahtumat on lokitettava: kuka kasitteli, mita tietoja, milloin ja missa.', description: 'Personal data processing events shall be logged: who processed, what data, when, and where.', category: 'Lokitietojen hallinta', iso_mapping: '8.15' },
  { control_number: 'TSV-13', title_nl: 'Lokitietojen suojaus', title: 'Log data protection', description_nl: 'Lokitiedot on suojattava muutoksilta ja luvattomalta kaytolta. Lokitietojen sailytysaika on maariteltava.', description: 'Log data shall be protected against modification and unauthorized access. Log retention period shall be defined.', category: 'Lokitietojen hallinta', iso_mapping: '8.15' },
  { control_number: 'TSV-14', title_nl: 'Lokitietojen analysointi', title: 'Log data analysis', description_nl: 'Lokitietoja on analysoitava saannollisesti luvattoman henkilotietojen kasittelyn havaitsemiseksi.', description: 'Log data shall be analyzed regularly to detect unauthorized personal data processing.', category: 'Lokitietojen hallinta', iso_mapping: '8.16' },

  // Vaikutustenarviointi
  { control_number: 'TSV-15', title_nl: 'Tietosuojan vaikutustenarviointi (DPIA)', title: 'Data protection impact assessment (DPIA)', description_nl: 'Tietosuojan vaikutustenarviointi on suoritettava ennen korkean riskin henkilotietojen kasittelya. Arvioinnin tulokset on dokumentoitava.', description: 'A data protection impact assessment shall be conducted before high-risk personal data processing. Assessment results shall be documented.', category: 'Vaikutustenarviointi' },
  { control_number: 'TSV-16', title_nl: 'Sisaanrakennettu tietosuoja', title: 'Data protection by design', description_nl: 'Tietosuoja on huomioitava jarjestelmien suunnitteluvaiheessa. Tietosuojaperiaatteet on sisallytettava jarjestelmavaatimuksiin.', description: 'Data protection shall be considered in system design phase. Privacy principles shall be included in system requirements.', category: 'Vaikutustenarviointi' },
  { control_number: 'TSV-17', title_nl: 'Oletusarvoinen tietosuoja', title: 'Data protection by default', description_nl: 'Jarjestelmien oletusasetukset on maariteltava yksityisytta suojaaviksi. Vain kasittelytarkoituksen kannalta tarpeelliset tiedot saa olla oletusarvoisesti nakyvissa.', description: 'System default settings shall be configured to protect privacy. Only data necessary for the processing purpose shall be visible by default.', category: 'Vaikutustenarviointi' },

  // Tietoturvaloukkaukset
  { control_number: 'TSV-18', title_nl: 'Tietoturvaloukkausten tunnistaminen', title: 'Breach detection', description_nl: 'Organisaatiolla on oltava menettelyt henkilotietojen tietoturvaloukkausten tunnistamiseen. Tunnistaminen on toteutettava mahdollisimman nopeasti.', description: 'The organization shall have procedures for detecting personal data breaches. Detection shall be implemented as quickly as possible.', category: 'Tietoturvaloukkaukset', iso_mapping: '5.24' },
  { control_number: 'TSV-19', title_nl: 'Tietoturvaloukkauksesta ilmoittaminen', title: 'Breach notification', description_nl: 'Henkilotietojen tietoturvaloukkauksesta on ilmoitettava tietosuojavaltuutetulle 72 tunnin kuluessa. Korkean riskin tapauksissa myos rekisteroidyille.', description: 'Personal data breaches shall be notified to the Data Protection Ombudsman within 72 hours. In high-risk cases, also to data subjects.', category: 'Tietoturvaloukkaukset' },
  { control_number: 'TSV-20', title_nl: 'Tietoturvaloukkausten dokumentointi', title: 'Breach documentation', description_nl: 'Kaikki henkilotietojen tietoturvaloukkaukset on dokumentoitava riippumatta ilmoitusvelvollisuudesta.', description: 'All personal data breaches shall be documented regardless of notification obligation.', category: 'Tietoturvaloukkaukset' },

  // Kolmannet osapuolet
  { control_number: 'TSV-21', title_nl: 'Henkilotietojen kasittelijan valinta', title: 'Processor selection', description_nl: 'Henkilotietojen kasittelija on valittava huolellisesti. Kasittelijan riittavat tekniset ja organisatoriset suojatoimet on varmistettava.', description: 'A data processor shall be selected carefully. The processor sufficient technical and organizational safeguards shall be verified.', category: 'Kolmannet osapuolet', iso_mapping: '5.19' },
  { control_number: 'TSV-22', title_nl: 'Kasittelysopimus', title: 'Processing agreement', description_nl: 'Henkilotietojen kasittelijan kanssa on laadittava GDPR:n mukainen kasittelysopimus (art. 28).', description: 'A GDPR-compliant processing agreement (Art. 28) shall be established with the data processor.', category: 'Kolmannet osapuolet' },
  { control_number: 'TSV-23', title_nl: 'Tietojensiirrot kolmansiin maihin', title: 'Data transfers to third countries', description_nl: 'Henkilotietojen siirto EU/ETA-alueen ulkopuolelle edellyttaa asianmukaista siirtoperustetta (riittavyyspaatos, vakiolausekkeet, BCR).', description: 'Personal data transfer outside EU/EEA requires an appropriate transfer mechanism (adequacy decision, standard clauses, BCR).', category: 'Kolmannet osapuolet' },

  // Rekisteroidun oikeudet
  { control_number: 'TSV-24', title_nl: 'Rekisteroidyn oikeuksien toteuttaminen', title: 'Data subject rights implementation', description_nl: 'Organisaatiolla on oltava menettelyt rekisteroidyn oikeuksien toteuttamiseen: tarkastusoikeus, oikaisuoikeus, poisto-oikeus, siirto-oikeus.', description: 'The organization shall have procedures for implementing data subject rights: access, rectification, erasure, and portability.', category: 'Rekisteroidyn oikeudet' },
  { control_number: 'TSV-25', title_nl: 'Tietosuojaseloste', title: 'Privacy notice', description_nl: 'Rekisteroidyille on tarjottava selkea ja avoin tietosuojaseloste, joka tayttaa GDPR:n 13 ja 14 artiklan vaatimukset.', description: 'A clear and transparent privacy notice fulfilling GDPR Articles 13 and 14 requirements shall be provided to data subjects.', category: 'Rekisteroidyn oikeudet' },

  // Organisatoriset toimenpiteet
  { control_number: 'TSV-26', title_nl: 'Tietosuojavastaava', title: 'Data protection officer', description_nl: 'Viranomaisten ja suurten henkilotietojen kasittelijoiden on nimitettava tietosuojavastaava. Tietosuojavastaavan riippumattomuus on varmistettava.', description: 'Public authorities and large-scale processors shall appoint a data protection officer. DPO independence shall be ensured.', category: 'Organisatoriset toimenpiteet' },
  { control_number: 'TSV-27', title_nl: 'Henkilotietojen kasittelyn seloste', title: 'Records of processing activities', description_nl: 'Organisaation on yllapidettava selostetta henkilotietojen kasittelytoimista (GDPR art. 30).', description: 'The organization shall maintain records of processing activities (GDPR Art. 30).', category: 'Organisatoriset toimenpiteet' },
  { control_number: 'TSV-28', title_nl: 'Tietosuojakoulutus', title: 'Privacy training', description_nl: 'Henkilotietoja kasitteleville henkiloille on jarjestettava saannollista tietosuojakoulutusta.', description: 'Regular privacy training shall be provided to persons processing personal data.', category: 'Organisatoriset toimenpiteet', iso_mapping: '6.3' },

  // Erityiset kasittelytilanteet
  { control_number: 'TSV-29', title_nl: 'Terveydenhuollon tietosuoja', title: 'Healthcare data protection', description_nl: 'Terveydenhuollon henkilotietojen kasittelyssa on noudatettava erityisia suojatoimia. Potilastietojarjestelmien tietoturvavaatimukset on toteutettava.', description: 'Special safeguards shall be applied when processing healthcare personal data. Security requirements for patient record systems shall be implemented.', category: 'Erityiset kasittelytilanteet' },
  { control_number: 'TSV-30', title_nl: 'Lasten henkilotietojen suoja', title: 'Children personal data protection', description_nl: 'Lasten henkilotietojen kasittelyssa on noudatettava erityista huolellisuutta ja ikarajoituksia.', description: 'Special care and age restrictions shall be applied when processing children personal data.', category: 'Erityiset kasittelytilanteet' },
  { control_number: 'TSV-31', title_nl: 'Automaattinen paatoksenteko', title: 'Automated decision-making', description_nl: 'Automaattinen paatoksenteko, joka vaikuttaa merkittavasti rekisteroityyn, edellyttaa erityista oikeusperustetta ja tiedottamista.', description: 'Automated decision-making that significantly affects the data subject requires a specific legal basis and transparency.', category: 'Erityiset kasittelytilanteet' },
  { control_number: 'TSV-32', title_nl: 'Evasteiden ja seurannan hallinta', title: 'Cookie and tracking management', description_nl: 'Evasteiden ja seurantateknologioiden kaytto edellyttaa kayttajan suostumusta. Evastekaytannon on oltava lainmukainen.', description: 'Use of cookies and tracking technologies requires user consent. Cookie policy shall be lawful.', category: 'Erityiset kasittelytilanteet' },
];

const output = {
  framework: {
    id: 'tietosuoja-ohjeet',
    name: 'Data Protection Ombudsman Guidance',
    name_nl: 'Tietosuojavaltuutetun ohjeet',
    issuing_body: 'Tietosuojavaltuutetun toimisto',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Technical and organizational measures guidance from the Finnish Data Protection Ombudsman. Covers GDPR Art. 32 implementation requirements adapted for Finnish organizations.',
    scope_sectors: ['government', 'healthcare', 'finance', 'education'],
    structure_description: 'Organized by security measure type: access management, encryption, pseudonymization, backup, logging, impact assessment, breach management, third parties, data subject rights, and organizational measures.',
    source_url: 'https://tietosuoja.fi/ohjeet',
    license: 'Public sector publication',
    language: 'fi+en',
  },
  controls,
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Tietosuoja: ${controls.length} controls written to ${OUTPUT_FILE}`);
