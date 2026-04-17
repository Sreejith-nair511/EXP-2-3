'use client';

import { hackathons } from '@/lib/constants';
import { Calendar, ExternalLink, MapPin, Tag, Trophy, Users } from 'lucide-react';
import { useState } from 'react';

type Platform = 'all' | 'unstop' | 'hack2skill';

const platformConfig = {
  unstop: {
    label: 'Unstop',
    color: 'from-orange-500 to-yellow-500',
    badge: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    url: 'https://unstop.com/hackathons',
  },
  hack2skill: {
    label: 'Hack2Skill',
    color: 'from-violet-500 to-blue-500',
    badge: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    url: 'https://hack2skill.com/hack/hackathons',
  },
};

export default function HackathonsPage() {
  const [activeTab, setActiveTab] = useState<'cards' | 'unstop' | 'hack2skill'>('cards');
  const [filter, setFilter] = useState<Platform>('all');

  const filtered = filter === 'all' ? hackathons : hackathons.filter((h) => h.platform === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-950/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hackathons & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Competitions</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Compete, build, and win â€” sourced from India's top hackathon platforms
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8">
        {/* Main Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-0">
          {[
            { key: 'cards', label: 'ðŸ† All Hackathons' },
            { key: 'unstop', label: 'ðŸ”¶ Unstop' },
            { key: 'hack2skill', label: 'ðŸŸ£ Hack2Skill' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-5 py-2.5 font-semibold text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards View */}
        {activeTab === 'cards' && (
          <>
            {/* Platform filter pills */}
            <div className="flex gap-3 flex-wrap">
              {(['all', 'unstop', 'hack2skill'] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === p
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p === 'all' ? 'All Platforms' : p === 'unstop' ? 'Unstop' : 'Hack2Skill'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((hackathon) => {
                const platform = platformConfig[hackathon.platform as keyof typeof platformConfig] ?? platformConfig.other;
                return (
                  <div
                    key={hackathon.id}
                    className="group relative bg-white/5 border border-white/10 hover:border-white/20 p-6 rounded-2xl transition-all duration-300 hover:bg-white/8 flex flex-col gap-4"
                  >
                    {/* Platform badge */}
                    <span className={`self-start px-2.5 py-1 rounded-full text-xs font-semibold ${platform.badge}`}>
                      {platform.label}
                    </span>

                    <h3 className="text-lg font-bold text-white leading-snug">{hackathon.title}</h3>

                    <div className="flex items-center gap-2 text-yellow-400 font-semibold text-sm">
                      <Trophy className="w-4 h-4" />
                      <span>{hackathon.prize}</span>
                    </div>

                    <div className="space-y-2 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{hackathon.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                        <span>{hackathon.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{hackathon.participants.toLocaleString()}+ participants</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {hackathon.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-full text-xs text-slate-400">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                        Registering
                      </span>
                      <a
                        href={hackathon.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${platform.color} text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:scale-105`}
                      >
                        Register
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Unstop Embed */}
        {activeTab === 'unstop' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Unstop Hackathons</h2>
                <p className="text-slate-400 text-sm mt-1">India's largest student competition platform</p>
              </div>
              <a
                href="https://unstop.com/hackathons"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors"
              >
                Open in new tab <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white">
              <iframe
                src="https://unstop.com/hackathons"
                title="Unstop Hackathons"
                className="w-full"
                style={{ height: '75vh', minHeight: '600px' }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
            </div>
            <p className="text-slate-500 text-xs text-center">
              Content loaded from unstop.com â€” if blocked by your browser, use the "Open in new tab" button above.
            </p>
          </div>
        )}

        {/* Hack2Skill Embed */}
        {activeTab === 'hack2skill' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Hack2Skill Hackathons</h2>
                <p className="text-slate-400 text-sm mt-1">Premier platform for tech challenges and hackathons</p>
              </div>
              <a
                href="https://hack2skill.com/hack/hackathons"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-lg text-sm font-medium hover:bg-violet-500/30 transition-colors"
              >
                Open in new tab <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white">
              <iframe
                src="https://hack2skill.com/hack/hackathons"
                title="Hack2Skill Hackathons"
                className="w-full"
                style={{ height: '75vh', minHeight: '600px' }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
            </div>
            <p className="text-slate-500 text-xs text-center">
              Content loaded from hack2skill.com â€” if blocked by your browser, use the "Open in new tab" button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

