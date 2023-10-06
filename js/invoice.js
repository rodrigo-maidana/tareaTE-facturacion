let invoiceList = [];

function invoiceListUpdate() {
  const invoiceListJSON = JSON.stringify(invoiceList);
  localStorage.setItem(
    "tareaTE-facturacion-invoiceList-rmaidana",
    invoiceListJSON
  );
}

function formatDate(date) {
  const newDate = new Date(date);
  const dia = newDate.getDate().toString().padStart(2, "0");
  const mes = (newDate.getMonth() + 1).toString().padStart(2, "0"); // Los meses son indexados desde 0
  const año = newDate.getFullYear().toString();

  return `${dia}-${mes}-${año}`;
}

function Invoice(
  id,
  doc,
  name,
  address,
  phone,
  concept,
  date,
  invoiceNumber,
  seller
) {
  this.id = id;
  this.doc = doc;
  this.name = name;
  this.address = address;
  this.phone = phone;
  this.concept = concept;
  this.date = date;
  this.invoiceNumber = invoiceNumber;
  this.seller = seller;
}

function updateInvoiceList() {
  const invoiceTable = document.querySelector(".invoiceTable");
  if (invoiceList.length === 0) {
    invoiceTable.innerHTML = "No hay facturas cargadas";
    return;
  }

  const buff = [];
  buff.push('<table class="table table-bordered" id="prev-invoice-list">');
  buff.push("  <thead>");
  buff.push("    <tr>");
  buff.push("      <th>Id</th>");
  buff.push("      <th>Documento</th>");
  buff.push("      <th>Razon Social</th>");
  buff.push("      <th>Dirección</th>");
  buff.push("      <th>Teléfono</th>");
  buff.push("      <th>date</th>");
  buff.push("      <th>Número de Factura</th>");
  buff.push("      <th>Vendedor</th>");
  buff.push("      <th>Detalles del Servicio</th>");
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  for (let i = 0; i < invoiceList.length; i++) {
    const tempInvoice = invoiceList[i];

    buff.push("<tr>");
    buff.push("<td>" + tempInvoice.id + "</td>");
    buff.push("<td>" + tempInvoice.doc + "</td>");
    buff.push("<td>" + tempInvoice.name + "</td>");
    buff.push("<td>" + tempInvoice.address + "</td>");
    buff.push("<td>" + tempInvoice.phone + "</td>");
    buff.push("<td>" + tempInvoice.date + "</td>");
    buff.push("<td>" + tempInvoice.invoiceNumber + "</td>");
    buff.push("<td>" + getCurrentUser().name + "</td>");
    buff.push("<td>" + tempInvoice.concept + "</td>");
    buff.push("</tr>");
  }

  buff.push("</tbody>");
  buff.push("</table>");

  invoiceTable.innerHTML = buff.join("\n");
}

function createNewInvoice() {
  verifyAuthUser();

  let id = invoiceList.length;
  id++;
  const doc = document.getElementById("clientDoc");
  const name = document.getElementById("clientName");
  const address = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");
  const concept = document.getElementById("invoiceConcept");
  const date = document.getElementById("invoiceDate");
  const invoiceNumber = document.getElementById("invoiceNumber");
  const seller = getCurrentUser();

  const newDate = formatDate(date.value);

  // Crea un nuevo objeto Invoice con los valores obtenidos del HTML
  const newInvoice = new Invoice(
    id,
    doc.value,
    name.value,
    address.value,
    phone.value,
    concept.value,
    newDate,
    invoiceNumber.value,
    seller
  );

  invoiceList.push(newInvoice);

  doc.value = "";
  name.value = "";
  address.value = "";
  phone.value = "";
  let invoiceAmount = invoiceList.length;
  invoiceAmount++;
  invoiceNumber.value = invoiceAmount;
  alert("La factura se ha guardado correctamente!");
  invoiceListUpdate();
  updateInvoiceList();
}
