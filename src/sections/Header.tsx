// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
} from "gamba-react-ui-v2"
import React from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import { Modal } from "../components/Modal"
import LeaderboardsModal from "../sections/LeaderBoard/LeaderboardsModal"
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from "../constants"
import { useMediaQuery } from "../hooks/useMediaQuery"
import TokenSelect from "./TokenSelect"
import { ENABLE_LEADERBOARD } from "../constants"
import { useUserStore } from "../hooks/useUserStore" // ✅ bizdəki store

const Bonus = styled.button`
  all: unset;
  cursor: pointer;
  color: #ffe42d;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.2s;
  &:hover {
    background: white;
  }
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background: #000000cc;
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  & > img {
    height: 120%;
  }
`

export default function Header({
  openDeposit,
  openWithdraw,
}: {
  openDeposit?: () => void
  openWithdraw?: () => void
}) {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const isDesktop = useMediaQuery("lg")

  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)

  // ✅ user və balance artıq bizim store-dan
  const currentUser = useUserStore((state) => state.currentUser)
  const logout = useUserStore((state) => state.logout)

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>თქვენ გაქვთ საწყისი 200₾ ბალანსი ახალ ანგარიშზე 🎁</p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: "bold" }}>
            ჯეკპოტშია <TokenValue amount={pool.jackpotBalance} />
          </p>
        </Modal>
      )}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <StyledHeader>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Logo to="/">
            <img alt="Gamba logo" src="/logo.svg" />
          </Logo>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            position: "relative",
          }}
        >
          {pool.jackpotBalance > 0 && (
            <Bonus onClick={() => setJackpotHelp(true)}>
              💰 <TokenValue amount={pool.jackpotBalance} />
            </Bonus>
          )}

          {isDesktop && (
            <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
              ლიდერბორდი
            </GambaUi.Button>
          )}

          <TokenSelect />

          {currentUser ? (
            <>
              {/* ✅ İndi real balans göstərilir */}
              <span style={{ color: "#fff", marginRight: "10px" }}>
                {currentUser.username} — {currentUser.balance}₾
              </span>
              <GambaUi.Button onClick={openDeposit}>Deposit</GambaUi.Button>
              <GambaUi.Button onClick={openWithdraw}>Withdraw</GambaUi.Button>
              <GambaUi.Button onClick={logout}>LogOut</GambaUi.Button>
            </>
          ) : (
            <span style={{ color: "#fff" }}>ავტორიზაცია არაა</span>
          )}
        </div>
      </StyledHeader>
    </>
  )
}
