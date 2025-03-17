// Giandra Photos - Galerie d'Art & Photographie JavaScript

// Éléments DOM
const themeToggle = document.getElementById('themeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const topNav = document.querySelector('.top-nav');
const budgetSlider = document.getElementById('budgetSlider');
const budgetValue = document.getElementById('budgetValue');
const styleOptions = document.querySelectorAll('.style-option');
const colorOptions = document.querySelectorAll('.color-option');
const spaceOptions = document.querySelectorAll('.space-option');
const findArtButton = document.querySelector('.find-art-button');
const eventRsvpButtons = document.querySelectorAll('.event-rsvp-button');
const eventSaveButtons = document.querySelectorAll('.event-save-button');

// Bascule de Thème
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('giandra-theme', newTheme);
  });
}

// Bascule du Menu Mobile
if (mobileMenuToggle && topNav) {
  mobileMenuToggle.addEventListener('click', () => {
    topNav.classList.toggle('show-mobile');
    mobileMenuToggle.classList.toggle('active');
  });
}

// Curseur de Budget
if (budgetSlider && budgetValue) {
  budgetSlider.addEventListener('input', () => {
    budgetValue.textContent = `${budgetSlider.value}€`;
  });
}

// Options de Style
if (styleOptions.length > 0) {
  styleOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Supprimer la classe active de toutes les options
      styleOptions.forEach(opt => opt.classList.remove('active'));
      // Ajouter la classe active à l'option cliquée
      option.classList.add('active');
    });
  });
}

// Options de Couleur
if (colorOptions.length > 0) {
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Supprimer la classe active de toutes les options
      colorOptions.forEach(opt => opt.classList.remove('active'));
      // Ajouter la classe active à l'option cliquée
      option.classList.add('active');
    });
  });
}

// Options d'Espace
if (spaceOptions.length > 0) {
  spaceOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Supprimer la classe active de toutes les options
      spaceOptions.forEach(opt => opt.classList.remove('active'));
      // Ajouter la classe active à l'option cliquée
      option.classList.add('active');
    });
  });
}

// Bouton Trouver l'Art
if (findArtButton) {
  findArtButton.addEventListener('click', () => {
    // Obtenir les options sélectionnées
    const selectedStyle = document.querySelector('.style-option.active')?.dataset.style || 'all';
    const selectedColor = document.querySelector('.color-option.active')?.dataset.color || 'all';
    const selectedSpace = document.querySelector('.space-option.active')?.dataset.space || 'home';
    const selectedBudget = budgetSlider ? budgetSlider.value : 750;
    
    // Pour démonstration, montrer ce qui a été sélectionné
    console.log('Recherche d\'art avec:', {
      style: selectedStyle,
      couleur: selectedColor,
      espace: selectedSpace,
      budget: selectedBudget
    });
    
    // Dans une mise en œuvre réelle, cela déclencherait probablement un appel API
    // ou naviguerait vers une page de résultats avec les filtres sélectionnés
    alert(`Recherche de votre œuvre d'art parfaite !\nStyle: ${selectedStyle}\nPalette de Couleurs: ${selectedColor}\nEspace: ${selectedSpace}\nBudget: ${selectedBudget}€`);
  });
}

// Boutons RSVP d'Événement
if (eventRsvpButtons.length > 0) {
  eventRsvpButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const eventCard = event.target.closest('.event-card');
      const eventTitle = eventCard.querySelector('h3').textContent;
      
      // Dans une mise en œuvre réelle, cela ouvrirait une modal ou naviguerait vers une page RSVP
      alert(`Vous réservez pour: ${eventTitle}`);
    });
  });
}

// Boutons Sauvegarder l'Événement
if (eventSaveButtons.length > 0) {
  eventSaveButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const eventCard = event.target.closest('.event-card');
      const eventTitle = eventCard.querySelector('h3').textContent;
      
      // Basculer l'icône de signet
      const icon = button.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.innerHTML = `<i class="fas fa-bookmark"></i> Événement Sauvegardé`;
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.innerHTML = `<i class="far fa-bookmark"></i> Sauvegarder l'Événement`;
      }
    });
  });
}

// Slider de Collection - Lecture Automatique Simple (pourrait être remplacé par un carousel approprié)
let collectionAutoplayInterval;

const startCollectionAutoplay = () => {
  const collections = document.querySelectorAll('.collection-card');
  if (collections.length <= 1) return;
  
  let currentIndex = 0;
  
  collectionAutoplayInterval = setInterval(() => {
    collections.forEach(card => card.classList.remove('fade-in', 'pulse'));
    
    currentIndex = (currentIndex + 1) % collections.length;
    collections[currentIndex].classList.add('fade-in', 'pulse');
  }, 4000);
};

// Démarrer la lecture automatique si nous avons des collections
const collections = document.querySelectorAll('.collection-card');
if (collections.length > 0) {
  collections[0].classList.add('fade-in', 'pulse');
  startCollectionAutoplay();
}

// Formulaire de Newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (email) {
      // Dans une mise en œuvre réelle, cela serait soumis à un serveur
      alert(`Merci de vous être abonné avec ${email} ! Vous recevrez des mises à jour sur les dernières collections et événements de Giandra.`);
      emailInput.value = '';
    }
  });
}

// Initialiser le thème à partir de localStorage si disponible
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('giandra-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  }
  
  // Ajouter une animation fade-in aux sections lorsqu'elles deviennent visibles
  const animateSections = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionBottom = section.getBoundingClientRect().bottom;
      
      if (sectionTop < window.innerHeight && sectionBottom > 0) {
        if (!section.classList.contains('has-animated')) {
          section.classList.add('fade-in', 'has-animated');
        }
      }
    });
  };
  
  // Exécuter initialement et lors du défilement
  animateSections();
  window.addEventListener('scroll', animateSections);
});

// Défilement doux pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80, // Décalage pour l'en-tête
        behavior: 'smooth'
      });
    }
  });
});