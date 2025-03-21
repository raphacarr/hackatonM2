// game.js - Main game logic for Poubelle Panic

// Fonction d'initialisation explicite pour le jeu
function initGame() {
    console.log("Initialisation du jeu depuis la fonction initGame");
    
    // Réinitialiser les variables de jeu
    score = 0;
    wasteItems = [];
    itemsInScene = 0;
    
    // Mettre à jour l'affichage du score
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    // Initialiser les sons
    initSounds();
    
    // Initialiser la scène 3D
    init();
    
    // Ajouter les poubelles
    createBins();
    
    // Ajouter les conteneurs (frigo et placard)
    createContainers();
    
    // Ajouter les gestionnaires d'événements
    addEventListeners();
    
    // Démarrer le jeu
    startGame();
}

// Fonction pour redémarrer le jeu
function restartGame() {
    console.log("Redémarrage du jeu");
    
    // Nettoyer la scène
    cleanupScene();
    
    // Réinitialiser les variables
    score = 0;
    wasteItems = [];
    itemsInScene = 0;
    
    // Mettre à jour l'affichage du score
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    // Recréer les poubelles
    createBins();
    
    // Recréer les conteneurs
    createContainers();
    
    // Activer le jeu
    gameActive = true;
    
    // Masquer l'écran de fin de jeu
    if (gameOverScreen) {
        gameOverScreen.classList.add('hidden');
    }
    
    // Afficher le conteneur de jeu
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.classList.remove('hidden');
    }
}

// Fonction pour nettoyer la scène
function cleanupScene() {
    // Supprimer tous les objets de la scène sauf la caméra et les lumières
    while(scene.children.length > 0) { 
        const object = scene.children[0];
        if (object.type === 'PerspectiveCamera' || object.type === 'AmbientLight' || object.type === 'DirectionalLight') {
            scene.children.shift(); // Passer au prochain objet sans supprimer
        } else {
            scene.remove(object); 
        }
    }
}

// Game variables
let scene, camera, renderer;
let wasteItems = [];
let bins = [];
let score = 0;
let gameActive = false;
let gameWidth = 10; // Width of the playable area
let lastTime = 0;
let spawnInterval = 3000; // Time in ms between waste spawns
let lastSpawnTime = 0;
let draggedItem = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let dragOffset = new THREE.Vector3();
let itemsInScene = 0;
let maxItems = 1; // Limiter à un seul objet à la fois
let selectedItemIndex = -1; // Index of the currently selected item with keyboard
let keyboardControlSpeed = 0.2; // Speed of keyboard movement

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const instructionsElement = document.getElementById('game-instructions');

// Sound effects
const sounds = {
    goodPlacement: null,
    badPlacement: null,
    gameOver: null
};

