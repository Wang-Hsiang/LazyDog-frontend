import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css'
import styles from "./page.module.css";

export default function MoreCard({ id, title, cover_image }) {
    return (
        <>
            <Link
                href={{ pathname: `/article/detail/${id}`}}
                className={`${styles.moreLink} col-lg-3 col-sm-12`}>
                <div className="ratio ratio-1x1">
                    <img
                        src={cover_image}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className={`mt-3 ${styles.customLink}`}>{title}</div>
            </Link>

        </>
    )
}