// Prendere il nostro elemento canvas tramite querySelector
const canvas = document.querySelector('canvas');
console.log(canvas);


// Darli altezza e larghezza
canvas.width = 1024;
canvas.height = 576;


// Creare un contesto dentro canvas e scegliere l'opzione 2d 
const context = canvas.getContext('2d');
console.log(context);


// Riempire il nostro contesto con larghezza e altezza della nostro canvas, 0 sta per i margini 
context.fillStyle = 'red';
context.fillRect(0, 0, canvas.width, canvas.height);

// Creare array per pushare il nostro ciclo e righe
const collisionsMap = [];

                                            // 70 perchè la nostra mappa è lunga 70 tiles, si può vedere in Tiled, Map, Resize Map.
for (let index = 0; index < collisions.length; index += 70) {
                // primo argomento = quali elementi vuoi tagliare via (0)
                // secondo argomento = fino a quanto vuoi tagliare vi aquesti elementi (fino a 70 - ogni riga)
    collisionsMap.push(collisions.slice( index , 70 + index ));
                // i = 0 fino a 70, per la seconda iterazione partira da i = 70 fino a 70 + i, quindi 70 = 70, quindi seconda riga da 70 a 140
                // terza riga i = 140, fino a 140 ??
}
console.log(collisionsMap);


// Creaiamo un class Boundary per non far camminare il nostro player dove non vogliamo (Creiamo un oggetto)
class Boundary {
    constructor ({position}) {
        this.position = position,
        this.width = 48, // perchè le nostre tiles sono 12px ma abbiamo zoomato la mappa per 4 (400%), quindi 12x4 = 48
        this.height = 48 // perchè le nostre tiles sono 12px ma abbiamo zoomato la mappa per 4 (400%), quindi 12x4 = 48
    };

    // Creare un method
    draw() {
        context.fillStyle = 'red';
                        // Ha 4 argomenti (cordinata X, cordinata Y, larghezza, altezza)
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
        // non usiamo misure statiche ma le prendiamo dalla class Sprite position X & Y.
    }
}

const boundaries = [];
const offset = {
    x: -928,
    y: -1025,
};

                    // i = index della row 
collisionsMap.forEach( (row, i) => {
                // j = index dell'element
    row.forEach( (element, j) => {
        if (element === 1025) {
            console.log(element);
            boundaries.push( new Boundary({
                position: {
                    x: j * 48 + offset.x, 
                    y: i * 48 + offset.y
                }
            }));
        }
    });
});

console.log(boundaries);


// IMPORTANTE in Tiled dobbiamo esportare l'immagine con la percentuale adatta di come vogliamo far vedere il nostro gioco.
// Ad esempio, in questo caso la mia mapImg è stata esportata a 400% con la "Use current Zoom Level" checked.

const mapImg = new Image(); // Creare una nuova immagine per farla vedere sul nostro schermo
console.log(mapImg);

mapImg.src = './img/Clouds Island.png'; // salvare il suo src 

// Fare la stessa cosa per vedere l'immagine del nostro Player
const playerImg = new Image(); // Creare una nuova immagine per creare il nostro Giocatore
console.log(playerImg);

playerImg.src = './img/playerDown.png'; // salvare il suo src 

// onload significa: al caricamento di questa mapImg che è dentro a new Image,
// Allora fai questa funzione (disegna la nostra mappa sul context):
    // mapImg.onload = () => {
    //                    // ha 3 argomenti (variabile, cordinata X, cordinata Y)
    //     context.drawImage(mapImg, -928, -1025); // API NON prendere stringhe quindi noi l'abbiamo messa nella const variabile

    //     // Facciamo questa cosa perche noi come players abbiamo 4 omini per far si che sembrano in movimento
    //     context.drawImage(
    //         playerImg, // COSA 
    //         0, // DA CHE PUNTO VUOI PARTIRE, MARGINE 0
    //         0, // DA CHE ANGOLO VUOI PARTIRE, MARGINE 0
    //         playerImg.width / 4, // QUANTA LARGHEZZA VUOI TAGLIARE 
    //         playerImg.height, // QUANTA ALTEZZA VUOI TAGLIARE 
    //         canvas.width / 2 - (playerImg.width / 4) / 2, // DOVE VUOI POSIZIONARLO IN LARGHEZZA = 
    //                                                       // metà della canvas - il nostro player diviso per 4 (perchè erano 4 omini) diviso a sua volta per due per posizionarlo a metà
    //         canvas.height / 2 - playerImg.height / 2, // DOVE VUOI POSIZIONARLO IN ALTEZZA
    //         playerImg.width / 4, // RIDICHIARARE LA NOSTRA WIDTH 
    //         playerImg.height, // RIDICHIARARE LA NOSTRA HEIGHT
    //     );
    // };

