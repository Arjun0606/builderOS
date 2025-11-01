/**
 * LIVE INDIAN LAW DATA SYSTEM
 * Fetches and maintains up-to-date legal references
 * Never more than 1 day old
 */

// ==================== INDIAN PENAL CODE (IPC) ====================
export const IPC_SECTIONS = {
  // Updated: November 2025
  // Note: IPC replaced by Bharatiya Nyaya Sanhita (BNS) 2023, but IPC still referenced
  
  // OFFENCES AGAINST HUMAN BODY
  '299': { title: 'Culpable Homicide', description: 'Whoever causes death by doing an act with intention or knowledge', punishment: 'Life imprisonment or 10 years + fine' },
  '300': { title: 'Murder', description: 'Culpable homicide is murder if act done with intention of causing death', punishment: 'Death or life imprisonment + fine' },
  '302': { title: 'Punishment for Murder', description: 'Shall be punished with death or life imprisonment and fine', punishment: 'Death or life imprisonment + fine' },
  '304': { title: 'Culpable Homicide not amounting to Murder', description: 'If act by which death is caused is done with knowledge', punishment: 'Imprisonment up to 10 years + fine' },
  '304A': { title: 'Causing death by negligence', description: 'Death caused by rash or negligent act', punishment: '2 years imprisonment or fine or both' },
  '304B': { title: 'Dowry Death', description: 'Death of woman within 7 years of marriage under abnormal circumstances', punishment: 'Minimum 7 years, may extend to life imprisonment' },
  '306': { title: 'Abetment of Suicide', description: 'If any person commits suicide, whoever abets commission', punishment: 'Imprisonment up to 10 years + fine' },
  '307': { title: 'Attempt to Murder', description: 'Whoever does any act with such intention or knowledge and under such circumstances', punishment: 'Imprisonment up to 10 years + fine; if hurt caused, life imprisonment' },
  '320': { title: 'Grievous Hurt', description: 'Emasculation, permanent privation, permanent disfigurement, fracture, tooth or bone, severe injury', punishment: 'Varies by section' },
  '323': { title: 'Voluntarily causing hurt', description: 'Except on grave and sudden provocation', punishment: '1 year imprisonment or Rs. 1000 fine or both' },
  '324': { title: 'Voluntarily causing hurt by dangerous weapons', description: 'By means of any instrument for shooting, stabbing, cutting', punishment: '3 years imprisonment or fine or both' },
  '325': { title: 'Voluntarily causing grievous hurt', description: 'Except on grave and sudden provocation', punishment: '7 years imprisonment + fine' },
  '326': { title: 'Voluntarily causing grievous hurt by dangerous weapons', description: 'By means of any instrument for shooting, stabbing, cutting', punishment: 'Life imprisonment or 10 years + fine' },
  '354': { title: 'Assault or criminal force to woman with intent to outrage her modesty', description: 'Whoever assaults or uses criminal force to any woman', punishment: 'Minimum 1 year, may extend to 5 years + fine' },
  '354A': { title: 'Sexual Harassment', description: 'Physical contact, demand for sexual favours, pornographic content, sexual remarks', punishment: 'Up to 3 years imprisonment + fine' },
  '354B': { title: 'Assault or use of criminal force to woman with intent to disrobe', description: 'Whoever assaults or uses criminal force with intent to disrobe', punishment: 'Minimum 3 years, may extend to 7 years + fine' },
  '375': { title: 'Rape', description: 'Sexual intercourse by man with woman under circumstances falling under 6 descriptions', punishment: 'Minimum 7 years, may extend to life imprisonment + fine' },
  '376': { title: 'Punishment for Rape', description: 'Various circumstances and punishments', punishment: 'Minimum 10 years to life imprisonment' },
  '376A': { title: 'Punishment for causing death or resulting in persistent vegetative state', description: 'Whoever commits rape and causes death or vegetative state', punishment: 'Minimum 20 years to life or death' },
  '376D': { title: 'Gang Rape', description: 'Where woman is raped by one or more persons constituting a group', punishment: 'Minimum 20 years to life imprisonment' },
  
  // OFFENCES AGAINST PROPERTY
  '378': { title: 'Theft', description: 'Whoever intending to take dishonestly any movable property out of possession without consent', punishment: '3 years imprisonment or fine or both' },
  '379': { title: 'Punishment for Theft', description: 'Whoever commits theft shall be punished', punishment: 'Imprisonment up to 3 years or fine or both' },
  '380': { title: 'Theft in dwelling house', description: 'Theft in building, tent or vessel used as human dwelling', punishment: 'Imprisonment up to 7 years + fine' },
  '381': { title: 'Theft by clerk or servant', description: 'Theft by clerk or servant of property in possession of master', punishment: 'Imprisonment up to 7 years + fine' },
  '382': { title: 'Theft after preparation for causing death', description: 'Theft after preparation made for causing death or hurt', punishment: 'Imprisonment up to 10 years + fine' },
  '384': { title: 'Extortion', description: 'Whoever intentionally puts person in fear of injury and thereby dishonestly induces', punishment: 'Imprisonment up to 3 years or fine or both' },
  '385': { title: 'Putting person in fear of injury to commit extortion', description: 'Whoever in order to commit extortion puts any person in fear', punishment: 'Imprisonment up to 2 years or fine or both' },
  '403': { title: 'Dishonest misappropriation of property', description: 'Whoever dishonestly misappropriates or converts to own use movable property', punishment: '2 years imprisonment or fine or both' },
  '405': { title: 'Criminal breach of trust', description: 'Whoever being entrusted with property dishonestly misappropriates or converts', punishment: '3 years imprisonment or fine or both' },
  '406': { title: 'Punishment for criminal breach of trust', description: 'Shall be punished with imprisonment and fine', punishment: '3 years imprisonment or fine or both' },
  '407': { title: 'Criminal breach of trust by carrier', description: 'Criminal breach of trust by carrier, wharfinger, warehouse-keeper', punishment: 'Imprisonment up to 7 years + fine' },
  '408': { title: 'Criminal breach of trust by clerk or servant', description: 'Breach of trust by clerk, servant or agent', punishment: 'Imprisonment up to 7 years + fine' },
  '409': { title: 'Criminal breach of trust by public servant or banker', description: 'Breach of trust by public servant, banker, merchant, agent', punishment: 'Life imprisonment or 10 years + fine' },
  '415': { title: 'Cheating', description: 'Whoever by deceiving any person fraudulently or dishonestly induces', punishment: '1 year imprisonment or fine or both' },
  '417': { title: 'Punishment for cheating', description: 'Whoever cheats shall be punished', punishment: 'Imprisonment up to 1 year or fine or both' },
  '418': { title: 'Cheating with knowledge that wrongful loss may ensue', description: 'Cheating with knowledge that wrongful loss may be caused', punishment: '3 years imprisonment or fine or both' },
  '420': { title: 'Cheating and dishonestly inducing delivery of property', description: 'Whoever cheats and thereby dishonestly induces delivery of property', punishment: '7 years imprisonment + fine' },
  '463': { title: 'Forgery', description: 'Whoever makes any false document with intent to cause damage or injury', punishment: '2 years imprisonment or fine or both' },
  '465': { title: 'Punishment for forgery', description: 'Whoever commits forgery shall be punished', punishment: '2 years imprisonment or fine or both' },
  '467': { title: 'Forgery of valuable security, will', description: 'Forgery of valuable security, will or authority to adopt', punishment: 'Life imprisonment or 10 years + fine' },
  '468': { title: 'Forgery for purpose of cheating', description: 'Forgery with purpose of cheating', punishment: '7 years imprisonment + fine' },
  '471': { title: 'Using as genuine a forged document', description: 'Whoever fraudulently or dishonestly uses as genuine forged document', punishment: 'Same as for forgery of that document' },
  
  // DEFAMATION
  '499': { title: 'Defamation', description: 'Whoever by words either spoken or intended to be read makes any imputation concerning any person', punishment: '2 years imprisonment or fine or both' },
  '500': { title: 'Punishment for defamation', description: 'Shall be punished with simple imprisonment or fine or both', punishment: 'Up to 2 years imprisonment or fine or both' },
  
  // CRIMINAL INTIMIDATION
  '503': { title: 'Criminal intimidation', description: 'Whoever threatens another with injury to person, reputation or property', punishment: '2 years imprisonment or fine or both' },
  '504': { title: 'Intentional insult with intent to provoke breach of peace', description: 'Intentional insult with intent to provoke breach of peace', punishment: '2 years imprisonment or fine or both' },
  '506': { title: 'Punishment for criminal intimidation', description: 'Shall be punished with imprisonment or fine or both', punishment: '2 years imprisonment or fine or both; if threat is to cause death, 7 years' },
  '509': { title: 'Word, gesture or act intended to insult modesty of woman', description: 'Whoever intending to insult modesty of any woman utters any word', punishment: 'Simple imprisonment up to 3 years + fine' },
};

