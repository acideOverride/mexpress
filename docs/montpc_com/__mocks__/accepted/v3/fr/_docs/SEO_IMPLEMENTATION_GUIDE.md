# Guide d'Implémentation Technique SEO
## MontPC.com - Optimisation pour le marché de la Haute-Savoie

Ce document technique détaille les modifications spécifiques à apporter au code du site MontPC.com pour optimiser son référencement, en particulier pour les termes liés à la réparation d'appareils électroniques en Haute-Savoie.

## 1. Modifications du Head - index.html

### 1.1 Balises Meta Essentielles

Remplacer le contenu actuel du `<head>` par:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réparation iPhone, MacBook et PC à Saint-Gervais | MontPC Haute-Savoie</title>
    <meta name="description" content="Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes à Saint-Gervais-les-Bains. Intervention rapide, devis gratuit et garantie sur toutes nos réparations en Haute-Savoie.">
    
    <!-- Balises Meta pour les robots -->
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://montpc.com/">
    
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://montpc.com/">
    <meta property="og:title" content="Réparation iPhone, MacBook et PC à Saint-Gervais | MontPC">
    <meta property="og:description" content="Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes. Intervention rapide, devis gratuit et garantie sur toutes nos réparations.">
    <meta property="og:image" content="https://montpc.com/img/og-image.jpg">
    <meta property="og:locale" content="fr_FR">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://montpc.com/">
    <meta name="twitter:title" content="Réparation iPhone, MacBook et PC à Saint-Gervais | MontPC">
    <meta name="twitter:description" content="Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes. Intervention rapide, devis gratuit et garantie.">
    <meta name="twitter:image" content="https://montpc.com/img/twitter-image.jpg">
    
    <!-- Stylesheet -->
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="cookies/cookie-consent.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap">
    
    <!-- Preloading -->
    <link rel="preload" href="js/main.js" as="script">
    <link rel="preload" href="fonts/custom-font.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "MontPC",
      "description": "Centre de réparation professionnel d'iPhone, MacBook, PC et tablettes à Saint-Gervais-les-Bains en Haute-Savoie.",
      "image": "https://montpc.com/img/logo.png",
      "url": "https://montpc.com",
      "telephone": "+33450581065",
      "priceRange": "€€",
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
      "sameAs": [
        "https://www.facebook.com/MONTPC.Reparations.Ordinateur.Apple.PC.iPhone.iPad",
        "https://www.instagram.com/explore/locations/475776189141937/montpc-services-informatiques/",
        "https://x.com/mont_pc"
      ]
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
</head>
```

## 2. Optimisation de la Hero Section

⏭️ À FAIRE: Remplacer le contenu actuel de la section hero par:

```html
<section class="hero">
    <div class="container">
        <div class="hero-content">
            <h1 class="reveal-text">Réparation iPhone, MacBook et PC <span class="fashion-text">à Saint-Gervais</span></h1>
            <p class="subtitle reveal-text delay-1">Centre technique haute performance en Haute-Savoie. Réparation express et garantie pour tous vos appareils.</p>
            <div class="location-badge">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Saint-Gervais-les-Bains, Haute-Savoie (74)</span>
            </div>
            <div class="cta-buttons">
                <a href="#services" class="btn primary-btn">Nos Services de Réparation</a>
                <a href="#contact" class="btn secondary-btn">Demander un Devis</a>
            </div>
        </div>
        <div class="hero-visual">
            <div class="device-showcase">
                <div class="device phone">
                    <div class="device-screen">
                        <div class="device-content"></div>
                    </div>
                    <div class="device-details">
                        <span class="device-label">Réparation iPhone en Haute-Savoie</span>
                    </div>
                </div>
                <div class="device laptop">
                    <div class="device-screen">
                        <div class="device-content"></div>
                    </div>
                    <div class="device-details">
                        <span class="device-label">Réparation MacBook à Saint-Gervais</span>
                    </div>
                </div>
                <div class="cute-accent accent-1"></div>
                <div class="cute-accent accent-2"></div>
                <div class="cute-accent accent-3"></div>
            </div>
        </div>
    </div>
    <div class="hero-pattern"></div>
