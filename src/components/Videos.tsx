import { useEffect, useRef } from 'react';
import { Play, Youtube } from 'lucide-react';

const videos = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'TEDx Talk: The Power of the Right Question',
    description: 'Luke\'s most-watched talk explores why asking the right question matters more than having all the answers. Over 1.2M views.',
    views: '1.2M views',
    duration: '18:32',
    featured: true,
  },
  {
    id: 'ScMzIvxBSi4',
    title: 'How to Lead More Meaningful Meetings',
    description: 'Practical techniques for facilitators and leaders who want to create genuinely productive, human-centred meetings.',
    views: '340K views',
    duration: '12:47',
    featured: false,
  },
  {
    id: '9bZkp7q19f0',
    title: 'The Art of Active Listening',
    description: 'Why most of us are only half-listening and what to do about it — featuring live demonstrations and exercises.',
    views: '215K views',
    duration: '14:15',
    featured: false,
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Building Self-Awareness: A Practical Guide',
    description: 'Luke walks through his own self-awareness journey and the frameworks that helped him change his life.',
    views: '178K views',
    duration: '22:08',
    featured: false,
  },
  {
    id: 'RgKAFK5djSk',
    title: 'Deep Conversations at Work',
    description: 'How to create a culture where it\'s safe to have real conversations — for managers and team leaders.',
    views: '93K views',
    duration: '16:40',
    featured: false,
  },
  {
    id: 'JGwWNGJdvx8',
    title: 'The Journalling Practice That Changed Everything',
    description: 'A candid account of Luke\'s daily journalling ritual and why it\'s the single most important thing he does.',
    views: '157K views',
    duration: '11:22',
    featured: false,
  },
];

function VideoCard({ video, featured = false }: { video: typeof videos[0]; featured?: boolean }) {
  const embedUrl = `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`;

  return (
    <div className={`card group overflow-hidden bg-[#141414] border border-white/10 rounded-2xl hover:border-white/25 transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
      {/* YouTube embed */}
      <div className={`relative bg-black overflow-hidden ${featured ? 'h-72 md:h-80' : 'h-48'}`}>
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded border border-white/10 pointer-events-none">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className={`p-5 ${featured ? 'p-6' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {featured && (
              <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                <Play className="w-3 h-3 fill-red-400" />
                Featured Talk
              </span>
            )}
            <h3 className={`font-heading font-medium text-white group-hover:text-gold transition-colors duration-200 leading-snug ${featured ? 'text-xl mb-2' : 'text-base mb-1.5'}`}>
              {video.title}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-3 font-light">{video.description}</p>
            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>{video.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Videos() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="videos" className="py-24 bg-[#0a0a0a] text-white border-t border-white/5" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-medium mb-6">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            Featured Videos & Talks
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-white mb-4">
            Watch & Learn
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Keynotes, educational media, and deep conversations on lived experience, youth empowerment, and storytelling.
          </p>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
          {/* Featured video spans 2 cols */}
          <VideoCard video={videos[0]} featured />
          {/* Remaining videos */}
          {videos.slice(1).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* YouTube CTA */}
        <div className="mt-12 text-center reveal">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-sm"
          >
            <Youtube className="w-5 h-5 text-red-600" />
            Explore More Videos
            <Play className="w-3.5 h-3.5 fill-black" />
          </a>
        </div>
      </div>
    </section>
  );
}
