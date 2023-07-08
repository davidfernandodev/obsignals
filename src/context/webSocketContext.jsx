import { createContext, useState, useEffect } from 'react'
import { uniqWith } from 'lodash';
import useFormatDate from '../hooks/useFormatDate';

const WebSocketContext = createContext({})

function WebSocketProvider({ children }){

  const [ cardData, setCardData ] = useState([])
  const [ time, setTime ] = useState({ minutes: ['0', '0'], seconds: ['0', '0'] })
  const [ status, setStatus ] = useState([])
  const [ hourCard, setHourCard ] = useState([])
  const [ isTimeframeOneActived, setIsTimeframeOneActived ] = useState(false)
  const [ isTimeframeFiveActived, setIsTimeframeFiveActived ] = useState(true)
  
  const formatDate = useFormatDate

  const url = 'wss://obsignal.agbot.com.br/client'
  const token = 'AHteQGy0_P2fcvbMBuF5NGxYVFPlWq0m6hgDgW53'
  const timeframe = localStorage.getItem('timeframe')
  
  function setTimeframeDefault(){
    if(timeframe === null){
      return localStorage.setItem('timeframe', 'M5')
    }
    return;
  }
  
  setTimeframeDefault()

  const impactCode = {
    '#01B0F1': 'LOW IMPACT',
    '#01b0f1': 'LOW IMPACT',
    '#00B050': 'LOW IMPACT', //Transformar essa cor em #3D943B
    '#00b050': 'LOW IMPACT',
    '#3D943B': 'LOW IMPACT', //Use essa cor
    '#3d943b': 'LOW IMPACT',
    '#A8CF45': 'MEDIUM IMPACT',
    '#a8Cf45': 'MEDIUM IMPACT',
    '#F3EB0C': 'MEDIUM IMPACT',
    '#f3eb0c': 'MEDIUM IMPACT',
    '#ED3237': 'HIGH IMPACT',
    '#ed3237': 'HIGH IMPACT',
    '#842D2F': 'HIGH IMPACT',
    '#842d2f': 'HIGH IMPACT',
  } 

  function addNewCard(data, result, isCache = false){
    if(result === 'Win' || result === 'Loss' || result === 'Doji'){
      return;
    }

    const timeframe = localStorage.getItem('timeframe')

    const activeExist = (oldCard, data) => oldCard.title === data.title

    const isTimeframeEqual = data.timeframe === timeframe

    if(isCache){
      return setCardData((cardData) => {
        if(!isTimeframeEqual) return [...cardData]
          const dataFiltered = cardData.filter(item =>  item.timeframe === timeframe)
          const newCardData = [...dataFiltered, data];
          return uniqWith(newCardData, activeExist)
      });
    }
    
    setCardData((cardData) => { 
      const newCardData = [...cardData, data];
      return uniqWith(newCardData, activeExist)
    });
  }

  function removeCard(data, result){
    if(result === 'Win' || result === 'Loss' || result === 'Doji'){
      return setCardData(cardData => cardData.filter(item => item.id !== data.id));
    }
  }

  function handleTime(data){
    const minutes = parseInt(data.seconds / 60)
        const seconds = parseInt(data.seconds % 60)

        let minutesString = String(minutes)
        let secondsString = String(seconds)

        const minutesLessThanTen = (minutes < 10) ? true : false
        const secondsLessThanTen = (seconds < 10) ? true : false

        if(minutesLessThanTen) {
          minutesString = `0${minutesString}`
        }

        if(secondsLessThanTen) {
          secondsString = `0${secondsString}`
        }

        const dataTime = {
          minutes: [
            minutesString.split('')[0],
            minutesString.split('')[1],
          ],

          seconds: [
            secondsString.split('')[0],
            secondsString.split('')[1],
          ],
        }

        setTime(dataTime)
  }

  function addStatus(data, result){
    if(result === 'Win' || result === 'Loss' || result === 'Doji'){
      return;
    }

    const statusExist = (oldStatus, status) => oldStatus.id === status.id

    setStatus((status) => {
      const newStatus = [...status, data];
      return uniqWith(newStatus, statusExist)
    })
  }

  function addHourCard(dataHour){

    const hourExist = (oldHour, hour) => oldHour.id === hour.id
    
    setHourCard((hourCard) => {
      const newHour = [...hourCard, dataHour];
      return uniqWith(newHour, hourExist)
    })
  }

  function updateHourCard(dataHour){
    const currentUTC = parseInt(localStorage.getItem('currentutc'))

    const date = new Date()
    const oneMinuteInMiliseconds = 60000
    const oneHourInMiliseconds = 3600000
    const utcTime = date.getTime() + (date.getTimezoneOffset() * oneMinuteInMiliseconds);
    const time = formatDate(new Date(utcTime + (oneHourInMiliseconds * currentUTC)))?.split(' (')[0]
    let newTime = time?.split(', ')[1]?.split(':')[0]
    const regex = /(\d{2}):/
    const minute = Number(time?.split(', ')[1]?.split(':')[1])
    const oneHourInMinutes = 60
    const signalHour = dataHour?.hour?.split(':')[0]
    const fifteenMinutes = 15
    const biggerMinute = Math.max(Number(dataHour?.hour?.split(':')[1]), minute)
    const minorMinute = Math.min(Number(dataHour?.hour?.split(':')[1]), minute)
    const leftoverInMinutes = oneHourInMinutes - biggerMinute + minorMinute
    if((leftoverInMinutes <= fifteenMinutes) && signalHour < newTime){
      newTime = Number(newTime) - 1
    }
    if((leftoverInMinutes <= fifteenMinutes) && signalHour > newTime){
      newTime = Number(newTime) + 1
    }
    const regexNewTime = /(\d{2})/
    const hasTwoDigits = regexNewTime.exec(newTime)
    newTime = (hasTwoDigits)? `${newTime}:` : `0${newTime}:`
    newTime = (newTime === '24:')? '00:' : newTime

    return setHourCard((hourCard) => {
      const existHour = hourCard.some(item => item.id === dataHour.id)
      if(!existHour){
        return [...hourCard]
      }
      dataHour.hour = dataHour.hour.replace(regex, newTime)
      return hourCard.map((item) => {
        if(item.id === dataHour.id){
          return { ...item, hour: dataHour.hour }
        }
        return item
      })
    }) 
  }

  function returnSignalColor(percent){
    if(percent === 100){
      return 'signalGreen'
    }
    if(percent > 84 && percent < 100){
      return 'signalGreenMedium'
    }
    if(percent > 69 && percent < 85){
      return 'signalOrange'
    }
    if(percent < 70){
      return 'signalRed'
    }
  }

  function updateSignal(data, result){
    if(result === 'Win' || result === 'Loss' || result === 'Doji'){
      return;
    }

    setStatus((status) => {
      const existStatus = status.some(item => item.id === data.id)
      if(!existStatus){
        return [...status]
      }
      const statusIndex = status.findIndex(item => item.id === data.id)
      const newStatus = [...status]
      newStatus[statusIndex] = data
      return newStatus
    })
  }

  function handleTimeframeChange(connection, value){
    connection.send(
      JSON.stringify({
        name: "timeframe",
        data: value
      })
    )
  }

  function changeToTimeframeOne(){
    setCardData([])
    setStatus([])
    setIsTimeframeOneActived(false)
    setIsTimeframeFiveActived(true)
    return localStorage.setItem('timeframe', 'M1')
  }

  function changeToTimeframeFive(){
    setCardData([])
    setStatus([])
    setIsTimeframeOneActived(false)
    setIsTimeframeFiveActived(true)
    return localStorage.setItem('timeframe', 'M5')
  }
  
  useEffect(()=>{

    const connection = new WebSocket(url);
  
    connection.addEventListener("open", () => {
      connection.send(JSON.stringify({ bearer: token }));
    });
    
    connection.onmessage = (event) => {
      const jsonData = JSON.parse(event.data)
      const currentTimeframe = localStorage.getItem('timeframe')
      if (jsonData.instance === "connection") {
        connection.send({ name: "munna" });
      }
      if(jsonData.instance === "timer"){
        handleTimeframeChange(connection, currentTimeframe)
        handleTime(jsonData)
      }

      if(jsonData.instance === "signal"){

        const result = jsonData.card.result

        const impactColor = (jsonData.card.timezone === '#00b050' || jsonData.card.timezone === '#00B050')? '#3D943B' : jsonData.card.timezone

        const data = {
          id: jsonData.card_id, 
          timeframe: jsonData.card.timeframe,
          title: jsonData.card.active,
          date: jsonData.card.date,
          direction: jsonData.card.direction,
          color: impactColor,
          hour: jsonData.card.hour,
          impact: impactCode[impactColor],
          percent: jsonData.card.status.porcent
        }

        const signal = returnSignalColor(parseInt(jsonData.card.status.porcent))

        const dataStatus = {
          id: jsonData.card_id,
          signal,
          loading: jsonData.card.result,
          martigale: jsonData.card.martigale,
          trendGraph: jsonData.card.technical_summary
        }

        const dataHour = {
          id: jsonData.card_id,
          hour: jsonData.card.hour
        }

        addNewCard(data, result)
        addStatus(dataStatus, result, false)
        addHourCard(dataHour, jsonData.card.timeframe)
        updateHourCard(dataHour)
        updateSignal(dataStatus, result)
        removeCard(data, result)
      }

      if(jsonData.instance === "cache_signal"){
        const message = jsonData.message

        const isMessageEmpty = Object.keys(message).length === 0

        if(isMessageEmpty){
          return;
        }

        let messageArray = Object.entries(message).map(([id, value]) => {
          return { id: parseInt(id), ...value };
        });

        messageArray.map((item) => {
          const result = item.result

          const impactColor = (item.timezone === '#00b050' || item.timezone === '#00B050')? '#3D943B' : item.timezone

          const data = {
            id: item.id, 
            timeframe: item.timeframe,
            title: item.active,
            date: item.date,
            direction: item.direction,
            color: impactColor,
            hour: item.hour,
            impact: impactCode[impactColor],
            percent: item.status.porcent
          }

          const signal = returnSignalColor(parseInt(item.status.porcent))

          const dataStatus = {
            id: item.id,
            signal,
            loading: item.result,
            martigale: item.martigale,
            trendGraph: item.technical_summary
          }

          const dataHour = {
            id: item.id,
            hour: item.hour
          }

          addNewCard(data, result, true)
          addHourCard(dataHour)
          updateHourCard(dataHour)
          return addStatus(dataStatus, result)
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const contextValue = {
    cardData,
    time,
    status,
    hourCard,
    isTimeframeOneActived,
    isTimeframeFiveActived,
    setCardData,
    setStatus,
    updateHourCard,
    setIsTimeframeOneActived,
    setIsTimeframeFiveActived,
    changeToTimeframeOne,
    changeToTimeframeFive
  }


  return (
    <WebSocketContext.Provider value={contextValue}>
      { children }
    </WebSocketContext.Provider>
  )
}

export {
  WebSocketContext,
  WebSocketProvider
}