// Initialize sound effects
function initSounds() {
    console.log("Initialisation des sons...");
    
    // Créer des objets Audio pour chaque son
    try {
        // Utiliser des chemins relatifs pour les sons
        sounds = {
            goodPlacement: new Audio('sounds/good_catch.mp3'),
            badPlacement: new Audio('sounds/bad_catch.mp3'),
            gameOver: new Audio('sounds/game_over.mp3')
        };
        
        // Précharger les sons
        for (const [key, sound] of Object.entries(sounds)) {
            sound.addEventListener('canplaythrough', () => {
                console.log(`Son ${key} chargé avec succès.`);
            });
            
            sound.addEventListener('error', (e) => {
                console.error(`Le fichier audio ${key} n'a pas pu être chargé.`, e);
                // Créer un son de remplacement silencieux
                sounds[key] = {
                    play: function() { 
                        console.log(`Lecture silencieuse de ${key} (son non disponible)`);
                    }
                };
            });
            
            // Définir le volume
            sound.volume = 0.5;
            
            // Forcer le préchargement
            sound.load();
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation des sons:", error);
        // Créer des sons silencieux en cas d'erreur
        sounds = {
            goodPlacement: { play: function() { console.log("Son silencieux (goodPlacement)"); } },
            badPlacement: { play: function() { console.log("Son silencieux (badPlacement)"); } },
            gameOver: { play: function() { console.log("Son silencieux (gameOver)"); } }
        };
    }
}

// Play a sound effect
function playSound(type) {
    console.log(`Playing ${type} sound`);
    
    // Utiliser un feedback visuel à la place des sons
    if (type === 'goodPlacement') {
        showFeedback("Bien joué !", 0x2ecc71);
    } else if (type === 'badPlacement') {
        showFeedback("Erreur !", 0xe74c3c);
    }
    
    // Tenter de jouer le son si disponible
    if (sounds[type]) {
        try {
            // Créer une nouvelle instance pour éviter les problèmes de lecture multiple
            const sound = sounds[type];
            sound.play().catch(err => {
                console.log(`Error playing sound: ${err.message}`);
            });
        } catch (e) {
            console.log(`Error playing sound: ${e.message}`);
        }
    }
}

// Initialize the game scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    scene.fog = new THREE.Fog(0x87CEEB, 20, 100); // Add fog for depth
    
    // Create camera avec une position ajustée pour mieux voir les poubelles
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 14); // Position ajustée (plus haute et plus éloignée)
    camera.lookAt(0, 0, 0); // Regarder au centre de la scène
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    renderer.outputEncoding = THREE.sRGBEncoding; // Better color rendering
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Cinematic look
    renderer.toneMappingExposure = 1.2; // Brighter scene
    
    // Récupérer le conteneur du jeu et vider son contenu
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        // Vider le conteneur existant
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
        
        // Ajouter le renderer au conteneur
        gameContainer.appendChild(renderer.domElement);
        console.log("Renderer ajouté au DOM");
    } else {
        console.error("Conteneur de jeu introuvable");
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.bias = -0.001;
    scene.add(directionalLight);
    
    // Add a secondary light for better illumination
    const fillLight = new THREE.DirectionalLight(0xffffcc, 0.4);
    fillLight.position.set(-10, 15, 5);
    scene.add(fillLight);
    
    // Add a subtle blue backlight
    const backLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);
    
    // Create ground
    const ground = createGround();
    scene.add(ground);
    
    // Create city background
    const cityBackground = createCityBackground();
    scene.add(cityBackground);
    
    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    
    // Le bouton start est géré par main.js
    // Nous gérons uniquement le bouton restart ici
    restartButton.addEventListener('click', restartGame);
}

// Create all bins
function createBins() {
    // Créer les poubelles avec une taille plus grande
    const binScale = 2.0; // Facteur d'échelle pour agrandir davantage les poubelles
    
    // Calculer les positions pour centrer les poubelles
    const spacing = 3.0; // Espacement entre les poubelles augmenté
    const startX = -2 * spacing; // Position de départ pour centrer
    
    // Créer les poubelles
    const blueBin = createBin('blue', 'non-recyclable');
    blueBin.position.set(startX, 0, 0); // Avancer encore plus les poubelles (z = 0)
    blueBin.scale.set(binScale, binScale, binScale); // Agrandir davantage
    scene.add(blueBin);
    bins.push(blueBin);
    
    const yellowBin = createBin('yellow', 'recyclable');
    yellowBin.position.set(startX + spacing, 0, 0);
    yellowBin.scale.set(binScale, binScale, binScale);
    scene.add(yellowBin);
    bins.push(yellowBin);
    
    const brownBin = createBin('brown', 'food-waste');
    brownBin.position.set(startX + 2 * spacing, 0, 0);
    brownBin.scale.set(binScale, binScale, binScale);
    scene.add(brownBin);
    bins.push(brownBin);
    
    // Créer le frigo et le placard
    const fridge = createContainer('fridge');
    fridge.position.set(startX + 3 * spacing, 0, 0);
    fridge.scale.set(binScale, binScale, binScale);
    scene.add(fridge);
    bins.push(fridge);
    
    const cabinet = createContainer('cabinet');
    cabinet.position.set(startX + 4 * spacing, 0, 0);
    cabinet.scale.set(binScale, binScale, binScale);
    scene.add(cabinet);
    bins.push(cabinet);
}

