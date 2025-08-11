const products = JSON.parse(localStorage.getItem("products") || "[]");

const form = document.querySelector("#product-form");
form.addEventListener("submit", handleFormSubmit);
renderProducts();

const stockStatus = document.querySelector("#stock-status");
stockStatus.addEventListener("change", (event) => {
  const status = event.target.value;
  if (status === "Out of Stock") {
    document.querySelector("#product-stock").disabled = true;
    document.querySelector("#product-stock").value = 0;
  } else {
    document.querySelector("#product-stock").disabled = false;
  }
});

async function handleFormSubmit(event) {
  event.preventDefault();

  // Ambil data dari form
  const productName = event.target[0].value;
  const productStatus = event.target[1].value;
  const productPrice = event.target[2].valueAsNumber;
  const productDescription = event.target[3].value;
  const productQuantity = event.target[4].valueAsNumber;
  const productColor = event.target[5].value;
  const productMaterial = event.target[6].value;
  const productBrand = event.target[7].value;

  try {
    // Fetch data tambahan dari API
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const json = await response.json();

    // Gabungkan data form dan data API
    const product = {
      id: Date.now(),
      name: productName,
      status: productStatus,
      price: productPrice,
      description: productDescription,
      quantity: productQuantity,
      color: productColor,
      material: productMaterial,
      brand: productBrand,
      title: json.title,
      body: json.body, // tambahkan baris ini!
    };

    products.push(product);
    saveProducts();
    event.target.reset();
    renderProducts();

    // Tampilkan detail produk yang baru ditambahkan
    displayProductDetails(product);
  } catch (error) {
    console.log("Error fetching data from API:", error);
  }
}

// Fungsi untuk menampilkan detail produk di sebelah kanan
function displayProductDetails(product) {
  document.getElementById("display-product-name").innerText = product.name;
  document.getElementById("display-stock-status").innerText = product.status;
  document.getElementById("display-stock-status").className = product.status == "In Stock" ? "text-success" : "text-danger";
  document.getElementById("display-product-price").innerText = product.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  document.getElementById("display-description").innerText = product.description;
  document.getElementById("display-quantity").innerText = product.quantity;
  document.getElementById("display-color").innerText = product.color;
  document.getElementById("display-material").innerText = product.material;
  document.getElementById("display-brand").innerText = product.brand;
}

function renderProducts() {
  const productList = document.getElementById("product-list");
  if (products.length === 0) {
    productList.innerHTML = ""; // Tidak menampilkan judul jika kosong
    return;
  }

  productList.innerHTML = `<h4 class="mb-3"><b>Product List</b></h4>`;

  products.forEach((product) => {
    productList.innerHTML += `
      <div class="border rounded shadow-sm p-3 mb-4 bg-white">
      <div class="mb-2">
        <b>${product.name}</b>
      </div>
      <div class="${product.status === "In Stock" ? "text-success" : "text-danger"} mb-2" style="font-weight:bold;">
        ${product.status}
      </div>
      <div class="mb-2">Rp. ${Number(product.price).toLocaleString("id-ID")}</div>
      <div class="mb-2">${product.description}</div>
      <div class="mb-1"><b>Quantity:</b> ${product.quantity}</div>
      <div class="mb-1"><b>Color:</b> ${product.color}</div>
      <div class="mb-1"><b>Material:</b> ${product.material}</div>
      <div class="mb-1"><b>Brand:</b> ${product.brand}</div>
      <hr>
      <div class="mb-1"><b>Additional Info from API:</b></div>
      <div class="mb-1"><b>Title:</b> ${product.title || "-"}</div>
      <div class="mb-3 text-justify"><b>Description:</b> ${product.body || "-"}</div>
      <button type="button" class="btn btn-danger w-100 mb-2" onclick="deleteProduct(${product.id}); window.scrollTo({top: 0, behavior: 'smooth'});">Delete</button>
      <button type="button" class="btn btn-warning w-100" onclick="editProduct(${product.id}); window.scrollTo({top: 0, behavior: 'smooth'});">Edit</button>
      </div>
    `;
  });
}

function deleteProduct(id) {
  const indexProduct = products.findIndex((p) => p.id === id);
  if (indexProduct === -1) {
    console.log("Product not found");
    return;
  }

  products.splice(indexProduct, 1);
  saveProducts();
  renderProducts();
}

function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    console.log("Product not found");
    return;
  }

  document.querySelector("#product-name").value = product.name;
  document.querySelector("#stock-status").value = product.status;
  document.querySelector("#product-price").value = product.price;
  document.querySelector("#product-stock").value = product.description; // Description
  document.querySelector("#product-quantity").value = product.quantity; // Quantity
  document.querySelector("#product-color").value = product.color;       // Color
  document.querySelector("#product-material").value = product.material; // Material
  document.querySelector("#product-brand").value = product.brand;       // Brand

  document.querySelector("#update-button").classList.remove("d-none");
  document.querySelector("#submit-button").classList.add("d-none");

  const updateBtn = document.querySelector("#update-button");
  updateBtn.onclick = null;
  updateBtn.onclick = function () {
    updateProduct(id);
  };
}

function updateProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    console.log("Product not found");
    return;
  }

  product.name = document.querySelector("#product-name").value;
  product.status = document.querySelector("#stock-status").value;
  product.price = document.querySelector("#product-price").valueAsNumber;

  renderProducts();
  saveProducts();

  document.querySelector("#product-form").reset();
  document.querySelector("#update-button").classList.add("d-none");
  document.querySelector("#submit-button").classList.remove("d-none");
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

document.querySelector("#product-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Ambil data dari form
  const name = document.querySelector("#product-name").value;
  const status = document.querySelector("#stock-status").value;
  const price = document.querySelector("#product-price").value;
  const description = document.querySelector("#product-stock").value;
  const quantity = document.querySelector("#product-quantity").value;
  const color = document.querySelector("#product-color").value;
  const material = document.querySelector("#product-material").value;
  const brand = document.querySelector("#product-brand").value;

  // Update detail produk di kanan
  document.querySelector("#display-product-name").textContent = name;
  document.querySelector("#display-stock-status").textContent = status;
  document.querySelector("#display-stock-status").className = status === "In Stock" ? "text-success" : "text-danger";
  document.querySelector("#display-product-price").textContent = "Rp. " + Number(price).toLocaleString("id-ID");
  document.querySelector("#display-description").textContent = description;
  document.querySelector("#display-quantity").textContent = quantity;
  document.querySelector("#display-color").textContent = color;
  document.querySelector("#display-material").textContent = material;
  document.querySelector("#display-brand").textContent = brand;
});