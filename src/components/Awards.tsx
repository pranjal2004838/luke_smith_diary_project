export default function Awards() {
  const awards = [
    { name: 'BBC 1Xtra Future Figures', image: '/awards/bbc-1xtra-future-figures.png' },
    { name: 'National Diversity Awards', image: '/awards/national-diversity-awards.png' },
    { name: 'TechRound Winner', image: '/awards/techround-winner.png' },
    { name: 'University Alumni Award', image: '/awards/alumni-awards.png' },
    { name: 'Cannes Recognition', image: '/awards/cannes-award.png' },
  ];

  return (
    <section id="awards" className="bg-[#080808] border-y border-white/10 py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest text-neon font-mono font-semibold mb-10">
          Recognised & Honoured For Impact Across The UK
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {awards.map((award) => (
            <div
              key={award.name}
              className="flex flex-col items-center justify-center group transition-all duration-300"
            >
              <div className="h-16 md:h-20 flex items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-neon/40 group-hover:bg-white/[0.06] transition-all">
                <img
                  src={award.image}
                  alt={award.name}
                  className="h-12 md:h-16 w-auto object-contain max-w-[150px] filter brightness-90 contrast-125 group-hover:brightness-110 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[11px] text-gray-400 group-hover:text-white mt-2 font-medium tracking-wide">
                {award.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
