/**
 * Legal Document Templates for LegalOS
 * Organized by category with Indian law-specific templates
 */

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  variables: string[]; // Variables to be filled (e.g., [CLIENT_NAME], [DATE])
  tags: string[];
}

export const TEMPLATE_CATEGORIES = [
  'Notices',
  'Contracts',
  'Petitions',
  'Affidavits',
  'Agreements',
  'Letters',
  'Applications',
  'Replies',
];

export const LEGAL_TEMPLATES: Template[] = [
  // ==================== NOTICES ====================
  {
    id: 'notice-cheque-bounce',
    name: 'Legal Notice for Cheque Bounce (Section 138 NI Act)',
    category: 'Notices',
    description: 'Legal notice for dishonored cheque under Section 138 of Negotiable Instruments Act',
    variables: ['SENDER_NAME', 'SENDER_ADDRESS', 'RECEIVER_NAME', 'RECEIVER_ADDRESS', 'CHEQUE_AMOUNT', 'CHEQUE_NUMBER', 'CHEQUE_DATE', 'BANK_NAME', 'DISHONOR_DATE', 'DISHONOR_REASON', 'NOTICE_DATE'],
    tags: ['cheque bounce', 'section 138', 'negotiable instruments', 'criminal'],
    content: `LEGAL NOTICE

TO,
[RECEIVER_NAME]
[RECEIVER_ADDRESS]

DATE: [NOTICE_DATE]

SUBJECT: LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

Dear Sir/Madam,

UNDER INSTRUCTIONS FROM AND ON BEHALF OF my client, [SENDER_NAME], residing at [SENDER_ADDRESS] (hereinafter referred to as "the Payee"), I hereby serve upon you this Legal Notice as under:

1. That my client had given you a cheque bearing No. [CHEQUE_NUMBER] dated [CHEQUE_DATE] for Rs. [CHEQUE_AMOUNT]/- (Rupees [CHEQUE_AMOUNT_WORDS] Only) drawn on [BANK_NAME] towards discharge of your legally enforceable debt/liability.

2. That the said cheque was presented for encashment/collection to the bank but the same was dishonored and returned by the bank with the remark "[DISHONOR_REASON]" vide Cheque Return Memo dated [DISHONOR_DATE].

3. That you have thereby committed an offence punishable under Section 138 of the Negotiable Instruments Act, 1881.

4. That my client hereby demands from you to pay the said amount of Rs. [CHEQUE_AMOUNT]/- (Rupees [CHEQUE_AMOUNT_WORDS] Only) along with interest and costs within a period of 15 days from the date of receipt of this notice, failing which my client shall be constrained to initiate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881 before the appropriate Court of Law.

5. That you are hereby called upon to pay the aforesaid amount within 15 days from the date of receipt of this notice, failing which appropriate legal action shall be initiated against you without any further reference to you, at your risk as to costs and consequences.

This notice is without prejudice to my client's other rights and remedies available in law.

Yours faithfully,

[SENDER_NAME]
Through: Advocate
[ADDRESS]`
  },

  {
    id: 'notice-payment-recovery',
    name: 'Legal Notice for Recovery of Money',
    category: 'Notices',
    description: 'General legal notice for recovery of outstanding payment',
    variables: ['SENDER_NAME', 'SENDER_ADDRESS', 'RECEIVER_NAME', 'RECEIVER_ADDRESS', 'AMOUNT_DUE', 'DUE_DATE', 'REASON', 'NOTICE_DATE'],
    tags: ['recovery', 'payment', 'debt'],
    content: `LEGAL NOTICE

TO,
[RECEIVER_NAME]
[RECEIVER_ADDRESS]

DATE: [NOTICE_DATE]

SUBJECT: LEGAL NOTICE FOR RECOVERY OF RS. [AMOUNT_DUE]/-

Dear Sir/Madam,

UNDER INSTRUCTIONS FROM AND ON BEHALF OF my client, [SENDER_NAME], residing at [SENDER_ADDRESS], I hereby serve upon you this Legal Notice as under:

1. That an amount of Rs. [AMOUNT_DUE]/- is due and payable by you to my client on account of [REASON].

2. That despite repeated requests and reminders, you have failed and/or neglected to make the said payment which was due on [DUE_DATE].

3. That my client has suffered mental agony, harassment, and financial loss due to your willful default in making the payment.

4. That my client hereby calls upon you to pay the said amount of Rs. [AMOUNT_DUE]/- along with interest @ 18% per annum from [DUE_DATE] till the date of actual payment, within 15 days from the date of receipt of this notice.

5. That in case of your failure to comply with the above demand, my client shall be constrained to initiate appropriate legal proceedings against you for recovery of the said amount along with interest, costs and damages, without any further reference to you.

This notice is without prejudice to my client's other rights and remedies available in law.

Yours faithfully,

[SENDER_NAME]
Through: Advocate
[ADDRESS]`
  },

  // ==================== CONTRACTS ====================
  {
    id: 'contract-service-agreement',
    name: 'Service Agreement',
    category: 'Contracts',
    description: 'General service agreement between service provider and client',
    variables: ['PROVIDER_NAME', 'PROVIDER_ADDRESS', 'CLIENT_NAME', 'CLIENT_ADDRESS', 'SERVICE_DESCRIPTION', 'FEE', 'START_DATE', 'DURATION', 'PAYMENT_TERMS'],
    tags: ['service', 'agreement', 'contract'],
    content: `SERVICE AGREEMENT

THIS AGREEMENT is made on this [START_DATE] day of [MONTH], [YEAR]

BETWEEN

[PROVIDER_NAME], having its registered office at [PROVIDER_ADDRESS] (hereinafter referred to as "Service Provider" which expression shall unless repugnant to the context or meaning thereof include its successors and assigns) of the FIRST PART;

AND

[CLIENT_NAME], having its registered office at [CLIENT_ADDRESS] (hereinafter referred to as "Client" which expression shall unless repugnant to the context or meaning thereof include its successors and assigns) of the SECOND PART;

WHEREAS the Service Provider is engaged in providing [SERVICE_DESCRIPTION] services and the Client desires to avail such services from the Service Provider.

NOW THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties hereto agree as follows:

1. SCOPE OF SERVICES
   The Service Provider agrees to provide the following services: [SERVICE_DESCRIPTION]

2. TERM
   This Agreement shall commence on [START_DATE] and shall continue for a period of [DURATION] unless terminated earlier as per the terms hereof.

3. FEES AND PAYMENT
   3.1 The Client agrees to pay the Service Provider a fee of Rs. [FEE]/- as per the payment terms: [PAYMENT_TERMS]
   3.2 All payments shall be made within 30 days of invoice date.

4. TERMINATION
   Either party may terminate this Agreement by giving 30 days' written notice to the other party.

5. CONFIDENTIALITY
   Both parties agree to maintain confidentiality of all proprietary information shared during the term of this Agreement.

6. GOVERNING LAW
   This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement on the day and year first above written.

For [PROVIDER_NAME]                    For [CLIENT_NAME]
_____________________                 _____________________
Authorized Signatory                  Authorized Signatory`
  },

  // ==================== PETITIONS ====================
  {
    id: 'petition-bail-application',
    name: 'Bail Application',
    category: 'Petitions',
    description: 'Application for bail in criminal cases',
    variables: ['COURT_NAME', 'CASE_NUMBER', 'PETITIONER_NAME', 'ACCUSED_NAME', 'OFFENCE_SECTION', 'ARREST_DATE', 'GROUNDS'],
    tags: ['bail', 'criminal', 'petition'],
    content: `IN THE COURT OF [COURT_NAME]

CRIMINAL MISC. CASE NO. [CASE_NUMBER]

IN THE MATTER OF:

[PETITIONER_NAME]                                    ...Petitioner
                        Versus
STATE                                                ...Respondent

APPLICATION FOR BAIL UNDER SECTION 439 Cr.P.C.

MOST RESPECTFULLY SHOWETH:

1. That the Petitioner/Accused [ACCUSED_NAME] was arrested on [ARREST_DATE] in connection with FIR registered under Section [OFFENCE_SECTION] of IPC.

2. That the Petitioner is innocent and has been falsely implicated in the present case.

3. That the Petitioner is ready and willing to abide by all conditions that this Hon'ble Court may deem fit to impose.

4. GROUNDS FOR BAIL:
   [GROUNDS]

5. That the Petitioner has deep roots in society and there is no likelihood of the Petitioner absconding.

6. That the Petitioner has no criminal antecedents and is a law-abiding citizen.

7. That the Petitioner is ready to furnish personal bond and surety as may be directed by this Hon'ble Court.

PRAYER

In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

a) Grant regular bail to the Petitioner in the above case;
b) Pass such other order(s) as this Hon'ble Court may deem fit in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL DUTY BOUND FOREVER PRAY.

PETITIONER
THROUGH COUNSEL

PLACE:
DATE:`
  },

  // Add more templates... (continuing with a few more essential ones)

  {
    id: 'affidavit-general',
    name: 'General Affidavit',
    category: 'Affidavits',
    description: 'General format affidavit for various purposes',
    variables: ['DEPONENT_NAME', 'DEPONENT_AGE', 'DEPONENT_ADDRESS', 'DEPONENT_OCCUPATION', 'PURPOSE', 'FACTS', 'DATE', 'PLACE'],
    tags: ['affidavit', 'sworn statement'],
    content: `AFFIDAVIT

I, [DEPONENT_NAME], aged [DEPONENT_AGE] years, son/daughter of [PARENT_NAME], residing at [DEPONENT_ADDRESS], occupation [DEPONENT_OCCUPATION], do hereby solemnly affirm and declare as under:

1. That I am the Deponent herein and I am competent to swear this Affidavit.

2. That I am well conversant with the facts and circumstances of the case and am making this Affidavit for the purpose of [PURPOSE].

3. FACTS:
   [FACTS]

4. That the contents of this Affidavit are true to the best of my knowledge and belief and nothing material has been concealed therefrom.

DEPONENT

VERIFICATION

I, [DEPONENT_NAME], the Deponent above-named, do hereby verify that the contents of paragraphs 1 to 4 of the above Affidavit are true to my knowledge and belief and that nothing material has been concealed therefrom.

Verified at [PLACE] on this [DATE] day of [MONTH], [YEAR].

DEPONENT`
  },

  {
    id: 'nda-mutual',
    name: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'Agreements',
    description: 'Mutual NDA for protecting confidential information between two parties',
    variables: ['PARTY1_NAME', 'PARTY1_ADDRESS', 'PARTY2_NAME', 'PARTY2_ADDRESS', 'PURPOSE', 'DURATION', 'DATE'],
    tags: ['nda', 'confidentiality', 'mutual'],
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

THIS AGREEMENT is made on this [DATE]

BETWEEN

[PARTY1_NAME], having its registered office at [PARTY1_ADDRESS] (hereinafter referred to as "First Party") of the FIRST PART;

AND

[PARTY2_NAME], having its registered office at [PARTY2_ADDRESS] (hereinafter referred to as "Second Party") of the SECOND PART;

(First Party and Second Party are hereinafter collectively referred to as "Parties" and individually as "Party")

WHEREAS the Parties wish to explore [PURPOSE] and in connection therewith, may disclose certain confidential and proprietary information to each other.

NOW THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:

1. CONFIDENTIAL INFORMATION
   "Confidential Information" means all information disclosed by one Party to the other Party, whether orally, in writing, or in any other form.

2. OBLIGATIONS
   2.1 Each Party agrees to hold the Confidential Information in strict confidence.
   2.2 Neither Party shall disclose any Confidential Information to any third party without prior written consent.
   2.3 Each Party shall use the Confidential Information solely for the purpose of [PURPOSE].

3. TERM
   This Agreement shall remain in effect for a period of [DURATION] from the date of execution.

4. RETURN OF INFORMATION
   Upon termination, each Party shall return or destroy all Confidential Information.

5. GOVERNING LAW
   This Agreement shall be governed by the laws of India.

IN WITNESS WHEREOF, the Parties have executed this Agreement.

For [PARTY1_NAME]                    For [PARTY2_NAME]
_____________________                 _____________________`
  },

  // Adding a few more essential templates...
  {
    id: 'letter-appointment',
    name: 'Letter of Appointment',
    category: 'Letters',
    description: 'Appointment letter for employees',
    variables: ['COMPANY_NAME', 'EMPLOYEE_NAME', 'POSITION', 'START_DATE', 'SALARY', 'LOCATION'],
    tags: ['employment', 'appointment', 'HR'],
    content: `[COMPANY_NAME]
[ADDRESS]

Date: [DATE]

[EMPLOYEE_NAME]
[ADDRESS]

Dear [EMPLOYEE_NAME],

SUBJECT: LETTER OF APPOINTMENT

We are pleased to offer you the position of [POSITION] with [COMPANY_NAME].

Your employment will commence on [START_DATE] at our [LOCATION] office.

TERMS OF EMPLOYMENT:

1. Position: [POSITION]
2. Monthly Salary: Rs. [SALARY]/-
3. Location: [LOCATION]
4. Probation Period: 3 months

Please confirm your acceptance by signing and returning a copy of this letter.

We look forward to welcoming you to our team.

Yours sincerely,

For [COMPANY_NAME]
_____________________
Authorized Signatory

ACCEPTANCE:
I accept the above terms and conditions.

_____________________
[EMPLOYEE_NAME]
Date:`
  },

  // Add application templates
  {
    id: 'application-leave',
    name: 'Leave Application',
    category: 'Applications',
    description: 'Application for leave of absence',
    variables: ['APPLICANT_NAME', 'POSITION', 'RECIPIENT_NAME', 'LEAVE_TYPE', 'START_DATE', 'END_DATE', 'REASON', 'DATE'],
    tags: ['leave', 'application', 'HR'],
    content: `To,
[RECIPIENT_NAME]
[DESIGNATION]
[COMPANY_NAME]

Date: [DATE]

Subject: Application for [LEAVE_TYPE] Leave

Respected Sir/Madam,

I am writing to request [LEAVE_TYPE] leave from [START_DATE] to [END_DATE] ([DAYS] days).

Reason: [REASON]

I have ensured that all my pending work is completed/delegated. I will be available on phone/email in case of any emergency.

I request you to kindly approve my leave application.

Thanking you,

Yours faithfully,

[APPLICANT_NAME]
[POSITION]`
  },
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): Template[] {
  return LEGAL_TEMPLATES.filter(t => t.category === category);
}

// Helper function to search templates
export function searchTemplates(query: string): Template[] {
  const lowercaseQuery = query.toLowerCase();
  return LEGAL_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowercaseQuery) ||
    t.description.toLowerCase().includes(lowercaseQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Helper function to replace variables in template
export function fillTemplate(template: Template, values: Record<string, string>): string {
  let content = template.content;
  
  template.variables.forEach(variable => {
    const regex = new RegExp(`\\[${variable}\\]`, 'g');
    content = content.replace(regex, values[variable] || `[${variable}]`);
  });
  
  return content;
}

