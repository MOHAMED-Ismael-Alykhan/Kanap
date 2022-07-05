/************************* AFFICHAGE Page PRODUIT ************************ */

const urlParams = new URLSearchParams(window.location.search); //On récupère l'URL de la page
const id = urlParams.get("_id"); // on récupère ensuite la valeur de l'id.
//console.log(id);

fetch(`http://localhost:3000/api/products/${id}`) //Requête vers API
  .then((response) => response.json()) //Récupération des données en format json
  .then((data) => {
    //variables ciblant les zones du DOM pour insertion
    let imageEtAltTxt = document.querySelector(".item__img");
    let nom = document.querySelector("#title");
    let prix = document.querySelector("#price");
    let description = document.querySelector("#description");

    //Affichage des données du produit
    imageEtAltTxt.innerHTML = `<img src="${data.imageUrl}" alt="${data.AltTxt}">`;
    nom.textContent = `${data.name}`;
    prix.textContent = `${data.price}`;
    description.textContent = `${data.description}`;

    /*Déclaration de la variable ciblant la zone du DOM pour insertion de la sélection des couleurs par produit*/
    let couleurSelection = document.querySelector("#colors");

    for (let couleurs of data.colors) {
      //Affichage des couleurs disponibles du produit
      couleurSelection.innerHTML += `"<option value="${couleurs}">${couleurs}</option>;"`;
    }
    //Appel de la fonction ajoutProduits
    ajoutProduits();
  })
  // Si données non récupérées, afficher erreur au niveau du h1 et dans la console
  .catch((err) => {
    console.log("erreur" + err);
    document.querySelector(".item").innerHTML = "<h1>erreur</h1>";
  });

function ajoutProduits() {
  //On cible le bouton du DOM pour ensuite y écouter le click
  let AjoutPanier = document.querySelector("#addToCart");
  // On écoute le click et on récupère la valeur de couleur et quantité à ce moment là
  AjoutPanier.addEventListener("click", () => {
    let couleursProduit = document.querySelector("#colors").value;
    let quantiteProduit = document.querySelector("#quantity").value;

    // On y met une condition pour valider le click du bouton
    if (
      couleursProduit == undefined ||
      couleursProduit == "" ||
      quantiteProduit == undefined ||
      quantiteProduit < 1 ||
      quantiteProduit > 100
    ) {
      // On envoie un message d'alerte si l'une des conditions précendentes est présente
      alert(
        "Veuillez choisir une couleur disponible et une quantité comprise entre 1 et 100 pour l'ajouter au panier svp"
      );
      // Le return empêche la continuité du code si l'alerte est valide, ici il nous empëche la redirection vers la page cart.html
      return;
    } else {
      // Déclaration d'un objet qui sera stocké dans le localStorage
      //let key = `${id}-${couleursProduit}`;
      let selectionArticle = {
        id: id,
        couleurs: couleursProduit,
        quantite: Number(quantiteProduit),
      };
      //Appel de la fonction ajoutPanier
      ajoutPanier(selectionArticle);

      alert(" Nombre d'article ajouté au panier : " + quantiteProduit);

      // Redirection vers la page cart.html(page panier)
      window.location.href = "cart.html";
    }
  });
}

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

//Création d'une fonction ajout de produits au panier
function ajoutPanier(produit) {
  //On récupère d'abord le Panier
  let panier = recuperationPanier();
  // On déclare les variables rechercheProduitId et rechercheProduitCouleurs pour savoir si le produit existe déja dans le panier
  //On cherche dans le panier si il y a un produit déja présent dont l'id est égal à l'id du produit que l'on veut ajouter
  let rechercheProduitId = panier.find((p) => p.id == produit.id);
  //On cherche dans le panier si il y a un produit déja présent dont la couleur est égal à la couleur du produit que l'on veut ajouter
  let rechercheProduitCouleurs = panier.find((c) => c.couleurs == colors.value);
  // Si le produit n'existe pas encore dans le panier
  if (rechercheProduitId == undefined) {
    produitQuantite = parseInt(quantity.value);
    panier.push(produit);
  } else {
    // Si la couleur du ce produit n'est pas encore de le panier
    if (rechercheProduitCouleurs == undefined) {
      produitQuantite = parseInt(quantity.value);
      //On pousse le produit dans le tableau panier
      panier.push(produit);
    } else {
      let nouvelleQuantite =
        parseInt(rechercheProduitCouleurs.quantite) + parseInt(quantity.value);
      rechercheProduitCouleurs.quantite = nouvelleQuantite;
    }
  }
  //Une fois la quantité du produit changée on fait une sauvegarde du panier
  sauvegardePanier(panier);
}
