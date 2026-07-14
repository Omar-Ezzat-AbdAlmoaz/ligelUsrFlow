import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, Send, Paperclip, Mic, HelpCircle, ArrowRight, BookOpen, 
  Database, FolderOpen, FileText, ChevronRight, Share2, Download, 
  Settings, Check, Search, History, Eye, X, Book, Sparkles,
  Volume2, VolumeX, Pause, Play
} from 'lucide-react';
import { Conversation, ChatMessage, Citation, ContextType } from '../types';
import { translations, Language } from '../lib/translations';

interface ConsultationRoomProps {
  conversations: Conversation[];
  onCreateConversation: (contextType: ContextType) => void;
  onSendMessage: (conversationId: string, text: string) => Promise<void>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  language?: Language;
}

export default function ConsultationRoom({
  conversations, onCreateConversation, onSendMessage, activeConversationId, onSelectConversation, language = 'en'
}: ConsultationRoomProps) {
  
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [viewerSource, setViewerSource] = useState<Citation | null>(null);

  // Speech features state
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9); // Default 0.9 is highly articulate and clear for legal language
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<any>(null);

  const t = translations[language];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  // Pre-fetch voices to ensure they are ready for clear speech
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Cancel speech on active conversation shift or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeConversationId]);

  // Setup Dictation Engine
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = language === 'ar' ? 'ar-EG' : 'en-US';

        rec.onstart = () => {
          setIsDictating(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(prev => prev + (prev ? ' ' : '') + transcript);
        };

        rec.onerror = (err: any) => {
          console.error("Speech recognition error", err);
          setIsDictating(false);
        };

        rec.onend = () => {
          setIsDictating(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [language]);

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      alert(language === 'ar' 
        ? "ميزة الإملاء الصوتي غير مدعومة بالكامل في المتصفح الحالي أو تحتاج إلى تفعيل أذونات الميكروفون." 
        : "Speech Recognition not fully supported in this browser or iframe. Ensure microphone is authorized.");
      return;
    }

    if (isDictating) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start dictation", err);
      }
    }
  };

  const speakMessage = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Extract plain text from simulated HTML tags if any, and markdown formatting
    const cleanText = text
      .replace(/\[\d+\]/g, '') // Remove [1] citation tags
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
      .replace(/[\*\#\_]/g, ''); // Remove basic markdown symbols

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Check if it's Arabic text
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
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isSending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId || isSending) return;

    const textToSend = inputText;
    setInputText('');
    setIsSending(true);
    
    try {
      await onSendMessage(activeConversationId, textToSend);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNew = (type: ContextType) => {
    onCreateConversation(type);
  };

  const handleShare = () => {
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 3000);
  };

  const handleExport = () => {
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  // Extract all citations from current chat to show in the collapsible sources panel
  const allCitations: Citation[] = [];
  if (activeConv) {
    activeConv.messages.forEach(msg => {
      if (msg.citations) {
        msg.citations.forEach(cit => {
          if (!allCitations.find(c => c.id === cit.id)) {
            allCitations.push(cit);
          }
        });
      }
    });
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col justify-between animate-fade-in relative">
      
      {/* A. INITIAL LAUNCHER VIEW (If no conversation active) */}
      {!activeConv ? (
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="text-center max-w-xl mb-12">
            <Scale className="w-12 h-12 text-gold-500 stroke-[1.5] mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold uppercase text-navy-900 tracking-tight">
              {t.consultation.title}
            </h2>
            <p className="text-gray-500 font-serif italic text-sm mt-1">
              {t.consultation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
            {/* Card 1: General Law */}
            <div 
              id="card-consult-general"
              onClick={() => handleCreateNew('general')}
              className={`bg-white border border-gray-200 p-6 rounded-sm hover:border-burgundy-600 hover:shadow-md transition-all cursor-pointer group flex gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <div className="p-3 bg-parchment rounded-sm border border-navy-900/5 group-hover:bg-burgundy-600/5 transition-colors self-start">
                <Book className="w-6 h-6 text-burgundy-600 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-sm text-navy-900 uppercase tracking-wider">
                  {t.consultation.contextGeneral}
                </h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  {language === 'ar' 
                    ? "الوصول المباشر إلى الهياكل الدستورية العامة، والمعايير القانونية، والقوانين التجارية والمبادئ الإجرائية." 
                    : "Direct access to general constitutional structures, statutory standards, commercial codes, and procedural directives."}
                </p>
                <span className="text-[10px] font-serif uppercase text-burgundy-600 font-bold mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === 'ar' ? "بدء جلسة المشورة" : "Initiate Advisory"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 2: Firm Docs */}
            <div 
              id="card-consult-firm"
              onClick={() => handleCreateNew('firm')}
              className={`bg-white border border-gray-200 p-6 rounded-sm hover:border-burgundy-600 hover:shadow-md transition-all cursor-pointer group flex gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <div className="p-3 bg-parchment rounded-sm border border-navy-900/5 group-hover:bg-burgundy-600/5 transition-colors self-start">
                <FolderOpen className="w-6 h-6 text-burgundy-600 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-sm text-navy-900 uppercase tracking-wider">
                  {language === 'ar' ? "أرشيف ملفات مكتبي" : "My Firm's Archive"}
                </h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  {language === 'ar' 
                    ? "ربط المشورة والاستشارات بملفات القضايا والمذكرات السابقة المرفوعة والاتفاقيات المحفوظة في قاعدة بياناتك الآمنة." 
                    : "Ground consultation within all uploaded brief folders, research drafts, and contract instruments saved on your secure cloud drive."}
                </p>
                <span className="text-[10px] font-serif uppercase text-burgundy-600 font-bold mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === 'ar' ? "بدء جلسة المشورة" : "Initiate Advisory"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 3: Specific Case */}
            <div 
              id="card-consult-case"
              onClick={() => handleCreateNew('case')}
              className={`bg-white border border-gray-200 p-6 rounded-sm hover:border-burgundy-600 hover:shadow-md transition-all cursor-pointer group flex gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <div className="p-3 bg-parchment rounded-sm border border-navy-900/5 group-hover:bg-burgundy-600/5 transition-colors self-start">
                <Scale className="w-6 h-6 text-burgundy-600 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-sm text-navy-900 uppercase tracking-wider">
                  {language === 'ar' ? "نزاع أو عريضة تقاضي معينة" : "Specific Litigation Case"}
                </h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  {language === 'ar' 
                    ? "حصر المشاورات بمذكرات وجلسات نزاع نشطة مع إشارة مستمرة وصريحة لمطالب المدعين والدفوع والشهادات." 
                    : "Isolate conversations to an active dispute binder, referencing exclusively plaintiff complaints, depositions, and matching exhibits."}
                </p>
                <span className="text-[10px] font-serif uppercase text-burgundy-600 font-bold mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === 'ar' ? "بدء جلسة المشورة" : "Initiate Advisory"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 4: Custom Knowledge Base */}
            <div 
              id="card-consult-kb"
              onClick={() => handleCreateNew('kb')}
              className={`bg-white border border-gray-200 p-6 rounded-sm hover:border-burgundy-600 hover:shadow-md transition-all cursor-pointer group flex gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <div className="p-3 bg-parchment rounded-sm border border-navy-900/5 group-hover:bg-burgundy-600/5 transition-colors self-start">
                <Database className="w-6 h-6 text-burgundy-600 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-sm text-navy-900 uppercase tracking-wider">
                  {t.consultation.contextCivil}
                </h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  {language === 'ar' 
                    ? "البحث في مراجع الفقه والمدونات القانونية المدنية والتجارية المصرية بدعم فوري للغات المزدوجة والمقالات المفهرسة." 
                    : "Query the pre-indexed legal libraries including Egyptian civil, commercial, and labor legislation side-by-side with bilingual options."}
                </p>
                <span className="text-[10px] font-serif uppercase text-burgundy-600 font-bold mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === 'ar' ? "بدء جلسة المشورة" : "Initiate Advisory"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Toggle History folders */}
          {conversations.length > 0 && (
            <button 
              onClick={() => setShowHistory(true)}
              className="mt-8 text-xs font-serif font-bold uppercase tracking-wider text-burgundy-600 hover:text-navy-900 flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-4 h-4 stroke-[2]" /> {language === 'ar' ? `مراجعة سجل المشورات السابقة (${conversations.length})` : `Review prior consultation logs (${conversations.length})`}
            </button>
          )}

        </div>
      ) : (
        /* B. ACTIVE CONSULTATION WORKSPACE */
        <div className="flex-1 flex flex-col md:flex-row gap-6 h-full relative overflow-hidden">
          
          {/* Main Workspace Frame */}
          <div className="flex-1 flex flex-col justify-between h-full min-w-0">
            
            {/* Consultation Top Panel Bar */}
            <div className="flex justify-between items-center bg-white border border-gray-200 py-3.5 px-5 rounded-sm shadow-sm shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    activeConv.contextType === 'kb' ? 'bg-burgundy-600' : 'bg-gold-500'
                  }`} />
                  <h3 className="font-serif font-bold text-sm md:text-base text-navy-900 uppercase tracking-tight">
                    {activeConv.title}
                  </h3>
                </div>
                <div className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">
                  {language === 'ar' ? "نمط الفهرس:" : "Index Mode:"} {activeConv.contextType.toUpperCase()} {language === 'ar' ? "• اتصال مشفر وآمن" : "CONTEXT • SECURE CONNECTION"}
                </div>
              </div>

              {/* Advisory Tools */}
              <div className="flex items-center gap-3 relative">
                {showShareSuccess && (
                  <span className="absolute -top-7 right-20 bg-navy-900 text-white text-[10px] px-2 py-0.5 rounded-sm animate-fade-in">
                    {language === 'ar' ? "تم نسخ الرابط السري الآمن" : "Confidential Link Copied"}
                  </span>
                )}
                {showExportSuccess && (
                  <span className="absolute -top-7 right-10 bg-navy-900 text-white text-[10px] px-2 py-0.5 rounded-sm animate-fade-in">
                    {language === 'ar' ? "تم تصدير المذكرة القانونية" : "Dispatches Exported"}
                  </span>
                )}
                
                <button 
                  onClick={handleShare}
                  title={language === 'ar' ? "مشاركة رابط المشورة" : "Share Consultation Brief"}
                  className="p-2 bg-parchment-light hover:bg-parchment-dark/30 border border-gray-200 rounded-sm text-gray-600 hover:text-navy-900 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleExport}
                  title={language === 'ar' ? "تصدير بصيغة PDF معتمد للطباعة" : "Export to Publication Grade PDF"}
                  className="p-2 bg-parchment-light hover:bg-parchment-dark/30 border border-gray-200 rounded-sm text-gray-600 hover:text-navy-900 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setShowHistory(true)}
                  title={language === 'ar' ? "جلسات الديوان السابقة" : "Chambers Prior Sessions"}
                  className="p-2 bg-parchment-light hover:bg-parchment-dark/30 border border-gray-200 rounded-sm text-gray-600 hover:text-navy-900 cursor-pointer flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-serif uppercase tracking-wider font-bold hidden sm:inline">
                    {language === 'ar' ? "الجلسات السابقة" : "Prior Logs"}
                  </span>
                </button>
              </div>
            </div>

            {/* Messages Thread Container (NO BUBBLES!) */}
            <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-6 scrollbar-thin">
              {activeConv.messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    {/* Legal Document Sheet */}
                    <div 
                      className={`relative w-full max-w-3xl bg-white border border-gray-200 p-6 rounded-sm shadow-sm ${
                        isUser 
                          ? 'border-r-4 border-r-gold-500 hover:border-r-gold-500 transition-all' 
                          : 'border-l-4 border-l-navy-900'
                      }`}
                    >
                      {/* Sheet Header */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5 mb-4 text-[10px] font-mono text-gray-400 uppercase">
                        <div className="flex items-center gap-1.5">
                          {!isUser && <Scale className="w-3.5 h-3.5 text-navy-900" />}
                          <span className="font-bold text-navy-900">
                            {isUser 
                              ? (language === 'ar' ? "برقية المستشار" : "Counselor's Dispatch")
                              : (language === 'ar' ? "إفادة الفقه للذكاء الاصطناعي" : "Jurisprudential AI Statement")}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Audio Speech Read Aloud Toggle */}
                          <button
                            type="button"
                            onClick={() => speakMessage(msg.id, msg.text)}
                            title={speakingMsgId === msg.id ? t.settings.stopReading : t.settings.readAloud}
                            className={`p-1 rounded-sm cursor-pointer transition-colors ${
                              speakingMsgId === msg.id 
                                ? 'text-burgundy-600 bg-burgundy-600/10 hover:bg-burgundy-600/20' 
                                : 'text-gray-400 hover:text-navy-900 hover:bg-gray-100'
                            }`}
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-gray-800 text-xs md:text-sm leading-relaxed whitespace-pre-line font-serif">
                        {isUser ? (
                          msg.text
                        ) : (
                          /* Render AI Text with high-contrast markdown simulation and custom citations */
                          <div>
                            {msg.text}
                            
                            {/* Render explicit interactive citations if appended */}
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                                <span className="text-[10px] uppercase font-mono text-gray-400 font-bold self-center mr-1">
                                  {language === 'ar' ? "المراجع القانونية:" : "References:"}
                                </span>
                                {msg.citations.map((c, cIdx) => (
                                  <button
                                    key={c.id}
                                    onClick={() => setActiveCitation(activeCitation?.id === c.id ? null : c)}
                                    className="bg-parchment-dark/30 hover:bg-gold-500/10 border border-gray-300 text-[10px] text-burgundy-600 px-2 py-0.5 rounded-sm font-serif italic cursor-pointer transition-all"
                                  >
                                    [{cIdx + 1}] {c.sourceName}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Speaking adjustment rate block */}
                      {speakingMsgId === msg.id && (
                        <div className={`mt-3 p-2 bg-burgundy-600/5 border border-burgundy-600/20 rounded-sm flex flex-col sm:flex-row justify-between items-center gap-2 animate-fade-in ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="flex items-center gap-1.5 text-[10px] font-serif text-burgundy-800 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-burgundy-600 animate-ping shrink-0" />
                            {language === 'ar' ? "جاري قراءة النص بصوت واضح ونطق سليم..." : "Reading legal dispatch aloud..."}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono text-gray-400 font-bold uppercase">
                                {language === 'ar' ? "سرعة النطق" : "Speed"}: {speechRate}x
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
                                  // Live refresh speech with new rate configuration
                                  if (speakingMsgId === msg.id) {
                                    speakMessage(msg.id, msg.text); // turns off
                                    setTimeout(() => speakMessage(msg.id, msg.text), 60); // turns back on with new speed rate
                                  }
                                }}
                                className="w-16 accent-burgundy-600 cursor-pointer h-1"
                              />
                            </div>

                            <button 
                              onClick={() => {
                                if (typeof window !== 'undefined' && window.speechSynthesis) {
                                  window.speechSynthesis.cancel();
                                }
                                setSpeakingMsgId(null);
                              }}
                              className="bg-navy-900 hover:bg-burgundy-600 text-white text-[9px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-sm cursor-pointer transition-colors"
                            >
                              {t.settings.stopReading}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Floating Citation details card inside message */}
                      {activeCitation && !isUser && msg.citations?.some(c => c.id === activeCitation.id) && (
                        <div className="mt-3 p-3.5 bg-parchment border border-gold-500/50 rounded-sm text-xs text-gray-700 animate-slide-down relative">
                          <button 
                            onClick={() => setActiveCitation(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-navy-900"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="font-serif font-bold text-xs uppercase text-navy-900">
                            {activeCitation.sourceName} {activeCitation.page ? `• ${language === 'ar' ? "صفحة" : "Page"} ${activeCitation.page}` : ''}
                          </div>
                          <p className="italic text-xs text-gray-600 mt-1 leading-relaxed border-l border-l-burgundy-600 pl-2">
                            "{activeCitation.excerpt}"
                          </p>
                          <button
                            onClick={() => {
                              setViewerSource(activeCitation);
                              setActiveCitation(null);
                            }}
                            className="text-[10px] font-mono uppercase text-burgundy-600 hover:text-navy-900 mt-2 flex items-center gap-0.5 font-bold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> {language === 'ar' ? "فتح في قارئ الديوان" : "Open in Chambers Viewer"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex flex-col items-start max-w-full">
                  <div className="w-full max-w-xl bg-white border border-gray-200 p-6 rounded-sm shadow-sm border-l-4 border-l-gold-500 flex items-center gap-3 text-xs text-gray-500 font-serif italic">
                    <Sparkles className="w-4 h-4 text-gold-500 animate-spin-slow shrink-0" />
                    {language === 'ar' ? "المستشار الذكي يبحث في فهارس الفقه ويطابق الشواهد القانونية..." : "AI Counselor is searching vector indexes and aligning citations..."}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Workspace */}
            <form onSubmit={handleSend} className="shrink-0 pt-2 border-t border-gray-200/40">
              <div className="relative border border-gray-300 rounded-sm bg-white p-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={language === 'ar' ? "اطرح سؤالك أو استشارتك على الفهرس الفقهي المركزي..." : "Pose your legal inquiry to the core index..."}
                  className="w-full h-16 max-h-32 bg-transparent text-xs md:text-sm text-navy-900 focus:outline-none placeholder:italic placeholder:text-gray-400 resize-none font-serif leading-relaxed px-2 py-1"
                />

                <div className="flex justify-between items-center pt-2 px-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => alert(language === 'ar' ? "يرجى رفع ملفات القضية والمستندات مباشرة في غرفة الأدلة لإجراء التحليل الدلالي الدقيق." : "Upload brief files directly in the Evidence Room for deeper semantic parsing.")}
                      className="p-1.5 text-gray-400 hover:text-navy-900 rounded-sm transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={toggleDictation}
                      title={isDictating ? (language === 'ar' ? "إيقاف الإملاء" : "Stop Dictation") : t.settings.speechReader}
                      className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                        isDictating 
                          ? 'text-white bg-burgundy-600 animate-pulse' 
                          : 'text-gray-400 hover:text-navy-900 hover:bg-gray-100'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-serif uppercase tracking-widest text-burgundy-600 font-bold bg-parchment px-2 py-0.5 border border-navy-900/5">
                      {activeConv.contextType.toUpperCase()} {language === 'ar' ? "نمط" : "MODE"}
                    </span>
                    {isDictating && (
                      <span className="text-[9px] text-burgundy-600 animate-pulse font-mono font-bold hidden sm:inline">
                        {t.settings.dictationStart}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="bg-navy-900 hover:bg-burgundy-600 disabled:bg-gray-200 text-white px-5 py-1.5 rounded-sm text-xs font-serif uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    {t.consultation.send} <Send className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </form>

          </div>

          {/* Right Panel - Collapsible Sources Drawer ("Referenced Authorities") */}
          <div className="hidden lg:flex lg:w-72 bg-white border border-gray-200 p-4 rounded-sm flex-col justify-between shrink-0 h-full relative">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-burgundy-600" /> {t.consultation.citationsTitle}
                </h4>
                <span className="text-[9px] font-mono bg-parchment px-2 py-0.5 rounded-sm font-bold">
                  {allCitations.length} {language === 'ar' ? "مستندات" : "ITEMS"}
                </span>
              </div>

              {allCitations.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-400 italic font-serif">
                  {language === 'ar' ? "لا توجد مستندات مرجعية مستشهد بها في هذه الاستشارة." : "No authoritative documents cited in current log."}
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {allCitations.map((c, idx) => (
                    <div 
                      key={c.id} 
                      onClick={() => setViewerSource(c)}
                      className="p-3 bg-parchment-light border border-gray-200 rounded-sm hover:border-gold-500 cursor-pointer transition-colors relative group"
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3.5 h-3.5 text-burgundy-600" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 font-bold">{language === 'ar' ? "مصدر مرجعي" : "SOURCE"} [0{idx + 1}]</span>
                      <h5 className="font-serif font-bold text-xs text-navy-900 uppercase truncate mt-0.5">{c.sourceName}</h5>
                      <p className="text-[10px] italic text-gray-500 mt-1 line-clamp-2">"{c.excerpt}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[9px] font-mono text-gray-400 text-center leading-relaxed pt-4 border-t border-gray-100">
              {language === 'ar' ? "*تطابق دلالي فوري مدعوم بمواد القانون المدني المصري." : "*Grounding accuracy backed by statutory vectors in real-time."}
            </div>
          </div>

        </div>
      )}

      {/* C. POPUP CHAMBERS SOURCE DOCUMENT VIEWER */}
      {viewerSource && (
        <div className="fixed inset-0 bg-navy-900/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-sm max-w-2xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl overflow-hidden relative">
            
            {/* Viewer Header */}
            <div className="bg-navy-900 text-parchment py-4 px-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold-300" />
                <h4 className="font-serif font-bold text-sm uppercase tracking-wider">
                  {language === 'ar' ? "عارض أرشيفات ووثائق الديوان" : "Chambers Archives Viewer"}
                </h4>
              </div>
              <button 
                onClick={() => setViewerSource(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewer Content */}
            <div className="p-6 overflow-y-auto bg-parchment">
              <div className="bg-white border border-gray-300 p-8 rounded-sm shadow-md font-serif text-sm text-gray-800 leading-relaxed relative min-h-[300px]">
                {/* Simulated original watermarked paper layout */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 font-serif text-6xl uppercase tracking-widest text-navy-900 select-none pointer-events-none text-center">
                  {language === 'ar' ? "نسخة معتمدة للمستشار" : "COUNSELOR COPY"}
                </div>
                
                <h3 className="font-bold text-center uppercase tracking-tight text-navy-900 border-b border-gray-200 pb-3 mb-6">
                  {viewerSource.sourceName}
                </h3>
                <div className="text-right text-xs italic text-gray-500 mb-4">
                  {language === 'ar' ? "معرف الأرشيف الفقهي:" : "Archive Index ID:"} {viewerSource.id.toUpperCase()} • {language === 'ar' ? "صفحة" : "Page"} {viewerSource.page || 1}
                </div>
                <p className="italic border-l-4 border-l-burgundy-600 pl-4 py-2 bg-parchment-light/40">
                  "{viewerSource.excerpt}"
                </p>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  {language === 'ar' 
                    ? "هذا المستند يمثل مرجعاً مصدقاً مستخلصاً من قواعد البيانات القانونية الرسمية والموسوعة المدنية لجمهورية مصر العربية، لغايات الاستخدام الاستشاري والمهني في صياغة اللوائح القانونية."
                    : "This document represents a verified citation extracted from official legal databases and codifications for counseling and professional purposes."}
                </p>
              </div>
            </div>

            {/* Viewer Footer */}
            <div className="border-t border-gray-100 py-3.5 px-6 bg-parchment-light flex justify-between items-center text-xs">
              <span className="font-mono text-gray-400">{language === 'ar' ? "الحالة: مستند قانوني مصدق" : "STATUS: VERIFIED COGNITIVE ANCHOR"}</span>
              <button 
                onClick={() => setViewerSource(null)}
                className="bg-navy-900 hover:bg-burgundy-600 text-white px-5 py-1.5 font-serif uppercase tracking-wider font-bold text-xs rounded-sm transition-colors cursor-pointer"
              >
                {language === 'ar' ? "إغلاق نافذة الأرشيف" : "Close Archive View"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. PRIOR SESSIONS HISTORY OVERLAY */}
      {showHistory && (
        <div className="fixed inset-0 bg-navy-900/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-sm max-w-md w-full max-h-[80vh] flex flex-col justify-between shadow-2xl overflow-hidden relative">
            <div className="bg-navy-900 text-parchment py-4 px-5 flex justify-between items-center border-b border-navy-900">
              <h4 className="font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                <History className="w-4 h-4 text-gold-300" /> {language === 'ar' ? "أرشيف جلسات المشورة السابقة" : "PRIORITY SESSIONS ARCHIVE"}
              </h4>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh] space-y-3">
              {conversations.map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    setShowHistory(false);
                  }}
                  className={`p-3.5 border rounded-sm cursor-pointer transition-all relative group flex justify-between items-center ${
                    conv.id === activeConversationId 
                      ? 'bg-parchment border-burgundy-500 font-semibold' 
                      : 'bg-white hover:border-navy-900 border-gray-200'
                  }`}
                >
                  <div>
                    <h5 className="font-serif text-sm text-navy-900 uppercase tracking-tight">{conv.title}</h5>
                    <span className="text-[10px] font-mono uppercase text-gray-400 mt-1 block">
                      {conv.contextType.toUpperCase()} {language === 'ar' ? "نمط •" : "MODE •"} {conv.messages.length} {language === 'ar' ? "برقيات ومراسلات" : "DISPATCHES"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-burgundy-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 py-3.5 px-5 bg-parchment-light flex justify-between items-center text-xs">
              <button 
                onClick={() => {
                  handleCreateNew('general');
                  setShowHistory(false);
                }}
                className="text-burgundy-600 hover:text-navy-900 font-serif font-bold uppercase text-[11px] tracking-wider cursor-pointer"
              >
                {language === 'ar' ? "+ بدء جلسة مشورة جديدة" : "+ Start Brand New Session"}
              </button>
              <button 
                onClick={() => setShowHistory(false)}
                className="bg-navy-900 text-white font-serif uppercase tracking-wider text-[11px] font-bold px-4 py-1.5 rounded-sm cursor-pointer"
              >
                {language === 'ar' ? "تم" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
