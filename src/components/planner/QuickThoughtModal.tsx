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

const MOOD_OPTIONS: { mood: MindsetType; emoji: string }[] = [
  { mood: 'Calm', emoji: '😊' },
  { mood: 'Good', emoji: '🙂' },
  { mood: 'Okay', emoji: '😐' },
  { mood: 'Low', emoji: '😔' },
  { mood: 'Overwhelmed', emoji: '😣' },
];

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
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            setAudioDataUrl(reader.result as string);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl rounded-3xl overflow-hidden border border-white/15 shadow-2xl text-white"
        style={{ backgroundColor: '#11151d' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#c8ef43]/15 text-[#c8ef43] border border-[#c8ef43]/30">
              <Mic className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-bold text-lg text-white">Record a Thought</h2>
              <p className="text-xs text-gray-400">Speak or type — AI can pull out tasks to review</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
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
                : 'bg-[#141821] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14]'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div>
                  <div className="text-sm font-bold text-white">
                    {isRecording ? 'Listening... tap to stop' : 'Tap mic to record voice note'}
                  </div>
                  <div className="text-xs text-gray-400">
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

            {audioDataUrl && !isRecording && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-8 h-8 rounded-full bg-[#c8ef43] text-[#0b0f14] flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="text-xs text-[#9ee4c3] font-medium flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Playback ready ({audioDuration})</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#9ee4c3] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Transcribed below
                </span>
              </div>
            )}
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional heading (e.g., Film notes idea)"
            className="w-full px-4 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c8ef43]"
          />

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Thought or Voice Transcript (editable)
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Speak above or type freely... e.g. 'Follow up with the editor on Friday and prepare three questions for the production meeting.'"
              className="w-full px-4 py-3 rounded-xl bg-[#0d1017] border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c8ef43]"
            />
          </div>

          {/* Mood Check-In */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Mood check-in
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((item) => (
                <button
                  key={item.mood}
                  type="button"
                  onClick={() => setMindset(item.mood)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    mindset === item.mood
                      ? 'bg-[#c8ef43]/15 text-[#c8ef43] border-[#c8ef43]/50 font-bold'
                      : 'bg-[#1a202c] text-gray-300 border-white/10 hover:text-white'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.mood}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleSaveOnly}
              disabled={!text.trim() && !audioDataUrl}
              className="px-4 py-2.5 rounded-full bg-[#1a202c] hover:bg-[#222a38] text-gray-200 font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#63d8d8]" />
              <span>Save to Diary</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndExtract}
              disabled={!text.trim()}
              className="px-4 py-2.5 rounded-full bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-40"
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
