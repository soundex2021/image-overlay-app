// Variables for dragging and resizing
let isDragging = false;
let isResizing = false;
let filterX = 100; // Initial position of filter
let filterY = 100;
let filterWidth = 150;
let filterHeight = 150;
let uploadedImage = null;

// Canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Upload and draw the base image
document.getElementById("upload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            // Set canvas size to match the uploaded image
            canvas.width = img.width;
            canvas.height = img.height;

            // Save the uploaded image and draw it
            uploadedImage = img;
            drawCanvas();
        };
        img.src = URL.createObjectURL(file);
    }
});

// Function to redraw the canvas
function drawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the uploaded image
    if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw the PNG overlay
    const filter = new Image();
    filter.src = "filter.png"; // Ensure this matches the actual filename of your PNG filter
    filter.onload = () => {
        ctx.drawImage(filter, filterX, filterY, filterWidth, filterHeight);

        // Draw resize handle (optional: visual indicator for resizing)
        ctx.fillStyle = "red";
        ctx.fillRect(filterX + filterWidth - 10, filterY + filterHeight - 10, 10, 10);
    };
}

// Mouse events for drag-and-resize functionality
canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if mouse is on the resize handle
    if (
        mouseX > filterX + filterWidth - 10 &&
        mouseX < filterX + filterWidth &&
        mouseY > filterY + filterHeight - 10 &&
        mouseY < filterY + filterHeight
    ) {
        isResizing = true;
    }
    // Check if mouse is inside the filter for dragging
    else if (
        mouseX > filterX &&
        mouseX < filterX + filterWidth &&
        mouseY > filterY &&
        mouseY < filterY + filterHeight
    ) {
        isDragging = true;
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging || isResizing) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (isDragging) {
            // Move the filter based on mouse position
            filterX = mouseX - filterWidth / 2;
            filterY = mouseY - filterHeight / 2;
        } else if (isResizing) {
            // Resize the filter based on mouse position
            filterWidth = mouseX - filterX;
            filterHeight = mouseY - filterY;
        }

        // Redraw the canvas
        drawCanvas();
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
