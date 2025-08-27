const infoQty = document.querySelector(".info-qty-group");
const qtyMinus = document.querySelector(".qty-minus");
const qtyPlus = document.querySelector(".qty-plus");
const stickyNav = document.querySelector(".sticky-top");
const accordion = document.querySelector(".accordion");
const collapse = document.querySelector("#collapse2");
const collapseRate = document.querySelector("#collapse4");
const scoreBar = document.querySelector(".score-bar");
const favoriteIcons = document.querySelectorAll(".favorite-btn");
const score = document.querySelector(".score");
const starBars = document.querySelectorAll(".star-bar");
const rateCardBtns = document.querySelectorAll(".rate-card-btn");
const cartBtns = document.querySelectorAll(".cart-btn");
const productCards = document.querySelectorAll(".product-card");
let scoreList = [];
let totalScore = 0;

// 商品數量加減
qtyMinus.addEventListener("click", () => {
  let qty = Number(infoQty.querySelector("input").value);
  if (qty < 0) {
    return (infoQty.querySelector("input").value = 1);
  } else if (qty > 999) {
    return (infoQty.querySelector("input").value = 999);
  }
  qty > 1
    ? (infoQty.querySelector("input").value = qty - 1)
    : (infoQty.querySelector("input").value = qty);
});
qtyPlus.addEventListener("click", () => {
  let qty = Number(infoQty.querySelector("input").value);
  if (qty < 0) {
    return (infoQty.querySelector("input").value = 1);
  } else if (qty > 999) {
    return (infoQty.querySelector("input").value = 999);
  }
  qty < 999
    ? (infoQty.querySelector("input").value = qty + 1)
    : (infoQty.querySelector("input").value = qty);
});

// 收藏愛心(hover+點擊切換)
favoriteIcons.forEach((favoriteIcon) => {
  let status = favoriteIcon.querySelector("img").getAttribute("src");
  favoriteIcon.addEventListener("mouseenter", (e) => {
    e.currentTarget
      .querySelector("img")
      .setAttribute("src", "./img/font/heart-fill.png");
  });
  favoriteIcon.addEventListener("mouseleave", (e) => {
    if (!status.includes("-fill")) {
      e.currentTarget
        .querySelector("img")
        .setAttribute("src", "./img/font/heart.png");
    }
  });
  favoriteIcon.addEventListener("click", () => {
    if (status.includes("-fill")) {
      favoriteIcon
        .querySelector("img")
        .setAttribute("src", "./img/font/heart.png");
      status = favoriteIcon.querySelector("img").getAttribute("src");
    } else {
      favoriteIcon
        .querySelector("img")
        .setAttribute("src", "./img/font/heart-fill.png");
      status = favoriteIcon.querySelector("img").getAttribute("src");
    }
  });
});

// 滾動後顯示商品資訊navbar
window.addEventListener("scroll", () => {
  if (window.scrollY >= stickyNav.offsetTop) {
    stickyNav.style.opacity = "1";
  } else {
    stickyNav.style.opacity = "0";
  }
});

// 商品資訊navbar(點擊跳至)
stickyNav.addEventListener("click", (e) => {
  if (e.target.tagName == "A") {
    let collapseID = e.target.getAttribute("href").replace("-heading", "");
    document.querySelector(collapseID).classList.add("show");
  }
});

// 商品資訊手風琴(點擊收展)
collapse.addEventListener("click", (e) => {
  e.currentTarget.previousElementSibling.querySelector("button").click();
});

// 商品評分動態計算
starBars.forEach((starBar) => {
  let barLength = starBar.querySelector("p").innerText;
  let bar = parseInt(barLength) / 100;
  scoreList.push(bar);
  starBar.querySelector(".bar").style.width = barLength;
});
for (let i = 0; i < scoreList.length; i++) {
  totalScore += scoreList[i] * (5 - i);
}
score.querySelector("h2").innerText = totalScore.toFixed(1);

// 商品評價推薦(點擊切換)
rateCardBtns.forEach((rateCardBtn) => {
  rateCardBtn.addEventListener("click", () => {
    if (
      rateCardBtn.querySelector("img").getAttribute("src").includes("-fill")
    ) {
      rateCardBtn
        .querySelector("img")
        .setAttribute("src", "./img/font/good.png");
    } else {
      rateCardBtn
        .querySelector("img")
        .setAttribute("src", "./img/font/good-fill.png");
    }
  });
});

productCards.forEach((productCard) => {
  productCard.addEventListener("mouseenter", (e) => {
    e.currentTarget.querySelector(".product-card-hover").style.display = "flex";
  });
  productCard.addEventListener("mouseleave", (e) => {
    e.currentTarget.querySelector(".product-card-hover").style.display = "none";
  });
});

// 加入購物車(hover)
cartBtns.forEach((cartBtn) => {
  let status = cartBtn.querySelector("img").getAttribute("src");
  let qty = 1;
  cartBtn.addEventListener("mouseenter", (e) => {
    if (!status.includes("-fill")) {
      e.currentTarget
        .querySelector("img")
        .setAttribute("src", "./img/font/cart-add.png");
    }
  });
  cartBtn.addEventListener("mouseleave", (e) => {
    if (!status.includes("-fill")) {
      e.currentTarget
        .querySelector("img")
        .setAttribute("src", "./img/font/cart.png");
    }
  });
  cartBtn.addEventListener("click", () => {
    if (status.includes("-fill")) {
      qty++;
      cartBtn.querySelector("h2").innerText = qty;
    } else {
      cartBtn
        .querySelector("img")
        .setAttribute("src", "./img/font/cart-fill.png");
      status = cartBtn.querySelector("img").getAttribute("src");
      cartBtn.querySelector("h2").innerText = qty;
      cartBtn.querySelector("h2").style.display = "block";
    }
  });
});
