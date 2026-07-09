import { useState } from 'react'
import { motion } from 'framer-motion'

const TIMER_PRESETS = [
  { label: '1분', seconds: 60 },
  { label: '2분', seconds: 120 },
  { label: '3분', seconds: 180 },
  { label: '5분', seconds: 300 },
]

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// 프리셋 + 슬라이더로 시간을 고르는 재사용 컨트롤
function TimerPicker({ label, value, onChange }) {
  return (
    <div className="field">
      <label className="field__label">
        {label} <span className="field__hint">현재 {formatTime(value)}</span>
      </label>
      <div className="presets">
        {TIMER_PRESETS.map((p) => (
          <button
            key={p.seconds}
            type="button"
            className={'chip' + (value === p.seconds ? ' chip--active' : '')}
            onClick={() => onChange(p.seconds)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="slider">
        <input
          type="range"
          min="30"
          max="600"
          step="30"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />
      </div>
    </div>
  )
}

export default function SetupScreen({ initialConfig, maxGroups, onStart, onBack }) {
  const clampGroups = (n) => Math.max(1, Math.min(maxGroups, n))

  const [numGroups, setNumGroups] = useState(clampGroups(initialConfig.numGroups))
  const [timerSeconds, setTimerSeconds] = useState(initialConfig.timerSeconds)
  const [openingSeconds, setOpeningSeconds] = useState(initialConfig.openingSeconds)

  function handleSubmit(e) {
    e.preventDefault()
    onStart({ numGroups: clampGroups(numGroups), timerSeconds, openingSeconds })
  }

  return (
    <motion.section
      className="screen setup"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="setup__header">
        <motion.div
          className="setup__logo"
          initial={{ scale: 0.7, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          ⚙️
        </motion.div>
        <h1 className="setup__title">조 · 타이머 설정</h1>
        <p className="setup__subtitle">조 개수와 진행 시간을 정해주세요.</p>
      </header>

      <form className="panel" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label">
            조는 몇 개인가요?
            <span className="field__hint">최대 {maxGroups}조</span>
          </label>
          <div className="stepper">
            <button
              type="button"
              className="stepper__btn"
              onClick={() => setNumGroups((n) => clampGroups(n - 1))}
              aria-label="조 줄이기"
            >
              −
            </button>
            <input
              className="stepper__value"
              type="number"
              min="1"
              max={maxGroups}
              value={numGroups}
              onChange={(e) =>
                setNumGroups(clampGroups(parseInt(e.target.value, 10) || 1))
              }
            />
            <button
              type="button"
              className="stepper__btn"
              onClick={() => setNumGroups((n) => clampGroups(n + 1))}
              aria-label="조 늘리기"
            >
              +
            </button>
          </div>
          <p className="hint-line">
            🃏 조마다 서로 다른 주제가 배정돼요 (선택한 주제 {maxGroups}개 = 최대 {maxGroups}조)
          </p>
        </div>

        <TimerPicker
          label="🙋 자기소개 · 1명당 시간"
          value={openingSeconds}
          onChange={setOpeningSeconds}
        />

        <TimerPicker
          label="💬 주제별 토론 타이머"
          value={timerSeconds}
          onChange={setTimerSeconds}
        />

        <div className="setup__actions">
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            ← 주제 선택
          </button>
          <button type="submit" className="btn btn--primary btn--lg">
            🎬 시작하기
          </button>
        </div>
      </form>
    </motion.section>
  )
}
