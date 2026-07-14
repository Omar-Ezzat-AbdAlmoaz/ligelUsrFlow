export type ContextType = 'general' | 'firm' | 'case' | 'kb';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'paralegal' | 'client';
  firmName?: string;
  barId?: string;
  avatarUrl?: string;
}

export interface Citation {
  id: string;
  sourceName: string;
  excerpt: string;
  page?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Citation[];
}

export interface Conversation {
  id: string;
  title: string;
  contextType: ContextType;
  selectedCaseId?: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface ExtractedClause {
  id: string;
  title: string;
  text: string;
  confidence: number; // 0 to 100
  type: string;
}

export interface RiskFactor {
  id: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  clauseId?: string;
}

export interface ObligationMilestone {
  id: string;
  date: string;
  description: string;
  party: string;
  status: 'pending' | 'completed' | 'overdue';
}

export interface DocumentParty {
  id: string;
  name: string;
  role: string;
  rights: string;
  obligations: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  type: 'NDA' | 'Employment' | 'Lease' | 'Service Agreement' | 'Brief' | 'Other';
  dateUploaded: string;
  status: 'Analysis Complete' | 'In Progress' | 'New';
  size: string;
  tags: string[];
  caseId?: string;
  summary?: string;
  clauses?: ExtractedClause[];
  risks?: RiskFactor[];
  timeline?: ObligationMilestone[];
  parties?: DocumentParty[];
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  language: 'English' | 'Arabic' | 'Bilingual';
  variables: {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'textarea';
    placeholder?: string;
    options?: string[];
  }[];
}

export interface CaseFile {
  id: string;
  title: string;
  client: string;
  practiceArea: string;
  status: 'Active' | 'Settled' | 'Archived';
  dateOpened: string;
  description: string;
  associatedDocIds: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  imageUrl: string;
  isInternal: boolean;
  comments: Comment[];
  associatedDocs?: string[];
}

export interface Notification {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
}

export interface FirmSettings {
  firmName: string;
  address: string;
  practiceAreas: string[];
  logoUrl?: string;
  citationStyle: 'Bluebook' | 'APA' | 'ALWD' | 'Oxford';
  languageMode: 'Bilingual' | 'Arabic' | 'English';
  mfaEnabled: boolean;
}
