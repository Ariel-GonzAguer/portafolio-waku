import { Link } from 'waku';

export const Header = () => {
  return (
    <header className="w-full">
      <nav>
        <ul className='flex justify-around items-center'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/servicios">Servicios</Link></li>
          <li><Link to="/proyectos">Proyectos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
};
