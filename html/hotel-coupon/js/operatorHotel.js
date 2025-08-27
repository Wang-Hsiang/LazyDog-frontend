document.addEventListener("DOMContentLoaded", function () {
  initImageUpload();
  initRoomManagement();
  initFormSubmission();
});
function initImageUpload() {
  const imageUpload = document.getElementById("imageUpload");
  const previewContainer = document.getElementById("imagePreviewContainer");

  imageUpload.addEventListener("change", function (event) {
    const files = event.target.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function (e) {
        addImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  });

  function addImagePreview(imageSrc) {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("image-card");

    const imgElement = document.createElement("img");
    imgElement.src = imageSrc;

    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.classList.add("form-control");
    descriptionInput.placeholder = "輸入圖片描述";

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("delete-btn");
    removeBtn.innerHTML = "&times;";
    removeBtn.addEventListener("click", function () {
      previewContainer.removeChild(imgWrapper);
    });

    imgWrapper.appendChild(imgElement);
    imgWrapper.appendChild(descriptionInput);
    imgWrapper.appendChild(removeBtn);
    previewContainer.appendChild(imgWrapper);
  }
}

function initRoomManagement() {
  const addRoomBtn = document.getElementById("addRoom");
  const roomContainer = document.getElementById("roomContainer");

  addRoomBtn.addEventListener("click", function () {
    addRoomEntry();
  });

  function addRoomEntry() {
    const newRoom = document.createElement("div");
    newRoom.classList.add(
      "row",
      "g-2",
      "align-items-center",
      "mb-2",
      "room-entry"
    );

    newRoom.innerHTML = `
      <div className="col-md-4">
        <input type="text" className="form-control" placeholder="房型 (如大、中、小)" required />
      </div>
      <div className="col-md-2">
        <input type="number" className="form-control" placeholder="數量" required />
      </div>
      <div className="col-md-3">
        <input type="text" className="form-control" placeholder="金額" required />
      </div>
      <div className="col-md-3 d-flex">
        <input type="text" className="form-control" placeholder="定金" required />
        <button type="button" className="btn btn-danger btn-sm ms-2 remove-room">X</button>
      </div>
    `;

    roomContainer.appendChild(newRoom);
    bindRemoveRoomEvents();
  }

  function bindRemoveRoomEvents() {
    document.querySelectorAll(".remove-room").forEach((btn) => {
      btn.onclick = function () {
        this.closest(".room-entry").remove();
      };
    });
  }

  bindRemoveRoomEvents();
}

function initFormSubmission() {
  document
    .getElementById("editForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      alert("旅館資訊已儲存！");
    });
}
document.addEventListener("DOMContentLoaded", function () {
  initDeleteConfirmation();
});

function initDeleteConfirmation() {
  document.querySelectorAll(".delete-hotel").forEach((button) => {
    button.addEventListener("click", function () {
      if (confirm("確定要刪除此旅館資訊嗎？")) {
        alert("旅館已刪除");
        location.href = "operatorHotelList.html"; // 重新導向到旅館列表
      }
    });
  });
}
