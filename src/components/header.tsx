import { Link } from 'waku';

export default function Header() {
  return (
    <header className="w-full">
      <nav>
        <ul className='flex justify-around items-center font-lexend-mega bg-gris-medio text-gray-50'>
          <li><Link to="/">INICIO</Link></li>
          <li><Link to="/servicios">SERVICIOS</Link></li>
          <li><Link to="/proyectos">PROYECTOS</Link></li>
          <li><Link to="/contacto">CONTACTO</Link></li>
          <li><Link to="/about">ACERCA DE</Link></li>
        </ul>
      </nav>
    </header>
  );
};
