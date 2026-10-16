import React, { useState } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { MessageSquare, ShieldCheck, KeyRound, Sparkles, MessageCircle, HelpCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface ArticleConfig {
  url: string;
  id: string;
  title: string;
}

const PRESET_TOPICS: { id: string; title: string; desc: string }[] = [
  {
    id: 'talk-to-us-main',
    title: 'PrepCart Community - Talk to Us & Feedback',
    desc: 'General feedback, feature requests, or questions for the PrepCart team.'
  },
  {
    id: 'talk-to-us-recipes',
    title: 'PrepCart - Weekly Recipe Ideas & Meal Prep Swaps',
    desc: 'Share your favorite weeknight hacks, meal prep routines, and pantry saves.'
  },
  {
    id: 'talk-to-us-grocers',
    title: 'PrepCart - Grocery Dispatch & Delivery Partners',
    desc: 'Feedback on RedMart, GrabMart, Amazon Fresh, and FairPrice cart integration.'
  }
];

export const TalkToUs: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(PRESET_TOPICS[0]);
  const [enableSSO, setEnableSSO] = useState(false);
  const [ssoApiKey, setSsoApiKey] = useState('');
  const [remoteAuthS3, setRemoteAuthS3] = useState('');

  // Current URL or fallback
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#${selectedTopic.id}`
    : `https://femmicare.disqus.com/talk-to-us`;

  const article: ArticleConfig = {
    url: currentUrl,
    id: selectedTopic.id,
    title: selectedTopic.title
  };

  // 1. Standard config matching snippet 1
  const standardConfig = {
    url: article.url,
    identifier: article.id,
    title: article.title,
    language: 'en'
  };

  // 3. SSO config matching snippet 3
  const ssoConfig = {
    url: article.url,
    identifier: article.id,
    title: article.title,
    language: 'en',
    remoteAuthS3: remoteAuthS3,
    apiKey: ssoApiKey,
    sso: {
      name: 'PrepCart User',
      button: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      url: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://example.com/login/',
      logout: typeof window !== 'undefined' ? `${window.location.origin}/logout` : 'http://example.com/logout/',
      profile_url: 'http://example.com/profileUrlTemplate/{username}',
      width: '800',
      height: '400'
    }
  };

  const activeConfig = enableSSO ? ssoConfig : standardConfig;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero / Header */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/60">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Community Forum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Talk to Us
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We would love to hear from you! Have feedback on your meal plan, suggestions for grocery dispatch partners, or tasty recipe recommendations? Drop a comment below.
            </p>
          </div>

          {/* Comment Count Badge & Forum Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200/70 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-neutral-500 font-medium">Disqus Forum (`femmicare`)</div>
                <div className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <CommentCount
                    shortname="femmicare"
                    config={{
                      url: article.url,
                      identifier: article.id,
                      title: article.title
                    }}
                  >
                    Comments
                  </CommentCount>
                </div>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-neutral-200 mx-2" />
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Moderated by Disqus</span>
            </div>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Select Discussion Channel
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 text-neutral-900 shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm truncate">{topic.title.replace('PrepCart - ', '')}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {topic.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SSO Configuration Toggle */}
        <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnableSSO(!enableSSO)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enableSSO ? 'bg-emerald-600' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enableSSO ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="text-xs">
              <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-neutral-600" />
                SSO (Single Sign-On) Mode
              </span>
              <span className="text-neutral-500">
                {enableSSO ? 'SSO payload config enabled' : 'Standard Disqus authentication'}
              </span>
            </div>
          </div>

          <a
            href="https://disqus.com/profile/login/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
          >
            <span>Manage Disqus Account</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* SSO Input Fields if enabled */}
        {enableSSO && (
          <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 animate-in fade-in duration-200">
            <div className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Disqus Single Sign-On (SSO) Parameters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Disqus Public API Key</label>
                <input
                  type="text"
                  placeholder="Optional: API Key from Disqus Applications"
                  value={ssoApiKey}
                  onChange={(e) => setSsoApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Remote Auth S3 Payload</label>
                <input
                  type="text"
                  placeholder="Optional: Server-generated HMAC payload"
                  value={remoteAuthS3}
                  onChange={(e) => setRemoteAuthS3(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 leading-normal">
              When configured with a valid remoteAuthS3 HMAC token, users are automatically signed in using your application's user identity.
            </p>
          </div>
        )}
      </div>

      {/* Embedded Forum Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {selectedTopic.title}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Topic Identifier: <code className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-700 font-mono text-[11px]">{article.id}</code>
            </p>
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            shortname: femmicare
          </div>
        </div>

        {/* Disqus Embed Component */}
        <div className="min-h-[400px]">
          <DiscussionEmbed
            key={`${article.id}-${enableSSO ? 'sso' : 'std'}`}
            shortname="femmicare"
            config={activeConfig}
          />
        </div>
      </div>

      {/* Helpful Tips Card */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-200/70 p-5 flex items-start gap-3.5 text-xs text-neutral-600">
        <HelpCircle className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-neutral-800">
            About the Disqus Community Forum
          </p>
          <p className="leading-relaxed">
            Disqus allows guest commenting, social sign-in (Google, Facebook, X), and customizable notifications. If you do not see the comments loading immediately, ensure your browser is not blocking 3rd-party scripts or tracker shields for disqus.com.
          </p>
        </div>
      </div>
    </div>
  );
};
