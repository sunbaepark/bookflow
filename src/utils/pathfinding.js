// 1. 모든 지점 간의 최단 경로를 A* 알고리즘으로 계산
function calculateAllPaths(mapData, shelves) {
  const distances = new Map();
  const paths = new Map();
  const points = [
    { type: 'start', ...mapData.start },
    ...shelves.map(shelf => ({ type: 'shelf', id: shelf.id, x: shelf.x, y: shelf.y })),
    { type: 'end', ...mapData.end }
  ];

  // 모든 지점 쌍에 대해 A* 알고리즘으로 경로 계산
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const path = findPath(mapData, points[i], points[j]);
      if (path) {
        const key = `${points[i].type}${points[i].id || ''}-${points[j].type}${points[j].id || ''}`;
        distances.set(key, path.length);
        paths.set(key, path);
      }
    }
  }

  return { distances, paths };
}

// 2. Nearest Neighbor 알고리즘으로 방문 순서 결정
function findVisitOrder(distances, shelves, start, end) {
  const unvisited = new Set(shelves.map(s => s.id));
  const order = [];
  let current = 'start';

  while (unvisited.size > 0) {
    let nearest = null;
    let minDistance = Infinity;

    for (const shelfId of unvisited) {
      const distance = distances.get(`${current}-shelf${shelfId}`);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = shelfId;
      }
    }

    order.push(nearest);
    unvisited.delete(nearest);
    current = `shelf${nearest}`;
  }

  return order;
}

// 3. 최종 경로 생성
export function findOptimalRoute(mapData, shelves) {
  // 모든 지점 간의 경로 계산
  const { distances, paths } = calculateAllPaths(mapData, shelves);
  
  // 방문 순서 결정
  const visitOrder = findVisitOrder(distances, shelves, mapData.start, mapData.end);
  
  // 최종 경로 조합
  const finalPath = [];
  let current = 'start';
  
  for (const shelfId of visitOrder) {
    const pathKey = `${current}-shelf${shelfId}`;
    const path = paths.get(pathKey);
    finalPath.push(...path);
    current = `shelf${shelfId}`;
  }
  
  // 마지막 책장에서 도착점까지
  const lastPath = paths.get(`${current}-end`);
  finalPath.push(...lastPath);

  return {
    visitOrder,
    path: finalPath
  };
} 