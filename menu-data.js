const MENU_STORAGE_KEY = "jetpoa_menu_v1";

const DEFAULT_MENU_ITEMS = [
  { id: "p1", category: "Petiscos", name: "Iscas de Peixe", description: "330g. Deliciosas e fritas ate atingirem a crocancia perfeita, acompanhadas de gomos de limao.", price: 48, em_estoque: true, ativo: true },
  { id: "p2", category: "Petiscos", name: "Bolinho de Peixe", description: "7 unidades.", price: 46, em_estoque: true, ativo: true },
  { id: "p3", category: "Petiscos", name: "Camarao Empanado", description: "250g. Camaroes selecionados, empanados e fritos para preservar suculencia e sabor natural.", price: 76, em_estoque: true, ativo: true },
  { id: "p4", category: "Petiscos", name: "Mini Pastel de Queijo", description: "8 unidades. Massa crocante com queijo derretido e cremoso.", price: 28, em_estoque: true, ativo: true },
  { id: "p5", category: "Petiscos", name: "Mini Pastel de Carne", description: "8 unidades. Carne temperada e suculenta em massa crocante.", price: 28, em_estoque: true, ativo: true },
  { id: "p6", category: "Petiscos", name: "Fritas com Cheddar e Bacon", description: "400g. Batatas crocantes com cheddar derretido e bacon defumado.", price: 30, em_estoque: true, ativo: true },
  { id: "p7", category: "Petiscos", name: "Fritas", description: "400g. Batatas fritas crocantes por fora e macias por dentro.", price: 26, em_estoque: true, ativo: true },
  { id: "p8", category: "Petiscos", name: "Fatia de Pizza | Frango com Catupiry", description: "1 unidade. Massa macia com molho, frango desfiado e catupiry.", price: 24, em_estoque: true, ativo: true },
  { id: "p9", category: "Petiscos", name: "Fatia de Pizza | Calabresa", description: "1 unidade. Massa levemente crocante com mussarela e calabresa defumada.", price: 24, em_estoque: true, ativo: true },
  { id: "p10", category: "Petiscos", name: "Fatia de Pizza | 4 Queijos", description: "1 unidade. Massa fina com cobertura de quatro queijos.", price: 24, em_estoque: true, ativo: true },
  { id: "p11", category: "Pratos", name: "File de Tilapia a Milanesa", description: "File de tilapia a milanesa com arroz, fritas, ovo frito, alface e tomate. Feijao opcional.", price: 59, em_estoque: true, ativo: true },
  { id: "p12", category: "Pratos", name: "File de Frango a Milanesa", description: "Peito de frango a milanesa com arroz, fritas, ovo frito, alface e tomate. Feijao opcional.", price: 49, em_estoque: true, ativo: true },
  { id: "p13", category: "Pratos", name: "File de Frango Grelhado", description: "Peito de frango grelhado com arroz, fritas, ovo frito, alface e tomate. Feijao opcional.", price: 47, em_estoque: true, ativo: true },
  { id: "p14", category: "Pratos", name: "Prato Kids", description: "Mini file de carne ou frango, arroz, batata sorriso e salada. Feijao opcional.", price: 39, em_estoque: true, ativo: true },
  { id: "p15", category: "Sobremesas", name: "Petit Gateau", description: "1 unidade. Bolo quente com recheio de chocolate e sorvete de creme.", price: 24, em_estoque: true, ativo: true },
  { id: "p16", category: "Sobremesas", name: "Pudim de Leite Condensado", description: "Receita exclusiva da casa, cremoso e sem furinhos.", price: 18, em_estoque: true, ativo: true },
  { id: "p17", category: "Sobremesas", name: "Mini Churros", description: "10 unidades. Churros com acucar e canela, acompanha doce de leite.", price: 32, em_estoque: true, ativo: true },
  { id: "p18", category: "Sobremesas", name: "Sorvete com Calda", description: "2 bolas de sorvete com calda de caramelo, chocolate ou morango.", price: 16, em_estoque: true, ativo: true },
  { id: "p19", category: "Bebidas | Nao Alcoolicas", name: "Agua Mineral sem Gas", description: "500ml", price: 6, em_estoque: true, ativo: true },
  { id: "p20", category: "Bebidas | Nao Alcoolicas", name: "Agua Mineral com Gas", description: "500ml", price: 6, em_estoque: true, ativo: true },
  { id: "p21", category: "Bebidas | Nao Alcoolicas", name: "Coca-Cola", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p22", category: "Bebidas | Nao Alcoolicas", name: "Coca-Cola Zero", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p23", category: "Bebidas | Nao Alcoolicas", name: "Guarana Fruki", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p24", category: "Bebidas | Nao Alcoolicas", name: "Guarana Fruki Zero", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p25", category: "Bebidas | Nao Alcoolicas", name: "Fanta Laranja", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p26", category: "Bebidas | Nao Alcoolicas", name: "Fanta Uva", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p27", category: "Bebidas | Nao Alcoolicas", name: "H2O! Limoneto", description: "500ml", price: 12, em_estoque: true, ativo: true },
  { id: "p28", category: "Bebidas | Nao Alcoolicas", name: "H2O! Limao", description: "500ml", price: 10, em_estoque: true, ativo: true },
  { id: "p29", category: "Bebidas | Nao Alcoolicas", name: "Schweppes Citrus", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p30", category: "Bebidas | Nao Alcoolicas", name: "Schweppes Tonica", description: "350ml", price: 8, em_estoque: true, ativo: true },
  { id: "p31", category: "Bebidas | Nao Alcoolicas", name: "Gatorade", description: "500ml", price: 12, em_estoque: true, ativo: true },
  { id: "p32", category: "Bebidas | Nao Alcoolicas", name: "Agua de Coco 1L", description: "1L", price: 39, em_estoque: true, ativo: true },
  { id: "p33", category: "Bebidas | Nao Alcoolicas", name: "Agua de Coco 200ml", description: "200ml", price: 10, em_estoque: true, ativo: true },
  { id: "p34", category: "Bebidas | Nao Alcoolicas", name: "Del Valle Uva", description: "290ml", price: 10, em_estoque: true, ativo: true },
  { id: "p35", category: "Bebidas | Nao Alcoolicas", name: "Del Valle Pessego", description: "290ml", price: 10, em_estoque: true, ativo: true },
  { id: "p36", category: "Bebidas | Nao Alcoolicas", name: "Suco Natural | Laranja", description: "900ml", price: 25, em_estoque: true, ativo: true },
  { id: "p37", category: "Bebidas | Nao Alcoolicas", name: "Suco Natural | Uva", description: "900ml", price: 25, em_estoque: true, ativo: true },
  { id: "p38", category: "Bebidas | Nao Alcoolicas", name: "Red Bull", description: "Escolha entre as opcoes disponiveis.", price: 19, em_estoque: true, ativo: true },
  { id: "p39", category: "Bebidas | Nao Alcoolicas", name: "Soda Italiana | Morango", description: "Morango, agua com gas e xarope Monin de morango.", price: 24, em_estoque: true, ativo: true },
  { id: "p40", category: "Bebidas | Nao Alcoolicas", name: "Soda Italiana | Maca Verde", description: "Maca verde, agua com gas e xarope Monin de maca verde.", price: 24, em_estoque: true, ativo: true }
];

function getMenuItems() {
  const raw = localStorage.getItem(MENU_STORAGE_KEY);
  if (!raw) return DEFAULT_MENU_ITEMS;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_MENU_ITEMS;
    return parsed;
  } catch (_) {
    return DEFAULT_MENU_ITEMS;
  }
}

function saveMenuItems(items) {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
}

function resetMenuItems() {
  localStorage.removeItem(MENU_STORAGE_KEY);
}
