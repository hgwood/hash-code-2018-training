# Hash Code 2018 Training

Judge : https://hashcodejudge.withgoogle.com/#/home

## Scripts

- Tests : `npm run test`
- Commit, zip, et soumission au juge : `npm run submit` (tip: tagguer le commit avec le score une fois ce dernier connu : `git tag score=<score> <sha1>`)
- Génère une nouvelle fonction avec son test : `npm run scaffold <functionName>`

## Fonctions utilitaires

- [Assert](https://nodejs.org/dist/latest-v6.x/docs/api/assert.html)
- [Lodash](https://lodash.com), évidemment
- [Debug](https://www.npmjs.com/package/debug)
- Parsing du fichier d'entrée : [`jolicitron`](https://www.npmjs.com/package/jolicitron)
- Manipulations de grilles / matrices 2D : [`grid-utils.js`](https://github.com/hgwood/hash-code-2017-qualifications/blob/master/grid-utils.js)

## Préparation de l'environnement de dev

- Editeur recommandé : Visual Studio Code
  - Auto-complétion excellente, très utile pour lodash
  - Debugger intégré, et configuration fournie dans ce repo (F5 pour lancer)
- Configurer editorconfig dans l'éditeur avec auto-fix on save
- Configurer eslint dans l'éditeur avec auto-fix on save
- Se familiariser avec la signature des fonctions utilitaires

## Préparation juste avant le challenge

- Créer un fichier `.env` à la racine du repo et y mettre son token d'authentification du judge (format: `HASH_CODE_JUDGE_AUTH_TOKEN=<token>`)

## Checklist de début de challenge

- Configurer les data sets dans `upload.js`
- Télécharger et commiter les fichiers d'entrée

## Conseils

- Pusher rapidement sur GitHub pour mettre à disposition de l'équipe
- Faire des fonctions indépendantes testées
  - Utiliser le script de scaffolding pour aller vite
  - Permet à toute l'équipe de profiter de la fonction
  - Permet d'écrire des fonctions et des tests petits
  - Permet de perdre moins de temps en debug
- Faire des tests très simples pour ne pas perdre de temps en debug
- Utiliser `assert` pour vérifier que tout va bien au milieu des fonctions et ne pas perdre de temps en debug
- Utiliser `debug` en dernier recours (i.e. préfére tests et assertions) pour afficher des valeurs
