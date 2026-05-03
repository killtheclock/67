import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import content from '../data/content.json'

interface HeroProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export const Hero = ({ count, setCount }: HeroProps) => {
  const { hero } = content;
  return (
    <section id="center">
      <div className="hero">
        <img src={heroImg} className="base" alt="" />
        <img src={reactLogo} className="framework" alt="React logo" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
      </div>
      <div className="hero-text">
        <h1 style={{ fontSize: '12rem', fontWeight: 900, letterSpacing: '-0.06em', margin: '0', color: 'var(--accent)', fontFamily: 'serif', lineHeight: 0.8 }}>{hero.title}</h1>
        <p style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.6em', textTransform: 'uppercase', fontFamily: 'monospace', marginTop: '40px', marginLeft: '10px' }}>
          {hero.subtitle}
        </p>
      </div>
      <div className="counter-wrapper">
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          {hero.buttonText} ({count})
        </button>
      </div>
    </section>
  );
};
