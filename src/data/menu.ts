import smashDuploAsset from "@/assets/prod-smash-duplo.jpg.asset.json";
import xbaconAsset from "@/assets/prod-xbacon.jpg.asset.json";
import macarraoAsset from "@/assets/prod-macarrao.jpg.asset.json";
import omeleteAsset from "@/assets/prod-omelete.jpg.asset.json";
import smashSaladaAsset from "@/assets/prod/smash-salada.png.asset.json";
import smashEspecialAsset from "@/assets/prod/smash-especial.png.asset.json";
import hamburguerAsset from "@/assets/prod/hamburguer.png.asset.json";
import xeggBaconAsset from "@/assets/prod/xegg-bacon.png.asset.json";
import xmineiroAsset from "@/assets/prod/xmineiro.png.asset.json";
import fritasBaconAsset from "@/assets/prod/fritas-bacon.png.asset.json";
import costelaAsset from "@/assets/prod/costela.png.asset.json";
import costela2Asset from "@/assets/prod/costela2.png.asset.json";

const smashDuplo = smashDuploAsset.url;
const xbacon = xbaconAsset.url;
const macarrao = macarraoAsset.url;
const omelete = omeleteAsset.url;



export type CategoryKey =
  | "artesanais"
  | "tradicionais"
  | "fritas"
  | "diversos"
  | "bebidas";

export type Product = {
  id: string;
  name: string;
  category: CategoryKey;
  description: string;
  ingredients?: string;
  price: number;
  image?: string;
  badge?: string;
  featured?: boolean;
  options?: { label: string; values: string[] };
};

export const categories: { key: CategoryKey | "todos" | "destaques"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "destaques", label: "Destaques" },
  { key: "artesanais", label: "Artesanais" },
  { key: "tradicionais", label: "Tradicionais" },
  { key: "fritas", label: "Fritas" },
  { key: "diversos", label: "Diversos" },
  { key: "bebidas", label: "Bebidas" },
];

export const additionals: { id: string; name: string; price: number }[] = [
  { id: "add-cebola-roxa", name: "Cebola-roxa", price: 2 },
  { id: "add-ovo", name: "Ovo", price: 2 },
  { id: "add-presunto", name: "Presunto", price: 2.5 },
  { id: "add-mussarela", name: "Mussarela", price: 2.5 },
  { id: "add-smash", name: "Smash", price: 6.5 },
  { id: "add-calabresa", name: "Calabresa", price: 3 },
  { id: "add-bacon", name: "Bacon", price: 4 },
  { id: "add-picles", name: "Picles", price: 4 },
  { id: "add-bife", name: "Bife de Hambúrguer", price: 2.5 },
  { id: "add-cheddar", name: "Cheddar", price: 5 },
  { id: "add-molho", name: "Molho Especial", price: 3 },
  { id: "add-catupiry", name: "Catupiry", price: 5 },
  { id: "add-cebola-caramelizada", name: "Cebola Caramelizada", price: 4 },
];