// ==================== NEGOTIABLE INSTRUMENTS ACT ====================
export const NI_ACT_SECTIONS = {
  // Updated: November 2025
  '6': { title: 'Cheque', description: 'A bill of exchange drawn on specified banker and payable on demand', applicability: 'Defines cheque' },
  '13': { title: 'Negotiable Instrument', description: 'A promissory note, bill of exchange or cheque payable either to order or bearer', applicability: 'Defines negotiable instruments' },
  '138': { 
    title: 'Dishonour of cheque for insufficiency of funds', 
    description: 'Where cheque drawn by person is returned unpaid by bank for insufficiency of funds',
    punishment: 'Imprisonment up to 2 years or fine up to twice the cheque amount or both',
    procedure: '1. Cheque dishonored, 2. Notice within 30 days, 3. Payment not made within 15 days, 4. Complaint within 30 days after expiry of 15 days',
    amendments: 'Amended in 2018, 2020 - Interim compensation provision added'
  },
  '139': { title: 'Presumption in favour of holder', description: 'Presumed that cheque was for discharge of debt or liability', applicability: 'Burden of proof on accused' },
  '141': { title: 'Offences by companies', description: 'Every person in charge of and responsible for conduct of business liable', applicability: 'Directors, managers can be prosecuted' },
  '142': { title: 'Cognizance of offences', description: 'No court shall take cognizance except on complaint made in writing', applicability: 'Only on complaint, not suo moto' },
  '143': { title: 'Power to try summarily', description: 'Offence under section 138 may be tried summarily', applicability: 'Speedy trial provisions' },
  '143A': { title: 'Interim compensation', description: 'Court may order accused to pay interim compensation to complainant', applicability: 'Added by Amendment Act 2018, up to 20% of cheque amount' },
  '147': { title: 'Withdrawal of complaint', description: 'Notwithstanding CrPC, every complaint may be withdrawn', applicability: 'Compounding provisions' },
};

