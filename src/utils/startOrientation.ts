import { printHV } from "./printHV";

let useControl = ''

export function startOrientation() {
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


function convertValue(value: number) {
    if (value < -2) return value + 2
    else if (value <= 2) return 0
    else return value - 2
}