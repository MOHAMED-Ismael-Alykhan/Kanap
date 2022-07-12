//On récupère l'URL de la page
const urlParams = new URLSearchParams(window.location.search);
// on récupère ensuite la valeur de l'id de commande.
const idCommande = urlParams.get("idCommande");
console.log(idCommande);

//on cible la zone d'insertion au niveau du DOM
const zoneIdCommande = document.querySelector("#orderId");

zoneIdCommande.textContent = idCommande;

//On efface le localStorage une fois la commande validée avec l'affige de l'id de commande
function effaceLocalStorage() {
  const cache = window.localStorage;
  cache.clear();
}

effaceLocalStorage();
