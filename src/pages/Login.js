import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Asegúrate de tener un archivo CSS asociado

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    
    // Resetea el mensaje de error antes de intentar iniciar sesión
    setError("");

    try {
      // Intenta iniciar sesión con las credenciales del usuario
      await signInWithEmailAndPassword(auth, email, password);
      
      // Si es exitoso, redirige al Home
      navigate("/"); // Cambia la ruta según tu configuración
    } catch (error) {
      // Si ocurre un error, muestra un mensaje adecuado
      setError("Error al iniciar sesión. Por favor verifica tus credenciales.");
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <div className="form-field">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>} {/* Muestra el error si ocurre */}
          <button type="submit" className="login-btn">Iniciar Sesión</button>
          <button
            type="button"
            className="register-btn"
            onClick={() => navigate("/register")}  // Redirige a la página de registro
          >
            ¿No tienes una cuenta? Regístrate
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
