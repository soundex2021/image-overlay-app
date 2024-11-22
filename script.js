const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

let uploadedImage = null;
let overlayImage = new Image();
overlayImage.src = './overlay.png';
overlayImage.onerror = function () {
  alert('Failed to load overlay image. Please check the file path.');
};

let overlayPos = { x: canvas.width / 2, y: canvas.height / 2 };
let overlayScale = 0.5;
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

  if (overlayImage.complete && overlayImage.naturalWidth > 0) {
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
  } else {
    console.error('Overlay image is not loaded correctly.');
  }
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
  drawCanvas();

  const link = document.createElement('a');
  link.download = 'filtered-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});