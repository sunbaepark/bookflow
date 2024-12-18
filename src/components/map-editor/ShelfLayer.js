'use client'

import { Group, Image, Text } from 'react-konva'
import { ICON_SIZE, iconSources } from './constants'

export default function ShelfLayer({
  shelves,
  setShelves,
  selectedTool,
  selectedShelf,
  setSelectedShelf,
  cellSize
}) {
  return (
    <>
      {shelves.map(shelf => (
        <Group
          key={shelf.id}
          x={shelf.x}
          y={shelf.y}
          draggable={selectedTool === 'shelf'}
          onDragEnd={(e) => {
            setShelves(shelves.map(s => 
              s.id === shelf.id 
                ? { ...s, x: e.target.x(), y: e.target.y() }
                : s
            ))
          }}
          onClick={() => {
            if (selectedTool === 'shelf') {
              setSelectedShelf(shelf.id)
              setShelves(shelves.map(s => ({
                ...s,
                isSelected: s.id === shelf.id
              })))
            }
          }}
        >
          <Image
            image={shelf.isSelected ? iconSources.selectedShelf : iconSources.shelf}
            width={ICON_SIZE.shelf}
            height={ICON_SIZE.shelf}
            offsetX={ICON_SIZE.shelf / 2}
            offsetY={ICON_SIZE.shelf / 2}
            opacity={selectedTool === 'shelf' ? 1 : 0.6}
          />
          <Text
            text={shelf.number.toString()}
            fontSize={16}
            fill="white"
            width={ICON_SIZE.shelf}
            height={ICON_SIZE.shelf}
            offsetX={ICON_SIZE.shelf / 2}
            offsetY={ICON_SIZE.shelf / 2}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      ))}
    </>
  )
} 