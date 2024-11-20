document.getElementById("upload").addEventListener("change", function (event) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const file = event.target.files[0];

    if (file) {
        const img = new Image();
        img.onload = () => {
            // Set canvas size to match the uploaded image size
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the uploaded image
            ctx.drawImage(img, 0, 0);

            // Load and draw the PNG filter
            const filter = new Image();
            filter.src = "filter.png";
            filter.onload = () => {
                ctx.drawImage(filter, 0, 0, img.width, img.height);
            };
        };
        img.src = URL.createObjectURL(file);
    }
});

document.getElementById("download").addEventListener("click", function () {
    const canvas = document.getElementById("canvas");
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
});
