'use client'

import React, { useEffect, useRef } from 'react'
import FroalaEditor from 'froala-editor'
import 'froala-editor/js/languages/zh_tw.js'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/plugins.pkgd.min.js'
import $ from 'jquery'
import styles from './AddArticleModal.module.css'

// 設置 jQuery 為全域變數
if (typeof window !== 'undefined') {
  window.$ = $
  window.jQuery = $
}

export default function FroalaEditorWrapper({ onContentChange }) {
  const editorRef = useRef(null)
  const editorInstanceRef = useRef(null) // 用來存放編輯器實例
  const prevContentRef = useRef('') // 記錄上次內容，避免無意義的更新

  useEffect(() => {
    if (editorInstanceRef.current) return // 避免重複初始化

    editorInstanceRef.current = new FroalaEditor(editorRef.current, {
      language: 'zh_tw',
      toolbarButtons: {
        moreText: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            'subscript',
            'superscript',
            'fontFamily',
            'fontSize',
            'textColor',
            'backgroundColor',
            'inlineClass',
            'inlineStyle',
            'clearFormatting',
          ],
        },
        moreParagraph: {
          buttons: [
            'alignLeft',
            'alignCenter',
            'alignRight',
            'alignJustify',
            'formatOL',
            'formatUL',
            'paragraphFormat',
            'paragraphStyle',
            'lineHeight',
            'outdent',
            'indent',
            'quote',
          ],
        },
        moreRich: {
          buttons: [
            'insertLink',
            'insertImage',
            'insertVideo',
            'insertTable',
            'emoticons',
            'fontAwesome',
            'specialCharacters',
            'embedly',
            'insertFile',
            'insertHR',
          ],
        },
        moreMisc: {
          buttons: ['undo', 'redo', 'fullscreen', 'html', 'help'],
        },
      },
      pluginsEnabled: ['image', 'italic', 'underline', 'strikeThrough'],
      imageUploadURL: 'http://localhost:5000/api/articles/upload',
      videoUploadURL: '/api/froala-upload?type=video',
      fileUploadURL: '/api/froala-upload?type=file',
      events: {
        contentChanged: function () {
          const content = this.html.get()
          if (prevContentRef.current !== content) {
            prevContentRef.current = content
            if (typeof onContentChange === 'function') {
              onContentChange(content)
            }
          }
        },
        initialized: function () {
          window.editorInstance = this
          this.el.style.backgroundColor = 'transparent'
        },
      },
      zIndex: 1050,
    })

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy()
        editorInstanceRef.current = null
      }
      window.editorInstance = null
    }
  }, []) 

  return (
    <>
      <p>
        <span className={`mx-1 ${styles['red-sign']}`}></span>
      </p>
      <div id="example" ref={editorRef}></div>
    </>
  )
}
