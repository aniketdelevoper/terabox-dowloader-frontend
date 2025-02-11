const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate and parse the URL
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);

    // Check required parameters
    if (!params.has('uk') || !params.has('shareid') || !params.has('fid')) {
      return res.status(400).json({ error: 'Invalid URL parameters' });
    }

    // Generate the download link
    const downloadUrl = generateDownloadLink(params);
    const response = await axios.get(downloadUrl, { responseType: 'stream' });

    // Pipe the response to the client
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to download the file' });
  }
});

function generateDownloadLink(params) {
  // Generate the download link based on the parameters
  // This is a simplified example, you may need to handle encryption, tokens, etc.
  return `https://www.1024terabox.com/share/extstreaming.m3u8?${params.toString()}`;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});