import { useEffect, useRef, useState } from 'react'
import './App.css'

const profile = {
  name: '馮顥元',
  title: '南臺科技大學資工系',
  email: '4B1G0105@stust.edu.tw',
  bio: '目前是一名資工系大學生，平時除了學習程式設計與前端開發，也熱愛運動健身。因為重視訓練與生活習慣，也持續了解營養學相關知識，希望能在學習、健康與自我管理之間找到更好的平衡。',
}

const skills = ['學習 AI 工具應用', 'AI 輔助程式設計', 'Prompt 練習', '前端整合 AI']

const learningTracks = [
  {
    title: 'HTML 與 CSS 基礎',
    items: ['Page Title 與 Id', 'CSS Box Model', 'Inline-block', 'W3Schools Quiz'],
  },
  {
    title: 'React 專案入門',
    items: ['Node.js、npm、Vite 環境準備', 'JSX、Props、Component', 'React 專案檔案結構'],
  },
  {
    title: 'Hooks 與互動邏輯',
    items: ['useState 管理資料', 'useEffect 處理副作用', '事件處理、條件渲染、列表渲染'],
  },
  {
    title: '進階應用實作',
    items: ['useRef、useMemo、useCallback、useContext', 'Fetch API / Axios', 'Loading 與 Error 狀態處理'],
  },
]

const practiceProjects = [
  '製作個人名片展示網頁',
  '製作待辦事項網頁',
  '開發天氣查詢應用或電影搜尋引擎',
]

const developedWorks = [
  {
    title: '個人名片網站',
    type: 'Website',
    url: 'https://yasilamu.github.io/my-card/',
    description: '整理個人介紹、學習重點與課堂實作內容，做成可以展示的個人網站。',
    tags: ['React', 'Vite', 'CSS'],
  },
  {
    title: 'FitPlan 健身飲食紀錄',
    type: 'Web App',
    url: 'https://yasilamu.github.io/fitness-app/',
    description: '可輸入身體資料、飲食目標與每日紀錄，協助安排自主健身飲食計畫。',
    tags: ['GitHub Pages', 'PWA', 'Fitness'],
  },
]

const todoStorageKey = 'personal-site-todos'
const todoUrlParam = 'todos'
const supabaseConfig = {
  url: 'https://sxdhrwahcsbojdotckuv.supabase.co',
  anonKey: 'sb_publishable_1PnujqhJpuzT7bbltrPK9A_nyXnLgYb',
  table: 'site_todo_lists',
  listKey: 'main',
}

const defaultTodos = [
  { id: 1, text: '整理 React 元件拆分筆記', completed: false },
  { id: 2, text: '練習 useState 與表單輸入', completed: false },
  { id: 3, text: '嘗試串接公開 API 並處理 Loading/Error', completed: false },
]

function normalizeTodos(value) {
  if (!Array.isArray(value)) return null

  const todos = value
    .filter((item) => item && typeof item.text === 'string' && item.text.trim() !== '')
    .map((item, index) => ({
      id: Number.isFinite(item.id) ? item.id : Date.now() + index,
      text: item.text.trim(),
      completed: Boolean(item.completed),
    }))

  return todos
}

function loadTodosFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search)
    const sharedTodos = params.get(todoUrlParam)

    if (!sharedTodos) return null

    return normalizeTodos(JSON.parse(sharedTodos))
  } catch {
    return null
  }
}

function loadSavedTodos() {
  const urlTodos = loadTodosFromUrl()

  if (urlTodos) return urlTodos

  try {
    const savedTodos = window.localStorage.getItem(todoStorageKey)

    if (!savedTodos) return defaultTodos

    return normalizeTodos(JSON.parse(savedTodos)) ?? defaultTodos
  } catch {
    return defaultTodos
  }
}

function syncTodosToUrl(todos) {
  try {
    const url = new URL(window.location.href)
    url.searchParams.set(todoUrlParam, JSON.stringify(todos))
    window.history.replaceState(null, '', url)
  } catch {
    // The list is still saved locally when URL updates are unavailable.
  }
}

function getSupabaseConfig() {
  const url = supabaseConfig.url.trim().replace(/\/rest\/v1\/?$/, '')
  const anonKey = supabaseConfig.anonKey.trim()

  if (!url || !anonKey) return null

  return {
    url,
    anonKey,
    table: supabaseConfig.table,
    listKey: supabaseConfig.listKey,
  }
}

