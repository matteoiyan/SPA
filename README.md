\# Video Platform SPA



Plataforma web de videos desarrollada como una Single Page Application (SPA), utilizando React y Vite para el frontend y FastAPI para el backend.



El proyecto utiliza servicios de Amazon Web Services (AWS) para el despliegue, almacenamiento de archivos y persistencia de datos.



\## Arquitectura



La aplicación utiliza la siguiente arquitectura:



```text

Usuario

&#x20;  |

&#x20;  v

React + Vite

&#x20;  |

&#x20;  v

Amazon S3 - Frontend

&#x20;  |

&#x20;  | HTTP / REST

&#x20;  v

FastAPI

&#x20;  |

&#x20;  v

Amazon EC2

&#x20;  |

&#x20;  +--------------------+

&#x20;  |                    |

&#x20;  v                    v

Amazon RDS          Amazon S3

PostgreSQL          Videos / Miniaturas

```



\### Flujo general



1\. El usuario accede a la SPA desarrollada con React.

2\. El frontend está compilado y alojado en Amazon S3.

3\. React consume la API REST desarrollada con FastAPI.

4\. FastAPI se ejecuta en una instancia de Amazon EC2.

5\. Los datos estructurados se almacenan en Amazon RDS PostgreSQL.

6\. Los videos y miniaturas se almacenan en buckets privados de Amazon S3.

7\. FastAPI genera URLs prefirmadas para permitir acceso temporal a los archivos privados.



\---



\## Tecnologías utilizadas



\### Frontend



\- React

\- Vite

\- JavaScript

\- CSS

\- React Router

\- Fetch API



\### Backend



\- Python

\- FastAPI

\- Uvicorn

\- SQLAlchemy

\- Pydantic

\- PyJWT

\- Boto3

\- Argon2



\### Base de datos



\- PostgreSQL

\- Amazon RDS



\### AWS



\- Amazon EC2

\- Amazon RDS

\- Amazon S3

\- AWS IAM

\- Security Groups



\### Control de versiones



\- Git

\- GitHub



\---



\## Estructura del proyecto



```text

SPA/

|

+-- backend/

|   |

|   +-- app/

|   |   +-- core/

|   |   +-- models/

|   |   +-- routers/

|   |   +-- schemas/

|   |   +-- services/

|   |   +-- database.py

|   |

|   +-- main.py

|   +-- requirements.txt

|

+-- frontend/

|   |

|   +-- src/

|   |   +-- components/

|   |   +-- pages/

|   |   +-- services/

|   |

|   +-- public/

|   +-- package.json

|   +-- package-lock.json

|   +-- vite.config.js

|

+-- .gitignore

+-- README.md

```



\---



\# Funcionalidades



\## Autenticación



La plataforma permite:



\- Registrar nuevos usuarios.

\- Iniciar sesión.

\- Generar tokens JWT.

\- Mantener rutas protegidas.

\- Identificar al usuario autenticado.



Las contraseñas no se almacenan directamente en la base de datos. Se almacenan mediante hashes seguros.



\---



\## Catálogo de videos



La página principal permite visualizar los videos registrados en la plataforma.



Cada video puede mostrar:



\- Miniatura.

\- Título.

\- Descripción.

\- Autor.

\- Número de visualizaciones.

\- Fecha de publicación.



También se implementaron opciones para buscar y ordenar los videos.



\---



\## Reproductor



Cada video tiene una página individual donde se puede visualizar:



\- Video.

\- Título.

\- Descripción.

\- Autor.

\- Número de visualizaciones.

\- Comentarios.

\- Videos recomendados.



Cuando se consulta individualmente un video, el backend incrementa su contador de visualizaciones.



\---



\## Comentarios



Los usuarios autenticados pueden publicar comentarios en los videos.



Los comentarios se relacionan con:



\- Usuario.

\- Video.

\- Contenido.

\- Fecha de creación.



Un usuario también puede eliminar sus propios comentarios.



\---



\## Perfil de usuario



La sección de perfil permite:



\- Consultar nombre y correo.

\- Consultar cantidad de videos publicados.

\- Visualizar los videos propios.

\- Publicar nuevos videos.

\- Editar videos.

\- Eliminar videos.

\- Cerrar sesión.



Las operaciones de modificación y eliminación verifican que el usuario autenticado sea propietario del recurso.



\---



\# API REST



La API fue desarrollada utilizando FastAPI.



\## Usuarios



```http

POST /users

GET /users/{id}

GET /me

```



\## Autenticación



```http

POST /login

```



\## Videos



```http

POST /videos

GET /videos

GET /videos/{id}

PUT /videos/{id}

DELETE /videos/{id}

```



\## Comentarios



```http

POST /videos/{id}/comments

GET /videos/{id}/comments

DELETE /comments/{id}

```



\---



\# Documentación de la API



FastAPI genera automáticamente documentación interactiva mediante Swagger UI.



La documentación está disponible en:



```text

http://18.234.83.186:8000/docs

```



Desde Swagger es posible consultar y probar los endpoints de la API.



\---



\# Base de datos



La plataforma utiliza PostgreSQL mediante Amazon RDS.



La base de datos contiene principalmente las siguientes tablas:



```text

users

videos

comments

```



\## Relaciones principales



```text

users

&#x20; |

&#x20; | 1:N

&#x20; v

videos

&#x20; |

&#x20; | 1:N

&#x20; v

comments



users

&#x20; |

&#x20; | 1:N

&#x20; v

comments

```



Amazon RDS almacena únicamente información estructurada.



Los archivos MP4 y las imágenes no se almacenan directamente dentro de PostgreSQL.



\---



\# Almacenamiento en Amazon S3



El proyecto utiliza tres buckets de Amazon S3.



\## Frontend



