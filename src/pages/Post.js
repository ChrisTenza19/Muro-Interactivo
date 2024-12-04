import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

function Post() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      // Guardamos el post con el correo del usuario y la fecha
      await addDoc(collection(db, "posts"), {
        title,
        content,
        userEmail: auth.currentUser.email, // Guardamos el correo electrónico
        createdAt: new Date(), // Guardamos la fecha y hora de publicación
      });
      alert("Post publicado con éxito.");
      setTitle(""); // Limpiar campos
      setContent(""); // Limpiar campos
    } catch (error) {
      alert("Error al publicar: " + error.message);
    }
  };

  return (
    <div>
      <h1>Crear Post</h1>
      <form onSubmit={handlePost}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Publicar</button>
      </form>
    </div>
  );
}

export default Post;
