const formularioLogin = document.getElementById("formLogin");
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");
const authURL = "http://10.144.2.194/zabbix/api_jsonrpc.php";
let authToken = null;

localStorage.setItem("username", username);

document.addEventListener('DOMContentLoaded', () => {
  const usernameElement = document.getElementById("username");
  const username = localStorage.getItem("username");
  usernameElement.textContent = username;
});


// Agrega el evento que se ejecutará cuando el contenido de la página haya cargado
document.addEventListener("DOMContentLoaded", async () => { 
  
  const storedToken = localStorage.getItem("authToken");
  const currentPath = window.location.pathname;
  
  if (storedToken) {
    authToken = storedToken;

    // Verifica si el usuario está tratando de acceder a "/HTML/index.html" manualmente
    if (currentPath.includes("/HTML/index.html")) {
      // Determina la página a la que debe redirigirse el usuario
      const redirectTo = "/HTML/main.html";
      window.location.href = redirectTo;
    }
  } else {
    // Verifica si el usuario está tratando de acceder a "/HTML/main.html" manualmente
    if (currentPath.includes("/HTML/main.html")) {
      // Si el usuario no está logueado, redirige a la página de inicio de sesión
      window.location.href = "/HTML/index.html";
    }
  }
  
}); // <- Cierre del bloque `DOMContentLoaded`

// Función para realizar el inicio de sesión
async function login(event) {
  event.preventDefault(); // Evita que el formulario se envíe automáticamente

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const params = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch(authURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "user.login",
        params: params,
        id: 1,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result !== undefined) {
        authToken = data.result;

        // Set the username in the local storage
        localStorage.setItem("username", username);

        // Almacenar el token en el almacenamiento local
        localStorage.setItem("authToken", authToken);

        // Verificar los grupos y redirigir según el resultado
        const responseGroups = await fetch(authURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "user.get",
            params: {
              output: ["userid", "alias", "usrgrps"],
              selectUsrgrps: ["usrgrpid", "name"],
            },
            auth: authToken,
            id: 1,
          }),
        });

        if (responseGroups.ok) {
          const userData = await responseGroups.json();
          const userGroups = userData.result[0]?.usrgrps || [];

          // Verificar si el usuario pertenece a alguno de los grupos del primer conjunto
          const primerConjuntoIds = ["14", "7"];
          const perteneceAAlgunGrupoPrimerConjunto = userGroups.some((group) =>
            primerConjuntoIds.includes(group.usrgrpid)
          );

          if (perteneceAAlgunGrupoPrimerConjunto) {
            // Pasar el nombre de usuario como un parámetro de consulta
            const url = new URL("/HTML/main.html", window.location.href);
            url.searchParams.append("username", username);
            window.location.href = url.toString();
          } else {
            // Si no pertenece al primer conjunto, verificar el segundo conjunto
            const segundoConjuntoIds = ["25", "50", "26", "7"];
            const perteneceAAlgunGrupoSegundoConjunto = userGroups.some(
              (group) => segundoConjuntoIds.includes(group.usrgrpid)
            );

            if (perteneceAAlgunGrupoSegundoConjunto) {
              // Realizar la redirección a la interfaz correspondiente
              window.location.href = "ppp.html";
            } else {
              // Redirigir a la página principal "/HTML/main.html"
              // window.location.href = "/HTML/main.html";
            }
          }
        } else {
          console.error(
            "Error al obtener información del usuario:",
            responseGroups.statusText
          );
        }
      } else {
        // Mostrar una alerta de usuario o contraseña incorrecta
        alert("Usuario o contraseña incorrecta.");
        formularioLogin.reset();
      }
    } else {
      console.error("Error al iniciar sesión:", response.statusText);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
}

// Función para cerrar sesión
async function logout() {
  if (authToken) {
    try {
      const response = await fetch(authURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "user.logout",
          params: [],
          id: 1,
          auth: authToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión.");
      }

      // Eliminar el token del almacenamiento local
      localStorage.removeItem("authToken");
      // Establecer el token como nulo
      authToken = null;

      // Redirigir a la página de inicio de sesión
      window.location.href = "/HTML/index.html";
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  }
}

// Función para verificar la sesión
async function checkSession(sessionId) {
  try {
    const response = await fetch(authURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "user.checkAuthentication",
        params: {
          sessionid: sessionId,
        },
        id: 1,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result) {
        return true;
      } else {
        console.error("Sesión no válida.");
        return false;
      }
    } else {
      console.error("Sesión no válida.");
      return false;
    }
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    return false;
  }
}

// Función que verificará si el usuario ha iniciado sesión
async function checkLoggedIn() {
  const storedToken = localStorage.getItem("authToken");
  if (!storedToken) {
    // Si no hay un token almacenado, redirigir a la página de inicio de sesión
    window.location.href = "/HTML/index.html";
    return;
  }

  // Si hay un token almacenado, verificar si la sesión es válida
  try {
    const sessionValid = await checkSession(storedToken);
    if (!sessionValid) {
      // Si la sesión no es válida, redirigir a la página de inicio de sesión
      window.location.href = "/HTML/index.html";
    }
  } catch (error) {
    // Si hay un error, redirigir a la página de inicio de sesión
    window.location.href = "/HTML/index.html";
  }
}
