const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts")

const app = express();

// Définir le moteur de vue EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware layouts
app.use(expressLayouts)
app.set("layout", "layouts/layout")

// Middleware pour fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Route principale
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Accueil",
    message: "Bienvenue chez CSE Motors 🚗"
  });
});

// Démarrer le serveur
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
