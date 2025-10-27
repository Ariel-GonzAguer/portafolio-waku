import { TransitionLink } from './TransitionLink';

export default function Header() {
  return (
    <header className="w-full">
      <nav>
        <ul className="flex justify-around items-center font-lexend-mega bg-gris-medio text-gray-50">
          <li>
            <TransitionLink to="/">INICIO</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/servicios">SERVICIOS</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/proyectos">PROYECTOS</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/contacto">CONTACTO</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/about">ACERCA DE</TransitionLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
