import { useEffect } from "react"
import { BleTouch } from "./App"

let H: number = 0
let V: number = 0
let HV = '0,0'
let useControl = ''

function sendHV(newH: number, newV: number) {
    const HVToSend = `${newH},${newV}`
    if (HVToSend !== HV) {
        BleTouch.send(HVToSend)
        H = newH
        V = newV
        HV = HVToSend
    }
}

function printHV(stringHV: string) {
    const w = document.getElementById('w')
    if (w) {
        w.innerHTML = stringHV
    }
}

function convertValue(value:number) {
    if (value < -2) return value + 2
    else if (value <= 2) return 0
    else return value - 2
}

interface JoystickProps {
    control: string
}

export const JoyStick = ({control}:JoystickProps) => {
    // El joystick tendrá un deslizador horizontal y uno vertical

    useEffect (() => {
        requestPermission()
    }, [])

    useEffect (() => {
        useControl = control
    }, [control])

    const leftRigthHandler = (value:string) => {
        if (useControl !== 'slider') return
        const num = Number(value)
        const H = convertValue(num)
        sendHV(H,V)
        printHV(`${H},${V}`)
    }

    const leftTopBotomHandler = (value:string) => {
        if (useControl !== 'slider') return
        const num = Number(value)
        const V = convertValue(num)
        sendHV(H,V)
        printHV(`${H},${V}`)
    }

    return (
        <div className="joystick">
            <div style={{transform: 'scale(1.5)'}}>
                <input  
                    type="range" 
                    min="-10" 
                    max="10" 
                    step="1" 
                    onChange={(e)=>{
                        leftRigthHandler(e.target.value)
                    }}
                />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '10em'
            }}>
                <span id="x">0</span>{' '}
                <span id="y">0</span>{' '}
                <span id="z">0</span>
                <span id="w">0,0</span>
            </div>
            <div style={{transform: 'scale(1.5)'}}>
                <input 
                    type="range" 
                    min="-10" 
                    max="10" 
                    step="1" 
                    style={{
                        transform: 'rotate(-90deg)',
                    }}
                    onChange={(e)=>{
                        leftTopBotomHandler(e.target.value)
                    }}
                />
            </div>
        </div>
    )
}

interface IDeviceOrientationEvent {
    requestPermission: () => Promise<PermissionState>;
}

async function requestPermission() {
    if (
        typeof DeviceOrientationEvent !== "undefined" && 
        (DeviceOrientationEvent as unknown as IDeviceOrientationEvent).requestPermission) 
    {
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
            sendHV(H,V)
            printHV(`${H},${V}`)
        });
    } else {
        console.log("DeviceOrientationEvent no está soportado en este navegador.");
    }
}