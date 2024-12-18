'use client'
import { useEffect, useRef, useState } from 'react'
import Typed from 'typed.js'

function Title() {
  const el = useRef(null)
  const [isIntroComplete, setIsIntroComplete] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const typedRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'auto'
    setIsIntroComplete(true)

    const navbar = document.querySelector('.navbar')
    const cartButton = document.querySelector('.cart-button')

    if (navbar) {
      navbar.style.visibility = 'visible'
      navbar.style.opacity = '1'
      navbar.style.pointerEvents = 'auto'
      navbar.style.zIndex = '50'
    }
    if (cartButton) {
      cartButton.style.visibility = 'visible'
      cartButton.style.opacity = '1'
      cartButton.style.pointerEvents = 'auto'
    }
  }, [])

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] transition-all duration-1000 
        ${showOverlay ? 'bg-black' : 'bg-white'}`}
        style={{
          opacity: isIntroComplete ? 0 : 1,
          pointerEvents: isIntroComplete ? 'none' : 'auto'
        }}
      >
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">
            BookFlow
          </h1>
        </div>
      </div>
    </>
  )
}

export default Title
