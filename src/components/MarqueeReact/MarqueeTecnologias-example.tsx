import React from 'react';
import MarqueeTecnologias from './MarqueeTecnologias';

// Ejemplo de uso básico
function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '2rem' }}>
      <MarqueeTecnologias />
    </div>
  );
}

// Ejemplo con personalización
const customTech = [
  { name: 'Next.js', icon: '/icons/nextjs.svg' },
  { name: 'Node.js', icon: '/icons/nodejs.svg' },
  { name: 'MongoDB', icon: '/icons/mongodb.svg' },
  { name: 'PostgreSQL', icon: '/icons/postgres.svg' },
  { name: 'Docker', icon: '/icons/docker.svg' },
];

function CustomMarquee() {
  return (
    <MarqueeTecnologias
      technologies={customTech}
      title="Mi Stack Tecnológico"
      animationDuration={30}
      className="custom-marquee"
    />
  );
}

export default App;
export { CustomMarquee };
