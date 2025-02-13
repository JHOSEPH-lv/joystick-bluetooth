import { useState } from 'react'
import './assets/css/App.css'
import Bluetooth from './core/Bluetooth/Bluetooth'
import { JoyStick } from './Joystick'

export const BleTouch = new Bluetooth({
  name                : 'CAR',
  service_id          : 0xffe0,
  characteristic_id   : 0xffe1,
  onReceive           : ()=>{
    console.log('Falta programar que hacer si recibe algo')
  },
  onDisconnect        : ()=>{
    console.log('El bluetooth se ha desconectado')
  },
})

function App() {
  const [control, setControl] = useState('slider')

  const controlBtnTxt = control === 'slider' ? 'deslizadores' : 'movimiento'

  const connectBluetooth = async () => {
    await BleTouch.connect()
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  const toggleControl = () => {
    if (control === 'slider') setControl('motion')
    else setControl('slider')
  }

  return (
    <>
      <div className="buttonsBox">
        <button onClick={toggleFullScreen}>Pantalla completa</button>
        <button onClick={connectBluetooth}>Conectar</button>
        <button onClick={BleTouch.disconnect}>Desconectar</button>
        <button onClick={toggleControl}>Control {controlBtnTxt}</button>
      </div>
      <JoyStick control={control}/>
    </>
  )
}



export default App
