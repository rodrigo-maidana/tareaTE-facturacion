let productList = [];
let statusModify = false;
let productBeeingModified = 0;

function initProducts() {
  console.log("Página completamente cargada");

  // Verifica si hay productos almacenados en localStorage.
  const storedProducts = localStorage.getItem(
    "tareaTE-facturacion-productList-rmaidana"
  );
  if (storedProducts) {
    productList = JSON.parse(storedProducts);
  }

  // Este código hará un refresh de la página después de que el usuario haga clic en el botón "Volver"
  window.onpopstate = (event) => {
    verifyAuthUser();
  };

  updateProductList();
}

function Product(id, name, code, description, price) {
  this.id = id;
  this.name = name;
  this.code = code;
  this.description = description;
  this.price = price;
  this.active = true;
}

function getProduct(id) {
  // Itera sobre la lista de productos para buscar el producto por ID
  for (let i = 0; i < productList.length; i++) {
    const currentProduct = productList[i];

    // Verifica si el producto actual no es null y tiene el ID correcto
    if (currentProduct && currentProduct.id === id) {
      return currentProduct; // Devuelve el producto si se encuentra
    }
  }

  // Si no se encuentra el producto, devuelve null
  return null;
}

function getProductByCode(code) {
  // Itera sobre la lista de productos para buscar el producto por código
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].code === code) {
      return productList[i]; // Devuelve el producto si se encuentra
    }
  }

  // Si no se encuentra el producto, devuelve null
  return null;
}

function productListUpdate() {
  const productListJSON = JSON.stringify(productList);
  localStorage.setItem(
    "tareaTE-facturacion-productList-rmaidana",
    productListJSON
  );
}

function updateProductList() {
  const productTable = document.querySelector(".productsTable");
  if (
    productList.length === 0 ||
    productList.every((product) => !product.active)
  ) {
    productTable.innerHTML = "No hay productos cargados";
    return;
  }

  const buff = [];
  buff.push('<table class="table table-bordered" id="prev-invoice-list">');
  buff.push("  <thead style='vertical-align:middle;'>");
  buff.push("    <tr>");
  buff.push("      <th>Id</th>");
  buff.push("      <th>Nombre</th>");
  buff.push("      <th>Código</th>");
  buff.push("      <th>Descripción</th>");
  buff.push("      <th>Precio</th>");
  buff.push("      <th>Modificar</th>");
  buff.push("    </tr>");
  buff.push("  </thead>");
  buff.push("  <tbody>");

  for (let i = 0; i < productList.length; i++) {
    const tempProduct = productList[i];

    if (tempProduct.active === true) {
      buff.push("<tr>");
      buff.push("<td>" + tempProduct.id + "</td>");
      buff.push("<td>" + tempProduct.name + "</td>");
      buff.push("<td>" + tempProduct.code + "</td>");
      buff.push("<td>" + tempProduct.description + "</td>");
      buff.push("<td>" + tempProduct.price + "</td>");
      buff.push(
        "<td class='text-center'>" +
          "<img src='/img/pencil.webp' alt='Modificar' width='20' height='20' onclick='modifyProduct(" +
          tempProduct.id +
          ")' style='cursor: pointer; margin-right: 5px;'></img>" +
          "<img src='/img/trash-can.webp' alt='Borrar' width='20' height='20' onclick='deleteProduct(" +
          tempProduct.id +
          ")' style='cursor: pointer; margin-left: 5px;'></img>" +
          "</td>"
      );
    }

    buff.push("</tr>");
  }

  buff.push("</tbody>");
  buff.push("</table>");

  productTable.innerHTML = buff.join("\n");
}

