function Drapeau(pays, slug) {
    this.pays = pays;
    this.imgSrc = `./static/assets/${slug}.png`;
}

/**
 *  Liste des drapeaux du jeu : Nom complet et abbréviation (pour l'image)
 */
const DRAPEAUX = [
    new Drapeau('Sénégal', 'senegal'),
    new Drapeau('Chine', 'chine'),
    new Drapeau('Dubaï', 'dubai'),
    new Drapeau('Congo Brazzaville', 'congo-brazzaville'),
    new Drapeau('France', 'france'),
    new Drapeau('Gabon', 'gabon'),
    new Drapeau('Japon', 'japon'),
    new Drapeau('Luxembourg', 'luxembourg'),
    new Drapeau('Miami', 'miami'),
    new Drapeau('Belgique', 'belgique'),
];

/**
 * Définition de l'objet Time
 */
function Time(heures = 0, minutes = 0, secondes = 0) {
    this.secondes = secondes;
    this.minutes = minutes;
    this.heures = heures;
    this.tempsEnSecondes = function () {
        return this.heures * 3600 + this.minutes * 60 + this.secondes;
    }
}

/**
 *
 * Liste des références vers les éléments du DOM
 */
const imgPaysRef = document.getElementById('img-pays');
const listePaysRef = document.getElementById('liste-pays');
const btnValiderRef = document.getElementById('btn-valider');
const btnSaveConfigRef = document.getElementById('btn-save-config');
const inputHeuresRef = document.getElementById('input-heures');
const inputMinutesRef = document.getElementById('input-minutes');
const inputSecondesRef = document.getElementById('input-secondes');
const inputNbPaysRef = document.getElementById('input-nb-pays');
const imgCloseConfigLayerRef = document.getElementById('close-img');
const imgOpenConfigLayerRef = document.getElementById('open-settings-img');
const layerRef = document.getElementById('layer');
const wrapperRef = document.getElementById('wrapper');
const divChronoRef = document.getElementById('chrono');

/**
 * Mise en place de quelques écouteurs
 */
imgCloseConfigLayerRef.addEventListener('click', function () {
    layerRef.hidden = true;
    wrapperRef.classList.remove('blur');
});

imgOpenConfigLayerRef.addEventListener('click', function () {
    layerRef.hidden = false;
    wrapperRef.classList.add('blur');
});

btnSaveConfigRef.addEventListener('click', function () {
    const H = inputHeuresRef.value;
    const MN = inputMinutesRef.value;
    const S = inputSecondesRef.value;
    dureeJeu = new Time(H, MN, S);

    nbDrapeaux = inputNbPaysRef.value;
});

/**
 *
 * Configurations par défaut du jeu
 */
let dureeJeu = new Time(0, 2, 0);
let nbDrapeaux = 10;

/**
 * Met à jour la vue en fonction des données
 */
function placerDrapeaux(drapeaux, indiceDrapeauCourant) {
    listePaysRef.innerHTML = '';

    for (const drapeau of drapeaux) {
        const option = document.createElement('option');
        option.value = drapeaux.indexOf(drapeau);
        option.text = drapeau.pays;
        listePaysRef.appendChild(option);
    }

    imgPaysRef.src = drapeaux[indiceDrapeauCourant].imgSrc;
}

/**
 * Démarre et gère le jeu
 */
function demarrer() {
    let jeuEnCours = true;
    let drapeaux = tirerDrapeaux();
    let indiceDrapeauCourant = indiceAleatoire(drapeaux);
    let time = new Time();
    let nbReponsesCorrectes = 0;

    placerDrapeaux(drapeaux, indiceDrapeauCourant);

    const gameInterval = setInterval(function () {
        if (!jeuEnCours) {
            terminer();
            return;
        }

        time.secondes++;
        if (time.secondes > 59) {
            time.secondes = 0;
            time.minutes++;
        }
        if (time.minutes > 59) {
            time.minutes = 0;
            time.heures++;
        }

        mettreAJourChrono(time);

        if (time.tempsEnSecondes() >= dureeJeu.tempsEnSecondes()) {
            console.log('Le jeu est terminé');
            jeuEnCours = false;
        }
    }, 1000);

    let btnValiderClickHandler = function () {
        if(!jeuEnCours) {
            terminer();
            return;
        }

        const indiceDrapeauChoisi = parseInt(listePaysRef.value);

        if (indiceDrapeauChoisi === indiceDrapeauCourant) {
            nbReponsesCorrectes++;
            console.log('Bonne réponse');
        } else {
            console.log('Mauvaise réponse');
        }

        drapeaux.splice(indiceDrapeauCourant, 1);
        indiceDrapeauCourant = indiceAleatoire(drapeaux);
        if (indiceDrapeauCourant !== -1) {
            placerDrapeaux(drapeaux, indiceDrapeauCourant);

        } else {
            jeuEnCours = false;
        }
    };

    btnValiderRef.addEventListener('click', btnValiderClickHandler);

    /**
     * Arret du jeu
     */
    const terminer = function () {
        clearInterval(gameInterval);
        btnValiderRef.removeEventListener('click', btnValiderClickHandler);

        if(confirm('Le jeu est terminé. Voulez vous rejouer ?')) {
            demarrer();
        } else {
            //Eventuel message de aurevoir
        }
    }
}

/**
 * Génère un indice aléatoire appartenant au tableau
 * retourne -1 si le tableau est vide
 */
function indiceAleatoire(arr) {
    return arr.length > 0 ? Math.floor(Math.random() * arr.length) : -1;
}

/**
 * Met à jour le chronomètre affiché
 */
function mettreAJourChrono (time) {
    divChronoRef.innerText = `${time.heures}H ${time.minutes}mn ${time.secondes}s`
}

/**
 * Fonction qui tire un tableau de drapeux aléatoires
 * en fonction du nombre de drapeaux du jeu
 */
function tirerDrapeaux() {
    let lDrapeaux = DRAPEAUX.slice();
    let tirage = [];
    while (tirage.length < nbDrapeaux) {
        let randomIndex = indiceAleatoire(lDrapeaux);
        tirage.push(lDrapeaux[randomIndex]);
        lDrapeaux.splice(randomIndex, 1);
    }
    return tirage;
}

/**
 * Lance une premiere
 */
demarrer();

/*
function replaceAll(haystack, needle, replace) {
    return haystack.split(needle).join(replace);
}*/
