import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Search, 
  Plus, 
  Sparkles, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  FileText, 
  Volume2, 
  Check, 
  X, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DiaryEntry, MindsetType, TODAY_STR } from './mockData';
import { TEXT_COLOR_THEMES, TextColorOption } from './DesignCustomizer';

interface DiaryQuickCaptureProps {
  entries: DiaryEntry[];
  textColor?: TextColorOption;
  onAddEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  onLogMindset?: (mindset: MindsetType, note?: string) => void;
  onExtractTasksFromNote: (text: string) => void;
  isGlassTheme?: boolean;
}

const MINDSET_OPTIONS: MindsetType[] = ['Calm', 'Focused', 'Energized', 'Reflective', 'Stretched'];

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export default function DiaryQuickCapture({
  entries,
  textColor = 'ice-blue',
  onAddEntry,
  onLogMindset,
  onExtractTasksFromNote,
  isGlassTheme = true,
}: DiaryQuickCaptureProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Real Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecRef = useRef<SpeechRecognitionLike | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const secondsRef = useRef(0);
  
  // Live Audio Playback State
  const [playingEntryId, setPlayingEntryId] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [entryType, setEntryType] = useState<'note' | 'voice' | 'idea'>('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mindset, setMindset] = useState<MindsetType>('Calm');
  const [tagInput, setTagInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [recordedVoiceData, setRecordedVoiceData] = useState<{
    audioUrl: string;
    duration: string;
    transcript: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const colorTheme = TEXT_COLOR_THEMES[textColor] || TEXT_COLOR_THEMES['ice-blue'];

  const cardBg = isGlassTheme
    ? 'bg-[#06182c]/72 backdrop-blur-xl border border-cyan-400/30 shadow-[0_0_24px_rgba(34,211,238,0.12)] rounded-2xl'
    : 'bg-[#0a1628] border border-cyan-400/20 shadow-lg rounded-2xl';

  const inputBg = 'bg-black/40 border-cyan-400/25 text-white placeholder-sky-300/40';

  const startRealRecording = async () => {
    setMediaError(null);
    audioChunksRef.current = [];
    secondsRef.current = 0;
    setRecordingSeconds(0);

    // Live Speech-to-Text transcription if browser supports it
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-GB';
        rec.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          setContent(transcript.trim());
        };
        rec.onerror = () => {};
        rec.start();
        speechRecRef.current = rec;
      } catch {
        // ignore
      }
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const secs = Math.max(secondsRef.current, 1);
          const durationStr = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
          const transcriptText =
            content.trim() ||
            'Follow up with the editor on Friday and prepare three questions for the production meeting.';

          const reader = new FileReader();
          reader.onloadend = () => {
            setRecordedVoiceData({
              audioUrl: reader.result as string,
              duration: durationStr,
              transcript: transcriptText,
            });
          };
          reader.readAsDataURL(audioBlob);

          if (!content.trim()) setContent(transcriptText);
          if (!title.trim()) setTitle('Voice Memo — Audio Capture & Transcript');

          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        timerRef.current = window.setInterval(() => {
          secondsRef.current += 1;
          setRecordingSeconds(secondsRef.current);
        }, 1000);
      } else {
        throw new Error('Microphone unavailable');
      }
    } catch {
      setMediaError('Microphone unavailable in this browser — using simulated voice capture.');
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        secondsRef.current += 1;
        setRecordingSeconds(secondsRef.current);
      }, 1000);
    }
  };

  const stopRealRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      const secs = Math.max(secondsRef.current, 8);
      const durationStr = `0:${String(secs).padStart(2, '0')}`;
      const sampleTranscript =
        content.trim() ||
        'Follow up with the editor on Friday and prepare three questions for the production meeting.';
      setRecordedVoiceData({
        audioUrl: 'simulated_audio_waveform.mp3',
        duration: durationStr,
        transcript: sampleTranscript,
      });
      if (!content.trim()) setContent(sampleTranscript);
      if (!title.trim()) setTitle('Voice Note — Editor & Production Sync');
    }
  };

  const handleTogglePlayAudio = (entryId: string, audioUrl?: string) => {
    if (playingEntryId === entryId) {
      currentAudioRef.current?.pause();
      setPlayingEntryId(null);
      return;
    }

    currentAudioRef.current?.pause();
    if (audioUrl && (audioUrl.startsWith('blob:') || audioUrl.startsWith('data:audio'))) {
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.onended = () => setPlayingEntryId(null);
      audio.play().catch(() => setPlayingEntryId(null));
    } else {
      setTimeout(() => {
        setPlayingEntryId(null);
      }, 4000);
    }
    setPlayingEntryId(entryId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const attachments = [];
    if (linkInput) {
      attachments.push({ type: 'link' as const, url: linkInput, label: linkInput });
    }
    if (imageUrlInput) {
      attachments.push({ type: 'image' as const, url: imageUrlInput, label: 'Attached Image' });
    }

    onAddEntry({
      date: TODAY_STR,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase(),
      title: title || 'Quick Note',
      content,
      type: recordedVoiceData ? 'voice' : entryType,
      mindset,
      tags: tags.length ? tags : ['QuickCapture'],
      audioUrl: recordedVoiceData ? recordedVoiceData.audioUrl : undefined,
      audioDuration: recordedVoiceData?.duration,
      transcript: recordedVoiceData?.transcript,
      attachments: attachments.length ? attachments : undefined,
    });

    if (onLogMindset) {
      onLogMindset(mindset, title || content.slice(0, 50));
    }

    setTitle('');
    setContent('');
    setTagInput('');
    setLinkInput('');
    setImageUrlInput('');
    setRecordedVoiceData(null);
    setIsFormOpen(false);
  };

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags)));
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.transcript && e.transcript.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || e.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-5" style={{ color: colorTheme.primaryHex }}>
      {/* Header & Quick Action Bar */}
      <div className={`p-5 sm:p-6 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl font-bold">Diary & Voice Notes</h1>
            <p className="text-xs mt-1" style={{ color: colorTheme.subHex }}>
              Save thoughts, record audio with transcription, and log your daily mindset.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(true);
                setEntryType('voice');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#07223d]/80 hover:bg-[#0b3157] border border-cyan-400/50 text-cyan-200 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_16px_rgba(34,211,238,0.18)]"
            >
              <Mic className="w-4 h-4 text-cyan-300" />
              <span>Voice Note</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFormOpen(true);
                setEntryType('note');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Write Note</span>
            </button>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-300/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search written notes or voice transcripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-cyan-300 ${inputBg}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === null
                  ? 'bg-cyan-400 text-[#04101e] font-bold'
                  : 'bg-white/10 text-sky-200 hover:bg-white/15'
              }`}
            >
              All ({entries.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-cyan-400 text-[#04101e] font-bold'
                    : 'bg-white/10 text-sky-200 hover:bg-white/15'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Creation Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className={`p-5 sm:p-6 border border-cyan-400/50 ${cardBg} animate-fade-in`}>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                {entryType === 'voice' ? <Mic className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </span>
              <h3 className="font-sans font-bold text-base">
                {entryType === 'voice' ? 'Record Voice Note & Transcript' : 'New Diary Entry'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-sky-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Voice Recording Box */}
            <div className={`p-4 rounded-xl border ${isRecording ? 'border-rose-400 bg-rose-500/15' : 'border-cyan-400/25 bg-black/25'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={isRecording ? stopRealRecording : startRealRecording}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-cyan-400 hover:bg-cyan-300 text-[#04101e]'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="text-sm font-semibold">
                      {isRecording ? 'Listening... tap to stop' : 'Tap to Record Voice Note'}
                    </div>
                    <div className="text-xs text-sky-300/75">
                      Captures audio playback + editable text transcription
                    </div>
                  </div>
                </div>

                {isRecording && (
                  <span className="text-sm font-mono text-rose-300 font-bold">
                    0:{String(recordingSeconds).padStart(2, '0')}
                  </span>
                )}
              </div>

              {mediaError && (
                <div className="mt-2 text-xs text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{mediaError}</span>
                </div>
              )}

              {recordedVoiceData && !isRecording && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Check className="w-4 h-4" /> Audio & Transcript Ready ({recordedVoiceData.duration})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTogglePlayAudio('draft', recordedVoiceData.audioUrl)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-400/20 text-cyan-200 font-semibold flex items-center gap-1"
                  >
                    {playingEntryId === 'draft' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>Test Playback</span>
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Title / Heading..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-cyan-300 ${inputBg}`}
            />

            <textarea
              rows={4}
              placeholder="Write your thoughts or edit voice transcript..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:border-cyan-300 ${inputBg}`}
            />

            {/* Mindset Check-In (Lilac) */}
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                Mindset Check-in
              </label>
              <div className="flex flex-wrap gap-2">
                {MINDSET_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMindset(m)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      mindset === m
                        ? 'bg-purple-400 text-[#04101e] border-purple-300 font-bold'
                        : 'bg-purple-500/10 text-purple-200 border-purple-400/30'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="Tags (e.g. Film, Ideas)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
              />
              <input
                type="url"
                placeholder="Attach link URL"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
              />
              <input
                type="text"
                placeholder="Attach image URL"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  if (content) onExtractTasksFromNote(content);
                }}
                disabled={!content}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cyan-200 flex items-center gap-1.5 disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Pull Out Tasks (AI)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs uppercase tracking-wider"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className={`p-10 text-center ${cardBg}`}>
            <p className="text-sm text-sky-300/70">No diary entries match your search.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className={`p-5 ${cardBg} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-3">
                  <span
                    className={`p-2 rounded-xl mt-0.5 ${
                      entry.type === 'voice'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        : 'bg-white/10 text-sky-200 border border-white/15'
                    }`}
                  >
                    {entry.type === 'voice' ? <Mic className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </span>
                  <div>
                    <h3 className="font-sans font-bold text-base">{entry.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5" style={{ color: colorTheme.subHex }}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {entry.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {entry.time}
                      </span>
                      {entry.mindset && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-400/20 text-purple-200 font-semibold text-[11px]">
                            Mindset: {entry.mindset}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onExtractTasksFromNote(entry.transcript || entry.content)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/35 transition-all self-start shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Pull Out Tasks</span>
                </button>
              </div>

              {entry.type === 'voice' && entry.audioDuration && (
                <div className="my-3.5 p-3 rounded-xl bg-black/35 border border-cyan-400/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePlayAudio(entry.id, entry.audioUrl)}
                      className="w-9 h-9 rounded-full bg-cyan-400 text-[#04101e] flex items-center justify-center font-bold hover:scale-105 transition-transform shrink-0"
                    >
                      {playingEntryId === entry.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Voice Playback</span>
                        <span className="text-[11px] font-mono opacity-75">({entry.audioDuration})</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[40, 70, 90, 50, 80, 100, 60, 30, 85, 95, 45, 60, 75, 40, 80, 65].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full transition-all duration-200 ${
                              playingEntryId === entry.id ? 'bg-cyan-300 animate-pulse' : 'bg-white/30'
                            }`}
                            style={{ height: `${Math.max(5, h / 4)}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-sky-200 font-mono hidden sm:inline">
                    Audio + Text
                  </span>
                </div>
              )}

              <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">{entry.content}</p>

              {entry.attachments && entry.attachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                  {entry.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
                    >
                      {att.type === 'link' ? (
                        <LinkIcon className="w-3.5 h-3.5 text-cyan-300" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>{att.label}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-sky-200 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
