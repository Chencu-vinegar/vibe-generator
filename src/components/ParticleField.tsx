import { useEffect, useRef } from 'react'
import type { ParticleKind, Vibe } from '../types'
import { withAlpha } from '../lib/color'
import { mulberry32 } from '../lib/random'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  phase: number
  drift: number
  length: number
}

const PARTICLE_COUNTS: Record<ParticleKind, number> = {
  rain: 96,
  mist: 15,
  snow: 54,
  dust: 58,
  ember: 38,
}

function createParticles(
  kind: ParticleKind,
  density: number,
  width: number,
  height: number,
  seed: number,
): Particle[] {
  const rng = mulberry32(seed * 131 + width)
  const mobileFactor = width < 720 ? 0.62 : 1
  const count = Math.round(PARTICLE_COUNTS[kind] * density * mobileFactor)

  return Array.from({ length: count }, () => {
    if (kind === 'rain') {
      return {
        x: rng() * width,
        y: rng() * height,
        vx: -28 - rng() * 44,
        vy: 190 + rng() * 250,
        radius: 0.7 + rng() * 0.9,
        alpha: 0.08 + rng() * 0.24,
        phase: rng() * Math.PI * 2,
        drift: 0,
        length: 8 + rng() * 18,
      }
    }

    if (kind === 'mist') {
      return {
        x: rng() * width,
        y: rng() * height,
        vx: -2 + rng() * 4,
        vy: -1.2 + rng() * 2.4,
        radius: 100 + rng() * 190,
        alpha: 0.018 + rng() * 0.045,
        phase: rng() * Math.PI * 2,
        drift: 14 + rng() * 26,
        length: 0,
      }
    }

    if (kind === 'snow') {
      return {
        x: rng() * width,
        y: rng() * height,
        vx: -8 + rng() * 16,
        vy: 10 + rng() * 26,
        radius: 0.8 + rng() * 2,
        alpha: 0.18 + rng() * 0.42,
        phase: rng() * Math.PI * 2,
        drift: 8 + rng() * 22,
        length: 0,
      }
    }

    if (kind === 'ember') {
      return {
        x: rng() * width,
        y: height * 0.55 + rng() * height * 0.55,
        vx: -5 + rng() * 10,
        vy: -10 - rng() * 28,
        radius: 0.8 + rng() * 2.1,
        alpha: 0.16 + rng() * 0.5,
        phase: rng() * Math.PI * 2,
        drift: 10 + rng() * 26,
        length: 0,
      }
    }

    return {
      x: rng() * width,
      y: rng() * height,
      vx: -3 + rng() * 6,
      vy: -4 + rng() * 8,
      radius: 0.5 + rng() * 1.6,
      alpha: 0.12 + rng() * 0.36,
      phase: rng() * Math.PI * 2,
      drift: 5 + rng() * 15,
      length: 0,
    }
  })
}

