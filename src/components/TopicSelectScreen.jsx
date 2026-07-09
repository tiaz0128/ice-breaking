import { useState } from 'react'
import { motion } from 'framer-motion'

const EMOJI_CHOICES = ['📝', '💬', '🎯', '🔥', '💡', '🎲', '🌟', '🧩', '🎤', '📌', '❓', '🍀']

export default function TopicSelectScreen({
  topics,
  enabledIds,
  onToggle,
  onToggleAll,
  onAdd,
  onRemove,
  onNext,
}) {
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('📝')

  const enabledCount = enabledIds.length
  const allOn = enabledCount === topics.length && topics.length > 0
  const isOn = (id) => enabledIds.includes(id)

  function submitAdd(e) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    onAdd({ emoji, title: t })
    setTitle('')
    setEmoji('📝')
  }

  return (
    <motion.section
      className="screen topics-select"
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
          🃏
        </motion.div>
        <h1 className="setup__title">뽑기 주제 선택</h1>
        <p className="setup__subtitle">사용할 주제를 고르거나, 직접 추가해 보세요.</p>
      </header>

      <div className="panel">
        <div className="select-bar">
          <span className="select-bar__count">
            {enabledCount}/{topics.length} 선택
          </span>
          <button type="button" className="chip" onClick={onToggleAll}>
            {allOn ? '전체 해제' : '전체 선택'}
          </button>
        </div>

        <div className="topic-toggles">
          {topics.map((t) => (
            <div
              className={'topic-toggle-wrap' + (t.custom ? ' has-remove' : '')}
              key={t.id}
            >
              <button
                type="button"
                className={'topic-toggle' + (isOn(t.id) ? ' is-on' : '')}
                style={{ '--accent': t.accent }}
                onClick={() => onToggle(t.id)}
                aria-pressed={isOn(t.id)}
              >
                <span className="topic-toggle__mark">{isOn(t.id) ? '✓' : '＋'}</span>
                <span className="topic-toggle__emoji">{t.emoji}</span>
                <span className="topic-toggle__title">{t.title}</span>
              </button>
              {t.custom && (
                <button
                  type="button"
                  className="topic-remove"
                  onClick={() => onRemove(t.id)}
                  aria-label={`${t.title} 삭제`}
                  title="삭제"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <form className="add-topic" onSubmit={submitAdd}>
          <select
            className="add-topic__emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            aria-label="이모지 선택"
          >
            {EMOJI_CHOICES.map((em) => (
              <option key={em} value={em}>
                {em}
              </option>
            ))}
          </select>
          <input
            className="add-topic__input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="새 주제를 입력해 추가하세요"
            maxLength={40}
          />
          <button
            type="submit"
            className="btn btn--ghost add-topic__btn"
            disabled={!title.trim()}
          >
            ➕ 추가
          </button>
        </form>

        {enabledCount === 0 && (
          <p className="notice">⚠️ 최소 1개 이상의 주제를 선택해 주세요.</p>
        )}

        <button
          type="button"
          className="btn btn--primary btn--block btn--lg"
          disabled={enabledCount === 0}
          onClick={onNext}
        >
          다음: 조·타이머 설정 →
        </button>
      </div>
    </motion.section>
  )
}
