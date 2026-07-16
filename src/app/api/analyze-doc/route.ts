import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

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
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentName, documentText, documentType } = body;
    
    if (!documentText) {
      return NextResponse.json({ error: "Document text content is required" }, { status: 400 });
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
      return NextResponse.json({ ...mockAnalysis, simulated: true });
    }

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
    return NextResponse.json({ ...parsedData, simulated: false });

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Return mock fallback as graceful recovery
    const body = await req.json().catch(() => ({}));
    const { documentName } = body;
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
    return NextResponse.json({
      ...mockAnalysis,
      simulated: true,
      error: true,
      errorMessage: error.message || error
    });
  }
}
