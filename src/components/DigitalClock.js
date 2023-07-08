import { useContext } from 'react'
import { Textfit } from '@ayushmw/react-textfit'
import { WebSocketContext } from '../context/webSocketContext'

import styles from '../styles/DigitalClock.module.css'

function DigitalClock(){
  const { time } = useContext(WebSocketContext)

  return (
    <div className={styles.digitalClockContainer}>
      <span>
        <span className={styles.minutes}>
          <div>{time.minutes[0]}</div>
          <div>{time.minutes[1]}</div>
        </span>
        <p>:</p>
        <span className={styles.seconds}>
          <div>{time.seconds[0]}</div>
          <div>{time.seconds[1]}</div>
        </span>
      </span>
      <Textfit mode='single'>
        <h1 className={styles.nextSignal}>NEXT SIGNAL</h1>
      </Textfit>
    </div>
  )
}

export default DigitalClock