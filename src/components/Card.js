import { useContext, useState } from 'react'
import { Textfit } from '@ayushmw/react-textfit'
import { WebSocketContext } from '../context/webSocketContext'
import useEditTitle from '../hooks/userEditTitle'

import putButton from '../images/putButton.svg'
import highGraph from '../images/highGraph.png'
import lowGraph from '../images/lowGraph.png'
import neutralGraph from '../images/neutralGraph.png'
import signalGreen from '../images/signalGreen.svg'
import signalGreenMedium from '../images/signalGreenMedium.svg'
import signalOrange from '../images/signalOrange.svg'
import signalRed from '../images/signalRed.svg'
import impactIcon from '../images/impactIcon.svg'
import mediumImpact from '../images/mediumImpact.svg'
import footerOTC from '../images/footerOTC.svg'
import star from '../images/star.svg'
import curtedStar from '../images/curtedStar.svg'
import mediumHour from '../images/mediumHour.svg'
import clock from '../images/clock.svg'
import callButton from '../images/callButton.svg'

import styles from '../styles/Card.module.css'

function Card({ data }){

  const [signalDirectionTooltipIsOpen, setSignalDirectionTooltipIsOpen ] = useState(false)
  const [newSignalTooltipIsOpen, setNewSignalTooltipIsOpen ] = useState(false)
  const [signalInProgressTooltipIsOpen, setSignalInProgressTooltipIsOpen ] = useState(false)
  const [brokersCompatibleTooltipIsOpen, setBrokersCompatibleTooltipIsOpen ] = useState(false)
  const [traderTimezoneTooltipIsOpen, setTraderTimezoneTooltipIsOpen ] = useState(false)
  const [tradingHourframeTooltipIsOpen, setTradingHourframeTooltipIsOpen ] = useState(false)
  const [tradingTimeframeTooltipIsOpen, setTradingTimeframeTooltipIsOpen ] = useState(false)
  const [tradingAssetTooltipIsOpen, setTradingAssetTooltipIsOpen ] = useState(false)
  const [martingaleTooltipIsOpen, setMartingaleTooltipIsOpen ] = useState(false)
  const [trendIsOpen, setTrendIsOpen ] = useState(false)

  const { status, hourCard } = useContext(WebSocketContext)

  const { titleActive } = useEditTitle(data.title)

  const isOTC = titleActive.includes('-OTC')

  const classData = (isOTC)? styles.dataContentOTC: styles.dataContent

  const isEmptyStatus = (status.length === 0)? true : false
  const isEmptyHour = (hourCard.length === 0)? true : false

  const dataStatus = (!isEmptyStatus)? status.find(item => item.id === data.id) : null
  const dataHour = (!isEmptyHour)? hourCard.find(item => item.id === data.id) : null

  const button = {
    'CALL': callButton,
    'PUT': putButton
  }

  const signalColor = {
    signalGreen,
    signalGreenMedium,
    signalOrange,
    signalRed
  }

  const timeframeText = {
    'M1': '01:00',
    'M5': '05:00'
  }

  const graph = {
    'Tendencia de alta': highGraph,
    'Tendencia de baixa': lowGraph,
    'Tendencia neutra': neutralGraph
  }

  const trendTooltipText = {
    'Tendencia de alta': 'Up Trend',
    'Tendencia de baixa': 'Down Trend',
    'Tendencia neutra': 'Neutral Trend'
  }

  const impact = (impactText) => (impactText === 'MEDIUM IMPACT')? mediumImpact : impactIcon

  return (
    <div className={styles.cardContainer}>
      <div className={styles.informationContent}>
        <header>
          <span
           className={styles.stars}
           onMouseEnter={() => setMartingaleTooltipIsOpen(true)}
           onMouseLeave={() => setMartingaleTooltipIsOpen(false)}
          >
            {
              (dataStatus.martigale === 'G2') && (
                <img
                  src={curtedStar}
                  width={15}
                  height={15}
                  alt="Curted Star" className={styles.signal}
                  onMouseEnter={() => setMartingaleTooltipIsOpen(true)}
                  onMouseLeave={() => setMartingaleTooltipIsOpen(false)}
                />
              )
            }
            {
              (dataStatus.martigale === 'G1' || dataStatus.martigale === 'G2') && (
                <img src={star} width={14} height={14} alt="Star" id={`martingaleInProgress${data.id}`} className={styles.signal} />
              )
            }
          </span>

          <img src={signalColor[dataStatus.signal]} width={33} height={28} alt="Signal" className={styles.signal} />
          <span
            className={styles.martingaleTooltip}
            style={{
              display: (martingaleTooltipIsOpen && (dataStatus.martigale === 'G1' || dataStatus.martigale === 'G2'))? 'block' : 'none', left: (dataStatus.martigale === 'G1')? '5.8rem' : '7.2rem'
            }}
          >
            <p className={styles.tooltipText}>
              Martingale {dataStatus.martigale.split('')[1]} In Progress
            </p>
          </span>
        </header>
        <div className={styles.content}>
          <div className={classData}>
            {
              (isOTC)? (
                <Textfit
                  mode='single'
                  onMouseEnter={() => setTradingAssetTooltipIsOpen(true)}
                  onMouseLeave={() => setTradingAssetTooltipIsOpen(false)}
                >
                  <div className={styles.activeOTC}>
                    { titleActive }
                  </div>
                </Textfit>
              ) : (
                <Textfit
                  mode='single' forceSingleModeWidth={false}
                  onMouseEnter={() => setTradingAssetTooltipIsOpen(true)}
                  onMouseLeave={() => setTradingAssetTooltipIsOpen(false)}
                >
                  <div className={styles.activeBody}>
                    { titleActive }
                  </div>
                </Textfit>
              )
            }
              <span
                className={styles.tradingAssetTooltip}
                style={{display: (tradingAssetTooltipIsOpen)? 'block' : 'none' }}
              >
                <span className={styles.multilineTooltipText}>
                  <p>
                    Trading Asset
                  </p>
                  <p>
                    Analyzed currency pair
                  </p>
                </span>
              </span>
              <img
               className={styles.trendGraph}
               src={graph[dataStatus.trendGraph]}
               style={{left: (isOTC)? '0rem' : '0.1rem'}}
               onMouseEnter={() => setTrendIsOpen(true)}
               onMouseLeave={() => setTrendIsOpen(false)}
               alt="Trend graph"
              />
              <span
                className={styles.trendTooltip}
                style={{display: (trendIsOpen)? 'block' : 'none' }}
              >
              <p className={styles.tooltipText}>
                {trendTooltipText[dataStatus.trendGraph]}
              </p>
            </span>
            <div className={styles.time}>
              <span
               onMouseEnter={() => setTradingHourframeTooltipIsOpen(true)}
               onMouseLeave={() => setTradingHourframeTooltipIsOpen(false)}
              >
                <img src={clock} width={13} height={12.5} alt="Clock" />
                <p>{dataHour.hour}</p>
              </span>
              <span
               onMouseEnter={() => setTradingTimeframeTooltipIsOpen(true)}
               onMouseLeave={() => setTradingTimeframeTooltipIsOpen(false)}
               >
                <img src={mediumHour} width={15} height={15} className={styles.mediumHour} alt="Medium hour" />
                <p>{timeframeText[data.timeframe]}</p>
              </span>
            </div>
              <span
               className={styles.tradingHourTooltip}
               style={{display: (tradingHourframeTooltipIsOpen)? 'block' : 'none' }}
              >
                <span className={styles.multilineTooltipText}>
                  <p>
                    Trading Hour
                  </p>
                  <p>
                    Time to execute the trade
                  </p>
                </span>
              </span>
              <span
               className={styles.tradingTimeframeTooltip}
               style={{display: (tradingTimeframeTooltipIsOpen)? 'block' : 'none' }}
               >
                <span className={styles.multilineTooltipText}>
                  <p style={{fontWeight: 'normal'}}>
                    Trading Timeframe
                  </p>
                  <p>
                    Recommended expiration time
                  </p>
                </span>
              </span>
          </div>
          <div className={styles.boxTrend}>
            <img
             src={button[data.direction]}
             onMouseEnter={() => setSignalDirectionTooltipIsOpen(true)}
             onMouseLeave={() => setSignalDirectionTooltipIsOpen(false)}
             width={85}
             height={80}
             alt="Button"
            />
            <span
            className={styles.signalDirectionTooltip}
            style={{display: (signalDirectionTooltipIsOpen)? 'block' : 'none' }}
            >
              <p className={styles.tooltipText}>
                Signal Direction
              </p>
            </span>
            {
              (dataStatus.loading === 'new') && (
                <>
                  <span
                   className={styles.newLoader}
                   onMouseEnter={() => setNewSignalTooltipIsOpen(true)}
                   onMouseLeave={() => setNewSignalTooltipIsOpen(false)}
                  >
                    <div className={styles.center}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                  </span>
                </>
              )
            }
            <span
             className={styles.newSignalTooltip}
             style={{display: (newSignalTooltipIsOpen)? 'block' : 'none' }}
             >
                <p className={styles.tooltipText}>
                  New signal
                </p>
            </span>
            {
              (dataStatus.loading === 'waiting') && (
                <>
                  <div
                   className={styles.loading}
                   onMouseEnter={() => setSignalInProgressTooltipIsOpen(true)}
                   onMouseLeave={() => setSignalInProgressTooltipIsOpen(false)}
                  >
                  <svg viewBox="0 0 100 100">
                    <defs>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#333333">
                        </feDropShadow>
                      </filter>
                    </defs>
                    <circle className={styles.spinner} cx="50" cy="50" r="45" style={{fill:'transparent',stroke:'rgb(228, 228, 240)',strokeWidth:'7px'}}>
                    </circle>
                  </svg>
                  </div>
                  <span
                   className={styles.signalInProgressTooltip}
                   style={{display: (signalInProgressTooltipIsOpen)? 'block' : 'none' }}
                   >
                      <p className={styles.tooltipText}>
                        Signal In Progress
                      </p>
                  </span>
                </>
              )
            }
          </div>
      </div>
      </div>
      {
        (isOTC)? (
          <footer
           className={styles.footerOtc}
           onMouseEnter={() => setBrokersCompatibleTooltipIsOpen(true)}
           onMouseLeave={() => setBrokersCompatibleTooltipIsOpen(false)}
          >
            <img src={footerOTC} alt="Footer OTC" />
            <span
             className={styles.traderTimeZoneTooltip}
             style={{display: (brokersCompatibleTooltipIsOpen)? 'block' : 'none' }}
            >
              <span className={styles.multilineTooltipText}>
                <p style={{fontWeight: 400}}>
                  Brokers Compatible
                </p>
                <p style={{ fontSize: '1.28rem' }}>
                  Use this signal only on these brokers
                </p>
              </span>
            </span>
          </footer>
        ) : (
          <footer
           style={{background: data.color}}
           onMouseEnter={() => setTraderTimezoneTooltipIsOpen(true)}
           onMouseLeave={() => setTraderTimezoneTooltipIsOpen(false)}
           >
          <span>
            <p className={`${styles.ttzText} ${(data.impact === 'MEDIUM IMPACT')? styles.mediumImpactText : ''}`}>
            TTZ
            </p>
            <img src={impact(data.impact)} className={styles.ttzImpact} width={14.6} height={15} alt="Impact Icon" />
            <p style={{'position': 'relative', 'right': '0.8rem'}} className={`${styles.ttzText} ${(data.impact === 'MEDIUM IMPACT')? styles.mediumImpactText : ''}`}>
            {data.impact}
            </p>
          </span>
          <span
           className={styles.traderTimeZoneTooltip}
           style={{display: (traderTimezoneTooltipIsOpen)? 'block' : 'none' }}
          >
            <span className={styles.multilineTooltipText}>
              <p style={{fontWeight: 400}}>
                Trader Time Zone
              </p>
              <p style={{ fontSize: '1.28rem' }}>
                Zones of impact on trading
              </p>
            </span>
          </span>
        </footer>
        )
      }
    </div>
  )
}

export default Card