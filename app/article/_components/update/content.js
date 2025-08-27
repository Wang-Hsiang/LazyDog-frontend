'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import FroalaEditor from 'froala-editor';
import 'froala-editor/js/languages/zh_tw.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import $ from 'jquery';
import { debounce } from 'lodash'; // 使用 lodash 的 debounce 函數
import styles from '../update/AddArticleModal.module.css'

// 設置 jQuery 為全域變數
if (typeof window !== 'undefined') {
  window.$ = $;
  window.jQuery = $;
}

export default function FroalaEditorWrapper({ onContentChange, initialContent }) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  // 使用 debounce 減少 onContentChange 的觸發頻率
  const debouncedContentChange = useCallback(
    debounce((content) => {
      if (typeof onContentChange === 'function') {
        onContentChange(content);
      }
    }, 300), // 300ms 的防抖時間
    [onContentChange]
  );

  // 初始化 Froala 編輯器
  useEffect(() => {
    if (editorInstanceRef.current) return; // 避免重複初始化

    if (editorRef.current) {
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
            const content = this.html.get();
            debouncedContentChange(content); // 使用防抖函數
          },
          initialized: function () {
            window.editorInstance = this;
            this.el.style.backgroundColor = 'transparent';
            if (initialContent) {
              this.html.set(initialContent);
            }
          },
        },
        zIndex: 1050,
      });
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
      window.editorInstance = null;
    };
  }, [debouncedContentChange, initialContent]);

  return (
    <div>
      <p>
        <span className={`mx-1 ${styles['red-sign']}`}></span>
      </p>
      <div id="example" ref={editorRef}></div>
    </div>
  );
}