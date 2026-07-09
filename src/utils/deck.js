// Fisher-Yates 셔플 (원본 배열을 변경하지 않음)
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 조별로 주제를 배분한다.
 * - 조 개수가 주제 개수 이하이면 모든 조가 서로 다른 주제를 갖는다.
 * - 조 개수가 주제 개수를 초과하면 주제를 다시 섞어 재사용하되,
 *   최소한 인접한 조끼리는 같은 주제가 연달아 나오지 않도록 한다.
 *
 * @param {Array} topics  주제 목록
 * @param {number} numGroups  조 개수
 * @returns {Array} 길이가 numGroups인 주제 배열
 */
export function assignTopics(topics, numGroups) {
  const result = []
  let pool = []
  let prevId = null

  for (let g = 0; g < numGroups; g++) {
    if (pool.length === 0) {
      pool = shuffle(topics)
      // 새 사이클의 첫 주제가 직전 조의 주제와 겹치면 다른 카드와 교환
      if (prevId && pool.length > 1 && pool[0].id === prevId) {
        const swapIdx = 1 + Math.floor(Math.random() * (pool.length - 1))
        ;[pool[0], pool[swapIdx]] = [pool[swapIdx], pool[0]]
      }
    }
    const topic = pool.shift()
    result.push(topic)
    prevId = topic.id
  }

  return result
}
