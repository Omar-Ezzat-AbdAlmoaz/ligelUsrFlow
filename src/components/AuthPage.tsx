import React, { useState } from 'react';
import { 
  Shield, Mail, Lock, User, Briefcase, Eye, EyeOff, 
  ChevronRight, ChevronLeft, Check, Compass, Scale, Info 
} from 'lucide-react';
import { User as UserType } from '../types';
import { translations, Language } from '../lib/translations';

interface AuthPageProps {
  onAuthComplete: (user: UserType) => void;
  onBackToLanding: () => void;
  language?: Language;
}

type AuthMode = 'login' | 'register' | 'onboarding';

export default function AuthPage({ onAuthComplete, onBackToLanding, language = 'en' }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('counselor@firm.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register Multi-step states
  const [regStep, setRegStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [barId, setBarId] = useState('');
  const [teamSize, setTeamSize] = useState('1');
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  
  // Onboarding Slider states
  const [onboardSlide, setOnboardSlide] = useState(0);

  const t = translations[language];

  const practiceAreas = language === 'ar' ? [
    "الشركات والأوراق المالية", "الملكية الفكرية وبراءات الاختراع", "التقاضي التجاري والنزاعات", 
    "قانون العمل والتوظيف", "الاندماج والاستحواذ", "القانون البحري والجنائيات", 
    "الدفاع الجنائي العام", "قوانين الضرائب والجمارك", "التخطيط العقاري والمواريث", "التحكيم الدولي ومجلس تسوية المنازعات"
  ] : [
    "Corporate & Securities", "Intellectual Property", "Commercial Litigation", 
    "Labor & Employment", "Mergers & Acquisitions", "Maritime & Admiralty", 
    "Criminal Defense", "Taxation", "Estate Planning", "Arbitration & ADR"
  ];

  const onboardingSlides = [
    {
      title: language === 'ar' ? "مستشارك القانوني بالذكاء الاصطناعي" : "Your AI Legal Counselor",
      desc: language === 'ar' 
        ? "نموذجنا مأصل ومربط بالكامل بالنصوص التشريعية والمواد والمدونات القانونية. حاور حول النظريات الفقهية المعقدة، واحصل على استشهادات معتمدة بدقة، وصغ مذكراتك القانونية فوراً."
        : "Our model is fully grounded in statutory authority and case indexes. Converse about complex doctrines, obtain authoritative citations, and draft legal dispatches instantly.",
      icon: <Scale className="w-16 h-16 text-gold-500 stroke-[1.5]" />
    },
    {
      title: language === 'ar' ? "تدقيق المستندات الآمن" : "Secure Document Audits",
      desc: language === 'ar'
        ? "تخضع جميع الملفات المحملة لفحص ودراسة دقيقة دون مغادرة جلستك المشفرة. دقق في العقود والاتفاقيات، وتعرف على جدول الالتزامات ونطاق المخاطر."
        : "All uploads undergo safe vector parsing without leaving your encrypted session. Inspect corporate agreements side-by-side, map chronological performance deadlines, and scan for liabilities.",
      icon: <Shield className="w-16 h-16 text-gold-500 stroke-[1.5]" />
    },
    {
      title: language === 'ar' ? "صياغة هوية ديوانك" : "Establish Your Firm's Brand",
      desc: language === 'ar'
        ? "قم بضبط إخلاء المسؤولية الافتراضي الخاص بك، واختر بروتوكول الاقتباس والمراجع المفضل، وحمل قوالب الصياغة المخصصة، وقم بالتبديل بين العربية والإنجليزية بسلاسة تامة."
        : "Configure standard legal disclaimers, choose preferred citation protocols, upload custom templates, and toggle bilingual Arabic-English workspaces to match your jurisdiction's guidelines.",
      icon: <Compass className="w-16 h-16 text-gold-500 stroke-[1.5]" />
    }
  ];

  const handleTogglePractice = (p: string) => {
    setSelectedPractices(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setMode('onboarding');
    }
  };

  const handleRegisterNext = () => {
    if (regStep < 3) {
      setRegStep(prev => prev + 1);
    } else {
      setMode('onboarding');
    }
  };

  const handleOnboardComplete = () => {
    const finalUser: UserType = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      name: name || (language === 'ar' ? "المستشار شارل" : "Counselor Charles"),
      email: email || loginEmail || "counselor@firm.com",
      role: "lawyer",
      firmName: firmName || (language === 'ar' ? "هارينغتون وشركاؤه للمحاماة" : "Harrington & Partners"),
      barId: barId || "EBA-9941-26",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256"
    };
    onAuthComplete(finalUser);
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col lg:flex-row font-sans text-navy-900 selection:bg-gold-500 selection:text-navy-900">
      
      {/* 1. Left Section - Authentication Panels */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-12 lg:p-16 bg-parchment-light min-h-screen relative">
        {/* Brand Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToLanding}>
            <Scale className="w-6 h-6 text-gold-500 stroke-[2]" />
            <span className="font-serif font-bold text-sm uppercase tracking-wider text-navy-900">
              {language === 'ar' ? "منصة المستشار القانوني" : "The Counselor Suite"}
            </span>
          </div>
          <button 
            onClick={onBackToLanding}
            className="text-xs font-serif uppercase tracking-wider text-gray-500 hover:text-navy-900"
          >
            {language === 'ar' ? "← العودة إلى الجريدة" : "← Back to Gazette"}
          </button>
        </div>

        {/* Dynamic Forms Core */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* A. LOGIN MODE */}
          {mode === 'login' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase text-navy-900 tracking-tight">
                  {t.auth.welcome}
                </h2>
                <p className="font-serif italic text-sm text-gray-600 mt-1">
                  {t.auth.subtitle}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6 mt-8">
                {/* Email Input */}
                <div className="relative group border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-gold-500 stroke-[2.5]" />
                  </div>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={language === 'ar' ? "البريد الإلكتروني للمحامي المعتمد..." : "Counselor Email..."}
                    required
                    className={`w-full py-3 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 ${language === 'ar' ? 'pr-7 text-right' : 'pl-7 text-left'}`}
                  />
                </div>

                {/* Password Input */}
                <div className="relative group border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-gold-500 stroke-[2.5]" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={language === 'ar' ? "رمز الدخول / عبارة المرور الأمنية..." : "Security Credential..."}
                    required
                    className={`w-full py-3 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 ${language === 'ar' ? 'pr-7 pl-10 text-right' : 'pl-7 pr-10 text-left'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 cursor-pointer ${language === 'ar' ? 'left-0' : 'right-0'}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className={`flex justify-between items-center text-xs font-serif ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="accent-burgundy-600 border-gray-300 focus-ring-0 w-3.5 h-3.5"
                    />
                    <span className="text-gray-600">{language === 'ar' ? "حفظ تسجيل الدخول المعتمد" : "Retain active login"}</span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => alert(language === 'ar' ? "سيادة المستشار، يجب استعادة كلمة المرور عبر الإدارة." : "Counselor, password recovery must be initiated by your administrative panel.")}
                    className="italic text-burgundy-600 hover:text-navy-900"
                  >
                    {language === 'ar' ? "هل نسيت رمز الدخول؟" : "Forgot credentials?"}
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-navy-900 hover:bg-burgundy-600 text-white py-3 px-6 rounded-sm font-serif uppercase tracking-widest text-xs font-bold transition-colors cursor-pointer border border-transparent mt-2"
                >
                  {t.auth.loginBtn}
                </button>
              </form>

              <div className="border-t border-gray-200/60 pt-6 text-center text-xs">
                <span className="text-gray-500 font-serif">{language === 'ar' ? "هل تحتاج لرمز دخول معتمد؟ " : "Not yet affiliated with our suite? "}</span>
                <button 
                  onClick={() => setMode('register')}
                  className="text-burgundy-600 font-serif font-bold hover:text-navy-900 uppercase tracking-wider text-[11px]"
                >
                  {t.auth.registerBtn}
                </button>
              </div>
            </div>
          )}

          {/* B. REGISTER MODE (MULTI-STEP) */}
          {mode === 'register' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-serif uppercase tracking-widest text-burgundy-600 font-bold block">
                  {language === 'ar' ? `الخطوة ${regStep} من ٣` : `Step ${regStep} of 3`}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase text-navy-900 mt-1">
                  {language === 'ar' ? "التسجيل في الديوان العام" : "Registry Enrollment"}
                </h2>
                <div className="h-1 bg-gray-200 w-full mt-4 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold-500 transition-all duration-300"
                    style={{ width: `${(regStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Personal Profile */}
              {regStep === 1 && (
                <div className="space-y-4 pt-4">
                  <div className="relative group border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                      <User className="w-4 h-4 text-gray-400 group-focus-within:text-gold-500" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ar' ? "الاسم الكامل (المستشار / المحامي)..." : "Full Name (Attorney / Paralegal)..."}
                      required
                      className={`w-full py-3 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 ${language === 'ar' ? 'pr-7 text-right' : 'pl-7 text-left'}`}
                    />
                  </div>

                  <div className="relative group border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                      <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-gold-500" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'ar' ? "عنوان البريد الإلكتروني المهني..." : "Professional Email Address..."}
                      required
                      className={`w-full py-3 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 ${language === 'ar' ? 'pr-7 text-right' : 'pl-7 text-left'}`}
                    />
                  </div>

                  <div className="relative group border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                      <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-gold-500" />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === 'ar' ? "إنشاء رمز المرور الرئيسي..." : "Establish Master Credential..."}
                      required
                      className={`w-full py-3 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 ${language === 'ar' ? 'pr-7 text-right' : 'pl-7 text-left'}`}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Firm Details */}
              {regStep === 2 && (
                <div className="space-y-4 pt-4">
                  <div className="relative group border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                      <Briefcase className="w-4 h-4 text-gray-400 group-focus-within:text-gold-500" />
                    </div>
                    <input 
                      type="text" 
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      placeholder={language === 'ar' ? "اسم المؤسسة أو الشراكة القانونية..." : "Designate Firm or Legal Department Name..."}
                      required
                      className={`w-full py-3 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 ${language === 'ar' ? 'pr-7 text-right' : 'pl-7 text-left'}`}
                    />
                  </div>

                  <div className="relative group border-b border-gray-300 focus-within:border-gold-500 transition-colors">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                      <Scale className="w-4 h-4 text-gray-400 group-focus-within:text-gold-500" />
                    </div>
                    <input 
                      type="text" 
                      value={barId}
                      onChange={(e) => setBarId(e.target.value)}
                      placeholder={language === 'ar' ? "رقم قيد نقابة المحامين (اختياري)..." : "Bar Association License ID (Optional)..."}
                      className={`w-full py-3 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 ${language === 'ar' ? 'pr-7 text-right' : 'pl-7 text-left'}`}
                    />
                  </div>

                  <div className="pt-2">
                    <label className={`text-xs font-serif uppercase tracking-wider text-gray-500 block mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {language === 'ar' ? "عدد المحامين والمستشارين بالمؤسسة" : "Firm Attorney Count"}
                    </label>
                    <select 
                      value={teamSize} 
                      onChange={(e) => setTeamSize(e.target.value)}
                      className={`w-full bg-transparent border border-gray-300 text-sm text-navy-900 rounded-sm py-2 px-3 focus:outline-none focus:border-gold-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      <option value="1">{language === 'ar' ? "مكتب مستقل (مستشار واحد)" : "Solo Practice (1 Counsel)"}</option>
                      <option value="2-10">{language === 'ar' ? "شركاء متخصصون (٢ - ١٠ مستشارين)" : "Boutique Partners (2 - 10 Counsels)"}</option>
                      <option value="11-50">{language === 'ar' ? "شركة محاماة إقليمية (١١ - ٥٠ مستشاراً)" : "Regional Firm (11 - 50 Counsels)"}</option>
                      <option value="51+">{language === 'ar' ? "مؤسسة عامة للشركات الكبرى (أكثر من ٥٠ مستشاراً)" : "General Corporate Firm (50+ Counsels)"}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Practice Areas Choice */}
              {regStep === 3 && (
                <div className="space-y-4 pt-2">
                  <span className={`text-xs font-serif uppercase tracking-wider text-gray-500 block mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? "مجالات التركيز الفقهي والقانوني الرئيسية" : "Primary Jurisprudential Focus Areas"}
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                    {practiceAreas.map((p, idx) => {
                      const isSelected = selectedPractices.includes(p);
                      return (
                        <button
                           key={idx}
                           type="button"
                           onClick={() => handleTogglePractice(p)}
                           className={`text-xs px-3 py-1.5 border transition-all cursor-pointer rounded-sm ${
                             isSelected 
                               ? 'bg-navy-900 border-navy-900 text-white font-medium' 
                               : 'bg-transparent border-gray-300 text-gray-600 hover:border-navy-900'
                           }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step controls */}
              <div className={`flex justify-between items-center pt-6 gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                {regStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setRegStep(prev => prev - 1)}
                    className={`flex items-center gap-1 font-serif text-xs uppercase tracking-wider text-gray-500 hover:text-navy-900 cursor-pointer ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                  >
                    {language === 'ar' ? <ChevronRight className="w-4 h-4 stroke-[2.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[2.5]" />} {language === 'ar' ? "الخطوة السابقة" : "Prior Step"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-serif text-xs uppercase tracking-wider text-burgundy-600 hover:text-navy-900 cursor-pointer"
                  >
                    {language === 'ar' ? "الولوج بدلاً من ذلك" : "Login Instead"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRegisterNext}
                  className={`flex items-center gap-1.5 bg-navy-900 hover:bg-burgundy-600 text-white py-2.5 px-5 rounded-sm font-serif uppercase tracking-wider text-xs font-bold transition-colors cursor-pointer border border-transparent ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                >
                  {regStep === 3 ? (language === 'ar' ? "التسجيل وبدء التهيئة" : "Enroll & Onboard") : (language === 'ar' ? "الخطوة التالية" : "Advance Step")} {language === 'ar' ? <ChevronLeft className="w-4 h-4 stroke-[2.5]" /> : <ChevronRight className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </div>
            </div>
          )}

          {/* C. ONBOARDING SLIDES MODE */}
          {mode === 'onboarding' && (
            <div className="space-y-8 py-4">
              <div className="text-center">
                <span className="text-xs font-serif uppercase tracking-widest text-burgundy-600 font-bold block mb-1">
                  {language === 'ar' ? "دليل تهيئة مقر المستشار" : "Chambers Introduction"}
                </span>
                <h2 className="font-serif text-3xl font-bold uppercase text-navy-900">
                  {language === 'ar' ? "أهلاً بك في منصة المستشار المعتمدة" : "Welcome to the Counselor Suite"}
                </h2>
              </div>

              {/* Active Slide Rendering */}
              <div className="border border-navy-900/10 p-6 bg-parchment rounded-sm text-center flex flex-col items-center">
                <div className="mb-6 p-4 bg-parchment-dark/30 rounded-full border border-navy-900/5">
                  {onboardingSlides[onboardSlide].icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 uppercase mb-3">
                  {onboardingSlides[onboardSlide].title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-sm">
                  {onboardingSlides[onboardSlide].desc}
                </p>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center items-center gap-2">
                {onboardingSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setOnboardSlide(index)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      index === onboardSlide ? 'w-6 bg-burgundy-600' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Action */}
              <div className="flex justify-between items-center pt-2">
                {onboardSlide > 0 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardSlide(prev => prev - 1)}
                    className="flex items-center gap-1 font-serif text-xs uppercase tracking-wider text-gray-500 hover:text-navy-900 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" /> {language === 'ar' ? "رجوع" : "Back"}
                  </button>
                ) : (
                  <div className="w-10" />
                )}

                {onboardSlide < onboardingSlides.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardSlide(prev => prev + 1)}
                    className="flex items-center gap-1.5 bg-navy-900 hover:bg-burgundy-600 text-white py-2.5 px-6 rounded-sm font-serif uppercase tracking-wider text-xs font-bold transition-all cursor-pointer border border-transparent"
                  >
                    {language === 'ar' ? "متابعة" : "Continue"} <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOnboardComplete}
                    className="flex items-center gap-2 bg-burgundy-600 hover:bg-navy-900 text-white py-3 px-8 rounded-sm font-serif uppercase tracking-widest text-xs font-bold transition-all cursor-pointer border border-transparent animate-pulse"
                  >
                    {language === 'ar' ? "الولوج للمقر" : "Enter Chambers"} <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 font-mono border-t border-gray-200/40 pt-4">
          <Shield className="w-3.5 h-3.5" /> {language === 'ar' ? "بيئة آمنة للمحامي والموكل (تشفير سيادي معتمد AES-256)" : "SECURE ATTORNEY-CLIENT ENVIRONMENT (AES-256 ENCRYPTED)"}
        </div>
      </div>

      {/* 2. Right Section - Beautiful Simulated Law Office Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 flex-col justify-between p-12 lg:p-16 relative overflow-hidden paper-grain-dark text-parchment">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-900 via-navy-900/90 to-burgundy-600/30 opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold-500/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-gold-500/5 rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <Scale className="w-8 h-8 text-gold-300 stroke-[1.5]" />
          <span className="font-serif font-bold text-lg uppercase tracking-widest text-parchment">
            {language === 'ar' ? "ديوان مكتب المستشار" : "The Chambers Desk"}
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-md space-y-8">
          <div className="text-gold-300">
            <span className="text-[60px] font-serif leading-none">“</span>
          </div>
          
          <blockquote className="font-serif text-2xl lg:text-3xl italic font-medium leading-relaxed -mt-6">
            {language === 'ar' 
              ? "إن دراسة القانون واسعة وعميقة. لا تكمن العدالة في سرعة الآلة، بل في دقة الحكم المستنبط. دعونا نقوم بأتمتة الصياغة، حتى يتفرغ المستشار لتأصيل الحجج والدفوع." 
              : "The study of law is broad and deep. Justice resides not in the speed of the machine, but in the precision of the judgment. Let us automate the drafting, so the counsel may master the argument."}
          </blockquote>

          <div className="border-t border-gold-500/25 pt-6">
            <cite className="font-serif not-italic font-bold text-sm uppercase tracking-widest text-gold-400 block">
              {language === 'ar' ? "ماركوس توليوس سيسرو (شيشيرون)" : "Marcus Tullius Cicero"}
            </cite>
            <span className="text-xs text-gray-400 font-mono tracking-wider">
              {language === 'ar' ? "عضو السجل الروماني • ٤٣ ق.م" : "MEMBER, ROMAN REGISTRY • 43 B.C."}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-[10px] text-gray-400 font-mono tracking-wider">
          <span>PORTAL VER. 1.0.4</span>
          <span>© 2026 COGNITIVE LEGAL SYSTEMS INC.</span>
        </div>
      </div>

    </div>
  );
}