// Fonction pour créer les conteneurs (frigo et placard)
function createContainers() {
    console.log("Création des conteneurs (frigo et placard)");
    
    // Créer le frigo (pour aliments frais)
    const fridgeGeometry = new THREE.BoxGeometry(1.2, 2, 1);
    const fridgeMaterial = new THREE.MeshPhongMaterial({ color: 0xecf0f1 });
    const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
    fridge.position.set(3, 1, -3);
    fridge.userData = { type: 'container', containerType: 'fridge', acceptedTypes: ['food'], acceptedFoodTypes: ['fresh'] };
    
    // Ajouter une porte au frigo
    const doorGeometry = new THREE.BoxGeometry(1.1, 1.9, 0.1);
    const doorMaterial = new THREE.MeshPhongMaterial({ color: 0xbdc3c7 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0, 0.5);
    fridge.add(door);
    
    // Ajouter une poignée
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x7f8c8d });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(-0.4, 0, 0.6);
    fridge.add(handle);
    
    // Ajouter un texte "Frigo"
    const fridgeLabel = createTextLabel("Frigo", 0x2ecc71);
    fridgeLabel.position.set(0, 1.5, 0);
    fridge.add(fridgeLabel);
    
    scene.add(fridge);
    bins.push(fridge);
    
    // Créer le placard (pour aliments non-périssables)
    const cabinetGeometry = new THREE.BoxGeometry(1.2, 1.5, 1);
    const cabinetMaterial = new THREE.MeshPhongMaterial({ color: 0xd35400 });
    const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
    cabinet.position.set(5, 0.75, -3);
    cabinet.userData = { type: 'container', containerType: 'cabinet', acceptedTypes: ['food'], acceptedFoodTypes: ['non-perishable'] };
    
    // Ajouter une porte au placard
    const cabinetDoorGeometry = new THREE.BoxGeometry(1.1, 1.4, 0.1);
    const cabinetDoorMaterial = new THREE.MeshPhongMaterial({ color: 0xe67e22 });
    const cabinetDoor = new THREE.Mesh(cabinetDoorGeometry, cabinetDoorMaterial);
    cabinetDoor.position.set(0, 0, 0.5);
    cabinet.add(cabinetDoor);
    
    // Ajouter une poignée
    const cabinetHandleGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const cabinetHandleMaterial = new THREE.MeshPhongMaterial({ color: 0x7f8c8d });
    const cabinetHandle = new THREE.Mesh(cabinetHandleGeometry, cabinetHandleMaterial);
    cabinetHandle.position.set(-0.4, 0, 0.6);
    cabinet.add(cabinetHandle);
    
    // Ajouter un texte "Placard"
    const cabinetLabel = createTextLabel("Placard", 0xe67e22);
    cabinetLabel.position.set(0, 1.2, 0);
    cabinet.add(cabinetLabel);
    
    scene.add(cabinet);
    bins.push(cabinet);
}

// Fonction pour créer un label texte
function createTextLabel(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    // Fond transparent
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Texte
    context.font = 'Bold 24px Arial';
    context.textAlign = 'center';
    context.fillStyle = '#' + color.toString(16).padStart(6, '0');
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Créer une texture à partir du canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    // Ajuster l'échelle du sprite
    sprite.scale.set(2, 1, 1);
    
    return sprite;
}

// Create a bin with the specified color and type
function createBin(color, binType) {
    const colors = {
        'blue': 0x3498db,
        'yellow': 0xf1c40f,
        'brown': 0x8b4513
    };
    
    const binColor = colors[color] || 0xcccccc;
    
    // Créer le corps de la poubelle
    const binGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const binMaterial = new THREE.MeshPhongMaterial({ color: binColor });
    const bin = new THREE.Mesh(binGeometry, binMaterial);
    
    // Créer le couvercle
    const lidGeometry = new THREE.BoxGeometry(1.1, 0.1, 1.1);
    const lidMaterial = new THREE.MeshPhongMaterial({ color: binColor });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.set(0, 0.8, 0);
    
    // Groupe pour la poubelle complète
    const binGroup = new THREE.Group();
    binGroup.add(bin);
    binGroup.add(lid);
    
    // Ajouter une étiquette
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 20px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(binType, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 0.5, 1);
    sprite.position.set(0, 1.2, 0.6);
    binGroup.add(sprite);
    
    // Ajouter des propriétés pour l'identification
    binGroup.userData = { type: 'bin', binType: binType };
    
    return binGroup;
}

