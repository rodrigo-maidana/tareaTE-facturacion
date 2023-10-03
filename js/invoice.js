function addNewRow() {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
      <td>
        <input type="text" class="form-control" />
      </td>
      <td>
        <input type="number" class="form-control" />
      </td>
      <td>
        <input type="number" class="form-control" />
      </td>
    `;
  document.querySelector("#product-details-table tbody").appendChild(newRow);
}

function createNewInvonce() {
  console.log("Crear nueva factura");
}
