'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import React, { useState, useEffect } from 'react'

export default function CartCartlist(props) {
  return (
    <>
      <tr>
        <td>
          <img src="/cart/favicon.ico" alt="" />
        </td>
        <td>行 1, 欄 2</td>
        <td>行 1, 欄 3</td>
        <td>行 1, 欄 4</td>
        <td>行 1, 欄 5</td>
        <td style={{ width: 64, height: 29 }}>
          <button
            style={{
              border: 'transparent',
              backgroundColor: 'white',
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} style={{ color: '#f2662b' }} />
          </button>
        </td>
      </tr>
    </>
  )
}
