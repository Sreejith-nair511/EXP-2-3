'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Trash2, Sparkles, Code, User as UserIcon, Bot, Youtube, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  'How do I optimize React component performance?',
  'Explain microservices architecture',
  'Best practices for database indexing',
  'How to handle errors in async/await?',
];

type Tab = 'chat' | 'youtube' | 'google';

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [ytQuery, setYtQuery] = useState('');
  const [googleQuery, setGoogleQuery] = useState('');
  const [ytSearch, setYtSearch] = useState('software engineering tutorial');
  const [googleSearch, setGoogleSearch] = useState('software engineering best practices');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'assistant',
    content: "Hey! I'm your AI-powered career assistant. I can help you with course recommendations, technical questions, interview prep, and career guidance. What would you like to learn today?",
    timestamp: new Date(),
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
          <button onClick={() => { setMessages([{ id: '1', role: 'assistant', content: "Hey! I'm your AI career assistant. What would you like to learn today?", timestamp: new Date() }]); setActiveTab('chat'); }}
            className="button-primary w-full flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>
        <div className="flex-1 p-4 space-y-1">
          {([['chat','💬','AI Chat'],['youtube','▶️','YouTube Search'],['google','🔍','Google Search']] as [Tab,string,string][]).map(([key,emoji,label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center gap-2 ${activeTab === key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <span>{emoji}</span>{label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={() => setMessages([{ id: '1', role: 'assistant', content: "Hey! I'm your AI career assistant. What would you like to learn today?", timestamp: new Date() }])}
            className="w-full flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors text-sm">
            <Trash2 className="w-4 h-4" /> Clear Chat
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
            {activeTab === 'youtube' ? <Youtube className="w-5 h-5" /> : activeTab === 'google' ? <Search className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {activeTab === 'youtube' ? 'YouTube Search' : activeTab === 'google' ? 'Google Search' : 'AI Career Assistant'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'youtube' ? 'Search engineering tutorials on YouTube' : activeTab === 'google' ? 'Search the web for engineering resources' : 'Powered by Groq AI'}
            </p>
          </div>
          {/* Mobile tab switcher */}
          <div className="ml-auto flex gap-1 md:hidden">
            {(['chat','youtube','google'] as Tab[]).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                {t === 'chat' ? '💬' : t === 'youtube' ? '▶️' : '🔍'}
              </button>
            ))}
          </div>
        </div>

        {/* YouTube Tab */}
        {activeTab === 'youtube' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-card">
              <form onSubmit={e => { e.preventDefault(); setYtSearch(ytQuery || 'software engineering tutorial'); }} className="flex gap-2">
                <input value={ytQuery} onChange={e => setYtQuery(e.target.value)} placeholder="Search YouTube for engineering tutorials..."
                  className="flex-1 px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50" />
                <button type="submit" className="button-primary px-4 py-2.5 flex items-center gap-2 text-sm">
                  <Youtube className="w-4 h-4" /> Search
                </button>
              </form>
              <div className="flex gap-2 mt-2 flex-wrap">
                {['React tutorial', 'System design', 'DSA interview', 'Node.js', 'Python ML', 'Docker Kubernetes'].map(q => (
                  <button key={q} onClick={() => { setYtQuery(q); setYtSearch(q); }}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full text-xs transition-all">{q}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`https://www.youtube.com/results?search_query=${encodeURIComponent(ytSearch)}&sp=EgIQAQ%3D%3D`}
                title="YouTube Search"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
            </div>
          </div>
        )}

        {/* Google Tab */}
        {activeTab === 'google' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-card">
              <form onSubmit={e => { e.preventDefault(); setGoogleSearch(googleQuery || 'software engineering best practices'); }} className="flex gap-2">
                <input value={googleQuery} onChange={e => setGoogleQuery(e.target.value)} placeholder="Search Google for engineering resources..."
                  className="flex-1 px-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50" />
                <button type="submit" className="button-primary px-4 py-2.5 flex items-center gap-2 text-sm">
                  <Search className="w-4 h-4" /> Search
                </button>
              </form>
              <div className="flex gap-2 mt-2 flex-wrap">
                {['React best practices', 'System design interview', 'LeetCode patterns', 'AWS certification', 'DevOps roadmap', 'ML engineer salary'].map(q => (
                  <button key={q} onClick={() => { setGoogleQuery(q); setGoogleSearch(q); }}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full text-xs transition-all">{q}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`https://www.google.com/search?q=${encodeURIComponent(googleSearch)}&igu=1`}
                title="Google Search"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
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
                    <div className={`max-w-md lg:max-w-2xl rounded-2xl px-5 py-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'card-elevated glass-lg shadow-xl'} transition-all duration-300`}>
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  'How do I optimize React component performance?',
  'Explain microservices architecture',
  'Best practices for database indexing',
  'How to handle errors in async/await?',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hey! I'm your AI-powered career assistant. I can help you with course recommendations, technical questions, interview prep, and career guidance. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, prompt?: string) => {
    if (e) e.preventDefault();
    const messageContent = prompt || inputValue;
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.role === 'assistant') {
            return [...prev.slice(0, -1), { ...lastMsg, content: assistantContent }];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(undefined, prompt);
  };

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 border-r border-border bg-card transition-colors duration-300 flex-col dark:glass-card-lg">
        <div className="p-6 border-b border-border">
          <button className="button-primary w-full flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
            Current Conversation
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5 transition-colors">
            Interview Prep Tips
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5 transition-colors">
            System Design Q&A
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5 transition-colors">
            Resume Review
          </button>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-border space-y-2">
          <button className="w-full flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors dark:hover:bg-white/10">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors dark:hover:bg-white/10">
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card transition-colors duration-300 p-6 dark:glass-card-lg">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Career Assistant</h1>
              <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-md lg:max-w-2xl rounded-2xl px-5 py-4 ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'card-elevated glass-lg shadow-xl'
                    } transition-all duration-300 animate-in fade-in zoom-in-95`}
                >
                  <div className={`prose prose-sm dark:prose-invert max-w-none ${message.role === 'user' ? 'text-white' : 'text-foreground'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <p className={`text-[10px] mt-3 opacity-40 font-medium ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-border bg-card transition-colors duration-300 p-6 dark:glass-card-lg">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Suggested prompts */}
            {messages.length === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="flex items-start gap-3 p-3 card-elevated rounded-lg text-left group transition-all duration-200 hover:border-primary/30"
                  >
                    <Code className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">{prompt}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your engineering career..."
                className="flex-1 px-6 py-3 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground dark:bg-white/10 dark:border-white/20 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="button-primary disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