export const products: Product[] = [
  // ARTESANAIS
  {
    id: "smash-salada",
    name: "Smash Salada",
    category: "artesanais",
    description: "Um smash leve, completo e cheio de sabor, preparado com ingredientes frescos e molho especial.",
    ingredients: "Pão, maionese especial, queijo, alface, tomate, picles e cebola-roxa.",
    price: 22,
    image: smashSaladaAsset.url,
    featured: true,
  },
  {
    id: "smash-cheddar",
    name: "Smash Cheddar",
    category: "artesanais",
    description: "Hambúrguer smash suculento combinado com bacon crocante e cheddar cremoso.",
    ingredients: "Pão, maionese especial, hambúrguer smash, bacon e cheddar.",
    price: 25,
    featured: true,
  },
  {
    id: "smash-queijo-duplo",
    name: "Smash Queijo Duplo",
    category: "artesanais",
    description: "Uma combinação cremosa e irresistível para quem não abre mão de muito queijo.",
    ingredients: "Pão, maionese especial, hambúrguer smash, bacon, mussarela e Catupiry.",
    price: 27,
  },
  {
    id: "smash-especial",
    name: "Smash Especial",
    category: "artesanais",
    description: "O sabor especial da casa, com bacon, queijo, cebola caramelizada e barbecue.",
    ingredients: "Pão, maionese especial, mussarela, bacon, cebola caramelizada e molho barbecue.",
    price: 29,
    badge: "Especial da casa",
    featured: true,
  },
  {
    id: "smash-duplo",
    name: "Smash Duplo",
    category: "artesanais",
    description: "Dois hambúrgueres smash com cheddar e bacon em dobro para uma fome de verdade.",
    ingredients: "Pão, maionese especial, dois hambúrgueres smash, cheddar e bacon em dobro.",
    price: 39,
    image: smashDuplo,
    badge: "Para quem tem fome",
  },
  {
    id: "smash-abacaxi",
    name: "Smash Abacaxi",
    category: "artesanais",
    description: "Uma criação especial da casa com o toque doce e marcante do abacaxi grelhado. Consulte os ingredientes no atendimento.",
    ingredients: "Consulte a composição atualizada com a equipe.",
    price: 32,
    badge: "Novidade",
  },

  // TRADICIONAIS
  {
    id: "misto-americano",
    name: "Misto Americano",
    category: "tradicionais",
    description: "Um clássico simples, saboroso e perfeito para qualquer momento.",
    ingredients: "Pão, bife de hambúrguer, presunto, mussarela e ovo.",
    price: 14,
    image: hamburguerAsset.url,
  },
  {
    id: "hamburguer",
    name: "Hambúrguer",
    category: "tradicionais",
    description: "O tradicional hambúrguer completo, preparado com ingredientes frescos e muito sabor.",
    ingredients: "Pão, bife de hambúrguer, presunto, mussarela, alface, tomate e batata palha.",
    price: 17,
    image: hamburguerAsset.url,
  },
  {
    id: "x-egg",
    name: "X-Egg",
    category: "tradicionais",
    description: "Um lanche completo com ovo, queijo e salada fresca.",
    ingredients: "Pão, bife de hambúrguer, presunto, mussarela, ovo, alface, tomate e batata palha.",
    price: 19,
    image: xeggBaconAsset.url,
  },
  {
    id: "x-bacon",
    name: "X-Bacon",
    category: "tradicionais",
    description: "O sabor tradicional combinado com bacon crocante e queijo derretido.",
    ingredients: "Pão, bife de hambúrguer, presunto, mussarela, alface, tomate, bacon e batata palha.",
    price: 22,
    image: xbacon,
    featured: true,
  },
  {
    id: "x-egg-bacon",
    name: "X-Egg-Bacon",
    category: "tradicionais",
    description: "Uma combinação completa de ovo, bacon, queijo, salada e muito sabor.",
    ingredients: "Pão, bife de hambúrguer, presunto, mussarela, ovo, bacon, alface, tomate, milho e batata palha.",
    price: 25,
    image: xeggBaconAsset.url,
  },
  {
    id: "x-mineiro",
    name: "X-Mineiro",
    category: "tradicionais",
    description: "O lanche que representa a casa: grande, completo, generoso e cheio de sabor mineiro.",
    ingredients: "Pão, dois bifes de hambúrguer, presunto, mussarela, dois ovos, bacon, alface, tomate, milho e batata palha.",
    price: 30,
    image: xmineiroAsset.url,
    badge: "Mineiro",
    featured: true,
  },

  // FRITAS
  { id: "fritas", name: "Fritas", category: "fritas", description: "Porção de batatas fritas douradas, crocantes por fora e macias por dentro.", price: 18 },
  { id: "fritas-bacon", name: "Fritas com Bacon", category: "fritas", description: "Batatas fritas crocantes acompanhadas de bacon saboroso.", price: 25, image: fritasBaconAsset.url },
  { id: "fritas-suina", name: "Fritas com Carne Suína", category: "fritas", description: "Porção generosa de fritas acompanhada de carne suína preparada com muito sabor.", price: 35, image: costelaAsset.url },
  { id: "fritas-bovina", name: "Fritas com Carne Bovina", category: "fritas", description: "Batatas fritas crocantes acompanhadas de carne bovina suculenta.", price: 45, image: costela2Asset.url },

  // DIVERSOS
  {
    id: "macarrao-chapa",
    name: "Macarrão na Chapa",
    category: "diversos",
    description: "Macarrão preparado na chapa com uma combinação saborosa de carnes, legumes e temperos.",
    ingredients: "Macarrão, cubos de frango, calabresa, mussarela, cebola, tomate e milho.",
    price: 20,
    image: macarrao,
  },
  {
    id: "pao-pernil",
    name: "Pão com Pernil",
    category: "diversos",
    description: "Pão de sal recheado com pernil saboroso, salada e milho.",
    ingredients: "Pão de sal, pernil, cebola, tomate, milho e alface.",
    price: 15,
  },
  {
    id: "omelete",
    name: "Omelete Recheado",
    category: "diversos",
    description: "Omelete completo, preparado com três ovos e recheio generoso.",
    ingredients: "Três ovos, presunto, mussarela, bacon e cebola.",
    price: 20,
    image: omelete,
  },

  // BEBIDAS — Refrigerantes 200 ml
  { id: "refri-200-coca", name: "Refrigerante 200 ml — Coca-Cola", category: "bebidas", description: "Coca-Cola 200 ml bem gelada.", price: 3 },
  { id: "refri-200-fanta", name: "Refrigerante 200 ml — Fanta", category: "bebidas", description: "Fanta 200 ml bem gelada.", price: 3 },
  { id: "refri-200-guarana", name: "Refrigerante 200 ml — Guaraná", category: "bebidas", description: "Guaraná 200 ml bem gelado.", price: 3 },

  // Refrigerantes Lata
  { id: "refri-lata-coca", name: "Refrigerante Lata — Coca-Cola", category: "bebidas", description: "Coca-Cola em lata servida bem gelada.", price: 6 },
  { id: "refri-lata-fanta", name: "Refrigerante Lata — Fanta", category: "bebidas", description: "Fanta em lata servida bem gelada.", price: 6 },
  { id: "refri-lata-guarana", name: "Refrigerante Lata — Guaraná", category: "bebidas", description: "Guaraná em lata servido bem gelado.", price: 6 },

  // Refrigerantes 600 ml
  { id: "refri-600-coca", name: "Refrigerante 600 ml — Coca-Cola", category: "bebidas", description: "Coca-Cola 600 ml gelada.", price: 7 },
  { id: "refri-600-fanta", name: "Refrigerante 600 ml — Fanta", category: "bebidas", description: "Fanta 600 ml gelada.", price: 7 },
  { id: "refri-600-guarana", name: "Refrigerante 600 ml — Guaraná", category: "bebidas", description: "Guaraná 600 ml gelado.", price: 7 },

  // Refrigerantes 1 L
  { id: "refri-1l-coca", name: "Refrigerante 1 L — Coca-Cola", category: "bebidas", description: "Coca-Cola 1 litro gelada.", price: 10 },
  { id: "refri-1l-fanta", name: "Refrigerante 1 L — Fanta", category: "bebidas", description: "Fanta 1 litro gelada.", price: 10 },
  { id: "refri-1l-guarana", name: "Refrigerante 1 L — Guaraná", category: "bebidas", description: "Guaraná 1 litro gelado.", price: 10 },

  // Refrigerantes 2 L
  { id: "refri-2l-coca", name: "Refrigerante 2 L — Coca-Cola", category: "bebidas", description: "Coca-Cola 2 litros gelada.", price: 14 },
  { id: "refri-2l-fanta", name: "Refrigerante 2 L — Fanta", category: "bebidas", description: "Fanta 2 litros gelada.", price: 14 },
  { id: "refri-2l-guarana", name: "Refrigerante 2 L — Guaraná", category: "bebidas", description: "Guaraná 2 litros gelado.", price: 12 },

  // Sucos Del Valle
  { id: "suco-lata", name: "Suco Del Valle Lata", category: "bebidas", description: "Suco Del Valle em lata (290 ml).", price: 7.5, options: { label: "Sabor", values: ["Pêssego", "Uva", "Goiaba", "Maracujá"] } },
  { id: "suco-1l", name: "Suco Del Valle 1 Litro", category: "bebidas", description: "Suco Del Valle Uva de 1 litro.", price: 9 },

  // Águas
  { id: "agua-sem", name: "Água sem Gás", category: "bebidas", description: "Água mineral sem gás.", price: 2.5 },
  { id: "agua-com", name: "Água com Gás", category: "bebidas", description: "Água mineral com gás.", price: 3 },

];


export const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });