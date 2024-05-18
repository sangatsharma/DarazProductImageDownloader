//module.exports = async (req, res) => {
//   if (req.method === "POST") {
//     const { url, format } = req.body;
//     try {
//       const imageBase64Array = await downloadImages(url, format);
//       res.json(imageBase64Array);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to download images" });
//     }
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// };