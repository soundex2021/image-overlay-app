// Variables for dragging and resizing
let isDragging = false;
let isResizing = false;
let startX = 0; // Start position for drag
let startY = 0;
let initialFilterX = 0; // Initial position for drag
let initialFilterY = 0;
let initialFilterWidth = 150; // Default width
let filterWidth = initialFilterWidth;
let filterHeight = initialFilterWidth;
let filterX = 100; // Initial position of filter
let filterY = 100;
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
        filterAspectRatio = filter.naturalWidth / filter.naturalHeight;
        ctx.drawImage(filter, filterX, filterY, filterWidth, filterWidth / filterAspectRatio);

        // Draw resize handle (optional: visual indicator for resizing)
        ctx.fillStyle = "red";
        ctx.fillRect(filterX + filterWidth - 10, filterY + (filterWidth / filterAspectRatio) - 10, 10, 10);
    };
}

// Start drag or resize
function startAction(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Save initial positions for smoother movement
    startX = mouseX;
    startY = mouseY;
    initialFilterX = filterX;
    initialFilterY = filterY;

    // Check if the touch/mouse is on the resize handle
    if (
        mouseX > filterX + filterWidth - 10 &&
        mouseX < filterX + filterWidth &&
        mouseY > filterY + (filterWidth / filterAspectRatio) - 10 &&
        mouseY < filterY + (filterWidth / filterAspectRatio)
    ) {
        isResizing = true;
    }
    // Check if the touch/mouse is inside the filter
    else if (
        mouseX > filterX &&
        mouseX < filterX + filterWidth &&
        mouseY > filterY &&
        mouseY < filterY + (filterWidth / filterAspectRatio)
    ) {
        isDragging = true;
    }
}

// Drag or resize
function moveAction(event) {
    if (isDragging || isResizing) {
        const rect = canvas.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        if (isDragging) {
            // Calculate new position for dragging
            filterX = initialFilterX + (mouseX - startX);
            filterY = initialFilterY + (mouseY - startY);
        } else if (isResizing) {
            // Resize while maintaining the aspect ratio
            const newWidth = mouseX - filterX;
            filterWidth = newWidth > 20 ? newWidth : 20; // Minimum size of 20px
            filterHeight = filterWidth / filterAspectRatio;
        }

        // Redraw the canvas
        drawCanvas();
    }
}

// End drag or resize
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
    // Export the canvas content as an image
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
