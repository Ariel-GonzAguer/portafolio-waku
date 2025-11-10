import { CSSProperties } from 'react';
import './MarqueeTecnologias.css';

interface Technology {
  name: string;
  icon: string;
}

interface MarqueeTecnologiasProps {
  technologies?: Technology[];
  title?: string;
  animationDuration?: number;
  className?: string;
}

const defaultTechnologies: Technology[] = [
  { name: "Astro", icon: "/iconos/astro-svgrepo-com.svg" },
  { name: "React", icon: "/iconos/react-logo-svgrepo-com.svg" },
  { name: "TypeScript", icon: "/iconos/typeScript.svg" },
  { name: "CSS", icon: "/iconos/Official_CSS_Logo.svg" },
  { name: "JavaScript", icon: "/iconos/Unofficial_JavaScript_logo_2.svg" },
  { name: "Git", icon: "/iconos/git-svgrepo-com.svg" },
  { name: "GitHub", icon: "/iconos/github-svgrepo-com.svg" },
  { name: "Firebase", icon: "/iconos/firebase-svgrepo-com.svg" },
  { name: "Cloudinary", icon: "/iconos/cloudinary-svgrepo-com.svg" },
  { name: "Netlify", icon: "/iconos/netlify.svg" },
  { name: "Vercel", icon: "/iconos/vercel-logotype-light.svg" },
  { name: "Vite", icon: "/iconos/vite-svgrepo-com.svg" },
  { name: "Vitest", icon: "/iconos/vitest-logo.svg" },
  { name: "Tailwind", icon: "/iconos/tailwind-svgrepo-com.svg" },
  { name: "Zustand", icon: "/iconos/zustand.ico" },
  { name: "MichiRouter", icon: "/iconos/michiRouter_LOGO.png" },
  { name: "Waku", icon: "/iconos/waku.png" }
];

export default function MarqueeTecnologias({
  technologies = defaultTechnologies,
  title = "Tecnologías que usamos",
  animationDuration = 45,
  className = ""
}: MarqueeTecnologiasProps) {
  // Duplicamos el array para crear un efecto continuo
  const allTechnologies = [...technologies, ...technologies];

  /**
   * Genera estilos CSS personalizados para imágenes basados en el nombre de la tecnología.
   * 
   * Esta función devuelve un objeto de estilos React.CSSProperties que incluye propiedades base
   * como ancho, alto y ajuste de objeto, y aplica modificaciones específicas según el nombre
   * de la tecnología proporcionado. Por ejemplo, agrega colores de fondo, bordes o sombras para
   * tecnologías como GitHub, Vercel o JavaScript.
   * 
   * @param techName - El nombre de la tecnología para la cual se generan los estilos (por ejemplo, "GitHub", "Vercel").
   * @returns Un objeto React.CSSProperties con los estilos aplicados para la imagen.
   */
  function getImageStyles(techName: string) {
    const baseStyles: CSSProperties = {
      width: '40px',
      height: '40px',
      objectFit: 'contain' as const,
      backgroundColor: 'transparent',
      transition: 'transform 0.3s ease',
    };

    switch (techName) {
      case "GitHub":
        return { ...baseStyles, backgroundColor: 'white', borderRadius: '50%' };
      case "Vercel":
        return { ...baseStyles, backgroundColor: 'white', padding: '6px' };
      default:
        return baseStyles;
    }
  };

  return (
    <section className={`marquee-section ${className}`}>
      <h3>{title}</h3>
      <div className="marquee-container">
        <div
          className="marquee"
          style={{
            animationDuration: `${animationDuration}s`
          }}
        >
          {allTechnologies.map((tech, index) => (
            <div key={`${tech.name}-${index}`} className="tech-item">
              <img
                src={tech.icon}
                alt={`${tech.name} logo`}
                style={getImageStyles(tech.name)}
                title={tech.name}
              />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
