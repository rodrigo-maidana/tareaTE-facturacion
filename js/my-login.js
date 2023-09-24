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
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  for (let u of usersList) {
    if (username === u.username && password === u.password) {
      isAuthenticated = true;
      break;
    }
  }

  if (isAuthenticated) {
    console.log("Credenciales correctas");
    window.location.href = "home.html";
    return true; // Permite el envío del formulario
  } else {
    console.log("Usuario o contraseña incorrectos");
    return false; // Evita el envío del formulario
  }
}

function verifyAuth() {
  if (isAuthenticated) {
    console.log("Autenticado");
  } else {
    window.location.href = "index.html";
  }
}
