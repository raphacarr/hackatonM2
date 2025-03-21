// main.js - Gestion de l'animation de chargement et des interactions de la page d'accueil

document.addEventListener('DOMContentLoaded', () => {
    // Animation de chargement
    const loadingScreen = document.getElementById('loading-screen');
    
    // Vérifier si nous sommes sur la page d'accueil ou la page de jeu
    const isGamePage = window.location.pathname.includes('jeu.html');
    
    if (!isGamePage && loadingScreen) {
        const foodItems = document.querySelectorAll('.food-item');
        
        // Animer les éléments alimentaires pendant le chargement
        foodItems.forEach((item, index) => {
            gsap.to(item, {
                y: -20,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: index * 0.2
            });
        });
        
        // Simuler un temps de chargement (en pratique, vous attendriez que toutes les ressources soient chargées)
        setTimeout(() => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    animatePageElements();
                }
            });
        }, 2500);
    } else if (isGamePage) {
        // Initialisation spécifique à la page de jeu
        setupGamePageInteractions();
    } else {
        // Si loadingScreen n'existe pas, appeler directement animatePageElements
        animatePageElements();
    }
    
    // Animation des éléments de la page après le chargement
    function animatePageElements() {
        // Animation du titre et du texte de la section héro
        gsap.from('.hero-text h2', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.3
        });
        
        gsap.from('.hero-text p', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.6
        });
        
        gsap.from('.hero-text .cta-button', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.9
        });
        
        // Configurer les animations de défilement
        setupScrollAnimations();
    }
    
    // Configurer les animations basées sur le défilement
    function setupScrollAnimations() {
        // Enregistrer le plugin ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Animation de la section de prévention
        gsap.from('#prevention h2', {
            scrollTrigger: {
                trigger: '#prevention',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
        
        gsap.from('.prevention-text', {
            scrollTrigger: {
                trigger: '.prevention-text',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 1,
            delay: 0.3
        });
        
        gsap.from('.prevention-image', {
            scrollTrigger: {
                trigger: '.prevention-image',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 50,
            duration: 1,
            delay: 0.3
        });
        
        // Animation de la section de ressources
        gsap.from('#ressources h2', {
            scrollTrigger: {
                trigger: '#ressources',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
        
        gsap.from('.ressource-card', {
            scrollTrigger: {
                trigger: '.ressources-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2
        });
        
        // Animation de la section de jeu
        gsap.from('#jeu h2', {
            scrollTrigger: {
                trigger: '#jeu',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
        
        gsap.from('.game-intro', {
            scrollTrigger: {
                trigger: '.game-intro',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.3
        });
        
        gsap.from('.game-instructions', {
            scrollTrigger: {
                trigger: '.game-instructions',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.6
        });
    }
    
    // Initialisation spécifique à la page de jeu
    function setupGamePageInteractions() {
        console.log("Initialisation de la page de jeu");
        
        // Récupérer les éléments de la page de jeu
        const startButton = document.getElementById('start-button');
        const playButton = document.getElementById('play-button');
        const restartButton = document.getElementById('restart-button');
        const instructionsScreen = document.querySelector('.game-instructions');
        const startScreen = document.getElementById('start-screen');
        const gameContainer = document.getElementById('game-container');
        const gameOverScreen = document.getElementById('game-over-screen');
        
        // Vérifier que les éléments existent
        if (!startButton || !playButton || !gameContainer) {
            console.error("Éléments de jeu manquants dans le DOM");
            return;
        }
        
        // Gestionnaire pour le bouton "Commencer à jouer"
        startButton.addEventListener('click', () => {
            console.log("Bouton Commencer à jouer cliqué");
            instructionsScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
        });
        
        // Gestionnaire pour le bouton "Jouer"
        playButton.addEventListener('click', () => {
            console.log("Bouton Jouer cliqué");
            startScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            
            // S'assurer que le conteneur de jeu est visible
            gameContainer.style.display = 'block';
            
            // Démarrer le jeu si la fonction existe
            if (typeof initGame === 'function') {
                console.log("Initialisation du jeu...");
                initGame();
            } else {
                console.error("La fonction initGame n'existe pas");
            }
        });
        
        // Gestionnaire pour le bouton "Rejouer"
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                console.log("Bouton Rejouer cliqué");
                gameOverScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                
                // Redémarrer le jeu si la fonction existe
                if (typeof restartGame === 'function') {
                    console.log("Redémarrage du jeu...");
                    restartGame();
                } else {
                    console.error("La fonction restartGame n'existe pas");
                }
            });
        }
    }
    
    // Navigation mobile
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');
        
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Burger Animation
            burger.classList.toggle('toggle');
        });
    };
    
    navSlide();
    
    // Défilement fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset pour la barre de navigation
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                const nav = document.querySelector('.nav-links');
                const burger = document.querySelector('.burger');
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    
                    document.querySelectorAll('.nav-links li').forEach(link => {
                        link.style.animation = '';
                    });
                }
            }
        });
    });
    
    // Intégration avec le jeu
    const startButton = document.getElementById('start-button');
    if (startButton) {
        const gameInstructions = document.getElementById('game-instructions');
        const startScreen = document.getElementById('start-screen');
        const gameContainer = document.getElementById('game-container');
        
        // Nous utilisons un seul gestionnaire d'événements pour le bouton de démarrage
        // qui affiche l'écran de démarrage du jeu
        startButton.addEventListener('click', () => {
            gameInstructions.classList.add('hidden');
            startScreen.classList.remove('hidden');
        });
        
        // Gestionnaire pour le bouton "play" qui démarre effectivement le jeu
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                startScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                
                // Démarrer le jeu (cette fonction doit exister dans game.js)
                if (typeof startGame === 'function') {
                    startGame();
                }
            });
        }
        
        // Gestionnaire pour le bouton "restart"
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                if (typeof restartGame === 'function') {
                    restartGame();
                }
            });
        }
    }
});
