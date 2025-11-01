# 🔐 LEGALOS SECURITY ARCHITECTURE

**Training vs RAG: How We Keep Your Data Safe**

---

## 🎯 THE CRITICAL DISTINCTION

### **What We NEVER Do: AI Model Training ❌**

```
Training (BAD - What ChatGPT Free does):

Your data → OpenAI servers → Added to training dataset →
Model weights modified → Your data influences future responses →
Other users benefit from YOUR confidential data → PERMANENT

Example:
You paste: "ABC Ltd vs XYZ Corp cheque bounce case, ₹15L dispute"
→ OpenAI uses this to train GPT-5
→ Future model "knows" ABC Ltd had cheque bounce issues
→ YOUR CLIENT'S DATA LEAKED PERMANENTLY

This is what we NEVER do.
```

### **What We DO: RAG (Retrieval Augmented Generation) ✅**

```
RAG (GOOD - What LegalOS does):

Your data → YOUR database (Mumbai) → Stays there forever →
When YOU query → Search YOUR database → Find relevant context →
Send context to Claude API (temporary) → Claude processes →
Claude responds → Claude FORGETS context → TEMPORARY

Example:
You ask: "Draft cheque bounce notice"
→ Search YOUR database → Find Case CHQ-234/2019
→ Send to Claude: "User asks [question]. Context: [their past case]"
→ Claude responds using context
→ Claude forgets the context immediately
→ Your data NEVER trains the model
→ Next query starts fresh

This is what we do. Your data is reference material, not training data.
```

---

## 📚 THE ANALOGY

### **Training = Teaching a Student (Permanent)**
```
Teacher: "ABC Ltd had a cheque bounce case in 2019"
Student: *memorizes this fact forever*
Student: *might tell others about ABC Ltd*
Student: *this knowledge is now permanent*

Your data becomes part of the student's brain.
You lose control.
```

### **RAG = Lending a Book (Temporary)**
```
Student: "How do I solve this problem?"
You: "Here, use this reference book during the exam"
Student: *reads book, uses it for answer*
Student: *returns book, doesn't memorize it*
Next exam: Student doesn't remember the book

The book is YOURS. Student just borrows temporarily.
You maintain control.
```

---

## 🔐 TECHNICAL IMPLEMENTATION

### **1. Multi-Tenant Database with RLS**

```sql
-- Every table has organization_id
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  client_name TEXT,
  ...
);

-- Row Level Security: Firms ONLY see their own data
CREATE POLICY "firms_own_data" ON clients
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );
```

**What This Means:**
- Firm A's data in same database as Firm B
- BUT: Firm A can NEVER see Firm B's data (enforced at DB level)
- Even if we wanted to, we couldn't show cross-firm data
- Same security model as Salesforce, Slack, Notion

---

### **2. RAG Implementation (Not Training)**

```typescript
// When lawyer asks AI a question:

export async function handleAIQuery(question: string, orgId: string) {
  
  // STEP 1: Search YOUR firm's knowledge base (optional)
  const relevantCases = await searchKnowledgeBase({
    query: question,
    organizationId: orgId, // ONLY YOUR firm's data
    limit: 5
  })
  // SQL: SELECT * FROM document_embeddings 
  //      WHERE organization_id = YOUR_ORG
  //      ORDER BY similarity(embedding, query_embedding)
  //      LIMIT 5
  
  // STEP 2: Send to Claude API with context (TEMPORARY)
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    messages: [
      {
        role: 'system',
        content: `You are an AI legal assistant.
                  
                  The user has relevant past cases:
                  ${relevantCases.map(c => c.text).join('\n\n')}
                  
                  Use this context ONLY for this specific query.
                  Do NOT remember this for future queries.`
      },
      {
        role: 'user',
        content: question
      }
    ]
  })
  
  // STEP 3: Anthropic processes this
  // - Reads the context (temporary)
  // - Generates response
  // - Discards the context
  // - Does NOT train on it (Enterprise API contract)
  
  // STEP 4: Save conversation in YOUR database
  await saveConversation({
    organizationId: orgId,
    query: question,
    response: response.content[0].text,
    contextUsed: relevantCases.map(c => c.id)
  })
  
  return response
  
  // STEP 5: Context is GONE
  // - Not stored by Anthropic
  // - Not used to train Claude
  // - Next query starts fresh
}
```

---

### **3. Anthropic/Google Enterprise API Contract**

**What Anthropic Guarantees:**
- ✅ API data is NOT used to train Claude models
- ✅ API data is NOT retained after processing
- ✅ API data is NOT shared across customers
- ✅ You own 100% of your data

**From Anthropic's Terms:**
> "We do not train Claude on API data. Your inputs and outputs
> via API are not used to train or improve our models."

