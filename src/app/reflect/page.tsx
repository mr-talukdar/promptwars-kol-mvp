'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MoodSelector from '@/components/ui/MoodSelector';
import { MoodType } from '@/lib/types';
import { analyzeDay } from './actions';
import { Loader2, Mic, Square, Trash2, Send } from 'lucide-react';

export default function ReflectPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [textInput, setTextInput] = useState('');
  const [audioData, setAudioData] = useState<{ base64: string; mimeType: string; duration: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up timer and media stream on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const duration = recordingTime;
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const base64 = base64data.split(',')[1];
          setAudioData({ base64, mimeType: mediaRecorder.mimeType, duration });
        };
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access is required to record voice reflections. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const clearAudio = () => {
    setAudioData(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnalyze = () => {
    if (!selectedMood) {
      setError('Please select how you are feeling today.');
      return;
    }
    
    if (!textInput && !audioData) {
      setError('Please type a message or record a voice reflection first.');
      return;
    }

    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('mood', selectedMood);
      if (textInput) formData.append('text', textInput);
      if (audioData) {
        formData.append('audioBase64', audioData.base64);
        formData.append('mimeType', audioData.mimeType);
      }

      const result = await analyzeDay(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push('/dashboard');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedMood && (textInput || audioData) && !isPending) {
        handleAnalyze();
      } else if (!selectedMood) {
        setError('Please select a mood first before sending.');
      }
    }
  };

  return (
    <main className="container mx-auto max-w-2xl p-6 py-12">
      <div className="space-y-10">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Daily Reflection</h1>
          <p className="text-muted-foreground">Log your mood and thoughts. We&apos;ll find the hidden patterns.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 animate-in fade-in" role="alert">
            {error}
          </div>
        )}

        {/* Step 1: Mood */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">1. How are you feeling?</h2>
          <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
        </section>

        {/* Step 2: ChatGPT style typing & voice reflection bar */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">2. What&apos;s on your mind?</h2>
          
          <div className="space-y-3">
            {/* Audio attachment display pill */}
            {audioData && (
              <div className="flex items-center justify-between bg-secondary/40 border border-border/80 px-4 py-2.5 rounded-xl animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                  🎙️ Voice note attached ({formatTime(audioData.duration)})
                </div>
                <button
                  type="button"
                  onClick={clearAudio}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  title="Remove voice note"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            )}

            {/* Combined Chat Input Bar */}
            <div className={`relative flex flex-col rounded-2xl border transition-all duration-300 shadow-sm ${
              isRecording 
                ? 'border-destructive/60 bg-destructive/5 ring-1 ring-destructive/30' 
                : 'border-border bg-card focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10'
            }`}>
              
              {/* Text Area Input */}
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRecording || isPending}
                placeholder={isRecording ? "Recording your voice... Please speak now." : "How was your day? What's on your mind? Did you take any tests?..."}
                className="w-full min-h-[100px] resize-none bg-transparent px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
              />

              {/* Toolbar Footer inside the bar */}
              <div className="flex items-center justify-between border-t border-border/40 px-3 py-2.5 bg-muted/5 rounded-b-2xl">
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {isRecording ? (
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-destructive animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-destructive" />
                      RECORDING ({formatTime(recordingTime)})
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground font-medium pl-1">
                      {textInput.length > 0 ? `${textInput.length} chars` : 'Voice & text combined'}
                    </div>
                  )}
                </div>

                {/* Interactive Action buttons */}
                <div className="flex items-center gap-2">
                  {/* Microphone Icon Button */}
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow transition-all scale-105"
                      title="Stop recording"
                      aria-label="Stop recording"
                    >
                      <Square className="h-4.5 w-4.5" fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={isPending}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      title="Record voice reflection"
                      aria-label="Record voice reflection"
                    >
                      <Mic className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}

                  {/* Send/Submit Button */}
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isPending || isRecording || (!textInput && !audioData) || !selectedMood}
                    className="flex h-9 px-4 items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                    title="Send reflection for AI analysis"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Reflect</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
