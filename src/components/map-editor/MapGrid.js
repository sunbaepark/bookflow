'use client'

import { Group, Line, Rect } from 'react-konva'

const MIN_CELL_SIZE = 20
const MAX_CELL_SIZE = 40
const DEFAULT_CELL_SIZE = 30

export default function MapGrid({ 
  selectedTool, 
  mapData,
  gridData,
  onMouseDown,
  onMouseEnter 
}) {
  const dimensions = mapData?.dimensions || { width: 800, height: 600 }
  const width = dimensions.width
  const height = dimensions.height

  const calculateCellSize = () => {
    let cellSize = DEFAULT_CELL_SIZE
    if (width / DEFAULT_CELL_SIZE < 15 || height / DEFAULT_CELL_SIZE < 15) {
      cellSize = MIN_CELL_SIZE
    } else if (width / DEFAULT_CELL_SIZE > 40 || height / DEFAULT_CELL_SIZE > 40) {
      cellSize = MAX_CELL_SIZE
    }
    return cellSize
  }

  const cellSize = calculateCellSize()
  const cols = Math.floor(width / cellSize)
  const rows = Math.floor(height / cellSize)

  if (selectedTool !== 'wall') {
    return null
  }

  return (
    <Group>
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <Line
          key={`v${i}`}
          points={[i * cellSize, 0, i * cellSize, height]}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <Line
          key={`h${i}`}
          points={[0, i * cellSize, width, i * cellSize]}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={1}
        />
      ))}

      {gridData.map((row, i) => 
        row.map((cell, j) => (
          <Rect
            key={`cell-${i}-${j}`}
            x={j * cellSize}
            y={i * cellSize}
            width={cellSize}
            height={cellSize}
            fill={cell === 'wall' ? 'rgba(0,0,0,0.3)' : 'transparent'}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={1}
            onMouseDown={(e) => onMouseDown(e, i, j)}
            onMouseEnter={(e) => onMouseEnter(e, i, j)}
          />
        ))
      )}
    </Group>
  )
}
