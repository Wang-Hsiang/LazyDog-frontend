 "use client";
              
import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";

export default function Tbody(props) {
const { cartItems, totalAmount, totalQty, onDecrease, onIncrease, onRemove } = useCart();
return (
    <>
    <tbody>
        {cartItems.map((cartItem) => (
            <tr>
                    <td>
                      <img src={cartItem.img} />
                    </td>
                    <td>{cartItem.name}</td>
                    <td>{cartItem.price}</td>
                    <td>
                      {" "}
                      <button
                        onClick={() => {
                          onIncrease(cartItem.id);
                        }}
                      >
                        +
                      </button>
                      {cartItem.amount}
                      <button
                        onClick={() => {
                          // 先計算如果按下減按鈕，商品數量會變為多少
                          const nextCount = cartItem.count - 1;
                          onDecrease(cartItem.id);
                        }}
                      >
                        –
                      </button>
                    </td>
                    <td>{}</td>
                    <td style={{ width: 64, height: 29 }}>
                      <button
                        style={{
                          border: "transparent",
                          backgroundColor: "white",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          style={{ color: "#f2662b" }}
                          onClick={() => {
                            onRemove(cartItem.id);
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* <tr>
                  <td>
                    <img src="/cart/favicon.ico" alt />
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
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        style={{ color: '#f2662b' }}
                      />
                    </button>
                  </td>
                </tr> */}
                {/* <tr>
                  <td>
                    <img src="/cart/favicon.ico" alt />
                  </td>
                  <td>行 2, 欄 2</td>
                  <td>行 2, 欄 3</td>
                  <td>行 2, 欄 4</td>
                  <td>行 2, 欄 5</td>
                  <td>
                    <button
                      style={{
                        border: 'transparent',
                        backgroundColor: 'white',
                      }}
                    >
                      <i
                        className="fa-solid fa-trash"
                        style={{ color: '#f2662b' }}
                      />
                    </button>
                  </td>
                </tr> */}
              </tbody>
                  </>
                );
              }
              