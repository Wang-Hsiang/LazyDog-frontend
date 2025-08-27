"use client";

import DOMPurify from "dompurify";
import Link from "next/link";
import styles from "./page.module.css";
import style from "../../../../styles/modules/operatorCamera.module.css";

export default function Content({ article }) {
  // console.log(article)
  // 消毒處理
  const cleanHTML = DOMPurify.sanitize(article?.content || "", {
    ALLOWED_TAGS: ["p", "h3", "h4", "ul", "li", "img", "strong", "em", "br"],
    ALLOWED_ATTR: ["src", "alt", "class", "style"],
  });

  // 圖片處理 (Next.js 優化)
  const processedHTML = cleanHTML.replace(
    /<img([^>]+)src="([^"]+)"([^>]*)>/g,
    (match, before, src, after) => {
      return `
        <Image 
          src="${src}" 
          ${before}${after}
          layout="responsive"
          width={800} 
          height={450}
          objectFit="contain"
          loading="lazy"
        />
      `;
    }
  );

  return (
    <div className={`${styles.content} mt-4`}>
      <h3 className="mb-4">{article?.title}</h3>
      <div>
        <div
          style={{ background: "#66c5bd", color: "#fff" }}
          className={`${styles.floor}`}
        >
          作者
        </div>
        <Link
          href={{
            pathname: `/article/author/${article.author_id}`,
            query: { list: "true" },
          }}
          className={`ms-2 ${styles.auther}`}
          style={{ display: "inline-block" }}
        >
          {article?.author_name}
        </Link>
      </div>
      <div
        className={`${styles.articleContent}`}
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      />
    </div>
  );
}

// className={`${styles.autherDetail}`} style={{ margin: '15px 0' }}
