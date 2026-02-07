const loginView = document.getElementById("login-view");
const adminView = document.getElementById("admin-view");
const loginForm = document.getElementById("login-form");
const tbody = document.getElementById("products-tbody");
const productForm = document.getElementById("product-form");
const formTitle = document.getElementById("form-title");
const cancelEditBtn = document.getElementById("cancel-edit");
const logoutBtn = document.getElementById("logout");

const client = getSupabaseClient();

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function toggleViews(isLoggedIn) {
  loginView.classList.toggle("hidden", isLoggedIn);
  adminView.classList.toggle("hidden", !isLoggedIn);
}

function getFormData() {
  return {
    id: document.getElementById("product-id").value || undefined,
    category: document.getElementById("category").value.trim(),
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: Number(document.getElementById("price").value),
    ordem: Number(document.getElementById("ordem").value),
    em_estoque: document.getElementById("em-estoque").checked,
    ativo: document.getElementById("ativo").checked
  };
}

function resetForm() {
  productForm.reset();
  document.getElementById("product-id").value = "";
  document.getElementById("ordem").value = 0;
  document.getElementById("em-estoque").checked = true;
  document.getElementById("ativo").checked = true;
  formTitle.textContent = "Novo produto";
}

function editProduct(item) {
  document.getElementById("product-id").value = item.id;
  document.getElementById("category").value = item.category;
  document.getElementById("name").value = item.name;
  document.getElementById("description").value = item.description || "";
  document.getElementById("price").value = item.price;
  document.getElementById("ordem").value = item.ordem || 0;
  document.getElementById("em-estoque").checked = !!item.em_estoque;
  document.getElementById("ativo").checked = !!item.ativo;
  formTitle.textContent = "Editar produto";
}

async function fetchProducts() {
  const { data, error } = await client
    .from("products")
    .select("id, category, name, description, price, ativo, em_estoque, ordem")
    .order("category", { ascending: true })
    .order("ordem", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    alert(`Erro ao carregar produtos: ${error.message}`);
    return [];
  }

  return data || [];
}

async function renderTable() {
  const items = await fetchProducts();
  tbody.innerHTML = "";

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.category}</td>
      <td>${item.name}</td>
      <td>${formatPrice(item.price)}</td>
      <td><button type="button" data-action="toggle-stock" data-id="${item.id}">${item.em_estoque ? "Sim" : "Nao"}</button></td>
      <td><button type="button" data-action="toggle-active" data-id="${item.id}">${item.ativo ? "Sim" : "Nao"}</button></td>
      <td>
        <button type="button" data-action="edit" data-json='${JSON.stringify(item).replace(/'/g, "&#39;")}'>Editar</button>
        <button type="button" class="danger" data-action="delete" data-id="${item.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) {
    alert("Supabase nao configurado.");
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;

  const { error } = await client.auth.signInWithPassword({ email, password: pass });
  if (error) {
    alert(`Login invalido: ${error.message}`);
    return;
  }

  toggleViews(true);
  renderTable();
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = getFormData();
  const isEdit = !!payload.id;

  if (isEdit) {
    const { id, ...rest } = payload;
    const { error } = await client.from("products").update(rest).eq("id", id);
    if (error) {
      alert(`Erro ao atualizar: ${error.message}`);
      return;
    }
  } else {
    delete payload.id;
    const { error } = await client.from("products").insert(payload);
    if (error) {
      alert(`Erro ao inserir: ${error.message}`);
      return;
    }
  }

  await renderTable();
  resetForm();
});

tbody.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;

  if (action === "edit") {
    const data = JSON.parse(button.dataset.json.replace(/&#39;/g, "'"));
    editProduct(data);
    return;
  }

  if (action === "delete") {
    const { error } = await client.from("products").delete().eq("id", button.dataset.id);
    if (error) {
      alert(`Erro ao excluir: ${error.message}`);
      return;
    }
    await renderTable();
    return;
  }

  if (action === "toggle-stock" || action === "toggle-active") {
    const { data, error } = await client
      .from("products")
      .select("id, em_estoque, ativo")
      .eq("id", button.dataset.id)
      .single();

    if (error || !data) {
      alert(`Erro ao carregar item: ${error?.message || "desconhecido"}`);
      return;
    }

    const patch = action === "toggle-stock"
      ? { em_estoque: !data.em_estoque }
      : { ativo: !data.ativo };

    const { error: updateError } = await client.from("products").update(patch).eq("id", button.dataset.id);
    if (updateError) {
      alert(`Erro ao atualizar status: ${updateError.message}`);
      return;
    }

    await renderTable();
  }
});

cancelEditBtn.addEventListener("click", resetForm);

logoutBtn.addEventListener("click", async () => {
  await client.auth.signOut();
  toggleViews(false);
});

async function init() {
  if (!client) {
    alert("Supabase nao configurado. Verifique supabase-config.js");
    return;
  }

  const { data } = await client.auth.getSession();
  const isLoggedIn = !!data?.session;
  toggleViews(isLoggedIn);

  if (isLoggedIn) {
    renderTable();
  }
}

init();
