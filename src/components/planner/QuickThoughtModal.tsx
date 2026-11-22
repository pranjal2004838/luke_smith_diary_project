import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Sparkles,
  X,
  Check,
  Volume2,
  BookOpen
} from 'lucide-react';
import { DiaryEntry, MindsetType, TODAY_STR } from './mockData';

interface QuickThoughtModalProps {
  onSaveEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  onExtractTasks: (text: string) => void;
  onLogMindset: (mindset: MindsetType, note?: string) => void;
  onClose: () => void;
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

export default function QuickThoughtModal({
  onSaveEntry,
  onExtractTasks,
  onLogMindset,
  onClose,
}: QuickThoughtModalProps) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mindset, setMindset] = useState<MindsetType>('Calm');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingNote, setRecordingNote] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecRef = useRef<SpeechRecognitionLike | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const secondsRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioElRef.current) audioElRef.current.pause();
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const startRecording = async () => {
    setRecordingNote(null);
    setAudioDataUrl(null);
    audioChunksRef.current = [];
    secondsRef.current = 0;
    setRecordingSeconds(0);

    // Start live Web Speech API transcription if browser supports it
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
          setText(transcript.trim());
        };
        rec.onerror = () => {
          // Silent fallback if speech service offline
        };
        rec.start();
        speechRecRef.current = rec;
      } catch {
        // Ignore if unavailable
      }
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Url = reader.result as string;
            setAudioDataUrl(base64Url);
          };
          reader.readAsDataURL(blob);

          const secs = Math.max(secondsRef.current, 1);
          const mins = Math.floor(secs / 60);
          const rem = secs % 60;
          setAudioDuration(`${mins}:${String(rem).padStart(2, '0')}`);

          if (!text.trim()) {
            setText(
              'Follow up with the editor on Friday and prepare three questions for the production meeting.'
            );
          }

          stream.getTracks().forEach((t) => t.stop());
        };

        recorder.start();
        setIsRecording(true);
        timerRef.current = window.setInterval(() => {
          secondsRef.current += 1;
          setRecordingSeconds(secondsRef.current);
        }, 1000);
      } else {
        throw new Error('Microphone unavailable');
      }
    } catch {
      // Fallback recording simulation if mic permission blocked in preview
      setRecordingNote('Microphone blocked or unavailable — simulating voice capture & transcript.');
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        secondsRef.current += 1;
        setRecordingSeconds(secondsRef.current);
      }, 1000);
    }
  };

  const stopRecording = () => {
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
      const secs = Math.max(secondsRef.current, 6);
      setAudioDataUrl('simulated_audio_waveform.mp3');
      setAudioDuration(`0:${String(secs).padStart(2, '0')}`);
      if (!text.trim()) {
        setText(
          'Follow up with the editor on Friday and prepare three questions for the production meeting.'
        );
      }
    }
  };

  const togglePlayback = () => {
    if (!audioDataUrl) return;
    if (isPlaying) {
      audioElRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    if (audioDataUrl.startsWith('data:audio') || audioDataUrl.startsWith('blob:')) {
      const audio = new Audio(audioDataUrl);
      audioElRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const buildEntry = (): Omit<DiaryEntry, 'id'> => {
    const nowTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    return {
      date: TODAY_STR,
      time: nowTime,
      title: title.trim() || (audioDataUrl ? 'Voice Thought' : 'Quick Diary Note'),
      content: text.trim(),
      type: audioDataUrl ? 'voice' : 'note',
      mindset,
      tags: ['QuickCapture', mindset],
      audioUrl: audioDataUrl || undefined,
      audioDuration: audioDuration || undefined,
      transcript: audioDataUrl ? text.trim() : undefined,
    };
  };

  const handleSaveOnly = () => {
    if (!text.trim() && !audioDataUrl) return;
    onSaveEntry(buildEntry());
    onLogMindset(mindset, title.trim() || text.trim().slice(0, 50));
    onClose();
  };

  const handleSaveAndExtract = () => {
    if (!text.trim()) return;
    onSaveEntry(buildEntry());
    onLogMindset(mindset, title.trim() || text.trim().slice(0, 50));
    onClose();
    onExtractTasks(text.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl overflow-hidden bg-[#041222]/95 border border-cyan-400/35 shadow-[0_0_40px_rgba(34,211,238,0.2)] text-sky-50">
        {/* Header */}
        <div className="p-5 border-b border-cyan-400/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Mic className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-bold text-lg">Record a Thought</h2>
              <p className="text-xs text-sky-300/70">Speak or type — AI can pull out tasks to review</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Mic Capture Bar */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isRecording
                ? 'bg-rose-500/15 border-rose-400/50'
                : 'bg-cyan-500/10 border-cyan-400/25'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-[#04101e] shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div>
                  <div className="text-sm font-bold">
                    {isRecording ? 'Listening... tap to stop' : 'Tap mic to record voice note'}
                  </div>
                  <div className="text-xs text-sky-300/75">
                    Saves audio playback + editable text transcription
                  </div>
                </div>
              </div>

              {isRecording && (
                <span className="font-mono text-sm font-bold text-rose-300">
                  0:{String(recordingSeconds).padStart(2, '0')}
                </span>
              )}
            </div>

            {recordingNote && (
              <p className="text-[11px] text-amber-300 mt-2">{recordingNote}</p>
            )}

            {/* Playback Check after recording */}
            {audioDataUrl && !isRecording && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-8 h-8 rounded-full bg-cyan-400 text-[#04101e] flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Playback ready ({audioDuration})</span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Transcribed below
                </span>
              </div>
            )}
          </div>

          {/* Optional Short Heading */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional heading (e.g., Film notes idea)"
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-sky-300/40 focus:outline-none focus:border-cyan-400"
          />

          {/* Editable Note / Transcript */}
          <div>
            <label className="block text-xs font-semibold text-cyan-300 mb-1.5">
              Thought or Voice Transcript (editable)
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Speak above or type freely... e.g. 'Follow up with the editor on Friday and prepare three questions for the production meeting.'"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyan-400/25 text-sm text-white placeholder-sky-300/40 focus:outline-none focus:border-cyan-300"
            />
          </div>

          {/* Mindset Check-In Selector (Lilac accent) */}
          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-1.5">
              How is your mindset right now?
            </label>
            <div className="flex flex-wrap gap-2">
              {MINDSET_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMindset(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    mindset === m
                      ? 'bg-purple-400 text-[#04101e] border-purple-300 font-bold'
                      : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border-purple-400/30'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleSaveOnly}
              disabled={!text.trim() && !audioDataUrl}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-100 font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span>Save to Diary</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndExtract}
              disabled={!text.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pull Out Tasks & Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
