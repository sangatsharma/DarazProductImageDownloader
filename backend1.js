const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Middleware to parse JSON body
app.use(bodyParser.json());

const downloadImages = async (url, format) => {
  try {
    console.log("Fetching URL:", url);
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);
    const slickListElements =
      (".next-slick-list .next-slick-track .next-slick-slide .item-gallery__image-wrapper img",
      html);
      console.log(slickListElements);

    // Select image elements and extract URLs
    const imageUrls = [];
    console.log("=========");
    console.log("=========");
    for (let i = 0; i < slickListElements.length; i++) {
        const src = $(slickListElements[i]).attr("src");
        console.log("Image URL:", src);
        // Process the image URL
        if (src) {
            const firstUnderscoreIndex = src.indexOf("_");
            const convertedUrl = firstUnderscoreIndex !== -1 ? src.substring(0, firstUnderscoreIndex) : src;
            imageUrls.push(convertedUrl);
        }
    }

    // Simulate downloading images
    const imageBase64Array = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const base64String = Buffer.from(imageResponse.data, "binary").toString(
        "base64"
      );
      imageBase64Array.push(`data:image/${format};base64,${base64String}`);
    }

    return imageBase64Array;
  } catch (error) {
    console.error(`Error downloading images from ${url}:`, error);
    throw error;
  }
};

app.post("/download-images", async (req, res) => {
  const { url, format } = req.body;
  try {
    const imageBase64Array = await downloadImages(url, format);
    res.json(imageBase64Array);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download images" });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

module.exports = app; // Export the app for testing purposes
