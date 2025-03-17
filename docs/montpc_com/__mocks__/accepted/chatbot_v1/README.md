# MontPC Assistant Réparation - Chatbot v1

## Concept du Design

Cette interface de chatbot a été conçue pour compléter le site web MontPC v3, reprenant son esthétique qui mélange modernité et touches ludiques. L'objectif est de fournir une expérience conversationnelle intuitive et enrichie pour les clients qui cherchent des informations sur les services de réparation ou qui souhaitent prendre rendez-vous.

### Éléments Distinctifs

1. **Intégration esthétique avec v3**
   - Réutilisation de la palette de couleurs (orange #FF8500 comme couleur principale)
   - Même système typographique (Poppins pour le texte courant, Playfair Display pour certains titres)
   - Curseur personnalisé et effets de transition similaires
   - Bascule thème clair/sombre cohérente avec le site principal

2. **Interface de Conversation Enrichie**
   - Bulles de messages distinctes pour l'utilisateur et le chatbot
   - Indicateur de frappe animé pour montrer que le bot "répond"
   - Messages enrichis avec des cartes de réparation visuelles
   - Suggestion de réponses rapides avec des "chips" cliquables

3. **Fonctionnalités Pratiques**
   - Formulaire de rendez-vous intégré directement dans la conversation
   - Présentation visuelle des options de réparation avec prix et durée
   - Affichage des badges de qualité (garantie, pièces premium)
   - Informations contextuelles disponibles dans le panneau latéral

4. **Panel d'Information Contextuel**
   - Résumé des services dans un panneau latéral
   - Affichage des horaires d'ouverture
   - Coordonnées de contact facilement accessibles
   - Indicateur visuel du taux de satisfaction client

## Caractéristiques Techniques

1. **Système de thème adaptatif**
   - Mode clair/sombre avec transition fluide
   - Sauvegarde de la préférence dans localStorage
   - Respect de la préférence système initiale (prefers-color-scheme)

2. **Interactions JavaScript**
   - Gestion des messages entrants et sortants
   - Simulation de réponses contextuelles selon les mots-clés identifiés
   - Animation de l'indicateur de frappe
   - Validation des formulaires de prise de rendez-vous

3. **Responsive Design**
   - Adaptation complète à tous les formats d'écran
   - Réorganisation du layout pour les appareils mobiles
   - Désactivation du curseur personnalisé sur appareils tactiles
   - Optimisation de l'affichage du formulaire sur petit écran

4. **Accessibilité**
   - Structure sémantique pour les lecteurs d'écran
   - Contraste suffisant pour la lisibilité
   - Navigation au clavier possible
   - Messages d'état clairs pour les interactions

## Expérience Utilisateur

L'expérience utilisateur a été pensée pour être à la fois intuitive et efficace:

1. **Conversation Naturelle**
   - Interface familière de messagerie pour une prise en main immédiate
   - Suggestions contextuelles qui guident l'utilisateur
   - Réponses enrichies avec des informations visuelles pertinentes
   - Ton convivial et professionnel

2. **Efficacité pour les Tâches Clés**
   - Obtention rapide d'informations sur les prix et services
   - Prise de rendez-vous simplifiée sans quitter la conversation
   - Réponses aux questions fréquentes immédiatement disponibles
   - Possibilité de basculer vers un contact humain si nécessaire

3. **Confiance et Transparence**
   - Affichage clair des prix et des délais
   - Mise en avant de la garantie et des certifications
   - Témoignages de satisfaction client visibles
   - Informations de contact facilement accessibles

## Scénarios d'Utilisation

Le chatbot est optimisé pour gérer les scénarios suivants:

1. **Demande d'Information**
   - Renseignements sur les tarifs de réparation
   - Questions sur les délais d'intervention
   - Informations sur la garantie et les pièces utilisées
   - Questions fréquentes sur les services

2. **Prise de Rendez-vous**
   - Sélection du type d'appareil et de réparation
   - Choix de la date et heure préférées
   - Confirmation et récapitulatif du rendez-vous
   - Instructions pour le jour du rendez-vous

3. **Support Technique Initial**
   - Diagnostic préliminaire des problèmes courants
   - Conseils de dépannage basiques
   - Estimation du type de réparation nécessaire
   - Orientation vers un technicien pour les cas complexes

Cette solution offre une expérience conversationnelle moderne et engageante qui renforce l'image de marque de MontPC tout en offrant un service client efficace 24/7.