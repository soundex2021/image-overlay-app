const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

let uploadedImage = null;
let overlayImage = new Image();
overlayImage.src = 'https://via.placeholder.com/400x200.png?text=Overlay'; // Placeholder image
let overlayPos = { x: canvas.width / 2, y: canvas.height / 2 };
let overlayScale = 0.5; // Starts at 50% size
let overlayRotation = 0;

function resizeAndFitImage(img) {
  const canvasAspect = canvas.width / canvas.height;
  const imgAspect = img.width / img.height;

  let width, height;

  if (imgAspect > canvasAspect) {
    width = canvas.width;
    height = canvas.width / imgAspect;
  } else {
    height = canvas.height;
    width = canvas.height * imgAspect;
  }

  const offsetX = (canvas.width - width) / 2;
  const offsetY = (canvas.height - height) / 2;

  ctx.drawImage(img, offsetX, offsetY, width, height);
}

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (uploadedImage) {
    resizeAndFitImage(uploadedImage);
  }
  ctx.save();
  ctx.translate(overlayPos.x, overlayPos.y);
  ctx.rotate((overlayRotation * Math.PI) / 180);
  ctx.drawImage(
    overlayImage,
    -overlayImage.width * overlayScale * 0.5,
    -overlayImage.height * overlayScale * 0.5,
    overlayImage.width * overlayScale,
    overlayImage.height * overlayScale
  );
  ctx.restore();
}

// Download functionality with error handling
document.getElementById('download').addEventListener('click', () => {
  try {
    drawCanvas(); // Ensure canvas is updated before generating download URL

    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = canvas.toDataURL('image/png');

    // Trigger download
    link.click();
  } catch (error) {
    alert('An error occurred while downloading the image: ' + error.message);
    console.error('Download error:', error);
  }
});