function createNewProduct() {
  verifyAuthUser();
  let id = productList.length;
  id++;
  const code = document.getElementById("productCode");
  const name = document.getElementById("productName");
  const description = document.getElementById("productDescription");
  const price = document.getElementById("productPrice");

  if (!name.value) {
    name.classList.add("is-invalid");
    return;
  } else {
    name.classList.remove("is-invalid");
  }

  if (!code.value) {
    code.classList.add("is-invalid");
    return;
  } else {
    code.classList.remove("is-invalid");
  }

  if (!price.value) {
    price.classList.add("is-invalid");
    return;
  } else {
    price.classList.remove("is-invalid");
  }

  const isCodeTaken = productList.some(
    (product) => product.code === code.value && product.active === true
  );
  if (isCodeTaken) {
    code.classList.add("is-invalid");
    code.value = "";
    alert("Ya existe un producte con ese code");
    return;
  }

  // Crea un nuevo objeto product con los valores obtenidos del HTML
  const newProduct = new Product(
    id,
    name.value,
    code.value,
    description.value,
    parseFloat(price.value)
  );

  productList.push(newProduct);

  code.value = "";
  name.value = "";
  description.value = "";
  price.value = "";
  alert("Producto guardado correctamente!");
  productListUpdate();
  updateProductList();
}

function modifyProduct(id) {
  //modificar interfaz
  if (statusModify === false) {
    toggleButtons();
  }

  verifyAuthUser();

  const tempProduct = getProduct(id);

  const code = document.getElementById("productCode");
  const name = document.getElementById("productName");
  const description = document.getElementById("productDescription");
  const price = document.getElementById("productPrice");

  code.value = tempProduct.code;
  name.value = tempProduct.name;
  description.value = tempProduct.description;
  price.value = tempProduct.price;

  productBeeingModified = id;
}

function modifyProductData() {
  const name = document.getElementById("productName");
  const code = document.getElementById("productCode");
  const description = document.getElementById("productDescription");
  const price = document.getElementById("productPrice");

  const tempProduct = getProduct(productBeeingModified);

  if (!name.value) {
    name.classList.add("is-invalid");
    return;
  } else {
    name.classList.remove("is-invalid");
  }

  if (!code.value) {
    code.classList.add("is-invalid");
    return;
  } else {
    code.classList.remove("is-invalid");
  }

  if (!price.value) {
    price.classList.add("is-invalid");
    return;
  } else {
    price.classList.remove("is-invalid");
  }

  const isCodeTaken = productList.some(
    (product) => product.code === code.value && product.active === true
  );
  if (isCodeTaken && tempProduct.code !== code.value) {
    code.classList.add("is-invalid");
    code.value = "";
    alert("Ya existe un producte con ese code");
    return;
  }

  tempProduct.name = name.value;
  tempProduct.code = code.value;
  tempProduct.description = description.value;
  tempProduct.price = parseFloat(price.value);

  productList[tempProduct.id - 1] = tempProduct;

  alert("Producto modificado correctamente!");
  productListUpdate();
  updateProductList();
  window.location.reload();
}

function cancelModifyProductData() {
  //modificar interfaz
  toggleButtons();

  verifyAuthUser();

  const name = document.getElementById("productName");
  const code = document.getElementById("productCode");
  const description = document.getElementById("productDescription");
  const price = document.getElementById("productPrice");

  name.value = "";
  code.value = "";
  description.value = "";
  price.value = "";
}

function deleteProduct(id) {
  const productIndex = productList.findIndex((product) => product.id === id);
  productList[productIndex].active = false;

  productListUpdate();
  updateProductList();
  window.location.reload();
}

function toggleButtons() {
  const newProductTitle = document.getElementById("newProductDiv");
  const modifyProductTitle = document.getElementById("modifyProductDiv");

  // Cambiar la visibilidad sin verificar existencia
  newProductTitle.hidden = !newProductTitle.hidden;
  modifyProductTitle.hidden = !modifyProductTitle.hidden;

  const newProductButton = document.getElementById("newProductButton");
  const modifyProductButton = document.getElementById("modifyProductButton");
  const cancelModifyProductButton = document.getElementById(
    "cancelModifyProductButton"
  );

  newProductButton.hidden = !newProductButton.hidden;
  modifyProductButton.hidden = !modifyProductButton.hidden;
  cancelModifyProductButton.hidden = !cancelModifyProductButton.hidden;
  statusModify = !statusModify;
}
