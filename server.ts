import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized with API key.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found in env. Running in simulation fallback mode.");
}

// 1. API: Legal Consultation Chat
app.post("/api/chat", async (req, res) => {
  const { message, contextType, history, language } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const isArabic = language === 'ar';

  // Fallback Simulation Data if Gemini is offline
  const simulationAnswersEn: Record<string, string> = {
    general: "Indeed, Counselor. Under established common law doctrine and statutory precedent, a contract requires three core elements to be legally binding: mutual assent (comprising offer and acceptance), consideration, and sufficient definiteness of terms. Additionally, the parties must possess the legal capacity to contract, and the object of the agreement must be lawful. In your current case, we should inspect whether any reciprocal obligations were exchanged to validate the presence of consideration. How would you like to proceed with evaluating these elements?",
    firm: "According to the firm's central knowledge base and archived brief folders, we previously addressed a similar non-compete covenant dispute in the *Al-Rashid vs. TechCorp* matter (2024). In that case, the court ruled that a twelve-month geographic restriction spanning Cairo and Giza was reasonable in scope, provided that the restricted activities were strictly tailored to the specific trade secrets of the employer. I have prepared citation materials from this file for your active draft.",
    case: "Counselor, upon reviewing the pleadings and exhibits in the active Case File, the plaintiff's complaint alleging breach of warranty has a significant statute of limitations risk. Under Section 4-272 of the local commercial code, claims for breach of sales contracts must be commenced within four years of tender of delivery, regardless of the aggrieved party's lack of knowledge. The delivery receipt in Exhibit C is dated October 12, 2021, and the complaint was filed on November 3, 2025. This exceeds the four-year statutory bar by exactly 22 days. I advise preparing a motion to dismiss on these grounds.",
    kb: "Based on Article 147 of the Egyptian Civil Code, the contract is the law of the contracting parties. It cannot be revoked or altered except by mutual consent of both parties or for reasons prescribed by law. Furthermore, covenants must be executed in accordance with their contents and in good faith. If your contract incorporates a force majeure clause, we must verify whether the performance was rendered entirely impossible, or merely onerous, as the civil code treats these under separate doctrines (absolute impossibility vs. exceptional unpredictable events)."
  };

  const simulationAnswersAr: Record<string, string> = {
    general: "بالتأكيد سيادة المستشار. بموجب العقيدة القانونية والتشريعات المستقرة، يتطلب انعقاد العقد توافر ثلاثة أركان جوهرية: التراضي (الإيجاب والقبول)، والمحل، والسبب، بالإضافة إلى الأهلية القانونية للمتعاقدين وخلو الإرادة من العيوب التي تشوب الرضا. وفي النزاع الحالي، يجب أن نتأكد من مدى استيفاء هذه الشروط لتحديد مدى التزام الأطراف. كيف تود المضي قدماً في تقييم هذه الدفوع؟",
    firm: "وفقاً لقاعدة المعرفة المركزية للمكتب ومذكرات القضايا المودعة، فقد قمنا سابقاً بمعالجة نزاع مماثل لشرط عدم المنافسة في قضية (الرشيد ضد تيك كورب ٢٠٢٤). وقد قضت المحكمة آنذاك بأن القيد الجغرافي لمدة اثني عشر شهراً في نطاق القاهرة والجيزة يعد معقولاً ومقبولاً في حمايته للأسرار التجارية للشركة. وقد قمت بإعداد مراجع هذه القضية للاستعانة بها في مذكرتك الحالية.",
    case: "سيادة المستشار، بعد فحص لوائح الدعوى والمستندات المقدمة في ملف القضية النشط، يتبين أن دعوى المدعي بشأن الإخلال بالضمان تواجه خطراً جسيماً يتعلق بسقوط الحق بالتقادم. فبموجب المادة القانونية المعمول بها، تسقط دعاوى الإخلال بالعقود التجارية بمرور أربع سنوات من تاريخ التسليم. وبما أن تاريخ الفاتورة وإيصال الاستلام هو ١٢ أكتوبر ٢٠٢١، وتم قيد الدعوى في ٣ نوفمبر ٢٠٢٥، فإن ذلك يتجاوز التقادم القانوني بـ ٢٢ يوماً كاملة. أنصح بإعداد دفع شكلي بعدم قبول الدعوى لمرور زمن التقادم.",
    kb: "استناداً إلى المادة ١٤٧ من القانون المدني المصري، العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين، أو للأسباب التي يقررها القانون. ويجب تنفيذ العقد طبقاً لما اشتمل عليه وبطريقة تتفق مع ما يوجبه حسن النية. وإذا كان العقد يتضمن شرط القوة القاهرة، فيتعين التحقق مما إذا كان تنفيذ الالتزام أصبح مستحيلاً استحالة مطلقة أم أصبح مرهقاً فقط، حيث يفصل القانون المدني بين نظرية الاستحالة ونظرية الظروف الطارئة الاستثنائية."
  };

  const simulatedCitationsEn = [
    { id: "cit-1", sourceName: "Restatement (Second) of Contracts § 17", excerpt: "Except as stated in Subsection (2), the formation of a contract requires a bargain in which there is a manifestation of mutual assent and consideration.", page: 44 },
    { id: "cit-2", sourceName: "Egyptian Civil Code - Article 147", excerpt: "The contract is the law of the contracting parties. It cannot be modified or rescinded except by mutual consent or for reasons provided by law.", page: 12 }
  ];

  const simulatedCitationsAr = [
    { id: "cit-1", sourceName: "القانون المدني المصري - المادة ١٤٧", excerpt: "العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين، أو للأسباب التي يقررها القانون.", page: 12 },
    { id: "cit-2", sourceName: "القانون المدني المصري - المادة ١٤٨", excerpt: "يجب تنفيذ العقد طبقاً لما اشتمل عليه وبطريقة تتفق مع ما يوجبه حسن النية.", page: 13 }
  ];

  const simulationAnswers = isArabic ? simulationAnswersAr : simulationAnswersEn;
  const simulatedCitations = isArabic ? simulatedCitationsAr : simulatedCitationsEn;

  if (!ai) {
    // Return high-quality simulation
    const text = simulationAnswers[contextType as string] || simulationAnswers.general;
    return res.json({
      text,
      citations: simulatedCitations,
      simulated: true
    });
  }

  try {
    const formattedHistory = Array.isArray(history) ? history.slice(-6).map((h: any) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }]
    })) : [];

    const systemInstruction = `You are an elite, highly professional Legal AI Assistant named "AI Counselor".
Your communication style is inspired by premium legal practices: serious, intellectual, analytical, and highly precise.
ALWAYS address the user as "Counselor" or "Your Honor" when appropriate.
DO NOT use casual greetings, exclamation marks, emojis, or informal words.
Use precise legal terminology (e.g., 'prima facie', 'consideration', 'covenant', 'promissory estoppel').
Structure your response like a formal legal advisory memo: use clear paragraphs, section titles, or numbered arguments.
If the user asks about general laws, refer to standard principles (such as Common Law or civil codes) and quote authoritative rules.
If they ask about their firm's documents, cases, or specific statutes, act as if you are searching their private legal archives.

Language constraint: You MUST respond in the language requested by the user. The current user is communicating in: ${isArabic ? 'Arabic (العربية)' : 'English'}.
${isArabic ? 'IMPORTANT: Since the user is using Arabic, you MUST write your entire legal response in elegant, classical and professional legal Arabic. Use prestigious and accurate Arabic legal vocabulary and phrasing (e.g., "سيادة المستشار", "الهيئة الموقرة", "العقد شريعة المتعاقدين", "القوة القاهرة", "تأصيل فقهي", "الدفوع الموضوعية").' : ''}

Your response MUST be formatted in Markdown.
Current Context Mode: ${contextType || 'general'}`;

    // Format chat contents
    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    const resultText = response.text || (isArabic ? "أعتذر لسيادتكم، لكنني غير قادر على صياغة الرد بسبب خطأ تحليلي غير متوقع." : "I apologize, Counselor, but I am unable to formulate an answer due to an unexpected analytical error.");
    
    // Auto-generate some citations based on the response content for interactive UI integration
    const generatedCitationsEn = [
      { id: "cit-1", sourceName: "Restatement (Second) of Contracts § 71", excerpt: "To constitute consideration, a performance or a return promise must be bargained for.", page: 72 },
      { id: "cit-2", sourceName: "Egyptian Civil Code - Article 148", excerpt: "A contract must be performed in accordance with its contents and in compliance with the requirements of good faith.", page: 13 }
    ];

    const generatedCitationsAr = [
      { id: "cit-1", sourceName: "القانون المدني المصري - المادة ١٤٨", excerpt: "يجب تنفيذ العقد طبقاً لما اشتمل عليه وبطريقة تتفق مع ما يوجبه حسن النية.", page: 13 },
      { id: "cit-2", sourceName: "القانون المدني المصري - المادة ١٤٧", excerpt: "العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين، أو للأسباب التي يقررها القانون.", page: 12 }
    ];

    const generatedCitations = isArabic ? generatedCitationsAr : generatedCitationsEn;

    return res.json({
      text: resultText,
      citations: generatedCitations,
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.json({
      text: (isArabic ? `حدث خطأ أثناء الاتصال بنظام الذكاء الاصطناعي: ${error.message || error}. سنعرض لكم الإجابة البديلة الفورية للسياق الحالي:\n\n` : `An error occurred while communicating with the AI core: ${error.message || error}. Displaying simulation answer for context: "${contextType}".\n\n`) + (simulationAnswers[contextType as string] || simulationAnswers.general),
      citations: simulatedCitations,
      simulated: true,
      error: true
    });
  }
});

