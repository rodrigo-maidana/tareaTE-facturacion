let clientList = [];
let clientStatusModify = false;
let clientBeingModified = 0;

function initClients() {
  console.log("Página completamente cargada");

  // Verifica si hay usuarios almacenados en localStorage.
  const storedUsers = localStorage.getItem("tareaTE-facturacion-rmaidana");
  if (storedUsers) {
    usersList = JSON.parse(storedUsers);
  }

  const storedClients = localStorage.getItem(
    "tareaTE-facturacion-clientList-rmaidana"
  );
  if (storedClients) {
    clientList = JSON.parse(storedClients);
  }

  // Este código hará un refresh de la página después de que el usuario haga clic en el botón "Volver"
  window.onpopstate = (event) => {
    verifyAuthUser();
  };

  updateClientTable();
}

function Client(id, name, ruc, address, phone) {
  this.id = id;
  this.name = name;
  this.ruc = ruc;
  this.address = address;
  this.phone = phone;
  this.active = true;
}

function getClient(id) {
  // Itera sobre la lista de clientes para buscar el cliente por ID
  for (let i = 0; i < clientList.length; i++) {
    const currentClient = clientList[i];

    // Verifica si el cliente actual no es null y tiene el ID correcto
    if (currentClient && currentClient.id === id) {
      return currentClient; // Devuelve el cliente si se encuentra
    }
  }

  // Si no se encuentra el cliente, devuelve null
  return null;
}

function getClientByRuc(ruc) {
  // Itera sobre la lista de clientes para buscar el cliente por RUC
  for (let i = 0; i < clientList.length; i++) {
    if (clientList[i].ruc === ruc) {
      return clientList[i]; // Devuelve el cliente si se encuentra
    }
  }

  // Si no se encuentra el cliente, devuelve null
  return null;
}

function downloadClientsList() {
  const clientListJSON = JSON.stringify(clientList);
  localStorage.setItem(
    "tareaTE-facturacion-clientList-rmaidana",
    clientListJSON
  );
}

function updateClientTable() {
  const clientTable = document.querySelector(".clientsTable");
  if (clientList.length === 0 || clientList.every((client) => !client.active)) {
    clientTable.innerHTML = "No hay clientes cargados";
    return;
  }

  const buff = [];
  buff.push('<table class="table table-bordered" id="prev-invoice-list">');
  buff.push("  <thead style='vertical-align:middle;'>");
  buff.push("    <tr>");
  buff.push("      <th>Id</th>");
  buff.push("      <th>Razon Social</th>");
  buff.push("      <th>Documento</th>");
  buff.push("      <th>Dirección</th>");
  buff.push("      <th>Teléfono</th>");
  buff.push("      <th>Modificar</th>");
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  for (let i = 0; i < clientList.length; i++) {
    const tempClient = clientList[i];

    if (tempClient.active === true) {
      buff.push("<tr>");
      buff.push("<td>" + tempClient.id + "</td>");
      buff.push("<td>" + tempClient.name + "</td>");
      buff.push("<td>" + tempClient.ruc + "</td>");
      buff.push("<td>" + tempClient.address + "</td>");
      buff.push("<td>" + tempClient.phone + "</td>");
      buff.push(
        "<td class='text-center'>" +
          "<img src='/img/pencil.webp' alt='Modificar' width='20' height='20' onclick='modifyClient(" +
          tempClient.id +
          ")' style='cursor: pointer; margin-right: 5px;'></img>" +
          "<img src='/img/trash-can.webp' alt='Borrar' width='20' height='20' onclick='deleteClient(" +
          tempClient.id +
          ")' style='cursor: pointer; margin-left: 5px;'></img>" +
          "</td>"
      );
    }

    buff.push("</tr>");
  }

  buff.push("</tbody>");
  buff.push("</table>");

  clientTable.innerHTML = buff.join("\n");
}

