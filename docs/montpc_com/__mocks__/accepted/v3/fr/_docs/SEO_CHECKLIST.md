# SEO Checklist pour MontPC.com - Optimisation pour la région Haute-Savoie

## Objectif : 
Optimiser le site MontPC.com pour générer du trafic ciblé sur les termes de réparation d'appareils électroniques en Haute-Savoie, notamment pour les recherches comme "réparer iPhone" et les réparations d'appareils (smartphones, ordinateurs portables, MacBook, iPhone, iPad).

## 1. Optimisation des Balises Meta

- [ ] **Balise title optimisée** :
  - Actuelle : `MontPC - Réparation Tech Haute Couture`
  - Recommandée : `Réparation iPhone, MacBook et PC à Saint-Gervais | MontPC Haute-Savoie`
  - ⏭️ À FAIRE

- [ ] **Ajouter une meta description** (manquante actuellement) :
  ```html
  <meta name="description" content="Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes à Saint-Gervais-les-Bains. Intervention rapide, devis gratuit et garantie sur toutes nos réparations en Haute-Savoie.">
  ```
  - ⏭️ À FAIRE

- [ ] **Ajouter les balises meta pour les réseaux sociaux** :
  ```html
  <!-- Open Graph pour Facebook -->
  <meta property="og:title" content="Réparation iPhone, MacBook et PC à Saint-Gervais | MontPC">
  <meta property="og:description" content="Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes. Intervention rapide, devis gratuit et garantie sur toutes nos réparations.">
  <meta property="og:image" content="https://montpc.com/img/og-image.jpg">
  <meta property="og:url" content="https://montpc.com">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Réparation iPhone, MacBook et PC à Saint-Gervais | MontPC">
  <meta name="twitter:description" content="Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes. Intervention rapide, devis gratuit et garantie.">
  <meta name="twitter:image" content="https://montpc.com/img/twitter-image.jpg">
  ```
  - ⏭️ À FAIRE

- [ ] **Ajouter une balise canonique** :
  ```html
  <link rel="canonical" href="https://montpc.com/">
  ```
  - ⏭️ À FAIRE

## 2. Structure des Balises et Contenu Sémantique

- [ ] **Améliorer la hiérarchie des titres H1, H2, H3** :
  - S'assurer que chaque page a un seul H1 (actuellement correct)
  - Structurer les sous-titres de sections avec des H2 (actuellement correct)
  - Ajouter des H3 pour les sous-sections (partiellement présent)
  - ⏭️ À FAIRE - Optimiser le H1 principal avec des mots-clés prioritaires et référence à la localité

