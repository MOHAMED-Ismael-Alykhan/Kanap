// Création d'une fonction pour enregistrer le panier dans le LocalStorage
function sauvegardePanier(panier) {
  //Création d'une paire clée/valeur et on transforme l'objet panier en chaine de caractère
  localStorage.setItem("panier", JSON.stringify(panier));
}

// Création d'une fonction pour récupérer le panier dans le LocalStorage
function recuperationPanier() {
  // On déclare dans une variable ce que l'on a récupéré du LocalStorage
  let panier = localStorage.getItem("panier");
  //Condition si le panier est null (vide)
  if (panier == null) {
    //retourne nous un tableau vide
    return [];
  } else {
    // sinon retourne le panier retransformé de la chaine de caractère en objet
    return JSON.parse(panier);
  }
}

/******************************************************************* */

let chariot = recuperationPanier();
//console.table(chariot);
affichageProduitsPanier(chariot);

async function affichageProduitsPanier(chariot) {
  //Si panier vide
  if (chariot === null || chariot.length < 1) {
    let PanierVide = document.querySelector("#cartAndFormContainer");
    PanierVide.innerHTML = `<h1>Votre panier est vide</h1>`;
  }
  // si element dans panier
  else {
    for (let i = 0; i < chariot.length; i++) {
      //Requête vers API pour récupérer les données en fonction de chacun des articles du chariot

      await fetch("http://localhost:3000/api/products/" + chariot[i].id)
        .then((response) => response.json()) //Récupération des données en format json
        .then((data) => {
          console.log(chariot[i].couleurs);

          let zoneArticlesPanier = document.querySelector("#cart__items");
          zoneArticlesPanier.innerHTML += `
<article class="cart__item" data-id="${data._id}" data-color="${chariot[i].couleurs}">
                <div class="cart__item__img">
                  <img src=${data.imageUrl} alt=${data.alt}>
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>couleur : ${chariot[i].couleurs}</p>
                    <p data-price= ${data.price}>${data.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${chariot[i].quantite}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;

          remaniementPanier();
          recuperationNombreTotalProduit();
          recuperationPrixTotal();
          return data;

          // Si données non récupérées, afficher erreur au niveau du h1 et dans la console

          //.catch((err) => {
          console.log("erreur" + err);
        });
    }
  }
}

/********** CALCUlS QUANTITE ET PRIX TOTAL ****************/

//Création d'une fonction pour récupérer le nombre total des produits du Panier
function recuperationNombreTotalProduit() {
  //On récupère d'abord le Panier
  let chariot = recuperationPanier();

  let nombre = 0;
  for (let produit of chariot) {
    nombre += produit.quantite;
    console.log(nombre);
  }
  let zoneNombreArticlesTotal = document.querySelector("#totalQuantity");
  zoneNombreArticlesTotal.textContent = parseInt(nombre);
  return nombre;
}

//Création d'une fonction pour récupérer le prix total du Panier
function recuperationPrixTotal() {
  //On récupère d'abord le Panier

  let chariot = recuperationPanier();
  let prixTotal = 0;

  for (let produit of chariot) {
    prixTotal += parseInt(produit.quantite * produit.prix);
  }

  let zonePrixTotal = document.querySelector("#totalPrice");
  zonePrixTotal.textContent = parseInt(prixTotal);

  return prixTotal;
}

function remaniementPanier() {
  //Déclaration de la variable ciblant la zone du DOM soit le changement de le quantité des articles au niveau de la page panier
  let zoneArticlesQuantite = document.querySelectorAll(".itemQuantity");
  //Déclaration de la variable ciblant la zone du DOM
  let supprimeArticlesSelection = document.querySelectorAll(".deleteItem");
  // boucle par rapport au nombre de "supprimer" par modèle de Kanap
  for (let q = 0; q < supprimeArticlesSelection.length; q++) {
    //Création d'un évenement au click sur "supprimer"
    supprimeArticlesSelection[q].addEventListener("click", (e) => {
      e.preventDefault;
      //On supprime un élément du chariot à l'index q
      chariot.splice(q, 1);
      //On sauvegarde le nouveau panier
      sauvegardePanier(chariot);
      //On rafraichit la page
      location.reload();
    });
    //Création d'un évenement au change sur "la quantité du produit"
    zoneArticlesQuantite[q].addEventListener("change", () => {
      // La quantité du produit est égal à la valeur de la quantité que l'on a choisi sur la page panier
      chariot[q].quantite = zoneArticlesQuantite[q].value;
      // On sauvegarde le nouveau panier
      sauvegardePanier(chariot);
      //On rafraichit la page
      location.reload();
    });
  }
}
