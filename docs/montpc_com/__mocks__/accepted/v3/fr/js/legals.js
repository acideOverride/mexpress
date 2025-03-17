// Legal content management script
document.addEventListener('DOMContentLoaded', function() {
    // Get parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const legalParam = urlParams.get('legal');
    
    // Only process if we have a legal parameter
    if (legalParam) {
        // Find main container
        const mainElement = document.querySelector('main');
        
        // If main exists, replace its content with legal content
        if (mainElement) {
            let pageTitle = '';
            let content = '';
            
            // Determine which legal content to show
            switch(legalParam) {
                case 'cgv':
                    pageTitle = 'Conditions Générales de Vente';
                    content = getLegalContent('cgv');
                    break;
                case 'conditions-utilisation':
                    pageTitle = 'Conditions d\'Utilisation';
                    content = getLegalContent('conditions-utilisation');
                    break;
                case 'politique-confidentialite':
                    pageTitle = 'Politique de Confidentialité';
                    content = getLegalContent('politique-confidentialite');
                    break;
                case 'conditions-reparation':
                    pageTitle = 'Conditions Générales de Réparation';
                    content = getLegalContent('conditions-reparation');
                    break;
                case 'tarifs':
                    pageTitle = 'Grille Tarifaire';
                    content = getLegalContent('tarifs');
                    break;
                default:
                    pageTitle = 'Mentions Légales';
                    content = `
                        <div class="legal-content">
                            <h1>Mentions Légales</h1>
                            <p>Sélectionnez une des catégories ci-dessous pour consulter nos informations légales.</p>
                            
                            <div class="legal-cards">
                                <div class="legal-card">
                                    <h2>Conditions Générales de Vente</h2>
                                    <p>Découvrez nos conditions générales de vente pour vos achats de produits et de services MontPC.</p>
                                    <a href="index.html?legal=cgv" class="btn secondary-btn">Consulter</a>
                                </div>
                                
                                <div class="legal-card">
                                    <h2>Conditions Générales de Réparation</h2>
                                    <p>Apprenez-en plus sur nos procédures et garanties pour les services de réparation informatique.</p>
                                    <a href="index.html?legal=conditions-reparation" class="btn secondary-btn">Consulter</a>
                                </div>
                                
                                <div class="legal-card">
                                    <h2>Politique de Confidentialité</h2>
                                    <p>Consultez notre politique de confidentialité pour comprendre comment nous protégeons vos données personnelles.</p>
                                    <a href="index.html?legal=politique-confidentialite" class="btn secondary-btn">Consulter</a>
                                </div>
                                
                                <div class="legal-card">
                                    <h2>Conditions d'Utilisation</h2>
                                    <p>Nos conditions d'utilisation du site web et des services en ligne MontPC.</p>
                                    <a href="index.html?legal=conditions-utilisation" class="btn secondary-btn">Consulter</a>
                                </div>
                                
                                <div class="legal-card">
                                    <h2>Tarifs</h2>
                                    <p>Consultez nos grilles tarifaires pour nos différentes prestations de services informatiques.</p>
                                    <a href="index.html?legal=tarifs" class="btn secondary-btn">Consulter</a>
                                </div>
                            </div>
                        </div>
                    `;
            }
            
            // Create the content container
            mainElement.innerHTML = `
                <section class="legal-section">
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
        }
    }
});

// Function to fetch and return legal content
function getLegalContent(type) {
    // Store the content for each legal type
    const legalContent = {
        'cgv': `
            <div class="legal-content">
                <h2>1. Présentation de l'Entreprise</h2>
                <p><strong>MONTPC - Services Informatiques</strong> est une entreprise individuelle immatriculée sous le numéro SIRET 52840548300025, dont le siège social est situé au 57 avenue du mont paccard, 74170 Saint Gervais les bains, France.</p>
                <p>Spécialiste de la réparation et de la vente de matériel informatique à Saint-Gervais-les-Bains, MONTPC - Services Informatiques propose des ordinateurs, périphériques, accessoires et consommables de qualité pour les particuliers et les professionnels.</p>
                
                <h2>2. Application des Conditions Générales de Vente</h2>
                
                <h3>2.1 Objet</h3>
                <p>Les présentes Conditions Générales de Vente (ci-après "CGV") s'appliquent à toutes les ventes de produits effectuées par MONTPC - Services Informatiques, tant sur son site internet montpc.com que dans son point de vente physique à Saint-Gervais-les-Bains.</p>
                
                <h3>2.2 Acceptation</h3>
                <p>Toute commande de produits implique l'acceptation sans réserve par le client et son adhésion pleine et entière aux présentes CGV, qui prévalent sur tout autre document du client, sauf accord dérogatoire exprès et préalable de MONTPC - Services Informatiques.</p>
                
                <h3>2.3 Modification</h3>
                <p>MONTPC - Services Informatiques se réserve le droit de modifier à tout moment les présentes CGV. Les CGV applicables sont celles en vigueur à la date de la commande du client.</p>
                
                <h2>3. Produits</h2>
                
                <h3>3.1 Caractéristiques des produits</h3>
                <p>Les caractéristiques essentielles des produits sont présentées sur le site internet montpc.com ou disponibles en magasin. Les photographies et illustrations des produits ne sont pas contractuelles et n'engagent pas la responsabilité de MONTPC - Services Informatiques.</p>
                
                <h3>3.2 Disponibilité des produits</h3>
                <p>Les offres de produits sont valables dans la limite des stocks disponibles. MONTPC - Services Informatiques s'engage à honorer les commandes reçues uniquement dans la limite des stocks disponibles.</p>
                
                <p>En cas d'indisponibilité d'un produit après passation de la commande, MONTPC - Services Informatiques en informera le client dans les meilleurs délais. Le client pourra alors choisir entre :</p>
                <ul>
                    <li>La livraison d'un produit de qualité et de prix équivalents</li>
                    <li>Le remboursement du prix du produit indisponible</li>
                    <li>L'attente de la disponibilité du produit commandé</li>
                </ul>
                
                <h3>3.3 Conformité des produits</h3>
                <p>Les produits vendus par MONTPC - Services Informatiques sont conformes à la réglementation en vigueur en France et possèdent les certifications nécessaires à leur commercialisation sur le territoire français.</p>
                
                <h2>4. Prix</h2>
                
                <h3>4.1 Prix de vente</h3>
                <p>Les prix des produits sont indiqués en euros toutes taxes comprises (TTC) pour les particuliers et hors taxes (HT) pour les professionnels. Ils tiennent compte de la TVA applicable au jour de la commande.</p>
                
                <p>MONTPC - Services Informatiques se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable au client.</p>
                
                <h3>4.2 Frais supplémentaires</h3>
                <p>Les frais de livraison, d'installation ou de mise en service, lorsqu'ils sont applicables, font l'objet d'une facturation séparée et sont clairement indiqués avant la validation de la commande.</p>
                
                <h3>4.3 Remises et promotions</h3>
                <p>MONTPC - Services Informatiques peut proposer des codes promotionnels ou des remises exceptionnelles. Les conditions et la durée de validité de ces avantages sont précisées lors de leur diffusion.</p>
                
                <h2>5. Commandes</h2>
                
                <h3>5.1 Passation de commande</h3>
                <p>Pour les commandes passées sur le site internet, le client suit les étapes suivantes :</p>
                <ul>
                    <li>Sélection des produits</li>
                    <li>Vérification du contenu du panier</li>
                    <li>Identification (création de compte ou connexion)</li>
                    <li>Choix du mode de livraison</li>
                    <li>Choix du mode de paiement</li>
                    <li>Validation finale après vérification</li>
                </ul>
                
                <p>Pour les commandes en magasin, le processus de vente est finalisé par l'émission d'un ticket de caisse ou d'une facture.</p>
                
                <h3>5.2 Confirmation de commande</h3>
                <p>Toute commande en ligne fait l'objet d'une confirmation par email récapitulant les produits commandés, leur prix et les modalités de livraison. Cette confirmation constitue l'acceptation de la commande par MONTPC - Services Informatiques.</p>
                
                <h3>5.3 Modification de commande</h3>
                <p>Toute modification de commande demandée par le client ne peut être prise en considération que si elle est reçue par écrit avant l'expédition des produits.</p>
                
                <h3>5.4 Annulation de commande</h3>
                <p>En cas d'annulation de la commande par le client après son acceptation par MONTPC - Services Informatiques, pour quelque raison que ce soit hormis l'exercice du droit de rétractation, l'acompte versé sera conservé à titre de dommages et intérêts.</p>
                
                <h2>6. Paiement</h2>
                
                <h3>6.1 Moyens de paiement</h3>
                <p>MONTPC - Services Informatiques accepte les moyens de paiement suivants :</p>
                <ul>
                    <li>Espèces (en magasin uniquement, dans la limite de 1000€ pour les résidents fiscaux français)</li>
                    <li>Cartes bancaires (Visa, MasterCard, American Express)</li>
                    <li>Virements bancaires</li>
                    <li>Chèques (sous réserve d'encaissement)</li>
                </ul>
                
                <p>Pour les commandes en ligne, le paiement s'effectue intégralement au moment de la commande.</p>
                
                <h3>6.2 Sécurité des paiements en ligne</h3>
                <p>Les paiements en ligne sur le site montpc.com sont sécurisés par un système de cryptage des données conformément aux normes en vigueur.</p>
                
                <h3>6.3 Réserve de propriété</h3>
                <p>Les produits vendus restent la propriété de MONTPC - Services Informatiques jusqu'au paiement complet du prix, quelle que soit la date de livraison du produit.</p>
                
                <h3>6.4 Défaut de paiement</h3>
                <p>En cas de défaut de paiement total ou partiel à l'échéance, MONTPC - Services Informatiques se réserve le droit de suspendre ou d'annuler la livraison des commandes en cours.</p>
                
                <p>Pour les clients professionnels, tout retard de paiement entraînera l'application de pénalités de retard au taux d'intérêt appliqué par la Banque Centrale Européenne à son opération de refinancement la plus récente, majoré de 10 points de pourcentage, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 euros conformément aux articles L.441-10 et D.441-5 du Code de commerce.</p>
                
                <h2>7. Livraison</h2>
                
                <h3>7.1 Zones de livraison</h3>
                <p>MONTPC - Services Informatiques livre les produits en France métropolitaine et, sous conditions, dans certains pays de l'Union Européenne. Pour toute livraison hors France métropolitaine, des frais supplémentaires peuvent s'appliquer.</p>
                
                <h3>7.2 Délais de livraison</h3>
                <p>Les délais de livraison sont donnés à titre indicatif et dépendent du transporteur choisi. MONTPC - Services Informatiques s'engage à livrer les produits dans un délai maximum de 30 jours à compter de la confirmation de la commande, sauf mention contraire indiquée avant la validation de la commande.</p>
                
                <h3>7.3 Retard de livraison</h3>
                <p>En cas de retard de livraison excédant 7 jours ouvrés par rapport au délai annoncé, le client pourra contacter MONTPC - Services Informatiques pour connaître l'état d'avancement de sa commande.</p>
                
                <p>Si le délai de livraison excède 30 jours à compter de la commande, le client pourra annuler sa commande et demander le remboursement intégral des sommes versées.</p>
                
                <h3>7.4 Réception des produits</h3>
                <p>Le client est tenu de vérifier l'état des produits à la livraison. En cas d'avarie ou de manquant, le client doit émettre des réserves précises et détaillées sur le bon de livraison et confirmer ces réserves par lettre recommandée avec accusé de réception auprès du transporteur dans les 3 jours ouvrables suivant la réception, avec copie à MONTPC - Services Informatiques.</p>
                
                <h3>7.5 Réclamation</h3>
                <p>Toute réclamation concernant les produits livrés doit être adressée par écrit à MONTPC - Services Informatiques dans un délai de 48 heures à compter de la réception des produits, à l'adresse email contact@montpc.com ou par courrier à l'adresse du siège social.</p>
                
                <h2>8. Droit de Rétractation</h2>
                
                <h3>8.1 Délai de rétractation</h3>
                <p>Conformément aux dispositions des articles L.221-18 et suivants du Code de la consommation, le client particulier dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>
                
                <h3>8.2 Exceptions au droit de rétractation</h3>
                <p>Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour :</p>
                <ul>
                    <li>Les produits descellés par le client après la livraison et qui ne peuvent être renvoyés pour des raisons d'hygiène ou de protection de la santé</li>
                    <li>Les logiciels informatiques descellés après livraison</li>
                    <li>Les produits confectionnés selon les spécifications du client ou nettement personnalisés</li>
                    <li>Les enregistrements audio ou vidéo ou les logiciels informatiques lorsqu'ils ont été descellés par le client</li>
                    <li>Les fournitures de biens qui, après avoir été livrés et de par leur nature, sont mélangés de manière indissociable avec d'autres articles</li>
                </ul>
                
                <h3>8.3 Modalités d'exercice du droit de rétractation</h3>
                <p>Pour exercer son droit de rétractation, le client doit notifier sa décision de rétractation par écrit à MONTPC - Services Informatiques, par email à contact@montpc.com ou par courrier à l'adresse du siège social, en utilisant le formulaire de rétractation disponible sur le site ou en exprimant clairement sa volonté de se rétracter.</p>
                
                <h3>8.4 Retour des produits</h3>
                <p>Les produits doivent être retournés dans leur état d'origine et complets (emballage, accessoires, notice...), permettant leur recommercialisation à l'état neuf, dans les 14 jours suivant la communication de la décision de rétractation.</p>
                
                <p>Les frais de retour sont à la charge du client.</p>
                
                <h3>8.5 Remboursement</h3>
                <p>MONTPC - Services Informatiques s'engage à rembourser le client de la totalité des sommes versées, y compris les frais de livraison (à l'exception des frais supplémentaires découlant du choix d'un mode de livraison plus coûteux que le mode standard proposé), dans un délai de 14 jours à compter de la date à laquelle elle est informée de la décision de rétractation.</p>
                
                <p>MONTPC - Services Informatiques peut différer le remboursement jusqu'à récupération des produits ou jusqu'à ce que le client ait fourni une preuve d'expédition des produits, la date retenue étant celle du premier de ces faits.</p>
                
                <p>Le remboursement sera effectué en utilisant le même moyen de paiement que celui utilisé pour la transaction initiale, sauf accord exprès du client pour un autre moyen de remboursement.</p>
                
                <h2>9. Garanties</h2>
                
                <h3>9.1 Garantie légale de conformité</h3>
                <p>Conformément aux articles L.217-4 à L.217-12 du Code de la consommation, MONTPC - Services Informatiques est tenue de la garantie légale de conformité des produits vendus.</p>
                
                <p>Le client bénéficie d'un délai de deux ans à compter de la délivrance du produit pour agir. Il peut choisir entre la réparation ou le remplacement du produit, sous réserve des conditions de coût prévues par l'article L.217-9 du Code de la consommation.</p>
                
                <p>Le client est dispensé de rapporter la preuve de l'existence du défaut de conformité du produit durant les 24 mois suivant la délivrance du produit.</p>
                
                <h3>9.2 Garantie contre les vices cachés</h3>
                <p>Conformément aux articles 1641 à 1648 et 2232 du Code civil, MONTPC - Services Informatiques est tenue de la garantie à raison des défauts cachés de la chose vendue qui la rendent impropre à l'usage auquel on la destine, ou qui diminuent tellement cet usage que l'acheteur ne l'aurait pas acquise, ou n'en aurait donné qu'un moindre prix, s'il les avait connus.</p>
                
                <p>Le client peut choisir entre la résolution de la vente ou une réduction du prix de vente conformément à l'article 1644 du Code civil.</p>
                
                <h3>9.3 Garantie commerciale</h3>
                <p>Certains produits peuvent bénéficier d'une garantie commerciale supplémentaire dont les conditions sont précisées sur la fiche produit et dans les documents accompagnant le produit.</p>
                
                <h3>9.4 Mise en œuvre des garanties</h3>
                <p>Pour mettre en œuvre la garantie, le client doit contacter le service après-vente de MONTPC - Services Informatiques par email à contact@montpc.com ou se présenter directement au magasin à Saint-Gervais-les-Bains, muni de la facture d'achat.</p>
                
                <p>Les frais d'envoi sont remboursés sur la base du tarif le moins onéreux proposé par La Poste pour la livraison standard.</p>
                
                <h3>9.5 Exclusions de garantie</h3>
                <p>Sont exclus de garantie les produits modifiés, réparés, intégrés ou ajoutés par le client ou toute autre personne non autorisée par le fournisseur dudit produit ou service. La garantie ne jouera pas pour les vices apparents.</p>
                
                <p>La garantie ne s'applique pas non plus au défaut d'utilisation conforme aux prescriptions d'utilisation du fabricant, à une cause étrangère au produit (choc, foudre, humidité...), ou encore à une usure normale du produit.</p>
                
                <h2>10. Service Après-Vente</h2>
                <p>MONTPC - Services Informatiques propose un service après-vente pour les produits vendus, comprenant :</p>
                <ul>
                    <li>Diagnostic des dysfonctionnements</li>
                    <li>Réparation sous garantie</li>
                    <li>Réparation hors garantie (sur devis)</li>
                    <li>Assistance à l'installation et à la configuration</li>
                </ul>
                
                <p>Les modalités et tarifs du service après-vente sont disponibles en magasin et sur simple demande par email.</p>
                
                <h2>11. Propriété Intellectuelle</h2>
                <p>Tous les éléments du site montpc.com (textes, images, logos, etc.) sont la propriété exclusive de MONTPC - Services Informatiques. Toute reproduction, exploitation, rediffusion ou utilisation de ces éléments, même partielle, est strictement interdite sans l'autorisation écrite préalable de MONTPC - Services Informatiques.</p>
                
                <h2>12. Protection des Données Personnelles</h2>
                <p>MONTPC - Services Informatiques s'engage à protéger les données personnelles de ses clients conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
                
                <p>Les modalités de collecte et de traitement des données personnelles sont détaillées dans la Politique de Confidentialité accessible sur le site montpc.com.</p>
                
                <h2>13. Force Majeure</h2>
                <p>MONTPC - Services Informatiques ne pourra être tenue responsable de l'inexécution ou du retard dans l'exécution de ses obligations en cas de force majeure, telle que définie par l'article 1218 du Code civil et la jurisprudence des tribunaux français.</p>
                
                <h2>14. Droit Applicable et Règlement des Litiges</h2>
                
                <h3>14.1 Droit applicable</h3>
                <p>Les présentes CGV sont soumises au droit français.</p>
                
                <h3>14.2 Règlement amiable</h3>
                <p>En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.</p>
                
                <h3>14.3 Médiation</h3>
                <p>Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, le client consommateur peut recourir au service de médiation proposé par MONTPC - Services Informatiques.</p>
                
                <p>Après démarche préalable écrite du client vis-à-vis de MONTPC - Services Informatiques, le service de médiation peut être saisi pour tout litige de consommation dont le règlement n'aurait pas abouti.</p>
                
                <h3>14.4 Juridiction compétente</h3>
                <p>À défaut de résolution amiable, tout litige sera soumis à la compétence exclusive des tribunaux du ressort du siège social de MONTPC - Services Informatiques, sous réserve des dispositions légales impératives contraires.</p>
                
                <h2>15. Informations sur l'Entreprise</h2>
                <p>MONTPC - Services Informatiques est une entreprise individuelle.</p>
                <ul>
                    <li>Numéro SIRET : 52840548300025</li>
                    <li>Adresse : 57 avenue du mont paccard, 74170 Saint Gervais les bains</li>
                    <li>Email : contact@montpc.com</li>
                    <li>Téléphone : +33 (0)4 50 58 10 65</li>
                </ul>
                
                <h2>16. Contact</h2>
                <p>Pour toute question relative aux présentes Conditions Générales de Vente, vous pouvez contacter MONTPC - Services Informatiques :</p>
                <ul>
                    <li>Par email : contact@montpc.com</li>
                    <li>Par courrier : 57 avenue du mont paccard, 74170 Saint Gervais les bains</li>
                </ul>
                
                <div class="legal-footer">
                    <p>Dernière mise à jour : Mars 2025</p>
                    <p>MONTPC - Services Informatiques | Vente et réparation informatique à Saint-Gervais-les-Bains | SIRET : 52840548300025</p>
                </div>
            </div>
        `,
        'conditions-utilisation': `
            <div class="legal-content">
                <h2>1. Présentation du Site</h2>
                <p>Le site montpc.com (ci-après "le Site") est édité par <strong>MONTPC - Services Informatiques</strong>, entreprise individuelle immatriculée sous le numéro SIRET 52840548300025, dont le siège social est situé au 57 avenue du mont paccard, 74170 Saint Gervais les bains, France.</p>
                
                <ul>
                    <li><strong>Directeur de la publication</strong> : K. Artem</li>
                    <li><strong>Contact</strong> : contact@montpc.com</li>
                    <li><strong>Hébergeur du site</strong> : CONTABO FRANCE, 2 RUE TAUNUS, 67630 LAUTERBOURG - Dirigeants : Schweitzer Remy et Contabo Group GMBH</li>
                </ul>
                
                <h2>2. Objet des Conditions Générales d'Utilisation</h2>
                <p>Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités et conditions dans lesquelles l'utilisateur (ci-après "l'Utilisateur") peut accéder et utiliser les services proposés sur le Site montpc.com.</p>
                
                <p>L'accès et l'utilisation du Site impliquent l'acceptation sans réserve des présentes CGU par l'Utilisateur. Si l'Utilisateur n'accepte pas ces conditions, il est invité à ne pas utiliser le Site.</p>
                
                <h2>3. Services Proposés</h2>
                <p>MONTPC - Services Informatiques, basé à Saint-Gervais-les-Bains, propose des services de réparation et maintenance informatique pour particuliers et professionnels, incluant notamment :</p>
                
                <ul>
                    <li>Réparation d'ordinateurs et PC portables</li>
                    <li>Service de réparation Apple (MacBook, iMac)</li>
                    <li>Réparation de smartphones et iPhone</li>
                    <li>Réparation de tablettes et iPad</li>
                    <li>Diagnostic et dépannage informatique</li>
                    <li>Récupération de données</li>
                    <li>Installation et configuration de logiciels</li>
                    <li>Nettoyage et optimisation des performances</li>
                    <li>Élimination de virus et logiciels malveillants</li>
                </ul>
                
                <p>Le Site a pour vocation de présenter ces services, permettre la prise de contact et faciliter les demandes de devis.</p>
                
                <h2>4. Accès au Site</h2>
                
                <h3>4.1 Accessibilité</h3>
                <p>Le Site est accessible gratuitement à tout Utilisateur disposant d'un accès à Internet. Tous les coûts afférents à l'accès au Site, que ce soient les frais matériels, logiciels ou d'accès à Internet sont exclusivement à la charge de l'Utilisateur.</p>
                
                <h3>4.2 Disponibilité</h3>
                <p>MONTPC - Services Informatiques s'efforce de maintenir le Site accessible 24 heures sur 24 et 7 jours sur 7. Toutefois, MONTPC - Services Informatiques ne pourra être tenue responsable en cas d'indisponibilité du Site, pour quelque cause que ce soit, y compris en cas de maintenance nécessaire au bon fonctionnement du Site ou de force majeure.</p>
                
                <h3>4.3 Modification</h3>
                <p>MONTPC - Services Informatiques se réserve le droit de modifier, suspendre ou interrompre tout ou partie du Site sans préavis.</p>
                
                <h2>5. Propriété Intellectuelle</h2>
                
                <h3>5.1 Titularité des droits</h3>
                <p>L'ensemble des éléments constituant le Site (textes, graphismes, logos, images, vidéos, sons, logiciels, etc.) sont la propriété exclusive de MONTPC - Services Informatiques ou font l'objet d'une autorisation d'utilisation. Ces éléments sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
                
                <h3>5.2 Utilisation des contenus</h3>
                <p>Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation préalable écrite de MONTPC - Services Informatiques.</p>
                
                <h3>5.3 Marques et logos</h3>
                <p>Les marques, logos et noms de domaine figurant sur le Site sont la propriété exclusive de MONTPC - Services Informatiques ou de leurs propriétaires respectifs. Toute utilisation non autorisée de ces marques, logos et noms de domaine constitue une contrefaçon passible de sanctions.</p>
                
                <h2>6. Liens Hypertextes</h2>
                
                <h3>6.1 Liens vers le Site</h3>
                <p>La création de liens hypertextes vers le Site est autorisée sous réserve que ces liens permettent d'accéder à la page d'accueil du Site et qu'ils ne portent pas atteinte aux intérêts de MONTPC - Services Informatiques. MONTPC - Services Informatiques se réserve le droit de demander la suppression de tout lien qu'elle juge non conforme à sa politique.</p>
                
                <h3>6.2 Liens depuis le Site</h3>
                <p>Le Site peut contenir des liens hypertextes vers d'autres sites Internet. MONTPC - Services Informatiques n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur fonctionnement, leur disponibilité ou les conséquences de leur utilisation.</p>
                
                <h2>7. Responsabilités</h2>
                
                <h3>7.1 Utilisation du Site</h3>
                <p>L'Utilisateur s'engage à utiliser le Site conformément aux présentes CGU, à la législation en vigueur et aux bonnes pratiques. Il s'engage notamment à ne pas :</p>
                <ul>
                    <li>Utiliser le Site d'une manière susceptible de l'endommager, de le désactiver ou de le surcharger</li>
                    <li>Tenter d'accéder de manière non autorisée au Site, aux serveurs ou aux réseaux connectés</li>
                    <li>Introduire des virus, chevaux de Troie, vers, bombes logiques ou autres matériels malveillants</li>
                    <li>Collecter ou recueillir des informations concernant d'autres utilisateurs</li>
                </ul>
                
                <h3>7.2 Limitation de responsabilité</h3>
                <p>MONTPC - Services Informatiques s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations diffusées sur le Site. Toutefois, MONTPC - Services Informatiques ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le Site.</p>
                
                <p>En conséquence, MONTPC - Services Informatiques décline toute responsabilité :</p>
                <ul>
                    <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le Site</li>
                    <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le Site</li>
                    <li>Pour tout dommage direct ou indirect, quelles qu'en soient les causes, origines, natures ou conséquences, résultant de l'accès au Site ou de l'impossibilité d'y accéder</li>
                </ul>
                
                <h3>7.3 Force majeure</h3>
                <p>La responsabilité de MONTPC - Services Informatiques ne pourra pas être engagée en cas d'inexécution ou de mauvaise exécution des obligations qui lui incombent si celle-ci est imputable à un cas de force majeure tel que défini par la jurisprudence des tribunaux français.</p>
                
                <h2>8. Devis et Commandes en Ligne</h2>
                
                <h3>8.1 Demande de devis</h3>
                <p>Les demandes de devis effectuées via le formulaire de contact du Site ne constituent pas un engagement contractuel. Un devis détaillé sera établi après diagnostic de l'appareil à réparer par les techniciens de MONTPC - Services Informatiques à Saint-Gervais-les-Bains.</p>
                
                <h3>8.2 Acceptation du devis</h3>
                <p>L'acceptation du devis par le client constitue un engagement contractuel. Les conditions spécifiques liées à la prestation (délais, garanties, modalités de paiement) sont précisées dans le devis.</p>
                
                <h3>8.3 Annulation</h3>
                <p>Toute annulation de commande après acceptation du devis pourra donner lieu à facturation des prestations déjà réalisées et des frais engagés par MONTPC - Services Informatiques.</p>
                
                <h2>9. Garanties et Service Après-Vente</h2>
                
                <h3>9.1 Garantie des réparations</h3>
                <p>Les réparations effectuées par MONTPC - Services Informatiques bénéficient d'une garantie de 3 mois à compter de la date de restitution de l'appareil. Cette garantie couvre uniquement les défauts liés à la réparation effectuée et non les pannes ou dysfonctionnements sans rapport avec l'intervention initiale.</p>
                
                <h3>9.2 Exclusions de garantie</h3>
                <p>La garantie ne s'applique pas dans les cas suivants :</p>
                <ul>
                    <li>Utilisation non conforme aux recommandations du fabricant</li>
                    <li>Dommages causés par un choc, une chute ou un contact avec des liquides</li>
                    <li>Intervention d'un tiers sur l'appareil après la réparation par MONTPC - Services Informatiques</li>
                    <li>Usure normale des pièces</li>
                    <li>Force majeure ou catastrophe naturelle</li>
                </ul>
                
                <h3>9.3 Application de la garantie</h3>
                <p>Pour bénéficier de la garantie, le client doit présenter sa facture originale et l'appareil dans l'état où il a été restitué, sans modification.</p>
                
                <h2>10. Protection des Données Personnelles</h2>
                
                <p>Le traitement des données personnelles des Utilisateurs est soumis à la Politique de Confidentialité accessible sur le Site, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
                
                <h2>11. Cookies</h2>
                
                <p>L'Utilisateur est informé que le Site utilise des cookies. Ces cookies enregistrent uniquement des informations relatives à la navigation de l'Utilisateur sur le Site. Pour plus d'informations sur l'utilisation des cookies, l'Utilisateur est invité à consulter la Politique de Confidentialité du Site.</p>
                
                <h2>12. Droit Applicable et Juridiction Compétente</h2>
                
                <p>Les présentes CGU sont régies par le droit français.</p>
                
                <p>En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'efforceront de trouver une solution amiable.</p>
                
                <p>À défaut d'accord amiable, tout litige sera soumis aux tribunaux compétents du ressort de la Cour d'appel de Chambéry, sous réserve des dispositions légales impératives contraires.</p>
                
                <h2>13. Médiation de la Consommation</h2>
                
                <p>Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, l'Utilisateur peut recourir au service de médiation proposé par MONTPC - Services Informatiques. Le médiateur ainsi proposé est MEDICYS (Centre de médiation et règlement amiable des huissiers de justice).</p>
                
                <p>Après démarche préalable écrite des consommateurs vis-à-vis de MONTPC - Services Informatiques, le service de médiation peut être saisi pour tout litige de consommation dont le règlement n'aurait pas abouti. Pour connaître les modalités de saisine du médiateur, consultez le site www.medicys-consommation.fr.</p>
                
                <h2>14. Modifications des Conditions Générales d'Utilisation</h2>
                
                <p>MONTPC - Services Informatiques se réserve le droit de modifier, à tout moment et sans préavis, les présentes CGU afin de les adapter aux évolutions du Site et/ou de son exploitation.</p>
                
                <p>Les CGU applicables sont celles en vigueur au moment de la navigation sur le Site. L'Utilisateur est donc invité à consulter régulièrement la dernière version mise à jour des CGU, accessible à tout moment sur le Site.</p>
                
                <h2>15. Contact</h2>
                
                <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter :</p>
                <ul>
                    <li>Par email : contact@montpc.com</li>
                    <li>Par courrier : MONTPC - Services Informatiques, 57 avenue du mont paccard, 74170 Saint Gervais les bains</li>
                </ul>
                
                <div class="legal-footer">
                    <p>Dernière mise à jour : Mars 2025</p>
                    <p>MONTPC - Services Informatiques | Réparation informatique à Saint-Gervais-les-Bains | SIRET : 52840548300025</p>
                </div>
            </div>
        `,
        'politique-confidentialite': `
            <div class="legal-content">
                <h2>1. Introduction</h2>
                <p>Bienvenue sur la Politique de Confidentialité de <strong>MONTPC - Services Informatiques</strong>. Nous accordons une importance capitale à la protection de vos données personnelles et au respect de votre vie privée.</p>
                
                <p><strong>MONTPC - Services Informatiques</strong>, entreprise individuelle immatriculée sous le numéro SIRET 52840548300025, dont le siège social est situé au 57 avenue du mont paccard, 74170 Saint Gervais les bains, France (ci-après "nous", "notre" ou "nos"), s'engage à protéger les informations que vous nous confiez.</p>
                
                <p>Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site web ou nos services de réparation informatique à Saint-Gervais-les-Bains et ses environs.</p>
                
                <h2>2. Nos Services</h2>
                
                <p>MONTPC - Services Informatiques propose une gamme complète de services de réparation informatique pour :</p>
                <ul>
                    <li>Ordinateurs et PC portables</li>
                    <li>Appareils Apple (MacBook, iMac)</li>
                    <li>Smartphones et iPhone</li>
                    <li>Tablettes et iPad</li>
                    <li>Diagnostic et réparation de matériel informatique</li>
                    <li>Récupération de données</li>
                    <li>Installation et maintenance de logiciels</li>
                    <li>Nettoyage et optimisation des performances</li>
                    <li>Suppression de virus et logiciels malveillants</li>
                </ul>
                
                <h2>3. Données Collectées</h2>
                
                <p>Dans le cadre de nos activités de réparation informatique à Saint-Gervais-les-Bains, nous collectons les données suivantes :</p>
                
                <h3>3.1 Données d'identification</h3>
                <ul>
                    <li>Nom et prénom</li>
                    <li>Adresse postale</li>
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                </ul>
                
                <h3>3.2 Données relatives aux appareils</h3>
                <ul>
                    <li>Type et modèle d'appareil</li>
                    <li>Numéro de série</li>
                    <li>État de l'appareil</li>
                    <li>Problèmes signalés</li>
                    <li>Historique des interventions</li>
                </ul>
                
                <h3>3.3 Données de navigation</h3>
                <p>Lorsque vous visitez notre site web, nous pouvons collecter automatiquement :</p>
                <ul>
                    <li>Adresse IP</li>
                    <li>Type et version du navigateur</li>
                    <li>Type d'appareil utilisé</li>
                    <li>Système d'exploitation</li>
                    <li>Pages visitées et durée de la visite</li>
                    <li>Référent (site depuis lequel vous avez accédé à notre site)</li>
                </ul>
                
                <h2>4. Finalités de la Collecte des Données</h2>
                
                <p>Chez MONTPC - Services Informatiques à Saint-Gervais-les-Bains, vos données sont collectées pour les finalités suivantes :</p>
                
                <h3>4.1 Exécution du contrat</h3>
                <ul>
                    <li>Diagnostic et réparation de vos appareils informatiques</li>
                    <li>Établissement de devis et factures</li>
                    <li>Communication concernant l'état d'avancement des réparations</li>
                    <li>Gestion de la garantie sur les réparations effectuées</li>
                </ul>
                
                <h3>4.2 Intérêt légitime</h3>
                <ul>
                    <li>Amélioration de nos services de réparation informatique</li>
                    <li>Analyse statistique de notre activité</li>
                    <li>Prévention des fraudes</li>
                    <li>Gestion des réclamations et litiges</li>
                </ul>
                
                <h3>4.3 Consentement</h3>
                <ul>
                    <li>Envoi d'informations commerciales et promotionnelles</li>
                    <li>Réalisation d'enquêtes de satisfaction</li>
                    <li>Utilisation de certains cookies non essentiels</li>
                </ul>
                
                <h2>5. Base Légale du Traitement</h2>
                
                <p>Le traitement de vos données personnelles repose sur les bases légales suivantes :</p>
                <ul>
                    <li>L'exécution du contrat de service de réparation informatique</li>
                    <li>Notre intérêt légitime à développer et améliorer nos services</li>
                    <li>Votre consentement, lorsque celui-ci est requis</li>
                    <li>Le respect de nos obligations légales en tant que prestataire de services informatiques</li>
                </ul>
                
                <h2>6. Durée de Conservation des Données</h2>
                
                <p>Conformément aux obligations légales et aux recommandations de la CNIL, nous conservons vos données personnelles pour les durées suivantes :</p>
                
                <ul>
                    <li>Données clients et appareils : 3 ans à compter de la fin de la relation commerciale</li>
                    <li>Données de facturation : 10 ans (obligation légale)</li>
                    <li>Données de navigation et cookies : 13 mois maximum</li>
                    <li>Données prospects : 3 ans à compter du dernier contact</li>
                </ul>
                
                <p>À l'issue de ces périodes, vos données sont soit supprimées, soit anonymisées pour des fins statistiques.</p>
                
                <h2>7. Destinataires de vos Données</h2>
                
                <p>Les données collectées par MONTPC - Services Informatiques à Saint-Gervais-les-Bains sont destinées :</p>
                <ul>
                    <li>À notre personnel interne habilité à traiter vos données</li>
                    <li>À nos sous-traitants techniques (hébergeur, logiciel de gestion)</li>
                    <li>À nos partenaires fournisseurs de pièces détachées (uniquement les informations nécessaires à la commande)</li>
                    <li>Aux autorités administratives ou judiciaires, si la loi l'exige</li>
                </ul>
                
                <p>Nous nous engageons à ne jamais vendre vos données à des tiers à des fins commerciales.</p>
                
                <h2>8. Sécurité des Données</h2>
                
                <p>MONTPC - Services Informatiques met en place des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre toute forme de traitement non autorisé ou illégal, ainsi que contre la perte, la destruction ou les dommages d'origine accidentelle.</p>
                
                <p>Ces mesures incluent notamment :</p>
                <ul>
                    <li>Le chiffrement des données sensibles</li>
                    <li>L'accès restreint aux données selon le principe du "besoin d'en connaître"</li>
                    <li>La mise à jour régulière de nos systèmes de sécurité</li>
                    <li>La sensibilisation de notre personnel aux bonnes pratiques en matière de protection des données</li>
                </ul>
                
                <h2>9. Vos Droits</h2>
                
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :</p>
                
                <ul>
                    <li><strong>Droit d'accès</strong> : obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie</li>
                    <li><strong>Droit de rectification</strong> : faire corriger des données inexactes ou incomplètes</li>
                    <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données dans certains cas</li>
                    <li><strong>Droit à la limitation du traitement</strong> : demander la suspension temporaire du traitement de vos données</li>
                    <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière</li>
                    <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et les transmettre à un autre responsable de traitement</li>
                    <li><strong>Droit de retirer votre consentement</strong> à tout moment, lorsque le traitement est fondé sur le consentement</li>
                </ul>
                
                <p>Pour exercer ces droits, vous pouvez nous contacter par email à contact@montpc.com ou par courrier postal à l'adresse suivante : MONTPC - Services Informatiques, 57 avenue du mont paccard, 74170 Saint Gervais les bains.</p>
                
                <p>Nous nous engageons à répondre à toute demande dans un délai d'un mois à compter de sa réception.</p>
                
                <h2>10. Cookies et Technologies Similaires</h2>
                
                <h3>10.1 Définition</h3>
                <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite sur notre site. Il permet de stocker des informations relatives à votre navigation.</p>
                
                <h3>10.2 Types de cookies utilisés</h3>
                <p>Notre site utilise différents types de cookies :</p>
                <ul>
                    <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site</li>
                    <li><strong>Cookies analytiques</strong> : mesure d'audience et statistiques de visite</li>
                    <li><strong>Cookies fonctionnels</strong> : mémorisation de vos préférences</li>
                    <li><strong>Cookies publicitaires</strong> : personnalisation des annonces</li>
                </ul>
                
                <h3>10.3 Gestion des cookies</h3>
                <p>Vous pouvez à tout moment configurer votre navigateur pour accepter, refuser ou être alerté lors du dépôt de cookies. Pour cela, reportez-vous à la documentation de votre navigateur.</p>
                
                <p>Le refus de certains cookies peut limiter les fonctionnalités disponibles sur notre site.</p>
                
                <h2>11. Transfert de Données Hors UE</h2>
                
                <p>En principe, vos données personnelles sont hébergées et traitées au sein de l'Union Européenne.</p>
                
                <p>Toutefois, certains de nos prestataires techniques peuvent être situés en dehors de l'UE. Dans ce cas, nous nous assurons que ces transferts sont encadrés par des garanties appropriées conformément à la réglementation en vigueur (clauses contractuelles types, décision d'adéquation, etc.).</p>
                
                <h2>12. Modifications de la Politique de Confidentialité</h2>
                
                <p>MONTPC - Services Informatiques se réserve le droit de modifier la présente politique de confidentialité à tout moment. La version en vigueur est celle publiée sur notre site web.</p>
                
                <p>En cas de modifications substantielles, nous vous en informerons par email ou par un message visible sur notre site, dans la mesure du possible 30 jours avant leur entrée en vigueur.</p>
                
                <h2>13. Contact et Réclamations</h2>
                
                <p>Pour toute question relative à cette politique de confidentialité ou pour toute demande concernant vos données personnelles, vous pouvez nous contacter :</p>
                <ul>
                    <li>Par email : contact@montpc.com</li>
                    <li>Par téléphone : +33 (0)4 50 58 10 65</li>
                    <li>Par courrier : MONTPC - Services Informatiques, 57 avenue du mont paccard, 74170 Saint Gervais les bains</li>
                </ul>
                
                <p>Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (Commission Nationale de l'Informatique et des Libertés) sur leur site www.cnil.fr.</p>
                
                <h2>14. Législation Applicable</h2>
                
                <p>La présente politique de confidentialité est soumise au droit français.</p>
                
                <div class="legal-footer">
                    <p>Dernière mise à jour : Mars 2025</p>
                    <p>MONTPC - Services Informatiques | Réparation informatique à Saint-Gervais-les-Bains | SIRET : 52840548300025</p>
                </div>
            </div>
        `,
        'conditions-reparation': `
            <div class="legal-content">
                <h2>1. Présentation de l'Entreprise</h2>
                <p><strong>MONTPC - Services Informatiques</strong> est une entreprise individuelle immatriculée sous le numéro SIRET 52840548300025, dont le siège social est situé au 57 avenue du mont paccard, 74170 Saint Gervais les bains, France.</p>
                
                <p>Spécialiste de la réparation informatique à Saint-Gervais-les-Bains, MONTPC - Services Informatiques propose des services de réparation, maintenance et assistance pour tous types d'appareils informatiques : ordinateurs, PC, Apple, smartphones, iPhone, tablettes, iPad et iMac.</p>
                
                <h2>2. Application des Conditions Générales</h2>
                <p>Les présentes Conditions Générales de Réparation (ci-après "CGR") s'appliquent à toutes les prestations de services de réparation informatique effectuées par MONTPC - Services Informatiques pour ses clients, particuliers ou professionnels.</p>
                
                <p>Ces CGR sont remises au client avant toute intervention et sont considérées comme acceptées sans réserve dès la signature du bon de prise en charge ou l'acceptation du devis. Elles prévalent sur tout autre document émis par le client, sauf accord écrit contraire de MONTPC - Services Informatiques.</p>
                
                <h2>3. Diagnostic et Devis</h2>
                
                <h3>3.1 Diagnostic préalable</h3>
                <p>Toute réparation fait l'objet d'un diagnostic préalable permettant d'identifier la nature de la panne et les travaux à effectuer. Ce diagnostic peut être gratuit ou payant selon la complexité de l'analyse requise.</p>
                
                <h3>3.2 Établissement du devis</h3>
                <p>Un devis détaillé est établi à l'issue du diagnostic. Ce devis précise :</p>
                <ul>
                    <li>La nature des travaux à effectuer</li>
                    <li>Le coût des pièces détachées nécessaires</li>
                    <li>Le coût de la main-d'œuvre</li>
                    <li>Le délai estimatif de réparation</li>
                    <li>Les conditions de garantie applicables</li>
                </ul>
                
                <h3>3.3 Validité et acceptation du devis</h3>
                <p>Le devis est valable pour une durée de 15 jours à compter de sa date d'émission. L'acceptation du devis par le client se fait par signature de celui-ci, accompagnée de la mention manuscrite "Bon pour accord".</p>
                
                <h3>3.4 Refus du devis</h3>
                <p>En cas de refus du devis, les frais de diagnostic, s'ils sont payants, restent dus. L'appareil est restitué au client dans l'état où il a été confié, sauf si des manipulations nécessaires au diagnostic ont modifié son état initial, ce dont le client aura été informé préalablement.</p>
                
                <h2>4. Exécution des Réparations</h2>
                
                <h3>4.1 Délai d'intervention</h3>
                <p>MONTPC - Services Informatiques s'engage à effectuer les réparations dans les meilleurs délais. Les délais annoncés sont donnés à titre indicatif et peuvent varier en fonction de la disponibilité des pièces détachées, de la charge de travail ou de circonstances exceptionnelles.</p>
                
                <h3>4.2 Dépassement du devis initial</h3>
                <p>Si, en cours de réparation, MONTPC - Services Informatiques constate la nécessité d'effectuer des travaux supplémentaires non prévus dans le devis initial, le client en sera informé. Un devis complémentaire sera alors établi, et les travaux supplémentaires ne seront effectués qu'après acceptation de ce devis par le client.</p>
                
                <h3>4.3 Impossibilité de réparation</h3>
                <p>Si, après acceptation du devis et début des travaux, la réparation s'avère techniquement impossible, MONTPC - Services Informatiques en informera le client dans les plus brefs délais. Les frais de diagnostic et les travaux déjà effectués resteront dus, et l'appareil sera restitué au client en l'état.</p>
                
                <h3>4.4 Remplacement des pièces</h3>
                <p>Les pièces remplacées sont, sauf mention contraire, des pièces neuves et compatibles avec l'appareil concerné. Les pièces d'origine peuvent être utilisées sur demande expresse du client et selon disponibilité.</p>
                
                <p>Les pièces défectueuses remplacées sont tenues à la disposition du client pendant un délai de 15 jours suivant la restitution de l'appareil. Au-delà de ce délai, elles seront recyclées conformément à la réglementation en vigueur.</p>
                
                <h2>5. Données et Sauvegarde</h2>
                
                <h3>5.1 Sauvegarde des données</h3>
                <p>Le client est expressément informé que MONTPC - Services Informatiques n'effectue pas systématiquement de sauvegarde des données contenues dans les appareils qui lui sont confiés. Il appartient au client de sauvegarder l'intégralité de ses données avant de confier son appareil en réparation.</p>
                
                <h3>5.2 Perte de données</h3>
                <p>MONTPC - Services Informatiques ne pourra en aucun cas être tenue responsable de la perte de données, fichiers ou programmes contenus dans les appareils confiés en réparation, quelle qu'en soit la cause.</p>
                
                <h3>5.3 Récupération de données</h3>
                <p>Sur demande spécifique du client et sous réserve de faisabilité technique, MONTPC - Services Informatiques peut proposer un service de récupération de données. Ce service fait l'objet d'un devis spécifique et n'est pas inclus dans les prestations standard de réparation.</p>
                
                <h3>5.4 Confidentialité</h3>
                <p>MONTPC - Services Informatiques s'engage à respecter la confidentialité des données auxquelles elle pourrait avoir accès lors de l'intervention et à ne pas les divulguer à des tiers, conformément à sa Politique de Confidentialité.</p>
                
                <h2>6. Tarifs et Paiement</h2>
                
                <h3>6.1 Tarifs</h3>
                <p>Les tarifs applicables sont ceux en vigueur au jour de l'établissement du devis. Ces tarifs sont exprimés en euros TTC (Toutes Taxes Comprises) pour les particuliers et en euros HT (Hors Taxes) pour les professionnels.</p>
                
                <h3>6.2 Frais supplémentaires</h3>
                <p>Des frais supplémentaires peuvent s'appliquer dans les cas suivants :</p>
                <ul>
                    <li>Interventions urgentes ou hors horaires d'ouverture</li>
                    <li>Déplacements au-delà d'un certain rayon autour de Saint-Gervais-les-Bains</li>
                    <li>Prestations spécifiques non incluses dans le devis initial</li>
                </ul>
                
                <h3>6.3 Modalités de paiement</h3>
                <p>Le paiement s'effectue à la restitution de l'appareil, sauf accord contraire mentionné sur le devis. Les modes de paiement acceptés sont :</p>
                <ul>
                    <li>Espèces</li>
                    <li>Carte bancaire</li>
                    <li>Virement bancaire</li>
                    <li>Chèque (sous réserve d'encaissement)</li>
                </ul>
                
                <p>Pour les professionnels, des conditions de paiement spécifiques peuvent être négociées et formalisées par écrit.</p>
                
                <h3>6.4 Défaut de paiement</h3>
                <p>En cas de défaut de paiement, MONTPC - Services Informatiques se réserve le droit de conserver l'appareil réparé jusqu'au règlement intégral des sommes dues, sans que cette rétention ne constitue une obligation de conservation ou de restitution en l'état.</p>
                
                <p>Pour les professionnels, tout retard de paiement entraînera l'application de pénalités de retard au taux d'intérêt appliqué par la Banque Centrale Européenne à son opération de refinancement la plus récente, majoré de 10 points de pourcentage, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 euros conformément aux articles L.441-10 et D.441-5 du Code de commerce.</p>
                
                <h2>7. Garantie des Réparations</h2>
                
                <h3>7.1 Étendue de la garantie</h3>
                <p>Les réparations effectuées par MONTPC - Services Informatiques bénéficient d'une garantie de 3 mois à compter de la date de restitution de l'appareil, couvrant uniquement les pièces remplacées et la main-d'œuvre liée au défaut constaté lors de l'intervention initiale.</p>
                
                <h3>7.2 Exclusions de garantie</h3>
                <p>La garantie ne s'applique pas dans les cas suivants :</p>
                <ul>
                    <li>Utilisation non conforme de l'appareil</li>
                    <li>Détérioration due à un choc, une chute ou un contact avec des liquides</li>
                    <li>Intervention d'un tiers sur l'appareil après la réparation</li>
                    <li>Usure normale des pièces</li>
                    <li>Problèmes logiciels ou de système d'exploitation non liés à la réparation</li>
                    <li>Non-respect des recommandations données par MONTPC - Services Informatiques</li>
                    <li>Force majeure ou catastrophe naturelle</li>
                </ul>
                
                <h3>7.3 Mise en œuvre de la garantie</h3>
                <p>Pour bénéficier de la garantie, le client doit :</p>
                <ul>
                    <li>Présenter la facture originale de réparation</li>
                    <li>Rapporter l'appareil dans les locaux de MONTPC - Services Informatiques à Saint-Gervais-les-Bains</li>
                    <li>Ne pas avoir tenté de réparer lui-même le dysfonctionnement</li>
                    <li>Signaler le défaut dans les plus brefs délais après sa constatation</li>
                </ul>
                
                <h3>7.4 Garantie légale</h3>
                <p>Indépendamment de la garantie commerciale offerte, MONTPC - Services Informatiques reste tenue de la garantie légale de conformité mentionnée aux articles L.217-4 à L.217-12 du Code de la consommation et de celle relative aux défauts de la chose vendue, dans les conditions prévues aux articles 1641 à 1648 et 2232 du Code civil.</p>
                
                <h2>8. Dépôt et Retrait des Appareils</h2>
                
                <h3>8.1 Bon de dépôt</h3>
                <p>Un bon de dépôt est établi lors de la réception de l'appareil, détaillant l'état apparent de celui-ci et les accessoires fournis. Le client est tenu de vérifier l'exactitude de ces informations et de signaler toute erreur ou omission avant de signer le bon de dépôt.</p>
                
                <h3>8.2 Délai de retrait</h3>
                <p>Le client s'engage à retirer son appareil dans un délai maximum de 30 jours à compter de la notification de fin de travaux. Au-delà de ce délai, des frais de garde de 5€ par jour pourront être facturés.</p>
                
                <h3>8.3 Abandon</h3>
                <p>Si l'appareil n'est pas retiré dans un délai de 3 mois à compter de la notification de fin de travaux, il sera considéré comme abandonné. MONTPC - Services Informatiques pourra alors en disposer librement, conformément à l'article 2243 du Code civil.</p>
                
                <h3>8.4 Identité du déposant</h3>
                <p>Lors du dépôt de l'appareil, le client doit justifier de son identité. La restitution de l'appareil ne pourra être faite qu'au déposant ou à une personne dûment mandatée par celui-ci, sur présentation d'une pièce d'identité et du bon de dépôt.</p>
                
                <h2>9. Responsabilité</h2>
                
                <h3>9.1 Limitation de responsabilité</h3>
                <p>La responsabilité de MONTPC - Services Informatiques est limitée à la valeur vénale de l'appareil au jour du dépôt, telle qu'estimée sur le bon de dépôt, et ne saurait excéder le montant des prestations facturées.</p>
                
                <h3>9.2 Exclusion de responsabilité</h3>
                <p>MONTPC - Services Informatiques ne saurait être tenue responsable :</p>
                <ul>
                    <li>Des dommages indirects ou immatériels tels que perte de données, perte d'exploitation, préjudice commercial, manque à gagner</li>
                    <li>Des conséquences dues à l'utilisation des appareils réparés</li>
                    <li>Des dysfonctionnements résultant de l'installation de logiciels ou matériels par le client après l'intervention</li>
                    <li>Des pannes ou dysfonctionnements sans rapport avec l'intervention initiale</li>
                </ul>
                
                <h2>10. Propriété des Appareils</h2>
                
                <h3>10.1 Légitimité de la propriété</h3>
                <p>Le client certifie être le propriétaire légitime de l'appareil confié en réparation ou disposer de toutes les autorisations nécessaires du propriétaire pour le faire réparer.</p>
                
                <h3>10.2 Appareils suspects</h3>
                <p>MONTPC - Services Informatiques se réserve le droit de refuser la réparation d'un appareil dont la provenance pourrait être douteuse ou dont le numéro de série aurait été effacé ou modifié.</p>
                
                <h2>11. Logiciels et Licences</h2>
                
                <h3>11.1 Légalité des logiciels</h3>
                <p>MONTPC - Services Informatiques n'installe que des logiciels légalement acquis par le client ou des logiciels libres. Le client est seul responsable de la légalité des logiciels présents sur son appareil et des licences correspondantes.</p>
                
                <h3>11.2 Mise à jour et réinstallation</h3>
                <p>En cas de besoin de réinstallation du système d'exploitation ou de logiciels, le client doit fournir les supports d'installation et les licences correspondantes. À défaut, MONTPC - Services Informatiques pourra proposer des solutions alternatives légales (systèmes d'exploitation libres, logiciels gratuits) avec l'accord préalable du client.</p>
                
                <h2>12. Force Majeure</h2>
                <p>MONTPC - Services Informatiques ne pourra être tenue responsable de l'inexécution ou du retard dans l'exécution de ses obligations en cas de force majeure, telle que définie par l'article 1218 du Code civil et la jurisprudence des tribunaux français.</p>
                
                <h2>13. Droit Applicable et Règlement des Litiges</h2>
                
                <h3>13.1 Droit applicable</h3>
                <p>Les présentes CGR sont soumises au droit français.</p>
                
                <h3>13.2 Règlement amiable</h3>
                <p>En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.</p>
                
                <h3>13.3 Médiation</h3>
                <p>Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, le client consommateur peut recourir au service de médiation proposé par MONTPC - Services Informatiques.</p>
                
                <p>Après démarche préalable écrite du client vis-à-vis de MONTPC - Services Informatiques, le service de médiation peut être saisi pour tout litige de consommation dont le règlement n'aurait pas abouti.</p>
                
                <h3>13.4 Juridiction compétente</h3>
                <p>À défaut de résolution amiable, tout litige sera soumis à la compétence exclusive des tribunaux du ressort du siège social de MONTPC - Services Informatiques, sous réserve des dispositions légales impératives contraires.</p>
                
                <h2>14. Modification des Conditions Générales</h2>
                <p>MONTPC - Services Informatiques se réserve le droit de modifier à tout moment les présentes CGR. Les CGR applicables sont celles en vigueur à la date de signature du bon de dépôt ou d'acceptation du devis.</p>
                
                <h2>15. Contact</h2>
                <p>Pour toute question relative aux présentes Conditions Générales de Réparation, vous pouvez contacter MONTPC - Services Informatiques :</p>
                <ul>
                    <li>Par email : contact@montpc.com</li>
                    <li>Par courrier : 57 avenue du mont paccard, 74170 Saint Gervais les bains</li>
                </ul>
                
                <div class="legal-footer">
                    <p>Dernière mise à jour : Mars 2025</p>
                    <p>MONTPC - Services Informatiques | Réparation informatique à Saint-Gervais-les-Bains | SIRET : 52840548300025</p>
                </div>
            </div>
        `,
        'tarifs': `
            <div class="legal-content">
                <h2>Grille Tarifaire - MONTPC Services Informatiques</h2>
                <p>Tous les prix sont indiqués en euros TTC (Toutes Taxes Comprises).</p>
                
                <h3>Services de Réparation et Maintenance</h3>
                
                <h4>Diagnostics</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Diagnostic rapide</div>
                        <div class="tarif-price">39€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Diagnostic approfondi</div>
                        <div class="tarif-price">59€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Diagnostic à domicile</div>
                        <div class="tarif-price">79€</div>
                    </div>
                </div>
                
                <h4>Réparations Ordinateurs & PC Portables</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Nettoyage complet (poussière)</div>
                        <div class="tarif-price">59€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement disque dur/SSD</div>
                        <div class="tarif-price">69€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Ajout/Remplacement mémoire RAM</div>
                        <div class="tarif-price">49€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Réparation écran portable</div>
                        <div class="tarif-price">89€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement clavier portable</div>
                        <div class="tarif-price">79€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement batterie portable</div>
                        <div class="tarif-price">59€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Réparation carte mère</div>
                        <div class="tarif-price">À partir de 129€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement connecteur d'alimentation</div>
                        <div class="tarif-price">89€ + pièce</div>
                    </div>
                </div>
                
                <h4>Réparations Apple (MacBook, iMac)</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Diagnostic Apple</div>
                        <div class="tarif-price">69€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement disque SSD Mac</div>
                        <div class="tarif-price">89€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement batterie MacBook</div>
                        <div class="tarif-price">79€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement écran MacBook</div>
                        <div class="tarif-price">129€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Nettoyage système de refroidissement</div>
                        <div class="tarif-price">89€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Réparation clavier papillon</div>
                        <div class="tarif-price">139€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Récupération de données Mac</div>
                        <div class="tarif-price">À partir de 149€</div>
                    </div>
                </div>
                
                <h4>Réparations Smartphones & Tablettes</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement écran smartphone standard</div>
                        <div class="tarif-price">79€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement écran smartphone premium</div>
                        <div class="tarif-price">99€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement écran iPhone</div>
                        <div class="tarif-price">89€ à 159€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement écran iPad</div>
                        <div class="tarif-price">119€ à 179€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement batterie smartphone</div>
                        <div class="tarif-price">59€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Remplacement batterie iPhone</div>
                        <div class="tarif-price">69€ à 99€ + pièce</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Réparation connecteur de charge</div>
                        <div class="tarif-price">79€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Récupération données smartphone</div>
                        <div class="tarif-price">À partir de 99€</div>
                    </div>
                </div>
                
                <h4>Services Logiciels</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Installation système d'exploitation</div>
                        <div class="tarif-price">69€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Installation macOS</div>
                        <div class="tarif-price">89€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Récupération de données</div>
                        <div class="tarif-price">À partir de 99€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Suppression virus/malware</div>
                        <div class="tarif-price">79€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Optimisation des performances</div>
                        <div class="tarif-price">69€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Sauvegarde complète</div>
                        <div class="tarif-price">59€ + support</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Installation logiciels professionnels</div>
                        <div class="tarif-price">49€</div>
                    </div>
                </div>
                
                <h4>Forfaits</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Forfait maintenance annuelle particuliers</div>
                        <div class="tarif-price">179€/an</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Forfait maintenance annuelle professionnels</div>
                        <div class="tarif-price">349€/an</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Pack démarrage nouvel ordinateur</div>
                        <div class="tarif-price">129€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Pack "Seconde vie"</div>
                        <div class="tarif-price">159€</div>
                    </div>
                </div>
                
                <h4>Déplacements</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Saint-Gervais-les-Bains</div>
                        <div class="tarif-price">39€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Jusqu'à 15km</div>
                        <div class="tarif-price">49€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Jusqu'à 30km</div>
                        <div class="tarif-price">69€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Au-delà de 30km</div>
                        <div class="tarif-price">Sur devis</div>
                    </div>
                </div>
                
                <h3>Vente de Matériel</h3>
                
                <h4>Ordinateurs Fixes</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">PC Bureautique Essentiel</div>
                        <div class="tarif-price">599€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">PC Multimédia Performance</div>
                        <div class="tarif-price">899€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">PC Gamer Entrée de gamme</div>
                        <div class="tarif-price">1 099€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">PC Gamer Performance</div>
                        <div class="tarif-price">1 699€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">PC Gamer Premium</div>
                        <div class="tarif-price">2 499€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Station de travail Pro</div>
                        <div class="tarif-price">À partir de 1 299€</div>
                    </div>
                </div>
                
                <h4>Ordinateurs Portables</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Portable Bureautique 15"</div>
                        <div class="tarif-price">649€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Portable Multimédia 15"</div>
                        <div class="tarif-price">899€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Portable Ultrabook 13"</div>
                        <div class="tarif-price">999€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Portable Gamer 15"</div>
                        <div class="tarif-price">1 299€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Portable Gamer 17"</div>
                        <div class="tarif-price">1 799€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Portable Professionnel</div>
                        <div class="tarif-price">À partir de 1 099€</div>
                    </div>
                </div>
                
                <h3>Services Spéciaux</h3>
                
                <h4>Services Professionnels</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Audit informatique</div>
                        <div class="tarif-price">À partir de 299€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Installation serveur</div>
                        <div class="tarif-price">À partir de 499€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Migration de données</div>
                        <div class="tarif-price">À partir de 299€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Sécurisation réseau</div>
                        <div class="tarif-price">À partir de 399€</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Formation personnalisée</div>
                        <div class="tarif-price">79€/heure</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Contrat de maintenance</div>
                        <div class="tarif-price">Sur devis</div>
                    </div>
                </div>
                
                <h4>Services Cloud</h4>
                <div class="tarif-table">
                    <div class="tarif-row">
                        <div class="tarif-service">Sauvegarde cloud 100Go</div>
                        <div class="tarif-price">5,99€/mois</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Sauvegarde cloud 500Go</div>
                        <div class="tarif-price">9,99€/mois</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Sauvegarde cloud 1To</div>
                        <div class="tarif-price">14,99€/mois</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Suite bureautique online</div>
                        <div class="tarif-price">7,99€/mois</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Hébergement site vitrine</div>
                        <div class="tarif-price">9,99€/mois</div>
                    </div>
                    <div class="tarif-row">
                        <div class="tarif-service">Email professionnel</div>
                        <div class="tarif-price">4,99€/mois</div>
                    </div>
                </div>
                
                <div class="legal-note">
                    <p>Cette grille tarifaire est donnée à titre indicatif et peut être sujette à modification. Pour un devis précis, veuillez nous contacter directement.</p>
                    <ul>
                        <li>Tous les prix indiqués sont en euros TTC (sauf mention contraire)</li>
                        <li>Garantie de 3 mois sur toutes nos réparations</li>
                        <li>Pièces détachées garanties selon conditions du fabricant</li>
                        <li>Devis gratuit pour toute réparation</li>
                        <li>Prix valables jusqu'au 31/12/2025</li>
                        <li>Déplacement offert pour toute réparation supérieure à 150€</li>
                    </ul>
                </div>
                
                <div class="legal-footer">
                    <p>Dernière mise à jour : Mars 2025</p>
                    <p>MONTPC - Services Informatiques | Réparation et vente informatique à Saint-Gervais-les-Bains | SIRET : 52840548300025</p>
                </div>
            </div>
        `
    };
    
    return legalContent[type] || '<p>Contenu non disponible.</p>';
}

// Add CSS styles for legal pages
document.addEventListener('DOMContentLoaded', function() {
    const legalParam = new URLSearchParams(window.location.search).get('legal');
    
    if (legalParam) {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .legal-section {
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
            
            .legal-content {
                background-color: var(--background);
                border-radius: 8px;
                padding: 2rem;
                box-shadow: 0 4px 30px var(--shadow-color);
                margin-bottom: 2rem;
            }
            
            .legal-content h2 {
                color: var(--text-primary);
                margin-top: 2rem;
                margin-bottom: 1rem;
                font-family: var(--heading-font);
            }
            
            .legal-content h3 {
                color: var(--text-primary);
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
                font-family: var(--heading-font);
            }
            
            .legal-content p, .legal-content ul, .legal-content ol {
                color: var(--text-secondary);
                margin-bottom: 1rem;
                line-height: 1.6;
            }
            
            .legal-content ul, .legal-content ol {
                padding-left: 1.5rem;
            }
            
            .legal-note {
                font-style: italic;
                background-color: var(--neutral-100);
                padding: 1rem;
                border-radius: 4px;
                margin-top: 2rem;
            }
            
            .legal-cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1.5rem;
                margin-top: 2rem;
            }
            
            .legal-card {
                background-color: var(--neutral-100);
                border-radius: 8px;
                padding: 1.5rem;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .legal-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 20px var(--shadow-color);
            }
            
            .legal-card h2 {
                color: var(--text-primary);
                margin-top: 0;
                margin-bottom: 0.75rem;
                font-size: 1.25rem;
            }
            
            .legal-card p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
                font-size: 0.9rem;
            }
            
            .tarif-table {
                margin: 1.5rem 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px var(--shadow-color);
            }
            
            .tarif-row {
                display: flex;
                border-bottom: 1px solid var(--neutral-200);
            }
            
            .tarif-row:last-child {
                border-bottom: none;
            }
            
            .tarif-service, .tarif-price {
                padding: 1rem;
            }
            
            .tarif-service {
                flex: 3;
                background-color: var(--neutral-100);
            }
            
            .tarif-price {
                flex: 1;
                background-color: var(--primary-light);
                color: white;
                font-weight: 600;
                text-align: center;
            }
            
            /* Dark mode styles */
            .dark-mode .legal-content {
                background-color: var(--neutral-850);
            }
            
            .dark-mode .legal-content h2,
            .dark-mode .legal-content h3 {
                color: var(--neutral-100);
            }
            
            .dark-mode .legal-content p,
            .dark-mode .legal-content ul,
            .dark-mode .legal-content ol {
                color: var(--neutral-300);
            }
            
            .dark-mode .legal-note {
                background-color: var(--neutral-800);
                color: var(--neutral-300);
            }
            
            .dark-mode .legal-card {
                background-color: var(--neutral-800);
            }
            
            .dark-mode .legal-card h2 {
                color: var(--neutral-100);
            }
            
            .dark-mode .legal-card p {
                color: var(--neutral-300);
            }
            
            .dark-mode .tarif-service {
                background-color: var(--neutral-800);
                color: var(--neutral-200);
            }
            
            .dark-mode .tarif-price {
                background-color: var(--primary-dark);
            }
            
            @media (max-width: 768px) {
                .legal-content {
                    padding: 1.5rem;
                }
                
                .tarif-row {
                    flex-direction: column;
                }
                
                .tarif-service, .tarif-price {
                    flex: 1;
                    width: 100%;
                }
                
                .tarif-price {
                    text-align: left;
                }
            }
            
            .legal-footer {
                margin-top: 3rem;
                padding-top: 1.5rem;
                border-top: 1px solid var(--neutral-300);
                font-size: 0.9rem;
                color: var(--text-tertiary);
                text-align: center;
            }
            
            .dark-mode .legal-footer {
                border-top-color: var(--neutral-700);
            }
        `;
        
        document.head.appendChild(styleElement);
    }
});