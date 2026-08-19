// Catálogo central.
// Para adicionar um novo livro, copie um objeto, altere os dados e mantenha um id único.
// Em uma segunda fase, este arquivo pode ser substituído por Supabase/Firebase ou um painel administrativo.

window.BOOKS = [
  {
    id: "aurelina",
    title: "A galinha Aurelina e o tesouro da amizade",
    shortTitle: "Aurelina",
    subtitle: "O tesouro da amizade",
    theme: "Amizade • pertencimento • descoberta",
    age: "Faixa etária sugerida: 4 a 9 anos",
    price: 55.00,
    color: "#f3cb63",
    description: "Uma aventura delicada sobre amizade, convivência e os tesouros que só aparecem quando aprendemos a caminhar ao lado de alguém.",
    longDescription: "Aurelina conduz o leitor por uma história luminosa em que o verdadeiro tesouro não está escondido em um baú, mas nas relações que construímos. Ideal para leitura em família, rodas de conversa e atividades escolares.",
    tags: ["amizade", "cooperação", "família", "escola"],
    cover: "assets/images/capaAurelina.jpg"
  },
  {
    id: "resplendor",
    title: "Resplendor, a nuvem refugiada",
    shortTitle: "Resplendor",
    subtitle: "A nuvem refugiada",
    theme: "Acolhimento • liberdade • esperança",
    age: "Faixa etária sugerida: 6 a 11 anos",
    price: 55.00,
    color: "#9bc7d8",
    description: "Uma nuvem que atravessa céus difíceis encontra novos amigos e descobre que acolhimento também pode ser uma forma de reconstruir o mundo.",
    longDescription: "Resplendor nasceu em um céu marcado pela guerra e pelo medo. A narrativa apresenta, em linguagem sensível, temas de refúgio, liberdade, pertencimento e esperança, preservando a delicadeza própria da infância.",
    tags: ["acolhimento", "refúgio", "empatia", "esperança"],
    cover: "assets/images/capaResplendor.jpg"
  },
  {
    id: "dona-cuidado",
    title: "Dona Cuidado e sua perna torta",
    shortTitle: "Dona Cuidado",
    subtitle: "E sua perna torta",
    theme: "Cuidado • diferença • afeto",
    age: "Faixa etária sugerida: 4 a 9 anos",
    price: 55.00,
    color: "#e5a092",
    description: "Uma personagem que cuida de tudo e de todos nos lembra que diferenças não diminuem ninguém — e que quem cuida também merece ser cuidado.",
    longDescription: "Dona Cuidado transforma a atenção aos pequenos detalhes em gesto de afeto. A história abre espaço para conversas sobre diferença, autonomia, empatia, autoestima e reciprocidade.",
    tags: ["cuidado", "inclusão", "empatia", "autoestima"],
    cover: "assets/images/capaDonaCuidado.png"
  }
];