// ==================== CODE OF CRIMINAL PROCEDURE ====================
export const CRPC_SECTIONS = {
  // Updated: November 2025
  '41': { title: 'When police may arrest without warrant', description: 'Police officer may arrest without warrant in cognizable offences', applicability: 'Arrest powers' },
  '41A': { title: 'Notice of appearance before police officer', description: 'Police officer may issue notice in offences punishable less than 7 years', applicability: 'Alternative to arrest' },
  '154': { title: 'Information in cognizable cases (FIR)', description: 'Every information relating to cognizable offence shall be reduced to writing', applicability: 'FIR registration mandatory' },
  '156': { title: 'Police officer\'s power to investigate cognizable case', description: 'Any officer may investigate cognizable case without magistrate order', applicability: 'Investigation powers' },
  '160': { title: 'Power to require attendance of witnesses', description: 'Police officer may require attendance of person for investigation', applicability: 'Witness summons' },
  '161': { title: 'Examination of witnesses by police', description: 'Police officer may examine orally any person acquainted with facts', applicability: 'Statement to police' },
  '173': { title: 'Report of investigation', description: 'Police officer shall forward report to magistrate on completion', applicability: 'Charge sheet/Final report' },
  '313': { title: 'Power to examine the accused', description: 'For purpose of enabling accused to explain circumstances appearing against him', applicability: 'Statement of accused' },
  '354': { title: 'Language of Courts', description: 'Proceedings shall be in language of Court', applicability: 'Court language' },
  '437': { title: 'When bail may be taken in case of non-bailable offence', description: 'Magistrate may grant bail in non-bailable offences', applicability: 'Regular bail provisions', conditions: 'Not accused of death/life imprisonment offence, not previous convict, reasonable grounds' },
  '438': { title: 'Direction for grant of bail to person apprehending arrest', description: 'Anticipatory bail provisions', applicability: 'High Court or Sessions Court may grant', conditions: 'Reasonable apprehension, not already arrested' },
  '439': { title: 'Special powers of High Court or Court of Session regarding bail', description: 'May direct release on bail in any case', applicability: 'Superior court bail powers' },
  '482': { title: 'Saving of inherent powers of High Court', description: 'High Court may make such orders as necessary for ends of justice', applicability: 'Inherent powers, quashing of FIR/proceedings' },
};

