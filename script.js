const categoryNav = document.getElementById("category-nav");
const menuContent = document.getElementById("menu-content");

let publicItems = [];
let categories = [];
let activeCategory = "";

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

    menuContent.appendChild(card);
  });
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