// Create a container (fridge or cabinet)
function createContainer(type) {
    let containerGeometry, containerMaterial, containerGroup;
    
    if (type === 'fridge') {
        // Créer un frigo
        containerGeometry = new THREE.BoxGeometry(1.2, 2, 1.2);
        containerMaterial = new THREE.MeshPhongMaterial({ color: 0x95a5a6 });
        containerGroup = new THREE.Group();
        
        const fridge = new THREE.Mesh(containerGeometry, containerMaterial);
        containerGroup.add(fridge);
        
        // Ajouter une poignée
        const handleGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0.7, 0, 0);
        containerGroup.add(handle);
        
        containerGroup.userData = { type: 'bin', binType: 'fridge' };
    } else {
        // Créer un placard
        containerGeometry = new THREE.BoxGeometry(1.5, 1.8, 1);
        containerMaterial = new THREE.MeshPhongMaterial({ color: 0xd35400 });
        containerGroup = new THREE.Group();
        
        const cabinet = new THREE.Mesh(containerGeometry, containerMaterial);
        containerGroup.add(cabinet);
        
        // Ajouter des étagères
        const shelfGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.9);
        const shelfMaterial = new THREE.MeshPhongMaterial({ color: 0xa04000 });
        
        for (let i = 0; i < 3; i++) {
            const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
            shelf.position.set(0, -0.6 + i * 0.6, 0);
            containerGroup.add(shelf);
        }
        
        containerGroup.userData = { type: 'bin', binType: 'cabinet' };
    }
    
    // Ajouter une étiquette
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 20px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(type, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 0.5, 1);
    sprite.position.set(0, 1.5, 0.6);
    containerGroup.add(sprite);
    
    return containerGroup;
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Keyboard handler
function onKeyDown(event) {
    if (!gameActive) return;
    
    // If no item is selected with keyboard, select the first one
    if (selectedItemIndex === -1 && wasteItems.length > 0) {
        selectedItemIndex = 0;
        highlightSelectedItem();
    } else if (wasteItems.length === 0) {
        return;
    }
    
    const selectedItem = wasteItems[selectedItemIndex];
    if (!selectedItem) return;
    
    switch(event.key) {
        case 'ArrowLeft':
            selectedItem.position.x -= keyboardControlSpeed;
            break;
        case 'ArrowRight':
            selectedItem.position.x += keyboardControlSpeed;
            break;
        case 'ArrowDown':
            selectedItem.position.z += keyboardControlSpeed;
            break;
        case 'ArrowUp':
            selectedItem.position.z -= keyboardControlSpeed;
            break;
        case 'Tab':
            // Select next item
            event.preventDefault();
            selectedItemIndex = (selectedItemIndex + 1) % wasteItems.length;
            highlightSelectedItem();
            break;
        case 'Enter':
        case ' ': // Space
            // Place the item in the nearest bin
            checkBinPlacement(selectedItem);
            selectedItemIndex = -1;
            break;
    }
}

// Highlight the currently selected item
function highlightSelectedItem() {
    // Remove highlight from all items
    wasteItems.forEach(item => {
        item.traverse(child => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        if (mat.emissive) mat.emissive.set(0x000000);
                    });
                } else if (child.material.emissive) {
                    child.material.emissive.set(0x000000);
                }
            }
        });
    });
    
    // Add highlight to selected item
    if (selectedItemIndex >= 0 && selectedItemIndex < wasteItems.length) {
        const selectedItem = wasteItems[selectedItemIndex];
        selectedItem.traverse(child => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        if (mat.emissive) mat.emissive.set(0x444444);
                    });
                } else if (child.material.emissive) {
                    child.material.emissive.set(0x444444);
                }
            }
        });
    }
}

