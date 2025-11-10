import { useEffect, useRef } from 'react'

interface UseJoystickOptions {
  stickRef: React.RefObject<HTMLDivElement | null>
  ballRef: React.RefObject<HTMLDivElement | null>
  onMove?: (H: number, V: number) => void
  returnToCenterOnRelease?: boolean
}

/**
 * Hook joystick usando Pointer Events para soporte multi-touch.
 */
export const useJoystick = ({
  stickRef,
  ballRef,
  onMove,
  returnToCenterOnRelease = true,
}: UseJoystickOptions) => {
  // guardamos el pointerId activo para esta instancia
  const activePointerId = useRef<number | null>(null)
  const isDragging = useRef(false)

  useEffect(() => {
    const stick = stickRef.current
    const ball = ballRef.current
    if (!stick || !ball) return

    const moveHandler = (evt: PointerEvent) => {
      // si no corresponde al pointer activo, ignorar
      if (!isDragging.current || activePointerId.current === null) return
      if ((evt as PointerEvent).pointerId !== activePointerId.current) return

      const rect = stick.getBoundingClientRect()
      const ballInfo = ball.getBoundingClientRect()
      const ballWidth = ballInfo.width

      const radius = rect.width / 2
      const centerX = rect.left + radius
      const centerY = rect.top + radius

      const clientX = evt.clientX
      const clientY = evt.clientY

      const offsetX = clientX - centerX
      const offsetY = clientY - centerY

      const distance = Math.min(Math.sqrt(offsetX * offsetX + offsetY * offsetY), radius)
      const angle = Math.atan2(offsetY, offsetX)
      const x = distance * Math.cos(angle) 
      const y = distance * Math.sin(angle) 

      // mover la bola (relativa al contenedor que ya está centrado)
      ball.style.transform = `translate(${x - ballWidth/2}px, ${y - ballWidth/2}px)`

      const H = Math.round((x / radius) * 100)
      const V = Math.round((-y / radius) * 100) // invertir Y
      onMove?.(H, V)
    }

    const downHandler = (evt: PointerEvent) => {
      // solo aceptar botones principales (mouse) o touch/stylus
      if (evt.pointerType === 'mouse' && evt.button !== 0) return
      // capturamos el pointer para esta bola (evita fugas de eventos)
      try {
        (evt.target as Element).setPointerCapture(evt.pointerId)
      } catch (err) {
        // algunos navegadores pueden lanzar si no soportan pointer capture
      }

      activePointerId.current = evt.pointerId
      isDragging.current = true

      // mover inmediatamente al lugar inicial
      moveHandler(evt)
    }

    const upHandler = (evt: PointerEvent) => {
      // solo responder si es el mismo pointer
      if (activePointerId.current !== evt.pointerId) return
      isDragging.current = false
      activePointerId.current = null
      try {
        (evt.target as Element).releasePointerCapture(evt.pointerId)
      } catch (err) {}

      if (returnToCenterOnRelease) {
        // restaurar al centro (0,0)
        const ballInfo = ball.getBoundingClientRect()
        const x = ballInfo.width/2
        const y = ballInfo.width/2
        ball.style.transform = `translate(-${x}px, -${y}px)`
        onMove?.(0, 0)
      }
    }

    // registrar listeners: pointer events en la bola (down), movimiento y up en window
    ball.addEventListener('pointerdown', downHandler as EventListener)
    window.addEventListener('pointermove', moveHandler as EventListener)
    window.addEventListener('pointerup', upHandler as EventListener)
    window.addEventListener('pointercancel', upHandler as EventListener)

    // cleanup
    return () => {
      ball.removeEventListener('pointerdown', downHandler as EventListener)
      window.removeEventListener('pointermove', moveHandler as EventListener)
      window.removeEventListener('pointerup', upHandler as EventListener)
      window.removeEventListener('pointercancel', upHandler as EventListener)
      activePointerId.current = null
      isDragging.current = false
    }
  }, [stickRef, ballRef, onMove, returnToCenterOnRelease])
}