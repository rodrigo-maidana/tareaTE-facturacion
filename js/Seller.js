let sellerList = [];
let statusModify = false;
let sellerBeingModified = 0;

function initSellers() {
  console.log("Página completamente cargada");

  // Verifica si hay usuarios almacenados en localStorage.
  const storedSellers = localStorage.getItem("tareaTE-facturacion-sellerList");
  if (storedSellers) {
    sellerList = JSON.parse(storedSellers);
  }

  // Este código hará un refresh de la página después de que el usuario haga clic en el botón "Volver"
  window.onpopstate = (event) => {
    verifyAuthUser();
  };

  updateSellerList();
}

function Seller(id, name, ruc, address, phone, commission) {
  this.id = id;
  this.name = name;
  this.ruc = ruc;
  this.address = address;
  this.phone = phone;
  this.commission = commission;
  this.active = true;
}

function getSeller(id) {
  // Itera sobre la lista de vendedores para buscar el vendedor por ID
  for (let i = 0; i < sellerList.length; i++) {
    const currentSeller = sellerList[i];

    // Verifica si el vendedor actual no es null y tiene el ID correcto
    if (currentSeller && currentSeller.id === id) {
      return currentSeller; // Devuelve el vendedor si se encuentra
    }
  }

  // Si no se encuentra el vendedor, devuelve null
  return null;
}

function getSellerByRuc(ruc) {
  // Itera sobre la lista de vendedores para buscar el vendedor por RUC
  for (let i = 0; i < sellerList.length; i++) {
    if (sellerList[i].ruc === ruc) {
      return sellerList[i]; // Devuelve el vendedor si se encuentra
    }
  }

  // Si no se encuentra el vendedor, devuelve null
  return null;
}

function sellerListUpdate() {
  const sellerListJSON = JSON.stringify(sellerList);
  localStorage.setItem("tareaTE-facturacion-sellerList", sellerListJSON);
}

function updateSellerList() {
  const sellerTable = document.querySelector(".sellersTable");
  if (sellerList.length === 0 || sellerList.every((seller) => !seller.active)) {
    sellerTable.innerHTML = "No hay vendedores cargados";
    return;
  }

  const buff = [];
  buff.push('<table class="table table-bordered" id="prev-invoice-list">');
  buff.push("  <thead style='vertical-align:middle;'>");
  buff.push("    <tr>");
  buff.push("      <th>Id</th>");
  buff.push("      <th>Nombre</th>");
  buff.push("      <th>RUC</th>");
  buff.push("      <th>Dirección</th>");
  buff.push("      <th>Teléfono</th>");
  buff.push("      <th>Comisión (%)</th>");
  buff.push("      <th>Modificar</th>");
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  for (let i = 0; i < sellerList.length; i++) {
    const tempSeller = sellerList[i];

    if (tempSeller.active === true) {
      buff.push("<tr>");
      buff.push("<td>" + tempSeller.id + "</td>");
      buff.push("<td>" + tempSeller.name + "</td>");
      buff.push("<td>" + tempSeller.ruc + "</td>");
      buff.push("<td>" + tempSeller.address + "</td>");
      buff.push("<td>" + tempSeller.phone + "</td>");
      buff.push("<td>" + tempSeller.commission + "</td>");
      buff.push(
        "<td class='text-center'>" +
          "<img src='/img/pencil.webp' alt='Modificar' width='20' height='20' onclick='modifySeller(" +
          tempSeller.id +
          ")' style='cursor: pointer; margin-right: 5px;'></img>" +
          "<img src='/img/trash-can.webp' alt='Borrar' width='20' height='20' onclick='deleteSeller(" +
          tempSeller.id +
          ")' style='cursor: pointer; margin-left: 5px;'></img>" +
          "</td>"
      );
    }

    buff.push("</tr>");
  }

  buff.push("</tbody>");
  buff.push("</table>");

  sellerTable.innerHTML = buff.join("\n");
}

