import './App.css'
import Bluetooth from './Bluetooth'
import { JoyStick } from './Joystick'

export const BleTouch = new Bluetooth({
  name                : 'CAR',
  service_id          : 0xffe0,
  characteristic_id   : 0xffe1,
  onReceive           : ()=>{
    console.log('Recibido')
  },
  onDisconnect        : ()=>{
    console.log('Desconectado')
  },
})

function App() {

  const connectBluetooth = async () => {
    console.log('Conectando a bluetooth')
    await BleTouch.connect()
    console.log('Conectato')
    BleTouch.send('Hola')
  }

  return (
    <>
      <div className="buttonsBox">
        <button onClick={toggleFullScreen}>Pantalla completa</button>
        <button onClick={connectBluetooth}>Conectar</button>
        <button onClick={BleTouch.disconnect}>Desconectar</button>
      </div>
      <JoyStick />
    </>
  )
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

export default App
