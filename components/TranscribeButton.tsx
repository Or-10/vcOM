// components/TranscribeButton.tsx
"use client";

import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button'; // Adjust the path according to your file structure
import Image from 'next/image';

interface TranscribeButtonProps {
  recordingUrl: string;
}

const TranscribeButton: React.FC<TranscribeButtonProps> = ({ recordingUrl }) => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTranscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: recordingUrl }), // Ensure this is correct
      });

      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error('Error fetching transcription:', error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <Button onClick={fetchTranscription} className="bg-blue-1 text-white">
        Transcribe
      </Button>

      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-white px-6 py-9 text-black">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold leading-[42px]">Transcription</h1>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>{transcription}</p>
            )}
            <Button
              className="bg-blue-1 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TranscribeButton;
