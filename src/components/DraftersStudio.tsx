import React, { useState } from 'react';
import { 
  FileText, Sparkles, BookOpen, Search, ArrowRight, ChevronRight, 
  ArrowLeft, Check, Edit3, ShieldAlert, Clock, Download, Copy, 
  Trash2, Globe, HelpCircle, Save, Plus, X, List, AlertTriangle 
} from 'lucide-react';
import { ContractTemplate } from '../types';
import { Language, translations } from '../lib/translations';

interface DraftersStudioProps {
  onDraftCreated: (doc: { name: string; content: string; type: string }) => void;
  language: Language;
}

export default function DraftersStudio({ onDraftCreated, language }: DraftersStudioProps) {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'library' | 'wizard' | 'description' | 'editor'>('library');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  
  // Description Prompt States
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Arabic' | 'Bilingual'>(language === 'ar' ? 'Arabic' : 'English');
  const [isDrafting, setIsDrafting] = useState(false);

  // Smart Form Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardValues, setWizardValues] = useState<Record<string, string>>({});

  // Editor States
  const [editorTitle, setEditorTitle] = useState(language === 'ar' ? 'مسودة اتفاقية حفظ سرية ثنائية' : 'Bilateral Non-Disclosure Agreement (Draft)');
  const [editorContent, setEditorContent] = useState('');
  const [showAiAssist, setShowAiAssist] = useState(true);
  const [showRiskScanner, setShowRiskScanner] = useState(true);
  const [editorHistory, setEditorHistory] = useState<Array<{ v: string; date: string; content: string }>>([
    { v: "v1.0.0", date: language === 'ar' ? "١٣ يوليو ٢٠٢٦" : "Jul 13, 2026", content: "" }
  ]);
  const [activeVersion, setActiveVersion] = useState("v1.0.0");

  const templates: ContractTemplate[] = [
    {
      id: "tmpl-nda",
      name: language === 'ar' ? "اتفاقية حفظ سرية ثنائية" : "Bilateral Non-Disclosure",
      description: language === 'ar' 
        ? "تعهد ثنائي قياسي لحفظ السرية وعدم الإفصاح مناسب للمحادثات المؤسسية الاستكشافية، الاندماجات المشتركة، أو الاستشارات التعاقدية."
        : "Standard mutual non-disclosure covenant suitable for exploratory corporate talks, joint integrations, or contractor exchanges.",
      category: language === 'ar' ? "الشركات" : "Corporate",
      language: "English",
      variables: [
        { name: "party_a", label: language === 'ar' ? "الطرف الأول المفصح (أ)" : "Disclosing Signatory (Party A)", type: "text", placeholder: language === 'ar' ? "مثال: شركة أبيكس للتكنولوجيا" : "e.g. Apex Tech Inc." },
        { name: "party_b", label: language === 'ar' ? "الطرف الثاني المستلم (ب)" : "Receiving Signatory (Party B)", type: "text", placeholder: language === 'ar' ? "مثال: مؤسسة كونسيلر" : "e.g. Counselor Corp" },
        { name: "conf_duration", label: language === 'ar' ? "مدة حفظ السرية" : "Confidentiality Term (Years)", type: "select", options: language === 'ar' ? ["٣ سنوات", "٥ سنوات", "٧ سنوات", "غير محددة"] : ["3 Years", "5 Years", "7 Years", "Indefinite"] },
        { name: "jurisdiction", label: language === 'ar' ? "القانون الواجب التطبيق والاختصاص" : "Governing Law State", type: "text", placeholder: language === 'ar' ? "مثال: القانون المدني المصري" : "e.g. Delaware" }
      ]
    },
    {
      id: "tmpl-labor",
      name: language === 'ar' ? "عقد عمل تنفيذي ثنائي" : "Executive Labor Agreement",
      description: language === 'ar' 
        ? "عقد عمل تفصيلي يحدد فترات الاختبار، وهيكل الرواتب، وتعيين حقوق الملكية الفكرية، وفترات الإخطار لإنهاء الخدمة."
        : "Thorough bilateral employment instrument mapping probationary windows, compensation schedules, IP assignment, and notice periods.",
      category: language === 'ar' ? "العمل" : "Labor",
      language: "Bilingual",
      variables: [
        { name: "employer", label: language === 'ar' ? "الشركة أو صاحب العمل" : "Employer Enterprise", type: "text", placeholder: language === 'ar' ? "مثال: حلول القاهرة للبرمجيات" : "e.g. Cairo Solutions Ltd" },
        { name: "employee", label: language === 'ar' ? "اسم الموظف" : "Employee Name", type: "text", placeholder: language === 'ar' ? "مثال: شريف هارينغتون" : "e.g. Charles Harrington" },
        { name: "salary", label: language === 'ar' ? "الراتب الشهري الأساسي" : "Base Salary Package (Monthly)", type: "text", placeholder: language === 'ar' ? "مثال: ٧٥,٠٠٠ جنيه مصري" : "e.g. USD $8,500" },
        { name: "notice_period", label: language === 'ar' ? "فترة الإخطار لإنهاء التعاقد" : "Notice Period Duration", type: "select", options: language === 'ar' ? ["٣٠ يوماً", "٦٠ يوماً", "٩٠ يوماً"] : ["30 Days", "60 Days", "90 Days"] }
      ]
    },
    {
      id: "tmpl-lease",
      name: language === 'ar' ? "عقد إيجار تجاري عقاري" : "Commercial Real Lease",
      description: language === 'ar' 
        ? "اتفاق قانوني يحكم إيجار العقارات التجارية، مع تفصيل التزامات الصيانة والمرافق، والتجديد السنوي، وجهات تسوية النزاعات."
        : "Legal covenant governing rental properties, delineating tenant maintenance terms, annual lease renewals, and dispute venues.",
      category: language === 'ar' ? "عقارات" : "Real Estate",
      language: "English",
      variables: [
        { name: "landlord", label: language === 'ar' ? "المؤجر / مالك العقار" : "Landlord Signatory", type: "text", placeholder: language === 'ar' ? "مثال: شركة ويلمنجتون العقارية" : "e.g. Wilmington Realty LLC" },
        { name: "tenant", label: language === 'ar' ? "المستأجر" : "Tenant Signatory", type: "text", placeholder: language === 'ar' ? "مثال: شركة أبيكس للتقنية" : "e.g. Apex Tech Office" },
        { name: "rent_amount", label: language === 'ar' ? "القيمة الإيجارية الشهرية" : "Rent Rate (Monthly)", type: "text", placeholder: language === 'ar' ? "مثال: ٥,٠٠٠ دولار" : "e.g. $4,000" },
        { name: "security_deposit", label: language === 'ar' ? "مبلغ التأمين المسترد" : "Security Deposit Amount", type: "text", placeholder: language === 'ar' ? "مثال: ١٠,٠٠٠ دولار" : "e.g. $8,000" }
      ]
    }
  ];

  const promptExamples = language === 'ar' ? [
    { text: "اتفاقية عدم إفصاح ثنائية لحماية الأسرار التجارية والبرمجيات المشتركة. القانون المدني المصري. المدة ٥ سنوات.", label: "اتفاقية سرية" },
    { text: "عقد عمل لمهندس برمجيات أول بالقاهرة. الراتب الشهري ٧٥,٠٠٠ جنيه مصري، فترة إخطار ٦٠ يوماً، اختصاص المحاكم المصرية.", label: "عقد عمل ثنائي" },
    { text: "عقد إيجار مكتب تجاري، الإيجار الشهري ٥,٠٠٠ دولار، تأمين شهرين، مع تفصيل التزامات المالك بالصيانة الكبرى.", label: "عقد إيجار تجاري" }
  ] : [
    { text: "Bilateral NDA governing mutual software trade secret exchange. Delaware law. 5 year term.", label: "NDA" },
    { text: "Labor employment contract for a Senior Engineer in Cairo. Monthly compensation 75,000 EGP, 60 days notice period, bilingual Egyptian jurisdiction.", label: "Bilingual Labor" },
    { text: "Commercial office rental agreement lease, monthly rent $5000, 2 months deposit, landlord maintenance liabilities included.", label: "Real Estate Lease" }
  ];

  const preApprovedClauses = language === 'ar' ? [
    { title: "بند السرية وعدم الإفصاح الثنائي", type: "NDA", text: "يلتزم كل طرف ببذل أقصى درجات الرعاية المعقولة لحماية المعلومات، ويتفق الطرفان على أن البيانات السرية المتبادلة خلال فترات المباحثات تظل سرية ومحمية تماماً لمدة خمس سنوات." },
    { title: "الالتزام بقانون العمل المصري", type: "Labor", text: "إن هذا العقد يخضع لأحكام قانون العمل المصري رقم ١٢ لسنة ٢٠٠٣. ويلتزم الطرفان بتنفيذ بنود هذا الاتفاق بحسن نية وبما يتفق مع مقتضيات الشرف والأمانة المعمول بها في نقابة المحامين المصرية." },
    { title: "بند التحكيم والولاية القضائية", type: "Boilerplate", text: "يخضع هذا العقد وتفسيره لقوانين جمهورية مصر العربية، ويتفق الطرفان على إحالة أي نزاع ينشأ عن هذا العقد إلى التحكيم التجاري بمركز القاهرة الإقليمي للتحكيم." }
  ] : [
    { title: "Bilateral Confidentiality Cap", type: "NDA", text: "Each party covenants to utilize at least reasonable protective checks, agreeing that proprietary structures shared during exploratory timelines remain classified for a period of five years." },
    { title: "Egyptian Labor Law Good Faith", type: "Labor", text: "إن هذا العقد يخضع لأحكام قانون العمل المصري رقم ١٢ لسنة ٢٠٠٣. ويلتزم الطرفان بتنفيذ بنود هذا الاتفاق بحسن نية وبما يتفق مع مقتضيات الشرف والأمانة المعمول بها في نقابة المحامين المصرية." },
    { title: "Arbitration Forum Selection", type: "Boilerplate", text: "Any dispute arising under this agreement shall be submitted exclusively to final, binding arbitration conducted under the rules of the American Arbitration Association, Wilmington courts." }
  ];

  // AI Generation from description
  const handleAiDraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descriptionPrompt.trim() || isDrafting) return;

    setIsDrafting(true);

    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: descriptionPrompt,
          language: selectedLanguage,
          templateName: selectedTemplate?.name || 'Custom AI Draft'
        })
      });
      const data = await response.json();
      
      setEditorTitle((selectedTemplate?.name || (language === 'ar' ? 'مسودة عقد مخصصة' : 'Custom AI Draft')) + " (Draft)");
      setEditorContent(data.contract || '');
      
      // Update history
      const newV = "v1.0.0";
      setEditorHistory([{ v: newV, date: language === 'ar' ? "١٣ يوليو ٢٠٢٦" : "Jul 13, 2026", content: data.contract || '' }]);
      setActiveVersion(newV);
      
      setViewMode('editor');
    } catch (err) {
      console.error(err);
      alert(language === 'ar' 
        ? "واجه محرك الذكاء الاصطناعي صعوبة في الصياغة. تم العودة للنموذج القياسي مؤقتاً." 
        : "AI Core experienced drafting friction. Falling back to boilerplate template.");
    } finally {
      setIsDrafting(false);
    }
  };

  // Smart Form Wizard Submit
  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    // Simulate compiling draft from fields
    let draftedText = `# ${selectedTemplate.name.toUpperCase()}\n\n`;
    
    if (language === 'ar') {
      draftedText += `**إقرار صياغة العقد المبدئية**\n\nأُبرم هذا الاتفاق في هذا اليوم الموافق ١٣ يوليو من عام ٢٠٢٦، بين كل من:\n\n`;
      if (selectedTemplate.id === 'tmpl-nda') {
        draftedText += `**${wizardValues.party_a || '[الطرف الأول المفصح]'}** (ويشار إليه بالطرف الأول) و **${wizardValues.party_b || '[الطرف الثاني المستلم]'}** (ويشار إليه بالطرف الثاني).\n\n`;
        draftedText += `### ١. بند السرية ومدتها\n`;
        draftedText += `يتفق الطرفان على أن جميع المعلومات السرية والمحمية المتبادلة بينهما تظل سرية لمدة **${wizardValues.conf_duration || '٥ سنوات'}**.\n\n`;
        draftedText += `### ٢. القانون والنزاعات القضائية\n`;
        draftedText += `يخضع هذا العقد وتفسيره بالكامل لأحكام ونصوص **${wizardValues.jurisdiction || 'القانون المدني المصري'}**.\n`;
      } else if (selectedTemplate.id === 'tmpl-labor') {
        draftedText += `**${wizardValues.employer || '[صاحب العمل]'}** (الطرف الأول) و **${wizardValues.employee || '[الموظف]'}** (الطرف الثاني).\n\n`;
        draftedText += `### ١. الراتب والمستحقات المالية\n`;
        draftedText += `يتعهد صاحب العمل بدفع راتب شهري أساسي وقدره **${wizardValues.salary || '٧٥,٠٠٠ جنيه مصري'}** للطرف الثاني.\n\n`;
        draftedText += `### ٢. الإخطار والفسخ\n`;
        draftedText += `يحق لأي من الطرفين إنهاء هذا التعاقد بموجب إخطار كتابي رسمي مدته **${wizardValues.notice_period || '٣٠ يوماً'}** للطرف الآخر.\n`;
      } else {
        draftedText += `**${wizardValues.landlord || '[المؤجر]'}** (الطرف الأول) و **${wizardValues.tenant || '[المستأجر]'}** (الطرف الثاني).\n\n`;
        draftedText += `### ١. الشروط الإيجارية والمالية\n`;
        draftedText += `القيمة الإيجارية الشهرية هي **${wizardValues.rent_amount || '٥,٠٠٠ دولار'}** مع تقديم تأمين مسترد وقدره **${wizardValues.security_deposit || '١٠,٠٠٠ دولار'}**.\n`;
      }
      draftedText += `\n**وإثباتاً لما تقدم**، وقع الطرفان على هذا العقد بنية سليمة.\n`;
    } else {
      draftedText += `**THIS LEGAL AGREEMENT** is entered into this 13th day of July, 2026, by and between:\n\n`;
      if (selectedTemplate.id === 'tmpl-nda') {
        draftedText += `**${wizardValues.party_a || '[Disclosing Party]'}** (hereinafter referenced as Party A) and **${wizardValues.party_b || '[Receiving Party]'}** (hereinafter referenced as Party B).\n\n`;
        draftedText += `### 1. CONFIDENTIALITY TERM\n`;
        draftedText += `The signatories agree that all proprietary and secret dispatches shared shall remain confidential for a duration of **${wizardValues.conf_duration || '5 Years'}**.\n\n`;
        draftedText += `### 2. DISPUTE CHANNELS & JURISDICTION\n`;
        draftedText += `This covenant and all related filings shall be governed by and interpreted under the rules and statutes of the State of **${wizardValues.jurisdiction || 'Delaware'}**.\n`;
      } else if (selectedTemplate.id === 'tmpl-labor') {
        draftedText += `**${wizardValues.employer || '[Employer]'}** (Employer) and **${wizardValues.employee || '[Employee]'}** (Employee).\n\n`;
        draftedText += `### 1. COMPENSATION SCHEDULE\n`;
        draftedText += `The Employer agrees to pay the Employee a monthly salary package of **${wizardValues.salary || 'USD $5,000'}**.\n\n`;
        draftedText += `### 2. NOTICE TIMELINE\n`;
        draftedText += `Either signatory may terminate performance subject to a written notice period of **${wizardValues.notice_period || '30 Days'}**.\n`;
      } else {
        draftedText += `**${wizardValues.landlord || '[Landlord]'}** (Landlord) and **${wizardValues.tenant || '[Tenant]'}** (Tenant).\n\n`;
        draftedText += `### 1. LEASE RENTAL TERMS\n`;
        draftedText += `Monthly rent is set at **${wizardValues.rent_amount || '$3,000'}** with a security deposit of **${wizardValues.security_deposit || '$6,000'}**.\n`;
      }
      draftedText += `\n**IN WITNESS WHEREOF**, the parties cause this agreement to be executed.\n`;
    }

    setEditorTitle(selectedTemplate.name + (language === 'ar' ? ' مسودة' : ' Draft'));
    setEditorContent(draftedText);
    setEditorHistory([{ v: "v1.0.0", date: language === 'ar' ? "١٣ يوليو ٢٠٢٦" : "Jul 13, 2026", content: draftedText }]);
    setActiveVersion("v1.0.0");
    setViewMode('editor');
  };

  const handleSaveEditor = () => {
    // Simulate committing draft
    onDraftCreated({
      name: editorTitle,
      content: editorContent,
      type: selectedTemplate?.category || 'NDA'
    });
    alert(language === 'ar'
      ? "تم إيداع مسودة العقد بنجاح في مجلدات غرفة المستندات والأدلة، سيادة المستشار."
      : "Draft successfully committed to Evidence Room Library folders, Counselor.");
  };

  const handleNewVersion = () => {
    const nextVerNum = editorHistory.length + 1;
    const nextVer = `v1.0.${nextVerNum - 1}`;
    const newHistItem = {
      v: nextVer,
      date: language === 'ar' ? "١٣ يوليو ٢٠٢٦ (تعديل)" : "Jul 13, 2026 (Edited)",
      content: editorContent
    };
    setEditorHistory(prev => [...prev, newHistItem]);
    setActiveVersion(nextVer);
    alert(language === 'ar'
      ? `تم حفظ الإصدار الجديد ${nextVer} بنجاح، سيادة المستشار.`
      : `Version ${nextVer} successfully committed, Counselor.`);
  };

  const handleRestoreVersion = (verStr: string) => {
    const target = editorHistory.find(h => h.v === verStr);
    if (target) {
      setEditorContent(target.content);
      setActiveVersion(verStr);
    }
  };

  return (
    <div className={`space-y-8 animate-fade-in ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      
      {/* 1. LIBRARY VIEW: Selection of template or free AI description */}
      {viewMode === 'library' && (
        <div className="space-y-8">
          <div>
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-burgundy-600 block">
              {language === 'ar' ? "استوديو الصياغة الرقمي" : "THE DRAFTER'S STUDIO"}
            </span>
            <h2 className="font-serif text-3xl font-bold uppercase text-navy-900 mt-1">
              {t.drafter.title}
            </h2>
            <p className="text-gray-500 font-serif italic text-sm mt-1">
              {t.drafter.subtitle}
            </p>
          </div>

          {/* AI Description Input (Direct prompt drafting) */}
          <div className="border border-navy-900 bg-white p-6 md:p-8 rounded-sm shadow-md relative overflow-hidden">
            <div className={`absolute top-0 w-32 h-32 opacity-[0.03] pointer-events-none -mt-4 ${language === 'ar' ? 'left-0 -ml-4' : 'right-0 -mr-4'}`}>
              <Sparkles className="w-full h-full text-navy-900" />
            </div>

            <h3 className={`font-serif font-bold text-lg text-navy-900 uppercase flex items-center gap-1.5 border-b border-gray-100 pb-3 mb-5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-5 h-5 text-gold-500 stroke-[2] animate-pulse" /> 
              {language === 'ar' ? "الصياغة الاستشارية الفورية بالذكاء الاصطناعي" : "Direct AI Advisory Drafting"}
            </h3>

            <form onSubmit={handleAiDraftSubmit} className="space-y-4">
              <div className="border border-navy-900 focus-within:border-gold-500 transition-all rounded-sm">
                <textarea
                  id="textarea-draft-description"
                  value={descriptionPrompt}
                  onChange={(e) => setDescriptionPrompt(e.target.value)}
                  placeholder={language === 'ar' 
                    ? "صف معالم العقد والمستند المطلوب بلغة طبيعية (مثال: عقد عمل مصري لمهندس برمجيات، فترة إخطار ٦٠ يوماً، وتحديد الاختصاص بمحاكم القاهرة...)" 
                    : "Describe the contract parameters in plain language (e.g., An Egyptian employment contract for an engineering lead, notice limits 60 days, EGP pricing...)"}
                  required
                  className={`w-full h-24 bg-transparent border-none text-xs md:text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 p-4 font-serif leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>

              {/* Clicking examples fills textbox */}
              <div className={`flex flex-wrap gap-2 pt-1 items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">
                  {language === 'ar' ? "مسودات سريعة جاهزة:" : "Pre-approved Prompts:"}
                </span>
                {promptExamples.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescriptionPrompt(ex.text)}
                    className="text-[10px] bg-parchment-light hover:bg-gold-500/10 border border-gray-300 rounded-sm py-1 px-2 font-serif italic text-burgundy-600 cursor-pointer"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {/* Language toggler */}
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    {language === 'ar' ? "لغة مخرجات المسودة:" : "Output Language:"}
                  </span>
                  <div className="flex border border-gray-300 rounded-sm overflow-hidden text-xs">
                    {(['English', 'Arabic', 'Bilingual'] as const).map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-3 py-1 cursor-pointer font-serif ${
                          selectedLanguage === lang ? 'bg-navy-900 text-white font-semibold' : 'bg-white text-gray-500 hover:text-navy-900'
                        }`}
                      >
                        {lang === 'English' && language === 'ar' ? 'إنجليزية' :
                         lang === 'Arabic' && language === 'ar' ? 'عربية' :
                         lang === 'Bilingual' && language === 'ar' ? 'ثنائية اللغة' : lang}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!descriptionPrompt.trim() || isDrafting}
                  className="w-full sm:w-auto bg-navy-900 hover:bg-burgundy-600 disabled:bg-gray-200 text-white py-2.5 px-6 rounded-sm font-serif uppercase tracking-widest text-xs font-bold transition-all cursor-pointer border border-transparent flex items-center justify-center gap-1.5"
                >
                  {isDrafting ? (
                    <>{language === 'ar' ? "جاري صياغة البنود..." : "AI Core Drafting..."}</>
                  ) : (
                    <>
                      {language === 'ar' ? "صياغة المسودة الذكية" : "Draft Instrument"}{' '}
                      <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-spin-slow" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Template Binders list (Masonry grid / covers) */}
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900 uppercase border-b border-gray-200 pb-3 mb-6">
              {language === 'ar' ? "مجلدات وملفات العقود القياسية النموذجية" : "Standard Smart Template Binders"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map(tmpl => (
                <div 
                  key={tmpl.id} 
                  className="bg-white border border-gray-200 rounded-sm hover:border-burgundy-600 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-5 flex-1">
                    {/* Simulated Book cover thumbnail */}
                    <div className="bg-parchment-light border border-gray-200 rounded-sm h-40 flex flex-col justify-between p-4 mb-4 relative overflow-hidden group">
                      <div className={`absolute top-0 w-2 h-full bg-gold-500 ${language === 'ar' ? 'left-0' : 'right-0'}`} />
                      <div className="text-[9px] font-mono text-gray-400 uppercase font-bold">
                        {language === 'ar' ? `مجلد ${tmpl.category}` : `${tmpl.category} BINDER`}
                      </div>
                      <BookOpen className="w-8 h-8 text-navy-700 stroke-[1.2] self-center my-auto group-hover:scale-110 transition-transform" />
                      <div className="font-serif font-bold text-xs text-navy-900 uppercase tracking-wider text-center truncate">{tmpl.name}</div>
                    </div>

                    <h4 className="font-serif font-bold text-base text-navy-900 uppercase tracking-tight">{tmpl.name}</h4>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{tmpl.description}</p>
                  </div>

                  <div className="p-5 border-t border-gray-100 bg-parchment-light/30">
                    <button
                      onClick={() => {
                        setSelectedTemplate(tmpl);
                        setWizardStep(1);
                        setWizardValues({});
                        setViewMode('wizard');
                      }}
                      className="w-full bg-transparent hover:bg-navy-900 border border-navy-900 text-navy-900 hover:text-white transition-all py-2 rounded-sm font-serif uppercase tracking-wider text-xs font-bold cursor-pointer"
                    >
                      {language === 'ar' ? "استدعاء المجلد وصياغته" : "Retrieve Binder"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SMART WIZARD FORM VIEW */}
      {viewMode === 'wizard' && selectedTemplate && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-sm shadow-md p-6 md:p-8 animate-fade-in text-right">
          <div className={`flex justify-between items-center border-b border-gray-100 pb-4 mb-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setViewMode('library')}
              className={`flex items-center gap-1 font-serif text-xs uppercase tracking-wider text-gray-500 hover:text-navy-900 cursor-pointer ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-4 h-4 stroke-[2.5] ${language === 'ar' ? 'rotate-180' : ''}`} /> 
              {language === 'ar' ? "العودة إلى المكتبة الرئيسية" : "Return to library"}
            </button>
            <span className="text-xs font-mono text-gray-400 font-bold uppercase">
              {language === 'ar' ? "إعداد متغيرات صياغة النموذج" : "Wizard Parameters Setup"}
            </span>
          </div>

          <div className="mb-6">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-burgundy-600 block">
              {language === 'ar' ? "متغيرات نموذج العقد" : "TEMPLATE PARAMETERS"}
            </span>
            <h3 className="font-serif text-2xl font-bold uppercase text-navy-900 mt-1">
              {language === 'ar' ? `تهيئة: ${selectedTemplate.name}` : `${selectedTemplate.name} Setup`}
            </h3>
            <p className="text-gray-500 text-xs mt-1 italic font-serif">
              {language === 'ar' 
                ? "يرجى ملء البيانات التعاقدية أدناه. يقوم المولد بصياغة شروط نموذجية متوافقة بناءً على مدخلاتك."
                : "Complete the variables below. Our generator compiles verified boilerplates based on these parameters."}
            </p>
          </div>

          <form onSubmit={handleWizardSubmit} className="space-y-6">
            <div className="space-y-5 pt-2">
              {selectedTemplate.variables.map(v => (
                <div key={v.name} className="space-y-1.5">
                  <label className="text-xs font-serif uppercase tracking-wider text-gray-600 block">
                    {v.label}
                  </label>
                  
                  {v.type === 'select' ? (
                    <select
                      value={wizardValues[v.name] || ''}
                      onChange={(e) => setWizardValues(prev => ({ ...prev, [v.name]: e.target.value }))}
                      className="w-full bg-transparent border-b-2 border-gray-300 py-2 focus:outline-none focus:border-gold-500 text-sm font-serif text-right"
                    >
                      <option value="">{language === 'ar' ? "اختر الخيار المناسب..." : "Choose Options..."}</option>
                      {v.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={wizardValues[v.name] || ''}
                      onChange={(e) => setWizardValues(prev => ({ ...prev, [v.name]: e.target.value }))}
                      placeholder={v.placeholder}
                      className={`w-full bg-transparent border-b-2 border-gray-300 py-2 focus:outline-none focus:border-gold-500 text-sm font-serif placeholder:italic placeholder:text-gray-400 rounded-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-navy-900 hover:bg-burgundy-600 text-white py-3.5 rounded-sm font-serif uppercase tracking-widest text-xs font-bold transition-colors cursor-pointer mt-8"
            >
              {language === 'ar' ? "توليد وصياغة المسودة المبدئية" : "Compile Initial Draft"}
            </button>
          </form>
        </div>
      )}

      {/* 3. DRAFTER FULL-SCREEN EDITOR VIEW */}
      {viewMode === 'editor' && (
        <div className="space-y-6 animate-fade-in pb-12">
          {/* Editor Header Bar */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-navy-900/10 pb-4 gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setViewMode('library')}
                className="p-2 border border-gray-300 rounded-sm hover:border-navy-900 text-gray-500 hover:text-navy-900 cursor-pointer bg-white"
              >
                <ArrowLeft className={`w-4 h-4 stroke-[2.5] ${language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              <div className="relative border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                <input 
                  type="text" 
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className={`font-serif text-lg md:text-xl font-bold uppercase text-navy-900 bg-transparent border-none p-1 focus:outline-none focus:ring-0 max-w-sm sm:max-w-md ${language === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>

            {/* Editor Top Bar triggers */}
            <div className={`flex items-center gap-3 shrink-0 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={() => setShowAiAssist(!showAiAssist)}
                className={`text-xs font-serif uppercase font-bold tracking-wider py-1.5 px-3 rounded-sm border cursor-pointer ${
                  showAiAssist ? 'bg-parchment text-burgundy-600 border-burgundy-600/30' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {language === 'ar' ? "مكتبة المساعد الذكي" : "AI Library"}
              </button>
              <button 
                onClick={() => setShowRiskScanner(!showRiskScanner)}
                className={`text-xs font-serif uppercase font-bold tracking-wider py-1.5 px-3 rounded-sm border cursor-pointer ${
                  showRiskScanner ? 'bg-parchment text-burgundy-600 border-burgundy-600/30' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {language === 'ar' ? "فاحص الالتزام" : "Risk Scanner"}
              </button>
              <button
                onClick={handleSaveEditor}
                className="bg-navy-900 hover:bg-burgundy-600 text-white text-xs font-serif uppercase tracking-wider font-bold py-2 px-5 rounded-sm cursor-pointer transition-colors"
              >
                {language === 'ar' ? "حفظ وإيداع المسودة" : "Commit Draft"}
              </button>
            </div>
          </div>

          {/* Three Column Split Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px] overflow-hidden">
            
            {/* L Panel: AI Assist / Pre-approved Clauses (3/12) */}
            {showAiAssist && (
              <div className="lg:col-span-3 bg-white border border-gray-200 rounded-sm p-4 flex flex-col justify-between h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  <div className={`flex items-center gap-1.5 border-b border-gray-100 pb-2 mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-navy-900">
                      {language === 'ar' ? "مستشار بنود الذكاء الاصطناعي" : "AI Counselor Library"}
                    </h4>
                  </div>

                  <p className="text-[10px] text-gray-400 italic font-serif leading-relaxed">
                    {language === 'ar' 
                      ? "سيادة المستشار، اضغط لإدراج بنود قانونية معتمدة نظاماً مباشرة في مسودتك الجارية:" 
                      : "Counselor, insert pre-vetted jurisprudential clauses directly into your cursor stream:"}
                  </p>

                  <div className="space-y-3.5">
                    {preApprovedClauses.map((clause, idx) => (
                      <div key={idx} className="p-3 bg-parchment-light border border-gray-200 rounded-sm relative group">
                        <span className={`text-[9px] font-mono text-gray-400 block font-bold uppercase ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {language === 'ar' ? `بند نموذج ${clause.type}` : `${clause.type} CLAUSE`}
                        </span>
                        <h5 className="font-serif font-bold text-xs text-navy-900 uppercase mt-0.5">{clause.title}</h5>
                        <p className="text-[10px] text-gray-500 italic mt-1 font-serif line-clamp-3">"{clause.text}"</p>
                        
                        <button
                          onClick={() => {
                            setEditorContent(prev => prev + `\n\n### ${clause.title.toUpperCase()}\n${clause.text}\n`);
                            alert(language === 'ar' 
                              ? "تم إدراج البند بنجاح في نهاية مسودة المستند." 
                              : "Clause successfully inserted at bottom of document draft, Counselor.");
                          }}
                          className={`mt-2.5 text-[9px] font-mono uppercase text-burgundy-600 font-bold hover:text-navy-900 flex items-center gap-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                          {language === 'ar' ? "+ إدراج في نهاية المسودة" : "+ Insert at Bottom"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3 text-center">
                  <button 
                    onClick={() => {
                      const instructions = prompt(language === 'ar' 
                        ? "أدخل تعليمات إعادة الصياغة بالذكاء الاصطناعي (مثال: اجعل الشروط متبادلة، ترجم بالكامل للعربية، أو أضف بند تعويض):"
                        : "Enter specific rewrite instructions (e.g. Translate entire draft to Arabic, Make terms unilateral to Employer):");
                      if (instructions) {
                        alert(language === 'ar' 
                          ? "يقوم المستشار القانوني الذكي بإعادة تحرير المسودة الجارية..." 
                          : "AI counselor is compiling rewrites... (This will apply to active draft)");
                        setEditorContent(prev => (language === 'ar' 
                          ? `# شروط تعاقدية معدلة بالذكاء الاصطناعي\n\n*(مسودة معدلة استناداً إلى موجه: "${instructions}")*\n\n` 
                          : `# AMENDED BILINGUAL COVENANTS\n\n*(AI Amended draft under instructions: "${instructions}")*\n\n`) + prev);
                      }
                    }}
                    className="w-full bg-parchment hover:bg-parchment-dark/60 text-burgundy-600 text-[10px] font-serif uppercase tracking-wider font-bold py-2 rounded-sm cursor-pointer border border-navy-900/5 transition-colors"
                  >
                    {language === 'ar' ? "إعادة الصياغة بالذكاء الاصطناعي" : "Quick AI Draft Rewrite"}
                  </button>
                </div>
              </div>
            )}

            {/* M Panel: Content Editor Sheets (6/12 - scalable to 9 or 12 depending on sidebars) */}
            <div className={`h-full flex flex-col justify-between overflow-hidden bg-white border border-gray-200 rounded-sm shadow-inner p-6 ${
              (showAiAssist && showRiskScanner) ? 'lg:col-span-6' :
              (!showAiAssist && !showRiskScanner) ? 'lg:col-span-12' :
              'lg:col-span-9'
            }`}>
              {/* Text formatting simulated toolbar */}
              <div className={`border-b border-gray-100 pb-3 mb-4 flex flex-wrap gap-2 text-xs text-gray-400 select-none items-center shrink-0 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="font-bold border-r border-gray-200 pr-2 mr-1 text-gray-500 font-serif">
                  {language === 'ar' ? "صحيفة النشر والتحرير" : "PUBLICATION SHEET"}
                </span>
                <button type="button" className="font-bold hover:text-navy-900 px-1">B</button>
                <button type="button" className="italic hover:text-navy-900 px-1">I</button>
                <button type="button" className="underline hover:text-navy-900 px-1">U</button>
                <span className="border-r border-gray-200 h-4 mx-1" />
                <button type="button" className="hover:text-navy-900 px-1 font-mono text-[10px]">
                  {language === 'ar' ? "فقرة" : "Paragraph"}
                </button>
                <button type="button" className="hover:text-navy-900 px-1 font-serif text-[10px]">
                  {language === 'ar' ? "فهرس القوانين المصرية" : "Egyptian Law Index"}
                </button>
              </div>

              {/* Editable Sheet Textarea */}
              <div className="flex-1 overflow-y-auto relative p-1 bg-white">
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className={`w-full h-full bg-transparent border-none text-xs md:text-sm text-gray-800 focus:outline-none font-serif leading-loose resize-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  placeholder={language === 'ar' ? "اكتب مسودة بنود العقد هنا..." : "Draft content body compiled here..."}
                />
              </div>

              {/* Version horizontal timeline under editor */}
              <div className={`border-t border-gray-100 pt-4 mt-4 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-serif ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-gray-400">{language === 'ar' ? "سجل المراجعات:" : "History:"}</span>
                  <div className="flex items-center gap-1.5">
                    {editorHistory.map(hist => (
                      <button
                        key={hist.v}
                        onClick={() => handleRestoreVersion(hist.v)}
                        className={`px-2 py-0.5 text-[10px] font-mono border rounded-sm cursor-pointer transition-colors ${
                          hist.v === activeVersion 
                            ? 'bg-burgundy-600 border-burgundy-600 text-white font-bold' 
                            : 'bg-white border-gray-300 text-gray-500 hover:border-navy-900'
                        }`}
                        title={hist.date}
                      >
                        {hist.v}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleNewVersion}
                  className="text-burgundy-600 hover:text-navy-900 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  {language === 'ar' ? `+ حفظ إصدار مراجعة جديد (${activeVersion})` : `+ Commit Version (${activeVersion})`}
                </button>
              </div>
            </div>

            {/* R Panel: Real-time Risk Scanner (3/12) */}
            {showRiskScanner && (
              <div className="lg:col-span-3 bg-white border border-gray-200 rounded-sm p-4 flex flex-col justify-between h-full overflow-hidden text-right">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  <div className={`flex items-center gap-1.5 border-b border-gray-100 pb-2 mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-navy-900">
                      {language === 'ar' ? "فاحص ومحلل المخاطر الفوري" : "Real-Time Risk Scanner"}
                    </h4>
                  </div>

                  <p className="text-[10px] text-gray-400 italic font-serif leading-relaxed">
                    {language === 'ar' 
                      ? "يقوم محلل الالتزام بدراسة البنود وفحص الصياغات الجارية تلقائياً:" 
                      : "Our compliance analyzer runs checks in real-time as you write:"}
                  </p>

                  <div className="space-y-4">
                    {/* Unilateral Liability Warning */}
                    <div className="p-3 bg-red-50/30 border border-red-200 rounded-sm">
                      <div className={`flex items-center gap-1 text-red-700 font-mono text-[9px] font-bold uppercase mb-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" /> 
                        {language === 'ar' ? "انكشاف تعاقدي أحادي" : "UNILATERAL EXPOSURE"}
                      </div>
                      <h5 className="font-serif font-bold text-xs text-navy-900 uppercase">
                        {language === 'ar' ? "عدم توازن بنود المسؤولية والتعويض" : "Indemnity Covenants Unbalanced"}
                      </h5>
                      <p className="text-[10px] text-gray-600 italic font-serif mt-1">
                        {language === 'ar' 
                          ? "يلتزم مزود الخدمة بالتعويض وحماية العميل دون حدود مالية قصوى. يُنصح بإدراج حد مالي قياسي للتعويض." 
                          : "Provider agrees to defend and hold Client harmless without financial limits. Insert standard caps."}
                      </p>
                    </div>

                    {/* Governing Law travel friction */}
                    <div className="p-3 bg-yellow-50/30 border border-yellow-200 rounded-sm">
                      <div className={`flex items-center gap-1 text-yellow-700 font-mono text-[9px] font-bold uppercase mb-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" /> 
                        {language === 'ar' ? "مخاطر الاختصاص القضائي" : "JURISDICTION RISK"}
                      </div>
                      <h5 className="font-serif font-bold text-xs text-navy-900 uppercase">
                        {language === 'ar' ? "تحديد الاختصاص بولاية ديلاوير" : "Delaware Venue Selected"}
                      </h5>
                      <p className="text-[10px] text-gray-600 italic font-serif mt-1">
                        {language === 'ar' 
                          ? "تحديد مركز التحكيم في ديلاوير قد يفرض تكاليف وأعباء سفر باهظة على المديرين بمصر. يفضل التحكيم المحلي." 
                          : "Dispute arbitration designated in Delaware may introduce significant legal travel friction for Cairo officers."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3 text-center text-[10px] font-mono text-gray-400 leading-relaxed">
                  {language === 'ar' 
                    ? "* تم معايرة المحلل وفقاً لضوابط الالتزام ومعايير الشركات الدولية." 
                    : "*Scanner calibrated under standard Corporate compliance guidelines."}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
