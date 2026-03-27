import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { Home, HeartPulse, LayoutDashboard, Settings as SettingsIcon, Sun, Moon, Menu, X } from 'lucide-react'
import CheckIn from './components/CheckIn'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import Landing from './components/Landing'

const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

const pageVar = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
}

const NAV_LINKS = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/checkin', label: 'Check-In', Icon: HeartPulse },
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
]

function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? dark
            ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-lg shadow-black/10'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm'
          : dark
            ? 'bg-slate-900/70 backdrop-blur-md'
            : 'bg-white/70 backdrop-blur-md',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="Qalbix" className="h-8 w-8 object-contain" />
            <span className={`text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}
              style={{ fontFamily: '"Playfair Display", serif' }}>
              Qalbix
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {({ isActive }) => (
                  <span className={[
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                      : dark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
                  ].join(' ')}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden overflow-hidden border-t ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(({ to, label, Icon }) => (
                <NavLink key={to} to={to} end={to === '/'}>
                  {({ isActive }) => (
                    <span className={[
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                        : dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900',
                    ].join(' ')}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('qalbix-theme') === 'dark')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('qalbix-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-white'}`}>
        <Navbar dark={dark} setDark={setDark} />
        <Toaster position="top-center" toastOptions={{
          duration: 3000,
          style: { background: dark ? '#1e293b' : '#fff', color: dark ? '#f1f5f9' : '#1e293b', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', fontSize: '14px' },
        }} />
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<motion.div variants={pageVar} initial="initial" animate="animate" exit="exit"><Landing /></motion.div>} />
              <Route path="/checkin" element={<motion.div variants={pageVar} initial="initial" animate="animate" exit="exit"><CheckIn /></motion.div>} />
              <Route path="/dashboard" element={<motion.div variants={pageVar} initial="initial" animate="animate" exit="exit"><Dashboard /></motion.div>} />
              <Route path="/settings" element={<motion.div variants={pageVar} initial="initial" animate="animate" exit="exit"><Settings /></motion.div>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </ThemeContext.Provider>
  )
}
