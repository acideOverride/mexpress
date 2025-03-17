// FAQ content management script
document.addEventListener('DOMContentLoaded', function() {
    // Add a console log to debug
    console.log('FAQ script loaded');
    
    // Get parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const faqParam = urlParams.get('faq');
    
    // Show a debug message
    console.log('FAQ parameter:', faqParam);
    
    // Only process if we have a faq parameter
    if (faqParam === 'true') {
        console.log('FAQ parameter is true');
        
        // Find main container
        const mainElement = document.querySelector('main');
        console.log('Main element found:', mainElement);
        
        // If main exists, replace its content with faq content
        if (mainElement) {
            const pageTitle = 'Questions Fréquentes';
            const content = getFaqContent();
            
            // Create the content container
            mainElement.innerHTML = `
                <section class="faq-section">
                    <div class="container">
                        <div class="section-header">
                            <h1 class="reveal-text">${pageTitle}</h1>
                            <a href="index.html" class="back-link">← Retour à l'accueil</a>
                        </div>
                        ${content}
                    </div>
                </section>
            `;
            
            // Update page title
            document.title = `MontPC - ${pageTitle}`;
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Add FAQ interactivity
            initFaqAccordion();
        }
    }
});

// Function to initialize the FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class on the clicked item
            item.classList.toggle('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// Function to fetch and return FAQ content
function getFaqContent() {
    return `
        <div class="faq-content">
            <div class="faq-categories">
                <button class="faq-category-btn active" data-category="all">Toutes les questions</button>
                <button class="faq-category-btn" data-category="reparation">Réparations</button>
                <button class="faq-category-btn" data-category="prix">Prix & Devis</button>
                <button class="faq-category-btn" data-category="garantie">Garantie</button>
                <button class="faq-category-btn" data-category="service">Services</button>
            </div>

            <div class="faq-search-container">
                <div class="faq-search-wrapper">
                    <input type="text" id="faqSearch" class="faq-search-input" placeholder="Rechercher une question...">
                    <button class="faq-search-button">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="faq-list">
                <!-- Réparations -->
                <div class="faq-item" data-category="reparation">
                    <div class="faq-question">
                        <h3>Combien de temps prend une réparation d'écran de smartphone ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>La plupart des réparations d'écran sont effectuées en 1 à 2 heures. Pour les modèles plus récents ou complexes, cela peut prendre jusqu'à 4 heures. Nous proposons un service express pour les cas urgents, permettant une réparation en 30 à 60 minutes avec un supplément de prix.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="reparation">
                    <div class="faq-question">
                        <h3>Puis-je récupérer mes données avant la réparation ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Absolument, nous proposons un service de sauvegarde des données avant toute réparation à risque. Cette précaution est fortement recommandée pour les réparations majeures ou lorsque l'appareil présente déjà des problèmes de fonctionnement. Si votre appareil est encore fonctionnel, nous vous conseillons de sauvegarder vos données vous-même avant de nous le confier.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="reparation">
                    <div class="faq-question">
                        <h3>Mon ordinateur portable a subi des dégâts d'eau, que dois-je faire ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>En cas de dégâts d'eau :</p>
                        <ol>
                            <li>Éteignez immédiatement votre appareil et ne tentez pas de l'allumer</li>
                            <li>Retirez la batterie si possible</li>
                            <li>Ne séchez pas l'appareil avec un sèche-cheveux ou au four</li>
                            <li>Apportez-nous l'appareil dès que possible, idéalement dans les 24h</li>
                        </ol>
                        <p>Notre procédure spéciale de récupération après dégâts d'eau comprend un nettoyage aux ultrasons et un traitement anti-corrosion spécifique. Plus vous agissez vite, meilleures sont les chances de récupération complète.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="reparation">
                    <div class="faq-question">
                        <h3>Réparez-vous les MacBook et produits Apple ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Oui, nous sommes spécialisés dans la réparation de tous les produits Apple, y compris MacBook, iMac, Mac mini, iPhone et iPad. Notre équipe est certifiée pour les réparations Apple et utilise des pièces de haute qualité compatibles avec les standards Apple. Nous pouvons intervenir même sur les modèles récents avec puces T2/M1/M2, contrairement à beaucoup d'ateliers de réparation.</p>
                    </div>
                </div>

                <!-- Prix & Devis -->
                <div class="faq-item" data-category="prix">
                    <div class="faq-question">
                        <h3>Le diagnostic est-il gratuit ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Le diagnostic rapide est gratuit pour la plupart des appareils courants. Pour les diagnostics approfondis nécessitant un démontage ou des tests spécifiques, nous facturons 39€ à 59€ selon la complexité. Ce montant est déduit du prix final si vous procédez à la réparation avec nous. Pour les diagnostics Apple spécialisés, le tarif est de 69€, également déduit en cas de réparation.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="prix">
                    <div class="faq-question">
                        <h3>Comment sont calculés vos tarifs de réparation ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Nos tarifs comprennent deux éléments principaux :</p>
                        <ol>
                            <li><strong>Main d'œuvre</strong> : Coût fixe selon le type de réparation et la complexité</li>
                            <li><strong>Pièces détachées</strong> : Prix des composants nécessaires</li>
                        </ol>
                        <p>Nous pratiquons une politique de transparence totale : le devis détaille toujours ces deux aspects séparément. Vous pouvez consulter notre <a href="index.html?legal=tarifs">grille tarifaire complète</a> pour plus d'informations.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="prix">
                    <div class="faq-question">
                        <h3>Proposez-vous des formules d'abonnement ou des forfaits pour les entreprises ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Oui, nous proposons des formules spécifiques pour les professionnels et entreprises :</p>
                        <ul>
                            <li>Forfait maintenance annuelle pour particuliers : 179€/an</li>
                            <li>Forfait maintenance annuelle pour professionnels : 349€/an</li>
                            <li>Contrats de service personnalisés pour les entreprises avec un parc informatique</li>
                        </ul>
                        <p>Nos contrats professionnels incluent des interventions prioritaires, un temps de réponse garanti et des tarifs préférentiels sur l'ensemble de nos services. Contactez-nous pour une proposition adaptée à vos besoins spécifiques.</p>
                    </div>
                </div>

                <!-- Garantie -->
                <div class="faq-item" data-category="garantie">
                    <div class="faq-question">
                        <h3>Quelle garantie offrez-vous sur vos réparations ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Toutes nos réparations sont garanties 3 mois pièces et main d'œuvre. Cette garantie couvre :</p>
                        <ul>
                            <li>Les défauts de la pièce remplacée</li>
                            <li>Les problèmes liés directement à notre intervention</li>
                            <li>La main d'œuvre en cas de nouvelle intervention nécessaire</li>
                        </ul>
                        <p>Les conditions détaillées de notre garantie sont disponibles dans nos <a href="index.html?legal=conditions-reparation">Conditions Générales de Réparation</a>.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="garantie">
                    <div class="faq-question">
                        <h3>Que faire si mon appareil présente un problème après réparation ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Si vous constatez un problème après une réparation :</p>
                        <ol>
                            <li>Contactez-nous immédiatement par téléphone ou email</li>
                            <li>Décrivez précisément le problème rencontré</li>
                            <li>Apportez l'appareil à notre boutique avec votre facture</li>
                        </ol>
                        <p>Nous examinerons l'appareil en priorité et, si le problème est couvert par notre garantie, nous effectuerons la réparation gratuitement. Pour faciliter le processus, conservez toujours votre facture qui sert de justificatif de garantie.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="garantie">
                    <div class="faq-question">
                        <h3>La garantie constructeur est-elle maintenue après votre intervention ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Selon les constructeurs, la garantie d'origine peut être affectée par une intervention tierce. En général :</p>
                        <ul>
                            <li>Apple et la plupart des fabricants considèrent que leur garantie ne couvre plus l'appareil après une intervention externe</li>
                            <li>Certains fabricants maintiennent leur garantie pour les parties non concernées par notre intervention</li>
                        </ul>
                        <p>Nous vous informons toujours clairement de cette situation avant d'intervenir sur un appareil sous garantie constructeur. Notre propre garantie de 3 mois prend alors le relais sur les éléments que nous avons réparés.</p>
                    </div>
                </div>

                <!-- Services -->
                <div class="faq-item" data-category="service">
                    <div class="faq-question">
                        <h3>Proposez-vous un service de récupération de données ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Oui, nous offrons un service complet de récupération de données pour :</p>
                        <ul>
                            <li>Disques durs défectueux ou endommagés</li>
                            <li>SSD et clés USB corrompus</li>
                            <li>Cartes SD et microSD illisibles</li>
                            <li>Smartphones et tablettes endommagés</li>
                            <li>Erreurs logicielles et suppressions accidentelles</li>
                        </ul>
                        <p>Nos tarifs débutent à 99€ pour les récupérations simples et varient selon la complexité du cas. Nous garantissons une confidentialité totale et ne facturons que si la récupération est réussie dans les cas de panne matérielle.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="service">
                    <div class="faq-question">
                        <h3>Vendez-vous également des ordinateurs et des pièces détachées ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Oui, nous proposons à la vente :</p>
                        <ul>
                            <li>Ordinateurs fixes et portables neufs (gammes bureautique, multimédia et gaming)</li>
                            <li>Pièces détachées pour PC, smartphones et tablettes</li>
                            <li>Accessoires et périphériques</li>
                            <li>Solutions de stockage (disques durs, SSD, NAS)</li>
                        </ul>
                        <p>Nous pouvons également configurer des ordinateurs sur mesure selon vos besoins spécifiques. Consultez notre <a href="index.html?legal=tarifs">grille tarifaire</a> pour découvrir notre gamme complète de produits.</p>
                    </div>
                </div>

                <div class="faq-item" data-category="service">
                    <div class="faq-question">
                        <h3>Proposez-vous des services d'assistance et de formation ?</h3>
                        <div class="faq-icon">
                            <svg class="icon-plus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-minus" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>Oui, nous offrons plusieurs services d'assistance et de formation :</p>
                        <ul>
                            <li><strong>Assistance à domicile</strong> : Installation, configuration et dépannage de vos équipements</li>
                            <li><strong>Formation personnalisée</strong> : Sessions adaptées à votre niveau pour maîtriser votre ordinateur, smartphone ou tablette</li>
                            <li><strong>Assistance à distance</strong> : Support technique par téléphone ou prise en main à distance</li>
                        </ul>
                        <p>Nos services de formation sont particulièrement adaptés aux seniors ou aux personnes peu familières avec la technologie. Le tarif est de 79€/heure pour les formations personnalisées, avec des forfaits disponibles pour plusieurs sessions.</p>
                    </div>
                </div>
            </div>

            <div class="faq-not-found" style="display: none;">
                <div class="faq-not-found-content">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                        <path d="M12 14V12M12 10H12.01M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Nous n'avons pas trouvé de réponse correspondant à votre recherche.</p>
                    <p>Essayez d'autres mots-clés ou contactez-nous directement.</p>
                    <a href="#contact" class="btn secondary-btn">Nous contacter</a>
                </div>
            </div>

            <div class="faq-footer">
                <p>Vous n'avez pas trouvé de réponse à votre question ? N'hésitez pas à nous contacter directement.</p>
                <div class="faq-contact-buttons">
                    <a href="#contact" class="btn primary-btn">Formulaire de contact</a>
                    <a href="tel:+33450581065" class="btn secondary-btn">Appeler maintenant</a>
                </div>
            </div>
        </div>
    `;
}

// Add CSS styles for FAQ section
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const faqParam = urlParams.get('faq');
    
    if (faqParam === 'true') {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .faq-section {
                padding: 3rem 0;
            }
            
            .section-header {
                margin-bottom: 2rem;
                text-align: center;
            }
            
            .back-link {
                display: block;
                margin-top: 1rem;
                color: var(--primary);
                text-decoration: none;
                font-weight: 500;
            }
            
            .back-link:hover {
                text-decoration: underline;
            }
            
            .faq-content {
                background-color: var(--background);
                border-radius: 8px;
                padding: 2rem;
                box-shadow: 0 4px 30px var(--shadow-color);
                margin-bottom: 2rem;
            }
            
            .faq-categories {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 1.5rem;
                justify-content: center;
            }
            
            .faq-category-btn {
                background-color: var(--neutral-100);
                border: 1px solid var(--neutral-200);
                border-radius: 30px;
                padding: 8px 16px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .faq-category-btn.active {
                background-color: var(--primary);
                color: white;
                border-color: var(--primary);
            }
            
            .dark-mode .faq-category-btn {
                background-color: var(--neutral-800);
                border-color: var(--neutral-700);
            }
            
            .dark-mode .faq-category-btn.active {
                background-color: var(--primary);
                border-color: var(--primary);
            }
            
            .faq-search-container {
                margin-bottom: 2rem;
            }
            
            .faq-search-wrapper {
                position: relative;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .faq-search-input {
                width: 100%;
                padding: 12px 20px;
                padding-right: 50px;
                border-radius: 30px;
                border: 1px solid var(--neutral-300);
                background-color: var(--background);
                font-size: 1rem;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
            }
            
            .faq-search-input:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
            }
            
            .faq-search-button {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }
            
            .faq-search-button:hover {
                background-color: var(--neutral-100);
            }
            
            .faq-search-button svg {
                width: 20px;
                height: 20px;
            }
            
            .dark-mode .faq-search-input {
                background-color: var(--neutral-800);
                border-color: var(--neutral-700);
                color: var(--text-primary);
            }
            
            .dark-mode .faq-search-button:hover {
                background-color: var(--neutral-700);
            }
            
            .faq-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .faq-item {
                border: 1px solid var(--neutral-200);
                border-radius: 8px;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .faq-question {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.2rem;
                cursor: pointer;
                background-color: var(--neutral-50);
                transition: background-color 0.3s ease;
            }
            
            .faq-question h3 {
                margin: 0;
                font-size: 1.1rem;
                color: var(--text-primary);
                transition: color 0.3s ease;
                flex: 1;
                padding-right: 1rem;
            }
            
            .faq-icon {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-secondary);
                transition: transform 0.3s ease;
            }
            
            .faq-icon svg {
                width: 24px;
                height: 24px;
            }
            
            .faq-icon .icon-minus {
                display: none;
            }
            
            .faq-answer {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s ease, padding 0.3s ease;
                background-color: var(--background);
            }
            
            .faq-answer p, .faq-answer ul, .faq-answer ol {
                color: var(--text-secondary);
                margin-top: 0;
                line-height: 1.6;
            }
            
            .faq-answer ul, .faq-answer ol {
                padding-left: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .faq-answer a {
                color: var(--primary);
                text-decoration: none;
                font-weight: 500;
            }
            
            .faq-answer a:hover {
                text-decoration: underline;
            }
            
            .faq-item.active {
                border-color: var(--primary);
                box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.1);
            }
            
            .faq-item.active .faq-question {
                background-color: var(--primary-light);
                color: white;
            }
            
            .faq-item.active .faq-question h3 {
                color: white;
            }
            
            .faq-item.active .faq-icon {
                color: white;
                transform: rotate(180deg);
            }
            
            .faq-item.active .faq-icon .icon-plus {
                display: none;
            }
            
            .faq-item.active .faq-icon .icon-minus {
                display: block;
            }
            
            .faq-item.active .faq-answer {
                max-height: 2000px;
                padding: 1.5rem;
            }
            
            .dark-mode .faq-item {
                border-color: var(--neutral-700);
            }
            
            .dark-mode .faq-question {
                background-color: var(--neutral-800);
            }
            
            .dark-mode .faq-item.active {
                border-color: var(--primary);
            }
            
            .dark-mode .faq-item.active .faq-question {
                background-color: var(--primary-dark);
            }
            
            .faq-not-found {
                text-align: center;
                padding: 3rem 1rem;
            }
            
            .faq-not-found-content {
                max-width: 500px;
                margin: 0 auto;
            }
            
            .faq-not-found svg {
                color: var(--primary);
                margin-bottom: 1rem;
            }
            
            .faq-not-found h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            
            .faq-not-found p {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            
            .faq-not-found .btn {
                margin-top: 1.5rem;
            }
            
            .faq-footer {
                text-align: center;
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 1px solid var(--neutral-200);
            }
            
            .faq-footer p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }
            
            .faq-contact-buttons {
                display: flex;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .dark-mode .faq-footer {
                border-top-color: var(--neutral-700);
            }
            
            @media (max-width: 768px) {
                .faq-categories {
                    justify-content: flex-start;
                    overflow-x: auto;
                    padding-bottom: 10px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                
                .faq-categories::-webkit-scrollbar {
                    display: none;
                }
                
                .faq-category-btn {
                    white-space: nowrap;
                }
                
                .faq-question h3 {
                    font-size: 1rem;
                }
                
                .faq-content {
                    padding: 1.5rem;
                }
                
                .faq-item.active .faq-answer {
                    padding: 1rem;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
        
        // Add event listeners for search and category filters
        document.addEventListener('DOMContentLoaded', function() {
            initFaqFilters();
        });
    }
});

// Initialize FAQ filters (search and categories)
function initFaqFilters() {
    const searchInput = document.getElementById('faqSearch');
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqNotFound = document.querySelector('.faq-not-found');
    
    if (!searchInput || !faqItems.length) return;
    
    // Search functionality
    searchInput.addEventListener('input', filterFaqs);
    
    // Category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter FAQs based on category
            filterFaqs();
        });
    });
    
    function filterFaqs() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeCategory = document.querySelector('.faq-category-btn.active').dataset.category;
        
        let visibleCount = 0;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            const itemCategory = item.dataset.category;
            
            const matchesSearch = searchTerm === '' || question.includes(searchTerm) || answer.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || itemCategory === activeCategory;
            
            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide "not found" message
        if (visibleCount === 0 && (searchTerm !== '' || activeCategory !== 'all')) {
            faqNotFound.style.display = 'block';
        } else {
            faqNotFound.style.display = 'none';
        }
    }
}