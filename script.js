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

  if (overlayImage) {
    const overlayWidth = canvas.width * overlayScale;
    const overlayHeight = overlayImage.height * (overlayWidth / overlayImage.width);

    ctx.save();
    ctx.translate(overlayPos.x, overlayPos.y);
    ctx.rotate((overlayRotation * Math.PI) / 180);
    ctx.drawImage(
      overlayImage,
      -overlayWidth / 2,
      -overlayHeight / 2,
      overlayWidth,
      overlayHeight
    );
    ctx.restore();
  }

  // Add watermark with drop shadow
  ctx.save();
  ctx.font = '16px Arial'; // Font size and style
  ctx.fillStyle = 'white'; // Text color
  ctx.shadowColor = 'black'; // Shadow color
  ctx.shadowBlur = 4;       // Shadow blur effect
  ctx.shadowOffsetX = 2;    // Shadow horizontal offset
  ctx.shadowOffsetY = 2;    // Shadow vertical offset
  ctx.textAlign = 'right';  // Align text to the right
  ctx.fillText('BAYOMIES.COM', canvas.width - 10, canvas.height - 10); // Draw the text
  ctx.restore();
}

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        drawCanvas();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Overlay controls
document.getElementById('moveLeft').addEventListener('click', () => {
  overlayPos.x -= 10;
  drawCanvas();
});

document.getElementById('moveRight').addEventListener('click', () => {
  overlayPos.x += 10;
  drawCanvas();
});

document.getElementById('moveUp').addEventListener('click', () => {
  overlayPos.y -= 10;
  drawCanvas();
});

document.getElementById('moveDown').addEventListener('click', () => {
  overlayPos.y += 10;
  drawCanvas();
});

document.getElementById('resizeControl').addEventListener('input', (e) => {
  overlayScale = parseFloat(e.target.value);
  drawCanvas();
});

document.getElementById('rotateClockwise').addEventListener('click', () => {
  overlayRotation += 15;
  drawCanvas();
});

document.getElementById('rotateCounterClockwise').addEventListener('click', () => {
  overlayRotation -= 15;
  drawCanvas();
});

document.getElementById('download').addEventListener('click', () => {
  drawCanvas(); // Ensure watermark is added before generating download URL

  const link = document.createElement('a');
  link.download = 'filtered-image.png';
  link.href = canvas.toDataURL('image/png');

  // Simulate click to trigger download
  link.click();
});