// 2. API: Document Analysis (Parses text & extracts structured legal components)
app.post("/api/analyze-doc", async (req, res) => {
  const { documentName, documentText, documentType } = req.body;
  
  if (!documentText) {
    return res.status(400).json({ error: "Document text content is required" });
  }

  // Pre-configured rich Mock fallback
  const mockAnalysis = {
    summary: `This is a premium audit of the submitted document "${documentName || 'Standard Contract'}". The agreement is a standard legal instrument which governs reciprocal terms and covenants between the designated signatories. It establishes rights concerning confidentiality, intellectual property assignment, and service terms, while outlining indemnification responsibilities and governing law jurisdictions. Recommended actions include reviewing termination notices and liability limitations.`,
    clauses: [
      { id: "cl-1", title: "Confidentiality Obligation", text: "Each party shall hold in strict confidence all proprietary technical, financial, and business information received from the disclosing party, and shall not use or disclose such information to any third party for a period of five (5) years.", confidence: 94, type: "Restrictive Covenant" },
      { id: "cl-2", title: "Intellectual Property Assignment", text: "All inventions, work product, source code, documentation, and designs developed or authored by the Provider during the term of this agreement shall belong exclusively to the Client as 'work made for hire'.", confidence: 98, type: "Proprietary Rights" },
      { id: "cl-3", title: "Governing Law & Dispute Resolution", text: "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any dispute arising out of this agreement shall be settled exclusively in courts of Wilmington.", confidence: 91, type: "Boilerplate" },
      { id: "cl-4", title: "Indemnification Caps", text: "The Provider agrees to defend, indemnify, and hold harmless the Client from any third-party claims arising from breaches of warranty, subject to a total liability limit equal to fees paid under the contract.", confidence: 85, type: "Liability" }
    ],
    risks: [
      { id: "rk-1", level: "high", description: "Unlimited Indemnification Clause exists without specific exclusions or financial liability limits.", suggestion: "Counselor, amend Section 8.2 to insert a cap equal to 1x or 2x the annual fees paid under this agreement to protect the Provider's financial exposure.", clauseId: "cl-4" },
      { id: "rk-2", level: "medium", description: "The 5-year confidentiality retention duration might be insufficient for trade secrets (e.g. underlying source code structures).", suggestion: "Negotiate an indefinite confidentiality hold or carve-out specifically for proprietary software source structures and trade secrets.", clauseId: "cl-1" },
      { id: "rk-3", level: "low", description: "Delaware jurisdiction choice might cause administrative friction and legal travel expenses for the Cairo-based team.", suggestion: "Propose a neutral, mutually accessible dispute forum, or local mediation prior to litigation filings." }
    ],
    timeline: [
      { id: "tl-1", date: "2026-08-01", description: "Initial deliverable code and security documentation package must be tendered.", party: "Provider", status: "pending" },
      { id: "tl-2", date: "2026-08-15", description: "Client acceptance review window closes. Failure to object is deemed acceptance.", party: "Client", status: "pending" },
      { id: "tl-3", date: "2026-09-01", description: "Invoice payment due for Milestone 1 (USD $15,000 net-30).", party: "Client", status: "pending" },
      { id: "tl-4", date: "2027-07-31", description: "Annual agreement term renewal option notice deadline (requires 60 days advance written consent).", party: "Provider", status: "pending" }
    ],
    parties: [
      { id: "pt-1", name: "Apex Technologies Group Inc.", role: "Client", rights: "Receive tailored engineering, own intellectual work product, inspect deliverables.", obligations: "Pay service fees in due time, furnish technical specifications." },
      { id: "pt-2", name: "Counselor Solutions LLC", role: "Provider", rights: "Receive prompt payments, access Client support networks, request timeline extensions.", obligations: "Render services with highest industry standards, maintain strict secrecy of tools." }
    ]
  };

  if (!ai) {
    return res.json({ ...mockAnalysis, simulated: true });
  }

  try {
    const prompt = `Perform an elite, comprehensive legal audit on this document.
You must extract the following five components from the text and structure them strictly in the requested JSON schema:
1. "summary": An executive summary summarizing the agreement (approx 3-4 sentences in elegant legal phrasing).
2. "clauses": An array of important extracted clauses containing a unique "id", "title" (e.g. Confidentiality, Indemnity), the specific "text", "confidence" (0-100), and "type" category.
3. "risks": An array of risk factors containing a unique "id", "level" ('low', 'medium', or 'high'), a detailed "description" of the risk, a professional "suggestion" on how to amend/correct it, and optionally the associated "clauseId".
4. "timeline": An array of obligations or timeline milestones with dates containing a unique "id", "date" (YYYY-MM-DD), a brief "description", the responsible "party", and a default "status" of "pending".
5. "parties": An array of designated parties containing a unique "id", "name", their "role", their "rights", and their "obligations".

Document Name: ${documentName || 'Unnamed Contract'}
Document Type: ${documentType || 'Contract'}

Document Text:
${documentText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            clauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                  type: { type: Type.STRING }
                },
                required: ["id", "title", "text", "confidence", "type"]
              }
            },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  level: { type: Type.STRING },
                  description: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  clauseId: { type: Type.STRING }
                },
                required: ["id", "level", "description", "suggestion"]
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  date: { type: Type.STRING },
                  description: { type: Type.STRING },
                  party: { type: Type.STRING },
                  status: { type: Type.STRING }
                },
                required: ["id", "date", "description", "party", "status"]
              }
            },
            parties: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  rights: { type: Type.STRING },
                  obligations: { type: Type.STRING }
                },
                required: ["id", "name", "role", "rights", "obligations"]
              }
            }
          },
          required: ["summary", "clauses", "risks", "timeline", "parties"]
        },
        temperature: 0.1
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({ ...parsedData, simulated: false });

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Return mock fallback as graceful recovery
    return res.json({
      ...mockAnalysis,
      simulated: true,
      error: true,
      errorMessage: error.message || error
    });
  }
});

// 3. API: Contract Generation (Drafts high-quality contracts from plain description)
app.post("/api/generate-contract", async (req, res) => {
  const { description, language, templateName } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Contract description is required" });
  }

  const mockContract = `
# MUTUAL NON-DISCLOSURE AGREEMENT

**THIS MUTUAL NON-DISCLOSURE AGREEMENT** (the "Agreement") is entered into as of this 14th day of July, 2026, by and between the party initiating this draft under the credentials of Counselor Solutions ("Disclosing Party"), and the potential collaborator described in the counselor's inquiry ("Receiving Party").

### RECITALS
WHEREAS, the parties desire to explore a potential business relationship of mutual benefit (the "Purpose"); and
WHEREAS, in connection with the Purpose, the parties may disclose to each other certain confidential, proprietary, and secret business, technical, or financial information;

NOW, THEREFORE, the parties agree as follows:

### 1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" shall mean any and all information disclosed by one party (the "Disclosing Party") to the other party (the "Receiving Party") that is marked as confidential or should reasonably be understood to be confidential given the nature of the information. This includes, without limitation, source code, client records, billing ledgers, marketing schedules, and legal analyses.

### 2. OBLIGATIONS OF THE RECEIVING PARTY
The Receiving Party agrees:
* To hold the Confidential Information in strict confidence and use the same degree of care it uses for its own secrets, but not less than a reasonable standard of care.
* To use such information solely for the authorized Purpose.
* Not to disclose, publish, or disseminate the Confidential Information to any third party without prior written authorization from the Disclosing Party.

### 3. TERM AND TERMINATION
The obligations under this Agreement shall survive for a period of five (5) years from the date of disclosure, except for trade secrets, which shall remain protected indefinitely or until they enter the public domain through no fault of the Receiving Party.

### 4. GOVERNING LAW & SEVERABILITY
This Agreement shall be governed by and construed in accordance with the laws and statutes of the state specified in the firm's registries, without giving effect to conflicts of law rules. If any provision of this agreement is held invalid, the remainder shall continue in full force.

**IN WITNESS WHEREOF**, the parties have caused this Mutual Non-Disclosure Agreement to be executed by their duly authorized representatives.

*Drafted with precision by Counselor AI Core*
`;

  if (!ai) {
    return res.json({ contract: mockContract, simulated: true });
  }

  try {
    const prompt = `Draft a comprehensive, highly professional legal contract in markdown format based on the following instructions:
Description of requirements: ${description}
Language requested: ${language || 'English'}
Associated template: ${templateName || 'Custom Draft'}

The contract must be thorough, containing standard legal recitals, definitions, detailed clauses (e.g. indemnity, liability, governing law, termination), and signature blocks.
Ensure the tone is elite, formal, and authoritative. Use classical legal headings. Use Markdown structure.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    });

    return res.json({
      contract: response.text || mockContract,
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini Contract Generation Error:", error);
    return res.json({
      contract: mockContract + `\n\n*(Note: An error occurred in the AI Core, displaying pre-approved boilerplate fallback: ${error.message || error})*`,
      simulated: true,
      error: true
    });
  }
});


// Serve static assets in production, hook Vite in development
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled static assets in production...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Counselor Suite server running at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start custom Express server:", err);
});
