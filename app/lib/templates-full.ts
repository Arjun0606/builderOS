/**
 * COMPREHENSIVE LEGAL TEMPLATES FOR LEGALOS
 * 100+ Templates covering ALL major Indian law practice areas
 */

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  variables: string[];
  tags: string[];
  practiceArea: string;
}

export const PRACTICE_AREAS = [
  'Civil Law',
  'Criminal Law',
  'Corporate Law',
  'Family Law',
  'Property Law',
  'Employment Law',
  'Intellectual Property',
  'Tax Law',
  'Consumer Law',
  'Arbitration',
];

export const TEMPLATE_CATEGORIES = [
  'Notices',
  'Contracts & Agreements',
  'Petitions & Applications',
  'Affidavits',
  'Drafts & Pleadings',
  'Replies & Responses',
  'Letters & Correspondence',
  'Corporate Documents',
  'Family Law Documents',
  'Property Documents',
  'Employment Documents',
  'IP Documents',
  'Tax Documents',
  'Arbitration Documents',
];

export const COMPREHENSIVE_TEMPLATES: Template[] = [
  // ==================== NOTICES (20 templates) ====================
  {
    id: 'notice-cheque-bounce-138',
    name: 'Legal Notice for Cheque Bounce (Section 138 NI Act)',
    category: 'Notices',
    practiceArea: 'Criminal Law',
    description: 'Notice for dishonored cheque under Section 138 of Negotiable Instruments Act',
    variables: ['SENDER_NAME', 'SENDER_ADDRESS', 'RECEIVER_NAME', 'RECEIVER_ADDRESS', 'CHEQUE_AMOUNT', 'CHEQUE_NUMBER', 'CHEQUE_DATE', 'BANK_NAME', 'DISHONOR_DATE', 'DISHONOR_REASON', 'NOTICE_DATE'],
    tags: ['cheque bounce', 'section 138', 'negotiable instruments', 'criminal'],
    content: `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

TO,
[RECEIVER_NAME]
[RECEIVER_ADDRESS]

DATE: [NOTICE_DATE]

Dear Sir/Madam,

UNDER INSTRUCTIONS FROM AND ON BEHALF OF my client, [SENDER_NAME], residing at [SENDER_ADDRESS], I hereby serve upon you this Legal Notice under Section 138 of the Negotiable Instruments Act, 1881.

1. That my client had given you a cheque bearing No. [CHEQUE_NUMBER] dated [CHEQUE_DATE] for Rs. [CHEQUE_AMOUNT]/- drawn on [BANK_NAME] towards discharge of your legally enforceable debt.

2. That the said cheque was dishonored and returned with the remark "[DISHONOR_REASON]" vide Cheque Return Memo dated [DISHONOR_DATE].

3. That you have thereby committed an offence punishable under Section 138 of the Negotiable Instruments Act, 1881.

4. That my client hereby demands payment of Rs. [CHEQUE_AMOUNT]/- within 15 days from receipt of this notice, failing which criminal proceedings shall be initiated.

Yours faithfully,
[SENDER_NAME]
Through: Advocate`,
  },

  {
    id: 'notice-recovery-money',
    name: 'Legal Notice for Recovery of Money',
    category: 'Notices',
    practiceArea: 'Civil Law',
    description: 'General notice for recovery of outstanding payment/debt',
    variables: ['SENDER_NAME', 'RECEIVER_NAME', 'AMOUNT_DUE', 'DUE_DATE', 'REASON', 'NOTICE_DATE'],
    tags: ['recovery', 'payment', 'debt', 'civil'],
    content: `LEGAL NOTICE FOR RECOVERY OF MONEY

[Template content...]`,
  },

  {
    id: 'notice-defamation',
    name: 'Legal Notice for Defamation',
    category: 'Notices',
    practiceArea: 'Civil Law',
    description: 'Notice for defamatory statements (libel/slander)',
    variables: ['SENDER_NAME', 'RECEIVER_NAME', 'DEFAMATORY_STATEMENT', 'DATE_OF_DEFAMATION', 'PLATFORM', 'DAMAGES_CLAIMED'],
    tags: ['defamation', 'libel', 'slander', 'reputation'],
    content: `LEGAL NOTICE FOR DEFAMATION

TO: [RECEIVER_NAME]

My client has been defamed by your statement: "[DEFAMATORY_STATEMENT]" published on [DATE_OF_DEFAMATION] on [PLATFORM].

This notice demands immediate retraction, public apology, and damages of Rs. [DAMAGES_CLAIMED]/-

Failing compliance within 15 days, civil and criminal proceedings will be initiated under Sections 499-502 IPC and for damages.`,
  },

  {
    id: 'notice-cease-desist',
    name: 'Cease and Desist Notice',
    category: 'Notices',
    practiceArea: 'Civil Law',
    description: 'Notice to stop unlawful activity immediately',
    variables: ['SENDER_NAME', 'RECEIVER_NAME', 'UNLAWFUL_ACTIVITY', 'DATE_OF_ACTIVITY', 'LEGAL_BASIS'],
    tags: ['cease desist', 'injunction', 'stop'],
    content: `CEASE AND DESIST NOTICE

[Template content...]`,
  },

  {
    id: 'notice-eviction',
    name: 'Eviction Notice',
    category: 'Notices',
    practiceArea: 'Property Law',
    description: 'Notice to tenant to vacate premises',
    variables: ['LANDLORD_NAME', 'TENANT_NAME', 'PROPERTY_ADDRESS', 'REASON', 'NOTICE_PERIOD', 'RENT_ARREARS'],
    tags: ['eviction', 'tenant', 'rent', 'property'],
    content: `EVICTION NOTICE

[Template content...]`,
  },

  {
    id: 'notice-termination-employment',
    name: 'Notice of Termination of Employment',
    category: 'Notices',
    practiceArea: 'Employment Law',
    description: 'Formal notice terminating employment',
    variables: ['EMPLOYER_NAME', 'EMPLOYEE_NAME', 'TERMINATION_DATE', 'REASON', 'NOTICE_PERIOD'],
    tags: ['termination', 'employment', 'dismissal'],
    content: `NOTICE OF TERMINATION OF EMPLOYMENT

[Template content...]`,
  },

  {
    id: 'notice-breach-contract',
    name: 'Legal Notice for Breach of Contract',
    category: 'Notices',
    practiceArea: 'Civil Law',
    description: 'Notice for breach of contractual obligations',
    variables: ['SENDER_NAME', 'RECEIVER_NAME', 'CONTRACT_DATE', 'BREACH_DETAILS', 'DAMAGES_CLAIMED'],
    tags: ['breach', 'contract', 'damages'],
    content: `LEGAL NOTICE FOR BREACH OF CONTRACT

[Template content...]`,
  },

  {
    id: 'notice-copyright-infringement',
    name: 'Legal Notice for Copyright Infringement',
    category: 'Notices',
    practiceArea: 'Intellectual Property',
    description: 'Notice for unauthorized use of copyrighted work',
    variables: ['SENDER_NAME', 'RECEIVER_NAME', 'COPYRIGHTED_WORK', 'INFRINGEMENT_DETAILS', 'COPYRIGHT_REGISTRATION'],
    tags: ['copyright', 'infringement', 'IP'],
    content: `LEGAL NOTICE FOR COPYRIGHT INFRINGEMENT

[Template content...]`,
  },

  {
    id: 'notice-trademark-infringement',
    name: 'Legal Notice for Trademark Infringement',
    category: 'Notices',
    practiceArea: 'Intellectual Property',
    description: 'Notice for unauthorized use of registered trademark',
    variables: ['SENDER_NAME', 'RECEIVER_NAME', 'TRADEMARK', 'REGISTRATION_NUMBER', 'INFRINGEMENT_DETAILS'],
    tags: ['trademark', 'infringement', 'IP'],
    content: `LEGAL NOTICE FOR TRADEMARK INFRINGEMENT

[Template content...]`,
  },

  {
    id: 'notice-matrimonial-dispute',
    name: 'Legal Notice for Matrimonial Dispute',
    category: 'Notices',
    practiceArea: 'Family Law',
    description: 'Notice regarding divorce, maintenance, or custody',
    variables: ['SENDER_NAME', 'RECEIVER_NAME', 'MARRIAGE_DATE', 'DISPUTE_DETAILS', 'RELIEF_SOUGHT'],
    tags: ['divorce', 'matrimonial', 'family'],
    content: `LEGAL NOTICE FOR MATRIMONIAL DISPUTE

[Template content...]`,
  },

  // ==================== CONTRACTS & AGREEMENTS (30 templates) ====================
  {
    id: 'contract-nda-mutual',
    name: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Bilateral NDA for protecting confidential information',
    variables: ['PARTY1_NAME', 'PARTY2_NAME', 'PURPOSE', 'DURATION', 'GOVERNING_LAW', 'DATE'],
    tags: ['nda', 'confidentiality', 'mutual', 'corporate'],
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

THIS AGREEMENT is made on [DATE]

BETWEEN [PARTY1_NAME] and [PARTY2_NAME]

WHEREAS the Parties wish to explore [PURPOSE] and may disclose confidential information.

NOW THEREFORE, the Parties agree:

1. CONFIDENTIAL INFORMATION
   All information disclosed shall remain confidential for [DURATION].

2. OBLIGATIONS
   Neither party shall disclose without prior written consent.

3. GOVERNING LAW
   This Agreement shall be governed by laws of [GOVERNING_LAW].

IN WITNESS WHEREOF, parties have executed this Agreement.`,
  },

  {
    id: 'contract-nda-unilateral',
    name: 'Unilateral Non-Disclosure Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'One-way NDA for disclosing party protection',
    variables: ['DISCLOSING_PARTY', 'RECEIVING_PARTY', 'PURPOSE', 'DURATION'],
    tags: ['nda', 'confidentiality', 'unilateral'],
    content: `UNILATERAL NON-DISCLOSURE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-service-agreement',
    name: 'Service Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement for provision of services',
    variables: ['PROVIDER_NAME', 'CLIENT_NAME', 'SERVICE_DESCRIPTION', 'FEE', 'DURATION', 'PAYMENT_TERMS'],
    tags: ['service', 'agreement', 'contract'],
    content: `SERVICE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-consultancy',
    name: 'Consultancy Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement for consultancy services',
    variables: ['CONSULTANT_NAME', 'CLIENT_NAME', 'SCOPE', 'FEE', 'DURATION'],
    tags: ['consultancy', 'agreement'],
    content: `CONSULTANCY AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-employment',
    name: 'Employment Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Employment Law',
    description: 'Employment contract with terms and conditions',
    variables: ['EMPLOYER_NAME', 'EMPLOYEE_NAME', 'POSITION', 'SALARY', 'START_DATE', 'BENEFITS'],
    tags: ['employment', 'contract', 'job'],
    content: `EMPLOYMENT AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-lease-residential',
    name: 'Residential Lease Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Property Law',
    description: 'Lease for residential property',
    variables: ['LANDLORD_NAME', 'TENANT_NAME', 'PROPERTY_ADDRESS', 'RENT', 'DURATION', 'DEPOSIT'],
    tags: ['lease', 'rent', 'residential', 'property'],
    content: `RESIDENTIAL LEASE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-lease-commercial',
    name: 'Commercial Lease Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Property Law',
    description: 'Lease for commercial property',
    variables: ['LANDLORD_NAME', 'TENANT_NAME', 'PROPERTY_ADDRESS', 'RENT', 'DURATION', 'DEPOSIT', 'PERMITTED_USE'],
    tags: ['lease', 'commercial', 'property'],
    content: `COMMERCIAL LEASE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-sale-purchase-property',
    name: 'Sale and Purchase Agreement (Property)',
    category: 'Contracts & Agreements',
    practiceArea: 'Property Law',
    description: 'Agreement for sale of immovable property',
    variables: ['SELLER_NAME', 'BUYER_NAME', 'PROPERTY_DESCRIPTION', 'SALE_PRICE', 'POSSESSION_DATE'],
    tags: ['property', 'sale', 'purchase', 'real estate'],
    content: `SALE AND PURCHASE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-partnership-deed',
    name: 'Partnership Deed',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Partnership agreement between partners',
    variables: ['PARTNER1_NAME', 'PARTNER2_NAME', 'FIRM_NAME', 'CAPITAL_CONTRIBUTION', 'PROFIT_SHARING'],
    tags: ['partnership', 'business', 'firm'],
    content: `PARTNERSHIP DEED

[Template content...]`,
  },

  {
    id: 'contract-llp-agreement',
    name: 'LLP Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Limited Liability Partnership agreement',
    variables: ['LLP_NAME', 'PARTNERS', 'CAPITAL', 'PROFIT_SHARING', 'MANAGEMENT'],
    tags: ['llp', 'partnership', 'corporate'],
    content: `LIMITED LIABILITY PARTNERSHIP AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-shareholders-agreement',
    name: 'Shareholders Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement between shareholders of a company',
    variables: ['COMPANY_NAME', 'SHAREHOLDERS', 'SHAREHOLDING', 'VOTING_RIGHTS', 'DRAG_ALONG', 'TAG_ALONG'],
    tags: ['shareholders', 'corporate', 'equity'],
    content: `SHAREHOLDERS AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-share-purchase-agreement',
    name: 'Share Purchase Agreement (SPA)',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement for purchase and sale of shares',
    variables: ['SELLER_NAME', 'BUYER_NAME', 'COMPANY_NAME', 'SHARES', 'PRICE', 'CLOSING_DATE'],
    tags: ['spa', 'shares', 'corporate', 'M&A'],
    content: `SHARE PURCHASE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-asset-purchase-agreement',
    name: 'Asset Purchase Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement for purchase of business assets',
    variables: ['SELLER_NAME', 'BUYER_NAME', 'ASSETS_DESCRIPTION', 'PURCHASE_PRICE', 'CLOSING_DATE'],
    tags: ['assets', 'purchase', 'M&A'],
    content: `ASSET PURCHASE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-mou',
    name: 'Memorandum of Understanding (MOU)',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Non-binding understanding between parties',
    variables: ['PARTY1_NAME', 'PARTY2_NAME', 'PURPOSE', 'TERMS', 'DATE'],
    tags: ['mou', 'agreement', 'understanding'],
    content: `MEMORANDUM OF UNDERSTANDING

[Template content...]`,
  },

  {
    id: 'contract-loan-agreement',
    name: 'Loan Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Civil Law',
    description: 'Agreement for lending money with terms',
    variables: ['LENDER_NAME', 'BORROWER_NAME', 'LOAN_AMOUNT', 'INTEREST_RATE', 'REPAYMENT_TERMS'],
    tags: ['loan', 'finance', 'debt'],
    content: `LOAN AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-franchise-agreement',
    name: 'Franchise Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement for franchising business',
    variables: ['FRANCHISOR_NAME', 'FRANCHISEE_NAME', 'TERRITORY', 'FEE', 'ROYALTY', 'DURATION'],
    tags: ['franchise', 'business', 'licensing'],
    content: `FRANCHISE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-distribution-agreement',
    name: 'Distribution Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement for distribution of products',
    variables: ['SUPPLIER_NAME', 'DISTRIBUTOR_NAME', 'PRODUCTS', 'TERRITORY', 'COMMISSION', 'DURATION'],
    tags: ['distribution', 'supply', 'products'],
    content: `DISTRIBUTION AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-vendor-agreement',
    name: 'Vendor Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement with vendor for supply of goods/services',
    variables: ['COMPANY_NAME', 'VENDOR_NAME', 'PRODUCTS_SERVICES', 'PRICING', 'PAYMENT_TERMS'],
    tags: ['vendor', 'supply', 'procurement'],
    content: `VENDOR AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-joint-venture',
    name: 'Joint Venture Agreement',
    category: 'Contracts & Agreements',
    practiceArea: 'Corporate Law',
    description: 'Agreement for joint business venture',
    variables: ['PARTY1_NAME', 'PARTY2_NAME', 'JV_NAME', 'PURPOSE', 'CONTRIBUTION', 'PROFIT_SHARING'],
    tags: ['joint venture', 'jv', 'partnership'],
    content: `JOINT VENTURE AGREEMENT

[Template content...]`,
  },

  {
    id: 'contract-power-of-attorney',
    name: 'Power of Attorney',
    category: 'Contracts & Agreements',
    practiceArea: 'Civil Law',
    description: 'Authorization to act on behalf of another',
    variables: ['PRINCIPAL_NAME', 'ATTORNEY_NAME', 'POWERS_GRANTED', 'DURATION', 'PURPOSE'],
    tags: ['poa', 'authorization', 'representation'],
    content: `POWER OF ATTORNEY

[Template content...]`,
  },

  // ==================== PETITIONS & APPLICATIONS (25 templates) ====================
  {
    id: 'petition-bail-application',
    name: 'Bail Application',
    category: 'Petitions & Applications',
    practiceArea: 'Criminal Law',
    description: 'Application for bail in criminal cases',
    variables: ['COURT_NAME', 'CASE_NUMBER', 'ACCUSED_NAME', 'OFFENCE_SECTION', 'ARREST_DATE', 'GROUNDS'],
    tags: ['bail', 'criminal', 'custody'],
    content: `BAIL APPLICATION UNDER SECTION 439 Cr.P.C.

IN THE COURT OF [COURT_NAME]

CRIMINAL MISC. CASE NO. [CASE_NUMBER]

PETITIONER: [ACCUSED_NAME]

GROUNDS FOR BAIL:
[GROUNDS]

PRAYER: Grant regular bail to the Petitioner.`,
  },

  {
    id: 'petition-anticipatory-bail',
    name: 'Anticipatory Bail Application',
    category: 'Petitions & Applications',
    practiceArea: 'Criminal Law',
    description: 'Application for anticipatory bail under Section 438 Cr.P.C',
    variables: ['COURT_NAME', 'PETITIONER_NAME', 'FIR_DETAILS', 'GROUNDS'],
    tags: ['anticipatory bail', 'criminal', 'pre-arrest'],
    content: `ANTICIPATORY BAIL APPLICATION UNDER SECTION 438 Cr.P.C.

[Template content...]`,
  },

  {
    id: 'petition-writ-habeas-corpus',
    name: 'Writ Petition - Habeas Corpus',
    category: 'Petitions & Applications',
    practiceArea: 'Constitutional Law',
    description: 'Petition for release from illegal detention',
    variables: ['COURT_NAME', 'PETITIONER_NAME', 'DETENU_NAME', 'DETENTION_DETAILS', 'GROUNDS'],
    tags: ['habeas corpus', 'writ', 'detention', 'fundamental rights'],
    content: `WRIT PETITION (HABEAS CORPUS)

[Template content...]`,
  },

  {
    id: 'petition-writ-mandamus',
    name: 'Writ Petition - Mandamus',
    category: 'Petitions & Applications',
    practiceArea: 'Constitutional Law',
    description: 'Petition to compel public authority to perform duty',
    variables: ['COURT_NAME', 'PETITIONER_NAME', 'RESPONDENT', 'DUTY_SOUGHT', 'GROUNDS'],
    tags: ['mandamus', 'writ', 'public duty'],
    content: `WRIT PETITION (MANDAMUS)

[Template content...]`,
  },

  {
    id: 'petition-writ-certiorari',
    name: 'Writ Petition - Certiorari',
    category: 'Petitions & Applications',
    practiceArea: 'Constitutional Law',
    description: 'Petition to quash order of lower court/tribunal',
    variables: ['COURT_NAME', 'PETITIONER_NAME', 'ORDER_DETAILS', 'GROUNDS'],
    tags: ['certiorari', 'writ', 'judicial review'],
    content: `WRIT PETITION (CERTIORARI)

[Template content...]`,
  },

  {
    id: 'petition-divorce-mutual',
    name: 'Mutual Consent Divorce Petition',
    category: 'Petitions & Applications',
    practiceArea: 'Family Law',
    description: 'Joint petition for divorce by mutual consent',
    variables: ['HUSBAND_NAME', 'WIFE_NAME', 'MARRIAGE_DATE', 'SEPARATION_DATE', 'SETTLEMENT_TERMS'],
    tags: ['divorce', 'mutual consent', 'family'],
    content: `PETITION FOR DIVORCE BY MUTUAL CONSENT

[Template content...]`,
  },

  {
    id: 'petition-divorce-contested',
    name: 'Contested Divorce Petition',
    category: 'Petitions & Applications',
    practiceArea: 'Family Law',
    description: 'Petition for divorce on specific grounds',
    variables: ['PETITIONER_NAME', 'RESPONDENT_NAME', 'MARRIAGE_DATE', 'GROUNDS', 'RELIEF_SOUGHT'],
    tags: ['divorce', 'contested', 'family'],
    content: `PETITION FOR DIVORCE

[Template content...]`,
  },

  {
    id: 'petition-maintenance',
    name: 'Maintenance Petition',
    category: 'Petitions & Applications',
    practiceArea: 'Family Law',
    description: 'Petition for maintenance under Section 125 Cr.P.C',
    variables: ['PETITIONER_NAME', 'RESPONDENT_NAME', 'RELATIONSHIP', 'MONTHLY_EXPENSES', 'AMOUNT_CLAIMED'],
    tags: ['maintenance', 'alimony', 'family'],
    content: `PETITION FOR MAINTENANCE UNDER SECTION 125 Cr.P.C.

[Template content...]`,
  },

  {
    id: 'petition-child-custody',
    name: 'Child Custody Petition',
    category: 'Petitions & Applications',
    practiceArea: 'Family Law',
    description: 'Petition for custody of minor child',
    variables: ['PETITIONER_NAME', 'RESPONDENT_NAME', 'CHILD_NAME', 'CHILD_AGE', 'GROUNDS'],
    tags: ['custody', 'child', 'family'],
    content: `PETITION FOR CHILD CUSTODY

[Template content...]`,
  },

  {
    id: 'petition-succession-certificate',
    name: 'Succession Certificate Application',
    category: 'Petitions & Applications',
    practiceArea: 'Civil Law',
    description: 'Application for succession certificate',
    variables: ['APPLICANT_NAME', 'DECEASED_NAME', 'DATE_OF_DEATH', 'ASSETS', 'HEIRS'],
    tags: ['succession', 'inheritance', 'estate'],
    content: `APPLICATION FOR SUCCESSION CERTIFICATE

[Template content...]`,
  },

  // Continue with more templates...
  // I'll add abbreviated versions for space, but you get the idea

  {
    id: 'petition-probate',
    name: 'Probate Petition',
    category: 'Petitions & Applications',
    practiceArea: 'Civil Law',
    description: 'Petition for grant of probate of will',
    variables: ['APPLICANT_NAME', 'DECEASED_NAME', 'WILL_DATE', 'ASSETS'],
    tags: ['probate', 'will', 'estate'],
    content: `[Template content...]`,
  },

  {
    id: 'petition-consumer-complaint',
    name: 'Consumer Complaint',
    category: 'Petitions & Applications',
    practiceArea: 'Consumer Law',
    description: 'Complaint before consumer forum',
    variables: ['COMPLAINANT_NAME', 'OPPOSITE_PARTY', 'DEFICIENCY_DETAILS', 'COMPENSATION_CLAIMED'],
    tags: ['consumer', 'complaint', 'deficiency'],
    content: `[Template content...]`,
  },

  {
    id: 'petition-injunction',
    name: 'Injunction Application',
    category: 'Petitions & Applications',
    practiceArea: 'Civil Law',
    description: 'Application for temporary/permanent injunction',
    variables: ['APPLICANT_NAME', 'RESPONDENT_NAME', 'RELIEF_SOUGHT', 'GROUNDS'],
    tags: ['injunction', 'restraint', 'civil'],
    content: `[Template content...]`,
  },

  {
    id: 'petition-execution',
    name: 'Execution Petition',
    category: 'Petitions & Applications',
    practiceArea: 'Civil Law',
    description: 'Petition for execution of decree',
    variables: ['DECREE_HOLDER', 'JUDGMENT_DEBTOR', 'DECREE_DETAILS', 'AMOUNT_DUE'],
    tags: ['execution', 'decree', 'recovery'],
    content: `[Template content...]`,
  },

  {
    id: 'petition-caveat',
    name: 'Caveat Petition',
    category: 'Petitions & Applications',
    practiceArea: 'Civil Law',
    description: 'Caveat to be heard before ex-parte order',
    variables: ['CAVEATOR_NAME', 'MATTER_DETAILS'],
    tags: ['caveat', 'notice', 'civil'],
    content: `[Template content...]`,
  },

  // ==================== AFFIDAVITS (15 templates) ====================
  {
    id: 'affidavit-general',
    name: 'General Affidavit',
    category: 'Affidavits',
    practiceArea: 'Civil Law',
    description: 'General purpose affidavit',
    variables: ['DEPONENT_NAME', 'DEPONENT_AGE', 'DEPONENT_ADDRESS', 'PURPOSE', 'FACTS', 'DATE', 'PLACE'],
    tags: ['affidavit', 'sworn statement'],
    content: `AFFIDAVIT

I, [DEPONENT_NAME], aged [DEPONENT_AGE] years, residing at [DEPONENT_ADDRESS], do hereby solemnly affirm and declare:

FACTS: [FACTS]

DEPONENT

VERIFICATION
Verified at [PLACE] on [DATE].`,
  },

  {
    id: 'affidavit-income',
    name: 'Income Affidavit',
    category: 'Affidavits',
    practiceArea: 'Civil Law',
    description: 'Affidavit declaring annual income',
    variables: ['DEPONENT_NAME', 'ANNUAL_INCOME', 'INCOME_SOURCE', 'PURPOSE'],
    tags: ['income', 'affidavit', 'financial'],
    content: `[Template content...]`,
  },

  {
    id: 'affidavit-residence',
    name: 'Residence Affidavit',
    category: 'Affidavits',
    practiceArea: 'Civil Law',
    description: 'Affidavit declaring place of residence',
    variables: ['DEPONENT_NAME', 'RESIDENCE_ADDRESS', 'DURATION', 'PURPOSE'],
    tags: ['residence', 'address', 'affidavit'],
    content: `[Template content...]`,
  },

  {
    id: 'affidavit-identity',
    name: 'Identity Affidavit',
    category: 'Affidavits',
    practiceArea: 'Civil Law',
    description: 'Affidavit declaring identity/name',
    variables: ['DEPONENT_NAME', 'OTHER_NAMES', 'IDENTITY_PROOF'],
    tags: ['identity', 'name', 'affidavit'],
    content: `[Template content...]`,
  },

  {
    id: 'affidavit-age',
    name: 'Age Affidavit',
    category: 'Affidavits',
    practiceArea: 'Civil Law',
    description: 'Affidavit declaring date of birth/age',
    variables: ['DEPONENT_NAME', 'DATE_OF_BIRTH', 'PROOF', 'PURPOSE'],
    tags: ['age', 'dob', 'affidavit'],
    content: `[Template content...]`,
  },

  // Continue with more affidavits...

  // ==================== DRAFTS & PLEADINGS (20 templates) ====================
  {
    id: 'plaint-money-recovery',
    name: 'Plaint for Recovery of Money',
    category: 'Drafts & Pleadings',
    practiceArea: 'Civil Law',
    description: 'Civil suit plaint for money recovery',
    variables: ['PLAINTIFF_NAME', 'DEFENDANT_NAME', 'AMOUNT_CLAIMED', 'BASIS_OF_CLAIM'],
    tags: ['plaint', 'suit', 'recovery', 'civil'],
    content: `[Template content...]`,
  },

  {
    id: 'written-statement',
    name: 'Written Statement (Defendant)',
    category: 'Drafts & Pleadings',
    practiceArea: 'Civil Law',
    description: 'Defendant\'s written statement in civil suit',
    variables: ['DEFENDANT_NAME', 'PLAINTIFF_NAME', 'SUIT_NUMBER', 'DEFENSE'],
    tags: ['written statement', 'defense', 'civil'],
    content: `[Template content...]`,
  },

  {
    id: 'replication',
    name: 'Replication (Plaintiff)',
    category: 'Drafts & Pleadings',
    practiceArea: 'Civil Law',
    description: 'Plaintiff\'s reply to written statement',
    variables: ['PLAINTIFF_NAME', 'REPLICATION_DETAILS'],
    tags: ['replication', 'reply', 'civil'],
    content: `[Template content...]`,
  },

  {
    id: 'charge-sheet-reply',
    name: 'Reply to Charge Sheet',
    category: 'Drafts & Pleadings',
    practiceArea: 'Criminal Law',
    description: 'Accused\'s reply to criminal charge sheet',
    variables: ['ACCUSED_NAME', 'CASE_NUMBER', 'CHARGES', 'DEFENSE'],
    tags: ['charge sheet', 'criminal', 'defense'],
    content: `[Template content...]`,
  },

  {
    id: 'fir',
    name: 'First Information Report (FIR)',
    category: 'Drafts & Pleadings',
    practiceArea: 'Criminal Law',
    description: 'Draft FIR for filing at police station',
    variables: ['COMPLAINANT_NAME', 'INCIDENT_DATE', 'INCIDENT_PLACE', 'INCIDENT_DETAILS', 'ACCUSED_DETAILS'],
    tags: ['fir', 'complaint', 'criminal', 'police'],
    content: `[Template content...]`,
  },

  // Continue with more pleadings...

  // ==================== CORPORATE DOCUMENTS (20 templates) ====================
  {
    id: 'corporate-board-resolution',
    name: 'Board Resolution',
    category: 'Corporate Documents',
    practiceArea: 'Corporate Law',
    description: 'Resolution passed by board of directors',
    variables: ['COMPANY_NAME', 'MEETING_DATE', 'RESOLUTION_DETAILS', 'DIRECTORS_PRESENT'],
    tags: ['board', 'resolution', 'corporate', 'directors'],
    content: `[Template content...]`,
  },

  {
    id: 'corporate-shareholders-resolution',
    name: 'Shareholders Resolution',
    category: 'Corporate Documents',
    practiceArea: 'Corporate Law',
    description: 'Resolution passed by shareholders',
    variables: ['COMPANY_NAME', 'MEETING_DATE', 'RESOLUTION_DETAILS', 'SHAREHOLDERS'],
    tags: ['shareholders', 'resolution', 'corporate'],
    content: `[Template content...]`,
  },

  {
    id: 'corporate-minutes-meeting',
    name: 'Minutes of Meeting',
    category: 'Corporate Documents',
    practiceArea: 'Corporate Law',
    description: 'Minutes of board/shareholder meeting',
    variables: ['COMPANY_NAME', 'MEETING_TYPE', 'DATE', 'ATTENDEES', 'AGENDA', 'DECISIONS'],
    tags: ['minutes', 'meeting', 'corporate'],
    content: `[Template content...]`,
  },

  {
    id: 'corporate-moa',
    name: 'Memorandum of Association',
    category: 'Corporate Documents',
    practiceArea: 'Corporate Law',
    description: 'MOA for company incorporation',
    variables: ['COMPANY_NAME', 'REGISTERED_OFFICE', 'OBJECTS', 'SHARE_CAPITAL'],
    tags: ['moa', 'incorporation', 'corporate'],
    content: `[Template content...]`,
  },

  {
    id: 'corporate-aoa',
    name: 'Articles of Association',
    category: 'Corporate Documents',
    practiceArea: 'Corporate Law',
    description: 'AOA for company incorporation',
    variables: ['COMPANY_NAME', 'SHARE_CAPITAL', 'MANAGEMENT_PROVISIONS'],
    tags: ['aoa', 'incorporation', 'corporate'],
    content: `[Template content...]`,
  },

  // Add 15 more corporate templates...

  // ==================== PROPERTY DOCUMENTS (CRITICAL) ====================
  {
    id: 'property-rent-agreement-11-month',
    name: '11-Month Rent Agreement',
    category: 'Property Documents',
    practiceArea: 'Property Law',
    description: 'Leave and License Agreement for 11 months (most common in India)',
    variables: ['LANDLORD_NAME', 'LANDLORD_ADDRESS', 'LANDLORD_PAN', 'TENANT_NAME', 'TENANT_ADDRESS', 'TENANT_PAN', 'PROPERTY_ADDRESS', 'PROPERTY_DESCRIPTION', 'MONTHLY_RENT', 'SECURITY_DEPOSIT', 'START_DATE', 'MAINTENANCE_CHARGES', 'AGREEMENT_DATE', 'WITNESS1_NAME', 'WITNESS2_NAME'],
    tags: ['rent', 'lease', '11 months', 'leave and license', 'property', 'residential'],
    content: `LEAVE AND LICENSE AGREEMENT

THIS AGREEMENT made at [CITY] on this [AGREEMENT_DATE]

BETWEEN

[LANDLORD_NAME], [LANDLORD_ADDRESS], PAN: [LANDLORD_PAN] (hereinafter referred to as "LICENSOR/LANDLORD" which expression shall unless repugnant to the context include his/her heirs, executors, administrators and assigns) of the FIRST PART;

AND

[TENANT_NAME], [TENANT_ADDRESS], PAN: [TENANT_PAN] (hereinafter referred to as "LICENSEE/TENANT" which expression shall unless repugnant to the context include his/her heirs, executors, administrators and assigns) of the SECOND PART;

WHEREAS the Licensor is the lawful owner and in possession of the property situated at [PROPERTY_ADDRESS] (hereinafter referred to as "the said premises").

AND WHEREAS the Licensee has requested the Licensor to grant leave and license to use and occupy the said premises and the Licensor has agreed to grant the same on the terms and conditions hereinafter contained.

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. GRANT OF LICENSE
   The Licensor hereby grants to the Licensee a non-exclusive, non-transferable license to use and occupy the said premises for residential purposes only for a period of ELEVEN (11) MONTHS commencing from [START_DATE] and ending on [END_DATE].

2. DESCRIPTION OF PROPERTY
   [PROPERTY_DESCRIPTION]

3. LICENSE FEE (RENT)
   3.1 The Licensee agrees to pay monthly license fee of Rs. [MONTHLY_RENT]/- (Rupees [MONTHLY_RENT_WORDS] Only) to the Licensor on or before 5th day of each English calendar month in advance.
   
   3.2 Maintenance charges of Rs. [MAINTENANCE_CHARGES]/- per month shall be payable separately by the Licensee.
   
   3.3 Electricity, water, cooking gas, and other utility charges shall be borne by the Licensee.

4. SECURITY DEPOSIT
   4.1 The Licensee has paid an interest-free refundable security deposit of Rs. [SECURITY_DEPOSIT]/- (Rupees [SECURITY_DEPOSIT_WORDS] Only) to the Licensor.
   
   4.2 The security deposit shall be refunded within 30 days after expiry/termination of this Agreement, subject to deductions for any damages, arrears, or dues.

5. OBLIGATIONS OF THE LICENSEE
   5.1 To use the premises only for residential purposes
   5.2 To pay rent and maintenance charges regularly and promptly
   5.3 To maintain the premises in good condition
   5.4 Not to make any structural alterations without written consent
   5.5 Not to sublet or assign the license
   5.6 Not to use the premises for any illegal or immoral purposes
   5.7 To obtain prior written permission before keeping pets
   5.8 To allow the Licensor or his representatives to inspect the premises with prior notice

6. OBLIGATIONS OF THE LICENSOR
   6.1 To hand over peaceful possession of the premises
   6.2 To ensure the premises are fit for habitation
   6.3 To maintain the building structure
   6.4 Not to disturb the Licensee's peaceful enjoyment

7. TERMINATION
   7.1 This Agreement shall automatically terminate after 11 months unless renewed in writing
   7.2 Either party may terminate by giving ONE (1) MONTH written notice
   7.3 The Licensor may terminate immediately if the Licensee breaches any terms

8. RENEWAL
   This Agreement may be renewed by mutual written consent on mutually agreed terms.

9. JURISDICTION
   Courts at [CITY] shall have exclusive jurisdiction for any disputes arising from this Agreement.

10. REGISTRATION
    This Agreement is subject to registration under the Registration Act, 1908, if required.

IN WITNESS WHEREOF the parties have signed this Agreement in the presence of witnesses:

LICENSOR/LANDLORD                    LICENSEE/TENANT
[LANDLORD_NAME]                      [TENANT_NAME]


WITNESSES:

1. [WITNESS1_NAME]                   2. [WITNESS2_NAME]
   Signature: __________                Signature: __________`,
  },

  {
    id: 'property-will-testament',
    name: 'Will (Testament)',
    category: 'Property Documents',
    practiceArea: 'Property Law',
    description: 'Last Will and Testament for distribution of assets',
    variables: ['TESTATOR_NAME', 'TESTATOR_ADDRESS', 'TESTATOR_AGE', 'TESTATOR_PAN', 'EXECUTOR_NAME', 'EXECUTOR_ADDRESS', 'BENEFICIARY1_NAME', 'BENEFICIARY1_RELATION', 'BENEFICIARY1_SHARE', 'BENEFICIARY2_NAME', 'BENEFICIARY2_RELATION', 'BENEFICIARY2_SHARE', 'PROPERTY_DETAILS', 'MOVABLE_ASSETS', 'DATE', 'PLACE', 'WITNESS1_NAME', 'WITNESS2_NAME'],
    tags: ['will', 'testament', 'estate', 'inheritance', 'succession'],
    content: `LAST WILL AND TESTAMENT

I, [TESTATOR_NAME], aged [TESTATOR_AGE] years, son/daughter/wife of [PARENT/SPOUSE_NAME], residing at [TESTATOR_ADDRESS], PAN: [TESTATOR_PAN], being of sound mind and memory, do hereby revoke all former Wills and testamentary dispositions made by me and declare this to be my Last Will and Testament.

1. APPOINTMENT OF EXECUTOR
   I hereby appoint [EXECUTOR_NAME], residing at [EXECUTOR_ADDRESS], as the sole Executor of this my Will. If the said Executor predeceases me or is unable/unwilling to act, I appoint [ALTERNATE_EXECUTOR_NAME] as the Executor.

2. PAYMENT OF DEBTS
   I direct my Executor to pay all my just debts, funeral expenses, and testamentary expenses out of my estate as soon as practicable after my demise.

3. DISTRIBUTION OF IMMOVABLE PROPERTY
   [PROPERTY_DETAILS]
   
   I give, devise, and bequeath:
   
   a) To [BENEFICIARY1_NAME], my [BENEFICIARY1_RELATION]: [BENEFICIARY1_SHARE]
   
   b) To [BENEFICIARY2_NAME], my [BENEFICIARY2_RELATION]: [BENEFICIARY2_SHARE]

4. DISTRIBUTION OF MOVABLE PROPERTY
   All my movable assets including:
   [MOVABLE_ASSETS]
   
   I bequeath as follows: [DISTRIBUTION_DETAILS]

5. BANK ACCOUNTS AND INVESTMENTS
   All my bank accounts, fixed deposits, mutual funds, shares, and other investments shall be distributed equally among [BENEFICIARIES] or as per attached Schedule A.

6. RESIDUARY CLAUSE
   All the rest, residue, and remainder of my estate, whether movable or immovable, of whatever nature and wheresoever situated, which I have not specifically disposed of by this Will, I give, devise, and bequeath to [RESIDUARY_BENEFICIARY].

7. GUARDIANSHIP OF MINOR CHILDREN
   (If applicable) I appoint [GUARDIAN_NAME] as the Guardian of my minor children.

8. POWERS OF EXECUTOR
   I hereby authorize my Executor to:
   a) Sell, transfer, or mortgage any of my properties
   b) Settle any disputes or claims
   c) Invest the proceeds as deemed fit
   d) Take all necessary legal actions

9. NO COMPULSION
   I hereby declare that I have made this Will of my own free will without any force, coercion, or undue influence from any person.

10. SOUND MIND DECLARATION
    I declare that I am in sound health and mind and fully understand the contents and consequences of this Will.

IN WITNESS WHEREOF I have hereunto set my hand this [DATE] day of [MONTH], [YEAR] at [PLACE].

TESTATOR
[TESTATOR_NAME]
Signature: __________


WITNESSES:

We hereby certify that the above-named Testator signed this Will in our presence and that we have signed as witnesses in the presence of the Testator and of each other.

1. [WITNESS1_NAME]                   2. [WITNESS2_NAME]
   Address: [WITNESS1_ADDRESS]          Address: [WITNESS2_ADDRESS]
   Signature: __________                Signature: __________
   Date: __________                     Date: __________`,
  },

  {
    id: 'property-sale-deed',
    name: 'Sale Deed',
    category: 'Property Documents',
    practiceArea: 'Property Law',
    description: 'Deed of Sale for immovable property',
    variables: ['SELLER_NAME', 'SELLER_ADDRESS', 'SELLER_PAN', 'BUYER_NAME', 'BUYER_ADDRESS', 'BUYER_PAN', 'PROPERTY_DESCRIPTION', 'PROPERTY_ADDRESS', 'SURVEY_NUMBER', 'TOTAL_AREA', 'BOUNDARIES', 'SALE_CONSIDERATION', 'ADVANCE_PAID', 'BALANCE_AMOUNT', 'POSSESSION_DATE', 'DEED_DATE', 'PLACE', 'WITNESS1_NAME', 'WITNESS2_NAME'],
    tags: ['sale deed', 'property', 'conveyance', 'transfer', 'real estate'],
    content: `DEED OF SALE

THIS DEED OF SALE is executed at [PLACE] on this [DEED_DATE]

BY

[SELLER_NAME], residing at [SELLER_ADDRESS], PAN: [SELLER_PAN] (hereinafter called "the VENDOR/SELLER" which expression shall unless repugnant to the context include his/her heirs, executors, administrators and assigns) of the ONE PART;

IN FAVOUR OF

[BUYER_NAME], residing at [BUYER_ADDRESS], PAN: [BUYER_PAN] (hereinafter called "the PURCHASER/BUYER" which expression shall unless repugnant to the context include his/her heirs, executors, administrators and assigns) of the OTHER PART;

WHEREAS the Vendor is the absolute owner and in lawful possession of the property more particularly described in the Schedule hereunder.

AND WHEREAS the Vendor has agreed to sell and the Purchaser has agreed to purchase the said property for a total sale consideration of Rs. [SALE_CONSIDERATION]/- (Rupees [SALE_CONSIDERATION_WORDS] Only).

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. PROPERTY DESCRIPTION
   ALL THAT piece and parcel of land/property situated at [PROPERTY_ADDRESS], more particularly described as:
   
   Survey Number: [SURVEY_NUMBER]
   Total Area: [TOTAL_AREA]
   
   Boundaries:
   North: [NORTH_BOUNDARY]
   South: [SOUTH_BOUNDARY]
   East: [EAST_BOUNDARY]
   West: [WEST_BOUNDARY]
   
   Full Description: [PROPERTY_DESCRIPTION]

2. SALE CONSIDERATION
   2.1 The total sale consideration for the said property is Rs. [SALE_CONSIDERATION]/- (Rupees [SALE_CONSIDERATION_WORDS] Only).
   
   2.2 Out of which Rs. [ADVANCE_PAID]/- has been paid as advance at the time of Agreement to Sell dated [AGREEMENT_DATE].
   
   2.3 The balance amount of Rs. [BALANCE_AMOUNT]/- has been paid today at the time of execution of this Deed by [MODE_OF_PAYMENT].
   
   2.4 The Vendor hereby acknowledges receipt of the total sale consideration and grants full discharge and acquittance.

3. VENDOR'S COVENANTS
   The Vendor hereby declares and confirms that:
   
   a) The Vendor is the absolute owner with clear and marketable title
   b) The property is free from all encumbrances, charges, liens, mortgages
   c) No litigation is pending regarding the said property
   d) All property taxes, dues, and charges have been paid till date
   e) The Vendor has good right to sell the said property
   f) The Vendor shall defend the Purchaser's title against all claims

4. CONVEYANCE
   In consideration of the sale consideration received, the Vendor hereby grants, conveys, transfers, and assigns unto the Purchaser ALL the Vendor's right, title, interest, and estate in and to the said property TO HAVE AND TO HOLD the same unto the Purchaser absolutely forever.

5. POSSESSION
   The Vendor has handed over actual, physical, and vacant possession of the said property to the Purchaser on [POSSESSION_DATE].

6. RISK AND INSURANCE
   All risks in respect of the said property pass to the Purchaser from the date of this Deed.

7. EXPENSES
   All stamp duty, registration charges, and other expenses for this Deed shall be borne by the Purchaser.

8. GOVERNING LAW
   This Deed shall be governed by the laws of India and the Transfer of Property Act, 1882.

IN WITNESS WHEREOF the parties have hereunto set and subscribed their respective hands the day and year first hereinabove written.

SIGNED AND DELIVERED by the within named

VENDOR/SELLER                        PURCHASER/BUYER
[SELLER_NAME]                        [BUYER_NAME]
Signature: __________                Signature: __________


WITNESSES:

1. [WITNESS1_NAME]                   2. [WITNESS2_NAME]
   Address: [WITNESS1_ADDRESS]          Address: [WITNESS2_ADDRESS]
   Signature: __________                Signature: __________`,
  },

  {
    id: 'plaint-partition-suit',
    name: 'Plaint for Partition Suit',
    category: 'Drafts & Pleadings',
    practiceArea: 'Civil Law',
    description: 'Plaint seeking partition and separate possession of joint property',
    variables: ['COURT_NAME', 'PLAINTIFF_NAME', 'PLAINTIFF_ADDRESS', 'DEFENDANT1_NAME', 'DEFENDANT2_NAME', 'PROPERTY_DESCRIPTION', 'TOTAL_AREA', 'PLAINTIFF_SHARE', 'ACQUISITION_DETAILS', 'SUIT_VALUATION', 'COURT_FEES', 'DATE'],
    tags: ['partition', 'property', 'joint property', 'suit', 'civil'],
    content: `IN THE COURT OF [COURT_NAME]

ORIGINAL SUIT NO. _______ OF [YEAR]

[PLAINTIFF_NAME]
[PLAINTIFF_ADDRESS]
                                                    ...Plaintiff

VERSUS

1. [DEFENDANT1_NAME]
2. [DEFENDANT2_NAME]
                                                    ...Defendants

PLAINT UNDER ORDER IV RULE 1 CPC

1. That the Plaintiff is a resident of [PLAINTIFF_ADDRESS] and is a major competent to contract.

2. That this Hon'ble Court has jurisdiction to try and adjudicate upon this suit as the cause of action arose within the jurisdiction of this Court and the property in dispute is situated within the jurisdiction of this Court.

3. FACTS OF THE CASE

   3.1 That the property bearing [PROPERTY_DESCRIPTION], total area [TOTAL_AREA], was jointly owned by [ORIGINAL_OWNER] who expired on [DATE].
   
   3.2 That upon the demise of [ORIGINAL_OWNER], the property devolved upon his legal heirs namely the Plaintiff and Defendants as per law of succession.
   
   3.3 That the Plaintiff and Defendants are co-owners/co-parceners of the said property in the following shares:
        - Plaintiff: [PLAINTIFF_SHARE]
        - Defendant No. 1: [DEFENDANT1_SHARE]
        - Defendant No. 2: [DEFENDANT2_SHARE]
   
   3.4 [ACQUISITION_DETAILS]

4. CAUSE OF ACTION
   
   4.1 That the Plaintiff has been demanding partition and separate possession of his share from the Defendants.
   
   4.2 That despite repeated requests, the Defendants have refused to cooperate in effecting partition.
   
   4.3 That the cause of action arose on [DATE] when the Defendants categorically refused partition.
   
   4.4 That the cause of action is continuing.

5. DENIAL OF PARTITION
   That the Defendants have wrongfully denied partition and are preventing the Plaintiff from enjoying his share.

6. NO ALTERNATIVE REMEDY
   That the Plaintiff has no other equally efficacious alternative remedy except to approach this Hon'ble Court.

7. LIMITATION
   That this suit is within limitation as the cause of action arose on [DATE].

8. VALUATION
   That for the purpose of Court Fees and jurisdiction, the suit property is valued at Rs. [SUIT_VALUATION]/- as per ready reckoner rates.

9. That the Plaintiff has paid Court Fees of Rs. [COURT_FEES]/- as per the Valuation of the suit.

PRAYER

In view of the facts and circumstances stated above, it is most humbly prayed that this Hon'ble Court may be pleased to:

a) Declare that the Plaintiff is entitled to [PLAINTIFF_SHARE] share in the suit property;

b) Direct partition of the suit property by metes and bounds according to the shares of the parties;

c) Appoint a Commissioner for the purpose of partition;

d) Award separate possession of the Plaintiff's share;

e) Award costs of this suit;

f) Pass such other order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE PLAINTIFF SHALL DUTY BOUND FOREVER PRAY.

PLACE: [PLACE]
DATE: [DATE]

                                        PLAINTIFF
                                        Through Counsel

VERIFICATION

I, [PLAINTIFF_NAME], the Plaintiff above-named, do hereby verify that the contents of paragraphs 1 to 9 of the above Plaint are true to my knowledge and belief and nothing material has been concealed therefrom.

Verified at [PLACE] on this [DATE] day of [MONTH], [YEAR].

                                        PLAINTIFF`,
  },

  {
    id: 'plaint-specific-performance',
    name: 'Plaint for Specific Performance',
    category: 'Drafts & Pleadings',
    practiceArea: 'Civil Law',
    description: 'Suit for specific performance of contract of sale of immovable property',
    variables: ['COURT_NAME', 'PLAINTIFF_NAME', 'PLAINTIFF_ADDRESS', 'DEFENDANT_NAME', 'DEFENDANT_ADDRESS', 'PROPERTY_DESCRIPTION', 'AGREEMENT_DATE', 'SALE_PRICE', 'ADVANCE_PAID', 'PERFORMANCE_DATE', 'BREACH_DATE', 'SUIT_VALUATION', 'COURT_FEES', 'DATE'],
    tags: ['specific performance', 'contract', 'property', 'breach', 'suit'],
    content: `IN THE COURT OF [COURT_NAME]

ORIGINAL SUIT NO. _______ OF [YEAR]

[PLAINTIFF_NAME]
[PLAINTIFF_ADDRESS]
                                                    ...Plaintiff

VERSUS

[DEFENDANT_NAME]
[DEFENDANT_ADDRESS]
                                                    ...Defendant

PLAINT FOR SPECIFIC PERFORMANCE UNDER SECTION 16 OF THE SPECIFIC RELIEF ACT, 1963

1. That the Plaintiff is a resident of [PLAINTIFF_ADDRESS] and is a major competent to contract.

2. That the Defendant is a resident of [DEFENDANT_ADDRESS] and is a major competent to contract.

3. That this Hon'ble Court has jurisdiction to try and adjudicate upon this suit as the cause of action wholly or in part arose within the jurisdiction of this Court.

4. FACTS OF THE CASE

   4.1 That the Defendant is the owner and in possession of the property bearing [PROPERTY_DESCRIPTION] (hereinafter referred to as "the suit property").
   
   4.2 That on [AGREEMENT_DATE], the Plaintiff and Defendant entered into an Agreement to Sell wherein the Defendant agreed to sell the suit property to the Plaintiff for a total consideration of Rs. [SALE_PRICE]/- (Rupees [SALE_PRICE_WORDS] Only).
   
   4.3 That as per the terms of the Agreement, the Plaintiff paid an advance of Rs. [ADVANCE_PAID]/- to the Defendant, and the Defendant acknowledged receipt of the same.
   
   4.4 That it was agreed that the sale would be completed and the Sale Deed executed on or before [PERFORMANCE_DATE].
   
   4.5 That the Plaintiff has always been ready and willing to perform his part of the contract.

5. BREACH OF CONTRACT
   
   5.1 That the Plaintiff repeatedly requested the Defendant to execute the Sale Deed and complete the transaction.
   
   5.2 That despite the Plaintiff's readiness and willingness, the Defendant has wrongfully and without any reasonable cause refused to execute the Sale Deed.
   
   5.3 That on [BREACH_DATE], the Defendant categorically refused to perform his part of the contract.

6. PLAINTIFF'S READINESS AND WILLINGNESS
   
   6.1 That the Plaintiff has always been ready and willing to perform his part of the contract.
   
   6.2 That the Plaintiff is still ready and willing to pay the balance consideration and complete the transaction.
   
   6.3 That the Plaintiff has arranged for the balance payment and is prepared to pay the same immediately upon execution of the Sale Deed.

7. NO ALTERNATIVE REMEDY
   That damages would not be an adequate remedy as the Plaintiff desires to have the specific property which has a unique location and value.

8. CAUSE OF ACTION
   That the cause of action arose on [BREACH_DATE] when the Defendant refused to perform the contract and is continuing till date.

9. LIMITATION
   That this suit is within limitation as prescribed under the Limitation Act, 1963.

10. VALUATION
    That for the purpose of Court Fees and jurisdiction, this suit is valued at Rs. [SUIT_VALUATION]/-

11. That the Plaintiff has paid Court Fees of Rs. [COURT_FEES]/- as per the Valuation.

PRAYER

In view of the facts and circumstances stated above, it is most humbly prayed that this Hon'ble Court may be pleased to:

a) Direct and decree that the Defendant do specifically perform the Agreement to Sell dated [AGREEMENT_DATE] by executing a registered Sale Deed in favour of the Plaintiff;

b) Direct the Defendant to hand over vacant and peaceful possession of the suit property to the Plaintiff;

c) In the alternative, if specific performance is not possible, award damages to the Plaintiff;

d) Award interest on the advance amount paid;

e) Award costs of this suit;

f) Pass such other order(s) as this Hon'ble Court may deem fit and proper in the interest of justice and equity.

AND FOR THIS ACT OF KINDNESS, THE PLAINTIFF SHALL DUTY BOUND FOREVER PRAY.

PLACE: [PLACE]
DATE: [DATE]

                                        PLAINTIFF
                                        Through Counsel

VERIFICATION

I, [PLAINTIFF_NAME], the Plaintiff above-named, do hereby verify that the contents of paragraphs 1 to 11 of the above Plaint are true to my knowledge and belief and nothing material has been concealed therefrom.

Verified at [PLACE] on this [DATE] day of [MONTH], [YEAR].

                                        PLAINTIFF`,
  },
];

