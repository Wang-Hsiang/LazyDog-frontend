function changeCategory(category) {
    console.log("切換到分類: " + category);
  }

  function filterStatus(status) {
    document
      .querySelectorAll(".status-filter button")
      .forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    document.querySelectorAll(".coupon-card").forEach((card) => {
      card.style.display = card.classList.contains(status)
        ? "flex"
        : "none";
    });
  }