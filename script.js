const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const memeTextInput = document.getElementById('memeText');

let uploadedImage = null;
let overlayImage = new Image();
overlayImage.src = './overlay.png';
overlayImage.onerror = () => alert('Failed to load overlay image.');

let overlay = { x: canvas.width / 2, y: canvas.height / 2, scale: 0.5, rotation: 0 };
let text = { content: '', color: 'white', y: canvas.height - 40 };

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (uploadedImage) {
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  }

  // Draw Overlay
  if (overlayImage.complete && overlayImage.naturalWidth > 0) {
    const overlayWidth = canvas.width * overlay.scale;
    const overlayHeight = (overlayImage.height / overlayImage.width) * overlayWidth;
    ctx.save();
    ctx.translate(overlay.x, overlay.y);
    ctx.rotate((overlay.rotation * Math.PI) / 180);
    ctx.drawImage(
      overlayImage,
      -overlayWidth / 2,
      -overlayHeight / 2,
      overlayWidth,
      overlayHeight
    );
    ctx.restore();
  }

  // Draw Text
  if (text.content) {
    ctx.save();
    ctx.font = '24px Arial';
    ctx.fillStyle = text.color;
    ctx.shadowColor = text.color === 'white' ? 'black' : 'white';
    ctx.shadowBlur = 4;
    ctx.textAlign = 'center';
    ctx.fillText(text.content, canvas.width / 2, text.y);
    ctx.restore();
  }
}

function updateText() {
  text.content = memeTextInput.value;
  drawCanvas();
}

// Overlay Controls
document.getElementById('overlayMoveLeft').addEventListener('click', () => {
  overlay.x -= 10;
  drawCanvas();
});

document.getElementById('overlayMoveRight').addEventListener('click', () => {
  overlay.x += 10;
  drawCanvas();
});

document.getElementById('overlayMoveUp').addEventListener('click', () => {
  overlay.y -= 10;
  drawCanvas();
});

document.getElementById('overlayMoveDown').addEventListener('click', () => {
  overlay.y += 10;
  drawCanvas();
});

document.getElementById('overlayRotateClockwise').addEventListener('click', () => {
  overlay.rotation += 15;
  drawCanvas();
});

document.getElementById('overlayRotateCounterClockwise').addEventListener('click', () => {
  overlay.rotation -= 15;
  drawCanvas();
});

document.getElementById('overlayResize').addEventListener('input', (e) => {
  overlay.scale = parseFloat(e.target.value);
  drawCanvas();
});

// Text Controls
document.getElementById('textMoveUp').addEventListener('click', () => {
  text.y -= 10;
  drawCanvas();
});

document.getElementById('textMoveDown').addEventListener('click', () => {
  text.y += 10;
  drawCanvas();
});

document.getElementById('textWhite').addEventListener('click', () => {
  text.color = 'white';
  drawCanvas();
});

document.getElementById('textBlack').addEventListener('click', () => {
  text.color = 'black';
  drawCanvas();
});

// Text Input
memeTextInput.addEventListener('input', updateText);

// Image Upload
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedImage = new Image();
      uploadedImage.onload = drawCanvas;
      uploadedImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Download Button
document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});