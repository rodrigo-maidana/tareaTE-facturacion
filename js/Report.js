function initReport() {
  if (verifyAuthUser()) {
    console.log("Página completamente cargada");

    // Verifica si hay usuarios almacenados en localStorage.
    const storedUsers = localStorage.getItem("tareaTE-facturacion-rmaidana");
    if (storedUsers) {
      usersList = JSON.parse(storedUsers);
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

    const storedShowingInvoice = sessionStorage.getItem(
      "tareaTE-facturacion-showingInvoice-rmaidana"
    );
    if (storedShowingInvoice) {
      showingInvoice = JSON.parse(storedShowingInvoice);
    }

    showSellers();
  } else {
    window.location.href = "/";
  }
}

function generateReport() {
  if (verifyAuthUser()) {
    // Obtiene los valores seleccionados por el usuario (vendedor, fecha de inicio y fecha de fin)
    const selectedSeller = document.getElementById("selectSeller").value;
    const firstDate = document.getElementById("firstDate").value;
    const finalDate = document.getElementById("finalDate").value;

    // Verifica si los campos obligatorios están completos
    if (selectedSeller === "null") {
      alert("Debe seleccionar un vendedor");
      return;
    }

    if (firstDate === "") {
      alert("Debe seleccionar una fecha de inicio");
      return;
    }

    if (finalDate === "") {
      alert("Debe seleccionar una fecha de fin");
      return;
    }

    updateReportInvoiceTable(selectedSeller, firstDate, finalDate);
    calculateSalesAndCommissions(selectedSeller, firstDate, finalDate);
  } else {
    window.location.href = "/";
  }
}

function showSellers() {
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
}

function calculateSalesAndCommissions(sellerId, startDate, endDate) {
  seller = getSeller(parseInt(sellerId));
  let totalSales = 0;
  let totalCommissions = 0;

  invoiceList.forEach((invoice) => {
    if (
      invoice.seller.id === seller.id &&
      invoice.active === true &&
      invoice.date >= startDate &&
      invoice.date <= endDate
    ) {
      totalSales += getInvoiceTotal(invoice);
      totalCommissions +=
        getInvoiceTotal(invoice) * (invoice.seller.commission / 100);
    }
  });

  // Actualizar un elemento HTML con los resultados
  const commissionTable = document.querySelector(".comissionTable");

  commissionTable.innerHTML =
    `<br><h2>Reporte del Vendedor: ` +
    seller.name +
    `</h2>` +
    `<b>Total de Ventas:</b> Gs. ` +
    formatNumber(totalSales) +
    ` <b>Comisiones:</b> Gs. ` +
    formatNumber(totalCommissions) +
    `<br>`;
}

function updateReportInvoiceTable(seller, startDate, endDate) {
  const selectedSeller = getSeller(parseInt(seller));
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
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  invoiceList.forEach((tempInvoice) => {
    let total = 0;

    tempInvoice.detail.forEach((detail) => {
      total += detail.product.price * detail.amount;
    });

    if (
      tempInvoice.active == true &&
      tempInvoice.date >= startDate &&
      tempInvoice.date <= endDate &&
      tempInvoice.seller.id == selectedSeller.id
    ) {
      buff.push("<tr>");
      buff.push("<td>" + tempInvoice.id + "</td>");
      buff.push("<td>" + tempInvoice.client.name + "</td>");
      buff.push("<td>" + tempInvoice.seller.name + "</td>");
      buff.push("<td>" + tempInvoice.condition + "</td>");
      buff.push("<td>" + formatNumber(total) + "</td>");

      buff.push("</tr>");
    }
  });

  buff.push("</tbody>");
  buff.push("</table>");

  invoiceTable.innerHTML = buff.join("\n");
}
