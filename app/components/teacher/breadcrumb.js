"use client"

import Link from "next/link";
import styles from "../../product/list/list.module.css";

const Breadcrumbs = ({ links }) => {
  return (
    <div className={styles.breadcrumb}>
      {links.map((link, index) => (
        <span key={index}>
          <Link
            href={link.href}
            className={link.active ? styles.BreadcrumbsActive : ""}
          >
            {link.label}&nbsp;
          </Link>
          &nbsp;
          {index < links.length - 1 && (
            <img className="pb-1" src="/product/font/right.png" alt="" />
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
