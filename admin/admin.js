const loginView = document.getElementById("login-view");
const adminView = document.getElementById("admin-view");
const loginForm = document.getElementById("login-form");
const tbody = document.getElementById("products-tbody");
const productForm = document.getElementById("product-form");
const formTitle = document.getElementById("form-title");
const cancelEditBtn = document.getElementById("cancel-edit");
const logoutBtn = document.getElementById("logout");
const refreshBtn = document.getElementById("refresh-table");

const feedbackEl = document.getElementById("feedback");
const tableEmptyEl = document.getElementById("table-empty");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const clearFiltersBtn = document.getElementById("clear-filters");
const categorySelect = document.getElementById("category");
const newCategoryInput = document.getElementById("new-category-input");
const addCategoryBtn = document.getElementById("add-category-btn");
const imageFileInput = document.getElementById("image-file");
const imageUrlInput = document.getElementById("image-url");
const imagePreviewWrap = document.getElementById("image-preview-wrap");
const imagePreview = document.getElementById("image-preview");
const removeImageBtn = document.getElementById("remove-image-btn");

const statTotal = document.getElementById("stat-total");
const statActive = document.getElementById("stat-active");
const statStock = document.getElementById("stat-stock");
const statNoStock = document.getElementById("stat-no-stock");

const client = getSupabaseClient();

let allItems = [];
let itemById = new Map();
let draggingRow = null;
let imageMarkedForRemoval = false;
let currentPreviewObjectUrl = "";
let activeDragHandle = false;

