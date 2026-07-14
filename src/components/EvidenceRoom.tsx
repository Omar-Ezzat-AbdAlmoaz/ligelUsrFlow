import React, { useState } from 'react';
import { 
  FileText, Upload, Folder, Grid, List, Search, ChevronDown, 
  ChevronRight, ArrowLeft, Download, Share2, Sparkles, AlertCircle, 
  Calendar, Users, Shield, Check, X, AlertTriangle, Eye 
} from 'lucide-react';
import { LegalDocument, ExtractedClause, RiskFactor, ObligationMilestone, DocumentParty } from '../types';
import { translations, Language } from '../lib/translations';

interface EvidenceRoomProps {
  documents: LegalDocument[];
  onUploadDocument: (file: { name: string; size: string; content: string; type: string }) => Promise<void>;
  onTriggerAnalysis: (docId: string) => Promise<void>;
  activeAnalyzedDoc: LegalDocument | null;
  onSetActiveAnalyzedDoc: (doc: LegalDocument | null) => void;
  language?: Language;
}

export default function EvidenceRoom({
  documents, onUploadDocument, onTriggerAnalysis, activeAnalyzedDoc, onSetActiveAnalyzedDoc, language = 'en'
}: EvidenceRoomProps) {
  
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingName, setUploadingName] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'clauses' | 'risks' | 'timeline' | 'parties'>('summary');
  const [viewerHighlightTooltip, setViewerHighlightTooltip] = useState<string | null>(null);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);

  const t = translations[language];

  // File Upload Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setUploadingName(file.name);
    setUploadProgress(10);
    
    // Simulate uploading milestones
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 10;
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 200);

    // Read the text content of the file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string || "This agreement governs the terms and covenants of collaboration between the signed stakeholders.";
      
      const typeStr = file.name.endsWith('.docx') ? 'Employment' : file.name.includes('NDA') ? 'NDA' : 'Service Agreement';
      
      await onUploadDocument({
         name: file.name,
         size: (file.size / 1024).toFixed(1) + ' KB',
         content,
         type: typeStr
      });
      
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(null);
        setUploadingName('');
      }, 500);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Triggering the real Gemini REST Analysis
  const handleAnalyze = async (docId: string) => {
    setAnalyzingDocId(docId);
    try {
      await onTriggerAnalysis(docId);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingDocId(null);
    }
  };

  // Cover folder colors representing case files
  const folderColors = [
    'bg-burgundy-600/10 border-t-burgundy-600 text-burgundy-600',
    'bg-navy-900/10 border-t-navy-900 text-navy-900',
    'bg-gold-500/10 border-t-gold-500 text-gold-500',
    'bg-teal-700/10 border-t-teal-700 text-teal-700'
  ];

  // Filtering Documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* C. SPLIT SCREEN ANALYSIS VIEW */}
      {activeAnalyzedDoc ? (
        <div className="space-y-6">
          {/* Audit Navigation Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-navy-900/10 pb-5 gap-4">
            <div className="flex items-center gap-3">
              <button 
                id="btn-evidence-back"
                onClick={() => {
                  onSetActiveAnalyzedDoc(null);
                  setViewerHighlightTooltip(null);
                }}
                className="p-2 border border-gray-300 rounded-sm hover:border-navy-900 text-gray-500 hover:text-navy-900 cursor-pointer bg-white"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-burgundy-600 text-white px-2 py-0.5 rounded-sm font-bold uppercase">
                    {language === 'ar' ? "مستند تم تدقيقه" : "AUDITED INSTRUMENT"}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">ID: {activeAnalyzedDoc.id.toUpperCase()}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold uppercase text-navy-900 mt-1">
                  {activeAnalyzedDoc.name}
                </h2>
              </div>
            </div>

            {/* Audit Toolbar */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => alert(language === 'ar' ? "تم إرسال تقرير التدقيق بنجاح للمجلدات السحابية المتصلة بمحاماة المستشار." : "Chambers audit dispatches transmitted to connected cloud folders.")}
                className="flex items-center gap-1 bg-white border border-gray-300 hover:border-navy-900 text-xs text-gray-600 hover:text-navy-900 font-serif uppercase tracking-wider font-bold py-2 px-4 rounded-sm cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-burgundy-600" /> {language === 'ar' ? "مشاركة التدقيق" : "Share Audit"}
              </button>
              <button 
                onClick={() => alert(language === 'ar' ? "جاري تحميل تقرير المطابقة والمخاطر الفقهية المعتمد للطباعة..." : "Downloading publication-grade compliance report...")}
                className="flex items-center gap-1 bg-navy-900 hover:bg-burgundy-600 text-white text-xs font-serif uppercase tracking-wider font-bold py-2 px-4 rounded-sm cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> {language === 'ar' ? "تحميل التقرير المعتمد" : "Download Report"}
              </button>
            </div>
          </div>

          {/* Split Screen Panel Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px] overflow-hidden">
            
            {/* L: Original Document Viewer */}
            <div className="lg:col-span-6 bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
              <div className="bg-parchment-light border-b border-gray-100 py-3 px-5 flex justify-between items-center text-xs shrink-0 font-serif">
                <span className="font-bold text-navy-900 uppercase">
                  {language === 'ar' ? "صحيفة المستند القانوني التفاعلية" : "Interactive Legal Instrument Sheet"}
                </span>
                <span className="text-[10px] font-mono text-gray-400">{language === 'ar' ? "علامة مائية مخصصة" : "ACTIVE WATERMARK"}</span>
              </div>

              {/* Text content with artificial glowing highlights */}
              <div className="flex-1 overflow-y-auto p-6 bg-parchment relative font-serif text-sm leading-relaxed text-gray-800 space-y-4 text-right">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none paper-grain select-none" />
                
                <h3 className="font-bold text-center text-navy-900 uppercase border-b border-gray-200 pb-3 mb-6">
                  {activeAnalyzedDoc.name.toUpperCase()}
                </h3>

                <p>
                  {language === 'ar' 
                    ? `إنه في يوم ${activeAnalyzedDoc.dateUploaded}، تم تحرير هذا الاتفاق بين الأطراف المذكورين في البند الأول أدناه.`
                    : `THIS AGREEMENT made and entered into this ${activeAnalyzedDoc.dateUploaded}, by and between the parties referenced under Section 1 below.`}
                </p>

                <p>
                  {language === 'ar'
                    ? "تمهيد: حيث يرغب الأطراف في تبادل المعلومات والملفات الفنية لغايات إتمام الاندماج المؤسسي المقترح، خاضعاً للقوانين واللوائح المحلية السارية."
                    : "WHEREAS, the parties wish to exchange certain materials to proceed with corporate integration subject to strict compliance under local statutes."}
                </p>

                <h4 className="font-bold text-navy-900 mt-6 uppercase text-xs">
                  {language === 'ar' ? "البند ١: الموقعون الرئيسيون" : "Section 1. Core Signatories"}
                </h4>
                <p>
                  {language === 'ar'
                    ? 'يُشار إلى الموقعين بصفتهما شركة Apex Technologies Group Inc. ("العميل") وشركة Counselor Solutions LLC ("المزود"). كل طرف يلتزم بنصوص هذا الاتفاق.'
                    : 'The signatories are identified as Apex Technologies Group Inc. ("Client") and Counselor Solutions LLC ("Provider"). All reciprocal covenants bind successors.'}
                </p>

                <h4 className="font-bold text-navy-900 mt-6 uppercase text-xs">
                  {language === 'ar' ? "البند ٢: ضمانات عدم الإفصاح والسرية" : "Section 2. Non-Disclosure Safeguards"}
                </h4>
                <p>
                  {language === 'ar' ? "يتعهد كل طرف بحماية الملفات السرية والمواد المملوكة." : "Each party shall protect proprietary files."} <span 
                    onClick={() => setViewerHighlightTooltip('cl-1')}
                    className="bg-yellow-100 border-b-2 border-yellow-500 cursor-pointer font-medium hover:bg-yellow-200 transition-colors py-0.5 px-1 rounded-sm"
                  >
                    {language === 'ar'
                      ? "الالتزام بالسرية المطلقة لجميع المعلومات الفنية والمالية والتجارية الحساسة لمدة خمس (٥) سنوات."
                      : "Hold in strict confidence all proprietary technical, financial, and business information for a period of five (5) years."}
                  </span> {language === 'ar' ? "وتخضع الأسرار التجارية لحظر إفصاح دائم دون سقف زمني." : "All trade secrets undergo indefinite holds."}
                </p>

                <h4 className="font-bold text-navy-900 mt-6 uppercase text-xs">
                  {language === 'ar' ? "البند ٣: التنازل عن الملكية الفكرية وعقود العمل" : "Section 3. Work Made For Hire Assignment"}
                </h4>
                <p>
                  <span 
                    onClick={() => setViewerHighlightTooltip('cl-2')}
                    className="bg-green-100 border-b-2 border-green-500 cursor-pointer font-medium hover:bg-green-200 transition-colors py-0.5 px-1 rounded-sm"
                  >
                    {language === 'ar'
                      ? "جميع مخرجات العمل الفكرية، براءات الاختراع، الكود المصدري، والنتائج المطورة بموجب هذا العقد تعود ملكيتها الحصرية والكاملة للعميل."
                      : "All intellectual work products, patents, source code, and deliverables developed under this contract shall belong exclusively to the Client."}
                  </span>
                </p>

                <h4 className="font-bold text-navy-900 mt-6 uppercase text-xs">
                  {language === 'ar' ? "البند ٨: قنوات تسوية النزاعات والقوانين" : "Section 8. Dispute Channels"}
                </h4>
                <p>
                  <span 
                    onClick={() => setViewerHighlightTooltip('cl-3')}
                    className="bg-yellow-100 border-b-2 border-yellow-500 cursor-pointer font-medium hover:bg-yellow-200 transition-colors py-0.5 px-1 rounded-sm"
                  >
                    {language === 'ar'
                      ? "يخضع هذا الاتفاق ويفسر وفقاً لقوانين ولاية ديلاوير بالولايات المتحدة الأمريكية، وتكون لمحاكم ويلمنغتون الاختصاص القضائي الحصري."
                      : "This agreement shall be governed by Delaware state law. Wilmington courts hold exclusive forum."}
                  </span>
                </p>

                <h4 className="font-bold text-navy-900 mt-6 uppercase text-xs">
                  {language === 'ar' ? "البند ٩: التزامات التعويض وسقوف المسؤولية" : "Section 9. Indemnification Obligations"}
                </h4>
                <p>
                  <span 
                    onClick={() => setViewerHighlightTooltip('cl-4')}
                    className="bg-red-100 border-b-2 border-red-400 cursor-pointer font-medium hover:bg-red-200 transition-colors py-0.5 px-1 rounded-sm"
                  >
                    {language === 'ar'
                      ? "يوافق مزود الخدمة على الدفاع عن العميل وتعويضه وإبرائه من أي مطالبات مقدمة من أطراف ثالثة دون أي حدود أقصى للمسؤولية القانونية."
                      : "The Provider agrees to defend, indemnify, and hold harmless the Client from any third-party claims without any liability caps."}
                  </span>
                </p>

                {/* Floating highlight tooltip details */}
                {viewerHighlightTooltip && (
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white border border-navy-900 rounded-sm shadow-2xl animate-slide-up text-right">
                    <button 
                      onClick={() => setViewerHighlightTooltip(null)}
                      className="absolute top-2 left-2 text-gray-400 hover:text-navy-900 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-burgundy-600 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" /> {language === 'ar' ? "تصنيف المطابقة القانونية الإدراكية" : "COGNITIVE COMPLIANCE CLASSIFICATION"}
                    </div>
                    <p className="text-xs text-gray-700 font-serif italic mt-1 leading-relaxed">
                      {viewerHighlightTooltip === 'cl-1' && (language === 'ar' ? 'يحتوي البند ٢ على قيود السرية. تم تصنيفه كنموذج معياري ولكن يتطلب استثناءات هيكلية واضحة للأسرار التجارية.' : 'Section 2 contains Confidentiality restrictions. Graded as standard Boilerplate but requires indefinite carving out for trade structures.')}
                      {viewerHighlightTooltip === 'cl-2' && (language === 'ar' ? 'يحدد البند ٣ براءات الاختراع والملكية الفكرية. تم تأكيده كـ "عمل لصالح الغير" بمعامل ثقة مطابقة ٩٨٪.' : 'Section 3 designates intellectual patents. Confirmed as "Work Made for Hire". Confidence parameter matches 98%.')}
                      {viewerHighlightTooltip === 'cl-3' && (language === 'ar' ? 'يؤدي البند ٨ إلى تفعيل ولاية ديلاوير القضائية لحل النزاعات، مما يشكل خطر السفر لمكاتب القاهرة.' : 'Section 8 triggers Delaware Governing jurisdiction. Outlines geographical travel exposure risk for Cairo offices.')}
                      {viewerHighlightTooltip === 'cl-4' && (language === 'ar' ? '⚠️ يؤدي البند ٩ إلى تفعيل مخاطر مسؤولية عالية للغاية لالتزام التعويض غير المحدود لصالح العميل. نقترح وضع حد أقصى للتعويضات.' : '⚠️ Section 9 triggers High Liability danger. Unlimited indemnification holds are unilaterally skewed toward the Client. Propose bilateral capping!')}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => {
                          setActiveTab(viewerHighlightTooltip === 'cl-4' ? 'risks' : 'clauses');
                          setViewerHighlightTooltip(null);
                        }}
                        className="text-[10px] font-serif uppercase tracking-wider font-bold text-burgundy-600 hover:text-navy-900 cursor-pointer"
                      >
                        {language === 'ar' ? "فحص لوحة التدقيق الإرشادية ←" : "Inspect Audit Panel →"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* R: Analysis Tab Panel */}
            <div className="lg:col-span-6 bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
              {/* Folder Style Tabs */}
              <div className="flex border-b border-gray-200 bg-parchment-light shrink-0 overflow-x-auto">
                {(['summary', 'clauses', 'risks', 'timeline', 'parties'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-5 font-serif text-xs uppercase tracking-wider font-bold border-r border-gray-200 cursor-pointer transition-all ${
                      activeTab === tab 
                        ? 'bg-white text-burgundy-600 border-b-2 border-b-burgundy-600 font-semibold' 
                        : 'text-gray-500 hover:text-navy-900'
                    }`}
                  >
                    {tab === 'summary' ? (language === 'ar' ? "الخلاصة" : "Summary") :
                     tab === 'clauses' ? (language === 'ar' ? "البنود" : "Clauses") :
                     tab === 'risks' ? (language === 'ar' ? "المخاطر" : "Risks") :
                     tab === 'timeline' ? (language === 'ar' ? "الجدول الزمني" : "Timeline") :
                     (language === 'ar' ? "الأطراف" : "Parties")}
                  </button>
                ))}
              </div>

              {/* Tab Contents Frame */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* 1. Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="space-y-4 animate-fade-in text-right">
                    <h4 className="font-serif font-bold text-lg text-navy-900 uppercase border-b border-gray-100 pb-2">
                      {language === 'ar' ? "الخلاصة المعرفية للتدقيق" : "Cognitive Audit Summary"}
                    </h4>
                    <p className="font-serif text-sm text-gray-700 leading-relaxed italic border-r-2 border-l-0 border-gold-500 pr-4 pl-0 bg-parchment/30 py-3">
                      {activeAnalyzedDoc.summary || (language === 'ar' ? "تم تحليل وفهرسة هذا المستند القانوني بالكامل. يرجى اختيار علامات التبويب المجاورة لاستكشاف البنود القانونية والمخاطر والجداول الزمنية للأداء." : "This document has been fully parsed and indexed. Select specific tabs above to explore identified clause structures, risks, chronology of obligations, and signatories.")}
                    </p>
                    
                    <div className="pt-4">
                      <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-burgundy-600 mb-2">
                        {language === 'ar' ? "المرئيات الاستشارية والتوصيات" : "Key Advisory Takeaways"}
                      </h5>
                      <ul className="space-y-3.5 text-right">
                        <li className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed justify-start flex-row-reverse">
                          <Check className="w-4 h-4 text-green-700 shrink-0 stroke-[2.5]" />
                          <span>
                            {language === 'ar' 
                              ? "تم مواءمة التزامات السرية وضماناتها مع حماية الأسرار التجارية والملفات الفنية بشكل محكم ودائم." 
                              : "Confidentiality Safeguards are properly mapped with indefinite protections for standard trade secret code blocks."}
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed justify-start flex-row-reverse">
                          <Check className="w-4 h-4 text-green-700 shrink-0 stroke-[2.5]" />
                          <span>
                            {language === 'ar' 
                              ? "يتطابق نقل ملكية حقوق الاختراع والبرمجيات المطورة بالكامل مع نصوص العمل لصالح الغير الفقهية والمحلية." 
                              : "Intellectual Property Assignment perfectly adheres to standard 'Work Made for Hire' statutory guidelines."}
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed justify-start flex-row-reverse">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 stroke-[2.5]" />
                          <span className="font-semibold text-navy-900">
                            {language === 'ar' 
                              ? "مؤشر خطر مرتفع: يخلو البند ٩ من أي حدود قصوى للمسؤولية القانونية والتعويضات المفروضة على مزود الخدمة. ننصح بوضع حد أقصى للتعويض." 
                              : "High Risk Factor: Provider exposure lacks bilateral liability limits. Section 9 contains unlimited liability clauses."}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. Clauses Tab */}
                {activeTab === 'clauses' && (
                  <div className="space-y-4 animate-fade-in text-right">
                    <h4 className="font-serif font-bold text-lg text-navy-900 uppercase border-b border-gray-100 pb-2 mb-4">
                      {language === 'ar' ? `البنود والفقرات المستخلصة (${activeAnalyzedDoc.clauses?.length || 0})` : `Identified Clauses (${activeAnalyzedDoc.clauses?.length || 0})`}
                    </h4>

                    {activeAnalyzedDoc.clauses && activeAnalyzedDoc.clauses.length > 0 ? (
                      <div className="space-y-4">
                        {activeAnalyzedDoc.clauses.map(cl => (
                          <div key={cl.id} className="border border-gray-200 p-4 rounded-sm bg-parchment-light hover:border-gold-500 transition-colors relative group text-right">
                            <span className="absolute top-2 left-2 text-[10px] font-mono text-gray-400 uppercase font-semibold">
                              {cl.type === 'Confidentiality' && language === 'ar' ? "سرية عدم إفصاح" :
                               cl.type === 'IP Assignment' && language === 'ar' ? "حقوق الملكية الفكرية" :
                               cl.type === 'Governing Law' && language === 'ar' ? "القانون الحاكم" :
                               cl.type === 'Indemnification' && language === 'ar' ? "التزام التعويض" : cl.type}
                            </span>
                            <h5 className="font-serif font-bold text-xs md:text-sm text-navy-900 uppercase tracking-tight mt-4">
                              {cl.title}
                            </h5>
                            <p className="text-xs text-gray-600 italic font-serif mt-2 leading-relaxed border-r border-l-0 border-gray-300 pr-2 pl-0">
                              "{cl.text}"
                            </p>
                            <div className="mt-3 flex items-center gap-2 flex-row-reverse justify-end">
                              <span className="text-[10px] font-mono text-gray-400">{language === 'ar' ? "نسبة ثقة المطابقة الإدراكية:" : "Match Confidence:"}</span>
                              <div className="flex-1 max-w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gold-500" style={{ width: `${cl.confidence}%` }} />
                              </div>
                              <span className="text-[10px] font-mono font-bold text-gold-500">{cl.confidence}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-gray-500 italic">{language === 'ar' ? "لم يتم فحص البنود بعد. يرجى تشغيل محرك التدقيق الذكي." : "No clauses parsed. Please trigger AI analysis."}</div>
                    )}
                  </div>
                )}

                {/* 3. Risks Tab */}
                {activeTab === 'risks' && (
                  <div className="space-y-4 animate-fade-in text-right">
                    <h4 className="font-serif font-bold text-lg text-navy-900 uppercase border-b border-gray-100 pb-2 mb-4">
                      {language === 'ar' ? "درجات تدقيق المخاطر والتعديلات" : "Risk Audit Grads"}
                    </h4>

                    {activeAnalyzedDoc.risks && activeAnalyzedDoc.risks.length > 0 ? (
                      <div className="space-y-4">
                        {activeAnalyzedDoc.risks.map(rk => (
                          <div 
                            key={rk.id} 
                            className={`border p-4 rounded-sm relative shadow-sm text-right ${
                              rk.level === 'high' ? 'border-red-200 bg-red-50/20' :
                              rk.level === 'medium' ? 'border-yellow-200 bg-yellow-50/20' :
                              'border-green-200 bg-green-50/20'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2 flex-row-reverse">
                              <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                                rk.level === 'high' ? 'bg-red-100 text-red-700' :
                                rk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {rk.level === 'high' && language === 'ar' ? "تعرض مرتفع للغاية" :
                                 rk.level === 'medium' && language === 'ar' ? "تعرض متوسط" :
                                 rk.level === 'low' && language === 'ar' ? "تعرض منخفض" : `${rk.level.toUpperCase()} EXPOSURE`}
                              </span>
                            </div>
                            <h5 className="font-serif font-bold text-xs text-navy-900 uppercase tracking-tight">
                              {rk.description}
                            </h5>
                            <p className="text-xs text-gray-600 font-serif mt-2 leading-relaxed italic border-r-2 border-l-0 border-r-burgundy-600 pr-2 pl-0">
                              <span className="font-bold text-navy-900 font-mono text-[10px] uppercase block not-italic">
                                {language === 'ar' ? "الصياغة البديلة والتوصية المقترحة:" : "RECOMMENDED AMENDMENT:"}
                              </span>
                              "{rk.suggestion}"
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-gray-500 italic">{language === 'ar' ? "لم يتم الكشف عن مخاطر عالية. المستند خالٍ من بنود المسؤولية المطلقة الجسيمة." : "No risks flagged. Document is cleared of absolute liabilities."}</div>
                    )}
                  </div>
                )}

                {/* 4. Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4 animate-fade-in text-right">
                    <h4 className="font-serif font-bold text-lg text-navy-900 uppercase border-b border-gray-100 pb-2 mb-6">
                      {language === 'ar' ? "الجدول الزمني لالتزامات الأداء" : "Chronological Timeline of Performance"}
                    </h4>

                    {activeAnalyzedDoc.timeline && activeAnalyzedDoc.timeline.length > 0 ? (
                      <div className="relative border-r-2 border-l-0 border-parchment-dark pr-6 pl-0 mr-3 ml-0 space-y-6">
                        {activeAnalyzedDoc.timeline.map(item => (
                          <div key={item.id} className="relative group text-right">
                            <span className="absolute -right-[31px] -left-auto top-1 w-3 h-3 rounded-full bg-navy-900 border border-white" />
                            <div className="flex justify-between items-center text-[10px] font-mono text-burgundy-600 font-bold uppercase flex-row-reverse">
                              <span>{item.date}</span>
                              <span className="text-gray-400">{language === 'ar' ? `الطرف المسؤول: ${item.party}` : `Responsible: ${item.party}`}</span>
                            </div>
                            <h5 className="font-serif font-bold text-xs text-navy-900 uppercase tracking-tight mt-0.5">{item.description}</h5>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-gray-500 italic">{language === 'ar' ? "لم يتم تحديد جداول التزامات زمنية." : "No obligations timelines parsed."}</div>
                    )}
                  </div>
                )}

                {/* 5. Parties Tab */}
                {activeTab === 'parties' && (
                  <div className="space-y-4 animate-fade-in text-right">
                    <h4 className="font-serif font-bold text-lg text-navy-900 uppercase border-b border-gray-100 pb-2 mb-4">
                      {language === 'ar' ? "الموقعون وأطراف العقد المفهرسة" : "Core Contract Signatories"}
                    </h4>

                    {activeAnalyzedDoc.parties && activeAnalyzedDoc.parties.length > 0 ? (
                      <div className="space-y-4">
                        {activeAnalyzedDoc.parties.map(party => (
                          <div key={party.id} className="border border-gray-200 p-4 rounded-sm bg-parchment-light text-right">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3 flex-row-reverse">
                              <h5 className="font-serif font-bold text-sm text-navy-900 uppercase">{party.name}</h5>
                              <span className="text-[10px] font-mono bg-navy-900 text-white px-2 py-0.5 rounded-sm font-bold">{party.role.toUpperCase()}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-right">
                              <div>
                                <span className="font-mono text-[9px] uppercase text-gray-400 font-bold block">{language === 'ar' ? "الحقوق والضمانات المقررة" : "Assigned Rights"}</span>
                                <p className="font-serif italic text-gray-600 mt-1 leading-relaxed">"{party.rights}"</p>
                              </div>
                              <div>
                                <span className="font-mono text-[9px] uppercase text-gray-400 font-bold block">{language === 'ar' ? "الالتزامات والتعهدات المكلف بها" : "Assigned Obligations"}</span>
                                <p className="font-serif italic text-gray-600 mt-1 leading-relaxed">"{party.obligations}"</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-gray-500 italic">{language === 'ar' ? "لم يتم تحديد أطراف أو موقعين مفهرسين." : "No designated parties parsed."}</div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      ) : (
        /* D. LIBRARY & UPLOAD WORKSPACE */
        <div className="space-y-8">
          
          {/* Section title */}
          <div className="text-right">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-burgundy-600 block">
              {language === 'ar' ? "ديوان الأدلة والمستندات الرقمية" : "COGNITIVE EVIDENCE ROOM"}
            </span>
            <h2 className="font-serif text-3xl font-bold uppercase text-navy-900 mt-1">
              {t.evidence.title}
            </h2>
            <p className="text-gray-500 font-serif italic text-sm mt-1">
              {t.evidence.subtitle}
            </p>
          </div>

          {/* Secure Upload Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-sm p-8 text-center transition-all duration-150 relative overflow-hidden paper-grain ${
              isDragging ? 'border-burgundy-600 bg-burgundy-600/5' : 'border-gray-300 bg-white'
            }`}
          >
            <input 
              type="file" 
              id="file-selector"
              onChange={handleFileSelect}
              accept=".txt,.pdf,.docx"
              className="hidden" 
            />
            
            {uploadProgress !== null ? (
              /* Loading gold line progress */
              <div className="max-w-xs mx-auto py-4">
                <FileText className="w-8 h-8 text-gold-500 animate-bounce mx-auto mb-3" />
                <h4 className="font-serif font-bold text-sm text-navy-900 uppercase">
                  {language === 'ar' ? `جاري الفهرسة والتحليل الهيكلي لـ: ${uploadingName}` : `Parsing and indexing: ${uploadingName}`}
                </h4>
                <div className="h-1 bg-gray-200 w-full mt-3 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase mt-2 block">
                  {uploadProgress}% {language === 'ar' ? "مكتمل" : "COMPLETE"}
                </span>
              </div>
            ) : (
              /* Standard prompt */
              <div className="py-6 flex flex-col items-center">
                <Upload className="w-10 h-10 text-gold-500 stroke-[1.5] mb-4" />
                <h4 className="font-serif font-bold text-base text-navy-900 uppercase">
                  {language === 'ar' ? "قم بإسقاط مستنداتك القانونية وصكوكك هنا، سيادة المستشار" : "Drop your legal instruments here, Counselor"}
                </h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-sm">
                  {language === 'ar'
                    ? "نقبل ملفات PDF و DOCX و TXT الآمنة. تخضع جميع البيانات لعمليات فحص إقليمية معزولة تماماً دون تدريب النماذج العامة."
                    : "We accept secure PDF, DOCX, and TXT files. All data undergoes isolated RAG vectorization without public models storage."}
                </p>
                <button 
                  onClick={() => document.getElementById('file-selector')?.click()}
                  className="mt-5 bg-navy-900 hover:bg-burgundy-600 text-white font-serif uppercase tracking-wider text-xs font-bold py-2 px-5 rounded-sm transition-colors cursor-pointer"
                >
                  {language === 'ar' ? "تحديد موقع الملف" : "Locate Brief file"}
                </button>
              </div>
            )}
          </div>

          {/* Library Filtering & Layout Toggles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 p-4 rounded-sm shadow-sm shrink-0 flex-row-reverse">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs border-b border-gray-300 focus-within:border-gold-500 transition-colors">
              <Search className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.evidence.searchPlaceholder}
                className="w-full pr-6 pl-2 py-2 bg-transparent text-xs focus:outline-none placeholder:italic placeholder:text-gray-400 text-right"
              />
            </div>

            {/* Type Filtering & List View toggles */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-row-reverse">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border border-gray-300 text-xs text-navy-900 rounded-sm py-1.5 px-3 focus:outline-none focus:border-gold-500 text-right"
              >
                <option value="ALL">{language === 'ar' ? "جميع الفئات القانونية" : "All Jurisdictions"}</option>
                <option value="NDA">{language === 'ar' ? "اتفاقيات السرية وعدم الإفصاح" : "Confidential NDAs"}</option>
                <option value="Employment">{language === 'ar' ? "عقود واتفاقيات العمل" : "Employment Agreements"}</option>
                <option value="Service Agreement">{language === 'ar' ? "اتفاقيات الخدمات والمشتريات" : "Service Agreements"}</option>
                <option value="Brief">{language === 'ar' ? "مذكرات القضايا المفهرسة" : "Indexed Briefs"}</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden shrink-0">
                <button 
                  onClick={() => setIsListView(false)}
                  className={`p-1.5 cursor-pointer ${!isListView ? 'bg-navy-900 text-white' : 'bg-white text-gray-400 hover:text-navy-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsListView(true)}
                  className={`p-1.5 cursor-pointer ${isListView ? 'bg-navy-900 text-white' : 'bg-white text-gray-400 hover:text-navy-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Library Contents Rendering */}
          {filteredDocs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-sm text-gray-500 italic text-sm font-serif">
              {language === 'ar' ? "لم يتم العثور على أي مراسلات أو ملفات متطابقة في أرشيفك النشط." : "No matching legal dispatches found in active library."}
            </div>
          ) : isListView ? (
            /* Classical Table view */
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden text-right">
              <table className="w-full text-right border-collapse text-xs md:text-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className="bg-navy-900 text-parchment uppercase font-serif text-[10px] tracking-wider font-bold">
                    <th className="py-3.5 px-4 text-right">{language === 'ar' ? "اسم المستند" : "Document Name"}</th>
                    <th className="py-3.5 px-4 text-right">{language === 'ar' ? "الفئة" : "Category"}</th>
                    <th className="py-3.5 px-4 text-right">{language === 'ar' ? "الحجم" : "Size"}</th>
                    <th className="py-3.5 px-4 text-right">{language === 'ar' ? "تاريخ الإيداع" : "Tender Date"}</th>
                    <th className="py-3.5 px-4 text-right">{language === 'ar' ? "الحالة" : "Status"}</th>
                    <th className="py-3.5 px-4 text-left">{language === 'ar' ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-serif">
                  {filteredDocs.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-parchment-light transition-colors">
                      <td className="py-3.5 px-4 font-bold text-navy-900 flex items-center gap-2 text-right">
                        <FileText className="w-4 h-4 text-burgundy-600 shrink-0" />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-right">
                        {doc.type === 'NDA' && language === 'ar' ? "اتفاقية سرية" :
                         doc.type === 'Employment' && language === 'ar' ? "عقد عمل" :
                         doc.type === 'Service Agreement' && language === 'ar' ? "اتفاقية خدمات" :
                         doc.type === 'Brief' && language === 'ar' ? "مذكرة قضية" : doc.type}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-gray-400 text-right">{doc.size}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-right">{doc.dateUploaded}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm font-bold uppercase ${
                          doc.status === 'Analysis Complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.status === 'Analysis Complete' 
                            ? (language === 'ar' ? "تم تدقيقه" : "AUDITED") 
                            : (language === 'ar' ? "قيد التدقيق" : "PENDING")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        {doc.status === 'Analysis Complete' ? (
                          <button 
                            id={`btn-audit-${doc.id}`}
                            onClick={() => onSetActiveAnalyzedDoc(doc)}
                            className="bg-navy-900 hover:bg-burgundy-600 text-white text-[10px] font-serif uppercase tracking-wider font-bold py-1.5 px-3 rounded-sm cursor-pointer transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> {language === 'ar' ? "تصفح التدقيق" : "Open Audit"}
                          </button>
                        ) : (
                          <button 
                            id={`btn-run-audit-${doc.id}`}
                            onClick={() => handleAnalyze(doc.id)}
                            disabled={analyzingDocId === doc.id}
                            className="bg-transparent border border-navy-900 hover:bg-navy-900 hover:text-white text-navy-900 disabled:bg-gray-100 disabled:text-gray-400 text-[10px] font-serif uppercase tracking-wider font-bold py-1.5 px-3 rounded-sm cursor-pointer transition-all inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-spin-slow" /> 
                            {analyzingDocId === doc.id ? (language === 'ar' ? "جاري التدقيق..." : "Analyzing...") : (language === 'ar' ? "بدء التدقيق" : "Run Audit")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Folder Grid view */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {filteredDocs.map((doc, idx) => {
                const folderStyle = folderColors[idx % folderColors.length];
                const isAudited = doc.status === 'Analysis Complete';
                return (
                  <div 
                    key={doc.id}
                    className={`border border-gray-200 border-t-4 p-5 rounded-sm relative flex flex-col justify-between hover:shadow-md transition-all text-right ${
                      isAudited ? 'bg-white' : 'bg-parchment-light/50'
                    }`}
                  >
                    <div>
                      {/* Folder Top layout */}
                      <div className="flex justify-between items-start mb-3 flex-row-reverse">
                        <Folder className="w-8 h-8 text-navy-700 stroke-[1.2]" />
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm font-bold uppercase ${
                          isAudited ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {isAudited 
                            ? (language === 'ar' ? "تم تدقيقه" : "AUDITED") 
                            : (language === 'ar' ? "قيد التدقيق" : "PENDING")}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-navy-900 uppercase truncate">
                        {doc.name}
                      </h4>
                      
                      <div className="text-[10px] font-mono text-gray-400 uppercase mt-1">
                        {language === 'ar' ? "الفئة:" : "Category:"} {doc.type === 'NDA' && language === 'ar' ? "اتفاقية سرية" :
                         doc.type === 'Employment' && language === 'ar' ? "عقد عمل" :
                         doc.type === 'Service Agreement' && language === 'ar' ? "اتفاقية خدمات" :
                         doc.type === 'Brief' && language === 'ar' ? "مذكرة قضية" : doc.type} • {doc.size}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1 justify-end">
                        {doc.tags.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-parchment text-gray-500 px-1.5 py-0.5 border border-navy-900/5 rounded-sm italic font-serif">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-serif flex-row-reverse">
                      <span className="text-gray-400 italic">{doc.dateUploaded}</span>
                      
                      {isAudited ? (
                        <button 
                          id={`btn-audit-grid-${doc.id}`}
                          onClick={() => onSetActiveAnalyzedDoc(doc)}
                          className="text-burgundy-600 hover:text-navy-900 uppercase font-bold tracking-wider text-[11px] flex items-center gap-0.5 cursor-pointer flex-row-reverse"
                        >
                          {language === 'ar' ? "عرض التدقيق" : "Open Audit"} <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] rotate-180" />
                        </button>
                      ) : (
                        <button 
                          id={`btn-run-audit-grid-${doc.id}`}
                          onClick={() => handleAnalyze(doc.id)}
                          disabled={analyzingDocId === doc.id}
                          className="text-gold-500 hover:text-navy-900 disabled:text-gray-400 uppercase font-bold tracking-wider text-[11px] flex items-center gap-0.5 cursor-pointer flex-row-reverse"
                        >
                          {analyzingDocId === doc.id 
                            ? (language === 'ar' ? "جاري التدقيق..." : "Analyzing...") 
                            : (language === 'ar' ? "بدء التدقيق" : "Run Audit")} <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] rotate-180" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