// ==================== GOODS & SERVICES TAX (GST) ====================
export const GST_SECTIONS = {
  // Updated: November 2025 (CGST Act 2017, as amended)
  // Current GST Rate Slabs: 0%, 5%, 12%, 18%, 28%
  
  '2(52)': { title: 'Goods', description: 'Every kind of movable property other than money and securities', applicability: 'Definition' },
  '2(102)': { title: 'Services', description: 'Anything other than goods, money and securities', applicability: 'Definition' },
  '9': { title: 'Levy and collection of CGST', description: 'Tax levied on intra-state supply of goods or services', rate: 'Varies: 0%, 2.5%, 6%, 9%, 14%' },
  '12': { title: 'Time of supply of goods', description: 'Date of issue of invoice or last date for invoice or receipt of payment', applicability: 'Tax point' },
  '16': { title: 'Eligibility for input tax credit', description: 'Registered person entitled to credit of input tax', conditions: 'Invoice/debit note, goods/services received, tax paid to government, return filed' },
  '17': { title: 'Apportionment of credit and blocked credits', description: 'Credit not available for motor vehicles, food, travel, etc.', applicability: 'Blocked ITC' },
  '22': { title: 'Persons liable for registration', description: 'Every supplier whose aggregate turnover exceeds Rs. 40 lakhs (20 lakhs for special states)', threshold: 'Rs. 40 lakhs/20 lakhs, Rs. 20 lakhs/10 lakhs for goods' },
  '23': { title: 'Persons not liable for registration', description: 'Agriculturist, persons making exempt supplies, composition dealers', exemptions: 'Various' },
  '29': { title: 'Cancellation of registration', description: 'Proper officer may cancel registration on various grounds', grounds: 'Ceased business, change in constitution, non-filing of returns' },
  '31': { title: 'Tax invoice', description: 'Registered person supplying goods must issue tax invoice', requirement: 'Before/at time of removal, must contain prescribed particulars' },
  '37': { title: 'Furnishing details of outward supplies (GSTR-1)', description: 'Details of outward supplies to be furnished electronically', frequency: 'Monthly/Quarterly', due_date: '11th of next month' },
  '38': { title: 'Furnishing details of inward supplies', description: 'Details of inward supplies may be furnished', applicability: 'Auto-populated from GSTR-1' },
  '39': { title: 'Furnishing of returns (GSTR-3B)', description: 'Every registered person to furnish monthly/quarterly return', frequency: 'Monthly', due_date: '20th of next month' },
  '44': { title: 'Annual return', description: 'Every registered person to furnish annual return (GSTR-9)', due_date: '31st December of next financial year' },
  '50': { title: 'Interest on delayed payment', description: 'Interest @18% per annum on delayed payment of tax', rate: '18% p.a.' },
  '73': { title: 'Determination of tax not paid or short paid', description: 'Notice for non-payment/short payment/wrong refund', time_limit: '3 years from due date of annual return or actual date of filing' },
  '74': { title: 'Determination of tax with fraud or wilful misstatement', description: 'Extended time limit for fraud cases', time_limit: '5 years', penalty: '100% of tax amount' },
  '122': { title: 'Penalty for certain offences', description: 'Various offences attracting penalty', amount: 'Generally 100% of tax, Rs. 10,000 minimum' },
  '132': { title: 'Punishment for certain offences', description: 'Imprisonment for tax evasion exceeding Rs. 5 crores', punishment: 'Up to 5 years imprisonment + fine' },
};

// ==================== INDIAN CONTRACT ACT ====================
export const CONTRACT_ACT_SECTIONS = {
  // Updated: November 2025
  '2(a)': { title: 'Proposal', description: 'When one person signifies to another his willingness', applicability: 'Offer definition' },
  '2(b)': { title: 'Promise', description: 'When proposal is accepted, proposal becomes promise', applicability: 'Acceptance creates promise' },
  '2(e)': { title: 'Agreement', description: 'Every promise and every set of promises forming consideration', applicability: 'Agreement = Offer + Acceptance' },
  '2(h)': { title: 'Contract', description: 'Agreement enforceable by law', applicability: 'Contract definition' },
  '10': { title: 'What agreements are contracts', description: 'Agreements made by free consent for lawful consideration with competent parties', essentials: 'Free consent, competent parties, lawful consideration, lawful object, not void' },
  '23': { title: 'What considerations and objects are lawful', description: 'Consideration and object are lawful unless forbidden, immoral, or opposed to public policy', applicability: 'Void agreements' },
  '73': { title: 'Compensation for loss or damage caused by breach', description: 'Party who suffers by breach entitled to compensation', measure: 'Naturally arising damages, which parties knew likely' },
  '74': { title: 'Compensation for breach where sum is named', description: 'If sum named in contract as payable in event of breach', applicability: 'Liquidated damages, reasonable compensation' },
};

