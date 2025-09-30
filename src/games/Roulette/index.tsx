import { computed } from '@preact/signals-react'
import { GambaUi, useSound } from 'gamba-react-ui-v2'
import React from 'react'
import styled from 'styled-components'
import { Chip } from './Chip'
import { StyledResults } from './Roulette.styles'
import { Table } from './Table'
import { CHIPS, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants'
import { addResult, bet, clearChips, results, selectedChip, totalChipValue } from './signals'
import { useUserStore } from '../../hooks/useUserStore'

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  color: white;
`

function Results() {
  const _results = computed(() => [...results.value].reverse())
  return (
    <StyledResults>
      {_results.value.map((index, i) => {
        return (
          <div key={i}>
            {index}
          </div>
        )
      })}
    </StyledResults>
  )
}

function Stats() {
  const { balance } = useUserStore()
  const wager = totalChipValue.value

  // Mərc qoyulan yerlərə görə ən yüksək payout hesabla
  let maxPayout = 0
  bet.value.forEach((multiplier) => {
    if (multiplier > 0) {
      const payout = multiplier * wager
      if (payout > maxPayout) {
        maxPayout = payout
      }
    }
  })

  const balanceExceeded = wager > balance

  return (
    <div style={{ textAlign: 'center', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div>
        {balanceExceeded ? (
          <span style={{ color: '#ff0066' }}>TOO HIGH</span>
        ) : (
          <>{wager}</>
        )}
        <div>Wager</div>
      </div>
      <div>
        <div>
          {maxPayout} ({maxPayout > 0 ? (maxPayout / wager).toFixed(2) : "0"}x)
        </div>
        <div>Potential win</div>
      </div>
    </div>
  )
}

export default function Roulette() {
  const { balance, updateBalance } = useUserStore()

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  })

  const wager = totalChipValue.value
  const balanceExceeded = wager > balance

  const play = async () => {
    if (balance < wager) {
      alert("Balans kifayət deyil!")
      return
    }

    // Mərc çıxılır
    updateBalance(balance - wager)
    sounds.play('play')

    // Nəticə 0–36 arası random seçilir
    const resultIndex = Math.floor(Math.random() * 37)
    addResult(resultIndex)

    // Mərc qoyulmuş xananın multiplikatoru
    const multiplier = bet.value[resultIndex] || 0
    const payout = wager * multiplier

    if (payout > 0) {
      updateBalance((prev) => prev + payout)
      sounds.play('win')
    } else {
      sounds.play('lose')
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <Wrapper onContextMenu={(e) => e.preventDefault()}>
            <Stats />
            <Results />
            <Table />
          </Wrapper>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.Select
          options={CHIPS}
          value={selectedChip.value}
          onChange={(value) => selectedChip.value = value}
          label={(value) => (
            <>
              <Chip value={value} /> = {value}
            </>
          )}
        />
        <GambaUi.Button
          disabled={!wager}
          onClick={clearChips}
        >
          Clear
        </GambaUi.Button>
        <GambaUi.PlayButton disabled={!wager || balanceExceeded} onClick={play}>
          Spin
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}
