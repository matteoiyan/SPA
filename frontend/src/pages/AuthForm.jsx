import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, register } from "../services/api";
export default function AuthForm({ registration = false }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setError(""); setPending(true);
    try {
      if (registration) { await register(name, email, password); navigate("/login"); }
      else { const data = await login(email, password); localStorage.setItem("token", data.access_token); navigate("/"); }
    } catch { setError(registration ? "No se pudo crear la cuenta. Inténtalo de nuevo." : "No pudimos iniciar sesión. Revisa tus datos y vuelve a intentarlo."); }
    finally { setPending(false); }
  }
  return <section className="auth-page"><h1>{registration ? "Crear cuenta" : "Iniciar sesión"}</h1><p>{registration ? "Publica videos y participa en los comentarios." : "Accede a tus videos y a tu perfil."}</p><form onSubmit={handleSubmit}>
    {registration && <label>Nombre<input type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required /></label>}
    <label>Correo electrónico<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required /></label>
    <label>Contraseña<input type="password" autoComplete={registration ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" required /></label>
    {error && <p className="form-message" role="alert">{error}</p>}
    <button type="submit" disabled={pending}>{pending ? "Un momento…" : registration ? "Crear cuenta" : "Iniciar sesión"}</button>
    </form><p>{registration ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"} <Link to={registration ? "/login" : "/register"}>{registration ? "Inicia sesión" : "Regístrate"}</Link></p></section>;
}