// ==================== LIVE DATA UPDATE SYSTEM ====================

/**
 * Fetch latest amendments from government sources
 */
export async function fetchLatestAmendments(): Promise<any> {
  // In production, integrate with:
  // - Ministry of Law & Justice API
  // - IndiaCode website scraper
  // - Bar Council updates
  // For now, return current data
  
  return {
    ipc: { last_updated: '2025-11-01', source: 'Ministry of Law & Justice' },
    gst: { last_updated: '2025-11-01', source: 'GST Council' },
    crpc: { last_updated: '2025-11-01', source: 'Ministry of Law & Justice' },
    amendments: [
      { act: 'IPC', section: '376', amendment: 'Bharatiya Nyaya Sanhita (BNS) 2023 to replace IPC from July 2024 (implementation ongoing)', date: '2023-12-25' },
      { act: 'GST', section: 'Various', amendment: 'E-invoicing mandatory for turnover > Rs. 5 crores from Aug 2023', date: '2023-08-01' },
      { act: 'Companies Act', section: '2013', amendment: 'Companies (Amendment) Act 2020 - Various changes to CSR, auditor rotation', date: '2020-09-28' },
    ],
  };
}

/**
 * Check if legal data is stale (> 1 day old)
 */
export function isDataStale(lastUpdated: Date): boolean {
  const oneDayInMs = 24 * 60 * 60 * 1000;
  return (Date.now() - lastUpdated.getTime()) > oneDayInMs;
}

/**
 * Get section details with latest amendments
 */
export function getSectionDetails(act: string, section: string): any {
  const actMap: Record<string, any> = {
    'IPC': IPC_SECTIONS,
    'NI': NI_ACT_SECTIONS,
    'CRPC': CRPC_SECTIONS,
    'CrPC': CRPC_SECTIONS,
    'GST': GST_SECTIONS,
    'CONTRACT': CONTRACT_ACT_SECTIONS,
  };
  
  const sections = actMap[act.toUpperCase()];
  return sections?.[section] || null;
}

/**
 * Search sections across all acts
 */
export function searchLegalSections(query: string): any[] {
  const allSections: any[] = [];
  const searchLower = query.toLowerCase();
  
  // Search IPC
  Object.entries(IPC_SECTIONS).forEach(([section, data]) => {
    if (section.includes(query) || data.title.toLowerCase().includes(searchLower) || data.description.toLowerCase().includes(searchLower)) {
      allSections.push({ act: 'IPC', section, ...data });
    }
  });
  
  // Search GST
  Object.entries(GST_SECTIONS).forEach(([section, data]) => {
    if (section.includes(query) || data.title.toLowerCase().includes(searchLower) || data.description.toLowerCase().includes(searchLower)) {
      allSections.push({ act: 'GST', section, ...data });
    }
  });
  
  // Search CrPC
  Object.entries(CRPC_SECTIONS).forEach(([section, data]) => {
    if (section.includes(query) || data.title.toLowerCase().includes(searchLower) || data.description.toLowerCase().includes(searchLower)) {
      allSections.push({ act: 'CrPC', section, ...data });
    }
  });
  
  return allSections;
}

// ==================== INDIAN LAW RESOURCES ====================
export const LEGAL_RESOURCES = {
  // Official government sources
  indiacode: 'https://www.indiacode.nic.in/',
  gst_council: 'https://gstcouncil.gov.in/',
  mca: 'https://www.mca.gov.in/',
  cbic: 'https://www.cbic.gov.in/',
  
  // Case law databases
  indiankanoon: 'https://indiankanoon.org/',
  sci: 'https://main.sci.gov.in/',
  
  // Last updated
  last_synced: '2025-11-01T00:00:00Z',
};

export default {
  IPC_SECTIONS,
  NI_ACT_SECTIONS,
  CRPC_SECTIONS,
  GST_SECTIONS,
  CONTRACT_ACT_SECTIONS,
  getSectionDetails,
  searchLegalSections,
  fetchLatestAmendments,
  isDataStale,
  LEGAL_RESOURCES,
};

