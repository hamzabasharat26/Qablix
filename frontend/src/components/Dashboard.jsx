import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Check, AlertTriangle, TrendingUp, Calendar, Activity } from 'lucide-react'
import { useTheme } from '../App'

const HABITS = [
  { key: 'salah', label: 'Fard Salah', emoji: '🕌', points: 40, desc: 'Five daily prayers' },
  { key: 'quran', label: 'Quran Reading', emoji: '📖', points: 25, desc: 'Daily Quran recitation' },
  { key: 'dhikr', label: 'Dhikr', emoji: '📿', points: 20, desc: 'Remembrance of Allah' },
  { key: 'reflection', label: 'Reflection', emoji: '🤲', points: 15, desc: 'Self-reflection & journaling' },
]

function GradeRing({ score, grade, dark }) {
  const R = 48, C = 2 * Math.PI * R
  const off = C - (score / 100) * C
  const col = grade === 'A' ? '#22c55e' : grade === 'B' ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={R} fill="none" stroke={dark ? '#1e293b' : '#f1f5f9'} strokeWidth="7" />
        <motion.circle
          cx="56" cy="56" r={R} fill="none" stroke={col} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-3xl font-bold" style={{ color: col }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
          {grade}
        </motion.span>
        <span className={`text-[11px] font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{score}/100</span>
      </div>
    </div>
  )
}

/* ── Attractive Weekly Chart with 7-day padding ── */
function WeekChart({ logs, dark }) {
  // Build a 7-day array ending today, filling gaps with empty entries
  const days = []
  const logMap = {}
  logs.forEach(l => { logMap[l.date] = l })
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' })
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (logMap[key]) {
      days.push({ ...logMap[key], dayLabel, dateLabel, hasData: true })
    } else {
      days.push({ score: 0, grade: '-', dayLabel, dateLabel, date: key, hasData: false })
    }
  }

  const gridLines = [25, 50, 75, 100]

  return (
    <div>
      {/* Chart area */}
      <div className="relative" style={{ height: 180 }}>
        {/* Horizontal grid lines */}
        {gridLines.map(v => (
          <div key={v} className="absolute left-8 right-0 flex items-center" style={{ bottom: `${(v / 100) * 100}%` }}>
            <span className={`text-[9px] font-medium w-7 text-right mr-2 ${dark ? 'text-slate-600' : 'text-slate-300'}`}>{v}</span>
            <div className={`flex-1 border-t border-dashed ${dark ? 'border-slate-800' : 'border-slate-100'}`} />
          </div>
        ))}
        {/* Zero line */}
        <div className="absolute left-8 right-0 bottom-0 flex items-center">
          <span className={`text-[9px] font-medium w-7 text-right mr-2 ${dark ? 'text-slate-600' : 'text-slate-300'}`}>0</span>
          <div className={`flex-1 border-t ${dark ? 'border-slate-800' : 'border-slate-200'}`} />
        </div>

        {/* Bars */}
        <div className="absolute left-10 right-0 bottom-0 top-0 flex items-end justify-around gap-1">
          {days.map((d, i) => {
            const hPct = d.hasData ? Math.max((d.score / 100) * 100, 4) : 0
            const barGradient = d.grade === 'A'
              ? 'linear-gradient(to top, #059669, #34d399)'
              : d.grade === 'B'
                ? 'linear-gradient(to top, #d97706, #fbbf24)'
                : d.hasData
                  ? 'linear-gradient(to top, #dc2626, #f87171)'
                  : 'none'
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                {/* Tooltip */}
                {d.hasData && (
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10 shadow-lg ${
                    dark ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {d.score}pts · {d.grade}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${dark ? 'border-t-slate-700' : 'border-t-slate-800'}`} />
                  </div>
                )}

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: d.hasData ? `${hPct}%` : '2px' }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.25, 1, 0.5, 1] }}
                  className={`w-full rounded-t-md max-w-[32px] relative overflow-hidden cursor-pointer ${
                    !d.hasData ? (dark ? 'bg-slate-800' : 'bg-slate-100') : ''
                  }`}
                  style={d.hasData ? { background: barGradient } : {}}
                >
                  {/* Shine effect */}
                  {d.hasData && (
                    <div className="absolute inset-0 opacity-20" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                    }} />
                  )}
                </motion.div>

                {/* Score label */}
                {d.hasData && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className={`text-[9px] font-bold mt-1 ${
                      d.grade === 'A' ? 'text-emerald-500' : d.grade === 'B' ? 'text-amber-500' : 'text-red-400'
                    }`}>
                    {d.score}
                  </motion.span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Day labels */}
      <div className="flex items-center justify-around ml-10 mt-1 gap-1">
        {days.map((d, i) => {
          const isToday = i === 6
          return (
            <div key={i} className="flex-1 text-center">
              <span className={`text-[10px] font-semibold block ${
                isToday
                  ? dark ? 'text-emerald-400' : 'text-emerald-600'
                  : d.hasData
                    ? dark ? 'text-slate-300' : 'text-slate-600'
                    : dark ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {isToday ? 'Today' : d.dayLabel}
              </span>
              <span className={`text-[8px] ${dark ? 'text-slate-600' : 'text-slate-300'}`}>{d.dateLabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Stats Row ── */
function StatsRow({ data, dark }) {
  const logs = data?.weekly_logs || []
  const totalScore = logs.reduce((s, l) => s + (l.score || 0), 0)
  const avgScore = logs.length > 0 ? Math.round(totalScore / logs.length) : 0
  const streak = logs.filter(l => l.grade === 'A' || l.grade === 'B').length
  const bestGrade = logs.reduce((b, l) => {
    if (l.grade === 'A') return 'A'
    if (l.grade === 'B' && b !== 'A') return 'B'
    return b
  }, 'C')

  const stats = [
    { label: 'Average', value: `${avgScore}%`, color: dark ? 'text-emerald-400' : 'text-emerald-600', icon: Activity },
    { label: 'Best Grade', value: bestGrade, color: bestGrade === 'A' ? 'text-emerald-500' : bestGrade === 'B' ? 'text-amber-500' : 'text-red-400', icon: TrendingUp },
    { label: 'Active Days', value: `${streak}/7`, color: dark ? 'text-blue-400' : 'text-blue-600', icon: Calendar },
  ]

  const card = dark
    ? 'bg-slate-800/60 border border-slate-700/50 rounded-xl'
    : 'bg-white border border-slate-200 rounded-xl shadow-sm'

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.08 }}
          className={`${card} p-4 text-center`}>
          <s.icon className={`w-4 h-4 mx-auto mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
          <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          <p className={`text-[10px] font-medium ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{s.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { dark } = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [habits, setHabits] = useState({ salah: false, quran: false, dhikr: false, reflection: false })

  const fetch_ = async () => {
    try {
      const res = await axios.get('/api/dashboard/1')
      setData(res.data)
      if (res.data.today) {
        setHabits({ salah: res.data.today.salah, quran: res.data.today.quran, dhikr: res.data.today.dhikr, reflection: res.data.today.reflection })
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch_() }, [])

  const toggle = async (key) => {
    const next = { ...habits, [key]: !habits[key] }
    setHabits(next)
    try {
      const res = await axios.post('/api/habits', { user_id: 1, ...next })
      toast.success(`${res.data.grade} Grade — ${res.data.score} points!`, { icon: res.data.grade === 'A' ? '🌟' : res.data.grade === 'B' ? '💪' : '🤲' })
      fetch_()
    } catch { toast.error('Failed to save.') }
  }

  const card = dark
    ? 'bg-slate-800/60 border border-slate-700/50 rounded-xl'
    : 'bg-white border border-slate-200 rounded-xl shadow-sm'

  if (loading) {
    return (
      <div className={`min-h-screen py-12 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`${card} p-6`}>
              <div className={`h-5 w-32 rounded-md mb-4 animate-pulse ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className={`h-4 w-full rounded mb-2 animate-pulse ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className={`h-4 w-2/3 rounded animate-pulse ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const today = data?.today
  const score = today?.score || 0
  const grade = today?.grade || 'C'
  const adaptive = data?.adaptive_mode === 'simplified'

  return (
    <div className={`min-h-screen py-12 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontFamily: '"Playfair Display", serif' }}>
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track your spiritual habits and watch your growth.
          </p>
        </motion.div>

        {/* Adaptive Alert */}
        {adaptive && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${dark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
            <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${dark ? 'text-amber-400' : 'text-amber-600'}`} />
            <div>
              <h3 className={`text-sm font-semibold mb-0.5 ${dark ? 'text-amber-400' : 'text-amber-700'}`}>Simplified Mode</h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-amber-300/60' : 'text-amber-600/80'}`}>
                We noticed some tough days. Focus only on Fard Salah for now. Small, consistent steps matter.
              </p>
            </div>
          </motion.div>
        )}

        {/* Grade + Habits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className={`${card} p-6 text-center`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Today's Grade</h2>
            <GradeRing score={score} grade={grade} dark={dark} />
            <p className={`mt-4 text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              {grade === 'A' ? 'MashaAllah! Outstanding!' : grade === 'B' ? 'Good progress, keep going!' : 'Every step counts. Keep trying!'}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`${card} p-6`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Daily Habits</h2>
            <div className="space-y-2">
              {HABITS.map((h, i) => {
                const dis = adaptive && h.key !== 'salah'
                return (
                  <motion.button key={h.key} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                    onClick={() => !dis && toggle(h.key)} disabled={dis}
                    className={[
                      'w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left',
                      dis ? 'opacity-30 cursor-not-allowed' :
                      habits[h.key]
                        ? dark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200/60'
                        : dark ? 'hover:bg-slate-700/40 border border-transparent' : 'hover:bg-slate-50 border border-transparent',
                    ].join(' ')}>
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      habits[h.key] ? 'bg-emerald-500 border-emerald-500' : dark ? 'border-slate-600' : 'border-slate-300'
                    }`}>
                      <AnimatePresence>
                        {habits[h.key] && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </motion.div>}
                      </AnimatePresence>
                    </div>
                    <span className="text-lg shrink-0">{h.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${habits[h.key] ? (dark ? 'text-emerald-400' : 'text-emerald-700') : (dark ? 'text-slate-200' : 'text-slate-700')}`}>{h.label}</p>
                      <p className={`text-[11px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{h.desc}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${dark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{h.points}pt</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* ═══ Analytics Section ═══ */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* Stats Row */}
          <div className="mb-4">
            <StatsRow data={data} dark={dark} />
          </div>

          {/* Weekly Chart — always show */}
          <div className={`${card} p-6 mb-4`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Weekly Progress
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { label: 'A Grade', color: 'bg-emerald-500' },
                  { label: 'B Grade', color: 'bg-amber-400' },
                  { label: 'C Grade', color: 'bg-red-400' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${l.color}`} />
                    <span className={`text-[9px] font-medium ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <WeekChart logs={data?.weekly_logs || []} dark={dark} />
            {(!data?.weekly_logs || data.weekly_logs.length === 0) && (
              <p className={`text-center text-xs mt-4 ${dark ? 'text-slate-600' : 'text-slate-300'}`}>
                No habit data yet. Start tracking your habits above!
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Check-Ins */}
        {data?.recent_checkins?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Recent Check-Ins</h2>
            <div className="space-y-2">
              {data.recent_checkins.map((c, i) => {
                const em = { Calm: '😌', Stressed: '😰', Sad: '😢', Angry: '😠', Anxious: '😟', Grateful: '🤲', Hopeful: '🌟' }
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                    className={`${card} p-4`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{em[c.mood] || '😊'}</span>
                        <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-700'}`}>{c.mood}</span>
                        {c.inferred && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>AI</span>
                        )}
                      </div>
                      <span className={`text-[11px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {c.timestamp ? new Date(c.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    {c.guidance?.emotion_analysis && (
                      <p className={`text-xs leading-relaxed line-clamp-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{c.guidance.emotion_analysis}</p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