// Mouse down handler
function onMouseDown(event) {
    if (!gameActive) return;
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(wasteItems, true);
    
    if (intersects.length > 0) {
        // Find the root object (the waste item)
        let selectedObject = intersects[0].object;
        while (selectedObject.parent && !wasteItems.includes(selectedObject)) {
            selectedObject = selectedObject.parent;
        }
        
        if (wasteItems.includes(selectedObject)) {
            draggedItem = selectedObject;
            
            // Calculate the offset from the intersection point to the object position
            const intersectionPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
            dragOffset.copy(draggedItem.position).sub(intersectionPoint);
            
            // Lift the item a bit when dragging
            draggedItem.position.y += 0.5;
            
            // Update selected item index for keyboard controls
            selectedItemIndex = wasteItems.indexOf(draggedItem);
            highlightSelectedItem();
        }
    }
}

// Mouse move handler
function onMouseMove(event) {
    if (!gameActive || !draggedItem) return;
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate the intersection with the drag plane
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
    
    // Mettre à jour seulement la position X de l'objet (mouvement horizontal uniquement)
    // Conserver les positions Y et Z d'origine
    const originalY = draggedItem.position.y;
    const originalZ = draggedItem.position.z;
    
    // Appliquer la nouvelle position X mais garder Y et Z
    draggedItem.position.x = intersectionPoint.x + dragOffset.x;
    draggedItem.position.y = originalY;
    draggedItem.position.z = originalZ;
}

// Mouse up handler
function onMouseUp() {
    if (!gameActive || !draggedItem) return;
    
    // Check if the item is over a bin
    checkBinPlacement(draggedItem);
    
    draggedItem = null;
}

// Touch start handler
function onTouchStart(event) {
    if (!gameActive) return;
    
    event.preventDefault();
    
    // Calculate touch position in normalized device coordinates (-1 to +1)
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(wasteItems, true);
    
    if (intersects.length > 0) {
        // Find the root object (the waste item)
        let selectedObject = intersects[0].object;
        while (selectedObject.parent && !wasteItems.includes(selectedObject)) {
            selectedObject = selectedObject.parent;
        }
        
        if (wasteItems.includes(selectedObject)) {
            draggedItem = selectedObject;
            
            // Calculate the offset from the intersection point to the object position
            const intersectionPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
            dragOffset.copy(draggedItem.position).sub(intersectionPoint);
            
            // Lift the item a bit when dragging
            draggedItem.position.y += 0.5;
            
            // Update selected item index for keyboard controls
            selectedItemIndex = wasteItems.indexOf(draggedItem);
            highlightSelectedItem();
        }
    }
}

// Touch move handler
function onTouchMove(event) {
    if (!gameActive || !draggedItem) return;
    
    event.preventDefault();
    
    // Calculate touch position in normalized device coordinates (-1 to +1)
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate the intersection with the drag plane
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
    
    // Mettre à jour seulement la position X de l'objet (mouvement horizontal uniquement)
    // Conserver les positions Y et Z d'origine
    const originalY = draggedItem.position.y;
    const originalZ = draggedItem.position.z;
    
    // Appliquer la nouvelle position X mais garder Y et Z
    draggedItem.position.x = intersectionPoint.x + dragOffset.x;
    draggedItem.position.y = originalY;
    draggedItem.position.z = originalZ;
}

// Touch end handler
function onTouchEnd() {
    if (!gameActive || !draggedItem) return;
    
    // Check if the item is over a bin
    checkBinPlacement(draggedItem);
    
    draggedItem = null;
}

