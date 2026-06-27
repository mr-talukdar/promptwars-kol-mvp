'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Keyboard, Volume2 } from 'lucide-react';

interface VoiceRecorderProps {
  onAudioReady: (base64: string, mimeType: string) => void;
  onTextReady: (text: string) => void;
}

export default function VoiceRecorder({ onAudioReady, onTextReady }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // extract just the base64 part, strip data:audio/webm;base64,
          const base64 = base64data.split(',')[1];
          onAudioReady(base64, mediaRecorder.mimeType);
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
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required for voice journaling. You can use text instead.');
      setIsTextMode(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isTextMode) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="journal-text" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Journal your thoughts
          </label>
          <button
            type="button"
            onClick={() => { setIsTextMode(false); onTextReady(''); }}
            className="text-sm text-primary hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <Volume2 className="w-4 h-4" /> Switch to Voice
          </button>
        </div>
        <textarea
          id="journal-text"
          className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="How was your day? What's on your mind? Did you take any mock tests?"
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            onTextReady(e.target.value);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {isRecording ? 'Recording...' : 'Tap to start reflecting'}
        </p>
        <p className="text-2xl font-mono text-foreground font-semibold tabular-nums">
          {formatTime(recordingTime)}
        </p>
      </div>

      {isRecording ? (
        <button
          type="button"
          onClick={stopRecording}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-all scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Stop recording"
        >
          <Square className="h-8 w-8" fill="currentColor" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Start voice recording"
        >
          <Mic className="h-8 w-8" aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={() => setIsTextMode(true)}
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1 mt-4"
      >
        <Keyboard className="w-4 h-4" /> Prefer to type?
      </button>
    </div>
  );
}
