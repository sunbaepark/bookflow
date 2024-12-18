'use client'

import { Image } from 'react-konva'
import { useEffect, useState } from 'react'

const ICON_SIZE = 36

const iconSources = {
  start: '/icons/start-marker.png',
  end: '/icons/end-marker.png'
}

export default function MapMarkers({ markers, setMarkers, selectedTool, cellSize }) {
  const [icons, setIcons] = useState({
    start: { image: null, loaded: false },
    end: { image: null, loaded: false }
  })

  useEffect(() => {
    // 아이콘 이미지 로드
    Object.entries(iconSources).forEach(([key, src]) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        setIcons(prev => ({
          ...prev,
          [key]: { image: img, loaded: true }
        }))
      }
    })
  }, [])

  const handleDragEnd = (e, type) => {
    if (selectedTool !== type) return

    const pos = e.target.position()
    setMarkers(prev => ({
      ...prev,
      [type]: { x: pos.x, y: pos.y }
    }))
  }

  return (
    <>
      {markers.start && icons.start.loaded && (
        <Image
          image={icons.start.image}
          x={markers.start.x}
          y={markers.start.y}
          offsetX={ICON_SIZE / 2}
          offsetY={ICON_SIZE / 2}
          width={ICON_SIZE}
          height={ICON_SIZE}
          draggable={selectedTool === 'start'}
          onDragEnd={(e) => handleDragEnd(e, 'start')}
        />
      )}
      {markers.end && icons.end.loaded && (
        <Image
          image={icons.end.image}
          x={markers.end.x}
          y={markers.end.y}
          offsetX={ICON_SIZE / 2}
          offsetY={ICON_SIZE / 2}
          width={ICON_SIZE}
          height={ICON_SIZE}
          draggable={selectedTool === 'end'}
          onDragEnd={(e) => handleDragEnd(e, 'end')}
        />
      )}
    </>
  )
} 