// Check if an item is placed in the correct bin
function checkBinPlacement(item) {
    let closestBin = null;
    let closestDistance = Infinity;
    
    // Find the closest bin
    for (const bin of bins) {
        const distance = item.position.distanceTo(bin.position);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestBin = bin;
        }
    }
    
    // If the item is close enough to a bin
    if (closestDistance < 2) {
        // Check if it's the correct bin
        const isCorrectBin = isCorrectPlacement(item, closestBin);
        
        if (isCorrectBin) {
            // Correct placement
            score += item.userData.points;
            playSound('goodPlacement');
            showFeedback("Correct ! +" + item.userData.points + " points", 0x2ecc71);
        } else {
            // Incorrect placement
            score -= 10;
            playSound('badPlacement');
            showFeedback("Mauvais bac ! -10 points", 0xe74c3c);
        }
        
        // Update score
        updateScore();
        
        // Remove the item
        removeWasteItem(item);
        
        // Check for game over
        if (score < 0) {
            gameOver();
        }
    } else {
        // Item wasn't placed in any bin, return it to its original position
        item.position.y = 1;
    }
}

// Check if an item is placed in the correct bin
function isCorrectPlacement(item, bin) {
    // Si l'item n'a pas de userData ou le bin n'a pas de userData, retourner false
    if (!item.userData || !bin.userData) return false;
    
    // Vérifier le type d'item et le type de bin
    if (item.userData.type === 'waste') {
        // Pour les déchets
        if (item.userData.wasteType === 'recyclable' && bin.userData.binType === 'recyclable') {
            return true;
        } else if (item.userData.wasteType === 'non-recyclable' && bin.userData.binType === 'non-recyclable') {
            return true;
        } else if (item.userData.wasteType === 'food-waste' && bin.userData.binType === 'food-waste') {
            return true;
        }
    } else if (item.userData.type === 'food') {
        // Pour les aliments
        if (item.userData.foodType === 'fresh' && bin.userData.binType === 'fridge') {
            return true;
        } else if (item.userData.foodType === 'non-perishable' && bin.userData.binType === 'cabinet') {
            return true;
        }
    }
    
    // Si aucune condition n'est remplie, le placement est incorrect
    return false;
}

// Show feedback text
function showFeedback(text, color) {
    // Create a canvas texture for the feedback text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // Create a gradient background for the feedback
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    
    // Draw rounded rectangle background
    context.fillStyle = gradient;
    roundRect(context, 10, 10, canvas.width - 20, canvas.height - 20, 20, true);
    
    // Add a border
    context.strokeStyle = '#' + color.toString(16).padStart(6, '0');
    context.lineWidth = 4;
    roundRect(context, 10, 10, canvas.width - 20, canvas.height - 20, 20, false, true);
    
    // Draw text
    context.font = 'Bold 36px Poppins, Arial';
    context.textAlign = 'center';
    context.fillStyle = '#' + color.toString(16).padStart(6, '0');
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 12);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
    });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.set(0, 6, 0);
    sprite.scale.set(8, 2, 1);
    scene.add(sprite);
    
    // Add animation effect
    let opacity = 1;
    const fadeOut = () => {
        opacity -= 0.02;
        if (opacity <= 0) {
            scene.remove(sprite);
            return;
        }
        
        material.opacity = opacity;
        requestAnimationFrame(fadeOut);
    };
    
    // Start fade out after 1.5 seconds
    setTimeout(() => {
        fadeOut();
    }, 1500);
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

// Update instructions
function updateInstructions() {
    // Cette fonction n'est plus nécessaire car les instructions sont dans le HTML
    console.log("Instructions mises à jour");
}

// Start the game
function startGame() {
    console.log("Démarrage du jeu");
    
    // Activer le jeu
    gameActive = true;
    
    // Démarrer l'animation
    animate(0);
    
    // Démarrer le spawn des objets
    spawnInterval = setInterval(() => {
        if (gameActive && itemsInScene < maxItems) {
            spawnWasteItem();
        }
    }, 3000);
}

// Spawn waste items
function spawnWasteItem() {
    if (!gameActive || itemsInScene >= maxItems) return;
    
    // Créer un nouvel objet déchet
    const wasteType = getRandomWasteType();
    const wasteItem = createWasteItem(wasteType);
    
    // Ajouter l'objet à la scène
    scene.add(wasteItem);
    wasteItems.push(wasteItem);
    itemsInScene++;
    
    console.log(`Objet créé: ${wasteType.name}, Total: ${itemsInScene}`);
}

