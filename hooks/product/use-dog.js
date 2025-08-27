"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/app/product/list/list.module.css";

export function useDogBottom() {
  const dogRef = useRef(null);
  const containerRef = useRef(null);
  const [Flip, setFlip] = useState(false);
  const animations = [
    { class: styles.dogWalk, duration: 900 },
    { class: styles.dogRun, duration: 400 },
  ];
  const woof = [{ class: styles.dogWoof, duration: 1000 }];
  const transitions = [
    { class: styles.dogWalkToSit, duration: 200 },
    { class: styles.dogSitToWalk, duration: 200 },
  ];
  const stop = [
    { class: styles.dogSit, duration: 600 },
    { class: styles.dogStop, duration: 600 },
    { class: styles.dogWoof, duration: 800 },
  ];
  const getRandomPosition = (e) => {
    // 始終限制在螢幕寬度範圍內
    return Math.floor(Math.random() * (window.innerWidth - 60));
  };
  const getRandomAnimation = () => {
    return animations[Math.floor(Math.random() * animations.length)];
  };
  const getRandomStopAnimation = () => {
    return stop[Math.floor(Math.random() * stop.length)];
  };
  const [stopOn, setStopOn] = useState(true);
  const [TimeoutId, setTimeoutId] = useState(null);

  const stopDog = (e, now) => {
    if (TimeoutId) {
      clearTimeout(TimeoutId);
      setTimeoutId(null);
    }
    if (stopOn == true || now == true) {
      if (!dogRef.current || !containerRef.current) return;

      if (dogRef.current.className.includes(styles.flip)) {
        setFlip(true);
        dogRef.current.className = styles.dog;
        dogRef.current.classList.add(styles.flip);
      } else {
        setFlip(false);
        dogRef.current.className = styles.dog;
      }

      // 隨機選擇新動畫
      const newAnimation = getRandomStopAnimation();
      dogRef.current.classList.add(newAnimation.class);

      const dogPositionX = e ? e.currentTarget.getBoundingClientRect().left : 0;
      const boundedPositionX = Math.max(
        0,
        Math.min(dogPositionX, window.innerWidth - 60)
      );

      containerRef.current.style.transition = `left 100ms linear`;
      containerRef.current.style.left = `${boundedPositionX}px`;
      setStopOn(false);
    } else {
      moveDog();
    }
  };
  const moveDog = () => {
    if (!dogRef.current || !containerRef.current) return;
    if (TimeoutId) {
      clearTimeout(TimeoutId);
      setTimeoutId(null);
    }
    dogRef.current.className = styles.dog;

    const newAnimation = getRandomAnimation();
    dogRef.current.classList.add(newAnimation.class);

    const newPosition = getRandomPosition();
    const currentPosition = parseInt(containerRef.current.style.left) || 0;

    if (newPosition < currentPosition) {
      dogRef.current.classList.remove(styles.flip);
      setFlip(false);
    } else {
      dogRef.current.classList.add(styles.flip);
      setFlip(true);
    }

    const distance = Math.abs(newPosition - currentPosition);
    const moveDuration =
      distance * (newAnimation.class == styles.dogWalk ? 15 : 5);

    containerRef.current.style.transition = `left ${moveDuration}ms linear`;
    containerRef.current.style.left = `${newPosition}px`;

    // 在動畫完成後繼續下一次移動
    const id = setTimeout(
      moveDog,
      Math.max(moveDuration, newAnimation.duration)
    );
    setTimeoutId(id);
  };

  useEffect(() => {
    moveDog();
    return () => {
      if (TimeoutId) clearTimeout(TimeoutId);
    };
  }, [dogRef.current]);

  return {
    containerRef,
    dogRef,
    stopDog,
    stopOn,
    setStopOn,
    TimeoutId,
    Flip,
    moveDog,
  };
}

// export function useDogRandom() {
//   const constraintsRef = useRef(null);
//   const randomDogRef = useRef(null);
//   const randomRef = useRef(null);
//   const animations = [
//     { class: styles.dogWalk, duration: 1000 },
//     { class: styles.dogRun, duration: 400 },
//     { class: styles.dogWoof, duration: 1000 },
//     { class: styles.dogSit, duration: 600 },
//     { class: styles.dogStop, duration: 600 },
//   ];
//   const transitions = [
//     { class: styles.dogWalkToSit, duration: 200 },
//     { class: styles.dogSitToWalk, duration: 200 },
//   ];

//   const getRandomAnimation = () => {
//     return animations[Math.floor(Math.random() * animations.length)];
//   };

//   const [RandomId, setTimeoutId] = useState(null);

//   const randomDog = (e) => {
//     if (!randomDogRef.current || !randomRef.current) return;
//     if (RandomId) {
//       clearTimeout(RandomId);
//       setTimeoutId(null);
//     }
//     if (randomDogRef.current.className.includes(styles.flip)) {
//       randomDogRef.current.className = styles.dog;
//       randomDogRef.current.classList.add(styles.flip);
//     } else {
//       randomDogRef.current.className = styles.dog;
//     }

//     const newAnimation = getRandomAnimation();
//     randomDogRef.current.classList.add(newAnimation.class);

//     const id = setTimeout(randomDog, Math.max(newAnimation.duration));
//     setTimeoutId(id);
//   };

//   useEffect(() => {
//     randomDog;
//     return () => {
//       if (RandomId) clearTimeout(RandomId);
//     };
//   }, []);

//   return {
//     randomRef,
//     randomDogRef,
//     randomDog,
//     constraintsRef,
//     RandomId,
//   };
// }
