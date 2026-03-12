// scripts/ingest-vahti.ts
// Generates Vahti-ohjeet (Government IT Management Guidelines).
// Source: Valtiovarainministerio (VM) — Ministry of Finance.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
const OUTPUT_FILE = join(DATA_DIR, 'vahti.json');

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
  // Tietoturvapolitiikka (Security Policy)
  { control_number: 'VAHTI-POL-01', title_nl: 'Tietoturvapolitiikan laadinta', title: 'Security policy preparation', description_nl: 'Valtionhallinnon organisaation on laadittava tietoturvapolitiikka, joka perustuu valtioneuvoston tietoturvallisuutta koskeviin paatoksiin.', description: 'Government organizations shall prepare an information security policy based on government decisions on information security.', category: 'Tietoturvapolitiikka', iso_mapping: '5.1' },
  { control_number: 'VAHTI-POL-02', title_nl: 'Tietoturvastrategia', title: 'Security strategy', description_nl: 'Tietoturvastrategian on tuettava organisaation toimintastrategiaa ja kytkettava tietoturva osaksi johtamista.', description: 'The security strategy shall support the organization business strategy and integrate security into management.', category: 'Tietoturvapolitiikka', iso_mapping: '5.1' },
  { control_number: 'VAHTI-POL-03', title_nl: 'Tietoturvan hallinnan vuosikello', title: 'Security management annual cycle', description_nl: 'Tietoturvan hallinnan toimenpiteet on aikataulutettava vuosikelloon: riskiarvioinnit, koulutukset, auditoinnit, katselmoinnit.', description: 'Security management activities shall be scheduled in an annual cycle: risk assessments, training, audits, reviews.', category: 'Tietoturvapolitiikka', iso_mapping: '5.1' },

  // ICT-varautuminen (ICT Contingency) — VAHTI 2/2010
  { control_number: 'VAHTI-VAR-01', title_nl: 'ICT-varautumissuunnitelma', title: 'ICT contingency plan', description_nl: 'Organisaation on laadittava ICT-varautumissuunnitelma, joka kattaa kriittisten tietojarjestelmien ja -palveluiden jatkuvuuden varmistamisen.', description: 'The organization shall prepare an ICT contingency plan covering continuity assurance for critical information systems and services.', category: 'ICT-varautuminen', iso_mapping: '5.29', source_url: 'https://vm.fi/vahti' },
  { control_number: 'VAHTI-VAR-02', title_nl: 'Kriittisten jarjestelmien tunnistaminen', title: 'Critical system identification', description_nl: 'Organisaation kriittiset ICT-jarjestelmat ja -palvelut on tunnistettava ja niiden riippuvuudet on selvitettava.', description: 'The organization critical ICT systems and services shall be identified and their dependencies determined.', category: 'ICT-varautuminen', iso_mapping: '5.29' },
  { control_number: 'VAHTI-VAR-03', title_nl: 'Toipumissuunnitelmat', title: 'Recovery plans', description_nl: 'Kullekin kriittiselle jarjestelmalle on laadittava toipumissuunnitelma, joka sisaltaa palautumisaikatavoitteet (RTO) ja palautumispistetavoitteet (RPO).', description: 'Recovery plans shall be prepared for each critical system, including recovery time objectives (RTO) and recovery point objectives (RPO).', category: 'ICT-varautuminen', iso_mapping: '5.30' },
  { control_number: 'VAHTI-VAR-04', title_nl: 'Varautumisharjoitukset', title: 'Contingency exercises', description_nl: 'ICT-varautumissuunnitelmaa on harjoiteltava saannollisesti. Harjoitusten tulokset on analysoitava ja suunnitelmia paivitettava.', description: 'ICT contingency plans shall be exercised regularly. Exercise results shall be analyzed and plans updated.', category: 'ICT-varautuminen', iso_mapping: '5.29' },
  { control_number: 'VAHTI-VAR-05', title_nl: 'Varajarjestelyt', title: 'Backup arrangements', description_nl: 'Kriittisille jarjestelmille on toteutettava varajarjestelyt: varalaitteistot, varayhteydet, varatilat.', description: 'Backup arrangements shall be implemented for critical systems: backup hardware, backup connections, backup premises.', category: 'ICT-varautuminen', iso_mapping: '8.14' },

  // Lokiohje (Log Guidance) — VAHTI 3/2012
  { control_number: 'VAHTI-LOK-01', title_nl: 'Lokipolitiikka', title: 'Log policy', description_nl: 'Organisaation on maariteltava lokipolitiikka, joka kattaa lokitettavat tapahtumat, sailytysajat ja kasittelysaannot.', description: 'The organization shall define a log policy covering events to be logged, retention periods, and handling rules.', category: 'Lokiohje', iso_mapping: '8.15', source_url: 'https://vm.fi/vahti' },
  { control_number: 'VAHTI-LOK-02', title_nl: 'Lokitettavat tapahtumat', title: 'Events to be logged', description_nl: 'Vahintaan seuraavat tapahtumat on lokitettava: sisaankirjautumiset, kayttooikeusmuutokset, tietojen katselut ja muutokset, jarjestelmavirheet.', description: 'At minimum the following events shall be logged: logins, access right changes, data views and modifications, system errors.', category: 'Lokiohje', iso_mapping: '8.15' },
  { control_number: 'VAHTI-LOK-03', title_nl: 'Lokitietojen suojaaminen', title: 'Log data protection', description_nl: 'Lokitiedot on suojattava muutoksilta ja luvattomalta paasylta. Lokitietojen eheys on varmistettava.', description: 'Log data shall be protected against modification and unauthorized access. Log data integrity shall be ensured.', category: 'Lokiohje', iso_mapping: '8.15' },
  { control_number: 'VAHTI-LOK-04', title_nl: 'Lokitietojen sailytys', title: 'Log data retention', description_nl: 'Lokitietojen sailytysajat on maariteltava: turvallisuuslokit vahintaan 2 vuotta, jarjestelmalokit vahintaan 6 kuukautta.', description: 'Log data retention periods shall be defined: security logs at least 2 years, system logs at least 6 months.', category: 'Lokiohje', iso_mapping: '8.15' },
  { control_number: 'VAHTI-LOK-05', title_nl: 'Lokitietojen analysointi', title: 'Log data analysis', description_nl: 'Lokitietoja on analysoitava saannollisesti poikkeamien ja vaarinkayttojen havaitsemiseksi.', description: 'Log data shall be analyzed regularly for detecting anomalies and misuse.', category: 'Lokiohje', iso_mapping: '8.16' },
  { control_number: 'VAHTI-LOK-06', title_nl: 'Keskitetty lokienhallinta', title: 'Centralized log management', description_nl: 'Lokitiedot on kerettava keskitettyyn lokienhallinnan jarjestelmaan, joka mahdollistaa tehokkaan haun ja analysoinnin.', description: 'Log data shall be collected into a centralized log management system enabling efficient search and analysis.', category: 'Lokiohje', iso_mapping: '8.15' },

  // Henkilostoturvallisuus (Personnel Security) — VAHTI 2/2013
  { control_number: 'VAHTI-HEN-01', title_nl: 'Henkilostoturvallisuuden periaatteet', title: 'Personnel security principles', description_nl: 'Organisaation on maariteltava henkilostoturvallisuuden periaatteet, jotka kattavat koko tyosuhteen elinkaaren.', description: 'The organization shall define personnel security principles covering the entire employment lifecycle.', category: 'Henkilostoturvallisuus', iso_mapping: '6.1', source_url: 'https://vm.fi/vahti' },
  { control_number: 'VAHTI-HEN-02', title_nl: 'Tehtavien eriyttaminen', title: 'Segregation of duties', description_nl: 'Kriittisissa tehtavissa on toteutettava tehtavien eriyttaminen siten, etta yksi henkilo ei voi suorittaa koko kriittista prosessia.', description: 'Segregation of duties shall be implemented in critical functions so that one person cannot complete an entire critical process.', category: 'Henkilostoturvallisuus', iso_mapping: '5.3' },
  { control_number: 'VAHTI-HEN-03', title_nl: 'Turvallisuusselvitykset', title: 'Security clearances', description_nl: 'Turvallisuusselvitykset on suoritettava henkiloille, joilla on paasynhallinta salassa pidettaviin tietoihin tai kriittisiin jarjestelmiin.', description: 'Security clearances shall be conducted for persons with access to classified information or critical systems.', category: 'Henkilostoturvallisuus', iso_mapping: '6.1' },
  { control_number: 'VAHTI-HEN-04', title_nl: 'Tyosuhteen paattyminen', title: 'Employment termination', description_nl: 'Tyosuhteen paattyessa kayttooikeudet on poistettava viipymatta ja organisaation omaisuus on palautettava.', description: 'Access rights shall be removed promptly upon employment termination and organizational assets returned.', category: 'Henkilostoturvallisuus', iso_mapping: '6.5' },

  // Toimitilaturvallisuus (Premises Security)
  { control_number: 'VAHTI-TIL-01', title_nl: 'Toimitilojen turvallisuusluokittelu', title: 'Premises security classification', description_nl: 'Toimitilat on luokiteltava turvallisuustason mukaan ja kunkin luokan vaatimukset on maariteltava.', description: 'Premises shall be classified according to security level and requirements for each class defined.', category: 'Toimitilaturvallisuus', iso_mapping: '7.1' },
  { control_number: 'VAHTI-TIL-02', title_nl: 'Fyysinen kulunvalvonta', title: 'Physical access control', description_nl: 'Toimitilojen kulunvalvonta on toteutettava sahkoisella kulunvalvontajarjestelmalla.', description: 'Physical access control to premises shall be implemented with an electronic access control system.', category: 'Toimitilaturvallisuus', iso_mapping: '7.2' },
  { control_number: 'VAHTI-TIL-03', title_nl: 'Tilojen ymparistoturvallisuus', title: 'Environmental security', description_nl: 'Tietotekniikkatilat on suojattava tulipaloa, vesivahinkoa, lampotilavaihteluja ja sahkohairioita vastaan.', description: 'IT premises shall be protected against fire, water damage, temperature fluctuations, and power disturbances.', category: 'Toimitilaturvallisuus', iso_mapping: '7.5' },

  // Tietoturvallisuuden hallintajarjestelma (ISMS)
  { control_number: 'VAHTI-ISMS-01', title_nl: 'Tietoturvallisuuden hallintajarjestelma', title: 'Information security management system', description_nl: 'Organisaation on toteutettava tietoturvallisuuden hallintajarjestelma, joka perustuu jatkuvan parantamisen periaatteeseen (PDCA).', description: 'The organization shall implement an information security management system based on the continuous improvement principle (PDCA).', category: 'Hallintajarjestelma', iso_mapping: '5.1' },
  { control_number: 'VAHTI-ISMS-02', title_nl: 'Johdon katselmointi', title: 'Management review', description_nl: 'Tietoturvallisuuden tila on katselmoitava johtotasolla vahintaan vuosittain.', description: 'Information security status shall be reviewed at management level at least annually.', category: 'Hallintajarjestelma', iso_mapping: '5.1' },
  { control_number: 'VAHTI-ISMS-03', title_nl: 'Tietoturvan mittaaminen', title: 'Security measurement', description_nl: 'Tietoturvallisuuden toteutumista on mitattava maariteltyin mittarein ja tulokset on raportoitava johdolle.', description: 'Information security implementation shall be measured with defined metrics and results reported to management.', category: 'Hallintajarjestelma', iso_mapping: '5.36' },

  // Sahkoisten palveluiden tietoturva (E-service Security)
  { control_number: 'VAHTI-EPAL-01', title_nl: 'Sahkoisten palveluiden tietoturva-arviointi', title: 'E-service security assessment', description_nl: 'Sahkoisten asiointipalveluiden tietoturvallisuus on arvioitava ennen kayttoonottoa ja saannollisesti kayton aikana.', description: 'Security of electronic services shall be assessed before deployment and regularly during operation.', category: 'Sahkoisten palveluiden tietoturva', iso_mapping: '8.25' },
  { control_number: 'VAHTI-EPAL-02', title_nl: 'Sahkoinen tunnistaminen', title: 'Electronic identification', description_nl: 'Sahkoisissa asiointipalveluissa on kaytettava luotettavaa sahkoista tunnistamista (Suomi.fi-tunnistus tai vastaava).', description: 'Reliable electronic identification (Suomi.fi identification or equivalent) shall be used in electronic services.', category: 'Sahkoisten palveluiden tietoturva', iso_mapping: '8.5' },

  // Tietoverkkotietoturva (Network Security)
  { control_number: 'VAHTI-VERK-01', title_nl: 'Tietoverkkojen turvallisuusarkkitehtuuri', title: 'Network security architecture', description_nl: 'Tietoverkkojen turvallisuusarkkitehtuuri on suunniteltava ja dokumentoitava. Verkot on segmentoitava turvallisuusvaatimusten mukaan.', description: 'Network security architecture shall be designed and documented. Networks shall be segmented according to security requirements.', category: 'Tietoverkkotietoturva', iso_mapping: '8.20' },
  { control_number: 'VAHTI-VERK-02', title_nl: 'Valtion yhteisen verkon (VY-verkon) kaytto', title: 'Government shared network (VY network) usage', description_nl: 'Valtionhallinnon organisaatioiden on kaytettava valtion yhteista verkkoa (VY-verkkoa) sisaiseen tiedonsiirtoon.', description: 'Government organizations shall use the government shared network (VY network) for internal data transfer.', category: 'Tietoverkkotietoturva', iso_mapping: '8.20' },
  { control_number: 'VAHTI-VERK-03', title_nl: 'Palomuurikaytannot', title: 'Firewall policies', description_nl: 'Palomuurikaytannot on dokumentoitava ja katselmoitava saannollisesti. Oletusperiaatteena on estaa kaikki liikenne.', description: 'Firewall policies shall be documented and reviewed regularly. The default principle shall be to block all traffic.', category: 'Tietoverkkotietoturva', iso_mapping: '8.21' },

  // Tietoturvallisuuden arviointi (Security Assessment)
  { control_number: 'VAHTI-ARV-01', title_nl: 'Tietoturvallisuuden itsearviointi', title: 'Security self-assessment', description_nl: 'Organisaation on suoritettava tietoturvallisuuden itsearviointi vuosittain VAHTI-kriteerien mukaisesti.', description: 'The organization shall perform an annual security self-assessment according to VAHTI criteria.', category: 'Tietoturvallisuuden arviointi', iso_mapping: '5.35' },
  { control_number: 'VAHTI-ARV-02', title_nl: 'Ulkoinen auditointi', title: 'External audit', description_nl: 'Tietoturvallisuuden ulkoinen auditointi on suoritettava vahintaan kolmen vuoden valein.', description: 'An external security audit shall be performed at least every three years.', category: 'Tietoturvallisuuden arviointi', iso_mapping: '5.35' },
  { control_number: 'VAHTI-ARV-03', title_nl: 'Tietoturvapoikkeamien raportointi', title: 'Security incident reporting', description_nl: 'Tietoturvapoikkeamista on raportoitava NCSC-FI:lle ja organisaation johdolle. Merkittavista poikkeamista on tehtava ilmoitus CERT-FI:lle.', description: 'Security incidents shall be reported to NCSC-FI and organizational management. Significant incidents shall be notified to CERT-FI.', category: 'Tietoturvallisuuden arviointi', iso_mapping: '5.24' },
];

const output = {
  framework: {
    id: 'vahti',
    name: 'Government IT Management Guidelines (VAHTI)',
    name_nl: 'Vahti-ohjeet (Valtionhallinnon tietoturvaohjeistus)',
    issuing_body: 'Valtiovarainministerio (VM)',
    version: '2013',
    effective_date: '2013-01-01',
    scope: 'Government IT security management guidelines published by the Ministry of Finance. Covers ICT contingency planning, log management, personnel security, premises security, and ISMS implementation for Finnish government organizations.',
    scope_sectors: ['government'],
    structure_description: 'Organized by topic area: security policy, ICT contingency (VAHTI 2/2010), log management (VAHTI 3/2012), personnel security (VAHTI 2/2013), premises security, ISMS, e-service security, network security, and security assessment.',
    source_url: 'https://vm.fi/vahti',
    license: 'Public sector publication',
    language: 'fi+en',
  },
  controls,
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`VAHTI: ${controls.length} controls written to ${OUTPUT_FILE}`);
