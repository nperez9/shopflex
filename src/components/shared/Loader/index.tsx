'use client'
import Logo from "@/icons/Logo";
import { useEffect, useRef, useState } from "react";
import styles from './Loader.module.scss'

export default function Loader() {

  const loader = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
	const [activeLogoAnimation, setActiveLogoAnimation] = useState(true)

  const initialCurve:number = 200;
  const duration:number = 600;
  let start:number | undefined;

  useEffect(() => {
    setPath(initialCurve)
    requestAnimationFrame(activeLogoDraw)
    setTimeout( () => {
      requestAnimationFrame(animate)
    }, 2100)
  }, [])

  const activeLogoDraw = () => {
    setActiveLogoAnimation(true)
  }

  const loaderHeight = () => {
    if(loader.current) {
      const loaderBounds = loader.current.getBoundingClientRect();
      return loaderBounds.height;
    }
  }

  const setPath = (curve:number) => {
    const width = window.innerWidth
    const height = loaderHeight();

    if(!path.current || !height) return

    path.current.setAttributeNS(null, "d",
    `M0 0
    L${width} 0
    L${width} ${height}
    Q${width/2} ${height - curve} 0 ${height}
    L0 0`
    )
  }

  const animate = (timestamp:number) => {
    
    if(start === undefined){
      start = timestamp
    }

    const elapsed = timestamp - start;

    if(!loader.current) return

    loader.current.style.top = easeOutQuad(elapsed, 0, -(loaderHeight() as number), duration) + "px";

    if(elapsed < duration){
      requestAnimationFrame(animate)
    }

    const newCurve = easeOutQuad(elapsed, initialCurve, -200, duration)
    setPath(newCurve);
  }

  const easeOutQuad = (time:number, start:number, end:number, duration:number) => {
    return -end * (time /= duration) * (time - 2) + start;
  }

  return (
      <div ref={loader} className={styles.loader}>
        <svg>
          <path ref={path}></path>
        </svg>
        <div className={styles.logo}>
          <Logo drawAnimation={activeLogoAnimation}/>
        </div>
      </div>
  );
}
