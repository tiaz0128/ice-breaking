import { useState, useEffect, useRef } from 'react'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// 외부 에셋 없이 Web Audio로 알람음(삐- 3번) 재생
function playAlarm() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const now = ctx.currentTime
    ;[0, 0.28, 0.56].forEach((t) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, now + t)
      gain.gain.exponentialRampToValueAtTime(0.35, now + t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.22)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + t)
      osc.stop(now + t + 0.24)
    })
    setTimeout(() => ctx.close(), 1500)
  } catch (e) {
    /* 무음 환경 무시 */
  }
}

export default function Timer({
  seconds,
  autoStart = false,
  loop = false,
  size = 160,
  onCycle,
}) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(autoStart)
  const [cycles, setCycles] = useState(0) // 완료(0초 도달) 횟수 — 알람 트리거
  const intervalRef = useRef(null)
  const seededRef = useRef(seconds)

  // seconds가 실제로 바뀔 때만 초기화 (StrictMode 이중 실행 시 autoStart 유지)
  useEffect(() => {
    if (seededRef.current === seconds) return
    seededRef.current = seconds
    setRemaining(seconds)
    setRunning(false)
    setCycles(0)
  }, [seconds])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setCycles((c) => c + 1)
          return loop ? seconds : 0 // 반복이면 다시 채우고 계속
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, loop, seconds])

  // 반복이 아니면 0초에서 정지
  useEffect(() => {
    if (!loop && remaining === 0) setRunning(false)
  }, [remaining, loop])

  // 한 사이클이 끝날 때마다 알람 + 콜백
  const onCycleRef = useRef(onCycle)
  onCycleRef.current = onCycle
  useEffect(() => {
    if (cycles > 0) {
      playAlarm()
      onCycleRef.current?.()
    }
  }, [cycles])

  const mm = Math.floor(remaining / 60)
  const ss = remaining % 60
  const done = !loop && remaining === 0
  const low = remaining <= 10 && remaining > 0
  const offset = seconds > 0 ? CIRCUMFERENCE * (1 - remaining / seconds) : 0

  const started = remaining < seconds && remaining > 0
  const startLabel = running ? '⏸ 일시정지' : started ? '▶ 계속' : '▶ 시작'

  const toggle = () => {
    if (!done) setRunning((v) => !v)
  }
  const reset = () => {
    setRunning(false)
    setRemaining(seconds)
  }

  return (
    <div className={'timer' + (done ? ' timer--done' : '') + (low ? ' timer--low' : '')}>
      <div className="timer__ring" style={{ width: size, height: size }}>
        <svg className="timer__svg" viewBox="0 0 120 120">
          <circle className="timer__track" cx="60" cy="60" r={RADIUS} />
          <circle
            className="timer__progress"
            cx="60"
            cy="60"
            r={RADIUS}
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: offset }}
          />
        </svg>
        <div className="timer__center">
          {done ? '⏰' : `${mm}:${String(ss).padStart(2, '0')}`}
        </div>
      </div>
      <div className="timer__actions">
        <button className="btn btn--ghost" onClick={toggle} disabled={done}>
          {startLabel}
        </button>
        <button className="btn btn--ghost" onClick={reset}>
          ↺ 리셋
        </button>
      </div>
    </div>
  )
}
