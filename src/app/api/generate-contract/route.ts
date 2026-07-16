import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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
    const { description, language, templateName } = body;

    if (!description) {
      return NextResponse.json({ error: "Contract description is required" }, { status: 400 });
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
      return NextResponse.json({ contract: mockContract, simulated: true });
    }

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

    return NextResponse.json({
      contract: response.text || mockContract,
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini Contract Generation Error:", error);
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
    return NextResponse.json({
      contract: mockContract + `\n\n*(Note: An error occurred in the AI Core, displaying pre-approved boilerplate fallback: ${error.message || error})*`,
      simulated: true,
      error: true
    });
  }
}
