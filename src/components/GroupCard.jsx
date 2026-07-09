import { motion } from 'framer-motion'

// 조별 주제 카드 — 그리드에서 한 번에 뒤집히며 등장한다.
export default function GroupCard({ groupNumber, topic, index }) {
  return (
    <motion.div
      className="group-card"
      style={{ '--accent': topic.accent }}
      initial={{ rotateY: 90, opacity: 0, y: 24 }}
      animate={{ rotateY: 0, opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.12,
        type: 'spring',
        stiffness: 150,
        damping: 16,
      }}
    >
      <div className="group-card__badge">조 {groupNumber}</div>
      <div className="group-card__emoji">{topic.emoji}</div>
      <h3 className="group-card__title">{topic.title}</h3>
      <p className="group-card__desc">{topic.description}</p>
    </motion.div>
  )
}
