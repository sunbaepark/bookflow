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

  return (
    <div 
      className="w-full h-[calc(100vh-88px)] bg-gray-100 overflow-auto" 
      ref={containerRef}
    >
      <div className="min-w-fit min-h-fit inline-block">
        <Stage 
          width={dimensions.width} 
          height={dimensions.height}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* 배경 이미지 레이어: 이벤트 비청취 */}
          <Layer listening={false}>
            {imageObj && (
              <Image
                image={imageObj}
                width={dimensions.width}
                height={dimensions.height}
                opacity={selectedTool === 'wall' ? 0.5 : 1}
              />
            )}
          </Layer>

          {/* 마커, 책장 레이어 */}
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

          {/* 그리드 레이어 - 최상단에 배치 */}
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
