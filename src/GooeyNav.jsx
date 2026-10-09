import { useCallback, useEffect, useRef, useState } from 'react'
import './GooeyNav.css'

const clampIndex = (index, length) => {
  if (length <= 0) return 0
  return Math.min(Math.max(index, 0), length - 1)
}

function GooeyNav({
  items = [],
  onNavigate,
  initialActiveIndex = 0,
  animationTime = 720,
  particleCount = 10,
  particleDistances = [54, 8],
  particleR = 72,
  timeVariance = 180,
  colors = [1, 1, 2, 1, 3, 2],
  ariaLabel = '主导航',
  className = '',
}) {
  const containerRef = useRef(null)
  const navRef = useRef(null)
  const filterRef = useRef(null)
  const textRef = useRef(null)
  const timeoutIds = useRef(new Set())
  const frameRef = useRef(0)
  const reducedMotion = useRef(false)
  const [activeIndex, setActiveIndex] = useState(() => clampIndex(initialActiveIndex, items.length))

  const clearParticles = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutIds.current.clear()
    filterRef.current?.classList.remove('is-active')
    filterRef.current?.querySelectorAll('.gooey-nav__particle').forEach((particle) => particle.remove())
  }, [])

  const updateEffectPosition = useCallback((element) => {
    const container = containerRef.current
    const filter = filterRef.current
    const text = textRef.current
    if (!container || !element || !filter || !text) return

    const containerRect = container.getBoundingClientRect()
    const itemRect = element.getBoundingClientRect()
    const position = {
      left: `${itemRect.left - containerRect.left}px`,
      top: `${itemRect.top - containerRect.top}px`,
      width: `${itemRect.width}px`,
      height: `${itemRect.height}px`,
    }

    Object.assign(filter.style, position)
    Object.assign(text.style, position)
    text.textContent = element.textContent
  }, [])

  const makeParticles = useCallback(() => {
    const element = filterRef.current
    if (!element || reducedMotion.current || particleCount <= 0) return

    const noise = (amount = 1) => amount / 2 - Math.random() * amount
    const getPosition = (distance, pointIndex) => {
      const angle = (((360 + noise(7)) / particleCount) * pointIndex * Math.PI) / 180
      return [distance * Math.cos(angle), distance * Math.sin(angle)]
    }

    const bubbleTime = animationTime * 2 + timeVariance
    element.style.setProperty('--gooey-time', `${bubbleTime}ms`)
    element.classList.remove('is-active')

    for (let index = 0; index < particleCount; index += 1) {
      const particleTime = Math.max(320, animationTime * 2 + noise(timeVariance * 2))
      const rotationNoise = noise(particleR / 10)
      const start = getPosition(particleDistances[0], particleCount - index)
      const end = getPosition(particleDistances[1] + noise(6), particleCount - index)
      const rotation = rotationNoise > 0
        ? (rotationNoise + particleR / 20) * 10
        : (rotationNoise - particleR / 20) * 10

      const timeoutId = window.setTimeout(() => {
        timeoutIds.current.delete(timeoutId)
        if (!filterRef.current) return

        const particle = document.createElement('span')
        const point = document.createElement('span')
        particle.className = 'gooey-nav__particle'
        point.className = 'gooey-nav__point'
        particle.setAttribute('aria-hidden', 'true')
        particle.style.setProperty('--start-x', `${start[0]}px`)
        particle.style.setProperty('--start-y', `${start[1]}px`)
        particle.style.setProperty('--end-x', `${end[0]}px`)
        particle.style.setProperty('--end-y', `${end[1]}px`)
        particle.style.setProperty('--particle-time', `${particleTime}ms`)
        particle.style.setProperty('--particle-scale', `${1 + noise(0.18)}`)
        particle.style.setProperty('--particle-color', `var(--gooey-color-${colors[Math.floor(Math.random() * colors.length)]}, var(--paper, #f0eee7))`)
        particle.style.setProperty('--particle-rotate', `${rotation}deg`)
        particle.appendChild(point)
        filterRef.current.appendChild(particle)

        frameRef.current = requestAnimationFrame(() => {
          filterRef.current?.classList.add('is-active')
          frameRef.current = 0
        })

        const removalId = window.setTimeout(() => {
          timeoutIds.current.delete(removalId)
          particle.remove()
        }, particleTime)
        timeoutIds.current.add(removalId)
      }, 24)

      timeoutIds.current.add(timeoutId)
    }
  }, [animationTime, colors, particleCount, particleDistances, particleR, timeVariance])

  const activateItem = useCallback((index, element, event) => {
    const nextIndex = clampIndex(index, items.length)
    const changed = nextIndex !== activeIndex

    if (changed) {
      setActiveIndex(nextIndex)
      updateEffectPosition(element)
      clearParticles()

      if (textRef.current) {
        textRef.current.classList.remove('is-active')
        void textRef.current.offsetWidth
        textRef.current.classList.add('is-active')
      }

      makeParticles()
    }

    onNavigate?.(items[nextIndex], nextIndex, event)
  }, [activeIndex, clearParticles, items, makeParticles, onNavigate, updateEffectPosition])

  const handleKeyDown = (event, index) => {
    const buttons = navRef.current?.querySelectorAll('.gooey-nav__button')
    if (!buttons?.length) return

    let nextIndex
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = buttons.length - 1

    if (nextIndex !== undefined) {
      event.preventDefault()
      buttons[nextIndex]?.focus()
    }
  }

  useEffect(() => {
    setActiveIndex((current) => clampIndex(current, items.length))
  }, [items.length])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => { reducedMotion.current = motionQuery.matches }
    updateMotionPreference()
    motionQuery.addEventListener?.('change', updateMotionPreference)

    return () => motionQuery.removeEventListener?.('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const activeButton = navRef.current?.querySelectorAll('.gooey-nav__button')[activeIndex]
    if (activeButton) {
      updateEffectPosition(activeButton)
      textRef.current?.classList.add('is-active')
    }

    const updatePosition = () => {
      const currentButton = navRef.current?.querySelectorAll('.gooey-nav__button')[activeIndex]
      if (currentButton) updateEffectPosition(currentButton)
    }

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updatePosition)
    if (containerRef.current) observer?.observe(containerRef.current)
    window.addEventListener('resize', updatePosition, { passive: true })

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updatePosition)
    }
  }, [activeIndex, items, updateEffectPosition])

  useEffect(() => () => { clearParticles(); cancelAnimationFrame(frameRef.current) }, [clearParticles])

  return (
    <div
      className={`gooey-nav ${className}`.trim()}
      ref={containerRef}
      style={{ '--gooey-animation-time': `${animationTime}ms` }}
    >
      <nav aria-label={ariaLabel}>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li className={activeIndex === index ? 'is-active' : ''} key={item.id ?? item.href ?? item.label}>
              <button
                className="gooey-nav__button"
                type="button"
                aria-current={activeIndex === index ? 'page' : undefined}
                onClick={(event) => activateItem(index, event.currentTarget, event)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {item.number && <span className="gooey-nav__number" aria-hidden="true">{item.number}</span>}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <span className="gooey-nav__effect gooey-nav__filter" ref={filterRef} aria-hidden="true" />
      <span className="gooey-nav__effect gooey-nav__text" ref={textRef} aria-hidden="true" />
    </div>
  )
}

export default GooeyNav