</section>
```

## 3. Optimisation des Cartes de Services

⏭️ À FAIRE: Remplacer le contenu des cartes de services par:

```html
<div class="service-cards" style="opacity: 0.9;">
    <div class="service-card" data-service="phone">
        <div class="service-card-inner">
            <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>Réparation iPhone Haute-Savoie</h3>
            <p>Remplacement d'écran, batterie, récupération après dégâts d'eau. Service express pour tous modèles d'iPhone à Saint-Gervais.</p>
            <div class="service-features">
                <span>Service 1h</span>
                <span>Garantie 6 mois</span>
            </div>
            <a href="#contact" class="service-link">Voir tarifs et services</a>
            <div class="card-glare"></div>
            <div class="cute-detail"></div>
        </div>
    </div>
    <div class="service-card" data-service="laptop">
        <div class="service-card-inner">
            <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 16V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 16H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 20H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>Réparation MacBook Saint-Gervais</h3>
            <p>Mise à niveau matérielle, réparation carte mère, remplacement SSD/RAM. Expertise Apple pour MacBook Pro et Air en Haute-Savoie.</p>
            <div class="service-features">
                <span>Même jour</span>
                <span>Pièces certifiées</span>
            </div>
            <a href="#contact" class="service-link">Voir tarifs et services</a>
            <div class="card-glare"></div>
            <div class="cute-detail"></div>
        </div>
    </div>
    <div class="service-card" data-service="tablet">
        <div class="service-card-inner">
            <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>Réparation iPad et Tablettes 74</h3>
            <p>Réparations d'écran, ports de charge et dépannage logiciel avec soin. Spécialistes iPad en Haute-Savoie.</p>
            <div class="service-features">
                <span>Express</span>
                <span>Garantie 6 mois</span>
            </div>
            <a href="#contact" class="service-link">Voir tarifs et services</a>
            <div class="card-glare"></div>
            <div class="cute-detail"></div>
        </div>
    </div>
    <div class="service-card" data-service="data">
        <div class="service-card-inner">
            <div class="service-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 16.1046 19.1046 17 17 17C14.8954 17 13 16.1046 13 15M21 15C21 13.8954 19.1046 13 17 13C14.8954 13 13 13.8954 13 15M21 15V19C21 20.1046 19.1046 21 17 21C14.8954 21 13 20.1046 13 19V15M21 11C21 12.1046 19.1046 13 17 13M21 11C21 9.89543 19.1046 9 17 9C14.8954 9 13 9.89543 13 11M21 11V15M13 11C13 12.1046 14.8954 13 17 13M13 11V15M11 9C11 10.1046 9.10457 11 7 11C4.89543 11 3 10.1046 3 9M11 9C11 7.89543 9.10457 7 7 7C4.89543 7 3 7.89543 3 9M11 9V13C11 14.1046 9.10457 15 7 15C4.89543 15 3 14.1046 3 13V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>Récupération de Données Saint-Gervais</h3>
            <p>Récupération professionnelle de photos, vidéos et documents à partir de tous types de supports en Haute-Savoie.</p>
            <div class="service-features">
                <span>Sécurisé</span>
                <span>Taux succès 90%</span>
            </div>
            <a href="#contact" class="service-link">Voir tarifs et services</a>
            <div class="card-glare"></div>
            <div class="cute-detail"></div>
        </div>
    </div>
</div>
```

## 4. Ajout d'une Section FAQ

⏭️ À FAIRE: Ajouter cette section avant la section contact:

```html
<section id="faq" class="faq">
    <div class="container">
        <div class="section-header">
            <h2 class="reveal-text">Questions <span class="fashion-text">Fréquentes</span></h2>
            <p class="section-subheading reveal-text delay-1">Tout ce que vous devez savoir sur nos services de réparation en Haute-Savoie</p>
        </div>
        <div class="faq-container">
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Combien coûte la réparation d'un écran d'iPhone à Saint-Gervais ?</h3>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>Le prix de la réparation d'un écran d'iPhone varie selon le modèle, de 49€ pour un iPhone SE à 129€ pour un iPhone 14 Pro Max. Tous nos prix incluent une garantie de 6 mois et l'intervention est généralement réalisée en 1 heure.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Combien de temps prend la réparation d'un MacBook ?</h3>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>La plupart des réparations MacBook sont effectuées le jour même à notre atelier de Saint-Gervais. Les réparations simples comme le remplacement de batterie prennent environ 1-2 heures, tandis que les réparations plus complexes peuvent prendre jusqu'à 48 heures.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Proposez-vous la récupération de données sur disque dur endommagé ?</h3>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>Oui, notre service de récupération de données à Saint-Gervais prend en charge tous types de supports : disques durs, SSD, clés USB, cartes SD et smartphones. Notre taux de récupération est de 90% et nous garantissons la confidentialité de vos données.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Utilisez-vous des pièces d'origine pour les réparations iPhone ?</h3>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>Nous utilisons des pièces de qualité équivalente à l'original, ce qui nous permet d'offrir le meilleur rapport qualité-prix pour nos clients en Haute-Savoie. Toutes nos pièces sont testées et garanties pendant 6 mois.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Est-il possible de faire réparer mon appareil à distance si je suis dans une autre ville de Haute-Savoie ?</h3>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>Oui, nous proposons un service d'envoi sécurisé pour les clients ne pouvant pas se déplacer à notre atelier de Saint-Gervais. Nous desservons toute la Haute-Savoie : Megève, Sallanches, Chamonix, Passy, Cluses, etc. Contactez-nous pour organiser l'envoi de votre appareil.</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

