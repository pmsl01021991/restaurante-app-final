# 🍽️ Restaurante App – Sistema de Reservas

Aplicación web para gestionar reservas de un restaurante. Incluye funcionalidades como visualización de menús, creación y edición de reservas, autenticación de usuarios y administración de clientes. Fue desarrollada usando React y Vite, y utiliza JSON Server como API simulada.

---

## 📌 Objetivos del Proyecto

- Facilitar la gestión de reservas y mesas.
- Simular el flujo de una aplicación real con autenticación.
- Organizar componentes y estilos de manera modular.
- Consumir datos simulados desde un archivo JSON como si fuera una API.

---

## 🚀 Tecnologías Utilizadas

| Tecnología     | Uso Principal                                     |
|----------------|--------------------------------------------------|
| React          | Construcción de interfaces de usuario             |
| Vite           | Herramienta de desarrollo y bundling              |
| JavaScript     | Lenguaje principal del proyecto                   |
| CSS            | Estilos de los componentes                        |
| ESLint         | Análisis estático de código                       |
| JSON Server    | Simulación de una API REST con `db.json`          |

---

## ⚙️ Instalación

### Prerrequisitos

- Node.js
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/restaurante-app.git

# 2. Ir al directorio del proyecto
cd restaurante-app/restaurante-app-final-main

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Iniciar JSON Server (en otra terminal)
npx json-server --watch db.json --port 3001
```

---

## 📂 Estructura del Proyecto

```
├── restaurante-app-final-main/
    ├── .gitignore
    ├── README.md
    ├── db.json
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── vercel.json
    ├── vite.config.js
    ├── yarn.lock
    ├── backend/
    ├── public/
        ├── assets/
            ├── carne.jpeg
            ├── fondo.png
            ├── logo-favicon.png
            ├── mesa_madera.jpeg
            ├── pasta.jpeg
            ├── pizza.jpeg
            ├── pollo.jpeg
    ├── src/
        ├── App.css
        ├── App.jsx
        ├── main.jsx
        ├── Components/
            ├── Authentication.jsx
            ├── Container.jsx
            ├── EditarReservaModal.jsx
            ├── Footer.jsx
            ├── HeroSection.jsx
            ├── Menu.jsx
            ├── Navbar.jsx
        ├── Pages/
            ├── Inicio.jsx
            ├── Reservaciones.jsx
            ├── ReservacionesHechas.jsx
            ├── ReservasLista.jsx
        ├── Styles/
            ├── Authentication.css
            ├── Comensales.css
            ├── EditarReservaModal.css
            ├── Footer.css
            ├── HeroSection.css
            ├── Login.css
            ├── Menu.css
            ├── MesasReservaciones.css
            ├── Navbar.css
            ├── NumeroCliente.css
            ├── Reservaciones.css
            ├── ReservacionesHechas.css
```

---

## 🗂️ Descripción de Carpetas y Archivos Clave

- **App.jsx**: Componente raíz de la aplicación.
- **main.jsx**: Punto de entrada que renderiza el App.
- **db.json**: Contiene datos de ejemplo (clientes, reservas, mesas).
- **vite.config.js**: Configuración de Vite.
- **eslint.config.js**: Reglas de linting del proyecto.
- **Pages/**: Componentes para cada vista o pantalla del sistema.
- **Styles/**: Archivos CSS separados por componente o página.

---

## 📜 Scripts Disponibles

```bash
npm run dev       # Ejecuta Vite en modo desarrollo
npm run build     # Construye la aplicación para producción
npm run preview   # Previsualiza la build
npm run lint      # Ejecuta ESLint para verificar el código
```

---

## 👨‍💻 Autor

- Proyecto académico del curso: Desarrollo de Interfaces 2

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos. Puedes usarlo, modificarlo y adaptarlo libremente.
