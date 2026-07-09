import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import exchange from '../data/exchange.json'

export default function ExchangeScreen({ onBack, onRestart }) {
  // 영상 파일이 있는지 확인 — 있으면 플레이어, 없으면 자리 표시
  const [hasVideo, setHasVideo] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(exchange.videoSrc, { method: 'HEAD' })
      .then((r) => {
        const ct = r.headers.get('content-type') || ''
        if (alive) setHasVideo(r.ok && ct.startsWith('video'))
      })
      .catch(() => alive && setHasVideo(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <motion.section
      className="screen exchange"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="exchange__header">
        <motion.div
          className="exchange__icon"
          initial={{ scale: 0.7, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          🤝
        </motion.div>
        <h1 className="exchange__title">{exchange.title}</h1>
        <p className="exchange__subtitle">{exchange.subtitle}</p>
      </header>

      <div className="exchange__steps">
        {exchange.steps.map((s) => (
          <div className="rule" key={s.text}>
            <span className="rule__emoji">{s.emoji}</span>
            <span className="rule__text">{s.text}</span>
          </div>
        ))}
      </div>

      <div className="exchange__video">
        <p className="exchange__video-label">🎬 {exchange.videoLabel}</p>
        {hasVideo ? (
          <video
            className="exchange__player"
            src={exchange.videoSrc}
            controls
            playsInline
            loop
            autoPlay
            muted
          />
        ) : (
          <div className="video-placeholder">
            <div className="video-placeholder__icon">🎥</div>
            <p className="video-placeholder__title">여기에 안내 영상이 들어갑니다</p>
            <p className="video-placeholder__path">
              <code>public{exchange.videoSrc}</code> 에 영상을 넣어주세요
            </p>
          </div>
        )}
      </div>

      <div className="exchange__actions">
        <button className="btn btn--ghost" onClick={onBack}>
          ← 주제 카드
        </button>
        <button className="btn btn--primary btn--lg" onClick={onRestart}>
          ↺ 처음으로
        </button>
      </div>
    </motion.section>
  )
}
