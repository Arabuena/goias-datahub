import { Bot, ChartNoAxesCombined, Landmark, Search } from 'lucide-react';

// A configuração guarda o ícone como string (JS puro) e a UI resolve aqui,
// evitando importar React na camada de configuração.
const ICONS = {
  chart: ChartNoAxesCombined,
  landmark: Landmark,
  bot: Bot,
  search: Search,
};

export function getAppIcon(name) {
  return ICONS[name] ?? ChartNoAxesCombined;
}