const IMAGE_BUCKET = "product-images";
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function escapeHtml(value) {
  const str = String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toggleViews(isLoggedIn) {
  loginView.classList.toggle("hidden", isLoggedIn);
  adminView.classList.toggle("hidden", !isLoggedIn);
}

function setFeedback(message, type = "success") {
  if (!message) {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback hidden";
    return;
  }

  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
}

function updateStats(items) {
  const total = items.length;
  const active = items.filter((item) => item.ativo).length;
  const stock = items.filter((item) => item.em_estoque).length;

  statTotal.textContent = String(total);
  statActive.textContent = String(active);
  statStock.textContent = String(stock);
  statNoStock.textContent = String(total - stock);
}

function normalizeCategory(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function ensureCategoryOption(category) {
  const normalized = normalizeCategory(category);
  if (!normalized) return false;

  const hasSelectOption = [...categorySelect.options].some(
    (option) => option.value.toLowerCase() === normalized.toLowerCase()
  );
  if (!hasSelectOption) {
    const option = document.createElement("option");
    option.value = normalized;
    option.textContent = normalized;
    categorySelect.appendChild(option);
  }

  const hasFilterOption = [...categoryFilter.options].some(
    (option) => option.value.toLowerCase() === normalized.toLowerCase()
  );
  if (!hasFilterOption) {
    const option = document.createElement("option");
    option.value = normalized;
    option.textContent = normalized;
    categoryFilter.appendChild(option);
  }

  return true;
}

function syncCategoryOptions(items) {
  const previousFilter = categoryFilter.value;
  const previousForm = categorySelect.value;
  const categories = [...new Set(items.map((item) => normalizeCategory(item.category)).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  categoryFilter.innerHTML = '<option value="">Todas</option>';
  categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';

  categories.forEach((category) => {
    ensureCategoryOption(category);
  });

  categoryFilter.value = categories.includes(previousFilter) ? previousFilter : "";
  categorySelect.value = categories.includes(previousForm) ? previousForm : "";
}

function getFormData() {
  return {
    id: document.getElementById("product-id").value || undefined,
    category: normalizeCategory(categorySelect.value),
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: Number(document.getElementById("price").value),
    ordem: Number(document.getElementById("ordem").value),
    image_url: imageUrlInput.value.trim() || null,
    em_estoque: document.getElementById("em-estoque").checked,
    ativo: document.getElementById("ativo").checked
  };
}

function setImagePreview(url) {
  if (currentPreviewObjectUrl) {
    URL.revokeObjectURL(currentPreviewObjectUrl);
    currentPreviewObjectUrl = "";
  }

  if (!url) {
    imagePreviewWrap.classList.add("hidden");
    imagePreview.removeAttribute("src");
    return;
  }

  if (url.startsWith("blob:")) {
    currentPreviewObjectUrl = url;
  }

  imagePreview.src = url;
  imagePreviewWrap.classList.remove("hidden");
}

function clearImageState() {
  imageFileInput.value = "";
  imageUrlInput.value = "";
  imageMarkedForRemoval = false;
  setImagePreview("");
}

function getFileExtension(file) {
  const parts = String(file.name || "").split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
}

function isAllowedImage(file) {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

async function uploadImageFile(file) {
  const extension = getFileExtension(file);
  const safeName = String(file.name || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .toLowerCase();
  const filePath = `products/${Date.now()}-${safeName}.${extension}`;

  const { error: uploadError } = await client
    .storage
    .from(IMAGE_BUCKET)
    .upload(filePath, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type || undefined
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = client.storage.from(IMAGE_BUCKET).getPublicUrl(filePath);
  return data?.publicUrl || null;
}

function resetForm() {
  productForm.reset();
  document.getElementById("product-id").value = "";
  document.getElementById("ordem").value = 0;
  document.getElementById("em-estoque").checked = true;
  document.getElementById("ativo").checked = true;
  categorySelect.value = "";
  newCategoryInput.value = "";
  clearImageState();
  formTitle.textContent = "Novo produto";
}

function editProduct(item) {
  document.getElementById("product-id").value = item.id;
  ensureCategoryOption(item.category);
  categorySelect.value = normalizeCategory(item.category);
  document.getElementById("name").value = item.name;
  document.getElementById("description").value = item.description || "";
  document.getElementById("price").value = item.price;
  document.getElementById("ordem").value = item.ordem || 0;
  imageUrlInput.value = item.image_url || "";
  imageFileInput.value = "";
  imageMarkedForRemoval = false;
  setImagePreview(item.image_url || "");
  document.getElementById("em-estoque").checked = !!item.em_estoque;
  document.getElementById("ativo").checked = !!item.ativo;
  formTitle.textContent = "Editar produto";
}

async function fetchProducts() {
  const { data, error } = await client
    .from("products")
    .select("id, category, name, description, price, image_url, ativo, em_estoque, ordem")
    .order("category", { ascending: true })
    .order("ordem", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

function renderTable(items) {
  tbody.innerHTML = "";
  tableEmptyEl.classList.toggle("hidden", items.length > 0);
  const canDrag = searchInput.value.trim() === "";

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.dataset.id = item.id;
    tr.dataset.category = item.category;
    tr.draggable = canDrag;
    tr.classList.toggle("is-draggable", canDrag);
    tr.title = canDrag ? "Arraste para reordenar na categoria." : "Limpe a busca para reorganizar.";

    tr.innerHTML = `
      <td class="drag-cell"><span class="drag-handle" aria-hidden="true">⋮⋮</span></td>
      <td>${escapeHtml(item.category)}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${formatPrice(item.price)}</td>
      <td>${item.ordem ?? 0}</td>
      <td><button type="button" data-action="toggle-stock" data-id="${item.id}">${item.em_estoque ? "Sim" : "Nao"}</button></td>
      <td><button type="button" data-action="toggle-active" data-id="${item.id}">${item.ativo ? "Sim" : "Nao"}</button></td>
      <td>
        <button type="button" data-action="edit" data-id="${item.id}">Editar</button>
        <button type="button" class="danger" data-action="delete" data-id="${item.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = allItems.filter((item) => {
    const matchesCategory = category ? item.category === category : true;
    const matchesTerm = term
      ? item.name.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
      : true;
    return matchesCategory && matchesTerm;
  });

  renderTable(filtered);
}

function clearDropIndicators() {
  tbody.querySelectorAll("tr.drop-before, tr.drop-after").forEach((row) => {
    row.classList.remove("drop-before", "drop-after");
  });
}

function getCategoryRowsFromTable(category) {
  return [...tbody.querySelectorAll("tr[data-id]")]
    .filter((row) => row.dataset.category === category);
}

async function persistCategoryOrder(category) {
  const visibleCategoryRows = getCategoryRowsFromTable(category);
  const totalCategoryItems = allItems.filter((item) => item.category === category).length;

  if (visibleCategoryRows.length !== totalCategoryItems) {
    setFeedback("Para reorganizar, exiba todos os itens da categoria.", "error");
    await refreshData();
    return;
  }

  const updates = visibleCategoryRows
    .map((row, index) => {
      const id = row.dataset.id;
      const current = itemById.get(id);
      if (!current) return null;
      const nextOrder = index + 1;
      if ((current.ordem ?? 0) === nextOrder) return null;
      return { id, ordem: nextOrder };
    })
    .filter(Boolean);

  if (!updates.length) return;

  const results = await Promise.all(
    updates.map((update) =>
      client.from("products").update({ ordem: update.ordem }).eq("id", update.id)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed) {
    setFeedback(`Erro ao salvar ordem: ${failed.error.message}`, "error");
    await refreshData();
    return;
  }

  setFeedback("Ordem atualizada com sucesso.", "success");
  await refreshData();
}

async function refreshData(options = {}) {
  const { showFeedback = false } = options;

  try {
    allItems = await fetchProducts();
    itemById = new Map(allItems.map((item) => [item.id, item]));
    updateStats(allItems);
    syncCategoryOptions(allItems);
    applyFilters();

    if (showFeedback) {
      setFeedback("Tabela atualizada com sucesso.", "success");
    }
  } catch (error) {
    setFeedback(`Erro ao carregar produtos: ${error.message}`, "error");
  }
}

function addCategoryFromInput() {
  const newCategory = normalizeCategory(newCategoryInput.value);
  if (!newCategory) {
    setFeedback("Digite um nome de categoria para adicionar.", "error");
    return;
  }

  const inserted = ensureCategoryOption(newCategory);
  if (!inserted) {
    setFeedback("Nao foi possivel adicionar a categoria.", "error");
    return;
  }

  categorySelect.value = newCategory;
  newCategoryInput.value = "";
  setFeedback("Categoria adicionada ao formulario.", "success");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) {
    setFeedback("Supabase nao configurado.", "error");
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;

  const { error } = await client.auth.signInWithPassword({ email, password: pass });
  if (error) {
    setFeedback(`Login invalido: ${error.message}`, "error");
    return;
  }

  setFeedback("");
  toggleViews(true);
  await refreshData();
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!client) {
    setFeedback("Supabase nao configurado.", "error");
    return;
  }

  const payload = getFormData();
  if (!payload.category || !payload.name || payload.price <= 0) {
    setFeedback("Preencha categoria, nome e preco valido.", "error");
    return;
  }

  const selectedImageFile = imageFileInput.files?.[0] || null;
  if (selectedImageFile) {
    if (!isAllowedImage(selectedImageFile)) {
      setFeedback("Formato de imagem invalido. Use JPG, PNG, WebP ou AVIF.", "error");
      return;
    }

    if (selectedImageFile.size > MAX_IMAGE_SIZE_BYTES) {
      setFeedback("Imagem muito grande. Limite de 2MB.", "error");
      return;
    }
  }

  if (imageMarkedForRemoval) {
    payload.image_url = null;
  }

  if (selectedImageFile) {
    try {
      const uploadedUrl = await uploadImageFile(selectedImageFile);
      if (!uploadedUrl) {
        setFeedback("Nao foi possivel gerar URL publica da imagem.", "error");
        return;
      }
      payload.image_url = uploadedUrl;
      imageUrlInput.value = uploadedUrl;
    } catch (error) {
      setFeedback(`Erro no upload da imagem: ${error.message}`, "error");
      return;
    }
  }

  const isEdit = !!payload.id;

  if (isEdit) {
    const { id, ...rest } = payload;
    const { error } = await client.from("products").update(rest).eq("id", id);
    if (error) {
      setFeedback(`Erro ao atualizar: ${error.message}`, "error");
      return;
    }
    setFeedback("Produto atualizado com sucesso.", "success");
  } else {
    delete payload.id;
    const { error } = await client.from("products").insert(payload);
    if (error) {
      setFeedback(`Erro ao inserir: ${error.message}`, "error");
      return;
    }
    setFeedback("Produto criado com sucesso.", "success");
  }

  await refreshData();
  resetForm();
});

tbody.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    const item = itemById.get(id);
    if (!item) return;
    editProduct(item);
    return;
  }

  if (!client) {
    setFeedback("Supabase nao configurado.", "error");
    return;
  }

  if (action === "delete") {
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) {
      setFeedback(`Erro ao excluir: ${error.message}`, "error");
      return;
    }
    setFeedback("Produto excluido.", "success");
    await refreshData();
    return;
  }

  if (action === "toggle-stock" || action === "toggle-active") {
    const current = itemById.get(id);
    if (!current) {
      setFeedback("Produto nao encontrado.", "error");
      return;
    }

    const patch = action === "toggle-stock"
      ? { em_estoque: !current.em_estoque }
      : { ativo: !current.ativo };

    const { error } = await client.from("products").update(patch).eq("id", id);
    if (error) {
      setFeedback(`Erro ao atualizar status: ${error.message}`, "error");
      return;
    }

    setFeedback("Status atualizado.", "success");
    await refreshData();
  }
});

tbody.addEventListener("dragstart", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const row = target.closest("tr[data-id]");
  if (!row) return;

  if (!activeDragHandle) {
    event.preventDefault();
    return;
  }

  draggingRow = row;
  row.classList.add("dragging");
  clearDropIndicators();

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", row.dataset.id);
  }
});

tbody.addEventListener("dragover", (event) => {
  if (!draggingRow) return;

  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const targetRow = target.closest("tr[data-id]");
  if (!targetRow || targetRow === draggingRow) return;
  if (targetRow.dataset.category !== draggingRow.dataset.category) return;

  event.preventDefault();
  const rect = targetRow.getBoundingClientRect();
  const placeAfter = event.clientY > rect.top + rect.height / 2;
  clearDropIndicators();
  targetRow.classList.add(placeAfter ? "drop-after" : "drop-before");
  tbody.insertBefore(draggingRow, placeAfter ? targetRow.nextSibling : targetRow);
});

tbody.addEventListener("drop", async (event) => {
  if (!draggingRow) return;
  event.preventDefault();

  const target = event.target instanceof Element ? event.target : null;
  const targetRow = target ? target.closest("tr[data-id]") : null;
  const sourceCategory = draggingRow.dataset.category;
  const targetCategory = targetRow?.dataset.category;
  clearDropIndicators();

  if (targetRow && sourceCategory !== targetCategory) {
    setFeedback("So e possivel reordenar dentro da mesma categoria.", "error");
    draggingRow.classList.remove("dragging");
    draggingRow = null;
    activeDragHandle = false;
    await refreshData();
    return;
  }

  draggingRow.classList.remove("dragging");
  draggingRow = null;
  activeDragHandle = false;

  if (!sourceCategory) return;
  await persistCategoryOrder(sourceCategory);
});

tbody.addEventListener("dragend", () => {
  clearDropIndicators();
  if (!draggingRow) return;
  draggingRow.classList.remove("dragging");
  draggingRow = null;
  activeDragHandle = false;
});

tbody.addEventListener("pointerdown", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    activeDragHandle = false;
    return;
  }

  activeDragHandle = !!target.closest(".drag-handle");
});

cancelEditBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
addCategoryBtn.addEventListener("click", addCategoryFromInput);

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files?.[0] || null;
  if (!file) {
    if (!imageUrlInput.value) setImagePreview("");
    return;
  }

  if (!isAllowedImage(file)) {
    imageFileInput.value = "";
    setFeedback("Formato de imagem invalido. Use JPG, PNG, WebP ou AVIF.", "error");
    return;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    imageFileInput.value = "";
    setFeedback("Imagem muito grande. Limite de 2MB.", "error");
    return;
  }

  imageMarkedForRemoval = false;
  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);
});

removeImageBtn.addEventListener("click", () => {
  imageMarkedForRemoval = true;
  imageFileInput.value = "";
  imageUrlInput.value = "";
  setImagePreview("");
  setFeedback("Imagem removida do produto atual.", "success");
});

newCategoryInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addCategoryFromInput();
});

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";
  applyFilters();
});

refreshBtn.addEventListener("click", async () => {
  await refreshData({ showFeedback: true });
});

logoutBtn.addEventListener("click", async () => {
  await client.auth.signOut();
  setFeedback("");
  toggleViews(false);
});

async function init() {
  if (!client) {
    setFeedback("Supabase nao configurado. Verifique supabase-config.js", "error");
    return;
  }

  const { data } = await client.auth.getSession();
  const isLoggedIn = !!data?.session;
  toggleViews(isLoggedIn);

  if (isLoggedIn) {
    await refreshData();
  }
}

init();