function createNewClient() {
  verifyAuthUser();
  let id = clientList.length;
  id++;
  const ruc = document.getElementById("clientRuc");
  const name = document.getElementById("clientName");
  const address = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");
  if (!name.value) {
    name.classList.add("is-invalid");
    return;
  } else {
    name.classList.remove("is-invalid");
  }

  if (!ruc.value) {
    ruc.classList.add("is-invalid");
    return;
  } else {
    ruc.classList.remove("is-invalid");
  }

  const isRucTaken = clientList.some(
    (client) => client.ruc === ruc.value && client.active === true
  );
  if (isRucTaken) {
    ruc.classList.add("is-invalid");
    ruc.value = "";
    alert("Ya existe un cliente con ese RUC");
    return;
  }

  // Crea un nuevo objeto client con los valores obtenidos del HTML
  const newclient = new Client(
    id,
    name.value,
    ruc.value,
    address.value,
    phone.value
  );

  clientList.push(newclient);

  ruc.value = "";
  name.value = "";
  address.value = "";
  phone.value = "";
  alert("Cliente guardado correctamente!");
  downloadClientsList();
  updateClientTable();
}

function modifyClient(id) {
  //modificar interfaz
  if (clientStatusModify === false) {
    toggleButtons();
  }

  verifyAuthUser();

  const ruc = document.getElementById("clientRuc");
  const name = document.getElementById("clientName");
  const address = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");

  const tempClient = getClient(id);
  ruc.value = tempClient.ruc;
  name.value = tempClient.name;
  address.value = tempClient.address;
  phone.value = tempClient.phone;

  clientBeingModified = tempClient.id;
}

function modifyClientData() {
  const name = document.getElementById("clientName");
  const ruc = document.getElementById("clientRuc");
  const address = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");

  const tempClient = getClient(clientBeingModified);

  if (!name.value) {
    name.classList.add("is-invalid");
    return;
  } else {
    name.classList.remove("is-invalid");
  }

  if (!ruc.value) {
    ruc.classList.add("is-invalid");
    return;
  } else {
    ruc.classList.remove("is-invalid");
  }

  const isRucTaken = clientList.some(
    (client) => client.ruc === ruc.value && client.active === true
  );
  if (isRucTaken && tempClient.ruc !== ruc.value) {
    ruc.classList.add("is-invalid");
    ruc.value = "";
    alert("Ya existe un cliente con ese RUC");
    return;
  }

  tempClient.name = name.value;
  tempClient.ruc = ruc.value;
  tempClient.address = address.value;
  tempClient.phone = phone.value;
  clientList[tempClient.id - 1] = tempClient;

  alert("Cliente modificado correctamente!");
  downloadClientsList();
  updateClientTable();
  clientBeingModified = 0;
  window.location.reload();
}

function cancelModifyClientData() {
  //modificar interfaz
  toggleButtons();

  verifyAuthUser();

  const name = document.getElementById("clientName");
  const ruc = document.getElementById("clientRuc");
  const address = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");

  name.value = "";
  ruc.value = "";
  address.value = "";
  phone.value = "";
  clientBeingModified = 0;
}

function deleteClient(id) {
  const confirmed = confirm(
    "¿Estás seguro de que quieres borrar a este cliente?"
  );

  if (confirmed) {
    const clientIndex = clientList.findIndex((client) => client.id === id);
    clientList[clientIndex].active = false;

    downloadClientsList();
    updateClientTable();
    window.location.reload();
  }
}

function toggleButtons() {
  const newClientTitle = document.getElementById("newClientDiv");
  const modifyClientTitle = document.getElementById("modifyClientDiv");

  // Cambiar la visibilidad sin verificar existencia
  newClientTitle.hidden = !newClientTitle.hidden;
  modifyClientTitle.hidden = !modifyClientTitle.hidden;

  const newClientButton = document.getElementById("newClientButton");
  const modifyClientButton = document.getElementById("modifyClientButton");
  const cancelModifyClientButton = document.getElementById(
    "cancelModifyClientButton"
  );

  newClientButton.hidden = !newClientButton.hidden;
  modifyClientButton.hidden = !modifyClientButton.hidden;
  cancelModifyClientButton.hidden = !cancelModifyClientButton.hidden;
  clientStatusModify = !clientStatusModify;
}
