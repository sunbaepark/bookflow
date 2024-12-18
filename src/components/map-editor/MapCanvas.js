'use client'

import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import MapGrid from './MapGrid'
import MapMarkers from './MapMarkers'
import ShelfLayer from './ShelfLayer'

export default function MapCanvas({
  mapData,
  selectedTool,
  markers,
  setMarkers,
  shelves,
  setShelves,
  selectedShelf,
  setSelectedShelf,
  library,
  onMouseUp,
  gridData,
  handleMouseDown,
  handleMouseEnter,
  dimensions
}) {
  const [imageObj, setImageObj] = useState(null)
  const containerRef = useRef(null)

  const calculateDimensions = (image) => {
    if (!image) return { width: 800, height: 600 }
    let { width, height } = dimensions
    // dimensions는 이미 MapEditor에서 정해줌. 필요시 추가 로직
    return { width, height }
  }

  useEffect(() => {
    if (library?.image) {
      const image = new window.Image()
      image.src = library.image
      image.onload = () => {
        setImageObj(image)
      }
      image.onerror = (e) => {
        console.error('이미지 로드 실패:', e)
      }
    }
  }, [library])

  const stageDimensions = calculateDimensions(imageObj)

  return (
    <div 
      className="w-full h-[calc(100vh-88px)] bg-gray-100 overflow-auto" 
      ref={containerRef}
    >
      <div className="min-w-fit min-h-fit inline-block">
        <Stage 
          width={stageDimensions.width} 
          height={stageDimensions.height}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* 배경 이미지 레이어 (이벤트 비청취) */}
          <Layer listening={false}>
            {imageObj && (
              <Image
                image={imageObj}
                width={stageDimensions.width}
                height={stageDimensions.height}
                opacity={selectedTool === 'wall' ? 0.5 : 1}
              />
            )}
          </Layer>
          {/* 마커와 책장 레이어 */}
          <Layer>
            <MapMarkers
              markers={markers}
              setMarkers={setMarkers}
              selectedTool={selectedTool}
              cellSize={30}
            />
            <ShelfLayer
              shelves={Array.isArray(shelves) ? shelves : []}
              setShelves={setShelves}
              selectedTool={selectedTool}
              selectedShelf={selectedShelf}
              setSelectedShelf={setSelectedShelf}
              cellSize={30}
            />
          </Layer>
          {/* 그리드 레이어 (마우스 이벤트 받기 위하여 최상단) */}
          <Layer>
            {selectedTool === 'wall' && (
              <MapGrid
                selectedTool={selectedTool}
                mapData={mapData}
                gridData={gridData}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
