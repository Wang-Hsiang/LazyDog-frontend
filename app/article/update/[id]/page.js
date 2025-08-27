'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FroalaEditorWrapper from '../../_components/update/content';
import Link from 'next/link';
import useArticles from "@/hooks/useArticle";
import useUploadCover from "@/hooks/uploadCover";
import { useAuth } from "@/hooks/use-auth";
import Header from "../../../components/layout/header";
import Breadcrumb from "../../../components/teacher/breadcrumb";
import style from '../../../../styles/modules/operatorCamera.module.css';
import styles from './page.module.css';
import Swal from 'sweetalert2';
import TitleInput from '../../_components/update/TitleInput';
import CategorySelect from '../../_components/update/CategorySelect';
import ImageUpload from '../../_components/update/ImageUpload';
import { useRouter } from 'next/navigation';

export default function UpdateArticlePage({ params }) {
  const { updateArticle, getArticle } = useArticles();
  const { uploadCover, isLoading, error } = useUploadCover();
  const { user } = useAuth();
  const router = useRouter();
  
  // 用 useRef 儲存內容，避免影響 re-render
  const contentRef = useRef("");

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const articleId = params.id;
  const isActiveRef = useRef(true)

  // 內容變更時，只更新 useRef，不觸發 re-render
  const handleContentChange = useCallback((newContent) => {
    if (contentRef.current !== newContent) {
      contentRef.current = newContent;
    }
  }, []);

  // 類別選項
  const categoryOptions = useMemo(() => [
    { id: 1, name: '保健與營養' },
    { id: 2, name: '食譜' },
    { id: 3, name: '善終' },
    { id: 4, name: '行為知識' },
    { id: 5, name: '開箱' }
  ], []);

  // 獲取文章資料
 useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await getArticle(articleId, isActiveRef); 
        if (article && isActiveRef.current) { // 確保元件仍處於掛載狀態才更新 state
            setTitle(article.title);
            contentRef.current = article.content;
            setSelectedCategory(article.category_id);
            setImageUrl(article.cover_image);
        }
      } catch (error) {
        if (isActiveRef.current) { // 確保元件仍處於掛載狀態才顯示錯誤
            console.error("獲取文章資料失敗:", error);
            Swal.fire("無法獲取文章，請稍後重試");
        }
      }
    };
    fetchArticle();

    // 在元件卸載時設定 isActiveRef.current 為 false
    return () => {
      isActiveRef.current = false;
    };
  }, [articleId, getArticle]);

  // 處理圖片變更
  const handleImageChange = useCallback((file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  // 提交文章
  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !selectedCategory) {
      Swal.fire("請填寫標題並選擇分類");
      return;
    }

    if (!user) {
      Swal.fire("請先登入");
      return;
    }

    let uploadedImageUrl = imageUrl;
    if (selectedImage) {
      try {
        uploadedImageUrl = await uploadCover(selectedImage);
      } catch (err) {
        console.error("圖片上傳失敗:", err);
        Swal.fire("圖片上傳失敗，請重試");
        return;
      }
    }

    // 只有在提交時才更新 state
    const updatedArticle = {
      title,
      category_id: Number(selectedCategory),
      content: contentRef.current, // 使用 useRef 儲存的內容
      article_img: uploadedImageUrl || "",
      author_id: user.id
    };

    try {
      await updateArticle(articleId, updatedArticle);
      Swal.fire("文章更新成功！").then(() => {
        router.push('/user/my_article');
      });
    } catch (error) {
      console.error("提交文章失敗:", error);
      Swal.fire("文章更新失敗，請檢查網路連線");
    }
  }, [title, selectedCategory, user, imageUrl, selectedImage, uploadCover, updateArticle, articleId, router]);

  //   if (!title.trim() || !selectedCategory) {
  //     Swal.fire("請填寫標題並選擇分類");
  //     return;
  //   }

  //   if (!user) {
  //     Swal.fire("請先登入");
  //     return;
  //   }

  //   let uploadedImageUrl = imageUrl;
  //   if (selectedImage) {
  //     try {
  //       uploadedImageUrl = await uploadCover(selectedImage);
  //     } catch (err) {
  //       console.error("圖片上傳失敗:", err);
  //       Swal.fire("圖片上傳失敗，請重試");
  //       return;
  //     }
  //   }

  //   // 只有在提交時才更新 state
  //   const updatedArticle = {
  //     title,
  //     category_id: Number(selectedCategory),
  //     content: contentRef.current, // 使用 useRef 儲存的內容
  //     article_img: uploadedImageUrl || "",
  //     author_id: user.id
  //   };

  //   try {
  //     await updateArticle(articleId, updatedArticle);
  //     Swal.fire("文章更新成功！").then(() => {
  //       router.push('/user/my_article');
  //     });
  //   } catch (error) {
  //     console.error("提交文章失敗:", error);
  //     Swal.fire("文章更新失敗，請檢查網路連線");
  //   }
  // };

  return (
    <>
      <Header />
      <div className={`${style.container}`}>
        <div className='lumi-all-wrapper'>
          <Breadcrumb
            links={[
              { label: "首頁 ", href: "/" },
              { label: " 我的文章", href: "/user/my_article" },
              { label: ` 編輯文章`, href: "/article/list/detail", active: true },
            ]}
          />
        </div>
        <div className="container" style={{ marginTop: '55px' }}>
          <div className="row">
            <div className="col-lg-3 col-sm-12">
              <Link href="/user/my_article" className={`btn mb-3 ${style.btn3}`}>
                回我的文章
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
                <h4 className='mt-3 mb-4'>編輯文章</h4>

                {/* 標題輸入 */}
                <TitleInput title={title} setTitle={setTitle} />

                {/* 類別選擇 */}
                <CategorySelect
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categoryOptions={categoryOptions}
                />

                {/* 圖片上傳 */}
                <ImageUpload
                  imageUrl={imageUrl}
                  imagePreview={imagePreview}
                  handleImageChange={handleImageChange}
                  error={error}
                />

                {/* 文章內容編輯器 */}
                <FroalaEditorWrapper
                  onContentChange={handleContentChange}
                  initialContent={contentRef.current} // 直接從 useRef 讀取
                />

                {/* 保存按鈕 */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className={`mt-3 ${styles.post}`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? '保存中...' : (
                      <>
                        <div className={styles.postLink}>
                          <i className="bi bi-check-circle"></i> 保存文章
                        </div>
                      </>
                    )}
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