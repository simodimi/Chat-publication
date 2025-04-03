import img1 from "./backimage/arbre.jpg";
import img2 from "./backimage/bateau.jpg";
import img3 from "./backimage/bleu.jpeg";
import img4 from "./backimage/bleuciel.jpeg";
import img5 from "./backimage/board.jpeg";
import img6 from "./backimage/cascade.jpg";
import img7 from "./backimage/galaxie.jpeg";
import img8 from "./backimage/mountains.jpg";
import img9 from "./backimage/neige.jpg";
import img10 from "./backimage/pink.jpeg";
import img11 from "./backimage/red.jpeg";
export const couleur = [
  { id: 1, couleur: "black", nom: "noir" },
  { id: 2, couleur: "white", nom: "blanc" },
  { id: 3, couleur: "red", nom: "rouge" },
  { id: 4, couleur: "blue", nom: "bleu" },
  { id: 5, couleur: "green", nom: "vert" },
  { id: 6, couleur: "yellow", nom: "jaune" },
];
export const background = [
  { id: 1, background: img1, nom: "arbre" },
  { id: 2, background: img2, nom: "bateau" },
  { id: 3, background: img3, nom: "bleu" },
  { id: 4, background: img4, nom: "bleuciel" },
  { id: 5, background: img5, nom: "board" },
  { id: 6, background: img6, nom: "cascade" },
  { id: 7, background: img7, nom: "galaxie" },
  { id: 8, background: img8, nom: "mountains" },
  { id: 9, background: img9, nom: "neige" },
  { id: 10, background: img10, nom: "pink" },
  { id: 11, background: img11, nom: "red" },
  { id: 12, background: "lightgray", nom: "gris" },
];
export const taille = [
  { id: 1, taille: "10px", label: "S", nom: "petit" },
  { id: 2, taille: "20px", label: "M", nom: "moyen" },
  { id: 3, taille: "30px", label: "XL", nom: "grand" },
  { id: 4, taille: "40px", label: "XXL", nom: "tres grand" },
  { id: 5, taille: "50px", label: "XXXL", nom: "gigantesque" },
];
export const font = [
  { id: 1, font: "Arial", nom: "Arial" },
  { id: 2, font: "Verdana", nom: "Verdana" },
  { id: 3, font: "Georgia", nom: "Georgia" },
  { id: 4, font: "Times", nom: "Roman" },
  { id: 5, font: "Papyrus", nom: "Papyrus" },

  { id: 7, font: "Franklin", nom: "Franklin" },
  { id: 8, font: "Rockwell", nom: "Rockwell" },
  { id: 9, font: "Bodoni", nom: "Bodoni MT" },
];
export const filtre = [
  { id: 1, filter: "brightness(0.5)", nom: "sombre", couleur: "#333333" }, // Gris foncé
  { id: 2, filter: "brightness(1)", nom: "normal", couleur: "#007bff" }, // Bleu par défaut (inchangé)
  { id: 3, filter: "brightness(1.5)", nom: "clair", couleur: "#e0f2fe" }, // Bleu très clair
  { id: 7, filter: "grayscale(1)", nom: "noir et blanc", couleur: "#808080" }, // Gris neutre (inchangé)
  { id: 9, filter: "invert(1)", nom: "inverser", couleur: "#ffff00" }, // Jaune (couleur complémentaire du bleu)
  { id: 11, filter: "sepia(1)", nom: "sepia", couleur: "#a0522d" }, // Brun rouille
  { id: 12, filter: "sepia(0)", nom: "normal", couleur: "#007bff" }, // Bleu par défaut (inchangé)
  { id: 17, filter: "blur(5px)", nom: "flou", couleur: "#c0c0c0" }, // Gris clair
  { id: 18, filter: "blur(0px)", nom: "normal", couleur: "#007bff" }, // Bleu par défaut (inchangé)
];
export const emoji = [
  { id: 1, emoji: "😀", nom: "sourire" },
  { id: 2, emoji: "😂", nom: "rire" },
  { id: 3, emoji: "😍", nom: "amour" },
  { id: 4, emoji: "😎", nom: "cool" },
  { id: 5, emoji: "😜", nom: "rire" },
  { id: 6, emoji: "😢", nom: "triste" },
  { id: 7, emoji: "😡", nom: "colere" },
  { id: 8, emoji: "😱", nom: "peur" },
  { id: 9, emoji: "😴", nom: "fatigue" },
  { id: 10, emoji: "😷", nom: "malade" },
];
