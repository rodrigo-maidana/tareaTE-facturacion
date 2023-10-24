let invoiceList = [];
let invoiceDetails = [];
let detailBeingModified = 0;
let showingInvoice = {};

function initInvoiceDetails() {
  if (verifyAuthUser()) {
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

    const storedSellers = localStorage.getItem(
      "tareaTE-facturacion-sellerList-rmaidana"
    );
    if (storedSellers) {
      sellerList = JSON.parse(storedSellers);
    }

    const storedInvoices = localStorage.getItem(
      "tareaTE-facturacion-invoiceList-rmaidana"
    );
    if (storedInvoices) {
      invoiceList = JSON.parse(storedInvoices);
    }

    const storedProducts = localStorage.getItem(
      "tareaTE-facturacion-productList-rmaidana"
    );
    if (storedProducts) {
      productList = JSON.parse(storedProducts);
    }

    const storedShowingInvoice = sessionStorage.getItem(
      "tareaTE-facturacion-showingInvoice-rmaidana"
    );
    if (storedShowingInvoice) {
      showingInvoice = JSON.parse(storedShowingInvoice);
    }

    printInvoice();
  } else {
    window.location.href = "/";
  }
}

function initInvoices() {
  if (verifyAuthUser()) {
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

    const storedSellers = localStorage.getItem(
      "tareaTE-facturacion-sellerList-rmaidana"
    );
    if (storedSellers) {
      sellerList = JSON.parse(storedSellers);
    }

    const storedInvoices = localStorage.getItem(
      "tareaTE-facturacion-invoiceList-rmaidana"
    );
    if (storedInvoices) {
      invoiceList = JSON.parse(storedInvoices);
    }
    // Verifica si hay productos almacenados en localStorage.
    const storedProducts = localStorage.getItem(
      "tareaTE-facturacion-productList-rmaidana"
    );
    if (storedProducts) {
      productList = JSON.parse(storedProducts);
    }
    showClientsAndSellers();
    showProducts();
    updateInvoiceTable();
  } else {
    window.location.href = "/";
  }
}

function uploadInvoiceList() {
  const invoiceListJSON = JSON.stringify(invoiceList);
  localStorage.setItem(
    "tareaTE-facturacion-invoiceList-rmaidana",
    invoiceListJSON
  );
}

