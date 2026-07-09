import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Timer from './Timer.jsx'
import opening from '../data/opening.json'

function formatMinLabel(seconds) {
  if (seconds % 60 === 0) return `${seconds / 60}분`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}

export default function OpeningScreen({ perPersonSeconds, onNext, onBack }) {
  const [showToss, setShowToss] = useState(false)
  const tossTimeout = useRef(null)

  useEffect(() => () => clearTimeout(tossTimeout.current), [])

  // 타이머 한 사이클(1명 종료)마다 "다음 사람에게 공 던지기" 시네마 뷰
  function handleCycle() {
    setShowToss(true)
    clearTimeout(tossTimeout.current)
    tossTimeout.current = setTimeout(() => setShowToss(false), 2800)
  }

  return (
    <motion.section
      className="screen opening"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="opening__header">
        <h1 className="opening__title">🏀 자기소개 타임</h1>
        <div className="opening__rulebar">공을 던져서 받은 사람부터 시작!</div>
      </header>

      {/* 질문 — 상단, 좌우 배치 */}
      <div className="opening__questions">
        {opening.questions.map((q, i) => (
          <motion.div
            className="q-big"
            key={q.no}
            style={{ '--accent': q.accent }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
          >
            <span className="q-big__label">질문 {q.no}</span>
            <span className="q-big__emoji">{q.emoji}</span>
            <p className="q-big__text">{q.text}</p>
          </motion.div>
        ))}
      </div>

      {/* 타이머 — 질문 아래 */}
      <div className="opening__timer">
        <Timer
          seconds={perPersonSeconds}
          loop
          size={150}
          onCycle={handleCycle}
        />
        <p className="hint-line">
          ⏱️ 1명당 {formatMinLabel(perPersonSeconds)} · 끝나면 다음 사람에게 공을 넘겨요
        </p>
      </div>

      <div className="opening__actions">
        <button className="btn btn--ghost" onClick={onBack}>
          ← 설정
        </button>
        <button className="btn btn--primary btn--lg" onClick={onNext}>
          주제 뽑으러 가기 →
        </button>
      </div>

      {/* 공 던지기 시네마 뷰 */}
      <AnimatePresence>
        {showToss && (
          <motion.div
            className="toss"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="toss__ball"
              initial={{ x: '-42vw', y: -40, rotate: -180, scale: 0.7 }}
              animate={{ x: '42vw', y: [-40, -160, -40], rotate: 360, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
            >
              🏀
            </motion.div>
            <motion.p
              className="toss__text"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
            >
              다음 사람에게<br />공을 던지세요!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
