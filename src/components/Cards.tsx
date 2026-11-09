import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, RotateCw, Eye, X, Check } from 'lucide-react';

interface CardDeck {
  id: number;
  name: string;
  theme: string;
  tagline: string;
  description: string;
  sampleQuestions: string[];
  price: string;
  count: string;
  frontImage: string;
  backImage: string;
  primaryPrompt: string;
  deckTitleShort: string;
}

const cardDecks: CardDeck[] = [
  {
    id: 1,
    name: 'Lines We Cross Deck',
    theme: 'Choices & Peer Pressure',
    tagline: 'One choice. One line. One life changed forever.',
    description: 'A powerful discussion pack exploring peer pressure, loyalty, decision making and split second choices in high risk situations.',
    sampleQuestions: [
      'Where is the line between looking out for a friend and protecting yourself?',
      'Have you ever stayed silent when you knew a situation was going wrong?',
      'What makes someone a leader in your circle rather than a follower?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/lines-we-cross-front.png',
    backImage: '/covers/lines-we-cross-back.png',
    primaryPrompt: 'Where is the line between looking out for a friend and protecting yourself? Have you ever stayed silent when you knew a situation was going wrong?',
    deckTitleShort: 'LINES WE CROSS',
  },
  {
    id: 2,
    name: 'Behind the Mirror Deck',
    theme: 'Social Media & Self Worth',
    tagline: 'What you see is not always the truth.',
    description: 'Prompts designed for youth and educators addressing online validation, cosmetic pressures, body image and discovering genuine self worth.',
    sampleQuestions: [
      'How much of what you share online represents who you truly are?',
      'When does editing your life online start harming your confidence in real life?',
      'What is one thing about yourself that social media will never measure?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/behind-the-mirror-front.png',
    backImage: '/covers/behind-the-mirror-back.png',
    primaryPrompt: 'When does editing your life online start harming your confidence in real life? What is one thing about yourself that social media will never measure?',
    deckTitleShort: 'BEHIND THE MIRROR',
  },
  {
    id: 3,
    name: 'Behind the Feed Deck',
    theme: 'Online Influence & Critical Thinking',
    tagline: 'Some worlds pull you in before you notice what you are losing.',
    description: 'Crucial conversation starters breaking down digital algorithms, extreme online influencers, toxic masculinity and emotional independence.',
    sampleQuestions: [
      'Who or what shapes your views on what it means to be successful or strong?',
      'How do online groups make people feel powerful while taking away their independent voice?',
      'What makes a role model genuinely positive in your daily life?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/behind-the-feed-front.png',
    backImage: '/covers/behind-the-feed-back.png',
    primaryPrompt: 'Who or what shapes your views on what it means to be successful or strong? How do online algorithms push you toward extreme choices?',
    deckTitleShort: 'BEHIND THE FEED',
  },
  {
    id: 4,
    name: 'Every Breath Deck',
    theme: 'Vaping & Teenage Habits',
    tagline: 'It starts small. Because every breath matters.',
    description: 'Honest questions uncovering the realities of teen vaping culture, social fitting in, hidden chemical addiction and reclaiming health.',
    sampleQuestions: [
      'Did you start because you wanted to, or because everyone around you was doing it?',
      'What are you trading away when a temporary habit controls your day?',
      'How do you say no without feeling like an outsider in your peer group?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/every-breath-front.png',
    backImage: '/covers/every-breath-back.png',
    primaryPrompt: 'Did you start because you wanted to, or because everyone around you was doing it? What are you trading away when a temporary habit controls your day?',
    deckTitleShort: 'EVERY BREATH',
  },
  {
    id: 5,
    name: 'Shared Deck',
    theme: 'Digital Consent & Image Sharing',
    tagline: 'Every picture. Every share. Every consequence.',
    description: 'Essential dialogue prompts tackling non consensual image forwarding, digital trust, peer pressure and repairing self respect after betrayal.',
    sampleQuestions: [
      'Why is forwarded content treated like entertainment when real people are affected?',
      'What would you do if a private photo of someone you knew was sent to a group chat?',
      'How do we build true trust in online communication with friends and partners?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/shared-front.png',
    backImage: '/covers/shared-back.png',
    primaryPrompt: 'Why is forwarded content treated like entertainment when real people are affected? How do we build true digital trust with friends?',
    deckTitleShort: 'SHARED',
  },
  {
    id: 6,
    name: 'By Association Deck',
    theme: 'Circles & Consequences',
    tagline: 'Your circle can cost you everything.',
    description: 'Thought provoking prompts examining joint enterprise, negative peer groups, true loyalty and the courage to step away.',
    sampleQuestions: [
      'Can you stay loyal to your friends while disagreeing with the choices they make?',
      'How do you know when a friendship is starting to pull you down a dangerous road?',
      'What does it take to walk away from a group that no longer serves your future?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/by-association-card-front.png',
    backImage: '/covers/by-association-card-back.png',
    primaryPrompt: 'Kai keeps filming even after the other boy says stop filming this. What does that moment actually reveal about Kai?',
    deckTitleShort: 'BY ASSOCIATION',
  },
  {
    id: 7,
    name: 'Joyride Deck',
    theme: 'Risk, Thrill & Impulse',
    tagline: 'One ride can change everything.',
    description: 'Frank scenarios exploring the thrill of high speed escapism, adrenaline seeking, peer bravado and thinking before taking irreversible risks.',
    sampleQuestions: [
      'Why do risky situations feel exciting in the moment even when we know the danger?',
      'Have you ever felt pressured into doing something reckless just to prove yourself?',
      'How do you slow down and think clearly when your adrenaline is racing?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/joyride-front.png',
    backImage: '/covers/joyride-back.png',
    primaryPrompt: 'Why do risky situations feel exciting in the moment even when we know the danger? Have you ever felt pressured into reckless risks to prove yourself?',
    deckTitleShort: 'JOYRIDE',
  },
  {
    id: 8,
    name: 'Bridges Between Us Deck',
    theme: 'Racism, Allyship & Inclusion',
    tagline: "Some distances aren't meant to keep us apart.",
    description: 'Meaningful prompts designed to confront prejudice, microaggressions, cultural identity and how young people can become active allies.',
    sampleQuestions: [
      'What is the difference between casual banter and language that causes harm?',
      'When have you witnessed unfair treatment and what stopped you or helped you speak up?',
      'How can we celebrate different cultures without reducing people to stereotypes?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/bridges-between-us-front.png',
    backImage: '/covers/bridges-between-us-back.png',
    primaryPrompt: 'What is the difference between casual banter and language that causes harm? How can we become active allies when someone is treated unfairly?',
    deckTitleShort: 'BRIDGES BETWEEN US',
  },
  {
    id: 9,
    name: 'The Last Ride Deck',
    theme: 'Grief, Brotherhood & Moving Forward',
    tagline: 'Some rides are for adrenaline. Others are for survival.',
    description: 'Gentle yet powerful prompts exploring loss among young people, carrying memory, coping with trauma and choosing positive brotherhood.',
    sampleQuestions: [
      'How do you deal with the sudden loss of someone who was part of your daily routine?',
      'Who is the one person you can truly speak to when emotions become overwhelming?',
      'What does healthy brotherhood look like when things get tough?'
    ],
    price: '£7.99',
    count: 'Prompt Card Deck',
    frontImage: '/covers/lines-we-cross-front.png',
    backImage: '/covers/the-last-ride-back.png',
    primaryPrompt: 'How do you deal with the sudden loss of someone who was part of your daily routine? What does healthy brotherhood look like when things get tough?',
    deckTitleShort: 'THE LAST RIDE',
  },
];

export default function Cards() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [activeModalDeck, setActiveModalDeck] = useState<CardDeck | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (id: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleBuyNow = (deckName: string) => {
    const message = encodeURIComponent(`Hi Luke, I would like to order the ${deckName} from your website.`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="cards" className="py-24 bg-black text-white relative border-t border-white/5" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-neon font-mono font-bold text-xs uppercase tracking-widest">
              Interactive Cue Card Decks • Discussion Prompts
            </span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Conversation Tools for <span className="text-neon">Young People & Leaders</span>
          </h2>

          {/* Exact paragraph requested by Luke Cato */}
          <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto font-light leading-relaxed">
            Each book comes with its own set of cue cards, with conversation prompts and activities you can use as you read or come back to afterwards. Whether you’re reading on your own first or sharing the book with a young person, the cards give you a simple way to start conversations that can be hard to bring up. They help you explore the story together, hear what your young person thinks and talk through what they might do in a similar situation.
          </p>
        </div>

        {/* Products Grid: 3D Tuck Box Deck Presentation (LANDSCAPE) with Interactive Flip on Every Pack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardDecks.map((deck, index) => {
            const isFlipped = !!flippedCards[deck.id];

            return (
              <div
                key={deck.id}
                className="card reveal flex flex-col group bg-[#0e0e0e] border border-white/15 rounded-3xl overflow-hidden hover:border-neon/50 transition-all duration-300 hover:shadow-2xl hover:shadow-neon/10"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* 3D Physical Card Deck / Box Presentation (LANDSCAPE ORIENTATION) */}
                <div className="relative h-72 sm:h-80 bg-gradient-to-b from-[#181818] to-[#0a0a0a] p-6 flex items-center justify-center overflow-hidden border-b border-white/10">
                  
                  {/* Subtle tuck box depth glow */}
                  <div className="absolute inset-0 bg-radial-gradient from-white/[0.04] to-transparent pointer-events-none" />

                  {/* Card Deck Mockup Container with 3D Flip (LANDSCAPE RATIO) */}
                  <div 
                    onClick={() => toggleFlip(deck.id)}
                    className="relative cursor-pointer group-hover:scale-105 transition-transform duration-500 w-64 sm:w-72 h-44 sm:h-48 flex items-center justify-center"
                    title="Click to flip between Cover and Prompt Questions"
                  >
                    {/* Layered Card Stack Effect behind to look like a physical landscape deck */}
                    <div className="absolute inset-0 translate-x-1 translate-y-1.5 bg-white/10 rounded-2xl border border-white/20 transform rotate-1" />
                    <div className="absolute inset-0 translate-x-2 translate-y-3 bg-black/70 rounded-2xl border border-white/10 transform rotate-2" />

                    {/* Main Active Card (Front or Back) in Landscape */}
                    <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/25 bg-black flex items-center justify-center">
                      {!isFlipped ? (
                        /* FRONT COVER: NEVER CROPPED */
                        deck.id === 6 ? (
                          <img
                            src={deck.frontImage}
                            alt={deck.name}
                            className="w-full h-full object-cover transition-opacity duration-300"
                          />
                        ) : (
                          <div className="w-full h-full p-2 bg-gradient-to-br from-[#1c1c1c] via-[#0d0d0d] to-[#050505] flex items-center justify-center relative">
                            {/* Inner Double-Line Border framing the card */}
                            <div className="absolute inset-2 border border-white/20 rounded-xl pointer-events-none" />
                            <div className="absolute inset-2.5 border border-white/10 rounded-lg pointer-events-none" />
                            <img
                              src={deck.frontImage}
                              alt={deck.name}
                              className="w-full h-full object-contain relative z-10 drop-shadow-md"
                            />
                          </div>
                        )
                      ) : (
                        /* REVERSE DEMO CARD: Styled exactly like Luke's By Association reverse card */
                        deck.id === 6 ? (
                          <img
                            src={deck.backImage}
                            alt="Discussion prompt card reverse"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full p-3.5 bg-gradient-to-b from-[#141414] via-[#0c0c0c] to-[#060606] flex flex-col justify-between items-center text-center relative">
                            {/* Double-Line Gold / Amber Border */}
                            <div className="absolute inset-1.5 border border-amber-500/40 rounded-xl pointer-events-none" />
                            <div className="absolute inset-2 border border-amber-500/20 rounded-lg pointer-events-none" />

                            {/* Top Accent Line */}
                            <div className="w-14 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1" />

                            {/* Center Authentic Prompt */}
                            <div className="px-3 py-1 flex items-center justify-center flex-1">
                              <p className="text-white text-xs sm:text-[13px] font-semibold leading-relaxed">
                                {deck.primaryPrompt}
                              </p>
                            </div>

                            {/* Bottom Accent Line & Title */}
                            <div className="w-full flex flex-col items-center">
                              <div className="w-14 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-1" />
                              <span className="text-[10px] sm:text-[11px] font-heading font-black tracking-widest text-amber-400 uppercase">
                                {deck.deckTitleShort}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                      {/* Tuck-box glossy finish overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
                    </div>
                  </div>

                  {/* Top Badge: Landscape Deck */}
                  <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md border border-neon/40 text-neon text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow">
                    {deck.count}
                  </div>

                  {/* Theme Pill */}
                  <div className="absolute top-4 left-4 bg-neon text-black text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow">
                    {deck.theme}
                  </div>

                  {/* Flip Action Pill */}
                  <button
                    onClick={() => toggleFlip(deck.id)}
                    className="absolute bottom-4 right-4 bg-black/85 hover:bg-neon hover:text-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/20 hover:border-neon flex items-center gap-1.5 transition-all shadow-lg"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isFlipped ? 'View Deck Cover' : 'Flip to Questions'}</span>
                  </button>

                  {/* Quick Expand Modal Button */}
                  <button
                    onClick={() => setActiveModalDeck(deck)}
                    className="absolute bottom-4 left-4 bg-black/85 hover:bg-white text-gray-300 hover:text-black text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all shadow"
                    title="Read sample discussion questions in detail"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Structured Description Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white mb-1.5 group-hover:text-neon transition-colors duration-200">
                      {deck.name}
                    </h3>
                    
                    <p className="text-neon/90 font-medium text-xs mb-3 italic">
                      "{deck.tagline}"
                    </p>

                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4 font-light">
                      {deck.description}
                    </p>

                    {/* What this pack contains: clear structured highlights */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 mb-5 space-y-1.5 text-[11px] text-gray-300">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Check className="w-3.5 h-3.5 text-neon" />
                        <span>Color-coded prompt cue cards in custom landscape tuck box</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-neon" />
                        <span>Built for parents, schools and youth practitioners</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Primary CTA */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <div>
                      <span className="text-2xl font-bold text-white font-mono">{deck.price}</span>
                      <p className="text-gray-400 text-[11px] font-light mt-0.5">Automated UK Print & Post</p>
                    </div>

                    <button
                      onClick={() => handleBuyNow(deck.name)}
                      className="flex items-center gap-2 bg-neon hover:bg-neon-hover text-black font-bold px-5 py-2.5 rounded-full transition-all duration-300 text-xs shadow-lg shadow-neon/20 hover:scale-105"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Deck</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal for Sample Questions */}
      {activeModalDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setActiveModalDeck(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-block bg-neon text-black text-xs font-mono font-bold px-3 py-1 rounded-full mb-3">
              {activeModalDeck.theme}
            </div>

            <h3 className="font-heading text-2xl font-bold text-white mb-2">
              {activeModalDeck.name}
            </h3>
            <p className="text-neon text-xs italic mb-4">"{activeModalDeck.tagline}"</p>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
              {activeModalDeck.description}
            </p>

            <div className="space-y-3 mb-8">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold">
                Sample Questions on Reverse of Cards:
              </p>
              {activeModalDeck.sampleQuestions.map((q, idx) => (
                <div key={idx} className="bg-black/60 border border-white/10 rounded-xl p-3.5 text-sm text-gray-200 flex items-start gap-3">
                  <span className="text-neon font-mono font-bold text-xs mt-0.5">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="leading-snug">{q}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-2xl font-bold text-white font-mono">{activeModalDeck.price}</span>
              <button
                onClick={() => {
                  handleBuyNow(activeModalDeck.name);
                  setActiveModalDeck(null);
                }}
                className="bg-neon hover:bg-neon-hover text-black font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg shadow-neon/20 hover:scale-105 transition-transform"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Deck</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
