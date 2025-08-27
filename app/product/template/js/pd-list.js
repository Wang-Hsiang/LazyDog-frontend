const ranges = document.querySelectorAll("input[type=range]");
let max, min;
let events = ["input", "mouseenter"];

max = document.querySelector(".range-max");
min = document.querySelector(".range-min");
let to =
  (max.value / (max.getAttribute("max") - max.getAttribute("min"))) * 100;
let from =
  (min.value / (max.getAttribute("max") - max.getAttribute("min"))) * 100;
ranges[0].style.setProperty("--to", to);
ranges[0].style.setProperty("--from", from);

events.forEach((event) => {
  ranges.forEach((range) => {
    range.addEventListener(event, function () {
      // console.log(this.value);
      max = document.querySelector(".range-max").value;
      min = document.querySelector(".range-min").value;
      let to = ((max - this.min) / (this.max - this.min)) * 100;
      let from = ((min - this.min) / (this.max - this.min)) * 100;

      ranges[0].style.setProperty("--to", to);
      ranges[0].style.setProperty("--from", from);
    });
  });
});
