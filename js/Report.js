function initReport() {
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
  // Este código hará un refresh de la página después de que el usuario haga clic en el botón "Volver"
  window.onpopstate = (event) => {
    verifyAuthUser();
  };

  showSellers();
}

function generateReport() {
  verifyAuthUser();
  // Obtiene los valores seleccionados por el usuario (vendedor, fecha de inicio y fecha de fin)
  const selectedSeller = document.getElementById("selectSeller").value;
  const firstDate = document.getElementById("firstDate").value;
  const finalDate = document.getElementById("finalDate").value;

  // Verifica si los campos obligatorios están completos
  if (selectedSeller === null) {
    document.getElementById("selectSeller").classList.add("invalid-feedback");
    return;
  } else {
    document
      .getElementById("selectSeller")
      .classList.remove("invalid-feedback");
  }

  if ((firstDate = "")) {
    document.getElementById("firstDate").classList.add("invalid-feedback");
    return;
  } else {
    document.getElementById("firstDate").classList.remove("invalid-feedback");
  }

  if ((finalDate = "")) {
    document.getElementById("finalDate").classList.add("invalid-feedback");
    return;
  } else {
    document.getElementById("finalDate").classList.remove("invalid-feedback");
  }

  // Realiza cálculos para las ventas y comisiones
  // Aquí debes escribir la lógica para obtener los datos de ventas y comisiones

  // Crea el HTML para mostrar las ventas y comisiones
  const reportHTML = `
            <h2>Reporte de Ventas</h2>
            <p>Vendedor: ${selectedSeller.name}</p>
            <p>Fecha de Inicio: ${firstDate}</p>
            <p>Fecha de Fin: ${finalDate}</p>
            
            <ul>
                <li>Venta 1 - Comisión: $50.00</li>
                <li>Venta 2 - Comisión: $75.00</li>
                <!-- Agrega más ventas y comisiones según sea necesario -->
            </ul>
            
        `;

  // Agrega el HTML al contenedor de informes
  const reportContainer = document.querySelector(".report");
  reportContainer.innerHTML = reportHTML;
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
  let totalSales = 0;
  let totalCommissions = 0;

  invoiceList.forEach((invoice) => {
    if (
      invoice.seller.id === sellerId &&
      invoice.active === true &&
      invoice.date >= startDate &&
      invoice.date <= endDate
    ) {
      totalSales += invoice.total;
      totalCommissions += invoice.total * (invoice.seller.commission / 100);
    }
  });

  return { totalSales, totalCommissions };
}
