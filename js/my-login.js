const usersList = [];
let isAuthenticated = false;
const localStorageList = "tarea-facturacion-rmaidana";

function init() {
  console.log("Pagina completamente cargada");

  const strUsers = localStorage.getItem(localStorageList);
  if (strUsers !== null) {
    const users = JSON.parse(strUsers);
    for (let u of users) {
      usersList.push(u);
    }
  } else {
    createAdminUser();
  }
}

function createAdminUser() {
  const admin = new User(1, "admin", "admin@rodrigomaidana.com", "password");
  usersList.push(admin);
}

function verifyCredentials() {
  // Obtiene los valores de los campos `username` y `password`.
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Valida el campo `username`.
  if (username === "") {
    // El campo `username` está vacío.
    document.getElementById("username").classList.add("is-invalid");
    document.getElementById("username").nextElementSibling.textContent =
      "El nombre de usuario es obligatorio.";
    return false;
  }

  // Valida el campo `password`.
  if (password === "") {
    // El campo `password` está vacío.
    document.getElementById("password").classList.add("is-invalid");
    document.getElementById("password").nextElementSibling.textContent =
      "La contraseña es obligatoria.";
    return false;
  }

  // Los datos del usuario son válidos.
  return true;
}

function verifyAuth() {
  if (isAuthenticated) {
    console.log("Autenticado");
  } else {
    window.location.href = "/index.html";
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
    name.classList.add("is-valid");
  }

  // Valida el campo `username`.
  if (username.value === "") {
    // El campo `username` está vacío.
    username.classList.add("is-invalid");
    username.nextElementSibling.textContent =
      "El nombre de usuario es obligatorio.";
    return false;
  } else {
    username.classList.add("is-valid");
  }

  // Valida el campo `email`.
  if (!email.value.includes("@") || !email.value.includes(".")) {
    // El correo electrónico no es válido.
    email.classList.add("is-invalid");
    email.nextElementSibling.textContent =
      "El correo electrónico no es válido.";
    return false;
  } else {
    email.classList.add("is-valid");
  }

  // Valida el campo `password`.
  if (password.value === "") {
    // El campo `password` está vacío.
    password.classList.add("is-invalid");
    password.nextElementSibling.textContent = "La contraseña es obligatoria.";
    return false;
  } else {
    password.classList.add("is-valid");
  }

  // Valida el campo `agree`.
  if (!agree.checked) {
    // El campo `agree` no está marcado.
    agree.classList.add("is-invalid");
    agree.nextElementSibling.nextElementSibling.textContent =
      "Debes aceptar los términos y condiciones.";
    return false;
  } else {
    agree.classList.add("is-valid");
  }

  // Todos los campos son válidos.
  return true;
}
