'use client';

import { ExternalLink, Briefcase, Search, Zap } from 'lucide-react';
import { useState } from 'react';

const JOB_SITES = [
  {
    key: 'hiring-cafe',
    label: 'Hiring Cafe',
    emoji: '☕',
    url: 'https://hiring.cafe',
    description: 'AI-powered job search — find roles that match your skills instantly',
    color: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn Jobs',
    emoji: '💼',
    url: 'https://www.linkedin.com/jobs',
    description: 'World\'s largest professional network with millions of job listings',
    color: 'from-blue-600 to-blue-700',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  },
  {
    key: 'internshala',
    label: 'Internshala',
    emoji: '🎓',
    url: 'https://internshala.com/jobs',
    description: 'India\'s top platform for internships and fresher jobs',
    color: 'from-teal-500 to-cyan-500',
    badge: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  },
  {
    key: 'naukri',
    label: 'Naukri',
    emoji: '🇮🇳',
    url: 'https://www.naukri.com',
    description: 'India\'s #1 job portal with 70,000+ active tech listings',
    color: 'from-rose-500 to-pink-500',
    badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  },
];

export default function JobsPage() {
  const [active, setActive] = useState('hiring-cafe');
  const current = JOB_SITES.find(s => s.key === active)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Board</span>
                </h1>
              </div>
              <p className="text-slate-400">Find your next engineering role — powered by the best job platforms</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">AI-powered matching on Hiring Cafe</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Platform selector tabs */}
        <div className="flex flex-wrap gap-2">
          {JOB_SITES.map(site => (
            <button key={site.key} onClick={() => setActive(site.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${active === site.key
                ? `bg-gradient-to-r ${site.color} text-white shadow-lg`
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'}`}>
              <span>{site.emoji}</span> {site.label}
            </button>
          ))}
        </div>

        {/* Active site info bar */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
          <div>
            <p className="text-white font-semibold">{current.emoji} {current.label}</p>
            <p className="text-slate-400 text-sm mt-0.5">{current.description}</p>
          </div>
          <a href={current.url} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${current.color} text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 ml-4`}>
            Open <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Iframe embed */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl">
          <iframe
            key={active}
            src={current.url}
            title={current.label}
            className="w-full"
            style={{ height: '78vh', minHeight: '600px' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          />
        </div>
        <p className="text-slate-500 text-xs text-center">
          If the site doesn't load due to browser restrictions, use the "Open" button above to visit directly.
        </p>
      </div>
    </div>
  );
}