- [ ] **Ajouter des balises Schema.org pour le Rich Snippet** :
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "MontPC",
    "description": "Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes à Saint-Gervais-les-Bains en Haute-Savoie.",
    "image": "https://montpc.com/img/logo.png",
    "url": "https://montpc.com",
    "telephone": "+33450581065",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "57 avenue du mont paccrad",
      "addressLocality": "Saint Gervais les Bains",
      "postalCode": "74170",
      "addressRegion": "Haute-Savoie",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "45.889462",
      "longitude": "6.713190"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "12:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "15:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "€€",
    "servesCuisine": "Réparation électronique"
  }
  </script>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Combien coûte la réparation d'un écran d'iPhone à Saint-Gervais ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le prix de la réparation d'un écran d'iPhone varie selon le modèle, de 49€ pour un iPhone SE à 129€ pour un iPhone 14 Pro Max. Tous nos prix incluent une garantie de 6 mois."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps prend la réparation d'un MacBook ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La plupart des réparations MacBook sont effectuées le jour même. Les réparations simples comme le remplacement de batterie prennent environ 1-2 heures, tandis que les réparations plus complexes peuvent prendre jusqu'à 48 heures."
        }
      },
      {
        "@type": "Question",
        "name": "Proposez-vous la récupération de données sur disque dur endommagé ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, nous offrons un service de récupération de données pour tous types de supports : disques durs, SSD, clés USB, cartes SD et smartphones. Notre taux de récupération est de 90% et nous garantissons la confidentialité de vos données."
        }
      }
    ]
  }
  </script>
  ```
  - ⏭️ À FAIRE

## 3. Optimisation du Contenu pour le SEO Local

- [ ] **Créer des pages spécifiques pour chaque service** :
  - `/reparation-iphone-haute-savoie/`
  - `/reparation-macbook-saint-gervais/`
  - `/reparation-ordinateur-portable-74/`
  - `/reparation-ipad-tablette-haute-savoie/`
  - `/recuperation-donnees-saint-gervais/`

- [ ] **Améliorer les textes existants avec des mots-clés** :
  - Ajouter "en Haute-Savoie" dans le texte d'introduction ⏭️ À FAIRE
  - Mentionner "Saint-Gervais-les-Bains" dans la description des services ⏭️ À FAIRE
  - Inclure les modèles populaires : "iPhone 14, iPhone 13, iPhone 12, iPhone 11, iPhone X, iPhone 8" ⏭️ À FAIRE
  - Mentionner "MacBook Pro, MacBook Air, iMac" dans les services Apple ⏭️ À FAIRE
  - Ajouter des références aux villes proches : "Megève, Sallanches, Chamonix" ⏭️ À FAIRE
  - ⏭️ À FAIRE - Optimiser les titres et descriptions de services avec références locales

- [ ] **Créer une section FAQ complète** avec les questions fréquentes :
  ```html
  <section id="faq" class="faq">
      <div class="container">
          <div class="section-header">
              <h2 class="reveal-text">Questions <span class="fashion-text">Fréquentes</span></h2>
              <p class="section-subheading reveal-text delay-1">Tout ce que vous devez savoir sur nos services de réparation</p>
          </div>
          <div class="faq-container">
              <div class="faq-item">
                  <div class="faq-question">
                      <h3>Combien coûte la réparation d'un écran d'iPhone à Saint-Gervais ?</h3>
                      <span class="faq-icon">+</span>
                  </div>
                  <div class="faq-answer">
                      <p>Le prix de la réparation d'un écran d'iPhone varie selon le modèle, de 49€ pour un iPhone SE à 129€ pour un iPhone 14 Pro Max. Tous nos prix incluent une garantie de 6 mois.</p>
                  </div>
              </div>
              <!-- Ajouter au moins 10 questions/réponses -->
          </div>
      </div>
  </section>
  ```
  - ⏭️ À FAIRE - Section FAQ à ajouter avec questions/réponses ciblées et optimisées pour le SEO local

## 4. Optimisation des Images

- [ ] **Renommer toutes les images avec des noms descriptifs** :
  - `reparation-iphone-saint-gervais.jpg` au lieu de `gallery-1.jpg`
  - `reparation-macbook-haute-savoie.jpg` au lieu de `gallery-2.jpg`
  - `recuperation-degats-eau-smartphone.jpg` au lieu de `gallery-3.jpg`
  - ⏭️ À FAIRE

- [ ] **Ajouter des attributs alt descriptifs à toutes les images** :
  ```html
  <img src="img/reparation-iphone-saint-gervais.jpg" alt="Technicien MontPC réparant un écran d'iPhone à Saint-Gervais">
  ```
  - ⏭️ À FAIRE - Optimiser les attributs alt des images principales de la galerie

- [ ] **Optimiser le poids des images** :
  - Compresser toutes les images sans perte de qualité
  - Utiliser le format WebP avec fallback JPG/PNG
  - Implémenter le lazy loading pour les images

## 5. Optimisation Technique

- [ ] **Améliorer la vitesse de chargement** :
  - Minifier les fichiers CSS et JavaScript
  - Mettre en place la mise en cache du navigateur
  - Implémenter la compression gzip/Brotli

- [ ] **Optimiser pour le mobile** :
  - Vérifier que le site est responsive (déjà bien implémenté)
  - Améliorer les temps de chargement sur mobile
  - Optimiser les interactions tactiles

- [ ] **Sécuriser le site** :
  - Mise en place HTTPS (obligatoire)
  - Ajouter les en-têtes de sécurité appropriés
  - Mettre en place une politique CSP (Content Security Policy)

## 6. Stratégie de Backlinks Locaux

- [ ] **Inscription aux annuaires locaux** :
  - Google Business Profile (priorité absolue)
  - Pages Jaunes
  - Annuaires de la CCI Haute-Savoie
  - Annuaires des commerces de Saint-Gervais

- [ ] **Partenariats avec des sites locaux** :
  - Office de tourisme de Saint-Gervais
  - Portails d'information locale
  - Associations de commerçants de Haute-Savoie

- [ ] **Créer du contenu pour des backlinks naturels** :
  - Guide de dépannage pour les problèmes courants d'iPhone
  - Conseils pour prolonger la durée de vie de votre MacBook
  - Articles sur les solutions aux problèmes spécifiques des appareils électroniques en montagne

## 7. Contenu Blog et Création de Valeur

- [ ] **Créer une section blog avec des articles SEO** :
  - "Comment protéger son iPhone du froid pendant le ski en Haute-Savoie"
  - "Les 10 problèmes les plus courants des MacBook et comment les résoudre"
  - "Guide complet : récupérer les photos de votre iPhone tombé dans la neige"
  - "Comparatif : où réparer son iPhone à Saint-Gervais et ses environs"

- [ ] **Ajouter des témoignages clients géolocalisés** :
  ```html
  <div class="testimonial-author">
      <div class="author-info">
          <div class="author-name">Sophie Laurent</div>
          <div class="author-title">Styliste, Megève</div>
      </div>
  </div>
  ```

## 8. Google Maps et Informations Locales

- [ ] **Intégrer Google Maps** dans la section contact :
  ```html
  <div class="map-container">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2770.123!2d6.713190!3d45.889462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTJ6MTIz!5e0!3m2!1sfr!2sfr!4v1234567890!5m2!1sfr!2sfr" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
  </div>
  ```
  - ⏭️ À FAIRE - Ajouter la carte dans la section contact

- [ ] **Ajouter des indications de localisation** :
  - Distance depuis les villes principales ⏭️ À FAIRE
  - Indications de parking ⏭️ À FAIRE
  - Accessibilité par les transports publics ⏭️ À FAIRE

## 9. Mots-clés à Cibler (Prioritaires)

- [ ] **Mots-clés principaux** :
  - "réparation iPhone Saint-Gervais"
  - "réparer MacBook Haute-Savoie"
  - "réparation écran iPhone 74"
  - "réparation PC portable Saint-Gervais"
  - "récupération données disque dur Haute-Savoie"

- [ ] **Mots-clés secondaires** :
  - "réparation iPad Saint-Gervais"
  - "changement batterie iPhone Haute-Savoie"
  - "réparation ordinateur après dégâts d'eau"
  - "déblocage iPhone Saint-Gervais"
  - "dépannage informatique urgence Haute-Savoie"

- [ ] **Mots-clés longue traîne** :
  - "combien coûte réparation écran iPhone 14 Pro Saint-Gervais"
  - "où faire réparer MacBook Pro qui ne s'allume plus en Haute-Savoie"
  - "récupérer photos iPhone tombé dans l'eau Saint-Gervais"

## 10. Plan d'Implémentation

### Phase 1 : Corrections techniques (1 semaine)
- Mise en place des balises meta
- Optimisation des images
- Structure Schema.org
- Google Business Profile

### Phase 2 : Contenu Ciblé (2-3 semaines)
- Création de pages spécifiques par service
- Rédaction des FAQ
- Optimisation textes existants

### Phase 3 : Contenu Enrichi (Mois 2)
- Création de la section blog
- Ajout de témoignages géolocalisés
- Création de guides thématiques

### Phase 4 : Stratégie de Backlinks (Mois 3-6)
- Inscriptions aux annuaires
- Partenariats locaux
- Relations presse locale

## 11. Suivi et Mesure

- [ ] **Mise en place de Google Analytics 4** avec suivi des événements
- [ ] **Configuration de Google Search Console** pour surveiller l'indexation
- [ ] **Création d'un tableau de bord de suivi** des positions pour les mots-clés cibles
- [ ] **Suivi mensuel des performances** avec ajustements de stratégie