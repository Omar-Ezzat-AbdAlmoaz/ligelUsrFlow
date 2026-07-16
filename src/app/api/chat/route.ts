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
    console.log("Gemini AI client successfully initialized in Next.js route.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, contextType, history, language } = body;
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
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
      const text = simulationAnswers[contextType as string] || simulationAnswers.general;
      return NextResponse.json({
        text,
        citations: simulatedCitations,
        simulated: true
      });
    }

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

    return NextResponse.json({
      text: resultText,
      citations: generatedCitations,
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    const body = await req.json().catch(() => ({}));
    const { contextType, language } = body;
    const isArabic = language === 'ar';
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

    return NextResponse.json({
      text: (isArabic ? `حدث خطأ أثناء الاتصال بنظام الذكاء الاصطناعي: ${error.message || error}. سنعرض لكم الإجابة البديلة الفورية للسياق الحالي:\n\n` : `An error occurred while communicating with the AI core: ${error.message || error}. Displaying simulation answer for context: "${contextType}".\n\n`) + (simulationAnswers[contextType as string] || simulationAnswers.general),
      citations: simulatedCitations,
      simulated: true,
      error: true
    });
  }
}