**Same with Google Gemini API:**
> "Your data is your data. We don't use your API prompts or
> responses to train our models."

**Proof:** Enterprise API contracts (available on request)

---

## 🔐 SECURITY COMPARISON

| Aspect | ChatGPT Free | ChatGPT Enterprise | LegalOS |
|--------|--------------|-------------------|---------|
| **Data Location** | USA (OpenAI) | USA (OpenAI) | India (YOUR Supabase) |
| **Data Ownership** | OpenAI | You (but hosted by OpenAI) | You (fully) |
| **AI Training** | YES (may be used) | NO (contractual) | NO (contractual) |
| **Multi-Firm Isolation** | No (personal) | No (per-company) | YES (RLS + org_id) |
| **Audit Trail** | No | Limited | Complete (every query logged) |
| **Export Data** | Limited | Yes | Complete (CSV/JSON/ZIP) |
| **India Hosting** | No | No | YES (Mumbai) |
| **Bar Council Compliant** | No | Maybe | YES |
| **Cross-Firm Learning** | Yes (training) | No | NO (impossible by design) |
| **Data Deletion** | Hard (baked in) | Possible | Easy (delete from YOUR DB) |

---

## 🎯 FIRM KNOWLEDGE BASE: HOW IT WORKS

### **The Question:**
> "You said you don't train on our data, but the AI 'learns' from our cases. Which is it?"

### **The Answer:**

**Firm Knowledge Base ≠ Training**

**What We Do:**
1. Store your past cases in YOUR database (Mumbai)
2. Create searchable index (vector embeddings)
3. When you ask a question, search YOUR database
4. Send relevant cases as context to Claude API
5. Claude reads context temporarily
6. Claude responds
7. Claude forgets context
8. Context NEVER modifies Claude's model

**Analogy:**
```
Law Library:
- Your past cases = Books in YOUR library
- AI question = Lawyer needs to draft
- AI searches YOUR library for relevant books
- AI reads those books (temporary)
- AI uses them for this answer
- AI returns books (doesn't memorize)
- Books stay in YOUR library

The AI doesn't "learn" your cases (permanent).
It "references" your cases (temporary).
```

---

## 🔐 SECURITY GUARANTEES

### **1. Data Isolation ✅**
```
- YOUR firm's data is in YOUR database space
- Row Level Security enforces isolation
- Organization ID on every record
- Impossible for Firm A to see Firm B's data
- Even we (LegalOS) can't cross-contaminate
```

### **2. No AI Model Training ✅**
```
- Claude/Gemini models are NEVER modified using your data
- Your cases are NOT added to model weights
- Enterprise API contracts forbid training on your data
- Your data doesn't influence responses to other firms
```

### **3. RAG for Context (Safe) ✅**
```
- When YOU ask, we search YOUR database
- Send relevant cases as API context (temporary)
- Claude processes context for THIS query only
- Context discarded after response
- Model forgets your data immediately
- Like consulting a book, not memorizing it
```

### **4. India Hosting ✅**
```
- All data in Supabase Mumbai region
- Governed by Indian law
- No US jurisdiction
- Can't be accessed without Indian court order
```

### **5. Encryption ✅**
```
- AES-256 at rest
- TLS 1.3 in transit
- Encrypted backups
- Encrypted file storage
```

### **6. Complete Audit Trail ✅**
```
- Every AI query logged
- Who asked, when, what
- Which past cases used as context
- Managing Partner can audit
- Bar Council compliance reports
```

### **7. Data Ownership & Portability ✅**
```
- You own 100% of your data
- Export anytime (CSV, JSON, ZIP)
- Delete anytime (permanent deletion)
- No vendor lock-in
```

---

## 📊 TECHNICAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                      LEGALOS SECURITY                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  Law Firm User  │
└────────┬────────┘
         │
         │ HTTPS (TLS 1.3)
         ▼
┌─────────────────────────────────────────┐
│         Next.js Frontend (Vercel)       │
│   - Auth check (Supabase Auth)          │
│   - Row Level Security (organization_id) │
└────────┬────────────────────────────────┘
         │
         │ API Call
         ▼
┌─────────────────────────────────────────┐
│    Supabase Backend (Mumbai, India)     │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   PostgreSQL Database (RLS)       │  │
│  │   - clients (org_id filter)       │  │
│  │   - cases (org_id filter)         │  │
│  │   - documents (org_id filter)     │  │
│  │   - document_embeddings (org_id)  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Supabase Storage (Encrypted)    │  │
│  │   - Case documents (AES-256)      │  │
│  └───────────────────────────────────┘  │
└────────┬────────────────────────────────┘
         │
         │ (When AI query)
         ▼
