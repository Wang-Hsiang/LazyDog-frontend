document.getElementById("uploadPhoto").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector(".avatar-img").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("deletePhoto").addEventListener("click", function() {
    document.querySelector(".avatar-img").src = "/hotel/hotel-images/page-image/Dog5.png"; // 預設圖片
});
