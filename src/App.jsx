import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import builtinTopics from './data/topics.json'
import { assignTopics } from './utils/deck.js'
import TopicSelectScreen from './components/TopicSelectScreen.jsx'
import SetupScreen from './components/SetupScreen.jsx'
import OpeningScreen from './components/OpeningScreen.jsx'
import ExchangeScreen from './components/ExchangeScreen.jsx'
import CinemaScreen from './components/CinemaScreen.jsx'

const STORAGE_KEY = 'icebreaking:customTopics'
const ACCENTS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6',
  '#f97316', '#ef4444', '#14b8a6', '#3b82f6', '#84cc16', '#d946ef',
]

// 사용자가 추가한 주제를 브라우저에 저장/복원
function loadCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function saveCustom(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* 저장 불가 환경 무시 */
  }
}
function makeId() {
  const c = globalThis.crypto
  if (c && typeof c.randomUUID === 'function') return 'custom-' + c.randomUUID()
  return 'custom-' + Math.floor(Math.random() * 1e9).toString(36)
}

export default function App() {
  const [customTopics, setCustomTopics] = useState(loadCustom)
  const allTopics = [...builtinTopics, ...customTopics]

  // 'topics' | 'setup' | 'opening' | 'reveal' | 'exchange'
  const [phase, setPhase] = useState('topics')
  const [config, setConfig] = useState({
    numGroups: 2,
    timerSeconds: 180,
    openingSeconds: 180,
    enabledIds: [...builtinTopics, ...customTopics].map((t) => t.id),
  })
  const [pool, setPool] = useState(allTopics) // 뽑기에 사용할 주제(선택된 것만)
  const [assignments, setAssignments] = useState([])

  const enabledIds = config.enabledIds

  // --- 주제 선택/추가/삭제 ---
  function toggleTopic(id) {
    setConfig((c) => ({
      ...c,
      enabledIds: c.enabledIds.includes(id)
        ? c.enabledIds.filter((x) => x !== id)
        : [...c.enabledIds, id],
    }))
  }
  function toggleAllTopics() {
    setConfig((c) => ({
      ...c,
      enabledIds:
        c.enabledIds.length === allTopics.length
          ? []
          : allTopics.map((t) => t.id),
    }))
  }
  function addTopic({ emoji, title, description }) {
    const t = {
      id: makeId(),
      emoji: emoji || '📝',
      title: title.trim(),
      description: (description || '').trim(),
      accent: ACCENTS[allTopics.length % ACCENTS.length],
      custom: true,
    }
    setCustomTopics((prev) => {
      const next = [...prev, t]
      saveCustom(next)
      return next
    })
    setConfig((c) => ({ ...c, enabledIds: [...c.enabledIds, t.id] }))
  }
  function removeTopic(id) {
    setCustomTopics((prev) => {
      const next = prev.filter((t) => t.id !== id)
      saveCustom(next)
      return next
    })
    setConfig((c) => ({ ...c, enabledIds: c.enabledIds.filter((x) => x !== id) }))
  }

  // 1단계 → 2단계
  function handleTopicsNext() {
    setConfig((c) => ({
      ...c,
      numGroups: Math.min(c.numGroups, Math.max(1, c.enabledIds.length)),
    }))
    setPhase('setup')
  }

  // 2단계: 설정 후 시작
  function handleStart(cfg) {
    const selected = allTopics.filter((t) => config.enabledIds.includes(t.id))
    setConfig((c) => ({ ...c, ...cfg }))
    setPool(selected)
    setAssignments(assignTopics(selected, cfg.numGroups))
    setPhase('opening')
  }

  function handleReshuffle() {
    setAssignments(assignTopics(pool, config.numGroups))
  }

  function handleRestart() {
    setAssignments([])
    setPhase('topics')
  }

  return (
    <div className="app">
      <div className="app__glow" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {phase === 'topics' && (
          <TopicSelectScreen
            key="topics"
            topics={allTopics}
            enabledIds={enabledIds}
            onToggle={toggleTopic}
            onToggleAll={toggleAllTopics}
            onAdd={addTopic}
            onRemove={removeTopic}
            onNext={handleTopicsNext}
          />
        )}
        {phase === 'setup' && (
          <SetupScreen
            key="setup"
            initialConfig={config}
            maxGroups={Math.max(1, enabledIds.length)}
            onStart={handleStart}
            onBack={() => setPhase('topics')}
          />
        )}
        {phase === 'opening' && (
          <OpeningScreen
            key="opening"
            perPersonSeconds={config.openingSeconds}
            onNext={() => setPhase('reveal')}
            onBack={() => setPhase('setup')}
          />
        )}
        {phase === 'reveal' && (
          <CinemaScreen
            key="reveal"
            assignments={assignments}
            timerSeconds={config.timerSeconds}
            onReshuffle={handleReshuffle}
            onNext={() => setPhase('exchange')}
            onRestart={handleRestart}
          />
        )}
        {phase === 'exchange' && (
          <ExchangeScreen
            key="exchange"
            onBack={() => setPhase('reveal')}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
