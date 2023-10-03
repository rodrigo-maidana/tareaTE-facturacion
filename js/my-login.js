let usersList = [];

function init() {
  console.log("Página completamente cargada");

  // Verifica si hay usuarios almacenados en localStorage.
  const storedUsers = localStorage.getItem("tareaTE-facturacion-rmaidana");
  if (storedUsers) {
    usersList = JSON.parse(storedUsers);
  }

  // Este código hará un refresh de la página después de que el usuario haga clic en el botón "Volver"
  window.onpopstate = (event) => {
    verifyAuthUser();
  };
}

function createNewUser(name, username, email, password) {
  const id = usersList.length + 1;
  const newUser = { id, name, username, email, password };
  usersList.push(newUser);
  usersUpdate();
}

function getUserByUsername(username) {
  return usersList.find((user) => user.username === username) || null;
}

function usersUpdate() {
  const usersJSON = JSON.stringify(usersList);
  localStorage.setItem("tareaTE-facturacion-rmaidana", usersJSON);
}

function login(username, password) {
  return usersList.some(
    (user) => user.username === username && user.password === password
  );
}

function logOut() {
  const currentUser = null;
  sessionStorage.setItem(
    "tareaTE-facturacion-currentUser-rmaidana",
    currentUser
  );
}

function verifyCredentials(event) {
  // Evita que el formulario se envíe automáticamente
  event.preventDefault();
  // Obtiene los valores de los campos `username` y `password`.
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const wrongCredentials = document.getElementById("wrongUserOrPassword");

  // Valida el campo `username`.
  if (username.value === "") {
    // El campo `username` está vacío.
    username.classList.add("is-invalid");
    username.nextElementSibling.textContent =
      "El nombre de usuario es obligatorio.";
    return false;
  } else {
    username.classList.remove("is-invalid");
  }

  // Valida el campo `password`.
  if (password.value === "") {
    // El campo `password` está vacío.
    password.classList.add("is-invalid");
    password.nextElementSibling.textContent = "La contraseña es obligatoria.";
    return false;
  } else {
    password.classList.remove("is-invalid");
  }

  try {
    if (login(username.value, password.value)) {
      const logedUser = getUserByUsername(username.value);
      const currentUser = JSON.stringify(logedUser);
      sessionStorage.setItem(
        "tareaTE-facturacion-currentUser-rmaidana",
        currentUser
      );
      window.location.href = "/html/home.html";
    } else {
      wrongCredentials.classList.add("d-block");
      wrongCredentials.textContent = "Usuario o contraseña incorrectos";
      password.value = "";

      const currentUser = null;
      sessionStorage.setItem(
        "tareaTE-facturacion-currentUser-rmaidana",
        currentUser
      );
    }
  } catch (error) {
    wrongCredentials.classList.add("d-block");
    wrongCredentials.textContent = "Usuario o contraseña incorrectos";
    password.value = "";
    console.log("No se ha creado ningun usuario");
  }

  return false;
}

function verifyAuthUser() {
  // Verifica si hay un usuario iniciado al momento
  const storedUser = sessionStorage.getItem(
    "tareaTE-facturacion-currentUser-rmaidana"
  );
  const currentUser = JSON.parse(storedUser);

  if (currentUser !== null) {
    console.log("Usuario autenticado:", currentUser.username);
  } else {
    console.log("Usuario no autenticado. Redirigiendo a la página de inicio.");
    window.location.href = "/";
  }
}

function verifyRegister() {
  const name = document.getElementById("name");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const agree = document.getElementById("agree");

  // Valida el campo `name`.
  if (name.value === "") {
    // El campo `name` está vacío.
    name.classList.add("is-invalid");
    name.nextElementSibling.textContent = "El nombre es obligatorio.";
    return false;
  } else {
    name.classList.remove("is-invalid");
  }

  // Valida el campo `username`.
  if (username.value === "") {
    // El campo `username` está vacío.
    username.classList.add("is-invalid");
    username.nextElementSibling.textContent =
      "El nombre de usuario es obligatorio.";
    return false;
  } else {
    username.classList.remove("is-invalid");
  }

  // Valida el campo `email`.
  if (!email.value.includes("@") || !email.value.includes(".")) {
    // El correo electrónico no es válido.
    email.classList.add("is-invalid");
    email.nextElementSibling.textContent =
      "El correo electrónico no es válido.";
    return false;
  } else {
    email.classList.remove("is-invalid");
  }

  // Valida el campo `password`.
  if (password.value === "") {
    // El campo `password` está vacío.
    password.classList.add("is-invalid");
    password.nextElementSibling.textContent = "La contraseña es obligatoria.";
    return false;
  } else {
    password.classList.remove("is-invalid");
  }

  // Valida el campo `agree`.
  if (!agree.checked) {
    // El campo `agree` no está marcado.
    agree.classList.add("is-invalid");
    agree.nextElementSibling.nextElementSibling.textContent =
      "Debes aceptar los términos y condiciones.";
    return false;
  } else {
    agree.classList.remove("is-invalid");
  }

  createNewUser(name.value, username.value, email.value, password.value);
  // Redirigimos al usuario a la página de inicio de sesión.
  window.location.href = "/";

  // Todos los campos son válidos. Pero no enviamos el formulario para hacerlo localmente
  return false;
}
