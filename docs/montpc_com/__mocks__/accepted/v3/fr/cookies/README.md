# Module de Consentement aux Cookies MontPC

Ce module fournit une solution simple mais conforme aux exigences légales pour obtenir le consentement des utilisateurs concernant l'utilisation des cookies sur le site MontPC.com.

## Contenu du Module

- `cookie-consent.js` - Script JavaScript pour la gestion du consentement
- `cookie-consent.css` - Styles CSS pour la bannière de consentement
- `cookie-banner.html` - Snippet HTML à intégrer dans le site
- `README.md` - Ce guide d'implémentation

## Guide d'Intégration

### 1. Ajouter le Script JavaScript

Ajouter le script JavaScript juste avant la fermeture de la balise `</body>` dans le fichier `index.html` :

```html
<!-- Cookie Consent Script -->
<script src="cookies/cookie-consent.js"></script>
```

### 2. Ajouter les Styles CSS

Intégrer les styles CSS dans votre fichier CSS principal ou ajouter une référence dans la section `<head>` :

```html
<!-- Cookie Consent Styles -->
<link rel="stylesheet" href="cookies/cookie-consent.css">
```

Ou vous pouvez copier le contenu de `cookie-consent.css` directement dans votre fichier `styles.css` existant.

### 3. Ajouter la Bannière HTML

Copier le contenu de `cookie-banner.html` juste avant la fermeture de la balise `</body>` dans le fichier `index.html` :

```html
<!-- Ajouter ici le contenu de cookie-banner.html -->
```

### 4. Vérifier la Politique de Confidentialité

Assurez-vous que votre politique de confidentialité (normalement à `/legals/politique-confidentialite.html`) inclut des informations détaillées sur :

- Les types de cookies utilisés
- Leur finalité
- Comment les utilisateurs peuvent gérer leurs préférences
- La durée de conservation des cookies

Le lien dans la bannière pointe vers cette page, donc elle doit être à jour et accessible.

### 5. Configurer les Services d'Analyse (le cas échéant)

Si vous utilisez des services d'analyse comme Google Analytics, vous devrez modifier les fonctions `enableAnalytics()` et `disableAnalytics()` dans `cookie-consent.js` pour implémenter correctement l'activation/désactivation de ces services.

### 6. Tester l'Implémentation

Testez la bannière de consentement en :

1. Ouvrant le site en navigation privée
2. Vérifiant que la bannière apparaît
3. Testant les boutons "Accepter" et "Refuser"
4. Vérifiant que les préférences sont correctement sauvegardées
5. Vérifiant que les cookies non essentiels ne sont pas définis avant consentement

## Personnalisation

### Modifier le Texte

Pour modifier le texte de la bannière, éditez le contenu HTML de la classe `cookie-message` dans `cookie-banner.html`.

### Ajuster les Styles

Les styles utilisent les variables CSS existantes du site pour une intégration harmonieuse. Si vous avez besoin d'ajuster les styles spécifiques à la bannière de cookies, modifiez `cookie-consent.css`.

### Fonctionnalités Avancées

Le module inclut des commentaires pour des fonctionnalités plus avancées comme :

- Un modal détaillé de préférences de cookies (actuellement commenté)
- Un bouton de paramètres dans le pied de page pour modifier les préférences ultérieurement

Pour activer ces fonctionnalités, décommentez les sections appropriées dans `cookie-banner.html` et ajoutez le code JavaScript nécessaire dans `cookie-consent.js`.

## Conformité Légale

Ce module est conçu pour respecter les exigences minimales de :

- Le RGPD (Règlement Général sur la Protection des Données)
- Les directives de la CNIL (Commission Nationale de l'Informatique et des Libertés)

Il implémente :

- L'information des utilisateurs sur l'utilisation des cookies
- L'obtention du consentement avant de définir des cookies non essentiels
- La possibilité de refuser les cookies non essentiels
- L'accès à des informations détaillées via la politique de confidentialité

## Notes Techniques

- Le module utilise `localStorage` pour stocker les préférences plutôt que des cookies
- Les préférences sont structurées comme suit :
  ```json
  {
    "essential": true,
    "analytics": true|false,
    "marketing": true|false,
    "timestamp": "ISO date string"
  }
  ```
- Le module est compatible avec les thèmes clair/sombre du site
- Le design est responsive et s'adapte aux écrans mobiles