import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GooeyNav from './GooeyNav'
import './portfolio.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`

function BorderGlow({ children, className = '', colors = ['#f18268', '#a9dfe0', '#a9dbbf'] }) {
  const cardRef = useRef(null)
  const rectRef = useRef(null)
  const pointRef = useRef(null)
  const frameRef = useRef(0)
  const onPointerMove = (event) => {
    const card = cardRef.current
    if (!card) return
    pointRef.current = { x: event.clientX, y: event.clientY }
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      const rect = rectRef.current || card.getBoundingClientRect()
      const point = pointRef.current
      if (!point) return
      const x = point.x - rect.left
      const y = point.y - rect.top
      const edge = Math.min(x, y, rect.width - x, rect.height - y)
      const proximity = Math.max(0, Math.min(100, 100 - (edge / 120) * 100))
      const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * 180 / Math.PI + 90
      card.style.setProperty('--edge-proximity', proximity.toFixed(2))
      card.style.setProperty('--cursor-angle', `${angle}deg`)
      frameRef.current = 0
    })
  }
  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])
  const onPointerLeave = () => {
    rectRef.current = null
    pointRef.current = null
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    cardRef.current?.style.setProperty('--edge-proximity', '0')
  }
  return <div ref={cardRef} className={`border-glow-card ${className}`} style={{ '--glow-one': colors[0], '--glow-two': colors[1], '--glow-three': colors[2] }} onPointerEnter={() => { rectRef.current = cardRef.current?.getBoundingClientRect() || null }} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}><span className="edge-light" /><div className="border-glow-inner">{children}</div></div>
}

function WechatModal({ onClose }) {
  return <div className="wechat-backdrop" onClick={onClose}><div className="wechat-modal" role="dialog" aria-modal="true" aria-label="添加微信" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="关闭微信二维码">×</button><p className="wechat-kicker">联系方式 / 微信</p><h2>加我微信<br /><em>一起聊聊。</em></h2><img src={asset('wechat-qr.png')} alt="李祖坤微信二维码" width="820" height="1216" decoding="async" /><p className="wechat-note">扫一扫，添加我为朋友。</p></div></div>
}

function DisplayTitle({ children }) {
  return <div className="section-display-wrap" aria-hidden="true"><span className="section-display-title">{children}</span></div>
}

const projects = [
  { number: '01', category: '系列短剧 / AIGC 叙事', title: '23:17 · 死人在说话', short: '从剧本、角色设定到分镜与画面生成，完成一集短剧的完整视觉预演。', image: asset('hero-poster.webp'), video: asset('shortfilm-episode-01.mp4'), year: '2026', role: '剧本 / 分镜 / AIGC', resources: [{ label: '视频成片', href: asset('shortfilm-episode-01.mp4') }, { label: '剧本', href: asset('shortfilm-script.txt') }, { label: '分镜脚本', href: asset('shortfilm-storyboard.txt') }, { label: '资产目录', href: asset('shortfilm-assets/index.html'), download: false }], accent: 'ice' },
  { number: '02', category: '产品广告 / 故事板', title: 'ASMR 开箱 · 30 秒故事板', short: '用 POV 手部视角、节奏切分和声音设计，把产品体验拆成可执行的镜头语言。', image: asset('project-storyboard.webp'), video: asset('asmr-unboxing.mp4'), videos: [{ label: 'ASMR 开箱', src: asset('asmr-unboxing.mp4'), poster: asset('project-storyboard.webp') }, { label: '搞笑单车广告', src: asset('funny-bike-ad.mp4'), poster: asset('project-storyboard.webp') }], year: '2026', role: '故事板 / 提示词设计', resources: [{ label: '分镜与提示词', href: asset('asmr-unboxing-prompt.txt') }], accent: 'mint' },
  { number: '03', category: 'IP 角色 / 品牌世界', title: '奶蛙 · 运动周边系统', short: '从角色三视图、表情动作到校园运动周边，建立一套可延展的 IP 视觉系统。', image: asset('project-naiwa.webp'), gallery: [asset('project-naiwa.webp'), asset('project-lion.webp'), asset('project-koi-full.webp')], year: '2026', role: 'IP 设计 / 视觉系统', accent: 'coral' },
  { number: '04', category: '原创 IP / 短片', title: '慢慢怪上班日记', short: '一个小怪物的日常情绪实验：用角色、场景和短片建立轻量的内容世界。', image: asset('project-manmang.webp'), video: asset('manmang-episode-01.mp4'), year: '2026', role: '角色 / 视觉开发', accent: 'amber' },
  { number: '05', category: '动作实验 / 一致性控制', title: '不同风格打斗实验', short: '围绕角色一致性与风格统一，测试不同动作节奏、镜头语言和生成式视频控制方法。', image: asset('style-battle-character.webp'), videos: [{ label: '风格统一性打斗', src: asset('style-battle.mp4'), poster: asset('style-battle-character.webp') }, { label: '角色一致性打斗', src: asset('character-consistency-battle.mp4'), poster: asset('style-battle-character.webp') }], year: '2026', role: '角色一致性 / 风格控制', resources: [{ label: '角色三视图', href: asset('style-battle-character.webp') }, { label: '风格统一提示词', href: asset('style-battle-prompts.txt') }, { label: '角色一致性提示词', href: asset('character-battle-prompts.txt') }], accent: 'ice' },
]

