import { useState, useRef } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, MessageSquare, Layers, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export interface BookSlide {
  id: number;
  asin: string;
  title: string;
  tagline: string;
  blurb: string;
  fullOverview: string;
  coverUrl: string;
  cueCardCover: string;
  promptCard: string;
  amazonUrl: string;
  tag: string | null;
  cardCount: string;
}

export const bookSlides: BookSlide[] = [
  {
    id: 1,
    asin: 'B0HBW8CBGG',
    title: 'Offline',
    tagline: 'A powerful novel of escape, identity and the price of disconnection.',
    blurb: 'Sixteen-year-old Leah Morgan used to light up every room. But harmless late-night scrolling quietly spirals into endless videos, comparison, and anxiety — until a frightening panic attack forces her to confront a difficult truth: Sometimes the screen is slowly replacing the world.',
    fullOverview: `Sixteen-year-old Leah Morgan used to light up every room she entered. She loved football, music, and spending time with friends. Her phone was simply part of everyday life.

Until it quietly became the centre of it.

What begins as harmless late-night scrolling slowly grows into something much darker. Endless videos, online comparison, comment sections, and algorithm-driven content leave Leah exhausted, anxious, and increasingly disconnected from the people who love her most.

As her friendships begin to crumble, her family struggles to understand the changes they see, and a frightening panic attack forces everything into the open, Leah must confront a difficult truth:
Sometimes the screen isn't showing the world.
It's slowly replacing it.

Offline is an emotionally honest contemporary young adult novel exploring doom scrolling, social media addiction, digital isolation, and the courage to reconnect with the real world. Accompanied by a dedicated set of landscape cue cards to spark open discussions.`,
    coverUrl: 'https://m.media-amazon.com/images/I/71jEl0twYcL._AC_UY500_.jpg',
    cueCardCover: '/covers/lines-we-cross-front.png',
    promptCard: '/covers/lines-we-cross-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HBW8CBGG',
    tag: 'Bestseller',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 2,
    asin: 'B0HBXDP7TP',
    title: 'Lines We Cross',
    tagline: 'One choice. One moment. One life changed forever.',
    blurb: 'Jaylen and his friends are drawn into a street confrontation where peer pressure and loyalty collide. A piercing story exploring knife crime, gang culture, and the real power of choosing to walk away.',
    fullOverview: `One split-second decision changes everything. Jaylen and his friends are drawn into a high-stakes street confrontation where peer pressure, loyalty, and street codes collide. 

It reveals how easily boundaries are blurred when trying to fit in, the hidden traps of criminal exploitation, and what it truly takes to walk a different path before an irreversible line is crossed.

Built-in reflection points give parents, carers, and youth practitioners practical entry points to discuss high-stakes decisions, accompanied by a matching landscape cue card deck.`,
    coverUrl: '/covers/lines-we-cross-front.png',
    cueCardCover: '/covers/lines-we-cross-front.png',
    promptCard: '/covers/lines-we-cross-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HBXDP7TP',
    tag: 'Popular',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 3,
    asin: 'B0HCKV8RWG',
    title: 'Behind the Mirror',
    tagline: "What you see isn't always the truth.",
    blurb: 'Fifteen-year-old Ava becomes trapped in cosmetic filters and online validation. When admiration spirals into dangerous real-world attention, she must confront the true meaning of self-worth.',
    fullOverview: `Fifteen-year-old Ava is trapped in a whirlwind of cosmetic filters, social validation, and aesthetic pressure. When online admiration spirals into dangerous real-world attention, she must confront the true meaning of self-worth and genuine identity.

Designed for youth, parents, and educators addressing digital validation, body image, and finding confidence offline.`,
    coverUrl: '/covers/behind-the-mirror-front.png',
    cueCardCover: '/covers/behind-the-mirror-front.png',
    promptCard: '/covers/behind-the-mirror-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HCKV8RWG',
    tag: 'New Release',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 4,
    asin: 'B0HBPJZRBN',
    title: 'Behind the Feed',
    tagline: "Some worlds pull you in before you notice what you're losing.",
    blurb: 'Kieran searches for direction until social media algorithms pull him into an aggressive echo chamber of status and power. A hard-hitting look at online radicalisation and toxic masculinity.',
    fullOverview: `Kieran is searching for confidence and direction when social media algorithms pull him into an echo chamber of status, power, and extreme views. 

A hard-hitting exploration of online radicalisation, toxic masculinity, digital rabbit holes, and the courage required to think independently and step away.`,
    coverUrl: '/covers/behind-the-feed-front.png',
    cueCardCover: '/covers/behind-the-feed-front.png',
    promptCard: '/covers/behind-the-feed-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HBPJZRBN',
    tag: 'Top Pick',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 5,
    asin: 'B0HCL5XHFQ',
    title: 'Every Breath',
    tagline: 'It starts small. Because every breath matters.',
    blurb: 'A puff, a flavor, a social boost. What begins as curiosity quickly becomes an addiction. Tackling the explosion of teen vaping, predatory marketing, and reclaiming health.',
    fullOverview: `A puff, a flavor, a social boost. What starts as casual curiosity quickly becomes a daily dependency. 

Every Breath tackles the explosion of teen vaping culture, peer pressure, predatory marketing, and the real choices that shape a young person’s health and future. Includes matching prompt cue cards for classrooms and families.`,
    coverUrl: '/covers/every-breath-front.png',
    cueCardCover: '/covers/every-breath-front.png',
    promptCard: '/covers/every-breath-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HCL5XHFQ',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 6,
    asin: 'B0HBN4V47M',
    title: 'Shared',
    tagline: 'Every picture. Every share. Every consequence.',
    blurb: 'One screenshot forwarded in a group chat, and lives unravel. Shared confronts non-consensual image sharing, cyberbullying, digital trust, and the lasting impact of digital betrayal.',
    fullOverview: `One screenshot, one private photo forwarded in a group chat, and lives unravel in seconds. 

Shared confronts non-consensual image sharing, cyberbullying, group-chat pressure, and the lasting emotional trauma caused by digital betrayal. Provides parents and young people a sensitive framework to discuss consent and digital ethics.`,
    coverUrl: '/covers/shared-front.png',
    cueCardCover: '/covers/shared-front.png',
    promptCard: '/covers/shared-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HBN4V47M',
    tag: 'Must Read',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 7,
    asin: 'B0HC6PZ2W5',
    title: 'By Association',
    tagline: 'Your circle can cost you everything.',
    blurb: 'Jayden seeks brotherhood among an older crowd. But when loyalty demands silence around criminal acts, he learns that the friends you stand beside can determine your future.',
    fullOverview: `Jayden seeks brotherhood and respect among an older crowd who play by dangerous rules. But when loyalty demands silent complicity in a crime, Jayden learns the hard way that the friends you choose can make or break your entire life.

Explores joint enterprise, friendship dynamics, and the strength to break away from harmful circles.`,
    coverUrl: '/covers/by-association-front.png',
    cueCardCover: '/covers/by-association-front.png',
    promptCard: '/covers/by-association-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HC6PZ2W5',
    tag: 'Fan Favourite',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 8,
    asin: 'B0HCKWMLXP',
    title: 'Joyride',
    tagline: 'One ride can change everything.',
    blurb: 'Tyrese is a good kid drawn into the adrenaline rush of fast, stolen cars. A reckless police chase forces him to confront irreversible consequences before tragedy strikes.',
    fullOverview: `Tyrese is a promising footballer until older peers invite him into the rush of fast, stolen cars and late-night thrills. A reckless police chase forces him to confront real-world consequences before an irreversible tragedy occurs.

A gripping exploration of adrenaline addiction, criminal exploitation, and making amends before it is too late.`,
    coverUrl: '/covers/joyride-front.png',
    cueCardCover: '/covers/joyride-front.png',
    promptCard: '/covers/joyride-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HCKWMLXP',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 9,
    asin: 'B0H9YPCT28',
    title: 'Bridges Between Us',
    tagline: "Some distances aren't meant to keep us apart.",
    blurb: 'Jack Murphy has always dreamed big on the pitch, but casual banter gradually turns into prejudice. A powerful narrative on racism, allyship, and breaking silence.',
    fullOverview: `Jack Murphy has always dreamed big on the football pitch, but casual jokes and online narratives gradually turn into prejudice. When a racial incident fractures his friendships and family, Jack must decide what kind of man he truly wants to become.

A powerful story promoting understanding, allyship, and dismantling discrimination across communities.`,
    coverUrl: '/covers/bridges-between-us-front.png',
    cueCardCover: '/covers/bridges-between-us-front.png',
    promptCard: '/covers/bridges-between-us-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HBMPV3MC',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 10,
    asin: 'B0HB9VFMC5',
    title: 'The Last Ride',
    tagline: 'Some rides are for adrenaline. Others are for survival.',
    blurb: 'In the city underground, young bike riders dodge rules. But when brotherhood is tested on one fateful night, adrenaline turns to tragedy. An intense look at urban youth culture.',
    fullOverview: `In the city underground, young bike riders dodge rules and limits. But when brotherhood is tested on one fateful night, the adrenaline turns to tragedy. 

An intense look at urban youth culture, grief, and the life-changing power of second chances.`,
    coverUrl: 'https://m.media-amazon.com/images/I/81ZrzXaMTTL._AC_UY500_.jpg',
    cueCardCover: '/covers/lines-we-cross-front.png',
    promptCard: '/covers/the-last-ride-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HB9VFMC5',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 11,
    asin: 'B0HC276GG7',
    title: 'The Weight We Carry',
    tagline: 'Understanding unseen emotional burdens and finding resilience.',
    blurb: 'A moving journey exploring hidden traumas and silent expectations that young people bear in silence — and how empathy and conversation lighten the load.',
    fullOverview: `A moving psychological journey exploring the hidden traumas, silent expectations, and heavy burdens that young people bear in silence.

Shows how empathetic listening and open conversation can lighten emotional isolation and build long-term resilience.`,
    coverUrl: 'https://m.media-amazon.com/images/I/71+Ab3ozAxL._AC_UY500_.jpg',
    cueCardCover: '/covers/every-breath-front.png',
    promptCard: '/covers/every-breath-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HC276GG7',
    tag: 'Top Pick',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 12,
    asin: 'B0GYQ6W419',
    title: 'Carrying',
    tagline: 'What we inherit, and what we choose to release.',
    blurb: 'Examining generational patterns, personal responsibility, and the emotional courage required to leave behind negative cycles in favor of positive futures.',
    fullOverview: `Examining generational patterns, personal responsibility, and the emotional courage required to leave behind negative cycles in favor of positive futures.

Provides families and mentors with structured ways to talk through historical trauma and positive self-direction.`,
    coverUrl: 'https://m.media-amazon.com/images/I/71WJXKCV19L._AC_UY500_.jpg',
    cueCardCover: '/covers/by-association-front.png',
    promptCard: '/covers/by-association-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0GYQ6W419',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 13,
    asin: 'B0HC41S7BZ',
    title: 'One More Balloon',
    tagline: 'A story of grief, celebration, and cherished memories.',
    blurb: 'A tender narrative crafted to help children, teens, and families navigate loss, keeping the light of loved ones alive through storytelling and meaningful dialogue.',
    fullOverview: `A tender narrative crafted to help children, teens, and families navigate loss, keeping the light of loved ones alive through storytelling and meaningful dialogue.

Gently guides readers through the stages of grief, offering comfort and remembrance rituals.`,
    coverUrl: 'https://m.media-amazon.com/images/I/71OtiyossFL._AC_UY500_.jpg',
    cueCardCover: '/covers/behind-the-mirror-front.png',
    promptCard: '/covers/behind-the-mirror-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0HC41S7BZ',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 14,
    asin: 'B0H9YPCT28',
    title: "LaToya's Heart",
    tagline: 'Love, courage, and overcoming deep adversity.',
    blurb: 'An inspirational true-to-life journey of courage, devotion, and family resilience in the face of daunting challenges.',
    fullOverview: `An inspirational true-to-life journey of courage, devotion, and family resilience in the face of daunting challenges and health struggles. 

Inspires hope and highlights the vital importance of community solidarity.`,
    coverUrl: 'https://m.media-amazon.com/images/I/61YS-Uip2QL._AC_UY500_.jpg',
    cueCardCover: '/covers/shared-front.png',
    promptCard: '/covers/shared-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0H9YPCT28',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 15,
    asin: 'B0H6NJGVHX',
    title: 'Signs in Silence',
    tagline: 'Listening to what is left unsaid.',
    blurb: 'A critical toolkit and narrative helping mentors, teachers, and parents recognise the early warning signs of distress, bullying, and emotional detachment in youth.',
    fullOverview: `A critical toolkit and narrative helping mentors, teachers, and parents recognise the early warning signs of distress, bullying, and emotional detachment in youth before crisis points occur.`,
    coverUrl: 'https://m.media-amazon.com/images/I/716e6Kz6vxL._AC_UY500_.jpg',
    cueCardCover: '/covers/lines-we-cross-front.png',
    promptCard: '/covers/lines-we-cross-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0H6NJGVHX',
    tag: 'Must Read',
    cardCount: 'Prompt Card Deck',
  },
  {
    id: 16,
    asin: 'B0B2V267TK',
    title: 'Manifesting Money',
    tagline: 'Mindset shifts and practical daily habits to build abundance.',
    blurb: 'Transforming limiting beliefs into empowered financial discipline, setting goals with clarity, and creating sustainable success from lived experience.',
    fullOverview: `Transforming limiting beliefs into empowered financial discipline, setting goals with clarity, and creating sustainable success from lived experience. 

Bridges practical money habits with confident mental frameworks for young adults.`,
    coverUrl: 'https://m.media-amazon.com/images/I/81sq-OuVWUL._AC_UY500_.jpg',
    cueCardCover: '/covers/behind-the-feed-front.png',
    promptCard: '/covers/behind-the-feed-back.png',
    amazonUrl: 'https://www.amazon.co.uk/dp/B0B2V267TK',
    tag: null,
    cardCount: 'Prompt Card Deck',
  },
];

