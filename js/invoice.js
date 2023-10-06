let invoiceList = [];

function Invoice(id, doc, name, address, phone, date, invoiceNumber, seller) {
  this.id = id;
  this.doc = doc;
  this.name = name;
  this.address = address;
  this.phone = phone;
  this.date = date;
  this.invoiceNumber = invoiceNumber;
  this.seller = seller;
}

function addNewRow() {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>
      <input type="text" class="form-control" id="productName0"/>
    </td>
    <td>
      <input type="number" class="form-control" id="productAmount0" />
    </td>
    <td>
      <input type="number" class="form-control" id="productPrice0" />
    </td>
    `;
  document.querySelector("#product-details-table tbody").appendChild(newRow);
}

function getInvoiceDetails() {}

function createNewInvoice() {
  verifyAuthUser();

  let id = invoiceList.length;
  id++;
  const doc = document.getElementById("clientDoc");
  const name = document.getElementById("clientName");
  const address = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");
  const date = document.getElementById("invoiceDate");
  const invoiceNumber = document.getElementById("invoiceNumber");
  const seller = getCurrentUser();

  // Crea un nuevo objeto Invoice con los valores obtenidos del HTML
  const newInvoice = new Invoice(
    id,
    doc.value,
    name.value,
    address.value,
    phone.value,
    date.value,
    invoiceNumber.value,
    seller
  );

  invoiceList.push(newInvoice);

  doc.value = "";
  name.value = "";
  address.value = "";
  phone.value = "";
  invoiceNumber.value = "";
  alert("La factura se ha guardado correctamente!");
}
