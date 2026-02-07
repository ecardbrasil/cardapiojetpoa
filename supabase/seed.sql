insert into public.products (category, name, description, price, ativo, em_estoque, ordem)
values
  ('Petiscos', 'Iscas de Peixe', '330g. Deliciosas e fritas ate atingirem a crocancia perfeita, acompanhadas de gomos de limao.', 48, true, true, 1),
  ('Petiscos', 'Bolinho de Peixe', '7 unidades.', 46, true, true, 2),
  ('Petiscos', 'Camarao Empanado', '250g. Camaroes selecionados, empanados e fritos para preservar suculencia e sabor natural.', 76, true, true, 3),
  ('Pratos', 'File de Tilapia a Milanesa', 'File de tilapia a milanesa com arroz, fritas, ovo frito, alface e tomate. Feijao opcional.', 59, true, true, 1),
  ('Pratos', 'File de Frango a Milanesa', 'Peito de frango a milanesa com arroz, fritas, ovo frito, alface e tomate. Feijao opcional.', 49, true, true, 2),
  ('Pratos', 'Prato Kids', 'Mini file de carne ou frango, arroz, batata sorriso e salada. Feijao opcional.', 39, true, true, 3),
  ('Sobremesas', 'Petit Gateau', '1 unidade. Bolo quente com recheio de chocolate e sorvete de creme.', 24, true, true, 1),
  ('Sobremesas', 'Pudim de Leite Condensado', 'Receita exclusiva da casa, cremoso e sem furinhos.', 18, true, true, 2),
  ('Bebidas | Nao Alcoolicas', 'Agua Mineral sem Gas', '500ml', 6, true, true, 1),
  ('Bebidas | Nao Alcoolicas', 'Coca-Cola', '350ml', 8, true, true, 2),
  ('Bebidas | Nao Alcoolicas', 'Guarana Fruki', '350ml', 8, true, true, 3),
  ('Bebidas | Nao Alcoolicas', 'Suco Natural | Laranja', '900ml', 25, true, true, 4),
  ('Bebidas | Nao Alcoolicas', 'Red Bull', 'Escolha entre as opcoes disponiveis.', 19, true, true, 5)
on conflict do nothing;