function createNewSeller() {
  verifyAuthUser();
  let id = sellerList.length;
  id++;
  const ruc = document.getElementById("sellerRuc");
  const name = document.getElementById("sellerName");
  const address = document.getElementById("sellerAddress");
  const phone = document.getElementById("sellerPhone");
  const commission = document.getElementById("sellerCommission");

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

  const isRucTaken = sellerList.some(
    (seller) => seller.ruc === ruc.value && seller.active === true
  );
  if (isRucTaken) {
    ruc.classList.add("is-invalid");
    ruc.value = "";
    alert("Ya existe un vendedor con ese RUC");
    return;
  }

  if (commission.value < 0 || commission.value > 100 || !commission.value) {
    commission.classList.add("is-invalid");
    return;
  } else {
    commission.classList.remove("is-invalid");
  }

  // Crea un nuevo objeto seller con los valores obtenidos del HTML
  const newSeller = new Seller(
    id,
    name.value,
    ruc.value,
    address.value,
    phone.value,
    commission.value
  );

  sellerList.push(newSeller);

  ruc.value = "";
  name.value = "";
  address.value = "";
  phone.value = "";
  commission.value = "";
  alert("Vendedor guardado correctamente!");
  sellerListUpdate();
  updateSellerList();
}

function modifySeller(id) {
  //modificar interfaz
  if (statusModify === false) {
    toggleButtons();
  }

  verifyAuthUser();

  const ruc = document.getElementById("sellerRuc");
  const name = document.getElementById("sellerName");
  const address = document.getElementById("sellerAddress");
  const phone = document.getElementById("sellerPhone");
  const commission = document.getElementById("sellerCommission");

  const tempSeller = getSeller(id);
  ruc.value = tempSeller.ruc;
  name.value = tempSeller.name;
  address.value = tempSeller.address;
  phone.value = tempSeller.phone;
  commission.value = tempSeller.commission;

  sellerBeingModified = tempSeller.id;
}

function modifySellerData() {
  const name = document.getElementById("sellerName");
  const ruc = document.getElementById("sellerRuc");
  const address = document.getElementById("sellerAddress");
  const phone = document.getElementById("sellerPhone");
  const commission = document.getElementById("sellerCommission");

  const tempSeller = getSeller(sellerBeingModified);

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

  const isRucTaken = sellerList.some(
    (seller) => seller.ruc === ruc.value && seller.active === true
  );
  if (isRucTaken && tempSeller.ruc !== ruc.value) {
    ruc.classList.add("is-invalid");
    ruc.value = "";
    alert("Ya existe un vendedor con ese RUC");
    return;
  }

  if (commission.value < 0 || commission.value > 100 || !commission.value) {
    commission.classList.add("is-invalid");
    return;
  } else {
    commission.classList.remove("is-invalid");
  }

  tempSeller.name = name.value;
  tempSeller.ruc = ruc.value;
  tempSeller.address = address.value;
  tempSeller.phone = phone.value;
  tempSeller.commission = commission.value;
  sellerList[tempSeller.id - 1] = tempSeller;

  alert("Vendedor modificado correctamente!");
  sellerListUpdate();
  updateSellerList();
  sellerBeingModified = 0;
  window.location.reload();
}

function cancelModifySellerData() {
  //modificar interfaz
  toggleButtons();

  verifyAuthUser();

  const name = document.getElementById("sellerName");
  const ruc = document.getElementById("sellerRuc");
  const address = document.getElementById("sellerAddress");
  const phone = document.getElementById("sellerPhone");
  const commission = document.getElementById("sellerCommission");

  name.value = "";
  ruc.value = "";
  address.value = "";
  phone.value = "";
  commission.value = "";
  sellerBeingModified = 0;
}

function deleteSeller(id) {
  const sellerIndex = sellerList.findIndex((seller) => seller.id === id);
  sellerList[sellerIndex].active = false;

  sellerListUpdate();
  updateSellerList();
  window.location.reload();
}

function toggleButtons() {
  const newSellerTitle = document.getElementById("newSellerDiv");
  const modifySellerTitle = document.getElementById("modifySellerDiv");

  // Cambiar la visibilidad sin verificar existencia
  newSellerTitle.hidden = !newSellerTitle.hidden;
  modifySellerTitle.hidden = !modifySellerTitle.hidden;

  const newSellerButton = document.getElementById("newSellerButton");
  const modifySellerButton = document.getElementById("modifySellerButton");
  const cancelModifySellerButton = document.getElementById(
    "cancelModifySellerButton"
  );

  newSellerButton.hidden = !newSellerButton.hidden;
  modifySellerButton.hidden = !modifySellerButton.hidden;
  cancelModifySellerButton.hidden = !cancelModifySellerButton.hidden;
  statusModify = !statusModify;
}
