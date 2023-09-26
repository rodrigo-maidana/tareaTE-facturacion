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
