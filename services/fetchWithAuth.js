// // 做來取得token只要import到各檔案就好了 google的
// export const fetchWithAuth = async (url, options = {}) => {
//   const token = localStorage.getItem("token"); // getToken

//   const headers = {
//     "Content-Type": "application/json",
//   };

//   // 有Toke加 `Authorization`
//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }

//   // 發送 API 請求
//   const response = await fetch(url, { ...options, headers });
//   const data = await response.json();

//   if (response.status == 401) {
//     console.warn(" 未授權，請重新登入");
//     window.location.href = "/login";
//   }

//   return data;
// };
