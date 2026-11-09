import { useState, useEffect, useRef } from 'react';
import {
  Mic, Calendar, MapPin, Users, MessageSquare, Send, CheckCircle, ChevronDown
} from 'lucide-react';

const topicOptions = [
  'The Power of Questions',
  'Leadership & Self-Awareness',
  'Building High-Performing Teams',
  'Mindful Communication',
  'Personal Growth & Resilience',
  'Creating a Culture of Curiosity',
  'Other / Custom Topic',
];

const audienceSizeOptions = [
  'Under 50',
  '50 – 200',
  '200 – 500',
  '500 – 1,000',
  '1,000+',
];

interface FormData {
  name: string;
  email: string;
  organisation: string;
  eventDate: string;
  location: string;
  audienceSize: string;
  topic: string;
  message: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organisation: '',
    eventDate: '',
    location: '',
    audienceSize: '',
    topic: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="booking" className="py-24 bg-[#050505] text-white relative overflow-hidden border-t border-white/5" ref={sectionRef}>
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-medium mb-8">
              <Mic className="w-3.5 h-3.5 text-gold" />
              Speaking Enquiries
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-white leading-tight mb-6">
              Book Luke for{' '}
              <span className="italic font-serif">Your Event</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 font-light">
              Whether you're planning a conference, leadership day, team workshop, or
              educational programme — Luke delivers talks and workshops that spark lasting, transformative conversations.
            </p>

            {/* What's included */}
            <div className="space-y-5">
              {[
                {
                  icon: <Mic className="w-5 h-5" />,
                  title: 'Keynote & Breakout Talks',
                  desc: 'Tailored to your audience, themes, and educational objectives',
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: 'Interactive Workshops',
                  desc: 'Half-day or full-day deep-dive sessions with reflection tools',
                },
                {
                  icon: <MessageSquare className="w-5 h-5" />,
                  title: 'Panel Facilitation',
                  desc: 'Expert moderation uncovering honest, courageous conversations',
                },
                {
                  icon: <Calendar className="w-5 h-5" />,
                  title: 'Virtual & In-Person',
                  desc: 'Available UK-wide and internationally — online or on location',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{item.title}</h4>
                    <p className="text-gray-400 text-xs mt-0.5 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote card */}
            <div className="mt-12 bg-[#121212] border border-white/10 rounded-2xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed italic mb-4 font-light">
                “Luke’s lived experience and authentic communication broke down barriers instantly with our audience. The feedback was overwhelmingly positive.”
              </p>
              <div>
                <p className="text-white text-xs uppercase tracking-widest font-medium">Head of Safeguarding & Youth Services</p>
                <p className="text-gray-500 text-xs">UK Education Conference</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal" style={{ transitionDelay: '150ms' }}>
            {submitted ? (
              <div className="bg-[#141414] border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-5" />
                <h3 className="font-heading text-2xl font-light text-white mb-3">
                  Enquiry Received!
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                  Thank you, <strong className="text-white">{formData.name}</strong>! Luke's team will review your
                  enquiry and get back to you within 48 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', organisation: '', eventDate: '', location: '', audienceSize: '', topic: '', message: '' }); }}
                  className="w-full py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-xl transition-colors text-sm"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-5"
              >
                <h3 className="font-heading text-xl font-medium text-white mb-1">
                  Send an Enquiry
                </h3>
                <p className="text-gray-400 text-xs pb-4 border-b border-white/10 font-light">
                  Fill in the details below and Luke's team will be in touch within 48 hours.
                </p>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Organisation */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    Organisation / School / Authority
                  </label>
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder="Acme Academy or Council"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>

                {/* Event date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                      <Calendar className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                      Event Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      required
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                      <MapPin className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                      Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="London / Birmingham / Online"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Audience size */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    <Users className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                    Audience Size <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="audienceSize"
                      required
                      value={formData.audienceSize}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-sm appearance-none pr-10"
                    >
                      <option value="" className="bg-[#141414] text-gray-400">Select audience size</option>
                      {audienceSizeOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#141414] text-white">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    <Mic className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                    Preferred Topic <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="topic"
                      required
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-sm appearance-none pr-10"
                    >
                      <option value="" className="bg-[#141414] text-gray-400">Select a topic</option>
                      {topicOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#141414] text-white">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    <MessageSquare className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                    Additional Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us more about your event, objectives, or any specific requirements..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending Enquiry...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Speaking Enquiry
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  We typically respond within 48 hours. Your details remain private.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
