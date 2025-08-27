"use client";

import useArticle from "@/hooks/useArticle"; // 確保導入正確的 Hook
import { useState } from "react";
import styles from "../my_article/page.module.css";
import Link from "next/link";
import { Dropdown, Modal, Button } from "react-bootstrap";

export default function MyCard2({ id, title, cover_image, created_at }) {
    console.log(cover_image)
    const { deleteArticle } = useArticle(); // 取得刪除文章的函數
    const [showModal, setShowModal] = useState(false);

    // 控制 Modal 的顯示與隱藏
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // 處理刪除操作
    const handleDelete = async () => {
        try {
            await deleteArticle(id); // 調用刪除 API
            handleClose(); // 關閉 Modal
            window.location.reload()
        } catch (error) {
            console.error("刪除文章失敗:", error);
        }

    };
    return (
        <>
            <div
                className="card mb-3" 
                style={{ width: '100%'}}>
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={cover_image} 
                        className="img-fluid rounded-start" 
                        style={{ width:'100%',height:'200px',objectFit:'cover',overflow:'hidden' }} />
                    </div>
                    <div className="col-md-8" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="card-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Link
                                    className={`${styles.link2}`}
                                    href={{ pathname: `/article/my_detail/${id}`, query: { list: "true" } }}
                                    style={{ marginRight: '3px' }}
                                >
                                    {title}
                                </Link>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="dropdown-basic" className={`${styles.customToggle}`}>
                                        <i className="bi bi-three-dots"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={`${styles.customDropdownMenu}`} style={{ width: '25px',backgroundColor:'#FFF6E8' }}>
                                        <Dropdown.Item className={`${styles.item}`} href="#">
                                            <Link
                                                className={`${styles.link3}`}
                                                href={{ pathname: `/article/my_detail/${id}`, query: { list: "true" } }}
                                            >檢視
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item className={`${styles.item}`} href="#"><Link
                                            className={`${styles.link3}`}
                                            href={{ pathname: `/article/update/${id}`, query: { list: "true" } }}
                                        >編輯
                                        </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item className={`${styles.item}`} onClick={handleShow} style={{ fontSize: '16px'}}>刪除</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                {/* Modal 確認刪除 */}
                                <Modal show={showModal} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>確認刪除</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>你確定要刪除嗎？此操作無法復原。</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>取消</Button>
                                        <Button variant="danger" onClick={handleDelete}>確認刪除</Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            <p
                                className="card-text mt-3"
                            ><small className="text-muted">{created_at}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}