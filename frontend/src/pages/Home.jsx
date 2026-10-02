import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVideos, getUser } from "../services/api";
import { Icon } from "../Layout";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      try {
        setError("");

        const data = await getVideos();

        const videosWithUsers = await Promise.all(
          data.map(async (video) => {
            try {
              const user = await getUser(video.user_id);

              return {
                ...video,
                userName: user.name,
              };
            } catch {
              return {
                ...video,
                userName: "Usuario",
              };
            }
          })
        );

        if (active) {
          setVideos(videosWithUsers);
        }
      } catch (error) {
        if (active) {
          setError(
            "Comprueba tu conexión y vuelve a intentarlo."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      active = false;
    };
  }, [attempt]);

  const filtered = videos.filter((video) =>
    `${video.title} ${video.description || ""}`
      .toLocaleLowerCase("es")
      .includes(query.trim().toLocaleLowerCase("es"))
  );

  if (sort === "popular") {
    filtered.sort(
      (a, b) => (b.views || 0) - (a.views || 0)
    );
  }

  return (
    <section
      id="catalog"
      className="catalog"
      aria-labelledby="catalog-title"
    >
      <div className="catalog-heading">
        <div>
          <h1 id="catalog-title">Explorar</h1>
          <p>Videos de la comunidad.</p>
        </div>

        <label className="search">
          <Icon name="search" />

          <input
            type="search"
            placeholder="Buscar videos"
            aria-label="Buscar videos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="catalog-toolbar">
        <p aria-live="polite">
          {loading
            ? "Cargando videos…"
            : error
            ? "Catálogo no disponible"
            : `${filtered.length} ${
                filtered.length === 1 ? "video" : "videos"
              }`}
        </p>

        <label className="sort-label">
          Ordenar por

          <select
            aria-label="Ordenar videos"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">
              Predeterminado
            </option>

            <option value="popular">
              Más vistos
            </option>
          </select>
        </label>
      </div>

      {loading ? (
        <div
          className="video-grid"
          aria-label="Cargando videos"
          role="status"
        >
          {[0, 1, 2].map((n) => (
            <div
              className="skeleton-card"
              key={n}
            >
              <div />
              <span />
              <span />
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className="empty-state"
          role="alert"
        >
          <span className="empty-icon">
            <Icon />
          </span>

          <h3>
            No se pudieron cargar los videos
          </h3>

          <p>{error}</p>

          <button
            onClick={() => {
              setLoading(true);
              setError("");
              setAttempt((a) => a + 1);
            }}
          >
            Volver a intentar
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon
              name={query ? "search" : "play"}
            />
          </span>

          <h3>
            {query
              ? "No encontramos ese video"
              : "Todavía no hay videos"}
          </h3>

          <p>
            {query
              ? "Prueba con otro título o una palabra diferente."
              : "Los videos que compartas aparecerán aquí."}
          </p>

          {query ? (
            <button
              onClick={() => setQuery("")}
            >
              Limpiar búsqueda
            </button>
          ) : (
            <Link
              className="button primary"
              to="/profile"
            >
              <Icon name="plus" />
              Subir un video
            </Link>
          )}
        </div>
      ) : (
        <div className="video-grid">
          {filtered.map((video) => (
            <Link
              to={`/video/${video.id}`}
              key={video.id}
              className="video-card"
            >
              <div className="thumbnail">
                <img
                  src={video.thumbnail_url}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.visibility =
                      "hidden";
                  }}
                />

                <span className="card-play">
                  <Icon />
                </span>
              </div>

              <div className="card-body">
                <h3>{video.title}</h3>

                <p>
                  {video.description || ""}
                </p>

                <small>
                  Publicado por: {video.userName}
                </small>

                <small>
                  {new Intl.NumberFormat("es").format(
                    video.views || 0
                  )}{" "}
                  visualizaciones
                  {" · "}
                  {video.created_at
                    ? new Date(
                        video.created_at
                      ).toLocaleDateString("es-EC")
                    : ""}
                </small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}