// A sprite is a 2-dimensional image used in video games or animation. 
class Sprite {
            // Se aggiungi un oggetto dentro un argomento non dovrai preoccuparti di richiamare gli argomenti nell'ordine giusto 
    constructor({ position, velocity, image }) { 
        this.position =  position;
        this.image = image
        // this.mapImg = mapImg;
    };

    // Creare un method
    draw() {
        // IMPORTANTE la togliamo da 'onload' perchè tanto verranno disegnate comunque dato che le richiamiamo cosí tante volte in un loop
        // e per far si che vogliamo muovere la nostra mappa e player dobbiamo cambiare le cordinate
                        // Ha 3 argomenti (variabile, cordinata X, cordinata Y)
        context.drawImage(this.image, this.position.x, this.position.y); // API NON prendere stringhe quindi noi l'abbiamo messa nella const variabile
                                // non usiamo misure statiche ma le prendiamo dalla class Sprite position X & Y.
    };
};

// Per la nostra Mappa
const backgroundMap = new Sprite ({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: mapImg // È la constante variabile che abbiamo inizialmente per la nostra mappa
    // mapImg: mapImg
});

// Creare una constante Keys con tutte i pulsanti della nostra tastiera che vogliamo che scatenano l'evento.
const keys = {
    w: {
        pressed: false, // di default scriviamo che non sono premute
    },
    a: {
        pressed: false, // di default scriviamo che non sono premute
    },
    s: {
        pressed: false, // di default scriviamo che non sono premute
    },
    d: {
        pressed: false, // di default scriviamo che non sono premute
    },
}

// Aggiungere un animation loop per far si che se ci spostiamo cambiano le coordinate
function animate () {
    window.requestAnimationFrame(animate); // Per creare un loop
        backgroundMap.draw();

        boundaries.forEach(boundary => {
            boundary.draw();
        });
        // Facciamo questa cosa perche noi come players abbiamo 4 omini per far si che sembrano in movimento
        context.drawImage(
            playerImg, // COSA 
            0, // DA CHE PUNTO VUOI PARTIRE, MARGINE 0
            0, // DA CHE ANGOLO VUOI PARTIRE, MARGINE 0
            playerImg.width / 4, // QUANTA LARGHEZZA VUOI TAGLIARE 
            playerImg.height, // QUANTA ALTEZZA VUOI TAGLIARE 
            canvas.width / 2 - (playerImg.width / 4) / 2, // DOVE VUOI POSIZIONARLO IN LARGHEZZA = 
                                                            // metà della canvas - il nostro player diviso per 4 (perchè erano 4 omini) diviso a sua volta per due per posizionarlo a metà
            canvas.height / 2 - playerImg.height / 2, // DOVE VUOI POSIZIONARLO IN ALTEZZA
            playerImg.width / 4, // RIDICHIARARE LA NOSTRA WIDTH 
            playerImg.height, // RIDICHIARARE LA NOSTRA HEIGHT
        );
    if (keys.w.pressed && lastKey === 'w') {
        backgroundMap.position.y += 3
    }
    else if (keys.a.pressed && lastKey === 'a') {
        backgroundMap.position.x += 3
    }
    else if (keys.s.pressed && lastKey === 's') {
        backgroundMap.position.y -= 3
    }
    else if (keys.d.pressed && lastKey === 'd') {
        backgroundMap.position.x -= 3
    }
};
animate();

// variabile a stringa vuota per l'ultimo pulsante premuto,
// cosí se premiamo due pulsanti alla volta dobbiamo intercettare l'ultimo premuto e andare in quella direzione
let lastKey = '';

// Aggingere un AddEventListener per quando ci spostiamo con player
// Primo argomento evento scatenato (keydown = muovere player sopra sotto con tastiera)
// Secondo argomento arrown function (e) riguarda event0 (js default)
window.addEventListener('keydown', (e) => {
    // Fa vedere ciò che premiamo sulla nostra tastiera e ciò che vogliamo premere/usare per comandare il nostro player
    switch (e.key) {
        case 'w':
            keys.w.pressed = true,
            lastKey = 'w'
            break;
        case 'a':
            keys.a.pressed = true,
            lastKey = 'a'
            break;
        case 's':
            keys.s.pressed = true,
            lastKey = 's'
            break;
        case 'd':
            keys.d.pressed = true,
            lastKey = 'd'
            break;

        default:
            break;
    }
});

// Facciamo keyup cosi quando non premiamo più il pulsante sulla nostra tastiera allora ritorna a false
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false, 
            console.log('pressed w');
            break;
        case 'a':
            keys.a.pressed = false,
            console.log('pressed a');
            break;
        case 's':
            keys.s.pressed = false,
            console.log('pressed s');
            break;
        case 'd':
            keys.d.pressed = false,
            console.log('pressed d');
            break;

        default:
            break;
    }
});

console.log(collisions);