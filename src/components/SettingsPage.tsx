import React, { useState } from 'react';
import { 
  Settings, User, Shield, Key, Eye, HelpCircle, Save, Check, Scale, Brain 
} from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface SettingsPageProps {
  language: Language;
}

export default function SettingsPage({ language }: SettingsPageProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'secrets'>('profile');
  
  // Profile settings
  const [lawyerName, setLawyerName] = useState(language === 'ar' ? 'المستشار تشارلز هارينغتون' : 'Counselor Charles Harrington');
  const [firmName, setFirmName] = useState(language === 'ar' ? 'مؤسسة هارينغتون وشركاؤه للمحاماة' : 'Harrington & Partners LLC');
  const [barNumber, setBarNumber] = useState('EGA-902-881-2026');
  const [litigationFocus, setLitigationFocus] = useState(language === 'ar' ? 'العقود الدولية والاستشارات الفقهية' : 'Cross-Border Contracts');
  
  // AI Settings
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');
  const [temperature, setTemperature] = useState(0.3);
  const [ragChunkSize, setRagChunkSize] = useState(500);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className={`max-w-3xl mx-auto space-y-8 animate-fade-in pb-12 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      
      {/* Settings Masthead */}
      <div>
        <span className="font-serif text-xs font-bold uppercase tracking-widest text-burgundy-600 block">
          {language === 'ar' ? "إعدادات المستشار" : "COUNSELOR SETTINGS"}
        </span>
        <h2 className={`font-serif text-3xl font-bold uppercase text-navy-900 mt-1 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Settings className="w-8 h-8 text-gold-500 stroke-[1.2]" /> {t.settings.title}
        </h2>
        <p className="text-gray-500 font-serif italic text-sm mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 ${language === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
        
        {/* L Options Side Rail (3/12) */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-4 rounded-sm font-serif text-xs uppercase tracking-wider font-bold cursor-pointer transition-all ${language === 'ar' ? 'text-right' : 'text-left'} ${
              activeTab === 'profile' 
                ? 'bg-navy-900 text-white' 
                : 'bg-white hover:bg-parchment-light border border-gray-200 text-gray-500 hover:text-navy-900'
            }`}
          >
            {language === 'ar' ? "الملف المهني للمستشار" : "Attorney Profile"}
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2.5 px-4 rounded-sm font-serif text-xs uppercase tracking-wider font-bold cursor-pointer transition-all ${language === 'ar' ? 'text-right' : 'text-left'} ${
              activeTab === 'ai' 
                ? 'bg-navy-900 text-white' 
                : 'bg-white hover:bg-parchment-light border border-gray-200 text-gray-500 hover:text-navy-900'
            }`}
          >
            {language === 'ar' ? "توثيق واختبار النماذج" : "AI Calibration"}
          </button>
          <button
            onClick={() => setActiveTab('secrets')}
            className={`py-2.5 px-4 rounded-sm font-serif text-xs uppercase tracking-wider font-bold cursor-pointer transition-all ${language === 'ar' ? 'text-right' : 'text-left'} ${
              activeTab === 'secrets' 
                ? 'bg-navy-900 text-white' 
                : 'bg-white hover:bg-parchment-light border border-gray-200 text-gray-500 hover:text-navy-900'
            }`}
          >
            {language === 'ar' ? "الخزنة وقاعدة البيانات" : "Secrets Security"}
          </button>
        </div>

        {/* R Config Sheets (9/12) */}
        <div className="md:col-span-9 bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-md">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-fade-in">
                <h4 className="font-serif font-bold text-base text-navy-900 uppercase border-b border-gray-100 pb-3 mb-4">
                  {t.settings.sectionProfile}
                </h4>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 font-bold">
                      {t.settings.userName}
                    </label>
                    <input 
                      type="text" 
                      value={lawyerName}
                      onChange={(e) => setLawyerName(e.target.value)}
                      required
                      className={`w-full bg-transparent border-b-2 border-gray-200 py-1.5 focus:outline-none focus:border-gold-500 text-sm font-serif rounded-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 font-bold">
                      {language === 'ar' ? "المؤسسة أو ديوان العمل" : "Employer Enterprise"}
                    </label>
                    <input 
                      type="text" 
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      required
                      className={`w-full bg-transparent border-b-2 border-gray-200 py-1.5 focus:outline-none focus:border-gold-500 text-sm font-serif rounded-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 font-bold">
                        {t.settings.userRole}
                      </label>
                      <input 
                        type="text" 
                        value={barNumber}
                        onChange={(e) => setBarNumber(e.target.value)}
                        className={`w-full bg-transparent border-b-2 border-gray-200 py-1.5 focus:outline-none focus:border-gold-500 text-sm font-serif rounded-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 font-bold">
                        {language === 'ar' ? "تخصص التقاضي والاستشارات" : "Litigation Focus Specialty"}
                      </label>
                      <input 
                        type="text" 
                        value={litigationFocus}
                        onChange={(e) => setLitigationFocus(e.target.value)}
                        className={`w-full bg-transparent border-b-2 border-gray-200 py-1.5 focus:outline-none focus:border-gold-500 text-sm font-serif rounded-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. AI Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-5 animate-fade-in">
                <h4 className={`font-serif font-bold text-base text-navy-900 uppercase border-b border-gray-100 pb-3 mb-4 flex items-center gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Brain className="w-5 h-5 text-burgundy-600" /> {t.settings.sectionModel}
                </h4>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 font-bold">
                      {t.settings.modelStatus}
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-white border border-gray-200 py-2 px-3 focus:outline-none focus:border-gold-500 text-xs font-serif rounded-sm"
                    >
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended: Complex Legal Reasonings)</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended: Fast audits & briefs parsing)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`flex justify-between items-center text-[10px] font-serif uppercase tracking-wider text-gray-400 font-bold ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span>{language === 'ar' ? "درجة حرارة التفكير الاستنتاجي (حرية الابتكار)" : "Reasoning Temperature"}</span>
                      <span>{temperature}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-navy-900 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 italic font-serif">
                      {language === 'ar' 
                        ? "القيم المنخفضة تولد التزاماً صارماً ومتطابقاً؛ بينما تتيح القيم المرتفعة مرونة وابتكاراً استشارياً." 
                        : "Lower values produce deterministic compliance alignment; higher values introduce advisory versatility."}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-gray-400 font-bold">
                      {language === 'ar' ? "حجم كتلة الاسترجاع وسياق التأصيل الفقهي (كلمات)" : "RAG Grounding Window Chunk (Words)"}
                    </label>
                    <input 
                      type="number" 
                      value={ragChunkSize}
                      onChange={(e) => setRagChunkSize(parseInt(e.target.value) || 500)}
                      className={`w-full bg-transparent border-b-2 border-gray-200 py-1.5 focus:outline-none focus:border-gold-500 text-sm font-serif rounded-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Secrets Tab */}
            {activeTab === 'secrets' && (
              <div className="space-y-5 animate-fade-in">
                <h4 className={`font-serif font-bold text-base text-navy-900 uppercase border-b border-gray-100 pb-3 mb-4 flex items-center gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Shield className="w-5 h-5 text-green-700" /> {language === 'ar' ? "حالة التشفير ومخطط قاعدة البيانات" : "Secrets & Environment Audits"}
                </h4>

                <div className="p-4 bg-parchment border border-gray-300 rounded-sm space-y-3 font-serif">
                  <div className={`flex items-center gap-1.5 text-xs font-mono font-bold text-navy-900 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Shield className="w-4 h-4 text-green-700" /> {language === 'ar' ? "أمان تشفير الحاويات والمفاتيح السيادية" : "ABSOLUTE KEYS CONTAINER SECURITY"}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {language === 'ar' 
                      ? "تعمل المنصة بموجب حاويات معزولة ومؤمنة بالكامل. إن كافة مفاتيح الوصول الحساسة الخاصة بك، وتحديداً مفتاح GEMINI_API_KEY، يتم تخزينها في بيئة الخادم السحابية الآمنة لشركة هارينغتون بموجب إعدادات الشريط الجانبي لمنصة AI Studio." 
                      : "This platform operates under strict isolated full-stack containers. All sensitive third-party API tokens, specifically your GEMINI_API_KEY, are stored securely using platform-managed workflows in the AI Studio sidebar settings."}
                  </p>
                  <p className={`text-xs text-gray-500 italic leading-relaxed border-l-2 border-l-burgundy-600 pl-3 ${language === 'ar' ? 'border-r-2 border-l-0 pr-3 pl-0 text-right' : 'text-left'}`}>
                    {language === 'ar' 
                      ? "لا يتم حفظ أو مشاركة أي مفاتيح على مستودعات GitHub العامة، أو تسريبها للمتصفحات، أو إتاحة الوصول إليها خارج خادم Express السحابي." 
                      : "No keys are ever stored on GitHub, leaked to client browsers, or made accessible outside server-side Express runtime parameters."}
                  </p>
                </div>

                <div className="text-xs space-y-2 font-mono">
                  <div className={`flex justify-between items-center py-2 border-b border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="font-serif text-gray-500">{language === 'ar' ? "قناة اتصال خادم Express:" : "Express Container Ingress:"}</span>
                    <span className="font-serif text-[10px] text-navy-900 bg-parchment px-2 py-0.5 rounded-sm">
                      {language === 'ar' ? "بوابة آمنة وموثوقة" : "Secure Gate Connection"}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center py-2 border-b border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="font-serif text-gray-500">{language === 'ar' ? "منفذ معالجة أصول الويب (Vite):" : "Vite Asset Server:"}</span>
                    <span className="font-serif text-[10px] text-navy-900 bg-parchment px-2 py-0.5 rounded-sm">
                      {language === 'ar' ? "قناة مشفرة نشطة" : "Active Encrypted Channel"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className={`pt-6 border-t border-gray-100 flex justify-between items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              {savedSuccess ? (
                <span className="text-xs font-serif italic text-green-700 flex items-center gap-1">
                  <Check className="w-4 h-4 stroke-[2.5]" /> {t.settings.saveSuccess}
                </span>
              ) : <span />}

              <button
                type="submit"
                className="bg-navy-900 hover:bg-burgundy-600 text-white text-xs font-serif uppercase tracking-wider font-bold py-2 px-6 rounded-sm cursor-pointer transition-colors"
              >
                {t.settings.btnSave}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