## 5. Amélioration de la Section Contact

⏭️ À FAIRE: Optimiser la section contact en ajoutant une carte Google Maps et des informations locales:

```html
<section id="contact" class="contact">
    <div class="container">
        <div class="section-header">
            <h2 class="reveal-text">Réparez Votre Appareil <span class="fashion-text">à Saint-Gervais</span></h2>
            <p class="section-subheading reveal-text delay-1">Centre technique haute performance en Haute-Savoie</p>
        </div>
        <div class="contact-content">
            <div class="contact-form-container">
                <form class="contact-form">
                    <!-- Conserver le formulaire existant -->
                </form>
                <div class="form-decoration"></div>
                <div class="cute-accent form-accent-1"></div>
                <div class="cute-accent form-accent-2"></div>
            </div>
            <div class="contact-info">
                <h3>Notre Atelier de Réparation en Haute-Savoie</h3>
                <div class="contact-details">
                    <div class="contact-item">
                        <div class="contact-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p>57 avenue du mont paccrad</p>
                            <p>74170 Saint Gervais les Bains</p>
                            <p class="nearby-cities">À proximité de : Megève (15min), Sallanches (20min), Chamonix (30min)</p>
                        </div>
                    </div>
                    <!-- Conserver les autres éléments de contact -->
                </div>
                <div class="map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2770.123!2d6.713190!3d45.889462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTJ6MTIz!5e0!3m2!1sfr!2sfr!4v1234567890!5m2!1sfr!2sfr" width="100%" height="250" style="border:0; border-radius: 12px; margin-top: 20px;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            </div>
        </div>
    </div>
</section>
```

## 6. Optimisation des Images

### 6.1 Attributs Alt pour Images

⏭️ À FAIRE: Mettre à jour les attributs alt des images dans la galerie:

```html
<div class="gallery-grid">
    <div class="gallery-item">
        <div class="gallery-image">
            <img src="img/reparation-iphone-saint-gervais.jpg" alt="Technicien MontPC réparant un écran d'iPhone à Saint-Gervais">
        </div>
        <div class="gallery-caption">
            <h4>Remplacement Écran iPhone</h4>
            <p>Réparation précise avec clarté bord à bord</p>
        </div>
    </div>
    <div class="gallery-item">
        <div class="gallery-image">
            <img src="img/reparation-macbook-haute-savoie.jpg" alt="Réparation de carte mère MacBook Pro par MontPC en Haute-Savoie">
        </div>
        <div class="gallery-caption">
            <h4>Réparation Carte Mère MacBook</h4>
            <p>Excellence en micro-soudure</p>
        </div>
    </div>
    <div class="gallery-item">
        <div class="gallery-image">
            <img src="img/recuperation-degats-eau-smartphone-74.jpg" alt="Smartphone récupéré après dégâts d'eau à Saint-Gervais">
        </div>
        <div class="gallery-caption">
            <h4>Récupération Dégâts d'Eau</h4>
            <p>Restauré en parfait état</p>
        </div>
    </div>
    <div class="gallery-item">
        <div class="gallery-image">
            <img src="img/configuration-pc-gaming-haute-savoie.jpg" alt="Configuration PC gaming personnalisée par MontPC Haute-Savoie">
        </div>
        <div class="gallery-caption">
            <h4>Configuration Gaming Personnalisée</h4>
            <p>Performance rencontre esthétique</p>
        </div>
    </div>
</div>
```

### 6.2 Témoignages Géolocalisés

⏭️ À FAIRE: Mettre à jour les témoignages avec des informations géographiques:

```html
<div class="testimonial-author">
    <div class="author-image">
        <img src="img/testimonial-1.jpg" alt="Sophie Laurent de Megève, cliente satisfaite de MontPC">
    </div>
    <div class="author-info">
        <div class="author-name">Sophie Laurent</div>
        <div class="author-title">Styliste, Megève</div>
    </div>
</div>

<!-- Répéter pour les autres témoignages -->
```

## 7. Ajout de CSS pour les Nouveaux Éléments

⏭️ À FAIRE: Ajouter ce CSS dans le fichier styles.css:

