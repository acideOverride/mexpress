// Jerome Bikes - Système de Réservation Futuriste JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Changement de Thème
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    
    // Alterner entre les thèmes clair, sombre et nuit
    if (currentTheme === 'light') {
      body.setAttribute('data-theme', 'dark');
    } else if (currentTheme === 'dark') {
      body.setAttribute('data-theme', 'night-shift');
    } else {
      body.setAttribute('data-theme', 'light');
    }
    
    // Stocker la préférence dans localStorage pour la persistance
    localStorage.setItem('theme', body.getAttribute('data-theme'));
  });
  
  // Initialiser le thème à partir de localStorage si disponible
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }
  
  // Menu Mobile Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navbar = document.querySelector('.top-nav');
  
  mobileMenuToggle.addEventListener('click', function() {
    navbar.classList.toggle('show-mobile');
  });
  
  // Puces de Suggestion
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  const smartInput = document.getElementById('smartInput');
  
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', function() {
      smartInput.value = this.getAttribute('data-text');
      smartInput.focus();
    });
  });
  
  // Bouton Microphone (Simulation)
  const micButton = document.getElementById('micButton');
  
  micButton.addEventListener('click', function() {
    // Dans une implémentation réelle, ceci déclencherait la reconnaissance vocale
    alert('Dans une implémentation réelle, cela activerait votre microphone pour une saisie vocale.');
    
    // Simuler la réception d'une entrée vocale après un délai
    setTimeout(() => {
      smartInput.value = "VTT au Parc Central ce week-end pour 4 heures";
      smartInput.classList.add('pulse');
      setTimeout(() => {
        smartInput.classList.remove('pulse');
      }, 1000);
    }, 1000);
  });
  
  // Options du Sélecteur Rapide
  const dateOptions = document.querySelectorAll('.date-option');
  const durationOptions = document.querySelectorAll('.duration-option');
  const bikeTypeOptions = document.querySelectorAll('.bike-type-option');
  const locationOptions = document.querySelectorAll('.location-option');
  
  // Options de date
  dateOptions.forEach(option => {
    option.addEventListener('click', function() {
      dateOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      if (this.getAttribute('data-value') === 'custom') {
        document.getElementById('quickDate').classList.remove('hidden');
      } else {
        document.getElementById('quickDate').classList.add('hidden');
      }
    });
  });
  
  // Options de durée
  durationOptions.forEach(option => {
    option.addEventListener('click', function() {
      durationOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      if (this.getAttribute('data-value') === 'custom') {
        document.getElementById('quickDuration').classList.remove('hidden');
      } else {
        document.getElementById('quickDuration').classList.add('hidden');
      }
    });
  });
  
  // Options de type de vélo
  bikeTypeOptions.forEach(option => {
    option.addEventListener('click', function() {
      bikeTypeOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Options de lieu
  locationOptions.forEach(option => {
    option.addEventListener('click', function() {
      locationOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Bouton Recherche Intelligente
  const smartSearch = document.getElementById('smartSearch');
  const aiRecommendations = document.getElementById('aiRecommendations');
  
  smartSearch.addEventListener('click', function() {
    // Afficher l'état de chargement
    this.disabled = true;
    this.textContent = 'Recherche des correspondances parfaites...';
    
    // Simuler un délai de traitement IA
    setTimeout(() => {
      this.disabled = false;
      this.textContent = 'Trouver Mon Vélo Parfait';
      
      // Afficher les recommandations
      aiRecommendations.style.display = 'block';
      aiRecommendations.scrollIntoView({ behavior: 'smooth' });
      
      // Ajouter une animation aux recommandations
      const recommendationCards = document.querySelectorAll('.recommendation-card');
      recommendationCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('fade-in');
        }, index * 200);
      });
    }, 1500);
  });
  
  // Bouton Recherche Rapide (Même fonctionnalité que Recherche Intelligente pour la démo)
  const quickSearch = document.getElementById('quickSearch');
  
  quickSearch.addEventListener('click', function() {
    // Afficher l'état de chargement
    this.disabled = true;
    this.textContent = 'Recherche des vélos disponibles...';
    
    // Simuler un délai de traitement
    setTimeout(() => {
      this.disabled = false;
      this.textContent = 'Afficher les Vélos Disponibles';
      
      // Afficher les recommandations
      aiRecommendations.style.display = 'block';
      aiRecommendations.scrollIntoView({ behavior: 'smooth' });
      
      // Ajouter une animation aux recommandations
      const recommendationCards = document.querySelectorAll('.recommendation-card');
      recommendationCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('fade-in');
        }, index * 200);
      });
    }, 1500);
  });
  
  // Ajouter des articles supplémentaires
  const addExtraButtons = document.querySelectorAll('.add-extra');
  const selectedExtras = [];
  
  addExtraButtons.forEach(button => {
    button.addEventListener('click', function() {
      const extraItem = this.getAttribute('data-extra');
      const extraName = this.parentNode.querySelector('h4').textContent;
      const extraPrice = this.parentNode.querySelector('.extra-price').textContent;
      
      if (this.classList.contains('added')) {
        // Supprimer l'extra
        this.classList.remove('added');
        this.innerHTML = '<span class="plus-icon">+</span> Ajouter';
        
        // Supprimer des extras sélectionnés
        const index = selectedExtras.findIndex(extra => extra.id === extraItem);
        if (index !== -1) {
          selectedExtras.splice(index, 1);
        }
      } else {
        // Ajouter l'extra
        this.classList.add('added');
        this.innerHTML = '<span class="plus-icon">✓</span> Ajouté';
        
        // Ajouter aux extras sélectionnés
        selectedExtras.push({
          id: extraItem,
          name: extraName,
          price: extraPrice
        });
      }
    });
  });
  
  // Boutons de Réservation
  const reserveButtons = document.querySelectorAll('.reserve-button');
  const instantCheckout = document.getElementById('instantCheckout');
  
  reserveButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Obtenir les données du vélo
      const bikeId = this.getAttribute('data-bike-id');
      let bikeModel, bikeType, bikePrice;
      
      if (bikeId === 'B-2025-001') {
        bikeModel = 'Trek Domane SL 7';
        bikeType = 'Vélo de Route';
        bikePrice = '95€/jour';
      } else if (bikeId === 'B-2025-085') {
        bikeModel = 'Specialized Allez';
        bikeType = 'Vélo de Route';
        bikePrice = '70€/jour';
      } else if (bikeId === 'B-2025-015') {
        bikeModel = 'Specialized Turbo';
        bikeType = 'Vélo Électrique';
        bikePrice = '85€/jour';
      }
      
      // Mettre à jour les informations de paiement
      document.getElementById('checkoutBikeModel').textContent = bikeModel;
      document.getElementById('checkoutBikeType').textContent = bikeType;
      
      // Mettre à jour l'image en fonction du vélo sélectionné
      document.getElementById('checkoutBikeImage').src = `../../img/card2.webp`;
      
      // Masquer les recommandations, afficher le paiement
      aiRecommendations.style.display = 'none';
      instantCheckout.style.display = 'block';
      instantCheckout.scrollIntoView({ behavior: 'smooth' });
      
      // Mettre à jour les extras dans le paiement s'il y en a de sélectionnés
      updateCheckoutExtras();
    });
  });
  
  // Fonction pour mettre à jour les extras et les totaux du paiement
  function updateCheckoutExtras() {
    const checkoutExtras = document.getElementById('checkoutExtras');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const oneClickCheckout = document.getElementById('oneClickCheckout');
    
    // Effacer les extras précédents
    checkoutExtras.innerHTML = '';
    
    // Calculer le prix du vélo (codé en dur pour la démo)
    const bikePrice = 190; // 95€/jour x 2 jours
    
    // Ajouter les extras sélectionnés au paiement
    let extrasTotal = 0;
    selectedExtras.forEach(extra => {
      const extraPrice = parseInt(extra.price.replace('€', ''));
      extrasTotal += extraPrice;
      
      const extraItem = document.createElement('div');
      extraItem.className = 'summary-item';
      extraItem.innerHTML = `
        <span class="item-label">${extra.name}</span>
        <span class="item-price">${extraPrice.toFixed(2)}€</span>
      `;
      checkoutExtras.appendChild(extraItem);
    });
    
    // Mettre à jour le sous-total
    const subtotal = bikePrice + extrasTotal;
    checkoutSubtotal.textContent = `${subtotal.toFixed(2)}€`;
    
    // Ajouter l'assurance (15€)
    const total = subtotal + 15;
    checkoutTotal.textContent = `${total.toFixed(2)}€`;
    
    // Mettre à jour le prix du bouton de paiement en un clic
    oneClickCheckout.querySelector('.button-price').textContent = `${total.toFixed(2)}€`;
  }
  
  // Bouton Retour aux Recommandations
  const backToRecommendations = document.getElementById('backToRecommendations');
  
  backToRecommendations.addEventListener('click', function() {
    instantCheckout.style.display = 'none';
    aiRecommendations.style.display = 'block';
    aiRecommendations.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Bouton Paiement en Un Clic
  const oneClickCheckout = document.getElementById('oneClickCheckout');
  const reservationConfirmed = document.getElementById('reservationConfirmed');
  
  oneClickCheckout.addEventListener('click', function() {
    // Afficher l'état de chargement
    this.disabled = true;
    this.querySelector('.button-text').textContent = 'Traitement en cours...';
    
    // Simuler un délai de traitement
    setTimeout(() => {
      this.disabled = false;
      this.querySelector('.button-text').textContent = 'Paiement en Un Clic';
      
      // Mettre à jour les détails confirmés
      const bikeModel = document.getElementById('checkoutBikeModel').textContent;
      document.getElementById('confirmedBike').textContent = bikeModel;
      
      // Masquer le paiement, afficher la confirmation
      instantCheckout.style.display = 'none';
      reservationConfirmed.style.display = 'block';
      reservationConfirmed.scrollIntoView({ behavior: 'smooth' });
      
      // Déclencher l'animation de succès
      document.querySelector('.success-animation').classList.add('fade-in');
      
      // Ajouter une animation aux détails de confirmation
      const detailCards = document.querySelectorAll('.detail-card');
      detailCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('fade-in');
        }, 500 + index * 200);
      });
    }, 1500);
  });
  
  // Bouton Réserver un Autre Vélo
  const bookAnother = document.getElementById('bookAnother');
  
  bookAnother.addEventListener('click', function() {
    // Réinitialiser les sélections
    selectedExtras.length = 0;
    
    // Réinitialiser les boutons
    addExtraButtons.forEach(button => {
      button.classList.remove('added');
      button.innerHTML = '<span class="plus-icon">+</span> Ajouter';
    });
    
    // Réinitialiser l'affichage des recommandations
    reservationConfirmed.style.display = 'none';
    
    // Défiler jusqu'à la section de réservation
    document.getElementById('smart-booking').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Bouton Enregistrer pour Plus Tard (Simulation)
  const saveForLater = document.getElementById('saveForLater');
  
  saveForLater.addEventListener('click', function() {
    alert('Votre sélection a été enregistrée. Vous pourrez y accéder ultérieurement depuis votre compte.');
  });
  
  // Bouton Voir Ma Réservation (Simulation)
  const viewBooking = document.getElementById('viewBooking');
  
  viewBooking.addEventListener('click', function() {
    alert('Dans une implémentation réelle, cela vous amènerait à la page des détails de votre réservation.');
  });
  
  // Changement de langue (Simulation)
  const languageToggle = document.querySelector('.language-toggle');
  
  languageToggle.addEventListener('click', function() {
    if (this.textContent === 'FR') {
      this.textContent = 'EN';
      alert("Dans une implémentation réelle, cela changerait l'interface en anglais.");
    } else {
      this.textContent = 'FR';
      alert("Dans une implémentation réelle, cela changerait l'interface en français.");
    }
  });
  
  // Ajouter une animation automatique à certains éléments pour un attrait visuel
  const animateElements = () => {
    // Ajouter une animation flottante aux images de vélo
    const bikeImages = document.querySelectorAll('.rec-image');
    bikeImages.forEach(image => {
      image.classList.add('float');
    });
    
    // Ajouter une animation de pulsation aux boutons CTA périodiquement
    const ctaButtons = document.querySelectorAll('.cta-button, .express-checkout-button');
    setInterval(() => {
      ctaButtons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
          button.classList.remove('pulse');
        }, 2000);
      });
    }, 10000);
  };
  
  // Exécuter les animations après un court délai
  setTimeout(animateElements, 2000);
});