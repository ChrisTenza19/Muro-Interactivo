import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebaseConfig";  // Asegúrate de que la configuración de Firebase esté correctamente exportada
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la redirección
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [message, setMessage] = useState("");  // Mensaje de éxito o error
  const navigate = useNavigate(); // Hook de navegación para redirección

  // Maneja el cambio de cada campo del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función que se ejecuta cuando el usuario envía el formulario de registro
  const handleRegister = async (e) => {
    e.preventDefault();  // Evita el comportamiento predeterminado del formulario

    const { email, password, firstName, lastName } = formData;

    // Verifica que todos los campos estén completos
    if (!email || !password || !firstName || !lastName) {
      setMessage("Por favor completa todos los campos.");
      return;
    }

    const auth = getAuth();  // Obtén el servicio de autenticación de Firebase
    try {
      // Crea el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guarda la información adicional del usuario en Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
      });

      // Mensaje de éxito
      setMessage("Usuario registrado exitosamente.");

      // Redirige al inicio de sesión después del registro
      setTimeout(() => {
        navigate("/login"); // Redirige a la página de login
      }, 2000); // Redirige después de 2 segundos para que el usuario vea el mensaje de éxito

      // Limpia el formulario después de un registro exitoso
      setFormData({ email: "", password: "", firstName: "", lastName: "" });
    } catch (error) {
      // Maneja errores (como si el correo ya está en uso)
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-field">
          <label>Nombre:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Apellido:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {message && <p className="message">{message}</p>} {/* Muestra el mensaje al usuario */}
    </div>
  );
}

export default Register;
