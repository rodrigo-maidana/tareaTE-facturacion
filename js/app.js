const usersList = [];
const localStorageList = "proy3_te_local_list";
const divForm = document.querySelector(".divForm");
const divTabla = document.querySelector(".divTabla");

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
  const name = document.querySelector("#txtName");
  const email = document.querySelector("#txtEmail");
  const age = document.querySelector("#txtAge");

  const newUser = new User(name.value, email.value, age.value);

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

function fnActualizarTabla() {
  if (usersList.length === 0) {
    divTabla.innerHTML = "No existen usuarios creados";
    return;
  }

  localStorage.setItem(localStorageList, JSON.stringify(usersList));

  const buff = [];
  buff.push('<table border="1" width="70%">');
  buff.push("  <thead>");
  buff.push("    <tr>");
  buff.push("      <th>Id</th>");
  buff.push("      <th>Nombre</th>");
  buff.push("      <th>Email</th>");
  buff.push("      <th>Edad</th>");
  buff.push("      <th>Acci&oacute;n</th>");
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  for (let i = 0; i < usersList.length; i++) {
    const tmpUser = usersList[i];

    buff.push("<tr>");
    buff.push("<td>" + tmpUser.id + "</td>");
    buff.push("<td>" + tmpUser.nombre + "</td>");
    buff.push("<td>" + tmpUser.email + "</td>");
    buff.push("<td>" + tmpUser.edad + "</td>");
    buff.push("<td>");
    buff.push('<input type="button" value="Borrar" />');
    buff.push('<input type="button" value="Editar" />');
    buff.push("</td>");
    buff.push("</tr>");
  }

  buff.push("</tbody>");
  buff.push("</table>");

  divTabla.innerHTML = buff.join("\n");
}
