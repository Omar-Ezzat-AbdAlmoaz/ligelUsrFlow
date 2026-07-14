import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, Calendar, User, Clock, Search, BookOpen, MessageSquare, 
  Share2, ArrowLeft, Send, Check, Bookmark, FileText, Lock, Plus,
  Volume2, VolumeX
} from 'lucide-react';
import { BlogPost, Comment } from '../types';
import { Language, translations } from '../lib/translations';

interface LegalGazetteProps {
  language: Language;
}

export default function LegalGazette({ language }: LegalGazetteProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'public' | 'internal'>('public');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Speech reader state
  const [speakingPostId, setSpeakingPostId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  // Stop reading if post is switched or on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedPost?.id]);

  const speakPost = (postId: string, textToSpeak: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingPostId === postId) {
      window.speechSynthesis.cancel();
      setSpeakingPostId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean formatting and headers
    const cleanText = textToSpeak
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/[\*\#\_]/g, '')
      .replace(/>/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isArabicText = /[\u0600-\u06FF]/.test(cleanText);
    utterance.lang = isArabicText ? 'ar-EG' : 'en-US';
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    let preferredVoice = null;
    if (isArabicText) {
      preferredVoice = voices.find(v => v.lang.startsWith('ar')) || null;
    } else {
      preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || 
                       voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) ||
                       voices.find(v => v.lang.startsWith('en')) || null;
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setSpeakingPostId(null);
    };

    utterance.onerror = () => {
      setSpeakingPostId(null);
    };

    setSpeakingPostId(postId);
    window.speechSynthesis.speak(utterance);
  };
  
  // Comments States
  const [newCommentAuthor, setNewCommentAuthor] = useState(language === 'ar' ? 'المستشار شريف' : 'Counselor Charles');
  const [newCommentText, setNewCommentText] = useState('');
  
  // Newsletter States
  const [gazetteEmail, setGazetteEmail] = useState('');
  const [gazetteSubscribed, setGazetteSubscribed] = useState(false);

  const posts: BlogPost[] = [
    {
      id: "post-1",
      title: language === 'ar' 
        ? "القيمة الفقهية والقانونية للعقود الذكية المؤتمتة في ضوء المادة ١٤٧ من القانون المدني" 
        : "The Jurisprudential Standing of AI Smart Contracts Under Civil Code Article 147",
      category: language === 'ar' ? "فقه العقود والالتزامات" : "Contract Doctrine",
      excerpt: language === 'ar'
        ? "دراسة تفصيلية معقمة حول مدى استيفاء الرموز البرمجية للاتفاقيات لمعايير الرضا والتوافق التعاقدي المطلق المنصوص عليها في القانون المدني المصري والممارسات القضائية."
        : "An in-depth inquiry into whether automated programmatic loops satisfy the absolute mutual assent standards required by classic civil codes, specifically examining Cairo regional precedents.",
      content: language === 'ar' 
        ? `إن تقاطع العقود الذكية ذاتية التنفيذ المشفرة مع النصوص التشريعية والقواعد العامة للالتزامات يطرح أحد أدق الأسئلة الفقهية في العصر الحديث.

بموجب المادة ١٤٧ من القانون المدني المصري، فإن العقد هو الشريعة المطلقة للمتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين، أو للأسباب التي يقررها القانون. وهنا يثور التساؤل الميكانيكي: هل يمكن لمعاملة رقمية مشفرة، يتم تشغيلها ذاتياً بموجب أكواد برمجية دون تدخل بشري فوري، أن تستوفي متطلبات الرضا والتطابق التام والإرادة المشتركة المعترف بها فقهياً وقضائياً؟

### معايير الرضا في الاتفاقيات المبرمجة
تطلب المشرع الكلاسيكي دائماً توافق الإرادتين وتطابق الإيجاب والقبول لإحداث الأثر القانوني. في بنود العقود المبرمجة، يُعبر عن هذا الرضا سلفاً وقت تصميم الكود وإيداع المعاملة على قاعدة البيانات الموزعة. يلتزم الأطراف بالشروط، وعن طريق التوقيع بمفاتيحهم التشفيرية الخاصة، يقرون بالمسؤولية الكاملة عن كافة النتائج والعمليات الحسابية التي ينفذها الكود تلقائياً.

> "إن التراضي في العقود الذكية ليس قراراً استرجاعياً، بل هو التزام استباقي ومطلق. فبمجرد توقيع الشفرة الأصلية، يلتزم الشريك القانوني بكافة المخرجات والعمليات المنطقية للكود."

ومع ذلك، تظهر التحديات القانونية إذا شابت الكود أخطاء برمجية أو أدت مخرجاته إلى نتائج تتعارض مع النية المشتركة الحقيقية للأطراف. وفي ضوء المادة ١٤٨ من القانون المدني المصري التي توجب تنفيذ العقد طبقاً لما اشتمل عليه وبطريقة تتفق مع ما يوجبه حسن النية، يمتلك القاضي أو المحكم سلطة واسعة لإعادة التوازن والعدالة للعقد وإزالة الغبن. لذلك نوصي بشدة بإدراج شرط التحكيم المادي دائمًا لحل أي نزاع تقني أمام مركز القاهرة الإقليمي للتحكيم أو محاكم ديلاوير.`
        : `The intersection of blockchain-based self-executing contracts and traditional statutory codes poses one of the most demanding doctrinal riddles of the century. 

Under Article 147 of the Egyptian Civil Code, the contract stands as the absolute law of the contracting parties. It establishes a binding covenant that cannot be amended or dissolved except by mutual assent or exceptional statutory decree. The mechanical question arises: can a cryptographic transaction, triggered purely by smart-contract code triggers without immediate human validation, meet the classic thresholds of mutual assent and reciprocity?

### The Assent Parameters of Programmatic Covenants
Historically, courts require a meeting of the minds—manifested as a clear offer and matching acceptance. In programmatic code blocks, the assent is expressed at the time of compiling and deploying the transaction onto the ledger. The parties have negotiated the parameters, and by committing their private signature keys, they declare absolute assent to any programmatic actions the script executes. 

> "Assent in smart contracts is not a retrospective question. It is an anticipatory commitment. By signing the parent block, the attorney binds their client to any automated outcomes the logical operators yield."

However, friction emerges if the code contains bugs or outcomes that diverge from the natural plain-language intent of the parties. Under standard common law principles, unilateral mistake rarely voids a covenant unless the non-mistaken party had reason to know of the error. In civil jurisdictions, courts retain more power to realign contracts to meet good faith criteria (Article 148). It is therefore advisable that all smart covenants incorporate an alternative 'kill-switch' clause allowing physical attorney dispute arbitration before the state Wilmington courts.`,
      authorName: language === 'ar' ? "تشارلز هارينغتون، مستشار ملكي" : "Charles Harrington, KC",
      authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=128",
      date: language === 'ar' ? "الاثنين، ١٣ يوليو ٢٠٢٦" : "Monday, July 13, 2026",
      readTime: language === 'ar' ? "مطالعة في ٧ دقائق" : "7 min read",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000",
      isInternal: false,
      comments: [
        { 
          id: "com-1", 
          authorName: language === 'ar' ? "أ.د. أمينة الجميل" : "Hon. Amina El-Gamil", 
          content: language === 'ar'
            ? "أطروحة فقهية استثنائية يا تشارلز. لقد اتسمت المحاكم المصرية بالحرص والحيطة دائماً، ولكن أحكام التحكيم الأخيرة في القاهرة تظهر مرونة متزايدة في الاعتراف بالبصمة الرقمية والتوقيع الإلكتروني كتعبير صحيح عن الإرادة والتراضي."
            : "An exceptional treatise, Charles. The Egyptian court has indeed been cautious, but prior arbitral rulings in Cairo show a growing willingness to recognize digital keys as valid expressions of assent.", 
          date: language === 'ar' ? "بالأمس" : "Yesterday" 
        }
      ]
    },
    {
      id: "post-2",
      title: language === 'ar'
        ? "تقييم نظرية القوة القاهرة والظروف الطارئة في عقود الخدمات عابرة الحدود بعد عام ٢٠٢٥"
        : "Evaluating Force Majeure in Cross-Border Service Timelines Post-2025",
      category: language === 'ar' ? "لوائح ومنازعات قضائية" : "Litigation Advisory",
      excerpt: language === 'ar'
        ? "مراجعة عملية للشروط الصارمة المطلوبة للتمسك بنظرية استحالة التنفيذ في عقود التوريد والنقل والخدمات التقنية عقب التعديلات التنظيمية والجمارك الأخيرة."
        : "Reviewing the heightened threshold required to invoke exceptional impossibility doctrines in maritime and software service contracts following recent trade regulatory overrides.",
      content: language === 'ar'
        ? `في ظل تشابك سلاسل التوريد والخدمات البرمجية عبر القارات، تتعرض الالتزامات والمهل الزمنية للعديد من الهزات والقرارات السيادية والاضطرابات الجمركية المفاجئة.

يلجأ المستشارون القانونيون في كثير من الأحيان إلى بنود القوة القاهرة كخيار بديهي لدفع المسؤولية العقدية، ومع ذلك فإن تطبيق هذه النظرية يتطلب إثبات ثلاثة شروط تراكمية صارمة:
١. أن يكون الحدث طارئاً وغير متوقع تماماً وقت إبرام العقد.
٢. أن يجعل الحدث تنفيذ الالتزام مستحيلاً استحالة مطلقة، وليس مجرد مرهق أو مكلف مالياً.
٣. ألا يكون للطرف المخل أي يد أو تقصير في وقوع هذا الحدث.

وبموجب المبادئ القضائية المستقرة وأحكام محاكم النقض والتحكيم البحري، فإن التضخم الاقتصادي أو العقوبات التجارية الاعتيادية لا تمثل قوة قاهرة ترفع التزام الأداء. فإذا كانت هناك مسارات برمجية أو لوجستية بديلة لتنفيذ العقد - حتى لو كبدت المقاول ثلاثة أضعاف الميزانية المحددة - يظل الأداء مطلوباً نظاماً وقانوناً. وننصح جميع الزملاء بالتدقيق الشديد في تحديد الاستثناءات وتعيين حدود المسؤولية بدقة بدلاً من الاعتماد على البنود العامة الكلاسيكية.`
        : `In the globalized corporate network, performance timelines are vulnerable to unprecedented regulatory changes, transit bottlenecks, and sovereign shutdowns. 

Counsels frequently reach for force majeure boilerplate sections, yet invoking the doctrine requires proving three absolute hurdles:
1. The event was entirely unforeseeable at the time of contract execution.
2. The event rendered performance objectively impossible, not merely more expensive.
3. The event was external to the defaulting party's control.

Under recent maritime rulings, economic inflation or standard trade blockades do not meet the bar for absolute impossibility. If alternative routes exist—even if they cost 3x the original budget—performance remains legally required. Counsels drafting international NDAs or supply-chain agreements must carefully specify exceptions rather than relying on standard 'Acts of God' boilerplate parameters.`,
      authorName: language === 'ar' ? "أ.د. أمينة الجميل" : "Amina El-Gamil",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128",
      date: language === 'ar' ? "٩ يوليو ٢٠٢٦" : "July 09, 2026",
      readTime: language === 'ar' ? "مطالعة في ٥ دقائق" : "5 min read",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1000",
      isInternal: false,
      comments: []
    },
    {
      id: "post-3",
      title: language === 'ar'
        ? "سري داخلي: دليل مكاتب هارينغتون لإعداد مذكرات شروط عدم المنافسة والسرية التجارية"
        : "INTERNAL: The Harrington Firm Non-Compete Pleading Guide (2026)",
      category: language === 'ar' ? "لوائح واستراتيجيات داخلية" : "Firm Playbook",
      excerpt: language === 'ar'
        ? "ملف سري ومقيد: الاستراتيجيات المعتمدة للديوان والدفوع الجاهزة لحماية السرية التجارية ومنع المنافسة الجغرافية بمصر ومحاكم ديلاوير."
        : "Strictly Confidential: The firm's pre-approved pleading arguments and evidentiary outlines to defend or enforce geographical covenants in Wilmington.",
      content: language === 'ar'
        ? `**توجيه داخلي مقيد وخاص بزملاء وشيوخ مهنة الديوان فقط**

يستعرض هذا الدليل الاستراتيجي السلسلة الإجرائية الدقيقة التي يجب اتباعها عند صياغة مذكرات الدعاوى لإنفاذ أو دفع بنود عدم المنافسة والسرية التجارية لعملائنا من المؤسسات والشركات الكبرى.

### ١. قائمة فحص المستندات والأدلة المطلوبة
قبل الشروع في قيد أي صحيفة دعوى أمام محاكم ديلاوير أو المحاكم الاقتصادية بمصر، يجب على المستشار المساعد جمع:
* العقد الأصلي الموقع متضمناً الباب الرابع الخاص بشروط السرية وعدم المنافسة بوضوح تام.
* سجلات تقنية تثبت ولوج الموظف الفعلي لقواعد البيانات والشيفرات البرمجية وأسرار الابتكار للشركة.
* إثباتات مادية واضحة لقيام الطرف الثاني بممارسات تنافسية ضارة أو استقطاب عملاء الشركة.

### ٢. الدفوع القانونية المضادة للمدعى عليه
إذا كنا نمثل الموظف أو الطرف الثاني (المدعى عليه)، يجب على الزملاء الدفع بـ:
* اتساع النطاق الجغرافي للشرط (على سبيل المثال: شمول القاهرة وديلاوير معاً) وهو ما يمثل تعسفاً ظاهراً في خدمات برمجية سحابية بطبيعتها.
* المبالغة في مدة سريان القيد (تجاوز ١٢ شهراً) مما يشكل قيداً غير قانوني على حرية العمل ومخالفة للمبادئ الدستورية المقررة.
* غياب المقابل المالي العادل (عدم صرف تعويض استثنائي محدد مقابل التزام عدم المنافسة عند توقيع العقد).`
        : `**RESTRICTED DIRECTIVE — FOR ATTORNEY WORKPRODUCT OVERSIGHT ONLY**

This internal playbook outlines the exact strategic sequences to utilize when enforcing restrictive non-compete covenants on behalf of corporate clients.

### 1. Evidentiary Threshold Checklist
Before drafting any pleading folders under Wilmington courts, the associate must gather:
* Original Signed Employment Instrument with Section 4 (Restrictive Covenants) highlighted.
* Evidentiary logs demonstrating direct access to trade secret source structures (e.g., git commits, login histories).
* Documented proof of client solicitation or competitive damage.

### 2. Standard Defense Deflections
If representing the defendant (attorney), always assert:
* Geographical breadth (Cairo + Wilmington) is unreasonably broad for software services that are purely cloud-native.
* Overly restrictive timelines (exceeding 12 months) operate as an illegal restraint of trade.
* Absence of specific consideration (no lump-sum bonus was disbursed upon signature).`,
      authorName: language === 'ar' ? "تشارلز هارينغتون، مستشار ملكي" : "Charles Harrington, KC",
      authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=128",
      date: language === 'ar' ? "٢٨ يونيو ٢٠٢٦" : "June 28, 2026",
      readTime: language === 'ar' ? "مطالعة في ١٢ دقيقة" : "12 min read",
      imageUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1000",
      isInternal: true,
      comments: [],
      associatedDocs: ["doc-1", "doc-2"]
    }
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedPost) return;

    const newCom: Comment = {
      id: "com-" + Math.random().toString(36).substring(2, 9),
      authorName: newCommentAuthor,
      content: newCommentText,
      date: language === 'ar' ? "الآن" : "Just now"
    };

    selectedPost.comments.push(newCom);
    setNewCommentText('');
    alert(language === 'ar' ? "تم إيداع تعليقك الاستشاري بنجاح." : "Comment appended to thread, Counselor.");
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (gazetteEmail.trim()) {
      setGazetteSubscribed(true);
      setGazetteEmail('');
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeTab === 'internal') return p.isInternal;
    return !p.isInternal;
  });

  const featuredPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1);

  return (
    <div className={`space-y-8 animate-fade-in ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      
      {/* 1. GAZETTE ARCHIVE HOME VIEW */}
      {!selectedPost ? (
        <div className="space-y-8">
          
          {/* Header Masthead */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-navy-900 pb-5 gap-4">
            <div>
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-burgundy-600 block">
                {language === 'ar' ? "الجريدة القانونية الرسمية" : "THE LEGAL GAZETTE"}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold uppercase text-navy-900 mt-1">
                {t.gazette.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-xl font-serif">
                {t.gazette.subtitle}
              </p>
            </div>

            {/* Public vs Private toggle */}
            <div className={`flex border border-navy-900 rounded-sm overflow-hidden text-xs shrink-0 bg-white ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <button
                onClick={() => setActiveTab('public')}
                className={`py-2 px-4 font-serif uppercase tracking-wider font-bold cursor-pointer ${
                  activeTab === 'public' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:text-navy-900'
                }`}
              >
                {language === 'ar' ? "المنشورات العامة" : "Public Dispatches"}
              </button>
              <button
                onClick={() => setActiveTab('internal')}
                className={`py-2 px-4 font-serif uppercase tracking-wider font-bold cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'internal' ? 'bg-burgundy-600 text-white' : 'text-gray-500 hover:text-navy-900'
                }`}
              >
                <Lock className="w-3 h-3" /> {language === 'ar' ? "ملفات الديوان العميقة" : "Firm Deep Files"}
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${language === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
            
            {/* L Columns - Articles list (8/12) */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Featured Lead Story */}
              {featuredPost && (
                <div 
                  onClick={() => setSelectedPost(featuredPost)}
                  className="group cursor-pointer border border-navy-900 bg-white p-6 rounded-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className={`flex justify-between items-center border-b border-gray-100 pb-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs font-serif uppercase tracking-widest text-burgundy-600 font-bold">
                      {language === 'ar' ? `[منشور رئيسي متميز] • ${featuredPost.category}` : `[FEATURED DISPATCH] • ${featuredPost.category}`}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{featuredPost.date}</span>
                  </div>

                  <h3 className="font-serif text-2xl md:text-3xl font-bold uppercase text-navy-900 leading-tight group-hover:text-burgundy-600 transition-colors">
                    {featuredPost.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed font-serif">
                    {featuredPost.excerpt}
                  </p>

                  <div className={`pt-2 flex justify-between items-center text-xs font-serif italic text-gray-500 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{language === 'ar' ? "بقلم المستشار " : "By Counselor "}{featuredPost.authorName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
                  </div>
                </div>
              )}

              {/* Secondary Dispatches list */}
              {secondaryPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {secondaryPosts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPost(p)}
                      className="bg-white border border-gray-200 p-5 rounded-sm hover:border-navy-900/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-burgundy-600 font-bold uppercase block mb-1">
                          {p.category}
                        </span>
                        <h4 className="font-serif font-bold text-base text-navy-900 uppercase leading-snug hover:text-burgundy-600 transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <p className="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed font-serif">
                          {p.excerpt}
                        </p>
                      </div>

                      <div className={`pt-4 mt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-mono uppercase ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span>{p.date}</span>
                        <span>{p.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* R Columns - Indexes & Sidebar (4/12) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Gazette Editorial Index List */}
              <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm relative overflow-hidden">
                <h4 className={`font-serif font-bold text-xs uppercase tracking-widest text-navy-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Newspaper className="w-4 h-4 text-burgundy-600" /> {language === 'ar' ? "فهرس دوريات الجريدة القانونية" : "GAZETTE BULLETIN INDEX"}
                </h4>

                <div className="space-y-4 font-serif">
                  {posts.map((p, idx) => (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedPost(p)}
                      className={`flex gap-3 items-start cursor-pointer group ${language === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                    >
                      <span className="font-serif font-bold text-lg text-gold-500 w-6 shrink-0 text-center">
                        [0{idx + 1}]
                      </span>
                      <div>
                        <h5 className="font-bold text-xs text-navy-900 uppercase leading-tight group-hover:text-burgundy-600 transition-colors line-clamp-2">
                          {p.title}
                        </h5>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{p.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gazette Newsletter dispatch */}
              <div className="bg-parchment-card p-5 border border-gray-300 rounded-sm">
                <span className="font-serif text-[10px] font-bold uppercase text-burgundy-600 block mb-1">
                  {language === 'ar' ? "قائمة النشرات" : "DISPATCH LIST"}
                </span>
                <h4 className="font-serif font-bold text-base text-navy-900 uppercase">
                  {language === 'ar' ? "الاشتراك في النشرات الدورية" : "Subscribe to dispatches"}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {language === 'ar' 
                    ? "تلقَّ التنبيهات الفقهية والقضائية والتحليلات مباشرة على مكتب ديوانك بخصوصية تامة." 
                    : "Receive physical and cognitive jurisprudential alerts straight to your chambers desk. Absolute confidentiality."}
                </p>

                {gazetteSubscribed ? (
                  <div className="mt-4 p-3 border border-navy-900 bg-white rounded-sm text-xs text-navy-900 font-serif">
                    {language === 'ar' ? "✓ سيادة المستشار، تم تسجيل اشتراكك بنجاح." : "✓ Counselor, your subscription is enrolled."}
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="mt-4 space-y-2">
                    <input 
                      type="email"
                      value={gazetteEmail}
                      onChange={(e) => setGazetteEmail(e.target.value)}
                      placeholder={language === 'ar' ? "أدخل البريد الإلكتروني للمستشار..." : "Enter counselor email..."}
                      required
                      className="w-full bg-white border border-gray-300 py-1.5 px-3 text-xs focus:outline-none focus:border-gold-500 rounded-sm placeholder:italic placeholder:text-gray-400"
                    />
                    <button 
                      type="submit"
                      className="w-full bg-navy-900 hover:bg-burgundy-600 text-white text-[11px] font-serif uppercase tracking-wider font-bold py-2 rounded-sm cursor-pointer transition-colors"
                    >
                      {language === 'ar' ? "تسجيل الآن" : "Enlist"}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* 2. FULL ARTICLE PAGE READER */
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-sm shadow-md p-6 md:p-8 animate-fade-in relative">
          
          {/* Back button */}
          <button 
            onClick={() => setSelectedPost(null)}
            className={`flex items-center gap-1 font-serif text-xs uppercase tracking-wider text-gray-500 hover:text-navy-900 mb-6 cursor-pointer ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <ArrowLeft className={`w-4 h-4 stroke-[2.5] ${language === 'ar' ? 'rotate-180' : ''}`} /> {t.gazette.back}
          </button>

          {/* Article Header */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-xs font-serif uppercase tracking-widest text-burgundy-600 font-bold block">
                {selectedPost.category}
              </span>
              {selectedPost.isInternal && (
                <span className="text-[9px] font-mono bg-burgundy-600 text-white px-2 py-0.5 rounded-sm font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {language === 'ar' ? "ملف داخلي مقيد" : "INTERNAL DEEP FILE"}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-bold uppercase text-navy-900 leading-tight">
              {selectedPost.title}
            </h1>

            <div className={`flex items-center justify-between border-y border-gray-100 py-3 text-xs text-gray-500 font-serif ${language === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <img 
                  src={selectedPost.authorAvatar} 
                  alt={selectedPost.authorName}
                  className="w-8 h-8 rounded-full border border-gray-200" 
                />
                <div>
                  <span className="font-bold text-navy-900 block">{language === 'ar' ? "بقلم المستشار " : "By Counselor "}{selectedPost.authorName}</span>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">{selectedPost.date}</span>
                </div>
              </div>

              <div className={`flex items-center gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Clock className="w-4 h-4" />
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            {/* Speech Assistant Block */}
            <div className={`flex flex-col sm:flex-row items-center justify-between p-3.5 bg-burgundy-600/5 border border-burgundy-600/10 rounded-sm mt-4 text-xs gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakPost(selectedPost.id, selectedPost.title + ". " + selectedPost.content)}
                  className="bg-navy-900 hover:bg-burgundy-600 text-white font-serif uppercase tracking-wider text-[11px] font-bold py-1.5 px-4 rounded-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {speakingPostId === selectedPost.id ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                      {language === 'ar' ? "إيقاف القراءة" : "Stop Speech"}
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      {language === 'ar' ? "قراءة المقال صوتياً" : "Read Aloud"}
                    </>
                  )}
                </button>
                {speakingPostId === selectedPost.id && (
                  <span className="text-[10px] font-serif text-burgundy-800 font-bold animate-pulse">
                    {language === 'ar' ? "جاري تشغيل الكلام..." : "Narrating..."}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-gray-400 font-bold">
                  {language === 'ar' ? "سرعة الكلام:" : "Speed:"} {speechRate}x
                </span>
                <input 
                  type="range"
                  min="0.6"
                  max="1.3"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSpeechRate(val);
                    if (speakingPostId === selectedPost.id) {
                      speakPost(selectedPost.id, selectedPost.title + ". " + selectedPost.content); // stop
                      setTimeout(() => speakPost(selectedPost.id, selectedPost.title + ". " + selectedPost.content), 60); // start with new rate
                    }
                  }}
                  className="w-20 accent-burgundy-600 cursor-pointer h-1"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="my-6 border border-gray-200 rounded-sm overflow-hidden h-64 md:h-80 relative bg-parchment">
            <img 
              src={selectedPost.imageUrl} 
              alt={selectedPost.title}
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Content Body */}
          <article className="prose max-w-none text-gray-800 text-sm md:text-base leading-relaxed font-serif whitespace-pre-line border-b border-gray-100 pb-8 mb-8">
            {selectedPost.content}
          </article>

          {/* Comments Section */}
          <div className="space-y-6">
            <h4 className={`font-serif font-bold text-lg text-navy-900 uppercase border-b border-gray-100 pb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? `التعليقات والمناقشات الفقهية (${selectedPost.comments.length})` : `Thread Comments (${selectedPost.comments.length})`}
            </h4>

            {selectedPost.comments.length > 0 ? (
              <div className="space-y-4">
                {selectedPost.comments.map(com => (
                  <div key={com.id} className={`p-4 bg-parchment-light border border-gray-200 rounded-sm flex gap-3 ${language === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                    <div className="w-8 h-8 rounded-full bg-parchment-dark border border-gray-300 flex items-center justify-center font-serif font-bold text-xs uppercase text-navy-900 shrink-0 select-none">
                      {com.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className={`flex items-baseline gap-2 text-xs ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="font-serif font-bold text-navy-900">{com.authorName}</span>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{com.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-serif mt-1.5 leading-relaxed">
                        {com.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-gray-400 italic font-serif ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? "لا توجد ملاحظات أو آراء فقهية منشورة على هذا الجزء بعد. بادر بإيداع رأيك الاستشاري أدناه." : "No comments submitted on this brief. Be the first to consult below."}
              </p>
            )}

            {/* Submit Comment */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 block font-bold">
                    {language === 'ar' ? "توقيع المستشار" : "Counselor Signature"}
                  </label>
                  <input 
                    type="text"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    required
                    className={`w-full bg-transparent border-b border-gray-300 py-1.5 text-xs font-serif focus:outline-none focus:border-gold-500 rounded-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 block font-bold">
                  {language === 'ar' ? "الرأي الاستشاري والفقهي" : "Advisory Argument"}
                </label>
                <textarea 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={language === 'ar' ? "أدخل تدوينات الامتثال أو الرأي الفقهي المعتمد للشركاء حول هذه المسألة..." : "Enter your professional review arguments on this file..."}
                  required
                  rows={3}
                  className={`w-full bg-transparent border border-gray-300 py-2 px-3 text-xs font-serif focus:outline-none focus:border-gold-500 rounded-sm resize-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className={`pt-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <button
                  type="submit"
                  className="bg-navy-900 hover:bg-burgundy-600 text-white text-xs font-serif uppercase tracking-wider font-bold py-2 px-5 rounded-sm cursor-pointer transition-colors inline-flex items-center gap-1"
                >
                  {language === 'ar' ? "نشر التعليق والملاحظة" : "Submit Comment"} <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