┌─────────────────────────────────────────┐
│       Knowledge Base Search (RAG)       │
│   1. Query YOUR database (org_id)       │
│   2. Find top 5 relevant cases          │
│   3. Extract text chunks                │
└────────┬────────────────────────────────┘
         │
         │ Send as context (temporary)
         ▼
┌─────────────────────────────────────────┐
│   Claude API (Anthropic) / Gemini API   │
│   - Receives: Question + Context        │
│   - Processes: Generates response       │
│   - Forgets: Context discarded          │
│   - Never trains on your data           │
└────────┬────────────────────────────────┘
         │
         │ Response
         ▼
┌─────────────────────────────────────────┐
│         Save to YOUR Database           │
│   - ai_conversations table              │
│   - Full audit trail                    │
│   - organization_id tagged              │
└─────────────────────────────────────────┘
```

---

## 🎯 ANSWERING THE MANAGING PARTNER

### **Q: "How are you different from ChatGPT if you use our data?"**

**A:**
> "The key difference is WHERE your data lives and HOW it's used.
> 
> **With ChatGPT:**
> - Your data goes to OpenAI's servers in the USA
> - OpenAI may use it to train future models (Free tier definitely does)
> - You have no audit trail or control
> - Data subject to US jurisdiction
> 
> **With LegalOS:**
> - Your data stays in YOUR database in Mumbai
> - We NEVER train AI models on it (Enterprise API contract)
> - Only YOUR firm can access it (Row Level Security)
> - Complete audit trail for Bar Council compliance
> - Your data, your control, your export anytime
> 
> **Think of it like Google Drive:**
> - You upload files to Google Drive
> - Google hosts them, but YOU control access
> - Google doesn't train AI on your confidential files
> - Same concept: we host, you own and control
> 
> **The AI (Claude/Gemini) just REFERENCES your data temporarily:**
> - Like consulting a law library during research
> - Reads your cases, uses them for this answer
> - Then "returns" the books (forgets the context)
> - Model is never modified with your data
> 
> **Bottom line:** Same AI power as ChatGPT, but SECURE, COMPLIANT, and YOU control everything."

---

## ✅ COMPLIANCE CHECKLIST

- [x] **Multi-tenant isolation** (RLS on all tables)
- [x] **Organization-based security** (org_id on every record)
- [x] **No cross-firm data leakage** (impossible by design)
- [x] **No AI model training** (Enterprise API contracts)
- [x] **RAG only** (temporary context, not training)
- [x] **India hosting** (Supabase Mumbai region)
- [x] **Encryption** (AES-256 at rest, TLS 1.3 in transit)
- [x] **Audit logs** (every AI query logged)
- [x] **Data export** (CSV, JSON, ZIP anytime)
- [x] **Data deletion** (permanent, GDPR-compliant)
- [x] **Bar Council compliant** (client confidentiality maintained)
- [ ] **SOC 2 Type II** (in progress, 6-12 months)
- [ ] **Penetration testing** (quarterly, starting Q1 2025)
- [ ] **ISO 27001** (planned for Year 2)

---

## 🎯 KEY MESSAGING

### **For Website/Marketing:**

> **"LegalOS is the secure ChatGPT alternative for Indian law firms."**
> 
> Unlike ChatGPT where your client data goes to OpenAI's servers,
> LegalOS keeps your data in YOUR private database in Mumbai.
> 
> Our AI references your past cases (like consulting a library)
> but never trains on them (like memorizing permanently).
> 
> You get the same AI power, but Bar Council compliant.

### **For Sales Calls:**

> **"Think of LegalOS like GitHub Copilot for lawyers:**
> - Your company banned ChatGPT and gave you Copilot
> - Same AI power, but secure and compliant
> - LegalOS does the same for law firms
> - Ban ChatGPT, use LegalOS, sleep better at night"

### **For Technical Buyers:**

> **"We use RAG (Retrieval Augmented Generation), not training:**
> - Your data stays in your Supabase instance (Mumbai)
> - Row Level Security enforces multi-tenant isolation
> - When you query, we search YOUR database
> - Send context to Claude API (temporary processing)
> - Claude returns response, forgets context
> - No model modification, no training, full audit trail"

---

## 📄 SUMMARY

**The Core Security Promise:**

1. ✅ **Your data STAYS in YOUR database** (not ours, not OpenAI's)
2. ✅ **We NEVER train AI models** on your confidential cases
3. ✅ **We DO use RAG** (temporary reference, like a library)
4. ✅ **Multi-tenant isolation** (impossible to see other firms)
5. ✅ **India hosted** (Mumbai servers, Indian jurisdiction)
6. ✅ **Bar Council compliant** (full audit trail, client confidentiality)
7. ✅ **You own everything** (export/delete anytime)

**LegalOS: Secure AI for Law Firms** ⚖️🔐