function supabaseHeaders(config, extraHeaders = {}) {
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.anonKey}`,
    ...extraHeaders,
  }
}

async function fetchCloudTodos() {
  const config = getSupabaseConfig()

  if (!config) return null

  const endpoint = `${config.url}/rest/v1/${config.table}?list_key=eq.${encodeURIComponent(config.listKey)}&select=todos&limit=1`
  const response = await fetch(endpoint, {
    headers: supabaseHeaders(config),
  })

  if (!response.ok) throw new Error(`Supabase select failed: ${response.status}`)

  const rows = await response.json()

  if (!rows.length) return []

  return normalizeTodos(rows[0].todos) || []
}

async function saveCloudTodos(todos) {
  const config = getSupabaseConfig()

  if (!config) return false

  const endpoint = `${config.url}/rest/v1/${config.table}?on_conflict=list_key`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: supabaseHeaders(config, {
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    }),
    body: JSON.stringify({
      list_key: config.listKey,
      todos,
      updated_at: new Date().toISOString(),
    }),
  })

  if (!response.ok) throw new Error(`Supabase upsert failed: ${response.status}`)

  return true
}

function BusinessCard({ name, title, email, bio }) {
  return (
    <article className="profile-card" aria-label="個人名片">
      <div className="profile-topline">About Me</div>
      <div className="card-header">
        <div>
          <h2>{name}</h2>
          <p>{title}</p>
        </div>
        <span className="status-dot" aria-label="目前學習中" />
      </div>

      <p className="bio">{bio}</p>

      <a className="email-link" href={`mailto:${email}`}>
        {email}
      </a>
    </article>
  )
}

function LearningFocus() {
  return (
    <section className="learning-section" aria-labelledby="learning-title">
      <div className="section-heading">
        <div>
          <p className="section-label">Learning Focus</p>
          <h2 id="learning-title">本學期上課内容</h2>
        </div>
      </div>

      <div className="learning-grid">
        {learningTracks.map((track, index) => (
          <article className="learning-card" key={track.title}>
            <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
            <h3>{track.title}</h3>
            <ul>
              {track.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="project-strip" aria-label="實作作品">
        {practiceProjects.map((project) => (
          <span key={project}>{project}</span>
        ))}
      </div>
    </section>
  )
}

function DevelopedWorks() {
  return (
    <section className="works-section" aria-labelledby="works-title">
      <div className="section-heading">
        <div>
          <p className="section-label">Portfolio</p>
          <h2 id="works-title">已開發作品</h2>
        </div>
      </div>

      <div className="works-grid">
        {developedWorks.map((work) => (
          <a
            className="work-card"
            href={work.url}
            key={work.title}
            target="_blank"
            rel="noreferrer"
          >
            <div className="work-card-top">
              <span>{work.type}</span>
            </div>
            <h3>{work.title}</h3>
            <p>{work.description}</p>
            <strong className="work-link-text">查看作品</strong>
            <div className="work-tags">
              {work.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function App() {
  const [todoInput, setTodoInput] = useState('')
  const [todos, setTodos] = useState(loadSavedTodos)
  const [copyStatus, setCopyStatus] = useState('')
  const [syncStatus, setSyncStatus] = useState('本機保存')
  const cloudReadyRef = useRef(false)
  const latestTodosRef = useRef(todos)
  const heroVideoRef = useRef(null)

  useEffect(() => {
    latestTodosRef.current = todos

    try {
      window.localStorage.setItem(todoStorageKey, JSON.stringify(todos))
    } catch {
      // Keep the page usable even if the browser blocks local storage.
    }

    syncTodosToUrl(todos)

    if (cloudReadyRef.current) {
      saveCloudTodos(todos)
        .then((synced) => setSyncStatus(synced ? '雲端已同步' : '本機保存'))
        .catch(() => setSyncStatus('雲端同步失敗，已本機保存'))
    }

    console.log(`目前共有 ${todos.length} 項任務`)
  }, [todos])

  useEffect(() => {
    let isCancelled = false

    async function loadCloudTodos() {
      const config = getSupabaseConfig()

      if (!config) {
        cloudReadyRef.current = true
        setSyncStatus('本機保存')
        return
      }

      try {
        const cloudTodos = await fetchCloudTodos()

        if (isCancelled) return

        if (cloudTodos) {
          setTodos(cloudTodos)
        } else {
          await saveCloudTodos(latestTodosRef.current)
        }

        cloudReadyRef.current = true
        setSyncStatus('雲端已同步')
      } catch {
        cloudReadyRef.current = true
        setSyncStatus('雲端同步失敗，已本機保存')
      }
    }

    loadCloudTodos()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    const config = getSupabaseConfig()

    if (!config) return undefined

    const timer = window.setInterval(async () => {
      try {
        const cloudTodos = await fetchCloudTodos()

        if (!cloudTodos) return

        if (JSON.stringify(cloudTodos) !== JSON.stringify(latestTodosRef.current)) {
          setTodos(cloudTodos)
        }

        setSyncStatus('雲端已同步')
      } catch {
        setSyncStatus('雲端同步失敗，已本機保存')
      }
    }, 12000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!copyStatus) return undefined

    const timer = window.setTimeout(() => setCopyStatus(''), 1800)

    return () => window.clearTimeout(timer)
  }, [copyStatus])

  useEffect(() => {
    const video = heroVideoRef.current

    if (!video) return undefined

    video.currentTime = 0
    video.play().catch(() => {})

    return undefined
  }, [])

  const handleAddTodo = () => {
    if (todoInput.trim() === '') return

    const newTodo = {
      id: Date.now(),
      text: todoInput.trim(),
      completed: false,
    }

    setTodos((currentTodos) => [...currentTodos, newTodo])
    setTodoInput('')
  }

  const handleToggle = (id) => {
    setTodos(
      (currentTodos) => currentTodos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    )
  }

  const handleDelete = (id) => {
    setTodos((currentTodos) => currentTodos.filter((item) => item.id !== id))
  }

  const handleCopyTodoLink = async () => {
    try {
      await window.navigator.clipboard.writeText(window.location.href)
      setCopyStatus('已複製')
    } catch {
      setCopyStatus('請複製網址列')
    }
  }

  const handleHeroVideoReplay = () => {
    const video = heroVideoRef.current

    if (!video) return

    video.currentTime = 0
    video.play().catch(() => {})
  }

  return (
    <main className="site-shell">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio Hub</p>
          <h1 id="hero-title">
            <span className="hero-title-line hero-title-line-top">你有想法</span>
            <span className="hero-title-line hero-title-line-bottom">我有辦法</span>
          </h1>
          <p className="hero-text">將想法轉化為可執行的產品與體驗</p>

          <div className="hero-actions" aria-label="快速連結">
            <a href={`mailto:${profile.email}`} className="primary-action">
              聯絡我
            </a>
            <a href="#learning" className="secondary-action">
              查看重點
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-video-card" onMouseEnter={handleHeroVideoReplay}>
            <video
              ref={heroVideoRef}
              src={`${import.meta.env.BASE_URL}gengar-miniq-animation.mp4`}
              muted
              playsInline
              autoPlay
              preload="auto"
            />
          </div>
        </div>
      </section>

      <section className="content-grid" aria-label="個人資訊與技能">
        <BusinessCard {...profile} />

        <article className="skills-panel">
          <p className="section-label">Focus</p>
          <h2>目前學習重點</h2>
          <div className="skill-list">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
      </section>

      <div id="learning">
        <LearningFocus />
      </div>

      <DevelopedWorks />

      <section className="todo-section" id="practice" aria-labelledby="todo-title">
        <div className="section-heading">
          <div>
            <p className="section-label">Practice</p>
            <h2 id="todo-title">待辦事項</h2>
          </div>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={todoInput}
            onChange={(event) => setTodoInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleAddTodo()
            }}
            placeholder="輸入新的學習任務..."
          />
          <button onClick={handleAddTodo}>新增</button>
        </div>

        <div className="todo-actions">
          <button type="button" onClick={handleCopyTodoLink}>
            複製清單連結
          </button>
          <span role="status">{copyStatus || syncStatus}</span>
        </div>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-state">目前沒有待辦事項，先休息一下吧！</li>
          ) : (
            todos.map((item) => (
              <li
                key={item.id}
                className={`todo-item ${item.completed ? 'is-complete' : ''}`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggle(item.id)}
                  />
                  <span>{item.text}</span>
                </label>
                <button className="del-btn" onClick={() => handleDelete(item.id)}>
                  刪除
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  )
}

export default App
