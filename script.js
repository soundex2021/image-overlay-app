// Variables for dragging and resizing
let isDragging = false;
let isResizing = false;
let filterX = 50; // Default position
let filterY = 50;
let filterWidth = 100;
let filterHeight = 100;

// Add event listeners for image upload
document.getElementById("upload").addEventListener("change", function (event) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const file = event.target.files[0];

    if (file) {
        const img = new Image();
        img.onload = () => {
            // Set canvas size to match the uploaded image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the uploaded image
            ctx.drawImage(img, 0, 0);

            // Draw the filter
            drawCanvas(ctx, img);
        };
        img.src = URL.createObjectURL(file);
    }
});

// Function to redraw the canvas
function drawCanvas(ctx, img) {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Redraw uploaded image
    ctx.drawImage(img, 0, 0);

    // Load and draw the filter
    const filter = new Image();
    filter.src = "filter.png";
    filter.onload = () => {
        ctx.drawImage(filter, filterX, filterY, filterWidth, filterHeight);
    };
}

// Mouse events for dragging and resizing the filter
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if mouse is inside the filter
    if (
        mouseX > filterX &&
        mouseX < filterX + filterWidth &&
        mouseY > filterY &&
        mouseY < filterY + filterHeight
    ) {
        isDragging = true;
    } else if (
        mouseX > filterX + filterWidth - 10 &&
        mouseX < filterX + filterWidth + 10 &&
        mouseY > filterY + filterHeight - 10 &&
        mouseY < filterY + filterHeight + 10
    ) {
        isResizing = true;
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging || isResizing) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (isDragging) {
            filterX = mouseX - filterWidth / 2;
            filterY = mouseY - filterHeight / 2;
        } else if (isResizing) {
            filterWidth = mouseX - filterX;
            filterHeight = mouseY - filterY;
        }

        // Redraw canvas
        const img = new Image();
        img.src = canvas.toDataURL(); // Use current canvas content
        img.onload = () => drawCanvas(ctx, img);
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    isResizing = false;
});

// Download button functionality
document.getElementById("download").addEventListener("click", function () {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