const capabilities = [
  { number: '01', title: '角色与 IP', copy: '从人物设定、三视图到表情包和周边延展，搭建能持续生长的角色资产。', tags: ['角色设计', 'IP 系统'] },
  { number: '02', title: 'AIGC 影像', copy: '熟练使用文生图、文生视频和提示词工程，把想法快速推进到可观看的画面。', tags: ['文生图', '文生视频'] },
  { number: '03', title: '叙事与分镜', copy: '从剧本结构到镜头节奏，控制每一个画面信息，让短内容有起承转合。', tags: ['剧本', '分镜'] },
  { number: '04', title: '剪辑与落地', copy: '理解短视频平台语言，完成剪辑、声音、包装与交付，推动创意真正上线。', tags: ['剪辑', '交付'] },
]

const navItems = [
  { id: 'about', number: '01', label: '关于', target: '#about' },
  { id: 'work', number: '02', label: '作品', target: '#work' },
  { id: 'capabilities', number: '03', label: '能力', target: '#capabilities' },
]

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [heroVideoSrc, setHeroVideoSrc] = useState('')
  const [wechatOpen, setWechatOpen] = useState(false)
  const rootRef = useRef(null)
  const cursorRef = useRef(null)
  const heroVideoRef = useRef(null)
  const scrolledRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return undefined
    let idleId = 0
    const timeoutId = window.setTimeout(() => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(() => setHeroVideoSrc(asset('hero-battle.mp4')), { timeout: 900 })
      else setHeroVideoSrc(asset('hero-battle.mp4'))
    }, 700)
    return () => {
      window.clearTimeout(timeoutId)
      if (idleId) window.cancelIdleCallback?.(idleId)
    }
  }, [])

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video || !heroVideoSrc) return undefined
    video.load()
    video.play().catch(() => {})
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || document.hidden) video.pause()
      else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {})
    }, { threshold: 0.08 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [heroVideoSrc])

  useLayoutEffect(() => {
    const scope = rootRef.current
    if (!scope) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const intro = scope.querySelector('.intro-curtain')
    if (reduceMotion) {
      gsap.set(intro, { display: 'none' })
      return () => gsap.set(intro, { clearProps: 'display' })
    }

    const desktopMotion = window.matchMedia('(min-width: 901px)').matches
    let motionMedia
    let refreshEnabled = true
    const context = gsap.context(() => {
      const heroMedia = scope.querySelector('.hero-media')
      const heroTitle = scope.querySelectorAll('.hero-title-inner')
      const topbar = scope.querySelector('.topbar')
      const heroFoot = scope.querySelector('.hero-foot')
      const heroIndex = scope.querySelector('.hero-index')
      const heroSide = scope.querySelector('.hero-side-note')
      const heroGrid = scope.querySelector('.hero-grid')

      if (window.scrollY < 80) {
        gsap.set(heroMedia, { scale: 1.12, transformOrigin: 'center center' })
        gsap.set(topbar, { y: -30, autoAlpha: 0 })
        gsap.set(heroTitle, { yPercent: 122, scaleX: 0.76, transformOrigin: 'left center' })
        gsap.set([heroFoot, heroIndex], { y: 24, autoAlpha: 0 })
        gsap.set([heroSide, heroGrid], { autoAlpha: 0 })

        const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
        opening
          .fromTo('.intro-curtain-brand', { y: 26, autoAlpha: 0, scaleX: 0.82 }, { y: 0, autoAlpha: 1, scaleX: 1, duration: 0.72 }, 0.08)
          .fromTo('.intro-curtain-line', { scaleX: 0 }, { scaleX: 1, duration: 0.62, ease: 'expo.out' }, 0.2)
          .to('.intro-curtain-brand', { y: -18, autoAlpha: 0, duration: 0.42, ease: 'power2.in' }, 0.78)
          .to('.intro-curtain-line', { scaleX: 0, autoAlpha: 0, transformOrigin: 'right center', duration: 0.44, ease: 'power2.in' }, 0.76)
          .to('.intro-curtain-panel--top', { yPercent: -101, duration: 1.25, ease: 'expo.inOut' }, 0.68)
          .to('.intro-curtain-panel--bottom', { yPercent: 101, duration: 1.25, ease: 'expo.inOut' }, 0.68)
          .to(heroMedia, { scale: 1, duration: 2.15, ease: 'power3.out', clearProps: 'transform' }, 0.58)
          .to(topbar, { y: 0, autoAlpha: 1, duration: 1.05, clearProps: 'transform,opacity,visibility' }, 0.86)
          .to(heroTitle, { yPercent: 0, scaleX: 1, duration: 1.38, stagger: 0.13, ease: 'power4.out', clearProps: 'transform' }, 0.84)
          .to(heroGrid, { autoAlpha: 1, duration: 1.1, clearProps: 'opacity,visibility' }, 0.96)
          .to([heroFoot, heroIndex], { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity,visibility' }, 1.48)
          .to(heroSide, { autoAlpha: 1, duration: 0.85, clearProps: 'opacity,visibility' }, 1.58)
          .to(intro, { autoAlpha: 0, duration: 0.12, display: 'none' }, 1.94)
      } else {
        gsap.set(intro, { display: 'none' })
      }

      const displayReveal = (timeline, section, direction = -1) => {
        const displayTitle = section.querySelector('.section-display-title')
        const rail = section.querySelector('.section-rail')
        timeline
          .from(displayTitle, {
            xPercent: direction * (desktopMotion ? 15 : 7),
            yPercent: desktopMotion ? 28 : 14,
            scaleX: desktopMotion ? 0.76 : 0.9,
            clipPath: direction < 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
            autoAlpha: 0,
            transformOrigin: direction < 0 ? 'left center' : 'right center',
            duration: desktopMotion ? 1.5 : 1.05,
            ease: 'power4.out',
          })
          .from(rail, { y: desktopMotion ? 35 : 20, autoAlpha: 0, duration: 0.82, ease: 'power3.out' }, '-=1.02')
        return timeline
      }

      const about = scope.querySelector('#about')
      const aboutTimeline = gsap.timeline({ scrollTrigger: { trigger: about, start: 'top 78%', once: true, invalidateOnRefresh: true } })
      displayReveal(aboutTimeline, about)
        .from(about.querySelector('.kicker'), { y: 24, autoAlpha: 0, duration: 0.75 }, '-=0.62')
        .from(about.querySelectorAll('.about-title-inner'), { yPercent: 118, scaleX: 0.82, transformOrigin: 'left center', duration: 1.18, stagger: 0.11, ease: 'power4.out' }, '-=0.58')
        .from(about.querySelector('.portrait-media'), { clipPath: 'inset(0 0 100% 0)', y: 42, duration: 1.22, ease: 'power4.inOut' }, '-=1.02')
        .from(about.querySelector('.portrait-media img'), { scale: 1.15, duration: 1.55, ease: 'power3.out', clearProps: 'transform' }, '<')
        .from(about.querySelector('.portrait-wrap > span'), { y: 16, autoAlpha: 0, duration: 0.68 }, '-=0.52')
        .from(about.querySelector('.about-lede'), { y: 44, autoAlpha: 0, duration: 0.95, ease: 'power3.out' }, '-=0.68')
        .from(about.querySelectorAll('.about-facts > div'), { y: 30, autoAlpha: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }, '-=0.68')

      const work = scope.querySelector('#work')
      const workTimeline = gsap.timeline({ scrollTrigger: { trigger: work, start: 'top 78%', once: true, invalidateOnRefresh: true } })
      displayReveal(workTimeline, work, 1)
        .from(work.querySelector('.section-head > p'), { y: 32, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')

      scope.querySelectorAll('.project-card').forEach((card, index) => {
        const imageTrack = card.querySelector('.project-image-track')
        const image = imageTrack?.querySelector('img')
        const copy = card.querySelector('.project-copy')
        gsap.timeline({
          delay: index % 2 ? 0.14 : 0,
          scrollTrigger: { trigger: card, start: 'top 88%', once: true, invalidateOnRefresh: true },
        })
          .from(card, { y: desktopMotion ? 96 : 48, scale: desktopMotion ? 0.965 : 0.985, autoAlpha: 0, duration: 1.16, ease: 'power3.out', clearProps: 'transform,opacity,visibility' })
          .from(imageTrack, { clipPath: 'inset(0 0 100% 0)', duration: 1.25, ease: 'power4.inOut', clearProps: 'clipPath' }, '<0.04')
          .from(image, { scale: 1.13, duration: 1.65, ease: 'power3.out', clearProps: 'transform' }, '<')
          .from(copy, { y: 26, autoAlpha: 0, duration: 0.82, ease: 'power3.out' }, '-=0.72')
      })

      const capabilitiesSection = scope.querySelector('#capabilities')
      const capabilitiesTimeline = gsap.timeline({ scrollTrigger: { trigger: capabilitiesSection, start: 'top 78%', once: true, invalidateOnRefresh: true } })
      displayReveal(capabilitiesTimeline, capabilitiesSection)
        .from(capabilitiesSection.querySelectorAll('.capability-title-inner'), { yPercent: 118, scaleX: 0.84, transformOrigin: 'left center', duration: 1.2, stagger: 0.1, ease: 'power4.out' }, '-=0.72')
        .from(capabilitiesSection.querySelector('.capability-intro > p'), { y: 34, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, '-=0.72')
        .from(capabilitiesSection.querySelectorAll('.capability-card'), { y: desktopMotion ? 78 : 42, scale: 0.975, autoAlpha: 0, duration: 1.08, stagger: 0.16, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, '-=0.45')

      const contact = scope.querySelector('#contact')
      const contactTimeline = gsap.timeline({ scrollTrigger: { trigger: contact, start: 'top 76%', once: true, invalidateOnRefresh: true } })
      displayReveal(contactTimeline, contact, 1)
        .from(contact.querySelector('.kicker'), { y: 25, autoAlpha: 0, duration: 0.75 }, '-=0.68')
        .from(contact.querySelectorAll('.contact-title-inner'), { yPercent: 120, scaleX: 0.8, transformOrigin: 'left center', duration: 1.28, stagger: 0.12, ease: 'power4.out' }, '-=0.6')
        .from(contact.querySelectorAll('.contact-lines span'), { scale: 0.58, rotate: -12, autoAlpha: 0.15, duration: 1.5, stagger: 0.12, ease: 'power3.out' }, '-=1.05')
        .from(contact.querySelectorAll('.contact-links > *'), { y: 30, autoAlpha: 0, duration: 0.78, stagger: 0.12, ease: 'power3.out' }, '-=0.72')
        .from(contact.querySelectorAll('.contact-footer > span'), { y: 18, autoAlpha: 0, duration: 0.72, stagger: 0.1 }, '-=0.42')

      motionMedia = gsap.matchMedia()
      motionMedia.add('(min-width: 901px)', () => {
        scope.querySelectorAll('.project-image-track').forEach((track) => {
          const card = track.closest('.project-card')
          gsap.fromTo(track, { yPercent: -3.5 }, {
            yPercent: 3.5,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.25, invalidateOnRefresh: true },
          })
        })
      })
    }, scope)

    const refresh = () => { if (refreshEnabled) ScrollTrigger.refresh() }
    document.fonts?.ready?.then(refresh)
    window.addEventListener('load', refresh, { once: true })
    return () => {
      refreshEnabled = false
      window.removeEventListener('load', refresh)
      motionMedia?.revert()
      context.revert()
    }
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scope = rootRef.current
    const syncMotionPreference = () => {
      const video = heroVideoRef.current
      if (motionQuery.matches) {
        video?.pause()
        if (!scope) return
        gsap.killTweensOf(scope.querySelectorAll('*'))
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        gsap.set(scope.querySelector('.intro-curtain'), { display: 'none', autoAlpha: 1 })
        gsap.set(scope.querySelectorAll('.hero-media,.topbar,.hero-title-inner,.hero-foot,.hero-index,.hero-side-note,.hero-grid,.section-display-title,.section-rail,.kicker,.about-title-inner,.capability-title-inner,.contact-title-inner,.portrait-media,.portrait-wrap > span,.about-lede,.about-facts > div,.section-head > p,.project-card,.project-image-track,.project-image-track img,.project-copy,.capability-intro > p,.capability-card,.contact-lines span,.contact-links > *, .contact-footer > span'), { clearProps: 'transform,opacity,visibility,clipPath' })
      } else if (video && video.paused && document.visibilityState === 'visible') {
        video.play().catch(() => {})
      }
    }
    syncMotionPreference()
    motionQuery.addEventListener?.('change', syncMotionPreference)
    return () => motionQuery.removeEventListener?.('change', syncMotionPreference)
  }, [])

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return undefined
    const handleVisibility = () => {
      if (document.hidden) video.pause()
      else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    let cursorFrame = 0
    let scrollFrame = 0
    let cursorPosition = { x: 0, y: 0 }
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const updateScrollState = () => {
      const nextScrolled = window.scrollY > 40
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled
        setScrolled(nextScrolled)
      }
      scrollFrame = 0
    }
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState)
    }
    const onMove = (event) => {
      if (!cursorRef.current || coarsePointer.matches) return
      cursorPosition = { x: event.clientX, y: event.clientY }
      if (cursorFrame) return
      cursorFrame = requestAnimationFrame(() => {
        cursorRef.current?.style.setProperty('transform', `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)`)
        cursorFrame = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    updateScrollState()
    return () => { cancelAnimationFrame(cursorFrame); cancelAnimationFrame(scrollFrame); window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onMove) }
  }, [])

  useEffect(() => { document.body.style.overflow = activeProject || wechatOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [activeProject, wechatOpen])
  useEffect(() => { setIsVideoPlaying(false) }, [activeProject, activeSlide])
  useEffect(() => {
    if (!activeProject) return undefined
    setActiveSlide(0)
    const onKeyDown = (event) => {
      if (!activeProject.gallery) return
      if (event.key === 'ArrowRight') setActiveSlide((slide) => (slide + 1) % activeProject.gallery.length)
      if (event.key === 'ArrowLeft') setActiveSlide((slide) => (slide - 1 + activeProject.gallery.length) % activeProject.gallery.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeProject])
  const scrollTo = (id) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    document.querySelector(id)?.scrollIntoView({ behavior })
    setMenuOpen(false)
  }

  return (
    <div className="site-shell" ref={rootRef}>
      <div className="intro-curtain" aria-hidden="true">
        <div className="intro-curtain-panel intro-curtain-panel--top" />
        <div className="intro-curtain-panel intro-curtain-panel--bottom" />
        <div className="intro-curtain-lockup"><span className="intro-curtain-brand">LZK</span><i className="intro-curtain-line" /></div>
      </div>
      <div className="cursor-dot" ref={cursorRef} />
      <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
        <button className="brand" onClick={() => scrollTo('#top')} aria-label="回到首页"><span className="brand-mark">LZK<span>.</span></span><span className="brand-meta">李祖坤 / 2026</span></button>
        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}><GooeyNav items={navItems} onNavigate={(item) => scrollTo(item.target)} /></div>
        <button className="contact-pill" onClick={() => setWechatOpen(true)}>联系我 <Arrow /></button>
        <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen((value) => !value)} aria-label="打开菜单" aria-expanded={menuOpen}><span /><span /></button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className={`hero-media ${videoReady ? 'is-ready' : ''}`} aria-hidden="true"><video ref={heroVideoRef} autoPlay muted loop playsInline preload="none" poster={asset('hero-poster.webp')} onCanPlay={() => setVideoReady(true)}>{heroVideoSrc && <source src={heroVideoSrc} type="video/mp4" />}</video></div>
          <div className="hero-shade" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
          <div className="hero-side-note">IP 设计 / AIGC 视频<br />广州，中国</div>
          <div className="hero-inner content-width">
            <h1 aria-label="把想象，做成看得见的世界。"><span className="hero-title-line"><span className="hero-title-inner">把想象</span></span><span className="hero-title-line"><span className="hero-title-inner hero-title-accent">做成看得见的世界。</span></span></h1>
            <div className="hero-foot"><p className="hero-role">IP 设计师 <b>×</b> AIGC 视频生成师</p><button className="scroll-cue" onClick={() => scrollTo('#about')}><span>向下探索</span><i /><Arrow /></button></div>
          </div>
          <span className="hero-index">LZK / 001</span>
        </section>

        <section className="about section" id="about"><DisplayTitle>ABOUT</DisplayTitle><div className="content-width section-layout"><div className="section-rail"><span>01</span><span>关于 / 个人简介</span></div><div className="about-body">
          <div className="about-topline"><div><p className="kicker">你好，我是李祖坤</p><h2 aria-label="让每一个想法有形。"><span className="title-line"><span className="about-title-inner">让每一个</span></span><span className="title-line"><span className="about-title-inner"><em>想法有形。</em></span></span></h2></div><div className="portrait-wrap"><div className="portrait-media"><img src={asset('profile-sea.webp')} alt="李祖坤在海边的照片" width="571" height="800" loading="lazy" decoding="async" /></div><span>李祖坤 / 24<br />动画设计</span></div></div>
          <div className="about-detail"><p className="about-lede">我是一名 IP 设计师与 AIGC 视频生成师，正在用角色、镜头和生成式工具，探索更快也更有温度的视觉叙事。</p><div className="about-facts"><div><span>所在地</span><strong>广州 / 中国</strong></div><div><span>教育经历</span><strong>南宁师范大学<br />动画 · 本科</strong></div><div><span>最近经历</span><strong>短剧内容生成师<br />2025.12 — 2026.08</strong></div><div><span>联系方式</span><strong>19977524865<br />2547958369@qq.com</strong></div></div></div>
        </div></div></section>

        <section className="work section" id="work"><DisplayTitle>SELECTED WORK</DisplayTitle><div className="content-width"><div className="section-head"><div className="section-rail"><span>02</span><span>精选作品 / 2026</span></div><p>角色、短剧、广告与动作实验。<br />每一个项目，都是一次从想法到画面的推进。</p></div><div className="project-grid">
          {projects.map((project, index) => <BorderGlow className={`project-card project-${index + 1} accent-${project.accent}`} key={project.number}><article onClick={() => setActiveProject(project)}><div className="project-media"><div className="project-image-track"><img src={project.image} alt={project.title} loading="lazy" decoding="async" fetchPriority="low" /></div><div className="project-wash" /><span className="project-number">{project.number}</span><span className="project-view">查看项目 <Arrow /></span></div><div className="project-copy"><div><span className="project-category">{project.category}</span><h3>{project.title}</h3><p>{project.short}</p></div><div className="project-meta"><span>{project.year}</span><span>{project.role}</span></div></div></article></BorderGlow>)}
        </div></div></section>

        <section className="capabilities section" id="capabilities"><DisplayTitle>CAPABILITIES</DisplayTitle><div className="content-width"><div className="section-rail"><span>03</span><span>能力 / 工作方式</span></div><div className="capability-intro"><h2 aria-label="不止是会做画面。"><span className="title-line"><span className="capability-title-inner">不止是</span></span><span className="title-line"><span className="capability-title-inner"><em>会做画面。</em></span></span></h2><p>我习惯先找到一个内容的核心，再把它拆成角色、镜头、节奏和可以落地的制作动作。</p></div><div className="capability-grid">
          {capabilities.map((item) => <BorderGlow className="capability-card" key={item.number}><article><span className="capability-number">{item.number}</span><div className="capability-card-body"><h3>{item.title}</h3><p>{item.copy}</p><div className="capability-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><Arrow /></article></BorderGlow>)}
        </div></div></section>

        <section className="contact section" id="contact"><DisplayTitle>CONTACT</DisplayTitle><div className="contact-lines" aria-hidden="true"><span /><span /><span /></div><div className="content-width contact-inner"><div className="section-rail"><span>04</span><span>联系 / 一起创作</span></div><div className="contact-main"><p className="kicker">有一个想法正在成形？</p><h2 aria-label="一起把它做出来。"><span className="title-line"><span className="contact-title-inner">一起把它</span></span><span className="title-line"><span className="contact-title-inner"><em>做出来。</em></span></span></h2><div className="contact-links"><a href="mailto:2547958369@qq.com">2547958369@qq.com <Arrow /></a><a href="tel:19977524865">199 7752 4865 <Arrow /></a><span>广州 / 中国</span></div></div><div className="contact-footer"><span>© 2026 李祖坤</span><span>IP 设计 / AIGC 视频 / 视觉叙事</span><span>回到顶部 <button onClick={() => scrollTo('#top')} aria-label="回到顶部"><Arrow /></button></span></div></div></section>
      </main>

      {activeProject && <div className={`modal-backdrop ${isVideoPlaying ? 'video-playing' : ''}`} onClick={() => setActiveProject(null)}><div className="project-modal" role="dialog" aria-modal="true" aria-label={activeProject.title} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setActiveProject(null)} aria-label="关闭项目详情">×</button><div className={`modal-image accent-${activeProject.accent}`}>{activeProject.gallery ? <div className="modal-gallery"><img src={activeProject.gallery[activeSlide]} alt={`${activeProject.title} 第 ${activeSlide + 1} 张作品`} decoding="async" /><button className="gallery-arrow gallery-prev" onClick={() => setActiveSlide((slide) => (slide - 1 + activeProject.gallery.length) % activeProject.gallery.length)} aria-label="上一张">←</button><button className="gallery-arrow gallery-next" onClick={() => setActiveSlide((slide) => (slide + 1) % activeProject.gallery.length)} aria-label="下一张">→</button><div className="gallery-dots">{activeProject.gallery.map((_, index) => <button className={index === activeSlide ? 'is-active' : ''} onClick={() => setActiveSlide(index)} aria-label={`查看第 ${index + 1} 张`} key={index} />)}</div></div> : activeProject.videos ? <div className="modal-video-gallery"><video controls playsInline preload="metadata" poster={activeProject.videos[activeSlide].poster} src={activeProject.videos[activeSlide].src} onPlay={() => setIsVideoPlaying(true)} onPause={() => setIsVideoPlaying(false)} onEnded={() => setIsVideoPlaying(false)} /><button className="gallery-arrow gallery-prev" onClick={() => setActiveSlide((slide) => (slide - 1 + activeProject.videos.length) % activeProject.videos.length)} aria-label="上一条视频">←</button><button className="gallery-arrow gallery-next" onClick={() => setActiveSlide((slide) => (slide + 1) % activeProject.videos.length)} aria-label="下一条视频">→</button><div className="video-label">{activeProject.videos[activeSlide].label}</div><div className="gallery-dots">{activeProject.videos.map((_, index) => <button className={index === activeSlide ? 'is-active' : ''} onClick={() => setActiveSlide(index)} aria-label={`查看第 ${index + 1} 条视频`} key={index} />)}</div></div> : activeProject.video ? <video controls playsInline preload="metadata" poster={activeProject.image} src={activeProject.video} onPlay={() => setIsVideoPlaying(true)} onPause={() => setIsVideoPlaying(false)} onEnded={() => setIsVideoPlaying(false)} /> : <img src={activeProject.image} alt={activeProject.title} decoding="async" />}</div><div className="modal-body"><span className="project-category">{activeProject.category}</span><h3>{activeProject.title}</h3><p>{activeProject.short}</p><div className="modal-meta"><span>{activeProject.year}</span><span>{activeProject.role}</span></div>{activeProject.resources?.length > 0 && <div className="resource-links">{activeProject.resources.map((resource) => <a href={resource.href} download={resource.download === false ? undefined : ''} target={resource.download === false ? '_blank' : undefined} rel={resource.download === false ? 'noreferrer' : undefined} key={resource.href}>{resource.label} <Arrow /></a>)}</div>}</div></div></div>}
      {wechatOpen && <WechatModal onClose={() => setWechatOpen(false)} />}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
