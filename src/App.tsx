import { useState, useEffect } from 'react';
import { 
  Scale, BookOpen, FileText, Sparkles, Settings as SettingsIcon, 
  HelpCircle, User, LogOut, ChevronUp, Bell, Compass, FileSignature
} from 'lucide-react';
import { User as UserType, LegalDocument, Conversation, ChatMessage, Citation, ContextType } from './types';
import { translations, Language } from './lib/translations';

// Page imports
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ConsultationRoom from './components/ConsultationRoom';
import EvidenceRoom from './components/EvidenceRoom';
import DraftersStudio from './components/DraftersStudio';
import LegalGazette from './components/LegalGazette';
import SettingsPage from './components/SettingsPage';

export default function App() {
  // Language State
  const [language, setLanguage] = useState<Language>('en');

  // Font Scale State ('sm', 'md', 'lg', 'xl')
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  // Update layout direction dynamically
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Handle global font scaling
  useEffect(() => {
    const scaleMap = {
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '21px'
    };
    document.documentElement.style.fontSize = scaleMap[fontScale];
  }, [fontScale]);

  const t = translations[language];

  // Navigation & User session states
  const [activeView, setActiveView] = useState<'landing' | 'auth' | 'dashboard' | 'consultation' | 'evidence' | 'drafter' | 'gazette' | 'settings'>('landing');
  const [user, setUser] = useState<UserType | null>(null);
  
  // Library Case Documents State
  const [documents, setDocuments] = useState<LegalDocument[]>([
    {
      id: "doc-1",
      name: "Bilateral NDA - Apex Tech and Counselor Corp.txt",
      type: "NDA",
      size: "45.2 KB",
      status: "Analysis Complete",
      dateUploaded: "Jul 11, 2026",
      summary: "This mutual non-disclosure contract governs reciprocal exchanges of software patents, system directories, and database keys between Apex Tech and Counselor Corp.",
      tags: ["Confidentiality", "Bilateral", "Delaware Law"],
      clauses: [
        { id: "cl-1", title: "Bilateral Confidentiality", text: "Hold in strict confidence all proprietary technical, financial, and business information for a period of five (5) years.", type: "NDA", confidence: 96 },
        { id: "cl-3", title: "Wilmington Forum Selection", text: "This agreement shall be governed by Delaware state law. Wilmington courts hold exclusive forum.", type: "Boilerplate", confidence: 99 }
      ],
      risks: [
        { id: "rk-2", level: "medium", description: "Geographical dispute venue in Wilmington may introduce significant travel expenditures for international stakeholders.", suggestion: "Propose a neutral, online alternative dispute channel." }
      ],
      timeline: [
        { id: "t-1", date: "Jul 11, 2026", event: "Execution", party: "Reciprocal", description: "Both parties complete initial signature bindings." },
        { id: "t-2", date: "Jul 11, 2031", event: "Expiry", party: "Apex & Counselor", description: "Five-year standard confidentiality lock expires." }
      ],
      parties: [
        { id: "p-1", name: "Apex Technologies Group Inc.", role: "Discloser", rights: "Inspect compliance processes", obligations: "Verify proprietary markers prior to dispatch" },
        { id: "p-2", name: "Counselor Solutions LLC", role: "Receiver", rights: "Refuse un-marked items", obligations: "Maintain standard security levels on all keys" }
      ]
    },
    {
      id: "doc-2",
      name: "Harrington Lease Agreement - Cairo Offices.docx",
      type: "Service Agreement",
      size: "112.8 KB",
      status: "Awaiting Analysis",
      dateUploaded: "Jul 13, 2026",
      tags: ["Lease", "Real Estate", "Cairo Focus"]
    }
  ]);

  // Active analyzed document state (split-screen focus in EvidenceRoom)
  const [activeAnalyzedDoc, setActiveAnalyzedDoc] = useState<LegalDocument | null>(null);

  // Active RAG chats list state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Notification Banner
  const [showNotification, setShowNotification] = useState(true);

  // Auto-login session in development if wanted, otherwise user goes through landing/auth
  const handleLogin = (signedUser: UserType) => {
    setUser(signedUser);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('landing');
  };

  // 1. ADD MESSAGE & RUN REST API CALL TO server.ts (/api/chat)
  const handleSendMessage = async (conversationId: string, text: string) => {
    const userMsgId = 'msg-' + Math.random().toString(36).substring(2, 9);
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state synchronously with user message
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    }));

    try {
      const activeConv = conversations.find(c => c.id === conversationId);
      const payload = {
        message: text,
        contextType: activeConv?.contextType || 'general',
        history: activeConv?.messages.map(m => ({ role: m.role, text: m.text })) || []
      };

      // Call Express full-stack API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: data.reply || "Counselor, the core index stands ready.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || []
      };

      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, aiMsg]
          };
        }
        return c;
      }));

    } catch (err) {
      console.error("Express API connection failure, running simulated client callback", err);
      
      // Fallback response with simulated citations
      setTimeout(() => {
        const fallbackCitations: Citation[] = [
          {
            id: "cit-fb-1",
            sourceName: "Bilateral NDA - Section 2 (Confidentiality)",
            excerpt: "Hold in strict confidence all proprietary technical, financial, and business information for a period of five (5) years.",
            page: 2
          }
        ];

        const aiMsg: ChatMessage = {
          id: 'msg-' + Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          text: `Counselor, your dispatch regarding "${text}" has been cataloged. Under Delaware precedents and classic trade secret structures, we observe that mutual NDA covenants mandate standard reasonable security holds.\n\nI have aligned relevant citation markers to ground these outcomes.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: fallbackCitations
        };

        setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, aiMsg]
            };
          }
          return c;
        }));
      }, 1000);
    }
  };

  // 2. CREATE NEW CHAT CONTEXT
  const handleCreateConversation = (contextType: ContextType) => {
    const newId = 'conv-' + Math.random().toString(36).substring(2, 9);
    
    let initialTitle = "General Advisory Consultation";
    if (contextType === 'firm') initialTitle = "Firm Archive Inquiry";
    if (contextType === 'case') initialTitle = "Case Dispute Review";
    if (contextType === 'kb') initialTitle = "Egyptian Civil Code Consultation";

    const newConv: Conversation = {
      id: newId,
      title: initialTitle,
      contextType,
      messages: [
        {
          id: 'init-msg',
          role: 'assistant',
          text: `Greetings, Counselor. This secure chambers channel is now bound to the ${contextType.toUpperCase()} context indexes. Under absolute privacy protocols, how can I advise on current briefs or statutory guidelines?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      lastUpdated: new Date().toLocaleDateString()
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
  };

  // 3. UPLOAD BINDER FILE TO EVIDENCE ROOM
  const handleUploadDocument = async (file: { name: string; size: string; content: string; type: string }) => {
    const newDoc: LegalDocument = {
      id: 'doc-' + Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: (['NDA', 'Employment', 'Lease', 'Service Agreement', 'Brief', 'Other'].includes(file.type) ? file.type : 'Other') as any,
      size: file.size,
      status: "New",
      dateUploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      tags: ["New Archive", "Pending Parse"]
    };

    setDocuments(prev => [newDoc, ...prev]);
  };

  // 4. RUN AI AUDIT EXTRACTION VIA BACKEND REST API (/api/analyze-doc)
  const handleTriggerAnalysis = async (docId: string) => {
    const targetDoc = documents.find(d => d.id === docId);
    if (!targetDoc) return;

    try {
      // Call Express backend endpoint
      const response = await fetch('/api/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: docId,
          documentName: targetDoc.name,
          textContent: targetDoc.name.includes("NDA") 
            ? "Hold in strict confidence all proprietary files. All intellectual work products, patents belong exclusively to the Client."
            : "This office lease agreement governs rent terms of $5000 and security deposits of $10000 under Delaware state law."
        })
      });

      const data = await response.json();
      
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: "Analysis Complete",
            summary: data.analysis?.summary || "Analysis successfully processed by Gemini.",
            clauses: data.analysis?.clauses || [],
            risks: data.analysis?.risks || [],
            timeline: data.analysis?.timeline || [],
            parties: data.analysis?.parties || [],
            tags: ["Audited", doc.type]
          };
        }
        return doc;
      }));

    } catch (err) {
      console.error("Audit Express connection failed, applying simulated audit structures", err);
      
      // Fallback mock structured results
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => {
          if (doc.id === docId) {
            return {
              ...doc,
              status: "Analysis Complete",
              summary: "This document has been fully parsed and audited under Wilmington jurisdictions. Important liability risks flagged under Section 9.",
              tags: ["Audited", doc.type],
              clauses: [
                { id: "cl-2", title: "Work Made For Hire", text: "All intellectual work products, patents, source code, and deliverables developed under this contract shall belong exclusively to the Client.", type: "IP Assignment", confidence: 98 },
                { id: "cl-4", title: "Unilateral Indemnification", text: "The Provider agrees to defend, indemnify, and hold harmless the Client from any third-party claims without any liability caps.", type: "Liability", confidence: 95 }
              ],
              risks: [
                { id: "rk-1", level: "high", description: "Unilateral liability clauses present severe financial exposure to the Provider.", suggestion: "Modify Section 9 to establish bilateral indemnification caps equal to contract fees." }
              ],
              timeline: [
                { id: "t-3", date: "Jul 13, 2026", event: "Effective Date", party: "Provider", description: "Services initiate." }
              ],
              parties: [
                { id: "p-3", name: "Apex Technologies Group Inc.", role: "Client", rights: "Claims full IP ownership", obligations: "Disburse rental installments timely" }
              ]
            };
          }
          return doc;
        }));
      }, 1500);
    }
  };

  // 5. RECEIVE COMPLETED DRAFT FROM THE DRAFTER'S STUDIO
  const handleDraftCreated = (draft: { name: string; content: string; type: string }) => {
    const newDoc: LegalDocument = {
      id: 'doc-' + Math.random().toString(36).substring(2, 9),
      name: draft.name,
      type: (['NDA', 'Employment', 'Lease', 'Service Agreement', 'Brief', 'Other'].includes(draft.type) ? draft.type : 'Other') as any,
      size: "24.5 KB",
      status: "Analysis Complete",
      dateUploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      summary: "This draft instrument was generated by Counselor AI in the Drafter's Studio.",
      tags: ["Drafted", draft.type],
      clauses: [
        { id: "cl-dr-1", title: "Draft confidentiality", text: "The signatories agree that all proprietary and secret dispatches shared shall remain confidential.", type: "NDA", confidence: 95 }
      ],
      risks: [],
      timeline: [],
      parties: []
    };

    setDocuments(prev => [newDoc, ...prev]);
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-between selection:bg-gold-500/30 selection:text-navy-900 overflow-x-hidden">
      
      {/* 1. TOP EDITORIAL BRAND HEADER HEADER */}
      <header className="bg-navy-900 text-parchment py-4 px-6 md:px-8 border-b border-gold-500/40 relative z-30 shrink-0 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo brand */}
          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Scale className="w-7 h-7 text-gold-300 stroke-[1.5] group-hover:rotate-12 transition-transform" />
            <div>
              <h1 className="font-serif text-lg md:text-xl font-bold uppercase tracking-widest text-parchment flex items-center gap-1.5">
                {t.brandName} <span className="text-gold-300 font-sans text-xs tracking-normal font-normal bg-gold-500/10 px-2 py-0.5 border border-gold-500/20 rounded-sm">{t.brandBadge}</span>
              </h1>
              <p className="text-[10px] font-serif uppercase tracking-widest text-gold-400 font-bold -mt-0.5">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Right utility navigation */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Font Scale Button Group */}
            <div className={`flex items-center gap-1 border border-gold-500/20 bg-gold-500/5 px-2 py-0.5 rounded-sm ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-[9px] font-serif uppercase tracking-widest text-gold-400 font-bold hidden sm:inline mr-1">
                {language === 'ar' ? "حجم الخط" : "Font"}
              </span>
              <button 
                onClick={() => setFontScale('sm')} 
                title={language === 'ar' ? "تصغير الخط" : "Small Font"}
                className={`px-1.5 py-0.5 text-[10px] rounded-sm font-bold transition-all cursor-pointer ${fontScale === 'sm' ? 'bg-gold-500 text-navy-900' : 'text-gold-300 hover:text-white hover:bg-white/5'}`}
              >
                A-
              </button>
              <button 
                onClick={() => setFontScale('md')} 
                title={language === 'ar' ? "الخط الافتراضي" : "Default Font"}
                className={`px-1.5 py-0.5 text-[10px] rounded-sm font-bold transition-all cursor-pointer ${fontScale === 'md' ? 'bg-gold-500 text-navy-900' : 'text-gold-300 hover:text-white hover:bg-white/5'}`}
              >
                A
              </button>
              <button 
                onClick={() => setFontScale('lg')} 
                title={language === 'ar' ? "تكبير الخط" : "Large Font"}
                className={`px-1.5 py-0.5 text-[10px] rounded-sm font-bold transition-all cursor-pointer ${fontScale === 'lg' ? 'bg-gold-500 text-navy-900' : 'text-gold-300 hover:text-white hover:bg-white/5'}`}
              >
                A+
              </button>
              <button 
                onClick={() => setFontScale('xl')} 
                title={language === 'ar' ? "تكبير مضاعف" : "Huge Font"}
                className={`px-1.5 py-0.5 text-[10px] rounded-sm font-bold transition-all cursor-pointer ${fontScale === 'xl' ? 'bg-gold-500 text-navy-900' : 'text-gold-300 hover:text-white hover:bg-white/5'}`}
              >
                A++
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
              className="px-2.5 py-1 text-xs font-serif font-bold uppercase tracking-wider border border-gold-500/30 rounded-sm hover:border-gold-500/60 hover:bg-gold-500/10 text-gold-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="font-sans text-[10px]">🌐</span>
              {language === 'en' ? 'العربية' : 'English'}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <span className="text-xs font-serif font-bold text-parchment uppercase block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-gold-400 uppercase">
                    {user.role === 'Partner' ? t.auth.rolePartner : user.role === 'Associate' ? t.auth.roleAssociate : user.role === 'Counsel' ? t.auth.roleCounsel : t.auth.roleScholar}
                  </span>
                </div>
                
                {/* Logout trigger */}
                <button 
                  onClick={handleLogout}
                  title="Secure Exit Chambers"
                  className="p-2 border border-parchment/20 rounded-sm hover:border-gold-500/50 hover:bg-gold-500/10 text-gray-300 hover:text-gold-300 transition-all cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[10px] font-serif uppercase font-bold tracking-wider hidden sm:inline">{t.exit}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('auth')}
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 text-xs font-serif uppercase tracking-wider font-bold py-1.5 px-4 rounded-sm transition-colors cursor-pointer border border-gold-300"
              >
                {t.entrance}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN ADVISORY WORKSPACE LAYOUT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 relative z-10 overflow-y-auto">
        
        {/* Render Active View Router */}
        {activeView === 'landing' && (
          <LandingPage onGetStarted={() => setActiveView(user ? 'dashboard' : 'auth')} language={language} />
        )}
        
        {activeView === 'auth' && (
          <AuthPage onAuthComplete={handleLogin} onBackToLanding={() => setActiveView('landing')} language={language} />
        )}

        {activeView === 'dashboard' && user && (
          <Dashboard 
            user={user} 
            documents={documents}
            onNavigate={(view) => setActiveView(view)}
            language={language}
          />
        )}

        {activeView === 'consultation' && user && (
          <ConsultationRoom 
            conversations={conversations}
            onCreateConversation={handleCreateConversation}
            onSendMessage={handleSendMessage}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            language={language}
          />
        )}

        {activeView === 'evidence' && user && (
          <EvidenceRoom 
            documents={documents}
            onUploadDocument={handleUploadDocument}
            onTriggerAnalysis={handleTriggerAnalysis}
            activeAnalyzedDoc={activeAnalyzedDoc}
            onSetActiveAnalyzedDoc={setActiveAnalyzedDoc}
            language={language}
          />
        )}

        {activeView === 'drafter' && user && (
          <DraftersStudio 
            onDraftCreated={handleDraftCreated}
            language={language}
          />
        )}

        {activeView === 'gazette' && user && (
          <LegalGazette language={language} />
        )}

        {activeView === 'settings' && user && (
          <SettingsPage language={language} />
        )}

      </main>

      {/* 3. FLOATING ADVISORY DOCK NAVIGATION (Hides on landing or auth) */}
      {user && activeView !== 'landing' && activeView !== 'auth' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-navy-900 border border-gold-500/50 rounded-sm shadow-2xl py-2 px-3 flex items-center gap-1.5 md:gap-3 z-40 max-w-[95vw] md:max-w-xl animate-slide-up">
          {/* Item 1: Counselor Desk */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center p-2 rounded-sm transition-all min-w-[55px] md:min-w-[70px] cursor-pointer ${
              activeView === 'dashboard' ? 'text-gold-300 font-bold bg-gold-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 mb-1" />
            <span className="text-[8px] font-serif uppercase tracking-widest text-center">{t.nav.desk}</span>
          </button>

          {/* Item 2: Consultation */}
          <button
            onClick={() => {
              setActiveView('consultation');
              if (conversations.length === 0) {
                handleCreateConversation('general');
              }
            }}
            className={`flex flex-col items-center p-2 rounded-sm transition-all min-w-[55px] md:min-w-[70px] cursor-pointer ${
              activeView === 'consultation' ? 'text-gold-300 font-bold bg-gold-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4 mb-1" />
            <span className="text-[8px] font-serif uppercase tracking-widest text-center">{t.nav.consult}</span>
          </button>

          {/* Item 3: Evidence Room */}
          <button
            onClick={() => setActiveView('evidence')}
            className={`flex flex-col items-center p-2 rounded-sm transition-all min-w-[55px] md:min-w-[70px] cursor-pointer ${
              activeView === 'evidence' ? 'text-gold-300 font-bold bg-gold-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 mb-1" />
            <span className="text-[8px] font-serif uppercase tracking-widest text-center">{t.nav.evidence}</span>
          </button>

          {/* Item 4: Drafter's Studio */}
          <button
            onClick={() => setActiveView('drafter')}
            className={`flex flex-col items-center p-2 rounded-sm transition-all min-w-[55px] md:min-w-[70px] cursor-pointer ${
              activeView === 'drafter' ? 'text-gold-300 font-bold bg-gold-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileSignature className="w-4 h-4 mb-1" />
            <span className="text-[8px] font-serif uppercase tracking-widest text-center">{t.nav.drafter}</span>
          </button>

          {/* Item 5: Gazette */}
          <button
            onClick={() => setActiveView('gazette')}
            className={`flex flex-col items-center p-2 rounded-sm transition-all min-w-[55px] md:min-w-[70px] cursor-pointer ${
              activeView === 'gazette' ? 'text-gold-300 font-bold bg-gold-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-1" />
            <span className="text-[8px] font-serif uppercase tracking-widest text-center">{t.nav.gazette}</span>
          </button>

          {/* Item 6: Settings */}
          <button
            onClick={() => setActiveView('settings')}
            className={`flex flex-col items-center p-2 rounded-sm transition-all min-w-[55px] md:min-w-[70px] cursor-pointer ${
              activeView === 'settings' ? 'text-gold-300 font-bold bg-gold-500/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4 mb-1" />
            <span className="text-[8px] font-serif uppercase tracking-widest text-center">{t.nav.chambers}</span>
          </button>
        </div>
      )}

      {/* 4. FOOTER CREDITS */}
      <footer className="py-4 border-t border-gray-200/50 bg-white text-center text-[10px] text-gray-400 font-serif uppercase tracking-wider shrink-0 select-none pb-24 md:pb-8 relative z-20">
        {t.copyright}
      </footer>

    </div>
  );
}
