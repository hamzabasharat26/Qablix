import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, BookOpen, Heart, Lightbulb, RotateCcw } from 'lucide-react'
import { useTheme } from '../App'

function SpeakBtn({ text, label }) {
  const { dark } = useTheme()
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return }
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9; u.lang = 'en-US'
    u.onend = () => setPlaying(false)
    u.onerror = () => setPlaying(false)
    setPlaying(true)
    window.speechSynthesis.speak(u)
  }

  useEffect(() => () => window.speechSynthesis.cancel(), [])

  return (
    <button onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
        playing
          ? 'bg-emerald-600 text-white'
          : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}>
      {playing ? <><VolumeX className="w-3 h-3" /> Stop</> : <><Volume2 className="w-3 h-3" /> {label}</>}
    </button>
  )
}

export default function GuidanceCard({ data, onReset }) {
  const { dark } = useTheme()
  const g = data?.guidance || {}
  const mood = g.detected_mood || 'Calm'

  const emojiMap = { Calm: '😌', Stressed: '😰', Sad: '😢', Angry: '😠', Anxious: '😟', Grateful: '🤲', Hopeful: '🌟' }
  const colorMap = { Calm: 'text-emerald-500', Stressed: 'text-orange-500', Sad: 'text-blue-500', Angry: 'text-red-500', Anxious: 'text-amber-500', Grateful: 'text-green-500', Hopeful: 'text-yellow-500' }

  const card = dark
    ? 'bg-slate-800/60 border border-slate-700/50 rounded-xl'
    : 'bg-white border border-slate-200 rounded-xl shadow-sm'

  const fI = i => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } },
  })

  return (
    <div className="space-y-3">
      {/* Mood */}
      <motion.div {...fI(0)} className={`${card} p-5`}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{emojiMap[mood] || '😌'}</span>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              {data?.inferred ? 'AI Detected Mood' : 'Selected Mood'}
            </p>
            <h2 className={`text-xl font-bold ${colorMap[mood] || 'text-emerald-500'}`}
              style={{ fontFamily: '"Playfair Display", serif' }}>{mood}</h2>
          </div>
        </div>
      </motion.div>

      {/* Emotion */}
      <motion.div {...fI(1)} className={`${card} p-5`}>
        <div className={`flex items-center gap-2 mb-2 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
          <Heart className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold">Emotional Acknowledgment</h3>
        </div>
        <p className={`text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{g.emotion_analysis}</p>
      </motion.div>

      {/* Quran */}
      <motion.div {...fI(2)} className={`rounded-xl p-5 ${
        dark ? 'bg-emerald-500/5 border border-emerald-500/15' : 'bg-emerald-50/70 border border-emerald-200/60'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 ${dark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            <BookOpen className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Quranic Guidance</h3>
          </div>
          <SpeakBtn text={g.quran_verse || ''} label="Listen" />
        </div>
        <p className={`text-sm italic leading-relaxed ${dark ? 'text-slate-200' : 'text-slate-700'}`}
          style={{ fontFamily: '"Playfair Display", serif' }}>
          "{g.quran_verse}"
        </p>
      </motion.div>

      {/* Hadith */}
      <motion.div {...fI(3)} className={`rounded-xl p-5 ${
        dark ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-amber-50/70 border border-amber-200/60'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 ${dark ? 'text-amber-400' : 'text-amber-700'}`}>
            <BookOpen className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Hadith Wisdom</h3>
          </div>
          <SpeakBtn text={g.hadith_text || ''} label="Listen" />
        </div>
        <p className={`text-sm italic leading-relaxed ${dark ? 'text-slate-200' : 'text-slate-700'}`}
          style={{ fontFamily: '"Playfair Display", serif' }}>
          "{g.hadith_text}"
        </p>
      </motion.div>

      {/* Tip */}
      <motion.div {...fI(4)} className={`rounded-xl p-5 ${
        dark ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-emerald-50/50 border border-emerald-200/60'
      }`}>
        <div className={`flex items-center gap-2 mb-2 ${dark ? 'text-emerald-400' : 'text-emerald-700'}`}>
          <Lightbulb className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Actionable Step</h3>
        </div>
        <p className={`text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{g.actionable_tip}</p>
      </motion.div>

      {/* Reset */}
      <motion.div {...fI(5)}>
        <button onClick={onReset}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors ${
            dark ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
          }`}>
          <RotateCcw className="w-4 h-4" /> Check In Again
        </button>
      </motion.div>
    </div>
  )
}
