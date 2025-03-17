# Guide de Test du Module de Consentement aux Cookies

Ce document explique comment tester et vérifier le fonctionnement du module de consentement aux cookies implémenté sur la version de développement du site MontPC.com.

## Fichiers Implémentés

1. **CSS**:
   - `/cookies/cookie-consent.css` - Styles personnalisés pour la bannière de consentement

2. **JavaScript**:
   - `/cookies/cookie-consent.js` - Logique de gestion du consentement aux cookies

3. **HTML**:
   - Bannière intégrée directement dans `index_dev.html`

4. **Documentation**:
   - `/cookies/README.md` - Guide d'implémentation
   - `/cookies/DEMO.md` - Ce guide de test
   - `/_docs/MODULE_COOKIES.md` - Checklist d'implémentation

## Comment Tester

### 1. Affichage Initial

1. **Premier Accès**:
   - Ouvrez le site en navigation privée ou supprimez vos données de navigation pour simuler un premier accès
   - La bannière de consentement doit apparaître en bas de la page après un court délai (~1 seconde)
   - Vérifiez que le style de la bannière correspond au reste du site
   - Vérifiez que la bannière s'affiche correctement en mode clair et en mode sombre

2. **Animation**:
   - La bannière doit s'animer en glissant du bas vers le haut
   - L'animation doit être fluide et non intrusive

### 2. Interaction Utilisateur

1. **Accepter les Cookies**:
   - Cliquez sur le bouton "Accepter"
   - La bannière doit disparaître avec une animation
   - Vérifiez que les préférences sont enregistrées dans localStorage
   - Rafraîchissez la page - la bannière ne doit pas réapparaître

2. **Refuser les Cookies**:
   - Dans une nouvelle session (navigation privée), cliquez sur "Refuser"
   - La bannière doit disparaître avec une animation
   - Vérifiez que les préférences sont enregistrées dans localStorage
   - Rafraîchissez la page - la bannière ne doit pas réapparaître

3. **Lien "En savoir plus"**:
   - Cliquez sur le lien "En savoir plus"
   - Vérifiez qu'il dirige vers la politique de confidentialité

### 3. Tests sur Différents Appareils

1. **Bureau**:
   - Testez le consentement sur un écran d'ordinateur de bureau
   - Vérifiez que la bannière est bien stylisée et responsive

2. **Mobile**:
   - Testez sur un appareil mobile ou avec la vue mobile de Chrome DevTools
   - Vérifiez que la bannière s'adapte bien aux petits écrans
   - Vérifiez que les boutons sont suffisamment grands pour être cliqués sur mobile

### 4. Conformité au Design

1. **Style et Thème**:
   - Les boutons doivent correspondre au style des boutons du site
   - Les couleurs doivent s'adapter au mode clair/sombre
   - La police doit être cohérente avec le reste du site

2. **Animation et Interactions**:
   - Les animations doivent être fluides
   - Les effets de hover sur les boutons doivent être cohérents

### 5. Vérification Technique

1. **LocalStorage**:
   - Ouvrez les DevTools du navigateur
   - Allez dans l'onglet "Application" → "Stockage Local"
   - Vérifiez que les préférences sont correctement stockées sous la clé "cookieConsent"

2. **JavaScript**:
   - Testez que le module fonctionne correctement même si JavaScript est chargé lentement

## Structure des Données dans localStorage

Les préférences de cookies sont stockées au format JSON:

```json
{
  "essential": true,
  "analytics": true|false,
  "marketing": true|false,
  "timestamp": "2025-03-17T12:34:56.789Z"
}
```

## Remarques Importantes

- Cette implémentation est conçue comme une solution temporaire mais légalement conforme
- Les préférences des utilisateurs sont stockées dans localStorage, pas dans des cookies
- La bannière utilise les variables CSS du site pour maintenir une cohérence visuelle
- Le module est conçu pour fonctionner avec ou sans analytics (car elles ne sont pas encore implémentées)

## Prochaines Étapes

- Intégrer avec l'outil d'analyse réel une fois qu'il sera sélectionné
- Ajouter un panneau de préférences détaillé pour une gestion plus fine des cookies
- Ajouter un bouton dans le pied de page pour gérer les préférences après la décision initiale