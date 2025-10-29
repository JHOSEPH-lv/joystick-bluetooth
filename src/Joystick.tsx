import { useEffect, useRef } from "react"
import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { CardContent } from "./components/CartContent"
import "./assets/css/Joystick.css"
import { toggleFullScreen } from "./utils/toggleFullScreen"
import { useJoystick } from "./utils/useJoystick"
import { BleTouch } from "./utils/BlueTouch"

let lv = 0
let lh = 0
let rv = 0
let rh = 0
let useControl = ''

// function sendHV(newH: number, newV: number) {
//     // 'comando:valor'
//     // 'lv:100'
//     // 'lh:50'
//     const HVToSend = `${newH},${newV}`
//     if (HVToSend !== HV) {
//         BleTouch.send(HVToSend)
//         H = newH
//         V = newV
//         HV = HVToSend
//     }
// }

// 'comando:valor,comando:valor,...'
// 'lv:100'
// 'lh:50'
// objeto: {lv:100, lh:50, ...}
function sendData(objeto: Record<string, string | number>) {
    const array: string[] = []
    for (const [command, value] of Object.entries(objeto)) {
        array.push(`${command}:${value}`)
    }
    const message = array.join(',')
    console.log(message)
    if(
        objeto.lv!==undefined ||
        objeto.rv!==undefined
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
        `
    }
    BleTouch.send(message)
}

function printHV(stringHV: string) {
    const w = document.getElementById('w')
    if (w) {
        w.innerHTML = stringHV
    }
}

function convertValue(value: number) {
    if (value < -2) return value + 2
    else if (value <= 2) return 0
    else return value - 2
}



export const JoyStick = () => {
    // El joystick tendrá un deslizador horizontal y uno vertical

    const leftStickRef = useRef<HTMLDivElement>(null)
    const leftBallRef = useRef<HTMLDivElement>(null)
    const rightStickRef = useRef<HTMLDivElement>(null)
    const rightBallRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        requestPermission()
    }, [])

    useJoystick({
        stickRef: leftStickRef,
        ballRef: leftBallRef,
        onMove: (lh, lv) => {
            sendData({ lh, lv })
        },
    })

    useJoystick({
        stickRef: rightStickRef,
        ballRef: rightBallRef,
        onMove: (rh, rv) => {
            sendData({ rh, rv })
        },
    })

    const handleConectar = () => {
        BleTouch.connect()
    }

    const handleDesconectar = () => {
        BleTouch.disconnect()
    }

    const onBtnDown = (comand: string) => {
        sendData({ [comand]: '1' })
    }

    const onBtnUp = (comand: string) => {
        sendData({ [comand]: '0' })
    }

    return (
        <div className="mando-container">

            <div className="panel-superior">
                <div className="panel-superior-botones">
                    <Button onClick={handleConectar} className="btn-conectar">Conectar</Button>
                    <Button className="btn-pantalla" onClick={toggleFullScreen}>Pantalla completa</Button>
                    <Button onClick={handleDesconectar} className="btn-desconectar">Desconectar</Button>
                </div>
                <Card className="pantalla-monitoreo">
                    <CardContent>
                        <div className="texto-datos">
                            <p>lv:</p>
                            <p>-</p>
                            <p>rv:</p>
                            <p>-</p>
                            <p>lh:</p>
                            <p>-</p>
                            <p>rh:</p>
                            <p>-</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="botones-L">
                <Button
                    className="btn-L"
                    onMouseDown={() => onBtnDown('l1')}
                    onMouseUp={() => onBtnUp('l1')}
                >L1</Button>
                <Button
                    className="btn-L"
                    onMouseDown={() => onBtnDown('l2')}
                    onMouseUp={() => onBtnUp('l2')}
                >L2</Button>
                <Button
                    className="btn-L"
                    onMouseDown={() => onBtnDown('l3')}
                    onMouseUp={() => onBtnUp('l3')}
                >L3</Button>
            </div>

            <div className="botones-R">
                <Button className="btn-R"
                    onMouseDown={() => onBtnDown('r1')}
                    onMouseUp={() => onBtnUp('r1')}
                >R1</Button>
                <Button className="btn-R"
                    onMouseDown={() => onBtnDown('r2')}
                    onMouseUp={() => onBtnUp('r2')}
                >R2</Button>
                <Button className="btn-R"
                    onMouseDown={() => onBtnDown('r3')}
                    onMouseUp={() => onBtnUp('r3')}
                >R3</Button>
            </div>

            <div ref={leftStickRef} className="palanca palanca-izquierda">
                <div ref={leftBallRef} className="palanca-bolita">
                    <div className="palanca-bolita-trasladada"></div>
                </div>
            </div>

            <div ref={rightStickRef} className="palanca palanca-derecha">
                <div ref={rightBallRef} className="palanca-bolita">
                    <div className="palanca-bolita-trasladada"></div>
                </div>
            </div>

            <div className="flechas">
                <div></div>
                <Button
                    className="flecha"
                    onMouseDown={() => onBtnDown('U')}
                    onMouseUp={() => onBtnUp('U')}
                >▲</Button>
                <div></div>
                <Button
                    className="flecha"
                    onMouseDown={() => onBtnDown('L')}
                    onMouseUp={() => onBtnUp('L')}
                >◀</Button>
                <div></div>
                <Button
                    className="flecha"
                    onMouseDown={() => onBtnDown('R')}
                    onMouseUp={() => onBtnUp('R')}
                >▶</Button>
                <div></div>
                <Button
                    className="flecha"
                    onMouseDown={() => onBtnDown('D')}
                    onMouseUp={() => onBtnUp('D')}
                >▼</Button>
                <div></div>
            </div>


            <div className="botones-accion">
                <div></div>
                <Button
                    className="btn-accion"
                    onMouseDown={() => onBtnDown('T')}
                    onMouseUp={() => onBtnUp('T')}
                >△</Button>
                <div></div>
                <Button
                    className="btn-accion"
                    onMouseDown={() => onBtnDown('C')}
                    onMouseUp={() => onBtnUp('C')}
                >▢</Button>
                <div></div>
                <Button
                    className="btn-accion"
                    onMouseDown={() => onBtnDown('O')}
                    onMouseUp={() => onBtnUp('O')}
                >◯</Button>
                <div></div>
                <Button
                    className="btn-accion"
                    onMouseDown={() => onBtnDown('X')}
                    onMouseUp={() => onBtnUp('X')}
                >Ⅹ</Button>
                <div></div>
            </div>

            <Button
                className="btn-selec"
                onMouseDown={() => onBtnDown('Se')}
                onMouseUp={() => onBtnUp('Se')}
            >Select</Button>

            <Button 
                className="btn-start"
                onMouseDown={() => onBtnDown('St')}
                onMouseUp={() => onBtnUp('St')}
            >Start</Button>
        </div>
    );

}

interface IDeviceOrientationEvent {
    requestPermission: () => Promise<PermissionState>;
}

async function requestPermission() {
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        (DeviceOrientationEvent as unknown as IDeviceOrientationEvent).requestPermission) {
        try {
            const permission = await (DeviceOrientationEvent as unknown as IDeviceOrientationEvent).requestPermission();
            if (permission === "granted") {
                startOrientation();
            } else {
                console.log("Permiso denegado.");
            }
        } catch (error) {
            console.error("Error al solicitar permiso:", error);
        }
    } else {
        startOrientation();
    }
}


function startOrientation() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (event: DeviceOrientationEvent) => {
            if (useControl !== 'motion') return
            const x = document.getElementById('x')
            const y = document.getElementById('y')
            const z = document.getElementById('z')

            const beta = event.beta || 0;
            const gamma = event.gamma || 0;
            const alpha = event.alpha || 0;

            if (x && y && z) {
                x.innerHTML = beta.toFixed(2) || '0'
                y.innerHTML = gamma.toFixed(2) || '0'
                z.innerHTML = alpha.toFixed(2) || '0'
            }

            // eje y: 30° -> avanzar (máximo valor)
            // eje y: -30° -> retroceder (mínimo valor)
            // eje x: 30° -> derecha (máximo valor)
            // eje x: -30° -> izquierda (mínimo valor)

            const betaLimit = beta > 30 ? 30 : beta < -30 ? -30 : beta
            const gammaLimit = gamma > 30 ? 30 : gamma < -30 ? -30 : gamma

            // adapatar los valores de x e y a un rango de -10 a 10
            const xValue = Math.floor(betaLimit / 3)
            const yValue = Math.floor(gammaLimit / 3)

            const H = convertValue(xValue)
            const V = convertValue(yValue)
            // sendHV(H, V)
            printHV(`${H},${V}`)
        });
    } else {
        console.log("DeviceOrientationEvent no está soportado en este navegador.");
    }
}