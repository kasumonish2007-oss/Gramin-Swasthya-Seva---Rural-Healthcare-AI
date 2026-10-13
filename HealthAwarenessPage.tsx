import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Volume2,
  Tag,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { HealthArticle } from '../types';
import { AudioPlayer } from '../components/AudioPlayer.tsx';

export const HealthAwarenessPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<HealthArticle | null>(null);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const data = await api.getArticles({
          category: selectedCategory,
          search: searchQuery,
        });
        setArticles(data);
      } catch (err) {
        console.error('Failed to load health articles:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [selectedCategory, searchQuery]);

  // Helpers to get localized content
  const getLocalizedTitle = (a: HealthArticle) => {
    if (language === 'hi') return a.titleHi || a.titleEn;
    if (language === 'te') return a.titleTe || a.titleEn;
    return a.titleEn;
  };

  const getLocalizedSummary = (a: HealthArticle) => {
    if (language === 'hi') return a.summaryHi || a.summaryEn;
    if (language === 'te') return a.summaryTe || a.summaryEn;
    return a.summaryEn;
  };

  const getLocalizedContent = (a: HealthArticle) => {
    if (language === 'hi') return a.contentHi || a.contentEn;
    if (language === 'te') return a.contentTe || a.contentEn;
    return a.contentEn;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Village Health Education</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t('awarenessTitle')}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
          {t('awarenessSubtitle')}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search health guides..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs w-full sm:w-auto">
          {['all', 'Water & Hygiene', 'Maternal & Child Health', 'Monsoon Diseases', 'Rural Emergencies', 'Child Vaccination'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-stone-500 text-sm">
            Loading health education resources...
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
            No health education articles found for this topic.
          </div>
        ) : (
          articles.map((article) => {
            const title = getLocalizedTitle(article);
            const summary = getLocalizedSummary(article);
            const fullContent = getLocalizedContent(article);

            return (
              <div
                key={article._id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-stone-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTimeMinutes} {t('readTime')}</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-stone-900 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {summary}
                  </p>

                  {/* Key Tips Chips */}
                  {article.keyTips && article.keyTips.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-stone-400 block">Key Village Tips:</span>
                      {article.keyTips.slice(0, 2).map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="truncate">{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  {/* TTS audio listen button */}
                  <AudioPlayer text={`${title}. ${summary}. ${fullContent}`} label={t('listenArticle')} />

                  <button
                    onClick={() => setReadingArticle(article)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Full</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* READING ARTICLE MODAL */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between border-b border-emerald-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  {readingArticle.category} • {readingArticle.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                  {getLocalizedTitle(readingArticle)}
                </h3>
              </div>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-sm leading-relaxed">
              {/* TTS in modal */}
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-xs font-medium text-stone-600">
                  Listen to this guide in your language:
                </span>
                <AudioPlayer
                  text={`${getLocalizedTitle(readingArticle)}. ${getLocalizedContent(readingArticle)}`}
                  label="Listen Aloud"
                  className="bg-emerald-100 text-emerald-900 border-emerald-300"
                />
              </div>

              {/* Formatted Content */}
              <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                {getLocalizedContent(readingArticle)}
              </div>

              {/* Actionable Tips */}
              {readingArticle.keyTips && readingArticle.keyTips.length > 0 && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <h4 className="font-bold text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Important Guidelines & Action Checklist</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {readingArticle.keyTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
