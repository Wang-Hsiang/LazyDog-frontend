function generateCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.getElementById("couponCode").value = code;
}

function loadCoupon(
  code,
  name,
  details,
  startDate,
  endDate,
  applicableTo,
  usage,
  status
) {
  document.getElementById("modalCouponCode").textContent = code;
  document.getElementById("modalCouponName").textContent = name;
  document.getElementById("modalCouponDetails").textContent = details;
  document.getElementById("modalStartDate").textContent = startDate;
  document.getElementById("modalEndDate").textContent = endDate;
  document.getElementById("modalApplicableTo").textContent = applicableTo;
  document.getElementById("modalUsage").textContent = usage;

  let statusBadge = document.getElementById("modalStatus");
  statusBadge.textContent = status;
  if (status === "啟用") {
    statusBadge.className = "badge bg-success";
  } else {
    statusBadge.className = "badge bg-secondary";
  }
}
