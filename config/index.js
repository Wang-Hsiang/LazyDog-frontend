export const apiURL = 'http://localhost:5000'

export const loginRoute = "/login";
// 隱私頁面路由，未登入時會，檢查後跳轉至登入頁路由
export const protectedRoutes = [
  // 這代表/dashboard/底下的所有路由都會被保護
//   "/dashboard/",
  // 設定各別的路由
  "/pages",

];
