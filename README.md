# Hash Code 2018 Training

Judge : https://hashcodejudge.withgoogle.com/#/home

## Scripts

- Lancer une résolution sur tous les fichiers d'entrée, en parallèle : `npm run all`
- Lancer une résolution sur un fichier d'entrée : `npm run input<1|2|3|4>`
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
- Configurer prettier dans l'éditeur avec format on save
- Se familiariser avec la signature des fonctions utilitaires

## Préparation juste avant le challenge

- Créer un fichier `.env` à la racine du repo et y mettre son token d'authentification du judge (format: `HASH_CODE_JUDGE_AUTH_TOKEN=<token>`)

## Checklist de début de challenge

- Télécharger et commiter l'énoncé et les fichiers d'entrée avec `npm run download`
- Modifier le champ `config` du `package.json` pour mettre le nom et les id des fichiers d'entrée
  - `name` doit correspondre au nom du fichier sans extension
  - `id` doit correspondre à l'id du data set dans le judge, pour pouvoir uploader
    - l'id est la valeur du paramètre de query `dataSet` qui est fournit par le Judge à l'API quand on upload une solution (chercher l'appel à `https://hashcode-judge.appspot.com/api/judge/v1/submissions`)

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
