import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfR9t4ckoFf7GiDV-J0Gxr032i5FXx_oA",
  authDomain: "lazydog-d201b.firebaseapp.com",
  projectId: "lazydog-d201b",
  storageBucket: "lazydog-d201b.firebasestorage.app",
  messagingSenderId: "864077153142",
  appId: "1:864077153142:web:03a3d9b0f4aca9379eb057",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化認證
const auth = getAuth(app);

// Google 登入提供者
const provider = new GoogleAuthProvider();

export { auth, provider, signInPopup };