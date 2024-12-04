import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirección
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const [postError, setPostError] = useState(""); // Estado para manejar errores de publicación
  const navigate = useNavigate(); // Hook de navegación

  // Obtener publicaciones de Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsData = querySnapshot.docs.map((doc) => doc.data());
      setPosts(postsData);
    };
    fetchPosts();
  }, []);

  // Verificar el estado de autenticación del usuario
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Limpiar el observador cuando el componente se desmonte
  }, []);

  // Función para agregar una nueva publicación
  const handleAddPost = async (e) => {
    e.preventDefault();
    setPostError(""); // Resetea el error antes de intentar agregar el post
    try {
      await addDoc(collection(db, "posts"), {
        title: newPost.title,
        content: newPost.content,
        userId: user.uid, // Añadir el ID del usuario que hizo la publicación
      });
      setNewPost({ title: "", content: "" }); // Limpiar formulario
    } catch (error) {
      setPostError("Error al agregar el post. Intenta nuevamente.");
      console.error("Error al agregar el post: ", error);
    }
  };

  // Función para redirigir al login
  const handleLoginRedirect = () => {
    navigate("/login"); // Redirige a la página de login
  };

  // Función para redirigir al registro
  const handleRegisterRedirect = () => {
    navigate("/register"); // Redirige a la página de registro
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/login"); // Redirige al login tras cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <div className="home-container">
      <h1>Muro Interactivo</h1>

      {/* Botón de cerrar sesión visible solo si el usuario está autenticado */}
      {user && (
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      )}

      {/* Mostrar solo si el usuario está autenticado */}
      {user ? (
        <div className="post-form-container">
          <h2>Crear Nueva Publicación</h2>
          {postError && <p className="error-message">{postError}</p>} {/* Muestra el error */}
          <form onSubmit={handleAddPost} className="post-form">
            <div className="form-field">
              <label>Título:</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Contenido:</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
            </div>
            <button type="submit">Publicar</button>
          </form>
        </div>
      ) : (
        <div className="login-message">
          <p>Para crear una publicación, por favor inicia sesión.</p>
          {/* Botón de iniciar sesión */}
          <button className="login-btn" onClick={handleLoginRedirect}>Iniciar Sesión</button>
          {/* Botón de registrarse */}
          <button className="register-btn" onClick={handleRegisterRedirect}>Registrarse</button>
        </div>
      )}

      <div className="posts-container">
        <h2>Publicaciones</h2>
        {posts.length === 0 ? (
          <p>No hay publicaciones aún.</p>
        ) : (
          posts.map(({ title, content }, index) => (
            <div key={index} className="post-card">
              <h3>{title}</h3>
              <p>{content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
