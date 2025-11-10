import { useEffect, useRef } from "react"
import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { CardContent } from "./components/CartContent"
import "./assets/css/Joystick.css"
import { toggleFullScreen } from "./utils/toggleFullScreen"
import { useJoystick } from "./utils/useJoystick"
import { BleTouch } from "./utils/BlueTouch"
import { sendData } from "./utils/sendData"
import { requestPermission } from "./utils/requestPermission"

// El joystick tendrá un deslizador horizontal y uno vertical
export const JoyStick = () => {
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
        sendData({ [comand]: '1' }, `${comand}-DOWN`)
    }

    const onBtnUp = (comand: string) => {
        sendData({ [comand]: '0' }, `${comand}-UP`)
    }

    return (
        <div className="mando-container no-select">

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
                            <p style={{ gridColumn: 'span 4', textAlign: 'center' }}>C-DOWN</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="botones-L">
                <Button
                    name='l1'
                    className="btn-L"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >L1</Button>
                <Button
                    name='l2'
                    className="btn-L"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >L2</Button>
                <Button
                    name='l3'
                    className="btn-L"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >L3</Button>
            </div>

            <div className="botones-R">
                <Button
                    name='r1'
                    className="btn-R"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >R1</Button>
                <Button
                    name='r2'
                    className="btn-R"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >R2</Button>
                <Button
                    name='r2'
                    className="btn-R"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >R3</Button>
            </div>

            <div className="flechas">
                <div></div>
                <Button
                    name='U'
                    className="flecha"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >▲</Button>
                <div></div>
                <Button
                    name='L'
                    className="flecha"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >◀</Button>
                <div></div>
                <Button
                    name='R'
                    className="flecha"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >▶</Button>
                <div></div>
                <Button
                    name='D'
                    className="flecha"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >▼</Button>
                <div></div>
            </div>


            <div className="botones-accion">
                <div></div>
                <Button
                    name='T'
                    className="btn-accion"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >△</Button>
                <div></div>
                <Button
                    name='C'
                    className="btn-accion"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >▢</Button>
                <div></div>
                <Button
                    name='O'
                    className="btn-accion"
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >◯</Button>
                <div></div>
                <Button
                    className="btn-accion"
                    name='X'
                    onPointerDown={onBtnDown}
                    onPointerUp={onBtnUp}
                >Ⅹ</Button>
                <div></div>
            </div>

            <Button
                name="Se"
                className="btn-selec"
                onPointerDown={onBtnDown}
                onPointerUp={onBtnUp}
            >Select</Button>

            <Button
                name="St"
                className="btn-start"
                onPointerDown={onBtnDown}
                onPointerUp={onBtnUp}
            >Start</Button>

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

        </div>
    );

}
