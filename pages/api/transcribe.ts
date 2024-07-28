// pages/api/transcribe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const assemblyAIAPIKey = 'ef88f8698802447bb2f5a6e307405042';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    try {
      // Request transcription directly
      const transcriptResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: videoUrl, // Directly use the video URL
        },
        {
          headers: {
            authorization: assemblyAIAPIKey,
          },
        }
      );

      const transcriptId = transcriptResponse.data.id;

      // Poll for the transcription result
      const getTranscript = async () => {
        const resultResponse = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              authorization: assemblyAIAPIKey,
            },
          }
        );

        if (resultResponse.data.status === 'completed') {
          return resultResponse.data.text;
        } else if (resultResponse.data.status === 'failed') {
          throw new Error('Transcription failed');
        }

        // Wait and retry
        return new Promise<string>((resolve) => setTimeout(() => resolve(getTranscript()), 5000));
      };

      const transcriptionText = await getTranscript();

      res.status(200).json({ transcription: transcriptionText });
    } catch (error) {
      console.error('Error fetching transcription:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', error.response?.data);
        res.status(error.response?.status || 500).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
