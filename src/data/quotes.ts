export interface Quote {
  id: string;
  text: string;
  author: string;
  theme: string;
}

export const THEMES = [
  { id: "echec", label: "Peur de l'échec", emoji: "🌑" },
  { id: "discipline", label: "Discipline", emoji: "🗿" },
  { id: "grit", label: "Grit", emoji: "🔥" },
  { id: "courage", label: "Courage", emoji: "🦁" },
  { id: "resilience", label: "Résilience", emoji: "🌊" },
  { id: "confiance", label: "Confiance en soi", emoji: "✨" },
  { id: "productivite", label: "Productivité", emoji: "⚡" },
] as const;

export const QUOTES: Quote[] = [
  // Peur de l'échec
  { id: "e1", theme: "echec", text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.", author: "Sénèque" },
  { id: "e2", theme: "echec", text: "J'ai échoué encore et encore dans ma vie. Et c'est pour cela que je réussis.", author: "Michael Jordan" },
  { id: "e3", theme: "echec", text: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.", author: "Winston Churchill" },
  { id: "e4", theme: "echec", text: "Celui qui n'a jamais commis d'erreur n'a jamais tenté d'innover.", author: "Albert Einstein" },
  // Discipline
  { id: "d1", theme: "discipline", text: "Nous sommes ce que nous répétons chaque jour. L'excellence n'est donc pas un acte, mais une habitude.", author: "Aristote" },
  { id: "d2", theme: "discipline", text: "La discipline est le pont entre les objectifs et l'accomplissement.", author: "Jim Rohn" },
  { id: "d3", theme: "discipline", text: "Maîtrise-toi toi-même avant de prétendre maîtriser le monde.", author: "Proverbe stoïcien" },
  { id: "d4", theme: "discipline", text: "La liberté se trouve de l'autre côté de la discipline.", author: "Jocko Willink" },
  // Grit
  { id: "g1", theme: "grit", text: "La chute n'est pas un échec. L'échec, c'est de rester là où on est tombé.", author: "Socrate" },
  { id: "g2", theme: "grit", text: "L'eau qui persiste finit par creuser la pierre.", author: "Ovide" },
  { id: "g3", theme: "grit", text: "Peu importe la lenteur à laquelle tu avances, tant que tu ne t'arrêtes pas.", author: "Confucius" },
  { id: "g4", theme: "grit", text: "Les grandes œuvres sont accomplies non par la force, mais par la persévérance.", author: "Samuel Johnson" },
  // Courage
  { id: "c1", theme: "courage", text: "Le courage n'est pas l'absence de peur, mais la capacité de la vaincre.", author: "Nelson Mandela" },
  { id: "c2", theme: "courage", text: "La fortune sourit aux audacieux.", author: "Virgile" },
  { id: "c3", theme: "courage", text: "Il faut oser ou se résigner à tout.", author: "Tite-Live" },
  { id: "c4", theme: "courage", text: "Ce que tu crains d'affronter détient souvent ce dont tu as besoin pour grandir.", author: "Inspiration stoïcienne" },
  // Résilience
  { id: "r1", theme: "resilience", text: "Ce qui ne me tue pas me rend plus fort.", author: "Friedrich Nietzsche" },
  { id: "r2", theme: "resilience", text: "L'obstacle est le chemin.", author: "Marc Aurèle" },
  { id: "r3", theme: "resilience", text: "Le roseau plie mais ne rompt pas.", author: "Jean de La Fontaine" },
  { id: "r4", theme: "resilience", text: "Un homme peut être détruit, mais pas vaincu.", author: "Ernest Hemingway" },
  // Confiance en soi
  { id: "f1", theme: "confiance", text: "Qu'il s'agisse de penser que tu peux ou que tu ne peux pas, dans les deux cas tu as raison.", author: "Henry Ford" },
  { id: "f2", theme: "confiance", text: "Personne ne peut te faire sentir inférieur sans ton consentement.", author: "Eleanor Roosevelt" },
  { id: "f3", theme: "confiance", text: "Deviens ce que tu es.", author: "Pindare" },
  { id: "f4", theme: "confiance", text: "La confiance en soi est le premier secret du succès.", author: "Ralph Waldo Emerson" },
  // Productivité
  { id: "p1", theme: "productivite", text: "Ne remets pas à demain ce que tu peux faire aujourd'hui.", author: "Benjamin Franklin" },
  { id: "p2", theme: "productivite", text: "Ce n'est pas que nous ayons peu de temps, c'est que nous en perdons beaucoup.", author: "Sénèque" },
  { id: "p3", theme: "productivite", text: "Concentre-toi sur l'essentiel, le reste n'est que du bruit.", author: "Inspiration stoïcienne" },
  { id: "p4", theme: "productivite", text: "La simplicité est la sophistication suprême.", author: "Léonard de Vinci" },
];
