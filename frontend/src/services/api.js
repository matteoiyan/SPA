const API_URL = "http://18.234.83.186:8000";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Correo o contraseña incorrectos");
  }

  return response.json();
}

export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el usuario");
  }

  return response.json();
}

export async function getVideos() {
  const response = await fetch(`${API_URL}/videos`, { signal: AbortSignal.timeout(15000) });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los videos");
  }

  return response.json();
}

export { API_URL };
export async function getVideo(id) {
  const response = await fetch(`${API_URL}/videos/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el video");
  }

  return response.json();
}

export async function getComments(videoId) {
  const response = await fetch(
    `${API_URL}/videos/${videoId}/comments`
  );

  if (!response.ok) {
    throw new Error("No se pudieron obtener los comentarios");
  }

  return response.json();
}

export async function createComment(videoId, content) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/videos/${videoId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo publicar el comentario");
  }

  return response.json();
}
export async function getMe() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el usuario");
  }

  return response.json();
}

export async function uploadVideo(
  title,
  description,
  videoFile,
  thumbnailFile
) {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("video_file", videoFile);
  formData.append("thumbnail_file", thumbnailFile);

  const response = await fetch(`${API_URL}/videos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("No se pudo subir el video");
  }

  return response.json();
}
export async function updateVideo(id, title, description) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/videos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el video");
  }

  return response.json();
}


export async function deleteVideo(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/videos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el video");
  }

  return response.json();
}
export async function getUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el usuario");
  }

  return response.json();
}