const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable cross-origin requests
app.use(express.static("public")); // Serve static files from "public" directory

// Define a route to extract the M3U8 link
app.get("/extract", async (req, res) => {
    const { url } = req.query;  // Extract the "url" query parameter from the request
    if (!url) return res.json({ error: "No URL provided" });  // If no URL is provided, send an error response

    try {
        // Fetch the TeraBox page using axios
        const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        
        // Load the HTML content into Cheerio to parse it
        const $ = cheerio.load(response.data);

        // Look for the M3U8 link inside <script> tags in the page's HTML
        const scriptTags = $("script").map((i, el) => $(el).html()).get();
        let m3u8Link = null;

        // Check if any of the script tags contain the M3U8 link
        scriptTags.forEach((script) => {
            if (script.includes("extstreaming.m3u8")) {
                const match = script.match(/"(https?:\/\/[^"]+extstreaming\.m3u8[^"]+)"/);  // Extract M3U8 URL using regex
                if (match) m3u8Link = match[1];
            }
        });

        // If a M3U8 link is found, send it in the response; otherwise, send an error
        if (m3u8Link) {
            res.json({ m3u8: decodeURIComponent(m3u8Link) });  // Send the decoded M3U8 link
        } else {
            res.json({ error: "M3U8 link not found" });  // Send error if M3U8 link not found
        }
    } catch (err) {
        res.json({ error: "Failed to fetch data" });  // Catch any errors and send a failure response
    }
});

// Start the Express server and listen on port 3000
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
