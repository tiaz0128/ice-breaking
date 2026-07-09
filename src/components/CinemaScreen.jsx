import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Timer from './Timer.jsx'
import GroupCard from './GroupCard.jsx'

export default function CinemaScreen({
  assignments,
  timerSeconds,
  onReshuffle,
  onNext,
  onRestart,
}) {
  const [stage, setStage] = useState('ready') // 'ready' | 'shuffling' | 'revealed'
  const [round, setRound] = useState(0)
  const [showEnd, setShowEnd] = useState(false) // 토론 종료 시네마 뷰
  const timeoutRef = useRef(null)
  const endTimeoutRef = useRef(null)

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current)
      clearTimeout(endTimeoutRef.current)
    },
    []
  )

  function runShuffle() {
    setStage('shuffling')
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setStage('revealed'), 1100)
  }

  function handleDraw() {
    runShuffle()
  }

  // 다시 섞어서 뽑기 — 새 랜덤 배정 후 곧바로 셔플→공개
  function handleReshuffle() {
    onReshuffle()
    setRound((r) => r + 1)
    runShuffle()
  }

  // 토론 타이머 종료 → 시네마 뷰 → 곧바로 다음 주제 배정 + 타이머 재시작
  function handleTimerEnd() {
    setShowEnd(true)
    clearTimeout(endTimeoutRef.current)
    endTimeoutRef.current = setTimeout(() => {
      onReshuffle()
      setRound((r) => r + 1)
      setShowEnd(false)
    }, 2400)
  }

  const backCount = Math.min(Math.max(assignments.length, 5), 9)
  const mid = (backCount - 1) / 2
  const revealed = stage === 'revealed'

  return (
    <motion.section
      className={'screen cinema' + (revealed ? ' cinema--wide' : '')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="cinema__topbar">
        <span className="cinema__group">🎬 조별 주제</span>
        <span className="cinema__count">{assignments.length}개 조</span>
      </header>

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="deck-stage"
            className="stage"
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <div className="deck">
              {Array.from({ length: backCount }).map((_, i) => {
                const spread = i - mid
                const fan = {
                  x: spread * 30,
                  y: Math.abs(spread) * 7,
                  rotate: spread * 7,
                  scale: 1,
                }
                const shuffling = {
                  x: [spread * 30, i % 2 === 0 ? 150 : -150, spread * 30],
                  y: [Math.abs(spread) * 7, -55 + ((i * 13) % 45), Math.abs(spread) * 7],
                  rotate: [spread * 7, i % 2 === 0 ? 28 : -28, spread * 7],
                  transition: { duration: 1.0, ease: 'easeInOut' },
                }
                return (
                  <motion.div
                    key={i}
                    className="card card--back"
                    style={{ zIndex: i }}
                    initial={fan}
                    animate={stage === 'shuffling' ? shuffling : fan}
                  >
                    <div className="card__pattern">🧊</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key={`grid-${round}`} className="reveal-area">
            <div className="group-grid">
              {assignments.map((topic, i) => (
                <GroupCard
                  key={i}
                  groupNumber={i + 1}
                  topic={topic}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="cinema__controls">
        {stage === 'ready' && (
          <button className="btn btn--primary btn--lg" onClick={handleDraw}>
            🎴 카드 섞고 뽑기
          </button>
        )}
        {stage === 'shuffling' && (
          <button className="btn btn--primary btn--lg" disabled>
            <span className="dots">섞는 중</span>
          </button>
        )}
        {revealed && (
          <motion.div
            className="cinema__revealed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + assignments.length * 0.12 }}
          >
            <div className="cinema__timer">
              <p className="cinema__timer-label">⏱️ 토론 타이머 · 이야기를 나눠보세요</p>
              <Timer
                key={round}
                seconds={timerSeconds}
                autoStart
                size={170}
                onCycle={handleTimerEnd}
              />
            </div>
            <div className="cinema__buttons">
              <button className="btn btn--primary btn--lg" onClick={handleReshuffle}>
                🔀 다시 섞어서 뽑기
              </button>
              <button className="btn btn--primary btn--lg" onClick={onNext}>
                명함·링크드인 교환 →
              </button>
              <button className="btn btn--ghost" onClick={onRestart}>
                ↺ 처음으로
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 토론 종료 → 다음 주제 시네마 뷰 */}
      <AnimatePresence>
        {showEnd && (
          <motion.div
            className="cine-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="cine-overlay__icon"
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: [0.4, 1.2, 1], rotate: [-20, 10, 0] }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              ⏰
            </motion.div>
            <motion.p
              className="cine-overlay__text"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
            >
              토론 종료!
            </motion.p>
            <motion.p
              className="cine-overlay__sub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              🔀 다음 주제를 뽑는 중…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
