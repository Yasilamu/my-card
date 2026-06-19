import { useEffect, useState } from 'react'
import './App.css'
import './hero-orb.css'

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

const defaultTodos = [
  { id: 1, text: '整理 React 元件拆分筆記', completed: false },
  { id: 2, text: '練習 useState 與表單輸入', completed: false },
  { id: 3, text: '嘗試串接公開 API 並處理 Loading/Error', completed: false },
]

function loadSavedTodos() {
  try {
    const savedTodos = window.localStorage.getItem(todoStorageKey)
    return savedTodos ? JSON.parse(savedTodos) : defaultTodos
  } catch {
    return defaultTodos
  }
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

  useEffect(() => {
    try {
      window.localStorage.setItem(todoStorageKey, JSON.stringify(todos))
    } catch {
      // Keep the page usable even if the browser blocks local storage.
    }

    console.log(`目前共有 ${todos.length} 項任務`)
  }, [todos])

  const handleAddTodo = () => {
    if (todoInput.trim() === '') return

    const newTodo = {
      id: Date.now(),
      text: todoInput.trim(),
      completed: false,
    }

    setTodos([...todos, newTodo])
    setTodoInput('')
  }

  const handleToggle = (id) => {
    setTodos(
      todos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    )
  }

  const handleDelete = (id) => {
    setTodos(todos.filter((item) => item.id !== id))
  }

  return (
    <main className="site-shell">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">STUST JavaScript Final Project</p>
          <h1 id="hero-title">南臺科技大學 JavaScript 期末專題</h1>
          <p className="hero-text">
            這裡整理了個人名片、學習方向與待辦清單練習，讓 React 的 state、
            props、event handler 不只停在範例，也變成可以展示的頁面。
          </p>

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
          <div className="hero-orb" />
          <div className="floating-note">
            <span>React</span>
            <strong>Hooks + UI</strong>
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
