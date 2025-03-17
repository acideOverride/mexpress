// Jerome Bikes - Bikes Listing JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    
    // Rotate between light, dark, and night-shift themes
    if (currentTheme === 'light') {
      body.setAttribute('data-theme', 'dark');
    } else if (currentTheme === 'dark') {
      body.setAttribute('data-theme', 'night-shift');
    } else {
      body.setAttribute('data-theme', 'light');
    }
    
    // Store the preference in localStorage for persistence
    localStorage.setItem('theme', body.getAttribute('data-theme'));
  });
  
  // Initialize theme from localStorage if available
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }
  
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navbar = document.querySelector('.top-nav');
  
  mobileMenuToggle.addEventListener('click', function() {
    navbar.classList.toggle('show-mobile');
  });
  
  // Language Toggle
  const languageToggle = document.getElementById('languageToggle');
  
  languageToggle.addEventListener('click', function() {
    const currentLang = this.textContent;
    
    if (currentLang === 'FR') {
      window.location.href = 'bikes-listing.html'; // Switch to English
    } else {
      window.location.href = 'bikes-listing-fr.html'; // Switch to French
    }
  });
  
  // Card images to use instead of placeholders
  const cardImages = [
    '../../../img/card1.webp',
    '../../../img/card2.webp',
    '../../../img/card3.webp',
    '../../../img/card4.webp',
    '../../../img/card5.webp',
    '../../../img/card7.webp',
    '../../../img/cross1.png',
    '../../../img/cross2.png',
    '../../../img/cross3.png',
    '../../../img/cross4.png',
    '../../../img/hero_list.png'
  ];
  
  // Bike Data (Sample data, in a real app this would come from an API)
  const bikes = [
    {
      id: 'B-2025-001',
      model: 'Trek Domane SL 7',
      type: 'Vélo de Route',
      category: 'premium',
      frame: 'Carbone',
      groupset: 'Shimano Ultegra Di2',
      weight: '8,2 kg',
      price: '95€',
      rating: 4.9,
      ratingCount: 24,
      image: '../../../img/card1.webp',
      available: true,
      usage: 'Routes pavées et sentiers lisses',
      description: 'Le Trek Domane SL 7 est un vélo de route haut de gamme avec un cadre en carbone OCLV de série 500 qui offre à la fois légèreté et durabilité. Équipé du système IsoSpeed avant et arrière, il absorbe les vibrations de la route pour un confort optimal sur les longues distances. La transmission électronique Shimano Ultegra Di2 offre des changements de vitesse précis et sans effort.',
      features: [
        'Cadre en carbone OCLV série 500',
        'Transmission électronique Shimano Ultegra Di2 11 vitesses',
        'Freins à disque hydrauliques',
        'Technologie IsoSpeed avant et arrière',
        'Compatible avec des pneus jusqu\'à 38c'
      ]
    },
    {
      id: 'B-2025-015',
      model: 'Specialized Turbo Vado',
      type: 'Vélo Électrique',
      category: 'premium',
      frame: 'Aluminium',
      groupset: 'SRAM NX Eagle',
      weight: '23,8 kg',
      price: '85€',
      rating: 4.8,
      ratingCount: 18,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Specialized+Turbo+Vado',
      available: true,
      usage: 'Trajets urbains et chemins de campagne',
      description: 'Le Specialized Turbo Vado est un vélo électrique haute performance conçu pour les déplacements urbains et les longues randonnées. Avec son moteur puissant et sa batterie longue durée, il offre une assistance jusqu\'à 25 km/h et une autonomie pouvant atteindre 120 km. Le cadre en aluminium est à la fois léger et robuste, tandis que les composants de haute qualité assurent une expérience de conduite fluide et agréable.',
      features: [
        'Moteur Specialized 2.0 de 250W',
        'Batterie intégrée de 600Wh',
        'Écran TCD avec connectivité Bluetooth',
        'Transmission SRAM NX Eagle 12 vitesses',
        'Éclairage intégré avant et arrière',
        'Garde-boue et porte-bagages inclus'
      ]
    },
    {
      id: 'B-2025-073',
      model: 'Trek FX 3',
      type: 'Vélo Hybride',
      category: 'standard',
      frame: 'Aluminium',
      groupset: 'Shimano Acera',
      weight: '10,9 kg',
      price: '65€',
      rating: 4.6,
      ratingCount: 32,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Trek+FX+3',
      available: true,
      usage: 'Fitness urbain et trajets quotidiens',
      description: 'Le Trek FX 3 est un vélo hybride polyvalent conçu pour offrir vitesse sur route et confort sur les sentiers. Son cadre en aluminium léger et sa fourche en carbone absorbant les vibrations en font un excellent choix pour les trajets quotidiens et les sorties fitness. La position de conduite droite offre une bonne visibilité dans le trafic urbain tout en restant confortable pour les longues sorties.',
      features: [
        'Cadre en aluminium Alpha Gold',
        'Fourche en carbone avec axe traversant',
        'Transmission Shimano Acera 9 vitesses',
        'Freins à disque hydrauliques Tektro',
        'Pneus Bontrager H2 de 32c',
        'Tige de selle suspendue Bontrager Satellite'
      ]
    },
    {
      id: 'B-2025-085',
      model: 'Specialized Allez',
      type: 'Vélo de Route',
      category: 'standard',
      frame: 'Aluminium',
      groupset: 'Shimano 105',
      weight: '9,3 kg',
      price: '70€',
      rating: 4.7,
      ratingCount: 22,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Specialized+Allez',
      available: false,
      availability: 'soon',
      usage: 'Entraînement routier et courses amateur',
      description: 'Le Specialized Allez est un vélo de route en aluminium qui offre un excellent rapport qualité-prix pour les cyclistes débutants et intermédiaires. Avec sa géométrie sportive mais pas trop agressive, il est parfait pour les longues sorties d\'entraînement et même les courses amateur. Le cadre en aluminium E5 Premium est à la fois léger et réactif, tandis que la fourche en carbone FACT absorbe les vibrations de la route.',
      features: [
        'Cadre en aluminium E5 Premium',
        'Fourche en carbone FACT',
        'Transmission Shimano 105 11 vitesses',
        'Freins sur jante Tektro',
        'Roues DT Swiss R460',
        'Pneus Specialized Turbo Pro 25c'
      ]
    },
    {
      id: 'B-2025-103',
      model: 'Brompton C Line',
      type: 'Vélo Pliant',
      category: 'premium',
      frame: 'Acier',
      groupset: 'Brompton Standard',
      weight: '11,4 kg',
      price: '80€',
      rating: 4.8,
      ratingCount: 15,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Brompton+C+Line',
      available: true,
      usage: 'Trajets intermodaux et voyages',
      description: 'Le Brompton C Line est un vélo pliant britannique de haute qualité, parfait pour les trajets intermodaux et les voyages. Il se plie en quelques secondes en un format compact facile à transporter et à ranger. Son cadre en acier fait main offre une conduite confortable et stable malgré les petites roues. La polyvalence du Brompton en fait un compagnon idéal pour la ville et bien au-delà.',
      features: [
        'Cadre en acier fait main au Royaume-Uni',
        'Pliage compact en trois parties',
        'Transmission à 6 vitesses',
        'Garde-boue avant et arrière',
        'Éclairage USB rechargeable',
        'Sac de transport disponible en option'
      ]
    },
    {
      id: 'B-2025-042',
      model: 'Giant Talon 2',
      type: 'VTT',
      category: 'standard',
      frame: 'Aluminium',
      groupset: 'Shimano Deore',
      weight: '12,8 kg',
      price: '75€',
      rating: 4.5,
      ratingCount: 28,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Giant+Talon+2',
      available: true,
      usage: 'Sentiers forestiers et trails modérés',
      description: 'Le Giant Talon 2 est un VTT hardtail (sans suspension arrière) idéal pour les sentiers forestiers et les pistes de difficulté modérée. Son cadre en aluminium ALUXX offre un bon équilibre entre légèreté et durabilité, tandis que la fourche suspendue avec 100mm de débattement absorbe les chocs et améliore le contrôle sur terrain accidenté.',
      features: [
        'Cadre en aluminium ALUXX-Grade',
        'Fourche SR Suntour XCM avec 100mm de débattement',
        'Transmission Shimano Deore 10 vitesses',
        'Freins à disque hydrauliques Tektro',
        'Pneus Maxxis Rekon de 2,4"',
        'Tige de selle Giant Connect'
      ]
    },
    {
      id: 'B-2025-118',
      model: 'Cannondale Synapse',
      type: 'Vélo de Route',
      category: 'premium',
      frame: 'Carbone',
      groupset: 'Shimano 105',
      weight: '8,8 kg',
      price: '90€',
      rating: 4.7,
      ratingCount: 19,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Cannondale+Synapse',
      available: true,
      usage: 'Longues distances et parcours variés',
      description: 'Le Cannondale Synapse est un vélo d\'endurance en carbone conçu pour offrir confort et performance sur les longues distances. Avec sa géométrie plus détendue que les vélos de course traditionnels, il réduit la fatigue et permet de rouler plus longtemps. La technologie SAVE micro-suspension intégrée au cadre et à la fourche absorbe les vibrations sans compromettre l\'efficacité.',
      features: [
        'Cadre en carbone BallisTec haute modulation',
        'Technologie SAVE micro-suspension',
        'Transmission Shimano 105 11 vitesses',
        'Freins à disque hydrauliques',
        'Dégagement pour pneus jusqu\'à 32mm',
        'Passages de câbles internes'
      ]
    },
    {
      id: 'B-2025-056',
      model: 'Cube Reaction Pro',
      type: 'VTT',
      category: 'premium',
      frame: 'Aluminium',
      groupset: 'SRAM GX Eagle',
      weight: '11,9 kg',
      price: '85€',
      rating: 4.6,
      ratingCount: 23,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Cube+Reaction+Pro',
      available: false,
      availability: 'soon',
      usage: 'Cross-country et trails techniques',
      description: 'Le Cube Reaction Pro est un VTT cross-country performant, conçu pour les parcours techniques et la compétition. Son cadre en aluminium ultralight offre une excellente rigidité pour un transfert de puissance optimal, tandis que la géométrie moderne assure maniabilité et stabilité sur les descentes techniques.',
      features: [
        'Cadre Aluminium Ultralight Advanced',
        'Fourche RockShox Judy Gold RL 100mm',
        'Transmission SRAM GX Eagle 12 vitesses',
        'Freins à disque Shimano XT',
        'Roues Mavic XC 421 Tubeless Ready',
        'Pneus Schwalbe Racing Ray/Ralph'
      ]
    },
    {
      id: 'B-2025-137',
      model: 'Scott Addict RC 20',
      type: 'Vélo de Route',
      category: 'premium',
      frame: 'Carbone',
      groupset: 'Shimano Ultegra',
      weight: '7,9 kg',
      price: '95€',
      rating: 4.9,
      ratingCount: 17,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Scott+Addict+RC+20',
      available: true,
      usage: 'Course et compétition',
      description: 'Le Scott Addict RC 20 est un vélo de course haut de gamme conçu pour la performance pure. Son cadre en carbone HMF offre un rapport rigidité/poids exceptionnel, idéal pour les grimpeurs et les coureurs exigeants. L\'intégration complète des câbles améliore l\'aérodynamisme, tandis que la géométrie de course agressive favorise une position efficace.',
      features: [
        'Cadre en carbone HMF',
        'Fourche Addict HMF with Integrated Cable Routing',
        'Transmission Shimano Ultegra 11 vitesses',
        'Freins à disque hydrauliques',
        'Cintre et potence intégrés Syncros',
        'Roues Syncros RP2.0 Disc'
      ]
    },
    {
      id: 'B-2025-092',
      model: 'Van Rysel EDR CF',
      type: 'Vélo de Route',
      category: 'standard',
      frame: 'Carbone',
      groupset: 'Shimano 105',
      weight: '8,5 kg',
      price: '75€',
      rating: 4.6,
      ratingCount: 31,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Van+Rysel+EDR+CF',
      available: true,
      usage: 'Endurance et sportif',
      description: 'Le Van Rysel EDR CF est un vélo d\'endurance en carbone offrant un excellent rapport qualité-prix. Sa géométrie équilibrée combine confort sur longues distances et position assez efficace pour les efforts soutenus. Le cadre en carbone absorbe les vibrations tout en restant réactif, ce qui en fait un vélo polyvalent pour tous types de parcours.',
      features: [
        'Cadre en carbone UD',
        'Fourche carbone intégrale',
        'Transmission Shimano 105 11 vitesses',
        'Freins à disque hydrauliques',
        'Roues Fulcrum Racing 900 DB',
        'Pneus Hutchinson Fusion 5 28mm'
      ]
    },
    {
      id: 'B-2025-145',
      model: 'BMC Roadmachine 02',
      type: 'Vélo de Route',
      category: 'premium',
      frame: 'Carbone',
      groupset: 'Shimano 105',
      weight: '8,7 kg',
      price: '85€',
      rating: 4.8,
      ratingCount: 16,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=BMC+Roadmachine+02',
      available: false,
      availability: 'soon',
      usage: 'Parcours variés et endurance',
      description: 'Le BMC Roadmachine 02 est un vélo d\'endurance premium qui combine performance, confort et polyvalence. Sa Technologie Tuned Compliance Concept (TCC) intégrée au cadre et à la fourche offre une absorption des vibrations ciblée, tandis que la position légèrement redressée réduit la fatigue sur les longues sorties.',
      features: [
        'Cadre Premium Carbon avec Technologie TCC',
        'Intégration totale des câbles ICS',
        'Transmission Shimano 105 11 vitesses',
        'Freins à disque hydrauliques flat mount',
        'Passage pour pneus jusqu\'à 33mm',
        'Tige de selle D-shape pour plus de confort'
      ]
    },
    {
      id: 'B-2025-064',
      model: 'Canyon Endurace CF SL',
      type: 'Vélo de Route',
      category: 'premium',
      frame: 'Carbone',
      groupset: 'Shimano Ultegra',
      weight: '8,1 kg',
      price: '90€',
      rating: 4.8,
      ratingCount: 25,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Canyon+Endurace+CF+SL',
      available: true,
      usage: 'Endurance et longues distances',
      description: 'Le Canyon Endurace CF SL est un vélo d\'endurance en carbone qui offre un équilibre parfait entre confort et performance. Sa géométrie Sport valorise une position plus détendue que les vélos de course, idéale pour les longues distances. Le cadre et la fourche en carbone utilisent la technologie VCLS (Vertical Comfort Lateral Stiffness) pour filtrer les vibrations tout en conservant une excellente rigidité latérale.',
      features: [
        'Cadre en carbone CF SL',
        'Technologie VCLS pour le confort',
        'Transmission Shimano Ultegra 11 vitesses',
        'Freins à disque hydrauliques',
        'Cockpit intégré Canyon CP10 Aerocockpit',
        'Tige de selle VCLS 2.0 à flexion contrôlée'
      ]
    },
    {
      id: 'B-2025-029',
      model: 'Trek Fuel EX 8',
      type: 'VTT',
      category: 'premium',
      frame: 'Aluminium',
      groupset: 'Shimano XT/SLX',
      weight: '13,9 kg',
      price: '90€',
      rating: 4.7,
      ratingCount: 19,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Trek+Fuel+EX+8',
      available: true,
      usage: 'All-Mountain et trail',
      description: 'Le Trek Fuel EX 8 est un VTT tout-suspendu polyvalent, à l\'aise sur tous types de terrains. Avec 130mm de débattement avant et arrière, il excelle dans les montées techniques comme dans les descentes engagées. Son cadre en aluminium Alpha Platinum offre rigidité et durabilité, tandis que la suspension arrière à point de pivot virtuel Full Floater est sensible et efficace.',
      features: [
        'Cadre en aluminium Alpha Platinum',
        'Fourche Fox Rhythm 34 130mm',
        'Amortisseur Fox Float Performance',
        'Transmission Shimano XT/SLX 12 vitesses',
        'Freins à disque hydrauliques Shimano SLX',
        'Roues Bontrager Line Comp 30'
      ]
    },
    {
      id: 'B-2025-171',
      model: 'Specialized Diverge Comp',
      type: 'Gravel',
      category: 'premium',
      frame: 'Carbone',
      groupset: 'SRAM Rival',
      weight: '9,4 kg',
      price: '85€',
      rating: 4.7,
      ratingCount: 22,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Specialized+Diverge+Comp',
      available: true,
      usage: 'Aventure tout-terrain et gravel',
      description: 'Le Specialized Diverge Comp est un vélo gravel polyvalent qui vous emmènera bien au-delà de l\'asphalte. Son cadre en carbone FACT 9r avec technologie Future Shock 2.0 (suspension avant intégrée de 20mm) absorbe les chocs et les vibrations pour un meilleur confort et contrôle sur les chemins accidentés.',
      features: [
        'Cadre en carbone FACT 9r',
        'Suspension Future Shock 2.0 avec 20mm de débattement',
        'Transmission SRAM Rival 1x11 vitesses',
        'Freins à disque hydrauliques',
        'Passage pour pneus jusqu\'à 47mm',
        'Points de fixation multiples pour accessoires et bagages'
      ]
    },
    {
      id: 'B-2025-083',
      model: 'Decathlon Triban RC520',
      type: 'Vélo de Route',
      category: 'standard',
      frame: 'Aluminium',
      groupset: 'Shimano 105',
      weight: '10,5 kg',
      price: '60€',
      rating: 4.5,
      ratingCount: 42,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Decathlon+Triban+RC520',
      available: true,
      usage: 'Polyvalent et endurance',
      description: 'Le Decathlon Triban RC520 est un vélo de route polyvalent offrant un rapport qualité-prix exceptionnel. Son cadre en aluminium 6061 T6 avec fourche en carbone offre un bon compromis entre confort, légèreté et durabilité. La géométrie endurance favorise une position confortable pour les sorties longues, tandis que la transmission Shimano 105 assure des changements de vitesse précis et fiables.',
      features: [
        'Cadre en aluminium 6061 T6',
        'Fourche en carbone avec pivot en aluminium',
        'Transmission Shimano 105 11 vitesses',
        'Freins à disque TRP HY/RD semi-hydrauliques',
        'Pneus Triban Resist+ 28mm',
        'Roues tubeless ready'
      ]
    },
    {
      id: 'B-2025-109',
      model: 'Giant Revolt Advanced 2',
      type: 'Gravel',
      category: 'premium',
      frame: 'Carbone',
      groupset: 'Shimano GRX',
      weight: '9,8 kg',
      price: '80€',
      rating: 4.6,
      ratingCount: 18,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Giant+Revolt+Advanced+2',
      available: false,
      availability: 'soon',
      usage: 'Gravel et aventure',
      description: 'Le Giant Revolt Advanced 2 est un vélo gravel en carbone conçu pour l\'aventure au-delà des routes pavées. Son cadre en carbone Advanced-Grade Composite offre légèreté et durabilité, tandis que la géométrie spécifique gravel assure stabilité et contrôle sur les terrains difficiles. La compatibilité avec de larges pneus et les nombreux points de fixation permettent d\'explorer de nouveaux horizons.',
      features: [
        'Cadre en carbone Advanced-Grade Composite',
        'Fourche composite OverDrive avec axe traversant',
        'Transmission Shimano GRX 2x10 vitesses',
        'Freins à disque hydrauliques',
        'Passage pour pneus jusqu\'à 45mm',
        'Points de fixation pour porte-bagages et garde-boue'
      ]
    },
    {
      id: 'B-2025-132',
      model: 'Moustache Samedi 28.5',
      type: 'Vélo Électrique',
      category: 'premium',
      frame: 'Aluminium',
      groupset: 'Shimano Deore',
      weight: '23,2 kg',
      price: '90€',
      rating: 4.8,
      ratingCount: 24,
      image: 'https://placehold.co/800x600/2e7d32/FFFFFF/png?text=Moustache+Samedi+28.5',
      available: true,
      usage: 'Urbain et randonnée',
      description: 'Le Moustache Samedi 28.5 est un vélo électrique urbain haut de gamme fabriqué en France. Son cadre en aluminium intègre parfaitement la batterie pour une esthétique soignée et une meilleure répartition du poids. Le moteur Bosch Performance Line au pédalier offre une assistance naturelle et puissante, idéale pour les trajets urbains comme pour les sorties plus longues.',
      features: [
        'Cadre en aluminium 6061 hydroformé',
        'Moteur Bosch Performance Line 65Nm',
        'Batterie Bosch PowerTube 625Wh',
        'Transmission Shimano Deore 10 vitesses',
        'Freins à disque hydrauliques Shimano',
        'Éclairage, garde-boue et porte-bagages intégrés'
      ]
    }
  ];
  
  // Initialize bike listing
  const bikeListingContainer = document.getElementById('bikeListingContainer');
  const bikeCardTemplate = document.getElementById('bikeCardTemplate');
  const bikeDetailModal = document.getElementById('bikeDetailModal');
  const resultsCountElement = document.getElementById('resultsCount').querySelector('span');
  
  // Filter states
  let activeTypeFilter = 'all';
  let activeCategoryFilter = 'all';
  let activeAvailabilityFilter = 'all';
  let currentView = 'grid';
  let currentSort = 'recommended';
  let searchQuery = '';
  
  // Filter buttons event listeners
  const typeFilterButtons = document.querySelectorAll('.filter-button[data-filter]');
  const categoryFilterButtons = document.querySelectorAll('.filter-button[data-category]');
  const availabilityFilterButtons = document.querySelectorAll('.filter-button[data-availability]');
  const viewOptionButtons = document.querySelectorAll('.view-option');
  const sortSelect = document.getElementById('sortSelect');
  const searchInput = document.getElementById('bikeSearch');
  const searchButton = document.querySelector('.search-button');
  
  // Type filter
  typeFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      typeFilterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      activeTypeFilter = this.getAttribute('data-filter');
      renderBikes();
    });
  });
  
  // Category filter
  categoryFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      activeCategoryFilter = this.getAttribute('data-category');
      renderBikes();
    });
  });
  
  // Availability filter
  availabilityFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      availabilityFilterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      activeAvailabilityFilter = this.getAttribute('data-availability');
      renderBikes();
    });
  });
  
  // View options
  viewOptionButtons.forEach(button => {
    button.addEventListener('click', function() {
      viewOptionButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const view = this.getAttribute('data-view');
      bikeListingContainer.classList.remove('view-grid', 'view-list');
      bikeListingContainer.classList.add(`view-${view}`);
      currentView = view;
    });
  });
  
  // Sort options
  sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    renderBikes();
  });
  
  // Search
  searchButton.addEventListener('click', function() {
    searchQuery = searchInput.value.toLowerCase().trim();
    renderBikes();
  });
  
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      searchQuery = this.value.toLowerCase().trim();
      renderBikes();
    }
  });
  
  // Filter bikes based on current filters
  function filterBikes() {
    return bikes.filter(bike => {
      // Type filter
      if (activeTypeFilter !== 'all' && !bike.type.toLowerCase().includes(activeTypeFilter.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (activeCategoryFilter !== 'all' && bike.category !== activeCategoryFilter) {
        return false;
      }
      
      // Availability filter
      if (activeAvailabilityFilter === 'available' && !bike.available) {
        return false;
      } else if (activeAvailabilityFilter === 'soon' && (bike.available || bike.availability !== 'soon')) {
        return false;
      }
      
      // Search query
      if (searchQuery) {
        const searchFields = [
          bike.model.toLowerCase(),
          bike.type.toLowerCase(),
          bike.category.toLowerCase(),
          bike.frame.toLowerCase(),
          bike.groupset.toLowerCase()
        ];
        
        return searchFields.some(field => field.includes(searchQuery));
      }
      
      return true;
    });
  }
  
  // Sort bikes based on current sort option
  function sortBikes(filteredBikes) {
    switch (currentSort) {
      case 'price-low':
        return filteredBikes.sort((a, b) => {
          const priceA = parseInt(a.price.replace('€', ''));
          const priceB = parseInt(b.price.replace('€', ''));
          return priceA - priceB;
        });
      
      case 'price-high':
        return filteredBikes.sort((a, b) => {
          const priceA = parseInt(a.price.replace('€', ''));
          const priceB = parseInt(b.price.replace('€', ''));
          return priceB - priceA;
        });
      
      case 'name':
        return filteredBikes.sort((a, b) => a.model.localeCompare(b.model));
      
      case 'newest':
        // In a real app, we would have a date field to sort by
        return filteredBikes.sort((a, b) => b.id.localeCompare(a.id));
      
      case 'recommended':
      default:
        // Sort by a combination of rating and popularity
        return filteredBikes.sort((a, b) => {
          const scoreA = a.rating * Math.log(a.ratingCount + 1);
          const scoreB = b.rating * Math.log(b.ratingCount + 1);
          return scoreB - scoreA;
        });
    }
  }
  
  // Render bikes based on filters and sort options
  // Function to update bike images with our card images
  function updateBikeImages() {
    // Loop through bikes and update image references
    bikes.forEach((bike, index) => {
      // Special cases for specific bike models
      if (bike.model === 'Cannondale Synapse') {
        bike.image = '../../../img/card4.webp';
      } 
      else if (bike.model === 'Specialized Diverge Comp') {
        bike.image = '../../../img/card5.webp';
      }
      // Use hero_list.png for the hero listing
      else if (bike.model === 'Trek Domane SL 7') {
        bike.image = '../../../img/hero_list.png';
      }
      // For other bikes, use modulo to cycle through our available card images
      else {
        const imageIndex = index % (cardImages.length - 1); // Exclude hero_list from regular rotation
        bike.image = cardImages[imageIndex];
      }
    });
  }
  
  // Call updateBikeImages to replace placeholder images
  updateBikeImages();
  
  function renderBikes() {
    // Clear container
    bikeListingContainer.innerHTML = '';
    
    // Filter and sort bikes
    const filteredBikes = filterBikes();
    const sortedBikes = sortBikes(filteredBikes);
    
    // Update results count
    resultsCountElement.textContent = sortedBikes.length;
    
    // Render each bike card
    sortedBikes.forEach(bike => {
      const bikeCard = bikeCardTemplate.content.cloneNode(true);
      
      // Set image
      const bikeImage = bikeCard.querySelector('.bike-image img');
      bikeImage.src = bike.image;
      bikeImage.alt = bike.model;
      
      // Set availability
      const availabilityIndicator = bikeCard.querySelector('.availability-indicator');
      if (!bike.available) {
        availabilityIndicator.textContent = 'Bientôt disponible';
        availabilityIndicator.classList.remove('available');
        availabilityIndicator.classList.add('soon');
      }
      
      // Set category
      const bikeCategory = bikeCard.querySelector('.bike-category');
      bikeCategory.textContent = bike.category.charAt(0).toUpperCase() + bike.category.slice(1);
      
      // Set rating
      const stars = bikeCard.querySelector('.stars');
      stars.textContent = '★'.repeat(Math.floor(bike.rating)) + '☆'.repeat(5 - Math.floor(bike.rating));
      
      const ratingCount = bikeCard.querySelector('.rating-count');
      ratingCount.textContent = `(${bike.ratingCount})`;
      
      // Set basic info
      bikeCard.querySelector('.bike-title').textContent = bike.model;
      bikeCard.querySelector('.bike-type').textContent = bike.type;
      bikeCard.querySelector('.spec-value.groupset').textContent = bike.groupset;
      bikeCard.querySelector('.spec-value.weight').textContent = bike.weight;
      bikeCard.querySelector('.bike-price .amount').textContent = bike.price;
      
      // Add event listeners to buttons
      const viewDetailsButton = bikeCard.querySelector('.view-details-button');
      viewDetailsButton.addEventListener('click', () => {
        openBikeModal(bike);
      });
      
      const quickRentButton = bikeCard.querySelector('.quick-rent-button');
      quickRentButton.addEventListener('click', () => {
        openBikeModal(bike, true);
      });
      
      // Add the bike card to the container
      bikeListingContainer.appendChild(bikeCard);
    });
  }
  
  // Open bike details modal
  function openBikeModal(bike, scrollToRent = false) {
    // Set modal content
    document.getElementById('modalBikeModel').textContent = bike.model;
    document.getElementById('modalBikeType').textContent = bike.type;
    document.getElementById('modalBikeImage').src = bike.image;
    document.getElementById('modalBikeCategory').textContent = bike.category.charAt(0).toUpperCase() + bike.category.slice(1);
    document.getElementById('modalBikeGroupset').textContent = bike.groupset;
    document.getElementById('modalBikeFrame').textContent = bike.frame;
    document.getElementById('modalBikeWeight').textContent = bike.weight;
    document.getElementById('modalBikeUsage').textContent = bike.usage;
    document.getElementById('modalBikePrice').textContent = bike.price;
    
    // Calculate weekly price (with 20% discount)
    const dailyPrice = parseInt(bike.price.replace('€', ''));
    const weeklyPrice = Math.round(dailyPrice * 7 * 0.8);
    document.getElementById('modalBikeWeekPrice').textContent = `${weeklyPrice}€`;
    
    // Set description
    document.getElementById('modalBikeDescription').textContent = bike.description;
    
    // Set availability
    const availabilityBadge = document.getElementById('modalBikeAvailability');
    if (bike.available) {
      availabilityBadge.textContent = 'Disponible';
      availabilityBadge.className = 'availability-badge available';
    } else {
      availabilityBadge.textContent = 'Bientôt disponible';
      availabilityBadge.className = 'availability-badge soon';
    }
    
    // Set features
    const featuresList = document.getElementById('modalBikeFeatures');
    featuresList.innerHTML = '';
    bike.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });
    
    // Set date inputs to today and tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    document.getElementById('modalStartDate').value = formatDate(today);
    document.getElementById('modalEndDate').value = formatDate(tomorrow);
    
    // Enable/disable rent button based on availability
    const rentButton = document.getElementById('rentButton');
    if (bike.available) {
      rentButton.disabled = false;
      rentButton.textContent = 'Réserver ce vélo';
    } else {
      rentButton.disabled = true;
      rentButton.textContent = 'Bientôt disponible';
    }
    
    // Add event listener to thumbnail gallery
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const imageSrc = this.getAttribute('data-image');
        document.getElementById('modalBikeImage').src = imageSrc;
      });
    });
    
    // Add event listener to rent button
    rentButton.addEventListener('click', function() {
      const startDate = document.getElementById('modalStartDate').value;
      const endDate = document.getElementById('modalEndDate').value;
      
      // In a real application, this would submit the booking to an API
      alert(`Réservation pour ${bike.model} du ${startDate} au ${endDate} confirmée !`);
      closeBikeModal();
      
      // Redirect to booking page (simulation)
      setTimeout(() => {
        window.location.href = 'future-portal-fr.html#reservationConfirmed';
      }, 500);
    });
    
    // Show modal
    bikeDetailModal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Scroll to rental section if quick rent was clicked
    if (scrollToRent) {
      setTimeout(() => {
        document.querySelector('.rental-section').scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }
  
  // Close bike details modal
  function closeBikeModal() {
    bikeDetailModal.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Add event listener to modal close button
  document.querySelector('.modal-close').addEventListener('click', closeBikeModal);
  
  // Close modal when clicking on overlay
  document.querySelector('.modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      closeBikeModal();
    }
  });
  
  // Initial render
  renderBikes();
});