// Variables for dragging and resizing
let isDragging = false;
let isResizing = false;
let filterX = 100; // Initial position of filter
let filterY = 100;
let filterWidth = 150; // Initial width of the filter
let filterHeight = 150; // Initial height of the filter
let uploadedImage = null;
let filterAspectRatio = 1; // Aspect ratio of the filter

// Canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Prevent touch events from scrolling the page
canvas.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });

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
        // Maintain aspect ratio for the filter
        filterAspectRatio = filter.naturalWidth / filter.naturalHeight;
        ctx.drawImage(filter, filterX, filterY, filterWidth, filterWidth / filterAspectRatio);

        // Draw resize handle (optional: visual indicator for resizing)
        ctx.fillStyle = "red";
        ctx.fillRect(filterX + filterWidth - 10, filterY + (filterWidth / filterAspectRatio) - 10, 10, 10);
    };
}

// Event handler for starting drag or resize
function startAction(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Check if touch/mouse is on the resize handle
    if (
        mouseX > filterX + filterWidth - 10 &&
        mouseX < filterX + filterWidth &&
        mouseY > filterY + (filterWidth / filterAspectRatio) - 10 &&
        mouseY < filterY + (filterWidth / filterAspectRatio)
    ) {
        isResizing = true;
    }
    // Check if touch/mouse is inside the filter for dragging
    else if (
        mouseX > filterX &&
        mouseX < filterX + filterWidth &&
        mouseY > filterY &&
        mouseY < filterY + (filterWidth / filterAspectRatio)
    ) {
        isDragging = true;
    }
}

// Event handler for dragging or resizing
function moveAction(event) {
    if (isDragging || isResizing) {
        const rect = canvas.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        if (isDragging) {
            // Move the filter based on touch/mouse position
            filterX = mouseX - filterWidth / 2;
            filterY = mouseY - (filterWidth / filterAspectRatio) / 2;
        } else if (isResizing) {
            // Resize the filter while maintaining the aspect ratio
            const newWidth = mouseX - filterX;
            filterWidth = newWidth > 20 ? newWidth : 20; // Minimum width is 20
            filterHeight = filterWidth / filterAspectRatio;
        }

        // Redraw the canvas
        drawCanvas();
    }
}

// Event handler for ending drag or resize
function endAction() {
    isDragging = false;
    isResizing = false;
}

// Add event listeners for mouse and touch
canvas.addEventListener("mousedown", startAction);
canvas.addEventListener("mousemove", moveAction);
canvas.addEventListener("mouseup", endAction);

canvas.addEventListener("touchstart", startAction);
canvas.addEventListener("touchmove", moveAction);
canvas.addEventListener("touchend", endAction);

// Download button functionality
document.getElementById("download").addEventListener("click", function () {
    // Ensure the final canvas is exported correctly
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
