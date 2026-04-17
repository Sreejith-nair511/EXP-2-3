'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Trash2, Sparkles, Code, User as UserIcon, Bot, Youtube, Search, ExternalLink, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type Tab = 'chat' | 'youtube' | 'google';

const suggestedPrompts = [
  'How do I optimize React component performance?',
  'Explain microservices architecture',
  'Best practices for database indexing',
  'How to handle errors in async/await?',
];

const YT_RESOURCES = [
  { title: 'JavaScript Full Course 2024', channel: 'FreeCodeCamp', duration: '12h', topic: 'Web Dev', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', thumb: 'https://img.youtube.com/vi/PkZNo7MFNFg/mqdefault.jpg' },
  { title: 'React JS Full Course', channel: 'FreeCodeCamp', duration: '10h', topic: 'Frontend', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', thumb: 'https://img.youtube.com/vi/bMknfKXIFA8/mqdefault.jpg' },
  { title: 'Python for Beginners', channel: 'FreeCodeCamp', duration: '4h', topic: 'Python', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', thumb: 'https://img.youtube.com/vi/rfscVS0vtbw/mqdefault.jpg' },
  { title: 'Node.js Crash Course', channel: 'Traversy Media', duration: '1.5h', topic: 'Backend', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', thumb: 'https://img.youtube.com/vi/fBNz5xF-Kx4/mqdefault.jpg' },
  { title: 'Docker Tutorial for Beginners', channel: 'TechWorld with Nana', duration: '3h', topic: 'DevOps', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', thumb: 'https://img.youtube.com/vi/3c-iBn73dDE/mqdefault.jpg' },
  { title: 'Kubernetes Full Course', channel: 'TechWorld with Nana', duration: '4h', topic: 'DevOps', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', thumb: 'https://img.youtube.com/vi/X48VuDVv0do/mqdefault.jpg' },
  { title: 'SQL Full Course', channel: 'FreeCodeCamp', duration: '4h', topic: 'Database', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', thumb: 'https://img.youtube.com/vi/HXV3zeQKqGY/mqdefault.jpg' },
  { title: 'Machine Learning Course', channel: 'Stanford Online', duration: '20h', topic: 'AI/ML', url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I', thumb: 'https://img.youtube.com/vi/jGwO_UgTS7I/mqdefault.jpg' },
  { title: 'Git & GitHub Full Course', channel: 'FreeCodeCamp', duration: '1h', topic: 'Tools', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', thumb: 'https://img.youtube.com/vi/RGOj5yH7evk/mqdefault.jpg' },
  { title: 'TypeScript Tutorial', channel: 'Traversy Media', duration: '1.5h', topic: 'Web Dev', url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', thumb: 'https://img.youtube.com/vi/BwuLxPH8IDs/mqdefault.jpg' },
  { title: 'AWS Cloud Practitioner', channel: 'FreeCodeCamp', duration: '13h', topic: 'Cloud', url: 'https://www.youtube.com/watch?v=SOTamWNgDKc', thumb: 'https://img.youtube.com/vi/SOTamWNgDKc/mqdefault.jpg' },
  { title: 'Data Structures & Algorithms', channel: 'FreeCodeCamp', duration: '8h', topic: 'DSA', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', thumb: 'https://img.youtube.com/vi/RBSGKlAvoiM/mqdefault.jpg' },
];

const GOOGLE_RESOURCES = [
  { title: 'React Documentation', desc: 'Official React docs — components, hooks, state management', url: 'https://react.dev', category: 'Frontend' },
  { title: 'MDN Web Docs', desc: 'Complete reference for HTML, CSS, JavaScript APIs', url: 'https://developer.mozilla.org', category: 'Web Dev' },
  { title: 'roadmap.sh', desc: 'Developer roadmaps for frontend, backend, DevOps, and more', url: 'https://roadmap.sh', category: 'Career' },
  { title: 'LeetCode', desc: 'Practice DSA problems for coding interviews', url: 'https://leetcode.com', category: 'DSA' },
  { title: 'GeeksforGeeks', desc: 'CS fundamentals, algorithms, system design articles', url: 'https://www.geeksforgeeks.org', category: 'CS Fundamentals' },
  { title: 'Stack Overflow', desc: 'Q&A for programming problems and debugging', url: 'https://stackoverflow.com', category: 'Community' },
  { title: 'GitHub', desc: 'Host code, contribute to open source, build portfolio', url: 'https://github.com', category: 'Tools' },
  { title: 'Dev.to', desc: 'Engineering articles, tutorials, and community posts', url: 'https://dev.to', category: 'Blog' },
  { title: 'Supabase Docs', desc: 'Open source Firebase alternative — PostgreSQL + Auth + Storage', url: 'https://supabase.com/docs', category: 'Backend' },
  { title: 'Vercel Docs', desc: 'Deploy Next.js apps, edge functions, and serverless APIs', url: 'https://vercel.com/docs', category: 'DevOps' },
  { title: 'System Design Primer', desc: 'GitHub repo — learn how to design large-scale systems', url: 'https://github.com/donnemartin/system-design-primer', category: 'System Design' },
  { title: 'NeetCode', desc: 'Structured DSA roadmap and video explanations for interviews', url: 'https://neetcode.io', category: 'DSA' },
];

const YT_TOPICS = ['All', 'Web Dev', 'Frontend', 'Backend', 'DevOps', 'AI/ML', 'DSA', 'Database', 'Cloud', 'Tools', 'Python'];
const G_CATEGORIES = ['All', 'Frontend', 'Web Dev', 'Backend', 'DSA', 'Career', 'CS Fundamentals', 'System Design', 'Tools', 'Community', 'Blog', 'DevOps'];

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [ytFilter, setYtFilter] = useState('All');
  const [ytSearch, setYtSearch] = useState('');
  const [gFilter, setGFilter] = useState('All');
  const [gSearch, setGSearch] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'assistant',
    content: "Hey! I'm your AI-powered career assistant. I can help you with course recommendations, technical questions, interview prep, and career guidance. What would you like to learn today?",
    timestamp: new Date(),
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const resetChat = () => setMessages([{ id: '1', role: 'assistant', content: "Hey! I'm your AI career assistant. What would you like to learn today?", timestamp: new Date() }]);

  const filteredYt = YT_RESOURCES.filter(r =>
    (ytFilter === 'All' || r.topic === ytFilter) &&
    (!ytSearch || r.title.toLowerCase().includes(ytSearch.toLowerCase()) || r.channel.toLowerCase().includes(ytSearch.toLowerCase()))
  );

  const filteredG = GOOGLE_RESOURCES.filter(r =>
    (gFilter === 'All' || r.category === gFilter) &&
    (!gSearch || r.title.toLowerCase().includes(gSearch.toLowerCase()) || r.desc.toLowerCase().includes(gSearch.toLowerCase()))
  );

  const handleSendMessage = async (e?: React.FormEvent, prompt?: string) => {
    if (e) e.preventDefault();
    const messageContent = prompt || inputValue;
    if (!messageContent.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: messageContent, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
      });
      if (!response.ok) throw new Error('Failed');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages(prev => { const last = prev[prev.length - 1]; return last.role === 'assistant' ? [...prev.slice(0, -1), { ...last, content: assistantContent }] : prev; });
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 border-r border-border bg-card flex-col">
        <div className="p-6 border-b border-border">
          <button onClick={() => { resetChat(); setActiveTab('chat'); }} className="button-primary w-full flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>
        <div className="flex-1 p-4 space-y-1">
          {([['chat', '💬', 'AI Chat'], ['youtube', '▶️', 'YouTube Resources'], ['google', '🔍', 'Web Resources']] as [Tab, string, string][]).map(([key, emoji, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center gap-2 ${activeTab === key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <span>{emoji}</span>{label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={resetChat} className="w-full flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors text-sm">
            <Trash2 className="w-4 h-4" /> Clear Chat
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
            {activeTab === 'youtube' ? <Youtube className="w-5 h-5" /> : activeTab === 'google' ? <Search className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {activeTab === 'youtube' ? 'YouTube Engineering Resources' : activeTab === 'google' ? 'Web Engineering Resources' : 'AI Career Assistant'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'youtube' ? 'Curated YouTube courses — click to watch' : activeTab === 'google' ? 'Top engineering websites and docs' : 'Powered by Groq AI'}
            </p>
          </div>
          <div className="ml-auto flex gap-1 md:hidden">
            {(['chat', 'youtube', 'google'] as Tab[]).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                {t === 'chat' ? '💬' : t === 'youtube' ? '▶️' : '🔍'}
              </button>
            ))}
          </div>
        </div>

        {/* YouTube Resources */}
        {activeTab === 'youtube' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={ytSearch} onChange={e => setYtSearch(e.target.value)} placeholder="Search videos..."
                  className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <a href="https://www.youtube.com/results?search_query=software+engineering+tutorial" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-colors shrink-0">
                <Youtube className="w-4 h-4" /> Search on YouTube
              </a>
            </div>
            <div className="flex gap-2 flex-wrap">
              {YT_TOPICS.map(t => (
                <button key={t} onClick={() => setYtFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${ytFilter === t ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>{t}</button>
              ))}
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              Showing <span className="text-white font-semibold">{filteredYt.length}</span> videos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredYt.map(r => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="group bg-white/5 border border-white/10 hover:border-red-500/30 rounded-2xl overflow-hidden transition-all hover:bg-white/[0.07]">
                  <div className="relative">
                    <img src={r.thumb} alt={r.title} className="w-full h-36 object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-medium">{r.duration}</span>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-red-400 font-semibold">{r.topic}</span>
                    <h3 className="text-white font-semibold text-sm mt-1 line-clamp-2 leading-snug">{r.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">{r.channel}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Web Resources */}
        {activeTab === 'google' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={gSearch} onChange={e => setGSearch(e.target.value)} placeholder="Search resources..."
                  className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <a href="https://www.google.com/search?q=software+engineering+resources" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-semibold hover:bg-blue-500/30 transition-colors shrink-0">
                <Search className="w-4 h-4" /> Search on Google
              </a>
            </div>
            <div className="flex gap-2 flex-wrap">
              {G_CATEGORIES.map(c => (
                <button key={c} onClick={() => setGFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${gFilter === c ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>{c}</button>
              ))}
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              Showing <span className="text-white font-semibold">{filteredG.length}</span> resources
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredG.map(r => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col gap-3 p-5 bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl transition-all hover:bg-white/[0.07]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">{r.category}</span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{r.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                  <span className="text-blue-400 text-xs font-semibold mt-auto">{r.url.replace('https://', '')} →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map(message => (
                  <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-md lg:max-w-2xl rounded-2xl px-5 py-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'card-elevated glass-lg shadow-xl'}`}>
                      <div className={`prose prose-sm dark:prose-invert max-w-none ${message.role === 'user' ? 'text-white' : 'text-foreground'}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                      <p className={`text-[10px] mt-3 opacity-40 font-medium ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-secondary" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass-lg p-4 rounded-lg">
                      <div className="flex gap-2">
                        {[0, 0.1, 0.2].map((d, i) => <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}s` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="border-t border-border bg-card p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.length === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedPrompts.map((prompt, i) => (
                      <button key={i} onClick={() => handleSendMessage(undefined, prompt)}
                        className="flex items-start gap-3 p-3 card-elevated rounded-lg text-left group transition-all hover:border-primary/30">
                        <Code className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground">{prompt}</span>
                      </button>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your engineering career..."
                    className="flex-1 px-6 py-3 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground dark:bg-white/10 dark:border-white/20 transition-colors"
                    disabled={isLoading} />
                  <button type="submit" disabled={isLoading || !inputValue.trim()} className="button-primary disabled:opacity-50 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
