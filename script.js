const categoryNav = document.getElementById("category-nav");
const menuContent = document.getElementById("menu-content");
const DEFAULT_PRODUCT_IMAGE = "default-product.svg";

let publicItems = [];
let categories = [];
let activeCategory = "";
let modalElements = null;
let modalCloseCooldownUntil = 0;

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

async function loadPublicItems() {
  const client = getSupabaseClient();
  if (!client) {
    return DEFAULT_MENU_ITEMS
      .filter((item) => item.ativo && item.em_estoque)
      .map((item) => ({ ...item, image_url: item.image_url || DEFAULT_PRODUCT_IMAGE }));
  }

  const { data, error } = await client
    .from("products")
    .select("id, category, name, description, price, image_url, ativo, em_estoque, ordem")
    .eq("ativo", true)
    .eq("em_estoque", true)
    .order("category", { ascending: true })
    .order("ordem", { ascending: true })
    .order("name", { ascending: true });

  if (error || !Array.isArray(data)) {
    return DEFAULT_MENU_ITEMS
      .filter((item) => item.ativo && item.em_estoque)
      .map((item) => ({ ...item, image_url: item.image_url || DEFAULT_PRODUCT_IMAGE }));
  }

  return data.map((item) => ({
    ...item,
    image_url: item.image_url || DEFAULT_PRODUCT_IMAGE
  }));
}

function renderCategoryButtons() {
  categoryNav.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "category-btn";
    button.type = "button";
    button.textContent = category;

    if (category === activeCategory) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeCategory = category;
      renderCategoryButtons();
      renderItems();
    });

    categoryNav.appendChild(button);
  });
}

function renderItems() {
  menuContent.innerHTML = "";
  const selectedItems = publicItems.filter((item) => item.category === activeCategory);

  selectedItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";

    card.innerHTML = `
      <img class="menu-thumb" src="${item.image_url}" alt="Foto de ${item.name}" loading="lazy">
      <header class="menu-header">
        <h2 class="menu-title">${item.name}</h2>
        <p class="menu-price">${formatPrice(item.price)}</p>
      </header>
      <p class="menu-description">${item.description || ""}</p>
    `;

    const thumb = card.querySelector(".menu-thumb");
    thumb.addEventListener("error", () => {
      thumb.setAttribute("src", DEFAULT_PRODUCT_IMAGE);
    }, { once: true });

    card.addEventListener("click", () => openItemModal(item));

    menuContent.appendChild(card);
  });
}

function ensureModal() {
  if (modalElements) return modalElements;

  const overlay = document.createElement("div");
  overlay.className = "item-modal-overlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <section class="item-modal" role="dialog" aria-modal="true" aria-labelledby="item-modal-title">
      <button class="item-modal-close" type="button" aria-label="Fechar modal">&times;</button>
      <img class="item-modal-image" alt="">
      <h3 id="item-modal-title" class="item-modal-title"></h3>
      <p class="item-modal-price"></p>
      <p class="item-modal-description"></p>
    </section>
  `;

  document.body.appendChild(overlay);

  const closeButton = overlay.querySelector(".item-modal-close");
  const modalPanel = overlay.querySelector(".item-modal");
  const modalImage = overlay.querySelector(".item-modal-image");
  const title = overlay.querySelector(".item-modal-title");
  const price = overlay.querySelector(".item-modal-price");
  const description = overlay.querySelector(".item-modal-description");

  function closeModal() {
    if (overlay.hidden) return;
    modalCloseCooldownUntil = Date.now() + 900;
    overlay.hidden = true;
    document.body.classList.remove("modal-open");
  }

  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    closeModal();
  });

  modalPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeModal();
  });

  modalElements = { overlay, modalImage, title, price, description, closeModal };
  return modalElements;
}

function openItemModal(item) {
  if (Date.now() < modalCloseCooldownUntil) return;

  const modal = ensureModal();
  modal.modalImage.src = item.image_url || DEFAULT_PRODUCT_IMAGE;
  modal.modalImage.alt = `Foto de ${item.name}`;
  modal.modalImage.onerror = () => {
    modal.modalImage.onerror = null;
    modal.modalImage.src = DEFAULT_PRODUCT_IMAGE;
  };
  modal.title.textContent = item.name;
  modal.price.textContent = formatPrice(item.price);
  modal.description.textContent = item.description || "Sem descricao.";
  modal.overlay.hidden = false;
  document.body.classList.add("modal-open");
}

function renderEmptyState() {
  categoryNav.innerHTML = "";
  menuContent.innerHTML = '<article class="menu-card"><p class="menu-description">Sem itens disponiveis no momento.</p></article>';
}

async function initMenu() {
  publicItems = await loadPublicItems();
  categories = [...new Set(publicItems.map((item) => item.category))];
  activeCategory = categories[0] || "";

  if (!publicItems.length) {
    renderEmptyState();
    return;
  }

  renderCategoryButtons();
  renderItems();
}

initMenu();