// Game over
function gameOver() {
    gameActive = false;
    
    // Jouer le son de fin de jeu
    playSound('gameOver');
    
    // Afficher le message de fin de jeu
    const gameOverDiv = document.getElementById('game-over');
    const finalScoreSpan = document.getElementById('final-score');
    
    if (gameOverDiv && finalScoreSpan) {
        finalScoreSpan.textContent = score;
        gameOverDiv.style.display = 'flex';
    } else {
        console.error("Game over elements not found in the DOM");
        
        // Créer dynamiquement l'écran de fin si les éléments n'existent pas
        const newGameOverDiv = document.createElement('div');
        newGameOverDiv.id = 'game-over';
        newGameOverDiv.style.position = 'absolute';
        newGameOverDiv.style.top = '0';
        newGameOverDiv.style.left = '0';
        newGameOverDiv.style.width = '100%';
        newGameOverDiv.style.height = '100%';
        newGameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        newGameOverDiv.style.color = 'white';
        newGameOverDiv.style.display = 'flex';
        newGameOverDiv.style.flexDirection = 'column';
        newGameOverDiv.style.justifyContent = 'center';
        newGameOverDiv.style.alignItems = 'center';
        newGameOverDiv.style.zIndex = '1000';
        
        const gameOverTitle = document.createElement('h2');
        gameOverTitle.textContent = 'Game Over';
        gameOverTitle.style.fontSize = '3rem';
        gameOverTitle.style.marginBottom = '1rem';
        
        const scoreText = document.createElement('p');
        scoreText.innerHTML = `Score final: <span id="final-score">${score}</span>`;
        scoreText.style.fontSize = '2rem';
        scoreText.style.marginBottom = '2rem';
        
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Rejouer';
        restartBtn.style.padding = '1rem 2rem';
        restartBtn.style.fontSize = '1.5rem';
        restartBtn.style.backgroundColor = '#2ecc71';
        restartBtn.style.color = 'white';
        restartBtn.style.border = 'none';
        restartBtn.style.borderRadius = '5px';
        restartBtn.style.cursor = 'pointer';
        
        restartBtn.addEventListener('click', restartGame);
        
        newGameOverDiv.appendChild(gameOverTitle);
        newGameOverDiv.appendChild(scoreText);
        newGameOverDiv.appendChild(restartBtn);
        
        document.body.appendChild(newGameOverDiv);
    }
    
    // Arrêter le spawn d'objets
    clearInterval(spawnInterval);
}

// Update the score display
function updateScore() {
    scoreElement.textContent = score;
}

// Animation loop
function animate(time) {
    requestAnimationFrame(animate);
    
    const deltaTime = time - lastTime;
    lastTime = time;
    
    if (gameActive) {
        // Spawn new items only when there are no items in the scene
        if (time - lastSpawnTime > spawnInterval && itemsInScene === 0) {
            lastSpawnTime = time;
            spawnWasteItem();
            
            // Gradually decrease spawn interval (increase difficulty)
            spawnInterval = Math.max(1500, spawnInterval - 50);
        }
        
        // Update waste items
        wasteItems.forEach(waste => {
            if (waste !== draggedItem) {
                // Move downward slower
                waste.position.y -= 0.005; // Ralentir encore plus la chute
                
                // Ajouter une légère rotation pour l'intérêt visuel
                waste.rotation.y += 0.005;
                
                // Check if item has fallen below the ground
                if (waste.position.y < -2) {
                    // If it was a good item, penalize player
                    if (waste.userData && (waste.userData.type === 'recyclable' || 
                                          waste.userData.type === 'fresh-food' || 
                                          waste.userData.type === 'non-perishable')) {
                        score -= 5;
                        updateScore();
                        showFeedback("Objet perdu ! -5 points", 0xe74c3c);
                        
                        // Check for game over
                        if (score < 0) {
                            gameOver();
                        }
                    }
                    
                    // Remove the item
                    removeWasteItem(waste);
                }
            }
        });
    }
    
    renderer.render(scene, camera);
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    initGame();
});