```css
/* Location Badge Styling */
.location-badge {
    display: inline-flex;
    align-items: center;
    background-color: rgba(var(--primary-rgb), 0.1);
    border: 1px solid rgba(var(--primary-rgb), 0.2);
    padding: 6px 12px;
    border-radius: 20px;
    margin-bottom: 20px;
    font-size: 0.9rem;
    color: var(--primary-color);
}

.location-badge svg {
    margin-right: 6px;
}

/* FAQ Section Styling */
.faq {
    padding: 80px 0;
    background-color: var(--bg-color);
}

.faq-container {
    max-width: 800px;
    margin: 40px auto 0;
}

.faq-item {
    margin-bottom: 20px;
    border: 1px solid rgba(var(--text-rgb), 0.1);
    border-radius: 12px;
    overflow: hidden;
}

.faq-question {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(var(--primary-rgb), 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
}

.faq-question:hover {
    background-color: rgba(var(--primary-rgb), 0.1);
}

.faq-question h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
}

.faq-icon {
    font-size: 1.5rem;
    color: var(--primary-color);
    transition: transform 0.3s ease;
}

.faq-item.active .faq-icon {
    transform: rotate(45deg);
}

.faq-answer {
    padding: 0 20px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
}

.faq-item.active .faq-answer {
    padding: 20px;
    max-height: 1000px;
}

/* Map Container Styling */
.map-container {
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.nearby-cities {
    font-size: 0.85rem;
    color: rgba(var(--text-rgb), 0.7);
    margin-top: 5px;
}
```

## 8. Ajout de JavaScript pour les FAQ

⏭️ À FAIRE: Ajouter ce script à la fin du fichier main.js:

```javascript
// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
```

## 9. Optimisation des URL et Redirections

⏭️ À FAIRE: Créer un fichier .htaccess à la racine du site:

```
# Redirection du www vers non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www.montpc.com [NC]
RewriteRule ^(.*)$ https://montpc.com/$1 [L,R=301]

# Forcer HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compression Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Cache du navigateur
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>

# En-têtes de sécurité
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Redirections pour les URLs en français
Redirect 301 /reparation-iphone /reparation-iphone-haute-savoie
Redirect 301 /reparation-macbook /reparation-macbook-saint-gervais
Redirect 301 /reparation-ordinateur /reparation-ordinateur-portable-74
Redirect 301 /reparation-tablette /reparation-ipad-tablette-haute-savoie
Redirect 301 /recuperation-donnees /recuperation-donnees-saint-gervais
```

## 10. Sitemap.xml

⏭️ À FAIRE: Créer un fichier sitemap.xml à la racine du site:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://montpc.com/</loc>
    <lastmod>2025-03-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://montpc.com/reparation-iphone-haute-savoie/</loc>
    <lastmod>2025-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://montpc.com/reparation-macbook-saint-gervais/</loc>
    <lastmod>2025-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://montpc.com/reparation-ordinateur-portable-74/</loc>
    <lastmod>2025-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://montpc.com/reparation-ipad-tablette-haute-savoie/</loc>
    <lastmod>2025-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://montpc.com/recuperation-donnees-saint-gervais/</loc>
    <lastmod>2025-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 11. robots.txt

⏭️ À FAIRE: Créer un fichier robots.txt à la racine du site:

```
User-agent: *
Allow: /
Disallow: /css/
Disallow: /js/
Disallow: /cookies/

Sitemap: https://montpc.com/sitemap.xml
```

## 12. Google Search Console & Google Analytics

### 12.1 Google Search Console - HTML Tag

⏭️ À FAIRE: Ajouter la balise de vérification dans le head:

```html
<meta name="google-site-verification" content="[VOTRE_CODE_VERIFICATION]" />
```

### 12.2 Google Analytics 4 Setup

⏭️ À FAIRE: Ajouter le script Google Analytics 4 juste avant la fermeture du head:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX', {
    'page_title': 'Réparation iPhone, MacBook et PC à Saint-Gervais | MontPC',
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
```

## 13. Vérification et Tests

### 13.1 Points de Vérification Avant Mise en Ligne

⏭️ À FAIRE :
- Valider le HTML avec W3C Validator
- Tester la vitesse avec Google PageSpeed Insights
- Vérifier le responsive sur tous les appareils
- Tester tous les liens et formulaires
- Vérifier que les schema.org sont correctement formatés avec l'outil Rich Results Test
- Vérifier les méta-données avec l'outil de partage de Facebook

### 13.2 Suivi Post-Lancement

⏭️ À FAIRE :
- Configurer des alertes de position dans Google Search Console
- Mettre en place des suivis de conversion dans Google Analytics
- Configurer des rapports hebdomadaires pour suivre les progrès