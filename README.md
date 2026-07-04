# Plateforme des cartes IBOMANSA

Plateforme web simple permettant d'afficher les cartes des membres après saisie d'un mot de passe.

## Mot de passe initial

`IBOMANSA2026`

Pour le modifier :

1. Choisissez le nouveau mot de passe.
2. Générez son empreinte SHA-256.
3. Remplacez la valeur `PASSWORD_HASH` dans `script.js`.

## Ajouter une nouvelle carte

1. Placez l'image dans le dossier `assets/`.
2. Ajoutez le membre dans le tableau `members` situé au début de `script.js`.

Exemple :

```js
{
  prenoms: "JEAN",
  nom: "KOUASSI",
  numero: "CI000000000",
  matricule: "0001A",
  village: "DALOA",
  sousPrefecture: "DALOA",
  image: "assets/carte-jean-kouassi.jpg"
}
```

## Publication avec GitHub Pages

Dans le dépôt GitHub :

1. Ouvrez **Settings**.
2. Allez dans **Pages**.
3. Dans **Build and deployment**, choisissez **Deploy from a branch**.
4. Sélectionnez la branche `main` et le dossier `/root`.
5. Enregistrez.

## Avertissement de sécurité

GitHub Pages est un hébergement statique. Le contrôle par mot de passe de cette version protège seulement l'accès dans l'interface, mais les images restent techniquement accessibles à une personne connaissant leur adresse exacte. Pour une protection réellement privée, utilisez une authentification côté serveur, par exemple Supabase, Firebase ou Cloudflare Access.
