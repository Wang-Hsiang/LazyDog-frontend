"use client";

import styles from "./page.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown, Modal, Button } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
// import useArticles from "@/hooks/useArticle";
import useComment from "@/hooks/useComment";

export default function Comment({ content, author, author_img, id }) {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const { deleteComment, loading } = useComment(); // 從 useComment 鉤子中獲取 deleteComment
    console.log(user);

    // 控制 Modal 的顯示與隱藏
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // 刪除評論
    const handleDelete = async () => {
        try {
            await deleteComment(id); // 調用刪除 API
            handleClose(); // 關閉 Modal
            window.location.reload(); // 重新加載頁面
        } catch (error) {
            console.error("刪除評論失敗:", error);
        }
    };

    return (
        <>
            <li className="d-flex py-3" style={{ margin: "10px" }}>
                <div className={`${styles.auther}`}>
                    <div className="avatar ratio ratio-1x1 rounded-circle overflow-hidden">
                        <img className="object-fit-cover" src={author_img} alt={author} />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div>{author}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: "2rem", width: "100%" }}>
                    <div style={{ width: '95%' }}>
                        {content}
                    </div>

                    {/* 條件渲染 Dropdown */}
                    {user?.name === author && (
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="light"
                                id="dropdown-basic"
                                className={`${styles.customToggle}`}
                            >
                                <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                                className={`${styles.customDropdownMenu}`}
                            
                            >
                                <Dropdown.Item
                                    className={`${styles.item}`}
                                    onClick={handleShow}
                                >
                                    刪除
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>
            </li>

            {/* 刪除確認 Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>確認刪除</Modal.Title>
                </Modal.Header>
                <Modal.Body>你確定要刪除嗎？此操作無法復原。</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        取消
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        {loading ? "刪除中..." : "確認刪除"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}