export default function Books() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = bookSlides.length;
  const current = bookSlides[currentIndex];

  const nextSlide = () => {
    setShowFullOverview(false);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setShowFullOverview(false);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      prevSlide();
    }
  };

  return (
    <section id="books" className="py-24 bg-black text-white border-t border-white/5" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-neon font-mono font-bold text-xs uppercase tracking-widest">
              Published Works • Interactive Discussion Tools
            </span>
          </div>

          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Books that open up <span className="text-neon">conversations.</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 font-light max-w-2xl mx-auto">
            A collection of fiction and prompt cards that make difficult topics easier to discuss.
          </p>

          {/* Overview text from Luke Cato */}
          <div className="bg-[#0e0e0e] border border-white/15 rounded-2xl p-6 md:p-8 text-left shadow-2xl">
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              Drawing on Luke Cato’s lived experience, <strong className="text-neon font-semibold">Luke’s work has reached 68,000 young people across the UK</strong>. These books bring the storytelling behind Real Direction’s interactive films and digital resources onto the page. Books offer time to pause, revisit difficult moments and explore the thinking behind a character’s choices. Built-in reflection points give parents, carers and professionals opportunities to discuss the issues raised and connect them to everyday experiences.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-4">
              Each book is accompanied by a dedicated set of cue cards, designed to turn its themes into interactive conversations and practical activities with young people. Together, they provide a framework for exploring sensitive subjects, encouraging reflection and breaking down barriers to discussion.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="bg-[#0c0c0c] rounded-3xl border border-white/15 shadow-2xl overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center p-6 md:p-12 lg:p-14 gap-10 lg:gap-14">
            {/* Left: Product Mockup Showcase (Book + LANDSCAPE Cue Cards) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-lg flex flex-col items-center justify-center min-h-[380px] md:min-h-[460px] bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-inner overflow-hidden">
                
                {/* Book & Cue Card Arrangement */}
                <div className="relative flex items-center justify-center w-full">
                  {/* Portrait Book Cover on Left */}
                  <div className="relative z-10 w-40 sm:w-48 md:w-52 transform -rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl rounded-lg overflow-hidden border border-white/20">
                    <img
                      src={current.coverUrl}
                      alt={current.title}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${current.asin}/350/500`;
                      }}
                    />
                    {current.tag && (
                      <span className="absolute top-2 right-2 bg-neon text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                        {current.tag}
                      </span>
                    )}
                  </div>

                  {/* LANDSCAPE Cue Card Box on Right (Clicking scrolls to #cards to play demo) */}
                  <a
                    href="#cards"
                    className="relative z-20 w-44 sm:w-56 md:w-64 -ml-12 sm:-ml-14 mt-16 md:mt-20 transform rotate-4 hover:rotate-0 transition-transform duration-500 shadow-2xl rounded-xl overflow-hidden border-2 border-neon/50 bg-[#121212] block group cursor-pointer"
                    title="Explore cue cards and play interactive demo"
                  >
                    {/* Realistic Landscape Tuck Box Mockup with Matching Cover Art */}
                    <div className="aspect-[1.5/1] w-full relative overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={current.cueCardCover}
                        alt={`${current.title} Cue Card Deck Cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = current.coverUrl;
                        }}
                      />
                      {/* Tuck-box edge shine */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/10 pointer-events-none" />
                    </div>
                    
                    <div className="bg-black/95 backdrop-blur px-3 py-1.5 flex items-center justify-between border-t border-neon/30 text-[10px]">
                      <span className="text-neon font-bold font-mono">Cue Card Deck • £7.99</span>
                      <span className="text-gray-300 group-hover:text-neon transition-colors font-medium">Play Cue Card Demo ➔</span>
                    </div>
                  </a>
                </div>

                {/* LANDSCAPE Spread Cards In Front (Clicking scrolls to #cards to play interactive demo) */}
                <a
                  href="#cards"
                  className="relative z-30 -mt-6 sm:-mt-8 w-60 sm:w-72 md:w-80 transform -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl rounded-xl overflow-hidden border border-white/25 bg-black/95 backdrop-blur-md block cursor-pointer group"
                  title="Explore cue cards and play interactive demo"
                >
                  <div className="aspect-[1.6/1] w-full relative p-3 flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span className="text-[10px] font-mono font-bold text-neon uppercase">Sample Discussion Prompt</span>
                      <span className="text-[9px] text-gray-400 font-mono">£7.99 Deck</span>
                    </div>
                    <p className="text-white text-xs sm:text-sm font-medium leading-snug py-2">
                      “Where is the line between looking out for a friend and protecting yourself?”
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-gray-400">
                      <span>{current.title} Deck</span>
                      <span className="text-neon group-hover:underline font-semibold">Play Cue Card Demo ➔</span>
                    </div>
                  </div>
                </a>

              </div>

              {/* Spread Indicator */}
              <p className="text-gray-400 text-xs mt-4 flex items-center gap-2 font-mono">
                <Layers className="w-3.5 h-3.5 text-neon" />
                Book and matching landscape cue card deck
              </p>
            </div>

            {/* Right: Slide Content & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Counter & Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-widest text-neon uppercase font-mono">
                    Book & Cue Card Set
                  </span>
                  <span className="text-xs font-mono font-bold text-black bg-neon px-3 py-1 rounded-full shadow">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
                  {current.title}
                </h3>
                <p className="text-neon font-medium text-base md:text-lg mb-4 italic">
                  "{current.tagline}"
                </p>

                {/* Short Synopsis */}
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5 font-normal">
                  {current.blurb}
                </p>

                {/* Key Features / Bullet points */}
                <div className="bg-[#111111] border border-white/10 rounded-xl p-4 mb-5 space-y-2.5 text-xs md:text-sm text-gray-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon mt-2 shrink-0" />
                    <span><strong className="text-white font-medium">Built-in reflection points:</strong> Pauses designed for parents, teachers, and mentors to unpack decisions.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon mt-2 shrink-0" />
                    <span><strong className="text-white font-medium">Matching landscape cue cards:</strong> Turns story themes into interactive activities and discussions.</span>
                  </div>
                </div>

                {/* Expandable Amazon Book Overview Accordion */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowFullOverview(!showFullOverview)}
                    className="flex items-center justify-between w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-xs md:text-sm font-medium text-white transition-all duration-200"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-neon" />
                      <span>{showFullOverview ? 'Hide Amazon Book Overview' : 'Read Full Amazon Book Overview'}</span>
                    </span>
                    {showFullOverview ? <ChevronUp className="w-4 h-4 text-neon" /> : <ChevronDown className="w-4 h-4 text-neon" />}
                  </button>

                  {showFullOverview && (
                    <div className="mt-3 bg-black/90 border border-white/15 rounded-xl p-4 md:p-5 text-xs md:text-sm text-gray-300 leading-relaxed space-y-3 max-h-72 overflow-y-auto animate-fadeIn">
                      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                        <span className="text-neon font-mono text-xs uppercase font-bold">Amazon Official Synopsis</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-xs">{current.title} by Luke Cato</span>
                      </div>
                      <div className="whitespace-pre-line font-light">
                        {current.fullOverview}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons & Carousel Navigation */}
              <div>
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                  <a
                    href={current.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neon hover:bg-neon-hover text-black font-bold px-7 py-3.5 rounded-full transition-all duration-300 text-sm tracking-wide shadow-xl shadow-neon/20 hover:scale-105 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>View on Amazon UK</span>
                  </a>

                  <a
                    href="#cards"
                    className="border border-white/20 hover:border-neon text-white hover:text-neon font-medium px-6 py-3.5 rounded-full transition-all duration-200 text-sm flex items-center gap-2 hover:bg-white/5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Explore Cue Cards</span>
                  </a>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      aria-label="Previous book"
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon hover:text-black text-white border border-white/10 flex items-center justify-center transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Next book"
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon hover:text-black text-white border border-white/10 flex items-center justify-center transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs py-1">
                    {bookSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setShowFullOverview(false);
                          setCurrentIndex(i);
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`transition-all duration-300 rounded-full ${
                          i === currentIndex
                            ? 'w-6 h-2 bg-neon'
                            : 'w-2 h-2 bg-white/20 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
