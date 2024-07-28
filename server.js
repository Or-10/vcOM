const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

app.post('/api/transcribe', async (req, res) => {
  const { url } = req.body;

  try {
    // Step 1: Submit the audio file for transcription
    const response = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      { audio_url: url },
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const transcriptId = response.data.id;

    // Step 2: Poll for transcription completion
    let transcriptData;
    while (true) {
      const transcriptResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: ASSEMBLYAI_API_KEY,
          },
        }
      );

      transcriptData = transcriptResponse.data;

      if (transcriptData.status === 'completed') break;
      if (transcriptData.status === 'failed') throw new Error('Transcription failed');

      // Wait for a few seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    res.json({ transcript: transcriptData.text });
  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
