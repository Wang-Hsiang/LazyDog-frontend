'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import styles from "../css/teacherSignDetail.module.css"


export default function TeacherDetailC() {
  const params = useParams()
  const sessionCode = params.sessionId
  const [session, setSession] = useState([]);
  const [mainpic, setMainpic] = useState([]);
  const [otherpics, setOtherpics] = useState([]);
  
  useEffect(() => {
    fetch(`http://localhost:5000/teacher/mycourse/${sessionCode}`,{
      method: "GET",
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setSession(data.data.courses[0]);
        setMainpic(data.data.mainpic[0]);
        setOtherpics(data.data.otherpics);

      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [sessionCode]);

  const startDate = session.start_date? new Date(session.start_date).toISOString().split('T')[0]: '';
  const startTime = session.start_time ? session.start_time.slice(0, 5) : '';
  const endTime = session.end_time ? session.end_time.slice(0, 5) : '';

  return (
    <>
      <div className={`col-lg-9 col-md-12 col-12`}>            
            <div className={`p-5 ${styles.right}`}>
              <h4 className={`mb-4 ${styles.tTitle}`}>課程資訊</h4>
              <form>
                  <section className={`row g-4 mb-5 ${styles.section1}`}>
                      <div className={`col-md-12`}>
                        <label className={`form-label ${styles.labels}`}>課程名稱</label>
                        <input type="text" className={`form-control  ${styles.controls}`} defaultValue={session.name} disabled readOnly/>
                      </div>
                      <div className={`col-md-6 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>課程類別</label>
                        <select className={`form-select  ${styles.controls}`} disabled readOnly>
                          <option selected>{session.typeName}</option>
                        </select>
                      </div>
                      <div className={`col-md-6 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>課程金額</label>
                        <input type="text" className={`form-control  ${styles.controls}`} defaultValue={session.price} disabled readOnly  />
                      </div>
                      <div className={`col-md-6 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>總時數</label>
                        <input type="text" className={`form-control  ${styles.controls}`} defaultValue={session.duration} disabled readOnly />
                      </div>
                      <div className={`col-md-6 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>報名人數限制</label>
                        <input type="text" className={`form-control  ${styles.controls}`} defaultValue={session.max_people} disabled readOnly/>
                      </div>
                    </section>
                    <section className={`row g-4 mb-5 ${styles.section2}`}>
                      <div className={`col-md-12`}>
                        <label className={`form-label ${styles.labels}`}>該梯每堂課日期</label>
                        <input type="text" className={`form-control  ${styles.controls}`} defaultValue={session.class_dates} disabled readOnly  />
                      </div>
                      <div className={`col-md-6 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>開課日期</label>
                        <input type="text" className={`form-control  ${styles.controls}`} defaultValue={startDate} disabled readOnly />
                      </div>
                      <div className={`col-md-6 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>開課地點</label>
                        <select className={`form-select  ${styles.controls}`} disabled readOnly>
                          <option selected>{session.region}</option>
                        </select>
                      </div>
                      <div className={`col-md-12 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>上課時間</label>
                        <div className={`d-flex`}>
                          <input type="text" className={`form-control  ${styles.controls}`} defaultValue={startTime} disabled readOnly />
                          <span className={`align-self-center p-2`}>~</span>
                          <input type="text" className={`form-control  ${styles.controls}`} defaultValue={endTime} disabled readOnly />
                        </div>
                        
                      </div>
                    </section> 
                    <section className={`row g-4 mb-5  ${styles.section3}`}>
                      <div className={`col-md-12 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>課程介紹</label>
                        <textarea className={`form-control  ${styles.controls} ${styles.scrollOrg}`} style={{resize: 'none'}} id="exampleFormControlTextarea1" rows={3} defaultValue={session.description} disabled readOnly/>
                      </div>
                      <div className={`col-md-12 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>注意事項</label>
                        <textarea className={`form-control  ${styles.controls} ${styles.scrollOrg}`} style={{resize: 'none'}} id="exampleFormControlTextarea1" rows={4} defaultValue={session.notice} disabled readOnly />
                      </div>
                      <div className={`col-md-12 mt-3`}>
                        <label className={`form-label ${styles.labels}`}>Q&amp;A</label>
                        <textarea className={`form-control  ${styles.controls} ${styles.scrollOrg}`} style={{resize: 'none'}} id="exampleFormControlTextarea1" rows={4} defaultValue={session.qa} disabled readOnly/>
                      </div>
                    </section>
                    <section className={`row g-4 mb-5 ${styles.section4}`}>
                      <label className={`form-label`}>課程圖片
                          <span className={styles.must}>* </span>
                      </label>
                        <div className={`col-md-5 col-12 mt-4 mb-5 ${styles.mainPic}`}>
                          <div className={styles.imageCard}>
                            <img className={styles.imgCr} src={`/course/img/${mainpic.url}`} alt={`${session.name}-課程主圖`} />
                          </div>
                        </div>
                        <div className={`col-md-7 col-12 mt-4 mb-5 ${styles.otherPic}`}>
                          <div id="imageContainer" className={`d-flex flex-wrap gap-3 mb-2`}>
                            {otherpics.map((other)=>(
                              <div className={styles.imageCard}>
                                <img className={`${styles.imgCr} ${styles.pics}`} src={`/course/img/${other.url}`} alt={`${session.name}-課程其他圖片`} />
                            </div>
                            ))}                           
                          </div>
                          <input type="file" id="imageUpload" className={`form-control d-none add`} accept="image/*" multiple />
                        </div>
                    </section>
                {/* 按鈕區 */}
                <div className={`d-flex justify-content-end gap-3`}>
                  <button type="submit" className={`btn btn-primary btn-sm px-4 ${styles.submitBtn}`}>
                    <a className={styles.submitBtnA} href={`/teacher-sign/update/${session.session_id}`}>編輯</a>
                  </button>
                </div>
              </form>
            </div>
      </div>
    </>
  )
}
