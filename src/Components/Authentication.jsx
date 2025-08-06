import { useState } from 'react';
import '../Styles/Authentication.css';
import { ChefHat, User, X } from 'lucide-react';
import '../Styles/Login.css';


const Authentication = ({ onClose }) => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [password1, setPassword1] = useState('');
   const [password2, setPassword2] = useState('');
   const [error, setError] = useState('');
   const [showRegister, setShowRegister] = useState(false)
   const [termsAccepted, setTermsAccepted] = useState(false)

   // VALIDADION DEL INPUT EMAIL
   const validarEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };
   // VALIDADION DEL INPUT PASSWORD
   const validarPassword = (pass) => {
      return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(pass);
   };

   const mostrarToast = (mensaje, tipo = 'success') => {
      const toast = document.getElementById('toast');
      toast.textContent = mensaje;
      toast.className = `toast show ${tipo}`;
      setTimeout(() => {
         toast.className = 'toast';
      }, 3000);
   };


   //FUNCION DEL BTNLOGIN
   const handleLogin = (e) => {
      e.preventDefault();

      if (!validarEmail(username)) {
         setError('Correo inválido. Debe tener un formato válido como nombre@dominio.com');
         return;
      }

      if (!validarPassword(password)) {
         setError('Contraseña inválida. Debe tener mínimo 6 caracteres, incluyendo letras y números.');
         return;
      }

      fetch('https://json-backend-reservas3.onrender.com/usuarios')
         .then(res => res.json())
         .then(data => {
            const usuarioEncontrado = data.find(u => u.username === username && u.password === password);
            if (usuarioEncontrado) {
            // Limpiar el nombre para mostrarlo sin números ni puntos finales
            const nombreLimpio = usuarioEncontrado.username
               .split('@')[0]
               .replace(/\d+/g, '')
               .replace(/\.+$/, '');
               
            const user = {
               name: nombreLimpio,
               rol: usuarioEncontrado.username === 'admin@gmail.com' ? 'admin' : 'cliente'
            };
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('userLoggedIn'));
            onClose();
            window.location.href = '/';
            } else {
            setError('Credenciales incorrectas.');
            }
         })
         .catch(err => {
            console.error('Error al iniciar sesión:', err);
            setError('Error de conexión con el servidor.');
         });
      };


   //FUNCION DEL BTNREGISTRER
   const handleRegister = async (e) => {
      e.preventDefault();

      if (!validarEmail(username)) {
         mostrarToast('Correo inválido. Debe tener un formato válido.', 'error');
         return;
      }

      if (!validarPassword(password1 || password2)) {
         mostrarToast('Contraseña inválida. Debe tener mínimo 6 caracteres, incluyendo letras y números.', 'error');
         return;
      }

      if (password1 !== password2) {
         mostrarToast('Las contraseñas no coinciden.', 'error');
         return;
      }

      // Validar si ya existe el usuario en la base de datos
      const response = await fetch(`https://json-backend-reservas3.onrender.com/usuarios?username=${username}`);
      const usuarios = await response.json();

      if (usuarios.length > 0) {
         mostrarToast('Este correo ya está registrado. Intenta iniciar sesión.', 'error');
         return;
      }

      // Crear nuevo usuario
      const nuevoUsuario = { username, password: password1, rol: 'cliente' };

      await fetch('https://json-backend-reservas3.onrender.com/usuarios', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(nuevoUsuario)
      });

      mostrarToast('Usuario registrado correctamente ✅', 'success');

      setUsername('');
      setPassword1('');
      setPassword2('');
      setError('');
      setShowRegister(false); // Cambia la vista de login
      };


   //FUNCION DE VISTA DEL LOGIN O REGISTER
   const handleShowRegister = () => {
      setShowRegister(!showRegister)
   }

   //VALIDACION DEL CHECKBOX - HABILITA BTN REGISTRAR
   const handleCheckboxChange = () => {
    setTermsAccepted(!termsAccepted)
   }

     return (
            <article className="login-wrapper">
               {!showRegister ? (
                  // Login
                  <div className='login-container'>
                    <div className='login-close-button' onClick={onClose}>
                        <X size={20} />
                    </div>
                  <section className='login-header'>
                     <div className='login-icon-container'>
                        <ChefHat className='login-icon' />
                     </div>
                     <h2 className='login-title'>Iniciar Sesión</h2>
                     <p className='login-subtext'>Accede a tu cuenta para continuar</p>
                  </section>

                  <section className='login-form'>
                     <label>Correo Electrónico</label>
                     <input
                        type="text"
                        placeholder="tu@email.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                     />

                     <label>Contraseña</label>
                     <input
                        type="password"
                        placeholder="..............."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                     />

                     {error && <p className='error-message'>{error}</p>}
                  </section>

                  <section className='forgot-password-section'>
                     <a href="" className='login-link'>¿Olvidaste tu contraseña?</a>
                  </section>

                  <section className='actions-section'>
                     <button onClick={handleLogin} className='btn-login'>Iniciar Sesión</button>
                     <button onClick={onClose} className='btn-close'>Cancelar</button>
                  </section>

                  <section className='switch-auth-section'>
                     <p className='switch-text'>¿No tienes cuenta?
                        <a onClick={handleShowRegister} className='login-link switch-link'> Regístrate aquí</a>
                     </p>
                  </section>
                  </div>
               ) : (
                  // Register
                  <div className='login-container'>
                     <div className='login-close-button' onClick={onClose}>
                        <X size={20} />
                     </div>
                  <section className='login-header'>
                     <div className='register-icon-container'>
                        <User className='register-icon' />
                     </div>
                     <h2 className='login-title'>Crear Cuenta</h2>
                     <p className='login-subtext'>Accede a tu cuenta para continuar</p>
                  </section>

                  <section className='login-form'>
                     <label>Correo Electrónico</label>
                     <input
                        type="text"
                        placeholder="tu@email.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                     />

                     <label>Contraseña</label>
                     <input
                        type="password"
                        placeholder="..............."
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                     />

                     <label>Confirmar Contraseña</label>
                     <input
                        type="password"
                        placeholder="..............."
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                     />

                     {error && <p className='error-message'>{error}</p>}
                  </section>

                  <section className='terms-section'>
                     <input type="checkbox" onChange={handleCheckboxChange} />
                     <p className='terms-text'>Acepto los <a className='login-link terms-link'>términos y condiciones</a></p>
                  </section>

                  <section className='actions-section'>
                     <button
                        onClick={handleRegister}
                        className='btn-register'
                        disabled={!termsAccepted}
                     >
                        Crear Cuenta
                     </button>
                     <button onClick={onClose} className='btn-close'>Cancelar</button>
                  </section>

                  <section className='switch-auth-section'>
                     <p className='switch-text'>¿Ya tienes cuenta?
                        <a onClick={handleShowRegister} className='login-link switch-link'> Inicia sesión</a>
                     </p>
                  </section>
                  </div>
               )}

               <div id="toast" className="toast"></div>
            </article>
            );
            };


export default Authentication;
