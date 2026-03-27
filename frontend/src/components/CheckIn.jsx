import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Sparkles, PenLine, Loader2 } from 'lucide-react'
import { useTheme } from '../App'
import GuidanceCard from './GuidanceCard'

const MOODS = [
  { label: 'Calm', emoji: '😌' },
  { label: 'Stressed', emoji: '😰' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Angry', emoji: '😠' },
  { label: 'Anxious', emoji: '😟' },
  { label: 'Grateful', emoji: '🤲' },
  { label: 'Hopeful', emoji: '🌟' },
]

export default function CheckIn() {
  const { dark } = useTheme()
  const [mode, setMode] = useState('direct')
  const [selectedMood, setSelectedMood] = useState(null)
  const [stress, setStress] = useState(5)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [guidance, setGuidance] = useState(null)
  const [error, setError] = useState(null)

  const submit = async () => {
    setLoading(true); setError(null); setGuidance(null)
    try {
      const payload = { user_id: 1, stress_level: stress }
      if (mode === 'direct') {
        if (!selectedMood) { setError('Please select a mood first.'); setLoading(false); return }
        payload.mood = selectedMood
      } else {
        if (!text.trim()) { setError('Please share what\'s on your mind.'); setLoading(false); return }
        payload.free_text = text
      }
      const res = await axios.post('/api/checkin', payload)
      setGuidance(res.data)
    } catch (err) { setError(err?.response?.data?.detail || 'Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const reset = () => { setGuidance(null); setSelectedMood(null); setText(''); setStress(5); setError(null) }

  const cardCls = dark
    ? 'bg-slate-800/60 border border-slate-700/50 rounded-xl'
    : 'bg-white border border-slate-200 rounded-xl shadow-sm'

  return (
    <div className={`min-h-screen py-12 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontFamily: '"Playfair Display", serif' }}>
            Check-In Your <span className="gradient-text">Qalb</span>
          </h1>
          <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Reflect on your emotional state. Let Qalbix guide you.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!guidance ? (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="space-y-4">
              {/* Mode Toggle */}
              <div className={`flex rounded-lg p-1 ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                {[
                  { k: 'direct', l: 'Select Mood', I: Sparkles },
                  { k: 'text', l: 'Express Freely', I: PenLine },
                ].map(({ k, l, I }) => (
                  <button key={k} onClick={() => setMode(k)}
                    className={[
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all',
                      mode === k
                        ? 'bg-emerald-600 text-white shadow-md'
                        : dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700',
                    ].join(' ')}>
                    <I className="w-4 h-4" /> {l}
                  </button>
                ))}
              </div>

              {/* Input Card */}
              <div className={`${cardCls} p-5`}>
                <AnimatePresence mode="wait">
                  {mode === 'direct' ? (
                    <motion.div key="moods" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        How are you feeling?
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {MOODS.map(m => (
                          <button key={m.label} onClick={() => setSelectedMood(m.label)}
                            className={[
                              'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                              selectedMood === m.label
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                                : dark ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600' : 'border-slate-200 bg-slate-50 hover:border-slate-300',
                            ].join(' ')}>
                            <span className="text-2xl">{m.emoji}</span>
                            <span className={`text-[11px] font-semibold ${
                              selectedMood === m.label
                                ? dark ? 'text-emerald-400' : 'text-emerald-700'
                                : dark ? 'text-slate-400' : 'text-slate-500'
                            }`}>{m.label}</span>
                            {selectedMood === m.label && (
                              <motion.div layoutId="check"
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="text" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        What's on your mind?
                      </p>
                      <textarea rows={4} value={text} onChange={e => setText(e.target.value)}
                        placeholder="Express your thoughts and feelings freely..."
                        className={`w-full rounded-lg px-4 py-3 text-sm leading-relaxed resize-none border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                          dark
                            ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`} />
                      <p className={`text-[11px] mt-1.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Our AI will analyze your text to identify your emotional state.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stress Level */}
              <div className={`${cardCls} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Stress Level</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    stress <= 3 ? (dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700')
                    : stress <= 6 ? (dark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700')
                    : (dark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-700')
                  }`}>{stress}/10</span>
                </div>
                <input type="range" min={1} max={10} value={stress} onChange={e => setStress(+e.target.value)}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(stress-1)/9*100}%, ${dark ? '#334155' : '#e2e8f0'} ${(stress-1)/9*100}%, ${dark ? '#334155' : '#e2e8f0'} 100%)`,
                  }} />
                <div className="flex justify-between mt-1.5">
                  <span className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Peaceful</span>
                  <span className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Overwhelmed</span>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className={`p-3.5 rounded-lg text-sm font-medium ${
                      dark ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'
                    }`}>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button onClick={submit} disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-3.5 transition-colors shadow-lg shadow-emerald-600/20">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</> : <><Sparkles className="w-4 h-4" /> Get My Guidance</>}
              </button>

              {/* Skeleton */}
              {loading && (
                <div className={`${cardCls} p-6 space-y-4`}>
                  {[48, '100%', '85%', '70%', 80].map((w, i) => (
                    <div key={i} className={`rounded-lg animate-pulse ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}
                      style={{ height: typeof w === 'number' ? w : 16, width: typeof w === 'string' ? w : undefined }} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GuidanceCard data={guidance} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