function formatDate(date) {
  // Crear un objeto de fecha con la fecha recibida
  const newDate = new Date(date);

  // Convertir a medianoche en UTC
  newDate.setUTCHours(0, 0, 0, 0);

  // Extraer día, mes y año
  const day = newDate.getUTCDate().toString().padStart(2, "0");
  const month = (newDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Los meses son indexados desde 0
  const year = newDate.getUTCFullYear().toString();

  // Formatear la fecha en el formato DD-MM-AAAA
  return `${day}-${month}-${year}`;
}

function Invoice(id, client, date, invoiceNumber, detail, condition, seller) {
  this.id = id;
  this.client = client;
  this.date = date;
  this.invoiceNumber = invoiceNumber;
  this.detail = detail;
  this.condition = condition;
  this.seller = seller;
  this.active = true;
}

function Detail(product, amount) {
  this.product = product;
  this.amount = amount;
}

function getInvoiceTotal(invoice) {
  let total = 0;
  invoice.detail.forEach((detail) => {
    total += detail.product.price * detail.amount;
  });
  return total;
}

function showClientsAndSellers() {
  const storedSellers = localStorage.getItem(
    "tareaTE-facturacion-sellerList-rmaidana"
  );
  if (storedSellers) {
    const sellerList = JSON.parse(storedSellers);
    // Llena el elemento select con opciones basadas en los vendedores
    const sellersSelect = document.getElementById("selectSeller");
    sellerList.forEach((seller) => {
      if (seller.active == true) {
        const option = document.createElement("option");
        option.value = seller.id; // Puedes usar el índice del vendedor como valor
        option.text = seller.name + " - " + seller.ruc; // Muestra el nombre del vendedor como texto de opción
        sellersSelect.appendChild(option);
      }
    });
  }

  const storedClients = localStorage.getItem(
    "tareaTE-facturacion-clientList-rmaidana"
  );

  if (storedClients) {
    const clientList = JSON.parse(storedClients);
    // Llena el elemento select con opciones basadas en los clientes
    const clientsSelect = document.getElementById("selectClient");

    clientList.forEach((client) => {
      if (client.active == true) {
        const option = document.createElement("option");
        option.value = client.id;
        option.text = client.name + " - " + client.ruc;
        clientsSelect.appendChild(option);
      }
    });
  }
}

function showProducts() {
  const storedProducts = localStorage.getItem(
    "tareaTE-facturacion-productList-rmaidana"
  );

  if (storedProducts) {
    const productList = JSON.parse(storedProducts);
    // Llena el elemento select con opciones basadas en los clientes
    const productSelect = document.getElementById("selectProduct");
    productList.forEach((product) => {
      if (product.active == true) {
        const option = document.createElement("option");
        option.value = product.id;
        option.text =
          product.name +
          " - " +
          product.description +
          " (Cod: " +
          product.code +
          ")";
        productSelect.appendChild(option);
      }
    });
  }
}

function getInvoice(id) {
  for (let i = 0; i < invoiceList.length; i++) {
    const currentInvoice = invoiceList[i];

    if (currentInvoice.active && currentInvoice.id === id) {
      return currentInvoice;
    }
  }
}

function createNewInvoice() {
  if (verifyAuthUser()) {
    let id = invoiceList.length;
    id++;
    const selectClient = document.getElementById("selectClient");
    const selectSeller = document.getElementById("selectSeller");
    const selectCondition = document.getElementById("selectCondition");

    if (selectClient.value === "null") {
      alert("Seleccione un Cliente");
      return;
    }

    if (selectSeller.value === "null") {
      alert("Seleccione un Vendedor");
      return;
    }

    if (invoiceDetails.length === 0) {
      alert("No hay detalles cargados");
      return;
    }

    const client = getClient(parseInt(selectClient.value));
    const seller = getSeller(parseInt(selectSeller.value));

    const tempInvoice = new Invoice(
      id,
      client,
      new Date(),
      1000 + id,
      invoiceDetails,
      selectCondition.value,
      seller
    );

    invoiceList.push(tempInvoice);
    uploadInvoiceList();
    updateInvoiceTable();
    window.location.reload();
  } else {
    window.location.href = "/";
  }
}

function updateInvoiceTable() {
  const invoiceTable = document.querySelector(".invoiceTable");
  const buff = [];
  buff.push('<table class="table table-bordered">');
  buff.push("  <thead style='vertical-align:middle;'>");
  buff.push("    <tr>");
  buff.push("      <th>#</th>");
  buff.push("      <th>Razon Social</th>");
  buff.push("      <th>Vendedor</th>");
  buff.push("      <th>Condicion</th>");
  buff.push("      <th>Total</th>");
  buff.push("      <th>Acciones</th>");
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  invoiceList.map((tempInvoice) => {
    let total = 0;

    tempInvoice.detail.forEach((detail) => {
      total += detail.product.price * detail.amount;
    });

    if (tempInvoice.active == true) {
      buff.push("<tr>");
      buff.push("<td>" + tempInvoice.id + "</td>");
      buff.push("<td>" + tempInvoice.client.name + "</td>");
      buff.push("<td>" + tempInvoice.seller.name + "</td>");
      buff.push("<td>" + tempInvoice.condition + "</td>");
      buff.push("<td>" + formatNumber(total) + "</td>");
      buff.push(
        "<td class='text-center'>" +
          "<img src='/img/view.webp' alt='Modificar' width='20' height='20' onclick='showInvoice(" +
          tempInvoice.id +
          ")' style='cursor: pointer; margin-right: 5px;'></img>" +
          "<img src='/img/trash-can.webp' alt='Borrar' width='20' height='20' onclick='deleteInvoice(" +
          tempInvoice.id +
          ")' style='cursor: pointer; margin-left: 5px;'></img>" +
          "</td>"
      );

      buff.push("</tr>");
    }
  });

  buff.push("</tbody>");
  buff.push("</table>");

  invoiceTable.innerHTML = buff.join("\n");
}

function addInvoiceDetail() {
  if (verifyAuthUser()) {
    const productSelect = document.getElementById("selectProduct");
    const productAmount = document.getElementById("productAmount");

    if (productSelect.value === "null") {
      alert("Seleccione un Producto");
      return;
    }

    if (productAmount.value === "") {
      alert("Ingrese una cantidad");
      return;
    }

    invoiceDetails.push(
      new Detail(getProduct(parseInt(productSelect.value)), productAmount.value)
    );
    updateDetailsTable();

    productSelect.value = null;
    productAmount.value = "";
  } else {
    window.location.href = "/";
  }
}

function updateDetailsTable() {
  const detailsTable = document.getElementById("invoiceDetails");

  const buff = [];
  buff.push('<table class="table table-bordered">');
  buff.push("  <thead style='vertical-align:middle;'>");
  buff.push("    <tr>");
  buff.push("      <th>#</th>");
  buff.push("      <th>Producto</th>");
  buff.push("      <th>Cantidad</th>");
  buff.push("      <th>Precio</th>");
  buff.push("      <th>Subtotal</th>");
  buff.push("      <th>Modificar</th>");
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  invoiceDetails.forEach((tempDetail, index) => {
    buff.push("<tr>");
    buff.push("<td>" + ++index + "</td>");
    buff.push("<td>" + tempDetail.product.name + "</td>");
    buff.push("<td>" + tempDetail.amount + "</td>");
    buff.push("<td>" + formatNumber(tempDetail.product.price) + "</td>");
    buff.push(
      "<td>" +
        formatNumber(tempDetail.amount * tempDetail.product.price) +
        "</td>"
    );
    buff.push(
      "<td class='text-center'>" +
        "<img src='/img/pencil.webp' alt='Modificar' width='20' height='20' onclick='modifyDetail(" +
        index +
        ")' style='cursor: pointer; margin-right: 5px;'></img>" +
        "<img src='/img/trash-can.webp' alt='Borrar' width='20' height='20' onclick='deleteDetail(" +
        index +
        ")' style='cursor: pointer; margin-left: 5px;'></img>" +
        "</td>"
    );

    buff.push("</tr>");
  });

  buff.push("</tbody>");
  buff.push("</table>");

  detailsTable.innerHTML = buff.join("\n");
}

function toggleInvoiceButtons() {
  const newInvoiceButtons = document.getElementById("newInvoiceButtons");
  newInvoiceButtons.hidden = !newInvoiceButtons.hidden;

  const editInvoiceButtons = document.getElementById("editInvoiceButtons");
  editInvoiceButtons.hidden = !editInvoiceButtons.hidden;
}

function deleteDetail(id) {
  invoiceDetails.splice(id - 1, 1);
  updateDetailsTable();
}

function modifyDetail(id) {
  if (verifyAuthUser) {
    //Que esta funcion cargue los datos del invoiceDetail en los campos del modal y que cambie el boton de "Agregar" por "Modificar" utilizando la funcion toggleInvoiceButtons()
    toggleInvoiceButtons();
    const productSelect = document.getElementById("selectProduct");
    const productAmount = document.getElementById("productAmount");
    productSelect.value = invoiceDetails[id - 1].product.id;
    productAmount.value = invoiceDetails[id - 1].amount;
    detailBeingModified = id;
  } else {
    window.location.href = "/";
  }
}

function saveModifiedDetail() {
  const id = detailBeingModified;
  const productSelect = document.getElementById("selectProduct");
  const productAmount = document.getElementById("productAmount");

  invoiceDetails[id - 1].product = getProduct(parseInt(productSelect.value));
  invoiceDetails[id - 1].amount = productAmount.value;

  productSelect.value = null;
  productAmount.value = "";

  toggleInvoiceButtons();
  updateDetailsTable();
}

function cancelModifiedDetail() {
  if (verifyAuthUser) {
    toggleInvoiceButtons();
    productSelect.value = null;
    productAmount.value = "";
  } else {
    window.location.href = "/";
  }
}

function showInvoice(id) {
  if (verifyAuthUser()) {
    showingInvoice = getInvoice(id);
    console.log(showingInvoice);
    const showingInvoiceJSON = JSON.stringify(showingInvoice);
    sessionStorage.setItem(
      "tareaTE-facturacion-showingInvoice-rmaidana",
      showingInvoiceJSON
    );

    window.location.href = "/html/invoiceDetails.html";
  } else {
    window.location.href = "/";
  }
}

function printInvoice() {
  const invoice = showingInvoice;
  const invoiceDetails = invoice.detail;
  let totalPrice = 0;

  printInvoiceInfo(invoice);

  const detailsTableBody = document.getElementById("detailsTableBody");
  invoiceDetails.forEach((detail) => {
    const row = document.createElement("tr");
    const description = document.createElement("td");
    const quantity = document.createElement("td");
    const unitPrice = document.createElement("td");
    const subtTotal = document.createElement("td");

    description.textContent = detail.product.name;
    quantity.textContent = detail.amount;
    unitPrice.textContent = formatNumber(detail.product.price);
    subtTotal.textContent = formatNumber(detail.amount * detail.product.price);
    totalPrice += detail.amount * detail.product.price;

    row.appendChild(description);
    row.appendChild(quantity);
    row.appendChild(unitPrice);
    row.appendChild(subtTotal);

    detailsTableBody.appendChild(row);
  });

  //agrega una fila al final que agregue el total
  const finalRow = document.createElement("tr");
  const totalDescription = document.createElement("td");
  const totalQuantity = document.createElement("td");
  const totalUnitPrice = document.createElement("td");
  const totalSubtTotal = document.createElement("td");

  totalDescription.textContent = "TOTAL";
  totalQuantity.textContent = " ";
  totalUnitPrice.textContent = " ";
  totalSubtTotal.textContent = formatNumber(totalPrice);
  finalRow.style.fontWeight = "bold";

  finalRow.appendChild(totalDescription);
  finalRow.appendChild(totalQuantity);
  finalRow.appendChild(totalUnitPrice);
  finalRow.appendChild(totalSubtTotal);
  detailsTableBody.appendChild(finalRow);
}

function printInvoiceInfo(invoice) {
  // Datos del cliente
  document.getElementById("clientDocument").textContent = invoice.client.ruc;
  document.getElementById("clientName").textContent = invoice.client.name;
  document.getElementById("clientAddress").textContent = invoice.client.address;
  document.getElementById("clientPhone").textContent = invoice.client.phone;

  // Datos de la factura
  document.getElementById("invoiceDate").textContent = formatDate(invoice.date);
  document.getElementById("invoiceNumber").textContent = invoice.id;
}

function deleteInvoice(id) {
  if (verifyAuthUser()) {
    const confirmed = confirm(
      "¿Estás seguro de que quieres borrar a este vendedor?"
    );

    if (confirmed) {
      const invoiceIndex = invoiceList.findIndex(
        (invoice) => invoice.id === id
      );
      invoiceList[invoiceIndex].active = false;

      uploadInvoiceList();
      updateInvoiceTable();
      window.location.reload();
    }
  } else {
    window.location.href = "/";
  }
}

function formatNumber(number) {
  const numberString = number.toString();
  const numberLength = numberString.length;
  let formattedNumber = "";

  for (let i = 0; i < numberLength; i++) {
    if (i % 3 === 0 && i !== 0) {
      formattedNumber = "." + formattedNumber;
    }
    formattedNumber = numberString[numberLength - 1 - i] + formattedNumber;
  }

  return formattedNumber;
}
