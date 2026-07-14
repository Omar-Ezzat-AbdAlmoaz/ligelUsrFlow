import React, { useState } from 'react';
import { 
  Scale, Shield, Hourglass, Scroll, ChevronDown, Check, 
  Newspaper, Users, Award, BookOpen, AlertCircle, FileText
} from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface LandingPageProps {
  onGetStarted: () => void;
  language?: Language;
}

export default function LandingPage({ onGetStarted, language = 'en' }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');

  const t = translations[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setEmailSubscribed(true);
      setNewsEmail('');
    }
  };

  const features = [
    {
      icon: <Scale className="w-6 h-6 text-gold-500 stroke-[2.5]" />,
      title: t.landing.feature1Title,
      desc: t.landing.feature1Desc
    },
    {
      icon: <Shield className="w-6 h-6 text-gold-500 stroke-[2.5]" />,
      title: t.landing.feature2Title,
      desc: t.landing.feature2Desc
    },
    {
      icon: <Scroll className="w-6 h-6 text-gold-500 stroke-[2.5]" />,
      title: t.landing.feature3Title,
      desc: t.landing.feature3Desc
    },
    {
      icon: <Hourglass className="w-6 h-6 text-gold-500 stroke-[2.5]" />,
      title: language === 'ar' ? "جدولة العهود والالتزامات" : "Covenant Timelines",
      desc: language === 'ar' ? "استخلاص جداول زمنية دقيقة للأداء، والبنود التعاقدية، والتزامات الدفع. لن تفوتك نافذة موافقة أو تجديد سنوية أبداً." : "Extract absolute timelines of performance, deliverables, and payment obligations. Never miss a critical filing deadline or annual renewal consent window."
    }
  ];

  const steps = [
    { 
      num: "01", 
      title: language === 'ar' ? "تقديم المستندات" : "Furnish Materials", 
      desc: language === 'ar' ? "اسحب وأسقط السندات القانونية والمذكرات والعرائض في لوحة العمل الآمنة للشركة." : "Drag and drop legal instruments, briefs, depositions, or templates onto the secure firm's canvas." 
    },
    { 
      num: "02", 
      title: language === 'ar' ? "المعالجة المعرفية" : "Cognitive Processing", 
      desc: language === 'ar' ? "يقوم المستشار بقراءة الملفات، فك تشفير النصوص بـ OCR، مطابقة المواد القانونية، وتقييم مؤشرات الامتثال." : "The AI Counselor reads, runs OCR, matches index nodes, and assesses compliance vectors." 
    },
    { 
      num: "03", 
      title: language === 'ar' ? "إشراف المحامي" : "Attorney Oversight", 
      desc: language === 'ar' ? "راجع التفاصيل والبنود المستخلصة، واجرِ تعديلاتك مباشرة بمساعدة إرشادات الذكاء الاصطناعي الفورية." : "Review the highlights, override classifications, compare drafts, and edit with real-time AI prompts." 
    },
    { 
      num: "04", 
      title: language === 'ar' ? "التصدير والاعتماد" : "Execute & File", 
      desc: language === 'ar' ? "قم بتصدير مذكرات وعقود جاهزة للطباعة بصيغة Word/PDF أو تسليمها للأطراف الموقعة بأمان." : "Export in publication-grade PDF/Word or transmit directly to stakeholders with secure seal integrations." 
    }
  ];

  const plans = [
    { 
      name: language === 'ar' ? "ممارسة المقر المنفرد" : "Chambers Practice", 
      price: "$99", 
      period: language === 'ar' ? "لكل مستشار / شهرياً" : "per counsel / month", 
      desc: language === 'ar' ? "مثالية للمحامين الممارسين بصفة فردية والمكاتب الناشئة الطامحة لأتمتة البحث الاستشاري." : "Perfect for solo practitioners and boutique offices seeking advanced research and drafting automation.", 
      features: language === 'ar' ? ["استشارات مستندة للاسترجاع (RAG)", "٥٠ مستند تدقيق شهرياً", "قوالب ذكية معتمدة", "مجلدات موكلين مخصصة", "بروتوكولات التشفير القياسية"] : ["Full Consultation RAG", "50 Document Audits / mo", "Standard Smart Templates", "Custom Client Folders", "Standard Encryption Protocols"] 
    },
    { 
      name: language === 'ar' ? "الشراكة المؤسسية" : "The Partnership", 
      price: "$249", 
      period: language === 'ar' ? "لكل مستشار / شهرياً" : "per counsel / month", 
      desc: language === 'ar' ? "مخصصة للمكاتب المتنامية التي تحتاج لمكتبات مستندات متكاملة وأدوات تعاون جماعي آمنة." : "Tailored for growing practices requiring enterprise-grade document libraries and collaborative tools.", 
      features: language === 'ar' ? ["جميع مميزات الممارسة الفردية", "تدقيق ومراجعة غير محدودة للعقود", "مصمم مسودات وقوالب الشراكة المخصصة", "تعليقات وملاحظات فقهية فورية", "تأصيل ومطابقة للمراجع المعتمدة بـ RAG", "تسجيل دخول آمن متعدد العوامل"] : ["All Chambers features", "Unlimited Document Audits", "Custom Firm Template Designer", "Real-Time Group Annotations", "Multi-Factor Registry Access", "Priority Citation Grounding"], 
      popular: true 
    },
    { 
      name: language === 'ar' ? "المؤسسات والشركات الكبرى" : "Counselor Enterprise", 
      price: "بطلب خاص", 
      period: language === 'ar' ? "تكامل وتركيب خاص" : "custom integration", 
      desc: language === 'ar' ? "خوادم مخصصة ذات حماية سيادية فائقة وتدريب مخصص على أرشيفات المكتب التاريخية السرية." : "Dedicated deployments, sovereign hosting, and fine-tuning on proprietary firm archives.", 
      features: language === 'ar' ? ["مقاعد استشارية غير محدودة", "استضافة سحابية سيادية مستقلة", "نماذج ذكاء اصطناعي مدربة محلياً", "تكامل مباشر مع قواعد بيانات الشركات SQL", "تسجيل دخول أحادي آمن SSO", "دعم فني فقهي وقانوني مخصص ٢٤/٧"] : ["Uncapped Counsel Seats", "Sovereign Cloud Deployments", "Custom Fine-tuned Embeddings", "Relational Database Integrations", "SAML SSO / Active Directory", "24/7 Priority Support Suite"] 
    }
  ];

  const faqs = [
    { 
      q: language === 'ar' ? "كيف يتم الحفاظ على سرية الموكل والسر المهني للمحامي؟" : "How is client attorney privilege preserved within the model?", 
      a: language === 'ar' ? "حماية خصوصيتكم هي عهدنا الأساسي. جميع البيانات مشفرة بالكامل أثناء السكون وأثناء النقل. بشكل حاسم، تتم معالجة مستندات ومحادثات الموكلين في بيئات منعزلة تماماً ومستبعدة تماماً من التدريب العام للنماذج اللغوية." : "Data security is our primary covenant. All data payloads are encrypted at-rest and in-transit. Crucially, client documents and conversations are handled in isolated environments and are strictly excluded from core foundation model training." 
    },
    { 
      q: language === 'ar' ? "هل تبحث غرفة المشورة في السجلات القانونية العامة المحدثة؟" : "Does the Consultation Room search live public records?", 
      a: language === 'ar' ? "نعم بالفعل. تتكامل المنصة مع محركات استرجاع وبحث محدثة للتحقق من القوانين والأنظمة المعاصرة. عندما تستعلم عن تشريع حديث، يقوم المستشار بمطابقة وبث المراجع المعتمدة بدقة." : "Yes. The platform integrates direct Google Search and Maps grounding. When you query current event legislation or administrative addresses, the model cross-references authoritative web databases and appends verified citations." 
    },
    { 
      q: language === 'ar' ? "هل يدعم النظام الصياغة الثنائية باللغتين العربية والإنجليزية؟" : "Does the system support bilingual Arabic and English drafting?", 
      a: language === 'ar' ? "نعم بالتأكيد، تم تصميم المنصة للمكاتب والممارسات القانونية العابرة للحدود. يمكنك إدارة لوحة التحكم والتحليل، والدردشة الاستشارية، وتوليد مسودات العقود باللغة الإنجليزية أو العربية أو كليهما بالتوازي وبدعم كامل للاتجاهين." : "Yes, our platform is designed for cross-border and bilingual legal practices. You can set the dashboard to render, chat, and draft in English, Arabic, or side-by-side bilingual structures natively." 
    }
  ];

  return (
    <div className="min-h-screen bg-parchment text-navy-900 selection:bg-gold-500 selection:text-navy-900 font-sans pb-24">
      {/* Newspaper Header Masthead */}
      <header className="border-b-4 border-navy-900 py-6 px-4 md:px-8 bg-parchment-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center border-b border-navy-900 pb-4">
            <span className="font-serif text-xs uppercase tracking-widest text-burgundy-600 font-bold mb-2">
              {language === 'ar' ? "تأسس عام ٢٠٢٦ • أنظمة المشورة الفقهية الذكية" : "Established 2026 • Intelligent Jurisprudential Systems"}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl uppercase tracking-tighter text-navy-900 font-bold select-none">
              {language === 'ar' ? "صحيفة المستشار القانوني المعتمد" : "The Counselor Chronicle"}
            </h1>
            <p className="font-serif italic text-sm text-gray-600 mt-1">
              {language === 'ar' ? '"الصدق والمنطق والعدالة" — إرساء وضوح معرفي غير مسبوق في الصناعة القانونية' : '"Veritas, Ratio, Justitia" — Bringing Unprecedented Cognitive Clarity to the Legal Trade'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-3 text-xs font-serif uppercase tracking-wider text-gray-700">
            <div>{language === 'ar' ? "طبعة القاهرة • لندن • ويلمنغتون" : "Cairo • London • Wilmington Edition"}</div>
            <div className="font-bold border-y sm:border-y-0 border-navy-900 my-1 py-1 sm:my-0 sm:py-0">
              {language === 'ar' ? "المجلد ١١٥ ... العدد ٠٤" : "VOL. CXV ... NO. 04"}
            </div>
            <div>{language === 'ar' ? "الإثنين، ١٣ يوليو ٢٠٢٦" : "Monday, July 13, 2026"}</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b-2 border-navy-900 pb-12">
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <span className="font-serif italic text-burgundy-600 font-semibold text-lg md:text-xl block mb-2">
                {language === 'ar' ? "تقرير خاص: الذكاء الاصطناعي يثبت كفاءة استثنائية في تدقيق النزاعات القضائية" : "Special Dispatch: Artificial Intelligence Proves Supreme in Litigation Workflows"}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-navy-900 leading-none uppercase mb-6">
                {language === 'ar' ? "لوحة المستشار الذكية هي مفتاح ريادة وهيبة المكاتب القانونية الكبرى" : "AI COGNITIVE DESK DECLARED SECRET TO LAW FIRM PRESTIGE"}
              </h2>
              <div className="border-l-4 border-gold-500 pl-4 mb-6">
                <p className="font-serif text-base italic text-gray-700">
                  {language === 'ar' ? '"لن يغرق شركاؤنا ومحامونا بعد الآن تحت ركام مستندات الاستكشاف. تقوم منصة هارينغتون بأتمتة الأعباء الميكانيكية الرتيبة للصناعة، لتسمح للمستشارين بالتفرغ لجوهر العمل القانوني والتحليلي الرفيع."' : '"No longer must our associates drown under mounds of discovery files. The Counselor\'s Desk automates the mechanical burdens of the trade, restoring attorneys to the pure practice of law."'}
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-8">
                {language === 'ar' ? 
                  "يحتاج المستشار المعاصر لأكثر من مجرد برمجيات دردشة تقليدية. نقدم لكم مساحة عمل رقمية بالغة الانضباط ومصممة خصيصاً للعقل التحليلي للمحامي الممارس. قم بتحميل ملفات القضايا، مراجعة الجداول الزمنية للالتزامات، الكشف التلقائي عن الثغرات والمخاطر الصياغية، وصياغة عقود متكاملة تحت واجهة كلاسيكية فاخرة تمنحك الأمان والهدوء التام." 
                  : "The modern chambers requires more than default SaaS templates and bubble-chat panels. We present an elegant, fully structured digital workspace tailored specifically for the analytical mind. Upload litigation binders, review smart timelines, scan contracts for risk, and write airtight legal drafts under a premium, traditional interface designed to inspire quiet confidence."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                id="btn-hero-start"
                onClick={onGetStarted}
                className="bg-navy-900 hover:bg-burgundy-600 text-white font-medium py-3.5 px-8 rounded-sm tracking-wide transition-colors duration-200 border border-transparent cursor-pointer font-serif uppercase text-sm"
              >
                {t.landing.getStarted}
              </button>
              <button 
                id="btn-hero-demo"
                onClick={onGetStarted}
                className="bg-transparent hover:bg-navy-900 hover:text-white text-navy-900 font-medium py-3.5 px-8 rounded-sm tracking-wide transition-all duration-200 border-2 border-navy-900 font-serif uppercase text-sm"
              >
                {t.landing.learnMore}
              </button>
            </div>
          </div>

          {/* Hero Illustration (Simulated Courtroom/Law desk bento) */}
          <div className="lg:col-span-5 border border-navy-900 p-6 bg-parchment-light relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
              <Scale className="w-full h-full text-navy-900" />
            </div>
            
            <div className="border-b border-navy-900 pb-4 mb-4">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-burgundy-600">
                {language === 'ar' ? "آخر القضايا والملفات المودعة" : "LATEST FILED MATTERS"}
              </span>
              <div className="flex justify-between items-center mt-2">
                <h4 className="font-serif font-bold text-lg text-navy-900">
                  {language === 'ar' ? "شركة آبيكس للتكنولوجيا ضد ديوان المستشار" : "Apex Tech vs. Counselor Corp"}
                </h4>
                <span className="text-[10px] font-mono bg-burgundy-600 text-white px-2 py-0.5 rounded-sm">
                  {language === 'ar' ? "قضية نشطة" : "ACTIVE STATUS"}
                </span>
              </div>
            </div>

            <div className="space-y-4 my-6 font-serif">
              <div className="border border-navy-900/20 p-3 bg-parchment/60 rounded-sm">
                <div className="text-xs text-gray-500 uppercase font-mono">
                  {language === 'ar' ? "نتيجة فحص البنود" : "CLAUSE SCANNING RESULT"}
                </div>
                <div className="text-sm font-semibold text-navy-900 mt-1">
                  {language === 'ar' ? "قسم ١٤ (أ) - استثناء الاختصاص الحصري" : "Section 14(a) - Exclusive Venue Exception"}
                </div>
                <div className="text-xs text-red-700 font-medium mt-1">
                  {language === 'ar' ? "🔴 مخاطر عالية: تعارض في اختيار المحكمة المختصة في ملحق البنود." : "🔴 High Risk: Conflicting forum selections found in subcontractor schedule."}
                </div>
              </div>

              <div className="border border-navy-900/20 p-3 bg-parchment/60 rounded-sm">
                <div className="text-xs text-gray-500 uppercase font-mono">
                  {language === 'ar' ? "ملخص معالجة المستند" : "COGNITIVE SUMMARY REPORT"}
                </div>
                <p className="text-xs italic text-gray-600 mt-1">
                  {language === 'ar' ? 
                    '"تسعى الشكوى لإصدار أحكام بشأن انتهاك الأسرار التجارية. يدعي المدعى عليه توافر دفاع مشروع يتعلق بالإفصاح المستقل المسبق..."' 
                    : '"The complaint seeks declarations on trade secret misappropriation. Defendant\'s answer asserts affirmative defense of prior independent disclosure..."'}
                </p>
              </div>
            </div>

            <div className="border-t border-navy-900 pt-4 text-xs font-serif italic text-gray-600 text-center">
              {language === 'ar' ? '"محاكاة مكتب المستشار مع الالتزام التام بالقواعد الفقهية."' : '"The Counsel\'s Desktop, simulating absolute rigor."'}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-navy-900 text-parchment-light py-8 px-4 border-b border-navy-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-sm tracking-widest uppercase font-bold text-gold-300">
            {language === 'ar' ? "معتمد وموثوق من كبرى الهيئات والمؤسسات" : "Endorsed by Premier Institutions"}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-300" />
              <span className="font-serif font-bold tracking-tight text-sm">
                {language === 'ar' ? "دورية مراجعة قوانين القاهرة" : "Cairo Law Review"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-gold-300" />
              <span className="font-serif font-bold tracking-tight text-sm">
                {language === 'ar' ? "نقابة محامي ديلاوير" : "Delaware Bar Assoc."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold-300" />
              <span className="font-serif font-bold tracking-tight text-sm">
                {language === 'ar' ? "جمعية الاستشهادات البريطانية" : "OSCOLA Citation Soc."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-300" />
              <span className="font-serif font-bold tracking-tight text-sm">
                {language === 'ar' ? "رابطة المستشارين القانونيين للشركات" : "Alliance of Corporate Counsel"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="text-center mb-12">
          <span className="font-serif text-xs uppercase tracking-widest text-burgundy-600 font-bold">
            {language === 'ar' ? "القدرات الفنية والوظائف" : "Platform Capabilities"}
          </span>
          <h3 className="font-serif text-3xl md:text-5xl font-bold uppercase text-navy-900 mt-2">
            {language === 'ar' ? "البنية التحليلية والمعرفية" : "The Analytical Architecture"}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
            {language === 'ar' 
              ? "لا وجود لفقاعات دردشة تقليدية أو ظلال خفيفة عشوائية. تصميم غير متماثل مصمم بالكامل حول المتطلبات المهنية والتحليلية للمحاماة."
              : "No generic chat bubbles or light modern shadows. An asymmetric layout built strictly around functional legal requirements."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="border border-navy-900 p-6 bg-white hover:border-burgundy-600 transition-all duration-200 flex gap-4 relative group"
            >
              <div className="absolute top-3 right-3 text-xs font-mono text-gray-300 group-hover:text-gold-500 font-bold transition-colors">
                [0{idx + 1}]
              </div>
              <div className="p-3 bg-parchment border border-navy-900/10 rounded-sm self-start">
                {feat.icon}
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-navy-900 uppercase tracking-tight mb-2">
                  {feat.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Horizontal Scroll/Timeline) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
        <div className="border border-navy-900 bg-navy-900 text-parchment-light p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 w-64 h-64 opacity-5 pointer-events-none">
            <Newspaper className="w-full h-full text-parchment-light" />
          </div>
          
          <div className="mb-10">
            <span className="font-serif text-xs uppercase tracking-widest text-gold-300 font-bold">
              {language === 'ar' ? "التسلسل الإجرائي" : "Procedural Flow"}
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold uppercase mt-1">
              {language === 'ar' ? "الجدول الزمني للعمليات والتحليل" : "THE PROCEDURAL TIMELINE"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((st, idx) => (
              <div key={idx} className="border-t border-gold-500/30 pt-6 flex flex-col justify-between">
                <div>
                  <span className="font-serif text-4xl font-bold text-gold-300 block mb-3">
                    {st.num}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white uppercase mb-2">
                    {st.title}
                  </h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
        <div className="text-center mb-12">
          <span className="font-serif text-xs uppercase tracking-widest text-burgundy-600 font-bold">
            {language === 'ar' ? "مستحقات الاشتراك والخطط" : "Retainers & Plans"}
          </span>
          <h3 className="font-serif text-3xl md:text-5xl font-bold uppercase text-navy-900 mt-2">
            {language === 'ar' ? "هيكل خطط الاشتراك المناسبة" : "PROPORTIONAL PRICING STRUCTURE"}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-sm">
            {language === 'ar' ? "نماذج تسعير وفواتير واضحة وقابلة للتنبؤ مع شفافية مطلقة." : "Predictable billing models. Sharp corners, bold boundaries, absolute transparency."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, idx) => (
            <div 
              key={idx} 
              className={`border-2 p-6 bg-white relative flex flex-col justify-between transition-transform duration-200 ${
                p.popular ? 'border-burgundy-600 shadow-md scale-[1.02]' : 'border-navy-900'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-burgundy-600 text-white font-serif uppercase tracking-widest text-[10px] font-bold px-4 py-1 border border-navy-900">
                  {language === 'ar' ? "الأكثر تفضيلاً" : "Most Endorsed"}
                </div>
              )}
              
              <div>
                <h4 className="font-serif text-xl font-bold text-navy-900 uppercase tracking-tight mb-2">
                  {p.name}
                </h4>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-serif text-4xl font-bold text-navy-900">{p.price}</span>
                  <span className="text-xs text-gray-500 italic">{p.period}</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed border-b border-navy-900/10 pb-4 mb-6">
                  {p.desc}
                </p>

                <ul className="space-y-3 mb-8">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <Check className="w-4 h-4 text-burgundy-600 shrink-0 stroke-[2.5]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={onGetStarted}
                className={`w-full py-3 rounded-sm font-serif uppercase text-xs font-bold tracking-wider cursor-pointer border transition-all duration-150 ${
                  p.popular 
                    ? 'bg-burgundy-600 hover:bg-navy-900 text-white border-transparent' 
                    : 'bg-transparent hover:bg-navy-900 hover:text-white text-navy-900 border-navy-900'
                }`}
              >
                {language === 'ar' ? "حجز الخدمة وتفعيلها" : "Retain Suite"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-4 mt-24 text-center">
        <span className="font-serif text-5xl text-gold-500 font-bold block leading-none select-none">“</span>
        <blockquote className="font-serif text-lg md:text-xl italic text-navy-900 font-medium leading-relaxed max-w-3xl mx-auto -mt-2">
          {language === 'ar' ? 
            "إن القدرة على فحص اتفاقيات الشركات متعددة الصفحات والحصول الفوري على تقرير مفصل للأخطار والمخاطر الصياغية قد غيرت طريقة تقديمنا للعرائض والطلبات. لقد اكتشفنا تباينًا صياغياً في تحديد المحكمة المختصة في أقل من عشر ثوانٍ، وهو ما كان سيكلفنا آلاف الدولارات في نزاعات قضائية مفرطة وغريبة عن سياق العقد."
            : "The ability to inspect multi-page corporate agreements and instantly obtain a risk report graded in high, medium, and low parameters has transformed our litigation filings. We discovered a forum selection mismatch in under ten seconds that would have cost us thousands in administrative venue fights."}
        </blockquote>
        <div className="mt-6">
          <cite className="not-italic font-bold text-sm uppercase tracking-wider text-burgundy-600 block">
            {language === 'ar' ? "سير تشارلز هارينغتون، مستشار الملكة" : "Sir Charles Harrington, KC"}
          </cite>
          <span className="text-xs text-gray-500 italic font-serif">
            {language === 'ar' ? "مستشار أول، هارينغتون وشركاؤه للمحاماة" : "Senior Counsel at Harrington & Associates"}
          </span>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-3xl mx-auto px-4 mt-24">
        <div className="text-center mb-10">
          <span className="font-serif text-xs uppercase tracking-widest text-burgundy-600 font-bold">
            {language === 'ar' ? "الملف الاستشاري" : "Advisory Dossier"}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold uppercase text-navy-900 mt-1">
            {language === 'ar' ? "الأسئلة الشائعة والاستفسارات" : "Frequently Asked Queries"}
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="border border-navy-900 bg-white transition-all"
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className={`w-full py-4 px-5 flex justify-between items-center bg-parchment-light hover:bg-parchment-dark/30 cursor-pointer ${
                    language === 'ar' ? 'text-right' : 'text-left'
                  }`}
                >
                  <span className="font-serif font-bold text-sm md:text-base text-navy-900 uppercase tracking-tight">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-navy-900 transition-transform stroke-[2.5] ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                {isOpen && (
                  <div className={`py-4 px-5 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-navy-900 bg-white ${
                    language === 'ar' ? 'text-right' : 'text-left'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
        <div className="border border-navy-900 bg-parchment-light p-8 md:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto">
            <Newspaper className="w-10 h-10 text-burgundy-600 stroke-[2] mx-auto mb-4" />
            <h3 className="font-serif text-3xl md:text-4xl font-bold uppercase text-navy-900 mb-2">
              {language === 'ar' ? "الاشتراك في الجريدة القانونية المعتمدة" : "Subscribe to the Legal Gazette"}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mb-8 leading-relaxed">
              {language === 'ar' ? 
                "ابق على اطلاع بالتوجيهات الفقهية الحديثة، والتحديثات المتعلقة بامتثال الشركات، وخصائص المنصة التي تُسلم مباشرة لمقر عملك الاستشاري شهرياً. لا رسائل مزعجة، وسرية كاملة للمحاماة." 
                : "Stay apprised of intellectual trends, updates concerning corporate compliance algorithms, and platform features delivered straight to your chambers monthly. No spam. Absolute confidentiality."}
            </p>

            {emailSubscribed ? (
              <div className="border border-navy-900 bg-parchment p-4 rounded-sm text-sm text-navy-900 font-serif inline-block">
                {language === 'ar' ? "✓ تم تسجيل بريدك الإلكتروني بنجاح في دوريات الجريدة سيادة المستشار." : "✓ Your email has been registered in the Gazette list, Counselor."}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder={language === 'ar' ? "أدخل بريدك الإلكتروني المهني والمحمي..." : "Enter your professional email address..."}
                  required
                  className="flex-1 bg-white border border-gray-400 focus:border-gold-500 rounded-sm py-2 px-3 text-xs md:text-sm focus:outline-none focus:ring-0"
                />
                <button 
                  type="submit"
                  className="bg-navy-900 hover:bg-burgundy-600 text-white font-serif uppercase tracking-wider font-bold text-xs py-2 px-5 rounded-sm border border-transparent transition-colors duration-150 cursor-pointer"
                >
                  {language === 'ar' ? "الاشتراك المباشر" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
