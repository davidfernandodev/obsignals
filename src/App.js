import { useContext, useState } from 'react'
import { useOutsideClick } from "@souvik666/react-outside-click-hook";
import { Tooltip } from 'react-tooltip'
import ListCards from './components/ListCards';
import Modal from './components/Modal';
import Menu from './components/Menu';
import DigitalClock from './components/DigitalClock';
import { ModalContext } from './context/modalContext'

import setTimezoneDefault from './utils/setTimezoneDefault'
import setUtcDefault from './utils/setUtcDefault'

import './styles/App.css'
import menuIcon from './images/menu.svg'
import helpIcon from './images/helpIcon.svg'
import quotexButton from './images/quotexButton.svg'
import iqOptionButton from './images/iqOptionButton.svg'
import exnovaButton from './images/exnovaButton.svg'
import pocketOptionButton from './images/pocketOptionButton.svg'
import expertOptionButton from './images/expertOptionButton.svg'
import olimpTradeButton from './images/olimpTradeButton.svg'
import binomoButton from './images/binomoButton.svg'
import capitalBearButton from './images/capitalBearButton.svg'
import raceOptionButton from './images/raceOptionButton.svg'
import binaryCentButton from './images/binaryCentButton.svg'
import iqCentButton from './images/iqCentButton.svg'
import spectreAiButton from './images/spectreAiButton.svg'
import trustedPartnerTag from './images/trustedPartnerTag.svg'
import binaryTradersLogo from './images/binaryTradersLogo.svg'

function App() {
  const { modalIsOpened, openModal } = useContext(ModalContext)
  const currentUTC = parseInt(localStorage.getItem('currentutc'))
  const currentTimezone = parseInt(localStorage.getItem('timezoneId'))
  const [ showMenu, setShowMenu ] = useState('none')

  // eslint-disable-next-line no-unused-vars
  const [ _, ref ] = useOutsideClick({
    callback: () => setShowMenu('none')
  });

  setTimezoneDefault(currentTimezone)
  setUtcDefault(currentUTC)

  return (
    <>
      {
        (modalIsOpened) && (
          <Modal />
        )
      }
      <span ref={ref} style={{display: showMenu}}>
        <Menu />
      </span>
      <div className="container">
        <header>
          <button>
            <img src={menuIcon} onClick={() => setShowMenu('block')} alt='Menu Icon'/>
          </button>
          <button id='help' onClick={()=> openModal()}>
            <img src={helpIcon} alt='Help Icon' />
          </button>
        <span className='helpTooltip'><Tooltip anchorSelect="#help">Help</Tooltip></span>
        </header>
        <div className='main'>
          <aside>
            <div className="cards">
              <ListCards />
            </div>
          <DigitalClock />
          </aside>
          <div className="topBrokers">
            <div className='content'>
              <div className='brokers'>
                <a href="https://broker-qx.pro/sign-up/?lid=192387" rel="noreferrer" target='_blank'>
                  <img src={trustedPartnerTag} alt="Trusted partner tag"/>
                  <img src={quotexButton} alt="Quotex"/>
                  <span></span>
                </a>
                <a href="https://www.iqoption.com/en?aff=140138" rel="noreferrer" target='_blank'>
                  <img src={trustedPartnerTag} alt="Trusted partner tag"/>
                  <img src={iqOptionButton} alt="IQ Option"/>
                  <span></span>
                </a>
                <a href="https://po6.cash/smart/bAC2FB7mlcHtwv" rel="noreferrer" target='_blank'>
                  <img src={trustedPartnerTag} alt="Trusted partner tag"/>
                  <img src={pocketOptionButton} alt="Pocket Option"/>
                  <span></span>
                </a>
                <a href="https://exnova.org/lp/start-trading/?aff=330594&aff_model=revenue&afftrack=" rel="noreferrer" target='_blank'>
                  <img src={trustedPartnerTag} alt="Trusted partner tag"/>
                  <img src={exnovaButton} alt="Exnova"/>
                  <span></span>
                </a>
                <a href="https://r.shortlify.com/?prefid=1004865001" rel="noreferrer" target='_blank'>
                  <img src={expertOptionButton} alt="Expert Option"/>
                </a>
                <a href="https://olymptrade.com/?affiliate_id=1573874&subid1=&subid2=" rel="noreferrer" target='_blank'>
                  <img src={olimpTradeButton} alt="Olymp Trade"/>
                </a>
                <a href="https://binomo.com/?a=cbf288f25252&t=0" rel="noreferrer" target='_blank'>
                  <img src={binomoButton} alt="Binomo"/>
                </a>
                <a href="https://capitalbear.com/" rel="noreferrer" target='_blank'>
                  <img src={capitalBearButton} alt="Capital Bear"/>
                </a>
                <a href="https://raceoption.com/?trck=763e9cc74c571b9.14843958&offid=73&affusr=RVelasco&utm_source=affiliates&utm_medium=referral&utm_campaign=RVelasco&utm_content=73&utm_term=779&ocode=Njk4Ny4xODI3NC43My43NzkuMC4wLjAuMC4w" rel="noreferrer" target='_blank'>
                  <img src={raceOptionButton} alt="Race Option"/>
                </a>
                <a href="https://binarycent.com/?trck=163e9cd5b6cae60.58439000&offid=45&affusr=RVelasco&utm_source=affiliates&utm_medium=referral&utm_campaign=RVelasco&utm_content=45&ocode=Njk4Ny40Ni40NS43NzcuMC4wLjAuMC4wLjAuMC4w" rel="noreferrer" target='_blank'>
                  <img src={binaryCentButton} alt="Binary Cent"/>
                </a>
                <a href="https://iqcent.com/?trck=063e9cd6bd89563.87006826&offid=97&affusr=RVelasco&utm_source=affiliates&utm_medium=referral&utm_campaign=RVelasco&utm_content=97&ocode=Njk4Ny4xMTczMTUuOTcuNzcyLjAuMC4wLjAuMC4wLjAuMA" rel="noreferrer" target='_blank'>
                  <img src={iqCentButton} alt="Iq Cent"/>
                </a>
                <a href="https://spectre.ai/?ref=ttraders" rel="noreferrer" target='_blank'>
                  <img src={spectreAiButton} alt="Spectre AI"/>
                </a>
              </div>
              <div className="information">
                <p>Don't have an account?</p>
                <ul>
                  <li>
                    <p>Click the broker button and create an account for <mark>free.</mark></p>
                  </li>
                  <li>
                    <p>Receive <mark>$10,000.00</mark> in your demo account.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <footer>
        </footer>
      </div>
    </>
  );
}

export default App;
