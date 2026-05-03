import { useState } from 'react'
import { Hero } from './components/Hero'
import content from './data/content.json'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Hero count={count} setCount={setCount} />

      <div className="ticks"></div>

      <section id="next-steps">
        {content.sections.map((section) => (
          <div key={section.id} id={section.id}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'monospace' }}>{section.title}</h2>
            <p style={{ opacity: 0.4, fontSize: '0.8rem', fontFamily: 'monospace' }}>{section.description}</p>
            <ul style={section.id === 'docs' ? { justifyContent: 'flex-start' } : {}}>
              {section.links.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.url} 
                    target={link.url.startsWith('http') ? "_blank" : undefined}
                    style={section.id === 'docs' ? { background: 'transparent', border: '1px solid var(--border)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' } : {}}
                  >
                    {link.icon && (
                      <svg className="button-icon" role="presentation" aria-hidden="true">
                        <use href={`/icons.svg#${link.icon}`}></use>
                      </svg>
                    )}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
