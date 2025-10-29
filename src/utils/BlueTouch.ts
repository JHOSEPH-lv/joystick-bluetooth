import Bluetooth from "../core/Bluetooth/Bluetooth"

export const BleTouch = new Bluetooth({
  name: 'CAR', // nombre de bluetooth que busca
  service_id: 0xffe0,
  characteristic_id: 0xffe1,
  onReceive: () => {
    console.log('Falta programar que hacer si recibe algo')
  },
  onDisconnect: () => {
    console.log('El bluetooth se ha desconectado')
  },
})