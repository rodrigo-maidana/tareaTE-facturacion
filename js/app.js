const usersList = [];

function init() {
  // imprime por consola cuando haya terminado de cargarse
  console.log("Pagina completamente cargada");

  const strUsers = localStorage.getItem(localStorageList);

  if (strUsers !== null) {
    const users = JSON.parse(strUsers);

    for (let u of users) {
      usersList.push(u);
    }
    fnActualizarTabla();
  }
}

function fnCrearUsuario() {
  console.log("Creando nuevo usuario");
  divForm.removeAttribute("hidden");
  divTabla.setAttribute("hidden", "");
  fnActualizarTabla();
}

function fnGuardarUsuario() {
  const id = usersList.length + 1;
  const name = document.querySelector("#txtName");
  const email = document.querySelector("#txtEmail");
  const age = document.querySelector("#txtAge");

  const newUser = new User(id, name.value, email.value, age.value);

  usersList.push(newUser);

  console.log("Nuevo usuario creado");
  divForm.setAttribute("hidden", "");
  divTabla.removeAttribute("hidden");
  fnActualizarTabla();
}

function fnCancelarCrearUsuario() {
  console.log("Cancelar nuevo usuario");
  divForm.setAttribute("hidden", "");
  divTabla.removeAttribute("hidden");
  fnActualizarTabla();
}

function fnCrearAdmin() {}
