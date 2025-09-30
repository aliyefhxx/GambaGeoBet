import React from 'react'
import { useUserStore } from '../../hooks/useUserStore'
import Slider from './Slider'   // ✅ düzəliş edildi
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants'
import { Container, Result, RollUnder, Stats } from './styles'
import { useSound } from 'gamba-react-ui-v2'

export default function Dice() {
  const { balance, withdrawBalance, addBalance } = useUserStore()
  const [wager, setWager] = React.useState(10)
  const [resultIndex, setResultIndex] = React.useState(-1)
  const [rollUnderIndex, setRollUnderIndex] = React.useState(50) // default 50%
  const [isPlaying, setIsPlaying] = React.useState(false)

  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  const multiplier = 100 / rollUnderIndex
  const maxWin = multiplier * wager

  const play = async () => {
    if (isPlaying) return
    if (!withdrawBalance(wager)) {
      alert('Not enough balance!')
      return
    }

    sounds.play('play')
    setIsPlaying(true)

    // Random nəticə
    const win = Math.random() * 100 < rollUnderIndex

    const resultNum = win
      ? Math.floor(Math.random() * rollUnderIndex)
      : Math.floor(Math.random() * (100 - rollUnderIndex) + rollUnderIndex)

    setResultIndex(resultNum)

    if (win) {
      const payout = wager * multiplier
      addBalance(payout)
      sounds.play('win')
    } else {
      sounds.play('lose')
    }

    setIsPlaying(false)
  }

  return (
    <>
      <div className="screen">
        <Container>
          <RollUnder>
            <div>
              <div>{rollUnderIndex}</div>
              <div>Roll Under</div>
            </div>
          </RollUnder>
          <Stats>
            <div>
              <div>{rollUnderIndex}%</div>
              <div>Win Chance</div>
            </div>
            <div>
              <div>{multiplier.toFixed(2)}x</div>
              <div>Multiplier</div>
            </div>
            <div>
              <div>{maxWin.toFixed(2)} ₼</div>
              <div>Payout</div>
            </div>
          </Stats>
          <div style={{ position: 'relative' }}>
            {resultIndex > -1 && (
              <Result style={{ left: `${(resultIndex / 100) * 100}%` }}>
                <div key={resultIndex}>{resultIndex}</div>
              </Result>
            )}
            <Slider
              disabled={isPlaying}
              range={[1, 95]}
              value={rollUnderIndex}
              onChange={(value) => {
                setRollUnderIndex(value)
                sounds.play('tick')
              }}
            />
          </div>
        </Container>
      </div>

      <div className="controls" style={{ marginTop: '20px' }}>
        <input
          type="number"
          value={wager}
          onChange={(e) => setWager(Number(e.target.value))}
          min={1}
          max={balance}
        />
        <button onClick={play} disabled={isPlaying}>
          Roll
        </button>
      </div>
    </>
  )
}
