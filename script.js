document
  .getElementById("urlForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const url = document.getElementById("urlInput").value;
    const imageFormat = document.getElementById("imageFormat").value;
    console.log(url, imageFormat);

    // Show loader
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("loadertext").classList.remove("hidden");
    document.getElementById("loadertext").textContent = "Getting images";

    // Make an API call to your Express server to download images
    try {
      const response = await fetch(
        "https://darazimagedownloader.onrender.com/api/download-images",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "test-API-KEY",
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        document.getElementById("loadertext").textContent = "Invalid url!";
        throw new Error("Network response was not ok, or invalid url");
      }

      const imageUrls = await response.json();
      document.getElementById("loadertext").textContent = "Showing results:";
      displayImages(imageUrls, imageFormat);

      // Hide loader
      document.getElementById("loader").classList.add("hidden");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);

      // Hide loader
      document.getElementById("loader").classList.add("hidden");
    }
  });

function displayImages(imageUrls, format) {
  const imageContainer = document.getElementById("imageContainer");
  const buttonContainer = document.getElementById("buttonContainer");
  imageContainer.innerHTML = "";
  buttonContainer.innerHTML = "";

  // Clear existing images

  imageUrls.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    imageContainer.appendChild(img);
  });

  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download All";
  downloadButton.addEventListener("click", async () => {
    const zip = new JSZip();
    const imgPromises = imageUrls.map(async (url, index) => {
      const response = await fetch(url);
      const imgBlob = await response.blob();
      zip.file(`image_${index}.${format}`, imgBlob);
    });
    await Promise.all(imgPromises);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "images.zip");
  });
  buttonContainer.appendChild(downloadButton);
}
