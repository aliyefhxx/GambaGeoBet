import { GambaUi } from 'gamba-react-ui-v2'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ENABLE_TROLLBOX } from './constants'
import { useUserStore } from './hooks/useUserStore'
import Dashboard from './sections/Dashboard/Dashboard'
import Game from './sections/Game/Game'
import Header from './sections/Header'
import RecentPlays from './sections/RecentPlays/RecentPlays'
import Toasts from './sections/Toasts'
import { MainWrapper } from './styles'
import TrollBox from './components/TrollBox'
import AuthModal from './components/AuthModal'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'

function ScrollToTop() {
  const { pathname } = useLocation()
  React.useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  const user = useUserStore((state) => state.user)

  // დეპოზიტი და გამოტანის state
  const [depositOpen, setDepositOpen] = React.useState(false)
  const [withdrawOpen, setWithdrawOpen] = React.useState(false)

  return (
    <>
      {/* თუ მომხმარებელი არ არის ავტორიზებული → ვაჩვენოთ Login/Register */}
      {!user && (
        <AuthModal
          onLogin={(username) => {
            const users = JSON.parse(localStorage.getItem("users") || "[]")
            const currentUser = users.find((u: any) => u.username === username)
            if (currentUser) {
              useUserStore.getState().setUser(currentUser) // ✅ istifadəçini store-a yaz
            }
          }}
        />
      )}

      {/* დეპოზიტის Modal */}
      {depositOpen && <DepositModal onClose={() => setDepositOpen(false)} />}

      {/* გამოტანის Modal */}
      {withdrawOpen && <WithdrawModal onClose={() => setWithdrawOpen(false)} />}

      <ScrollToTop />
      <Header
        openDeposit={() => setDepositOpen(true)}
        openWithdraw={() => setWithdrawOpen(true)}
      />
      <Toasts />
      <MainWrapper>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:gameId" element={<Game />} />
        </Routes>
        <h2 style={{ textAlign: 'center' }}>ბოლო თამაშები</h2>
        <RecentPlays />
      </MainWrapper>
      {ENABLE_TROLLBOX && <TrollBox />}
    </>
  )
}
