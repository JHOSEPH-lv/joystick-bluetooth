import { useEffect } from "react"
import { BleTouch } from "./App"

export const JoyStick = () => {
    // El joystick tendrá un deslizador horizontal y uno vertical

    useEffect (() => {
        requestPermission()
    }, [])

    const leftRigthHandler = (value:string) => {
        const num = Number(value)

        // Crear el mensaje a enviar
        const message = (() => {
            if (num < -2) return `L${-num-2}`
            else if (num <= 2) return 'M'
            else return `R${num - 2}`
        })()

        // Enviar el valor al controlador
        console.log(message)
        // BleTouch.send(message)
    }

    const leftTopBotomHandler = (value:string) => {
        const num = Number(value)

        // Crear el mensaje a enviar
        const message = (() => {
            if (num < -2) return `B${-num-2}`
            else if (num <= 2) return 'S'
            else return `T${num - 2}`
        })()

        // Enviar el valor al controlador
        console.log(message)
        // BleTouch.send(message)
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
            const x = document.getElementById('x')
            const y = document.getElementById('y')
            const z = document.getElementById('z')
            const w = document.getElementById('w')

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

            const H = (()=>{
                if (xValue < -2) return xValue + 2
                else if (xValue <= 2) return 0
                else return xValue - 2
            })()

            const V = (()=>{
                if (yValue < -2) return yValue + 2
                else if (yValue <= 2) return 0
                else return yValue - 2
            })()

            if (w) {
                w.innerHTML = `${H},${V}`
                BleTouch.send(`${H},${V}`)
            }

        });
    } else {
        console.log("DeviceOrientationEvent no está soportado en este navegador.");
    }
}