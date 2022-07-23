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

function remaniementPanier() {
  //Déclaration de la variable ciblant la zone du DOM soit le changement de le quantité des articles au niveau de la page panier
  let zoneArticlesQuantite = document.querySelectorAll(".itemQuantity");
  //Déclaration de la variable ciblant la zone du DOM
  let supprimeArticlesSelection = document.querySelectorAll(".deleteItem");
  // boucle par rapport au nombre de "supprimer" par modèle de Kanap
  for (let q = 0; q < supprimeArticlesSelection.length; q++) {
    //Création d'un évenement au click sur "supprimer"
    supprimeArticlesSelection[q].addEventListener("click", (e) => {
      //On supprime un élément du chariot à l'index q
      chariot.splice(q, 1);
      //On sauvegarde le nouveau panier
      sauvegardePanier(chariot);
      //On rafraichit la page
      location.reload();
    });
    //Création d'un évenement au change sur "la quantité du produit"
    zoneArticlesQuantite[q].addEventListener("change", () => {
      // La quantité du produit est égale à la valeur de la quantité que l'on a choisi sur la page panier
      chariot[q].quantite = parseInt(zoneArticlesQuantite[q].value);
      // On sauvegarde le nouveau panier
      sauvegardePanier(chariot);
      //On rafraichit la page
      location.reload();
    });
  }
}

/**************************************************************************/
/*                        AFFICHAGE DU PANIER                             */
/**************************************************************************/

let prixTotal = 0;
let chariot = recuperationPanier();

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

          let zonePrixTotal = document.querySelector("#totalPrice");
          prixTotal += parseInt(chariot[i].quantite) * parseInt(data.price);
          zonePrixTotal.textContent = parseInt(prixTotal);
          return data;
        })
        .catch((err) => {
          console.log("erreur" + err);
        });
    }
  }
}

/************************* CALCUlS QUANTITE *****************************/

//Création d'une fonction pour récupérer le nombre total des produits du Panier
function recuperationNombreTotalProduit() {
  //On récupère d'abord le Panier
  let chariot = recuperationPanier();

  let nombre = 0;
  for (let produit of chariot) {
    nombre += parseInt(produit.quantite);
  }
  let zoneNombreArticlesTotal = document.querySelector("#totalQuantity");
  zoneNombreArticlesTotal.textContent = parseInt(nombre);
  return nombre;
}

/**********************************************************************/
/*                            FORMULAIRE                              */
/******************************************************************** */

let formulaire = document.querySelector("#order");
//On écoute le soumission du Formulaire
formulaire.addEventListener("click", (e) => {
  e.preventDefault();
  let validationCouleur = `rgb(107, 205, 39)`;
  let nonValidationCouleur = `rgb(241,17,1)`;

  /******************* VERIFICATION DU PRENOM *********************/

  //Création de la regexp pour la validation du prénom
  let prenomRegExp = new RegExp(`^[a-zA-Z- ]{2,31}$`, `g`);
  //On test la regexp prenom
  let testPrenom = prenomRegExp.test(firstName.value);
  if (testPrenom === true) {
    firstNameErrorMsg.textContent = "";
    firstName.style.backgroundColor = validationCouleur;
  } else {
    firstNameErrorMsg.textContent = "Le prénom n'est pas valide";
    firstName.style.backgroundColor = nonValidationCouleur;
  }

  /******************* VERIFICATION DU NOM *************************/

  //Création de la regexp pour la validation du nom
  let nomRegExp = new RegExp(`^[a-zA-Z- ]{2,32}$`, `g`);
  //On test la regexp nom
  let testNom = nomRegExp.test(lastName.value);
  if (testNom === true) {
    lastNameErrorMsg.textContent = "";
    lastName.style.backgroundColor = validationCouleur;
  } else {
    lastNameErrorMsg.textContent = "Le nom n'est pas valide";
    lastName.style.backgroundColor = nonValidationCouleur;
  }

  /******************* VERIFICATION DE L' ADRESSE *********************/

  //Création de la regexp pour la validation de l'adresse
  let adresseRegExp = new RegExp(`^[a-zA-Z0-9-,'.; ]{2,70}$`, `g`);
  //On test la regexp adresse
  let testAdresse = adresseRegExp.test(address.value);
  if (testAdresse === true) {
    addressErrorMsg.textContent = "";
    address.style.backgroundColor = validationCouleur;
  } else {
    addressErrorMsg.textContent = "L'adresse n'est pas valide";
    address.style.backgroundColor = nonValidationCouleur;
  }

  /******************* VERIFICATION DE LA VILLE *********************/

  //Création de la regexp pour la validation de la ville
  let villeRegExp = new RegExp(`^[a-zA-Z- ]{2,31}$`, `g`);
  //On test la regexp ville
  let testVille = villeRegExp.test(city.value);
  if (testVille === true) {
    cityErrorMsg.textContent = "";
    city.style.backgroundColor = validationCouleur;
  } else {
    cityErrorMsg.textContent = "La ville n'est pas valide";
    city.style.backgroundColor = nonValidationCouleur;
  }

  /******************* VERIFICATION DE L' EMAIL **********************/

  //Création de la regexp pour la validation de l'Email
  let emailRegExp = new RegExp(
    `^[a-zA-Z0-9._]+[@]{1}[a-zA-Z0-9]+[.]{1}[a-z]{2,31}$`,
    `g`
  );
  //On test la regexp email
  let testEmail = emailRegExp.test(email.value);
  if (testEmail === true) {
    emailErrorMsg.textContent = "";
    email.style.backgroundColor = validationCouleur;
  } else {
    emailErrorMsg.textContent = "L'email n'est pas valide";
    email.style.backgroundColor = nonValidationCouleur;
  }

  /********************** RECUPERATION DE L'ID DES PRODUITS ***************/

  let idProduit = [];
  for (let j = 0; j < chariot.length; j++) {
    idProduit.push(chariot[j].id);
  }

  /*********** CREATION DU BODY "COMMANDE" POUR LA REQUETE POST **********/

  const commande = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: idProduit,
  };

  /****************** CONDITION POUR L'ENVOI DU FORMULAIRE *****************/

  if (testPrenom && testNom && testAdresse && testVille && testEmail === true) {
    /*************************** REQUETE POST **********************************/

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(commande),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        window.location.href = `./confirmation.html?id_commande=${data.orderId}`;
      })
      .catch((err) => {
        console.log("erreur" + err);
      });
  }
});
