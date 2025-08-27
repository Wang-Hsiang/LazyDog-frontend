'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 引入 useRouter
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FroalaEditorWrapper from '../_components/add_article/content';
import Link from 'next/link';
import useArticles from "@/hooks/useArticle";
import useUploadCover from "@/hooks/uploadCover"; // 引入圖片上傳鉤子
import { useAuth } from "@/hooks/use-auth";  // 引入 useAuth 鉤子
import Header from "../../components/layout/header";
import style from '../../../styles/modules/operatorCamera.module.css';
import Breadcrumb from "../../components/teacher/breadcrumb";
import Swal from 'sweetalert2';

export default function AddArticlePage() {
  const { createArticle } = useArticles();
  const { uploadCover } = useUploadCover(); // 使用圖片上傳 Hook
  const { user } = useAuth(); // 獲取當前使用者的資料
  const router = useRouter(); // 使用 useRouter 進行路由跳轉

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // ✅ 儲存 Froala 內容
  const [Category, setCategory] = useState('');
  const [CoverImg, setCoverImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 類別選項
  const Options = [
    { id: 1, name: '保健與營養' },
    { id: 2, name: '食譜' },
    { id: 3, name: '善終' },
    { id: 4, name: '行為知識' },
    { id: 5, name: '開箱' }
  ];

  // 處理圖片變更
  const SelectCover = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImg(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImagePreview(reader.result);
    }
  };

  // 提交文章
  const Submit = async () => {
    if (!title.trim() || !Category) {
      Swal.fire("請填寫標題並選擇分類");
      return;
    }
    if (!user) {
      Swal.fire("請先登入");
      return;
    }
    let uploadImg = null;
    if (CoverImg) {
      try {
        uploadImg = await uploadCover(CoverImg);
        console.log("後端返回的圖片 URL:", uploadImg);
      } 
      catch (err) {
        console.error("圖片上傳失敗:", err);
        Swal.fire("圖片上傳失敗，請重試");
        return;
      }
    }
    

    // 提交文章資料
    const newArticle = {
      title,
      category_id: Number(Category),
      content, // ✅ 使用 Froala 編輯器內容
      article_img: uploadImg || "", // 使用上傳後的圖片 URL
      author_id: user.id,  // 把 author_id 加入到提交資料中
    };
    console.log(newArticle);
    try {
      await createArticle(newArticle);  // 傳遞帶有 author_id 的文章資料到後端
      Swal.fire("文章新增成功").then(() => {
        router.push('/article/list');
      });
    } catch (error) {
      console.error("提交文章失敗:", error);
      Swal.fire("提交文章失敗，請檢查網路連線");
    }
  };

  return (
    <>
      <Header />
      <div className={`${style.container}`}>
        <div className='lumi-all-wrapper'>
          <Breadcrumb
            links={[
              { label: "首頁 ", href: "/" },
              { label: " 毛孩文章", href: "/article/list" },
              { label: ` 新增文章`, href: "/article/list/detail", active: true },
            ]}
          />
        </div>
        <div className="container" style={{ marginTop: '35px' }}>
          <div className="row">
            <div className="col-lg-3 col-sm-12">
              <Link href="/article/list" className={`btn mb-3 ${style.btn3}`}>
                回文章列表
              </Link>
            </div>
            <div className="col-lg-9">
              <form
                className="p-3 col"
                style={{
                  maxWidth: '750px',
                  backgroundColor: '#FDFAF5',
                  boxShadow: "0px 10px 14px rgba(0, 0, 0, 0.25)"
                }}
              >
                <h4 className='mt-2 mb-4'>新增文章</h4>

                {/* 下拉選單 - 類別選擇 */}
                <select
                  className="form-select my-3"
                  value={Category}
                  style={{ width: '200px' }}
                  onChange={(e) => setCategory(Number(e.target.value))}
                >
                  <option value="">請選擇主題</option>
                  {Options.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* 標題輸入 */}
                <input
                  className="ps-2 w-100 d-block"
                  placeholder="標題"
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {/* 圖片上傳 */}
                <div style={{ margin: '20px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={SelectCover}
                    style={{ marginBottom: '10px' }}
                  />
                  {imagePreview && (
                    <div>
                      <h4>圖片預覽:</h4>
                      <img
                        src={imagePreview}
                        alt="預覽"
                        style={{ maxWidth: '100%', height: '250px', marginBottom: '10px' }}
                      />
                    </div>
                  )}

                </div>

                {/* 文章內容編輯器 */}
                <FroalaEditorWrapper
                  onContentChange={(content) => setContent(content)} />
                {/* ✅ 傳遞內容變更函數 */}

                {/* 發布按鈕 */}
                <div className={`d-flex justify-content-end`}>
                  <button
                    type="button"
                    className={`mt-3  ${style.btn}`}
                    onClick={Submit}
                  >
                    <>
                      <i className="bi bi-check-circle"></i> 發布文章
                    </>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}