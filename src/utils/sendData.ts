import { BleTouch } from "./BlueTouch"

let lv = 0
let lh = 0
let rv = 0
let rh = 0
let btnTxtPrev = ''

// 'comando:valor,comando:valor,...'
// 'lv:100'
// 'lh:50'
// objeto: {lv:100, lh:50, ...}
export function sendData(objeto: Record<string, string | number>, btnTxt = '') {
    if (btnTxt) btnTxtPrev = btnTxt
    console.log(btnTxt)
    const array: string[] = []
    for (const [command, value] of Object.entries(objeto)) {
        array.push(`${command}:${value}`)
    }
    const message = array.join(',')
    console.log(message)
    if(
        objeto.lv!==undefined ||
        objeto.rv!==undefined || 
        btnTxt
    ){
        if(objeto.lh!==undefined) lh = objeto.lh as number
        if(objeto.lv!==undefined) lv = objeto.lv as number
        if(objeto.rh!==undefined) rh = objeto.rh as number
        if(objeto.rv!==undefined) rv = objeto.rv as number
        const textoDatos = document.querySelector('.texto-datos')
        if(textoDatos) textoDatos.innerHTML = `
            <p>lv:</p>
            <p>${lv}</p>
            <p>rv:</p>
            <p>${rv}</p>
            <p>lh:</p>
            <p>${lh}</p>
            <p>rh:</p>
            <p>${rh}</p> 
            <p style="grid-column: span 4; text-align: center;">${btnTxt || btnTxtPrev}</p>
        `
    }
    BleTouch.send(message)
}