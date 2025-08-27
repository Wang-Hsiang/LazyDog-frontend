"use client"

import Link from "next/link";
import styles from "./ListCard.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function AsideCard({ id, title, cover_image, created_at }) {
    return (
        <>
            <Link
                href={{ pathname: `/article/detail/${id}`, query: { list: "true" } }}
                // className={styles.asideRead}
                className={`${styles.asideRead} row mt-2`}
            >
                <div className="col-3">
                    <div
                    className="ratio ratio-1x1 w-100"
                    >
                        <img
                            // className="w-100"
                            src={cover_image}
                            alt=""
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
                <div
                    className="col-9">
                    <div className={styles.title2}>{title}</div>
                    <p style={{ color: '#9F9F9F' }}>{created_at}</p>
                </div>
            </Link>

        </>
    )
}