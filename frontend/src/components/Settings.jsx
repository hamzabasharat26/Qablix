import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Sun, Moon, Info, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { useTheme } from '../App'

export default function Settings() {
  const { dark, setDark } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [resetting, setResetting] = useState(false)

  const handleReset = async () => {
    if (confirmText !== 'RESET') return
    setResetting(true)
    try {
      await axios.delete('/api/reset/1')
      toast.success('All data has been reset.', { duration: 4000 })
      setShowModal(false); setConfirmText('')
    } catch { toast.error('Failed to reset data.') }
    finally { setResetting(false) }
  }

  const card = dark
    ? 'bg-slate-800/60 border border-slate-700/50 rounded-xl'
    : 'bg-white border border-slate-200 rounded-xl shadow-sm'

  return (
    <div className={`min-h-screen py-12 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontFamily: '"Playfair Display", serif' }}>
            <span className="gradient-text">Settings</span>
          </h1>
          <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Customize your Qalbix experience.</p>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className={`${card} p-5 mb-4`}>
          <div className="flex items-center gap-2 mb-4">
            {dark ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-slate-500" />}
            <h2 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-700'}`}>Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${dark ? 'text-slate-200' : 'text-slate-700'}`}>Dark Mode</p>
              <p className={`text-[11px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Switch between light and dark themes</p>
            </div>
            <button onClick={() => setDark(!dark)}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${dark ? 'bg-emerald-600' : 'bg-slate-300'}`}>
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ left: dark ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`${card} p-5 mb-4`}>
          <div className="flex items-center gap-2 mb-4">
            <Info className={`w-4 h-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`} />
            <h2 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-700'}`}>About Qalbix</h2>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="Qalbix" className="h-12 w-12 object-contain" />
            <div>
              <p className={`font-bold text-base ${dark ? 'text-white' : 'text-slate-900'}`}
                style={{ fontFamily: '"Playfair Display", serif' }}>Qalbix</p>
              <p className={`text-[11px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>AI Spiritual Coach — v1.0.0</p>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Understand Your Emotions. Strengthen Your Habits. Grow Your Faith. Qalbix uses AI powered by
            Gemini to provide compassionate, Islamic-centered emotional coaching and habit formation guidance
            rooted in the Quran and Sunnah.
          </p>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`rounded-xl p-5 border-2 ${dark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-4 h-4 ${dark ? 'text-red-400' : 'text-red-600'}`} />
            <h2 className={`text-sm font-semibold ${dark ? 'text-red-400' : 'text-red-700'}`}>Danger Zone</h2>
          </div>
          <p className={`text-[11px] mb-4 ${dark ? 'text-red-300/50' : 'text-red-500/70'}`}>
            This action cannot be undone. All check-in history and habit logs will be permanently deleted.
          </p>
          <button onClick={() => setShowModal(true)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              dark ? 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25' : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
            }`}>
            <Trash2 className="w-4 h-4" /> Reset All My Data
          </button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowModal(false); setConfirmText('') }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className={`relative w-full max-w-sm rounded-xl p-6 shadow-2xl ${dark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
              <div className="text-center mb-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${dark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <AlertTriangle className={`w-6 h-6 ${dark ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <h3 className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: '"Playfair Display", serif' }}>Are you sure?</h3>
                <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  This permanently deletes all your data. This cannot be undone.
                </p>
              </div>
              <div className="mb-5">
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Type <span className="text-red-500 font-bold">RESET</span> to confirm:
                </label>
                <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="Type RESET here"
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm font-mono border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
                    dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowModal(false); setConfirmText('') }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  Cancel
                </button>
                <button onClick={handleReset} disabled={confirmText !== 'RESET' || resetting}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    confirmText === 'RESET' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500/25 text-red-300 cursor-not-allowed'
                  }`}>
                  {resetting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Delete Everything'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
