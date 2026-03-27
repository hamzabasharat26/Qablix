import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, BookOpen, BarChart3 } from 'lucide-react'
import { useTheme } from '../App'

const FEATURES = [
  {
    Icon: Brain,
    title: 'AI Emotion Engine',
    desc: 'Share your feelings through text or mood selection — our compassionate AI understands and guides you with authentic Islamic wisdom.',
    img: '/images/showcase-2.jpeg',
  },
  {
    Icon: BookOpen,
    title: 'Quranic Guidance',
    desc: 'Receive personalized Quran verses and authentic Hadith matched precisely to your current emotional state.',
    img: '/images/showcase-3.jpeg',
  },
  {
    Icon: BarChart3,
    title: 'Habit Tracking',
    desc: 'Build consistent spiritual habits — track Salah, Quran, Dhikr, and Reflection with an adaptive grading system.',
    img: '/images/showcase-4.jpeg',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
}

export default function Landing() {
  const { dark } = useTheme()

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=2000&auto=format&fit=crop"
            alt="" className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${
            dark
              ? 'bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950'
              : 'bg-gradient-to-b from-white/80 via-white/70 to-white'
          }`} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
          <motion.img
            src="/logo.png" alt="Qalbix"
            className="h-20 w-20 mx-auto mb-8 object-contain"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 ${dark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontFamily: '"Playfair Display", serif' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Understand Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600">Emotions</span>
            <br className="hidden sm:block" />{' '}Strengthen Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">Habits</span>
            <br className="hidden sm:block" />{' '}Grow Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">Faith</span>
          </motion.h1>
          <motion.p
            className={`text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            AI-Powered Islamic Emotional & Habit Coaching — Compassionate guidance
            rooted in Quran and Sunnah, designed to nurture your Qalb.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link to="/checkin">
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors shadow-lg shadow-emerald-600/20">
                Begin Your Check-In <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className={`font-semibold rounded-lg px-6 py-3 transition-colors border ${
                dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}>
                View Dashboard
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className={`py-20 sm:py-24 ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold mb-4 ${
              dark ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            }`}>How It Works</span>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}
              style={{ fontFamily: '"Playfair Display", serif' }}>
              Your Spiritual Companion
            </h2>
            <p className={`text-base ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              A beautiful, AI-powered journey from emotional awareness to lasting spiritual growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group rounded-xl overflow-hidden transition-shadow duration-300 ${
                  dark
                    ? 'bg-slate-800 border border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-black/20'
                    : 'bg-white border border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={f.img} alt={f.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${dark ? 'from-slate-800/80' : 'from-white/50'} to-transparent`} />
                </div>
                <div className="p-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                    dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <f.Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ QUOTE ═══════════════ */}
      <section className={`py-16 sm:py-20 ${dark ? 'bg-slate-950' : 'bg-white'}`}>
        <motion.div {...fadeUp} className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-3 mb-8">
            {['/images/showcase-5.jpeg', '/images/showcase-1.jpeg', '/images/showcase-5.jpeg'].map((s, i) => (
              <img key={i} src={s} alt="" className={`rounded-xl object-cover shadow-md ${i === 1 ? 'w-16 h-16 -mt-1' : 'w-14 h-14'}`} />
            ))}
          </div>
          <blockquote className={`text-xl sm:text-2xl italic leading-relaxed mb-4 ${dark ? 'text-slate-200' : 'text-slate-700'}`}
            style={{ fontFamily: '"Playfair Display", serif' }}>
            "Verily, in the remembrance of Allah do hearts find rest."
          </blockquote>
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            — Surah Ar-Ra'd [13:28]
          </p>
        </motion.div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className={`py-20 sm:py-24 ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <motion.div {...fadeUp} className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontFamily: '"Playfair Display", serif' }}>
            Begin Your Journey
          </h2>
          <p className={`text-base mb-10 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Take a moment to check in with your Qalb. Let AI-powered Islamic wisdom guide your emotions and habits.
          </p>
          <Link to="/checkin">
            <button className="flex items-center gap-2 mx-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-8 py-3.5 transition-colors shadow-lg shadow-emerald-600/20 pulse-glow">
              Start Your Check-In <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className={`py-8 border-t ${dark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
            <span className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}
              style={{ fontFamily: '"Playfair Display", serif' }}>Qalbix</span>
          </div>
          <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2026 Qalbix — AI Spiritual Coach. Mindfulness and Habit Formation.
          </p>
        </div>
      </footer>
    </div>
  )
}
