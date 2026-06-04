import { useState, useRef } from 'react';
import Headshot from './Headshot.jsx';
import ResumeRequestModal from './ResumeRequestModal.jsx';

export default function Hero() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const inputRef = useRef(null);

  // Curated questions about your UX/design expertise, interests, and skillsets
  const luckyChallenges = [
    "how do you reduce cognitive load in complex systems?",
    "what's your philosophy on design-engineering collaboration?",
    "how do you build trust in AI-powered products?",
    "what does a clean enterprise UX look like?",
    "how do you translate security concepts into intuitive design?",
    "what's your approach to designing for ambiguity in data systems?",
    "how do you balance aesthetics with enterprise constraints?",
    "what role should design play in threat intelligence workflows?",
    "how do you design for users who deal with complex analysis?",
    "what makes a good design system for rapidly evolving products?",
    "how do you handle design-driven innovation in conservative industries?",
    "what's your take on AI replacing design vs. AI enhancing design?",
  ];

  // Pre-written responses for each question
  const responses = {
    "how do you reduce cognitive load in complex systems?": "I obsess over information hierarchy. Every UI I design answers: what does the user need right now? For threat intelligence platforms, that meant turning 50+ data points into 5 decisions. For AI products, it's making confidence and uncertainty equally visible. Clean IA, progressive disclosure, and ruthless editing—that's where clarity comes from.",

    "what's your philosophy on design-engineering collaboration?": "Design and engineering aren't sequential—they're simultaneous. I prototype in code from day one, sit in standups, understand constraints before I start sketching. The best designs come from teams that speak the same language. I've shipped products with engineers where we debated trade-offs together, not across Figma comments.",

    "how do you build trust in AI-powered products?": "AI products fail when users don't understand the system. I design for transparency: why did the AI suggest this? How confident is it? What happens if it's wrong? Every AI feature needs escape hatches, confidence indicators, and a human-in-the-loop option. Trust isn't a feature—it's a foundational principle.",

    "what does a clean enterprise UX look like?": "It's not minimalism for minimalism's sake. Clean enterprise design means users find what they need without drowning in options. It's dense information presented clearly. Think: every button earns its space, every animation has purpose, every color conveys meaning. Enterprise users are busy—respect their time.",

    "how do you translate security concepts into intuitive design?": "Security can feel abstract and scary. I make it tangible. Risk levels become visual hierarchies. Complex authentication becomes a guided flow. The goal isn't to simplify security—it's to make secure practices feel natural, not burdensome. When security friction disappears, compliance improves.",

    "what's your approach to designing for ambiguity in data systems?": "Ambiguity is the enemy of confident decision-making. I design to surface it visually, not hide it. Confidence indicators, data quality flags, and clear provenance help users understand what they're looking at. In data-driven products, transparency about uncertainty is actually more valuable than false certainty.",

    "how do you balance aesthetics with enterprise constraints?": "Aesthetics and functionality aren't enemies. Beauty in enterprise design means restraint—a well-chosen typeface, a subtle color palette, generous whitespace. It signals competence. But the real beauty is in the interaction: smooth animations, responsive feedback, delightful error states. That's where craft lives.",

    "what role should design play in threat intelligence workflows?": "Design should make threat analysts faster and more accurate. That means deeply understanding their workflows: what context do they need? What decisions recur? How do experts actually use these tools? It's not about adding features—it's about removing friction from expert practice.",

    "how do you design for users who deal with complex analysis?": "Power users need power tools. But power doesn't have to mean complexity. It means: deep customization options, keyboard shortcuts, scripting, APIs. The interface gets out of the way once users know what they're doing. Onboarding is critical—you're teaching a language, not just a tool.",

    "what makes a good design system for rapidly evolving products?": "Flexibility is the enemy of consistency. A good design system constrains choice in ways that feel generous, not restrictive. It needs clear tokens (colors, spacing, type), documented patterns, and a component library that anticipates needs without predicting futures. It evolves with the product, not after it.",

    "how do you handle design-driven innovation in conservative industries?": "You don't push innovation—you prove it. I build prototypes, run small tests, measure impact. Conservative industries care about: risk reduction, compliance, user adoption. Frame design innovation as addressing those concerns, not as beauty for beauty's sake. Numbers convince stakeholders; design ships products.",

    "what's your take on AI replacing design vs. AI enhancing design?": "AI will handle commodity design—accessible components, basic layouts, responsive adjustments. But AI won't replace the thinking: understanding users, making trade-offs, defining what matters. The future is designers who know how to work with AI, not designers replaced by it. Design + AI is more powerful than either alone."
  };

  const handleLucky = () => {
    const randomQuestion = luckyChallenges[
      Math.floor(Math.random() * luckyChallenges.length)
    ];
    setMessages([{ role: 'user', content: randomQuestion }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: responses[randomQuestion] || "Great question!" }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content) return;
    setMessages([...messages, { role: 'user', content }]);
    setInputValue('');
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* UNIFIED HEADER - Photo + All Text */}
        <div className="flex items-start gap-8 mb-12">
          <div className="flex-shrink-0">
            <div className="relative h-20 w-20">
              <Headshot
                alt="Kamala Espig"
                className="h-20 w-20"
                imgClassName="border-2 border-white shadow-lg"
              />
              <span
                className="absolute top-0 right-0 z-20 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-md"
                aria-label="Available"
              />
            </div>
          </div>

          <div className="flex-1 space-y-0">
            <p className="hero-text">
              I&apos;m{' '}
              <span className="border-l-2 border-r-2 border-blue-500 bg-blue-100 px-2 py-0 font-semibold">
                Kamala Espig
              </span>
              {' '}— based in Leesburg, VA.
            </p>

            <p className="hero-text">
              I design clarity into{' '}
              <span className="hero-text-italic">
                complex
              </span>
              {' '}systems — and ship them.
            </p>

            <p className="hero-subtitle mt-4">
              Senior Product Designer bridging AI, cybersecurity, and data-dense enterprise platforms. 12+ years turning complexity into confidence.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS - 4 STREAMLINED BUTTONS */}
        <div className="flex flex-wrap gap-2 justify-end mb-8">
          {/* See my work */}
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="hero-button"
          >
            see my work
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Resume */}
          <button
            onClick={() => setResumeModalOpen(true)}
            className="hero-button"
          >
            resume
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/kamalathedesigner/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-button"
          >
            linkedin
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Feeling Lucky */}
          <button
            onClick={handleLucky}
            className="hero-button"
          >
            feeling lucky?
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>

        {/* CHAT SECTION */}
        <div className="space-y-4 max-w-2xl w-full mx-auto">
          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-3 mb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-foreground/5 text-foreground'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-foreground/5 px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-foreground/10 rounded-full hover:border-foreground/20 focus-within:border-foreground/30 transition-all">
              <span className="text-foreground/40 text-sm font-mono whitespace-nowrap">{">_"}</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="ask anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-foreground/30"
              />
              <button
                onClick={handleSend}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground/60 hover:text-foreground/80 transition-all flex-shrink-0"
                aria-label="Send"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-foreground/40">
              <p>
                Built with love and{' '}
                <a
                  href="https://www.anthropic.com/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground/80 underline transition-colors"
                >
                  Claude Code
                </a>
                {' '}· 2026
              </p>
            </div>
          </div>
        </div>

        <ResumeRequestModal isOpen={resumeModalOpen} onClose={() => setResumeModalOpen(false)} />
      </div>
    </section>
  );
}
