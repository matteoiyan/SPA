import { Link, NavLink } from "react-router-dom";
export function Icon({ name = "play", ...props }) {
  const paths = { play: "m9 5 11 7-11 7V5Z", grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z", user: "M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z", plus: "M12 5v14M5 12h14", search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z", arrow: "M5 12h14m-6-6 6 6-6 6" };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.play} /></svg>;
}
export default function Layout({ children }) {
  const signedIn = Boolean(localStorage.getItem("token"));
  return <div className="app-shell">
    <a className="skip-link" href="#main">Saltar al contenido</a>
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Video Platform, inicio"><Icon /><span>video<span className="brand-light">platform</span></span></Link>
      <nav aria-label="Navegación principal"><NavLink to="/" end>Explorar</NavLink><NavLink to="/profile">Mis videos</NavLink></nav>
      <div className="header-actions"><Link className="text-link" to={signedIn ? "/profile" : "/login"}>{signedIn ? "Mi cuenta" : "Iniciar sesión"}</Link><Link className="button primary" to="/profile"><Icon name="plus" /> Subir video</Link></div>
    </header>
    <main id="main" tabIndex="-1">{children}</main>
  </div>;
}