export function ParticleField({ vibe }: { vibe: Vibe }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const { kind, density, speed } = vibe.particle
    const isDark = vibe.palette.mode === 'dark'
    const ink = vibe.palette.colors[4].hex
    const accent = vibe.palette.accent
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = window.innerWidth
    let height = window.innerHeight
    let particles: Particle[] = []
    let frame = 0
    let lastTime = performance.now()
    let particleSeed = vibe.seed

    const setSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = createParticles(kind, density, width, height, particleSeed)
    }

    const draw = (time: number) => {
      const delta = Math.min(48, time - lastTime) / 1000
      lastTime = time
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = isDark ? 'screen' : 'source-over'

      if (kind === 'mist') {
        particles.forEach((particle) => {
          particle.x += particle.vx * delta * (0.35 + speed)
          particle.y += particle.vy * delta * (0.35 + speed)
          const drift = Math.sin(time * 0.00008 + particle.phase) * particle.drift
          if (particle.x < -particle.radius) particle.x = width + particle.radius
          if (particle.x > width + particle.radius) particle.x = -particle.radius
          if (particle.y < -particle.radius) particle.y = height + particle.radius
          if (particle.y > height + particle.radius) particle.y = -particle.radius

          const gradient = context.createRadialGradient(
            particle.x + drift,
            particle.y,
            0,
            particle.x + drift,
            particle.y,
            particle.radius,
          )
          gradient.addColorStop(0, withAlpha(ink, particle.alpha))
          gradient.addColorStop(0.55, withAlpha(ink, particle.alpha * 0.55))
          gradient.addColorStop(1, withAlpha(ink, 0))
          context.fillStyle = gradient
          context.beginPath()
          context.arc(particle.x + drift, particle.y, particle.radius, 0, Math.PI * 2)
          context.fill()
        })
        context.globalCompositeOperation = 'source-over'
        return
      }

      if (kind === 'rain') {
        context.lineCap = 'round'
        particles.forEach((particle) => {
          particle.x += particle.vx * delta * speed
          particle.y += particle.vy * delta * speed
          if (particle.y > height + 30) {
            particle.y = -30
            particle.x = Math.random() * width
          }
          if (particle.x < -30) particle.x = width + 30

          context.strokeStyle = withAlpha(ink, particle.alpha)
          context.lineWidth = particle.radius
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(
            particle.x - particle.vx * 0.04,
            particle.y - particle.length,
          )
          context.stroke()
        })
        context.globalCompositeOperation = 'source-over'
        return
      }

      if (kind === 'snow') {
        particles.forEach((particle) => {
          const sway = Math.sin(time * 0.0006 + particle.phase) * particle.drift
          particle.x += (particle.vx + sway * 0.12) * delta * speed
          particle.y += particle.vy * delta * speed
          if (particle.y > height + 20) {
            particle.y = -20
            particle.x = Math.random() * width
          }
          if (particle.x < -20) particle.x = width + 20
          if (particle.x > width + 20) particle.x = -20

          context.fillStyle = withAlpha(ink, particle.alpha)
          context.beginPath()
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          context.fill()
        })
        context.globalCompositeOperation = 'source-over'
        return
      }

      if (kind === 'ember') {
        particles.forEach((particle) => {
          const sway = Math.sin(time * 0.0007 + particle.phase) * particle.drift
          particle.x += (particle.vx + sway * 0.14) * delta * speed
          particle.y += particle.vy * delta * speed
          if (particle.y < -20) {
            particle.y = height + 20
            particle.x = Math.random() * width
          }
          if (particle.x < -20) particle.x = width + 20
          if (particle.x > width + 20) particle.x = -20

          const flicker = 0.55 + Math.sin(time * 0.002 + particle.phase) * 0.35
          context.fillStyle = withAlpha(accent, particle.alpha * flicker)
          context.beginPath()
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          context.fill()
          context.fillStyle = withAlpha(accent, particle.alpha * 0.16)
          context.beginPath()
          context.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2)
          context.fill()
        })
        context.globalCompositeOperation = 'source-over'
        return
      }

      particles.forEach((particle) => {
        const flicker = 0.7 + Math.sin(time * 0.001 + particle.phase) * 0.3
        particle.x += particle.vx * delta * speed
        particle.y += particle.vy * delta * speed
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20
        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20

        context.fillStyle = withAlpha(ink, particle.alpha * flicker)
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      })
      context.globalCompositeOperation = 'source-over'
    }

    const loop = (time: number) => {
      if (document.hidden) {
        frame = 0
        return
      }
      draw(time)
      frame = window.requestAnimationFrame(loop)
    }

    const start = () => {
      setSize()
      lastTime = performance.now()
      if (reducedMotion) {
        draw(performance.now())
        return
      }
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(loop)
    }

    const handleResize = () => {
      window.cancelAnimationFrame(frame)
      start()
    }

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame)
        frame = 0
      } else if (!reducedMotion && !frame) {
        lastTime = performance.now()
        frame = window.requestAnimationFrame(loop)
      }
    }

    start()
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [vibe])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
