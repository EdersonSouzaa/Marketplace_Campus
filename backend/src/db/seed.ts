import "dotenv/config";
import { db } from "./connection.js";
import * as userRepository from "../repositories/user.repository.js";
import * as listingRepository from "../repositories/listing.repository.js";
import { hashPassword } from "../lib/password.js";
import type { Category } from "../types/index.js";

const SEED_USERS = [
  { name: "Beatriz Nogueira", email: "beatriz.nogueira@campus.edu", password: "senha123" },
  { name: "Rafael Tavares", email: "rafael.tavares@campus.edu", password: "senha123" },
  { name: "Camila Duarte", email: "camila.duarte@campus.edu", password: "senha123" },
];

const SEED_LISTINGS: Array<{
  title: string;
  description: string;
  category: Category;
  price: number | null;
  isDonation: boolean;
  imageUrl: string;
  ownerIndex: number;
}> = [
  {
    title: "Cálculo I - James Stewart, 7ª edição",
    description: "Livro usado durante o primeiro ano de Engenharia, sem rasuras, com capa um pouco desgastada.",
    category: "Livros",
    price: 45,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=C%C3%A1lculo+I",
    ownerIndex: 0,
  },
  {
    title: "Apostila completa de Algoritmos e Estrutura de Dados",
    description: "Apostila impressa e encadernada da disciplina, com exercícios resolvidos nas margens.",
    category: "Apostilas e Xerox",
    price: null,
    isDonation: true,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Apostila+AED",
    ownerIndex: 1,
  },
  {
    title: "Calculadora científica HP 12C",
    description: "Funciona perfeitamente, ideal para quem está entrando em Administração ou Engenharia de Produção.",
    category: "Calculadoras",
    price: 120,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=HP+12C",
    ownerIndex: 2,
  },
  {
    title: "Arduino Uno R3 + protoboard e jumpers",
    description: "Kit usado em disciplina de sistemas embarcados, componentes testados e funcionando.",
    category: "Eletrônicos",
    price: 80,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Arduino+Uno",
    ownerIndex: 0,
  },
  {
    title: "Jaleco branco tamanho M",
    description: "Usado por um semestre no laboratório de Química. Lavado e sem manchas.",
    category: "Jalecos e Uniformes",
    price: null,
    isDonation: true,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Jaleco+M",
    ownerIndex: 1,
  },
  {
    title: "Óculos de proteção + luvas de laboratório (kit)",
    description: "Kit de segurança para aulas de química e física experimental, pouco uso.",
    category: "Material de Laboratório",
    price: 20,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Kit+Laborat%C3%B3rio",
    ownerIndex: 2,
  },
  {
    title: "Mesa dobrável para estudos",
    description: "Mesa compacta, ideal para quarto de república. Retirar no campus ou perto dele.",
    category: "Móveis",
    price: 60,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Mesa+Dobr%C3%A1vel",
    ownerIndex: 0,
  },
  {
    title: "Física Básica Vol. 1 e 2 - Moysés Nussenzveig",
    description: "Dois volumes usados no ciclo básico de Engenharia, com grifos a lápis (apagáveis).",
    category: "Livros",
    price: null,
    isDonation: true,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=F%C3%ADsica+B%C3%A1sica",
    ownerIndex: 1,
  },
  {
    title: "Resumos e xerox de Cálculo II (ciclo completo)",
    description: "Material de apoio organizado por assunto, ajudou muito na época de provas.",
    category: "Apostilas e Xerox",
    price: 15,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Resumos+C%C3%A1lculo+II",
    ownerIndex: 2,
  },
  {
    title: "Cadeira de escritório giratória",
    description: "Cadeira confortável para longas sessões de estudo, poucos meses de uso.",
    category: "Móveis",
    price: 150,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Cadeira",
    ownerIndex: 0,
  },
  {
    title: "Placa de circuito e componentes soltos (resistores, LEDs, capacitores)",
    description: "Sobra de componentes de projetos de Circuitos Elétricos, tudo organizado em caixinhas.",
    category: "Eletrônicos",
    price: null,
    isDonation: true,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Componentes",
    ownerIndex: 1,
  },
  {
    title: "Calculadora gráfica Casio fx-9860GII",
    description: "Pouco usada, ideal para quem vai cursar disciplinas de cálculo numérico.",
    category: "Calculadoras",
    price: 200,
    isDonation: false,
    imageUrl: "https://placehold.co/600x400/2f6b4f/f4ede1?text=Casio+fx-9860",
    ownerIndex: 2,
  },
];

export function seed(): void {
  const alreadySeeded = (db.prepare("SELECT COUNT(*) AS total FROM listings").get() as { total: number }).total > 0;
  if (alreadySeeded) return;

  const users = SEED_USERS.map((seedUser) => {
    const existing = userRepository.findByEmail(seedUser.email);
    return existing ?? userRepository.create(seedUser.name, seedUser.email, hashPassword(seedUser.password));
  });

  for (const item of SEED_LISTINGS) {
    listingRepository.create({
      title: item.title,
      description: item.description,
      category: item.category,
      price: item.price,
      isDonation: item.isDonation,
      imageUrl: item.imageUrl,
      ownerId: users[item.ownerIndex].id,
    });
  }

  console.log(`Seed concluído: ${users.length} usuários e ${SEED_LISTINGS.length} anúncios de exemplo.`);
}

seed();
