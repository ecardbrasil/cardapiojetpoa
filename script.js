const categoryNav = document.getElementById("category-nav");
const menuContent = document.getElementById("menu-content");

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
  if (!client) return DEFAULT_MENU_ITEMS.filter((item) => item.ativo && item.em_estoque);

  const { data, error } = await client
    .from("products")
    .select("id, category, name, description, price, ativo, em_estoque, ordem")
    .eq("ativo", true)
    .eq("em_estoque", true)
    .order("category", { ascending: true })
    .order("ordem", { ascending: true })
    .order("name", { ascending: true });

  if (error || !Array.isArray(data)) {
    return DEFAULT_MENU_ITEMS.filter((item) => item.ativo && item.em_estoque);
  }

  return data;
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
      <header class="menu-header">
        <h2 class="menu-title">${item.name}</h2>
        <p class="menu-price">${formatPrice(item.price)}</p>
      </header>
      <p class="menu-description">${item.description || ""}</p>
    `;

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
      <h3 id="item-modal-title" class="item-modal-title"></h3>
      <p class="item-modal-price"></p>
      <p class="item-modal-description"></p>
    </section>
  `;

  document.body.appendChild(overlay);

  const closeButton = overlay.querySelector(".item-modal-close");
  const modalPanel = overlay.querySelector(".item-modal");
  const title = overlay.querySelector(".item-modal-title");
  const price = overlay.querySelector(".item-modal-price");
  const description = overlay.querySelector(".item-modal-description");

  function closeModal() {
    modalCloseCooldownUntil = Date.now() + 250;
    overlay.hidden = true;
    document.body.classList.remove("modal-open");
  }

  closeButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeModal();
  });

  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeModal();
  });

  modalPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  overlay.addEventListener("click", (event) => {
    const target = event.target;
    const closeTrigger = target instanceof Element ? target.closest(".item-modal-close") : null;
    if (closeTrigger) {
      closeModal();
      return;
    }

    if (event.target === overlay) closeModal();
  });

  overlay.addEventListener("touchend", (event) => {
    const target = event.target;
    const closeTrigger = target instanceof Element ? target.closest(".item-modal-close") : null;
    if (closeTrigger) {
      event.preventDefault();
      closeModal();
    }
  }, { passive: false });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeModal();
  });

  modalElements = { overlay, title, price, description };
  return modalElements;
}

function openItemModal(item) {
  if (Date.now() < modalCloseCooldownUntil) return;

  const modal = ensureModal();
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