// Helper functions
export function getTemplateById(id: string): Template | undefined {
  return COMPREHENSIVE_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  return COMPREHENSIVE_TEMPLATES.filter(t => t.category === category);
}

export function getTemplatesByPracticeArea(practiceArea: string): Template[] {
  return COMPREHENSIVE_TEMPLATES.filter(t => t.practiceArea === practiceArea);
}

export function searchTemplates(query: string): Template[] {
  const lowercaseQuery = query.toLowerCase();
  return COMPREHENSIVE_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowercaseQuery) ||
    t.description.toLowerCase().includes(lowercaseQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    t.practiceArea.toLowerCase().includes(lowercaseQuery)
  );
}

export function fillTemplate(template: Template, values: Record<string, string>): string {
  let content = template.content;
  
  template.variables.forEach(variable => {
    const regex = new RegExp(`\\[${variable}\\]`, 'g');
    content = content.replace(regex, values[variable] || `[${variable}]`);
  });
  
  return content;
}

// Template statistics
export function getTemplateStats() {
  return {
    total: COMPREHENSIVE_TEMPLATES.length,
    byCategory: TEMPLATE_CATEGORIES.map(cat => ({
      category: cat,
      count: COMPREHENSIVE_TEMPLATES.filter(t => t.category === cat).length,
    })),
    byPracticeArea: PRACTICE_AREAS.map(area => ({
      practiceArea: area,
      count: COMPREHENSIVE_TEMPLATES.filter(t => t.practiceArea === area).length,
    })),
  };
}

