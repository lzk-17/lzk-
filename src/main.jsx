import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const projects = [
  {
    index: '01',
    type: 'CONTENT SYSTEM / TIKTOK',
    title: '海外短视频内容矩阵',
    desc: '以热点洞察为起点，搭建可持续迭代的选题、剪辑与复盘系统。',
    stat: '200K+',
    statLabel: '单条最高播放',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1600&q=86',
    tone: 'orange',
  },
  {
    index: '02',
    type: 'AI VISUAL / CHARACTER',
    title: '角色概念与动态视觉',
    desc: '将角色设定、材质语言与镜头节奏，转译成可传播的视觉资产。',
    stat: '08+',
    statLabel: '角色视觉方向',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1600&q=86',
    tone: 'blue',
  },
  {
    index: '03',
    type: 'IP WORLD / MOTION',
    title: 'IP 世界观短片',
    desc: '围绕一个核心符号，建立从静态 KV 到动态叙事的完整体验。',
    stat: '$100',
    statLabel: '单日收益峰值',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=86',
    tone: 'violet',
  },
]

const strengths = [
  ['01', '视觉叙事', '把一个想法变成有情绪、有节奏、有记忆点的画面。'],
  ['02', 'AI 工作流', '熟练运用 AI 创作工具与大语言模型，加速从灵感到成片。'],
  ['03', '内容增长', '理解海外内容语境，围绕数据持续优化选题与制作策略。'],
  ['04', '团队协作', '主动沟通、快速对齐，能在多元文化背景下推动项目落地。'],
]

function ArrowUpRight() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const cursorRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onMove = (event) => {
      if (!cursorRef.current) return
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site-shell">
      <div className="cursor-dot" ref={cursorRef} />
      <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
        <button className="brand" onClick={() => scrollTo('#top')} aria-label="回到首页">
          <span className="brand-mark">LZK</span>
          <span className="brand-sub">VISUAL LAB / 2026</span>
        </button>
        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <button onClick={() => scrollTo('#about')}>01 / ABOUT</button>
          <button onClick={() => scrollTo('#work')}>02 / WORK</button>
          <button onClick={() => scrollTo('#approach')}>03 / APPROACH</button>
        </nav>
        <button className="contact-pill" onClick={() => scrollTo('#contact')}>
          开始对话 <ArrowUpRight />
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="打开菜单">
          <span></span><span></span>
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-media" aria-hidden="true">
            <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=85">
              <source src="https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-grid" aria-hidden="true"></div>
          <div className="hero-content content-width">
            <p className="eyebrow"><span className="pulse-dot"></span> AVAILABLE FOR SELECT PROJECTS / GUANGZHOU</p>
            <h1>让想象<br /><em>有迹可循</em></h1>
            <div className="hero-bottomline">
              <p>IP DESIGNER<br /><span>×</span> AIGC VIDEO CREATOR</p>
              <button className="scroll-cue" onClick={() => scrollTo('#about')} aria-label="向下浏览">
                <span>SCROLL TO EXPLORE</span><span className="scroll-line"></span><ArrowUpRight />
              </button>
            </div>
          </div>
          <div className="hero-index">/ 001</div>
        </section>

        <section className="about section" id="about">
          <div className="content-width about-layout">
            <div className="section-label"><span>01</span><span>ABOUT / PROFILE</span></div>
            <div className="about-main">
              <div className="about-heading-row">
                <h2>我在画面里<br /><span>寻找可能。</span></h2>
                <div className="portrait-wrap">
                  <img src="/avatar.png" alt="李祖坤头像" />
                  <span className="portrait-caption">Li Zukun / 23<br />Nanning → Guangzhou</span>
                </div>
              </div>
              <div className="about-copy-grid">
                <p className="intro-copy">我是李祖坤，一名专注于 IP 视觉与 AIGC 视频的设计师。我的工作在角色、动态和内容增长之间展开，把抽象的想法变成能被看见、被记住、被传播的视觉语言。</p>
                <div className="facts">
                  <div><span>EDUCATION</span><strong>南宁师范大学 / 动画</strong></div>
                  <div><span>EXPERIENCE</span><strong>广西馨晖广拓科技 / 视频剪辑</strong></div>
                  <div><span>CONTACT</span><strong>19977524865<br />2547958369@qq.com</strong></div>
                </div>
              </div>
              <div className="metrics">
                <div><strong>200K<span>+</span></strong><span>单条最高播放</span></div>
                <div><strong>100<span>$</span></strong><span>单日收益峰值</span></div>
                <div><strong>03</strong><span>年视觉训练</span></div>
                <div><strong>∞</strong><span>持续实验中</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="content-width">
            <div className="section-head">
              <div className="section-label"><span>02</span><span>SELECTED WORK / 2023—2026</span></div>
              <p>从一个镜头，到一套能持续生长的内容系统。</p>
            </div>
            <div className="project-list">
              {projects.map((project) => (
                <article className={`project-card ${project.tone}`} key={project.index} onClick={() => setActiveProject(project)}>
                  <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
                    <div className="project-overlay"></div>
                    <span className="project-index">{project.index}</span>
                    <span className="project-open">VIEW CASE <ArrowUpRight /></span>
                  </div>
                  <div className="project-info">
                    <div><span className="project-type">{project.type}</span><h3>{project.title}</h3><p>{project.desc}</p></div>
                    <div className="project-stat"><strong>{project.stat}</strong><span>{project.statLabel}</span></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="approach section" id="approach">
          <div className="content-width">
            <div className="section-label"><span>03</span><span>APPROACH / CAPABILITIES</span></div>
            <div className="approach-heading"><h2>我的优势<br /><em>不止一种。</em></h2><p>从审美判断到执行落地，我习惯把复杂的问题拆成清晰的视觉动作。</p></div>
            <div className="strength-grid">
              {strengths.map(([number, title, body]) => <div className="strength-card" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p><ArrowUpRight /></div>)}
            </div>
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-orbit" aria-hidden="true"><div></div><div></div><div></div></div>
          <div className="content-width contact-inner">
            <div className="section-label"><span>04</span><span>CONTACT / LET'S MAKE</span></div>
            <p className="contact-kicker">有一个想法正在成形？</p>
            <h2>一起把它<br /><em>做出来。</em></h2>
            <div className="contact-row"><a href="mailto:2547958369@qq.com">2547958369@qq.com <ArrowUpRight /></a><a href="tel:19977524865">199 7752 4865 <ArrowUpRight /></a><span>GUANGZHOU / CHINA</span></div>
            <div className="contact-foot"><span>© 2026 LI ZUKUN. ALL RIGHTS RESERVED.</span><span>IP DESIGN / AIGC VIDEO / VISUAL STORYTELLING</span></div>
          </div>
        </section>
      </main>

      {activeProject && <div className="modal-backdrop" onClick={() => setActiveProject(null)}><div className="project-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setActiveProject(null)} aria-label="关闭">×</button><div className="modal-image" style={{ backgroundImage: `url(${activeProject.image})` }}></div><div className="modal-body"><span className="project-type">{activeProject.type}</span><h3>{activeProject.title}</h3><p>{activeProject.desc} 这是一个可继续展开的项目入口，后续可接入完整案例页、视频或作品集 PDF。</p><div className="modal-stat"><strong>{activeProject.stat}</strong><span>{activeProject.statLabel}</span></div></div></div></div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
