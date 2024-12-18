'use client'

import { Image } from 'react-konva'
import { useEffect, useState } from 'react'

const iconSources = {
  start: '/icons/start-marker.png',
  end: '/icons/end-marker.png'
}

const ICON_SIZE = {
  start: 36,
  end: 36
};

export default function MapMarkers({
  markers,
  setMarkers,
  selectedTool,
  cellSize
}) {
  const [icons, setIcons] = useState({ start: null, end: null })

  useEffect(() => {
    const loadImage = (key, src) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        setIcons(prev => ({ ...prev, [key]: img }))
      }
    }
    loadImage('start', iconSources.start)
    loadImage('end', iconSources.end)
  }, [])

  const handleDragEnd = (e, type) => {
    const { x, y } = e.target.position()
    setMarkers(prev => ({ ...prev, [type]: { x, y } }))
  }

  const handleStageClick = (e) => {
    if (!selectedTool || (selectedTool !== 'start' && selectedTool !== 'end')) return
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    setMarkers(prev => ({ ...prev, [selectedTool]: { x: pos.x, y: pos.y } }))
  }

  // onClick Stage 바인딩은 MapCanvas 혹은 상위에서 제어 가능
  // 여기서는 마커 이동만 처리

  return (
    <>
      {markers.start && icons.start && (
        <Image
          image={icons.start}
          x={markers.start.x}
          y={markers.start.y}
          width={ICON_SIZE.start}
          height={ICON_SIZE.start}
          offsetX={ICON_SIZE.start / 2}
          offsetY={ICON_SIZE.start / 2}
          draggable={selectedTool === 'start'}
          onDragEnd={(e) => handleDragEnd(e, 'start')}
        />
      )}
      {markers.end && icons.end && (
        <Image
          image={icons.end}
          x={markers.end.x}
          y={markers.end.y}
          width={ICON_SIZE.end}
          height={ICON_SIZE.end}
          offsetX={ICON_SIZE.end / 2}
          offsetY={ICON_SIZE.end / 2}
          draggable={selectedTool === 'end'}
          onDragEnd={(e) => handleDragEnd(e, 'end')}
        />
      )}
    </>
  )
}
