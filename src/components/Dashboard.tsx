import { useState } from 'react';
import { 
  FileText, Calendar, Clock, ArrowUpRight, Scale, ChevronRight, 
  BookOpen, Inbox, AlertCircle, Sparkles, AlertTriangle
} from 'lucide-react';
import { LegalDocument, User as UserType } from '../types';
import { translations, Language } from '../lib/translations';

interface DashboardProps {
  user: UserType;
  documents: LegalDocument[];
  onNavigate: (view: 'dashboard' | 'consultation' | 'evidence' | 'drafter' | 'gazette' | 'settings') => void;
  language?: Language;
}

export default function Dashboard({ 
  user, documents, onNavigate, language = 'en'
}: DashboardProps) {
  
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [showEmptyDesk, setShowEmptyDesk] = useState(false);

  const t = translations[language];

  // Stats computation
  const docsAnalyzedCount = documents.filter(d => d.status === 'Analysis Complete').length;
  const activeCasesCount = documents.length;
  
  // Custom Desk-style dates
  const todayEnglish = "Monday, July 13, 2026";
  const todayArabic = "الاثنين، ١٣ يوليو ٢٠٢٦";

  const stats = [
    { 
      label: t.dashboard.stat1Title, 
      value: docsAnalyzedCount, 
      change: language === 'ar' ? "+١٤٪ مقارنة بالشهر السابق" : "+14% vs prior mo", 
      icon: <FileText className="w-5 h-5 text-burgundy-600 stroke-[2.5]" /> 
    },
    { 
      label: t.dashboard.stat2Title, 
      value: activeCasesCount, 
      change: language === 'ar' ? "+٢ تم تسجيلها اليوم" : "+2 registered today", 
      icon: <Scale className="w-5 h-5 text-burgundy-600 stroke-[2.5]" /> 
    },
    { 
      label: language === 'ar' ? "قوالب المسودات الجاهزة" : "Generated Drafts", 
      value: 8, 
      change: language === 'ar' ? "دقة صياغية غير قابلة للمساومة" : "Uncompromising precision", 
      icon: <BookOpen className="w-5 h-5 text-burgundy-600 stroke-[2.5]" /> 
    }
  ];

  const activities = language === 'ar' ? [
    {
      id: 1,
      type: "audit",
      title: "تم استكمال تحليل وتدقيق المستند",
      desc: "أعاد فحص اتفاقية عدم الإفصاح المرفوعة Apex_NDA_Final.pdf نسبة مطابقة تبلغ ٩٨٪. تم رصد ٣ مؤشرات لمخاطر صياغية في بند التعويضات.",
      time: "١٠:٣٢ ص",
      date: "اليوم",
      detail: "أشار المستشار المدعوم بالذكاء الاصطناعي إلى أن المادة ٩.٢ (شروط التعويض والضمان) تفتقر إلى حدود المسؤولية المتبادلة. تم توفير صياغة بديلة مقترحة في قسم المسودات."
    },
    {
      id: 2,
      type: "chat",
      title: "فهرسة وتوثيق سابقة قضائية جديدة",
      desc: "استكمل المستشار جلسة المشورة الفقهية المتعلقة بحدود بند عدم المنافسة الجغرافية. تم إلحاق مرجعين قضائيين معتمدين إلى حافظة القضية.",
      time: "أمس",
      date: "١٢ يوليو",
      detail: "استندت جلسة الاستشارة إلى نص المادة ١٨٨ من القانون المدني والمبادئ المستقرة للتمييز. تلخص النتائج المحفوظة المعايير الموضوعية لتحديد النطاق المكاني في عقود التوظيف."
    },
    {
      id: 3,
      type: "draft",
      title: "صياغة عقد ذكي مخصص",
      desc: "تمت صياغة عقد عمل لمنصب 'مدير أول للأنظمة والامتثال' خاضع لولاية ومحاكم القاهرة. تم تنسيق البنود وصياغتها باللغتين العربية والإنجليزية.",
      time: "منذ ٣ أيام",
      date: "١٠ يوليو",
      detail: "تم إنشاؤه من نموذج استوديو الصياغة. تم إدراج وتخصيص المتغيرات المحددة للتعويضات، وفترات التجربة، وقنوات التحكيم المعتمدة."
    }
  ] : [
    {
      id: 1,
      type: "audit",
      title: "Document Analysis Completed",
      desc: "Contract audit on Apex_NDA_Final.pdf returned 98% analysis rating. 3 high-level risk factors were flagged in the Indemnification Clause.",
      time: "10:32 AM",
      date: "Today",
      detail: "The AI Counselor flagged Section 9.2 (Indemnity holds) as lacking bilateral liability caps. Recommended amendment has been generated in Drafts."
    },
    {
      id: 2,
      type: "chat",
      title: "New Precedent Indexed",
      desc: "Counselor completed consultation regarding Delaware non-compete geographic boundaries. 2 authoritative citations appended to case briefcase.",
      time: "Yesterday",
      date: "Jul 12",
      detail: "Consultation cited Restatement (Second) of Contracts § 188. Saved findings outline reasonable duration limits for software trade structures."
    },
    {
      id: 3,
      type: "draft",
      title: "Smart Contract Generated",
      desc: "Employment agreement for 'Senior Systems Director' drafted under Cairo jurisdiction. Bilateral Arabic-English clauses formatted.",
      time: "3 days ago",
      date: "Jul 10",
      detail: "Generated from Smart Form. Variable parameters for compensation, probation terms, and standard arbitration channels fully populated."
    }
  ];

  const obligations = language === 'ar' ? [
    { day: 14, title: "موعد تقديم مستندات الإفصاح لشركة Apex", level: "high", desc: "استكمال وتسوية الردود القانونية المعلقة لتسليم المعروض ج." },
    { day: 22, title: "إخطار تجديد عقد إيجار المقر الإداري", level: "medium", desc: "مراجعة مهلة الـ ٦٠ يوماً السابقة للإخطار لشروط الإيجار الإداري للشركات." },
    { day: 28, title: "التحضير لجلسة تحكيم القاهرة الكبرى", level: "high", desc: "تجميع وفهرسة مستندات المذكرة التفصيلية للمراجعة النهائية للمستشارين." }
  ] : [
    { day: 14, title: "Apex Discovery Filing Due", level: "high", desc: "Settle outstanding responses for exhibit C deliveries." },
    { day: 22, title: "Lease Contract Renewal Notice", level: "medium", desc: "Prior 60-day notification threshold for office rental terms." },
    { day: 28, title: "Cairo Arbitral Hearing Prep", level: "high", desc: "Assemble indexed brief documents for counsel review." }
  ];

  // Desk Calendar widget days
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const highlightedDays = [14, 22, 28];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Desk Title Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-navy-900/10 pb-6 gap-4">
        <div>
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-burgundy-600 block">
            {t.chambersOf}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase text-navy-900 tracking-tight mt-1">
            {language === 'ar' 
              ? `طاب يومك سيادة المستشار ${user.name.split(' ')[0]}` 
              : `Good morning, Counselor ${user.name.split(' ')[0]}`}
          </h2>
        </div>

        {/* Dynamic Dual Date Card */}
        <div className="bg-parchment-card p-3 rounded-sm text-right flex flex-col items-end border border-gray-300 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 h-full bg-gold-500" />
          <span className="font-serif font-bold text-xs text-navy-900 uppercase tracking-wider">
            {todayEnglish}
          </span>
          <span className="font-serif text-[11px] text-burgundy-600 font-medium mt-0.5 dir-rtl">
            {todayArabic}
          </span>
        </div>
      </div>

      {/* Desk Status Switcher (Demonstrative empty state toggle) */}
      <div className="flex justify-end gap-2 text-xs">
        <button 
          onClick={() => setShowEmptyDesk(!showEmptyDesk)}
          className="text-burgundy-600 hover:text-navy-900 font-mono flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 border border-gray-200"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> {language === 'ar' ? `[تبديل حالة المكتب: ${showEmptyDesk ? 'نشط' : 'خالٍ'}]` : `[Toggle Desk State: ${showEmptyDesk ? 'FILLED' : 'CLEAR'}]`}
        </button>
      </div>

      {showEmptyDesk ? (
        /* Empty State */
        <div className="border border-navy-900/10 p-12 text-center bg-white rounded-sm flex flex-col items-center">
          <Inbox className="w-12 h-12 text-gold-500 stroke-[1.5] mb-4" />
          <h3 className="font-serif text-xl font-bold text-navy-900 uppercase">{language === 'ar' ? "مكتبك خالٍ تماماً، سيادة المستشار" : "Your Desk is Clear, Counselor"}</h3>
          <p className="text-gray-500 text-xs md:text-sm max-w-sm mt-1 leading-relaxed">
            {t.dashboard.uploadFirst}
          </p>
          <button 
            onClick={() => onNavigate('evidence')}
            className="mt-6 bg-navy-900 hover:bg-burgundy-600 text-white font-serif uppercase tracking-wider text-xs py-2.5 px-6 rounded-sm transition-colors cursor-pointer"
          >
            {t.dashboard.enterEvidence}
          </button>
        </div>
      ) : (
        /* Standard Rich Desk State */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Columns - Activities & Documents (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Postcard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((s, idx) => (
                <div key={idx} className="bg-white border border-gray-200 p-5 rounded-sm relative shadow-sm group hover:border-navy-900/30 transition-all">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold-500" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-semibold">
                      {s.label}
                    </span>
                    <div className="p-1.5 bg-parchment border border-navy-900/5 rounded-sm">
                      {s.icon}
                    </div>
                  </div>
                  <div className="font-serif text-3xl font-bold text-navy-900 mt-2">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-burgundy-600 italic font-serif mt-1">
                    {s.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Case Documents Horizontal Scroll */}
            <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm relative">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <h3 className="font-serif text-lg font-bold uppercase text-navy-900 tracking-tight">
                  {t.dashboard.activeCases}
                </h3>
                <button 
                  onClick={() => onNavigate('evidence')}
                  className="text-xs font-serif italic text-burgundy-600 hover:text-navy-900 flex items-center gap-0.5 cursor-pointer"
                >
                  {t.dashboard.viewLibrary} <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500 italic">
                  {language === 'ar' ? "لا يوجد مستندات أو صكوك قانونية نشطة مسجلة." : "No registered active legal instruments."}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                  {documents.map((doc, idx) => {
                    const docColors = ['border-l-burgundy-600', 'border-l-gold-500', 'border-l-navy-900', 'border-l-navy-600'];
                    const borderLeftColor = docColors[idx % docColors.length];
                    return (
                      <div 
                        key={doc.id}
                        onClick={() => onNavigate('evidence')}
                        className={`flex-shrink-0 w-52 bg-parchment-light border border-gray-200 border-l-4 ${borderLeftColor} p-4 rounded-sm cursor-pointer hover:shadow-md transition-all relative group`}
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="w-4 h-4 text-burgundy-600" />
                        </div>
                        <FileText className="w-7 h-7 text-navy-700 stroke-[1.5] mb-2" />
                        <h4 className="font-serif font-bold text-xs text-navy-900 uppercase truncate">
                          {doc.name}
                        </h4>
                        <div className="text-[10px] font-mono text-gray-500 mt-1">
                          {doc.type} • {doc.size}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-[9px] px-1.5 py-0.5 font-semibold uppercase rounded-sm ${
                            doc.status === 'Analysis Complete' ? 'bg-success/10 text-success' : 'bg-gold-500/10 text-gold-500'
                          }`}>
                            {doc.status === 'Analysis Complete' ? (language === 'ar' ? 'تم التدقيق' : 'AUDITED') : (language === 'ar' ? 'قيد التدقيق' : 'PENDING')}
                          </span>
                          <span className="text-[9px] text-gray-400">{doc.dateUploaded}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Vertical Timeline Activity Feed */}
            <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
              <h3 className="font-serif text-lg font-bold uppercase text-navy-900 tracking-tight border-b border-gray-100 pb-4 mb-6">
                {language === 'ar' ? "سجلات النشاطات اليومية لغرف المكتب" : "Chambers Daily Log"}
              </h3>

              <div className="relative border-l-2 border-parchment-dark pl-6 ml-3 space-y-8">
                {activities.map((act, index) => {
                  const isSelected = selectedActivity === index;
                  return (
                    <div 
                      key={act.id} 
                      className="relative cursor-pointer group"
                      onClick={() => setSelectedActivity(isSelected ? null : index)}
                    >
                      {/* Timeline Dot Indicator */}
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-navy-900 bg-parchment flex items-center justify-center transition-colors group-hover:bg-gold-500" />
                      
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-serif text-xs text-burgundy-600 font-semibold uppercase tracking-widest">
                          {act.date} • {act.time}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-navy-900 transition-colors">
                          {isSelected ? (language === 'ar' ? "[طي]" : "[Collapse]") : (language === 'ar' ? "[تفصيل السجل]" : "[Expand Details]")}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-navy-900 uppercase tracking-tight mt-1">
                        {act.title}
                      </h4>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        {act.desc}
                      </p>

                      {/* Expandable Panel */}
                      {isSelected && (
                        <div className="mt-3 p-3 bg-parchment-light border border-navy-900/10 rounded-sm text-xs text-gray-700 animate-slide-down font-serif italic border-l-2 border-l-gold-500 leading-relaxed">
                          {act.detail}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Columns - Deadlines Calendar & Active Pleading Widgets (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Desk Calendar Widget */}
            <div className="bg-navy-900 text-parchment p-6 rounded-sm shadow-md border border-navy-900 relative paper-grain-dark">
              <div className="flex justify-between items-center border-b border-parchment/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-300 stroke-[2]" />
                  <span className="font-serif text-xs uppercase tracking-widest font-bold">
                    {language === 'ar' ? "مفكرة المواعيد والالتزامات" : "OBLIGATIONS CALENDAR"}
                  </span>
                </div>
                <span className="font-serif text-[10px] text-gold-300 font-semibold italic">{language === 'ar' ? "يوليو ٢٠٢٦" : "July 2026"}</span>
              </div>

              {/* Grid 7 days names */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-gray-400 uppercase font-semibold mb-2">
                {language === 'ar' ? (
                  <><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span><span>أحد</span></>
                ) : (
                  <><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></>
                )}
              </div>

              {/* Grid 31 days */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-serif font-semibold">
                {/* Empty buffer slots for calendar start offset (assume July starts on Wed, so 2 empty) */}
                <div />
                <div />
                
                {calendarDays.map(day => {
                  const isHighlighted = highlightedDays.includes(day);
                  const isToday = day === 13;
                  return (
                    <div 
                      key={day}
                      className={`py-1 rounded-sm relative flex items-center justify-center ${
                        isToday ? 'bg-burgundy-600 text-white font-bold' : ''
                      } ${
                        isHighlighted ? 'border border-gold-500 text-gold-300 font-bold' : ''
                      }`}
                    >
                      {day}
                      {/* Little notification spot on highlighted days */}
                      {isHighlighted && (
                        <span className="absolute bottom-0.5 w-1 h-1 bg-gold-400 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Specific Highlighted Deadlines list inside widget */}
              <div className="mt-6 border-t border-parchment/10 pt-4 space-y-3.5">
                {obligations.map((ob, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="p-1.5 bg-parchment/10 border border-gold-500/20 text-gold-300 text-[11px] font-bold font-serif rounded-sm w-12 text-center shrink-0">
                      {language === 'ar' ? `١٤ يوليو` : `Jul ${ob.day}`}
                    </div>
                    <div>
                      <h4 className="font-serif text-xs text-white font-bold uppercase tracking-tight flex items-center gap-1">
                        {ob.title} 
                        {ob.level === 'high' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline" />}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{ob.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Advisory Bulletin (Brief Legal insights) */}
            <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none -mr-4 -mt-4">
                <Scale className="w-full h-full text-navy-900" />
              </div>
              <span className="font-serif text-[10px] font-bold uppercase text-burgundy-600 tracking-widest block mb-1">
                {language === 'ar' ? "النشرة الاستشارية والتعميم" : "COGNITIVE BULLETIN"}
              </span>
              <h4 className="font-serif font-bold text-sm text-navy-900 uppercase">
                {language === 'ar' ? "تنبيه تنظيمي: تفعيل المادة ١٤٧ من القانون المدني المصري" : "Regulatory Alert: Egyptian Civil Code Article 147 Auditing"}
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed mt-2 font-serif italic">
                {t.dashboard.bulletinDesc}
              </p>
              <button 
                onClick={() => onNavigate('gazette')}
                className="text-xs text-burgundy-600 hover:text-navy-900 font-serif font-bold uppercase mt-4 block tracking-wider cursor-pointer"
              >
                {language === 'ar' ? "تصفح بنود الجريدة الرسمية ←" : "Inspect Gazette Articles →"}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