```text

mateo-video-platform-frontend-2026

```



Contiene los archivos compilados de React generados mediante:



```bash

npm run build

```



\## Videos



```text

mateo-video-platform-videos-2026

```



Almacena los archivos MP4 publicados por los usuarios.



\## Miniaturas



```text

mateo-video-platform-thumbnails-2026

```



Almacena las imágenes utilizadas como miniaturas.



Los buckets de videos y miniaturas permanecen privados.



El backend utiliza Boto3 y el IAM Role asociado a EC2 para acceder a los archivos.



\---



\# URLs prefirmadas



Los videos y miniaturas privados se entregan mediante URLs prefirmadas de Amazon S3.



El flujo es:



```text

React

&#x20;  |

&#x20;  v

FastAPI

&#x20;  |

&#x20;  v

Boto3

&#x20;  |

&#x20;  v

Amazon S3

&#x20;  |

&#x20;  v

URL prefirmada temporal

&#x20;  |

&#x20;  v

React

```



De esta manera no es necesario hacer públicos los buckets que contienen los archivos multimedia.



\---



\# Seguridad



El proyecto implementa diferentes medidas de seguridad:



\- Autenticación mediante JWT.

\- Hash de contraseñas.

\- Variables de entorno.

\- `.env` excluido mediante `.gitignore`.

\- IAM Role asociado a EC2.

\- Buckets privados para videos y miniaturas.

\- Security Groups.

\- RDS accesible desde el Security Group de EC2.

\- Validación del propietario antes de modificar o eliminar recursos.

\- CORS configurado para permitir el frontend autorizado.



No se almacenan claves de acceso de AWS directamente en el código fuente.



\---



\# CORS



FastAPI utiliza `CORSMiddleware` para permitir solicitudes desde el frontend.



Los orígenes utilizados durante el desarrollo y despliegue son:



```text

http://localhost:5173

http://mateo-video-platform-frontend-2026.s3-website-us-east-1.amazonaws.com

```



\---



\# Ejecución del backend



\## 1. Crear entorno virtual



```bash

python -m venv venv

```



\## 2. Activarlo



Linux:



```bash

source venv/bin/activate

```



Windows:



```powershell

.\\venv\\Scripts\\Activate.ps1

```



\## 3. Instalar dependencias



```bash

pip install -r requirements.txt

```



\## 4. Configurar variables de entorno



Crear un archivo `.env`.



Ejemplo:



```env

DATABASE\_URL=postgresql+psycopg://USUARIO:CONTRASENA@HOST:5432/video\_platform

JWT\_SECRET=CAMBIAR\_POR\_UN\_SECRETO\_SEGURO

AWS\_REGION=us-east-1

S3\_VIDEOS\_BUCKET=mateo-video-platform-videos-2026

S3\_THUMBNAILS\_BUCKET=mateo-video-platform-thumbnails-2026

```



Nunca se debe subir el archivo `.env` al repositorio.



\## 5. Ejecutar FastAPI



```bash

uvicorn main:app --host 0.0.0.0 --port 8000

```



\---



\# Ejecución del frontend



Entrar al directorio:



```bash

cd frontend

```



Instalar las dependencias:



```bash

npm install

```



Ejecutar en modo desarrollo:



```bash

npm run dev

```



Vite ejecutará normalmente la aplicación en:



```text

http://localhost:5173

```



\---



\# Compilación del frontend



Para generar la versión de producción:



```bash

npm run build

```



Vite genera:



```text

frontend/dist/

```



El contenido de esta carpeta se utiliza para desplegar la SPA en Amazon S3.



\---



\# Despliegue



\## Frontend



El frontend se encuentra desplegado como sitio web estático en Amazon S3:



```text

http://mateo-video-platform-frontend-2026.s3-website-us-east-1.amazonaws.com

```



\## Backend



FastAPI está desplegado en Amazon EC2 y utiliza Uvicorn.



La API se encuentra disponible en:



```text

http://18.234.83.186:8000

```



El proceso de FastAPI está configurado mediante `systemd` para iniciarse automáticamente y reiniciarse en caso de fallo.



\---



\# Servicios AWS utilizados



```text

Amazon S3

├── Frontend

├── Videos

└── Miniaturas



Amazon EC2

└── FastAPI + Uvicorn



Amazon RDS

└── PostgreSQL



AWS IAM

└── IAM Role para acceso de EC2 a S3



Security Groups

├── Acceso HTTP/API

├── Acceso SSH administrativo

└── Comunicación EC2 -> RDS

```



\---



\# Flujo de publicación de un video



Cuando un usuario publica un video:



```text

Usuario

&#x20;  |

&#x20;  v

React

&#x20;  |

&#x20;  | multipart/form-data

&#x20;  v

FastAPI

&#x20;  |

&#x20;  +------> S3 Videos

&#x20;  |

&#x20;  +------> S3 Miniaturas

&#x20;  |

&#x20;  v

Amazon RDS

```



FastAPI almacena los archivos multimedia en S3 y registra la información estructurada del video en PostgreSQL.



\---



\# Autor



\*\*Mateo Yánez\*\*



Proyecto desarrollado como parte de la formación en Ingeniería en Sistemas de la Información.



\---



\# Estado del proyecto



Proyecto funcional y desplegado en AWS.



Principales componentes implementados:



\- SPA con React y Vite.

\- API REST con FastAPI.

\- Autenticación JWT.

\- Gestión de usuarios.

\- Gestión de videos.

\- Comentarios.

\- Contador de visualizaciones.

\- Perfil de usuario.

\- PostgreSQL en Amazon RDS.

\- Videos y miniaturas en Amazon S3.

\- Backend desplegado en Amazon EC2.

\- Frontend desplegado en Amazon S3.

