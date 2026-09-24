This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Back-office Antenne et BEC

Le back-office utilise PostgreSQL et des sessions opaques stockées en base. Copier `.env.example` vers `.env.local`, puis définir au minimum :

```text
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://votre-domaine.org
BACKOFFICE_SESSION_SECRET=une-valeur-longue-et-aleatoire
BACKOFFICE_DOCUMENT_ENCRYPTION_KEY=une-autre-valeur-longue-et-aleatoire
BACKOFFICE_TRUSTED_PROXY_HEADERS=x-forwarded-for
BACKOFFICE_ALLOW_DEMO=false
```

`BACKOFFICE_ALLOW_DEMO=true` est accepté uniquement avec `NODE_ENV=development`. En production, la base est obligatoire et la démonstration ainsi que les migrations exécutées depuis l’application sont refusées.

Appliquer les migrations SQL versionnées avant le déploiement avec l’utilisateur de migration PostgreSQL :

```bash
psql "$DATABASE_URL" -f db/migrations/001_backoffice_production.sql
psql "$DATABASE_URL" -f db/migrations/002_backoffice_hardening.sql
psql "$DATABASE_URL" -f db/migrations/003_oco_production.sql
psql "$DATABASE_URL" -f db/migrations/004_pap_production.sql
```

La page `/backoffice/login` ne propose pas d’inscription publique. Les mutations passent par des Server Actions contrôlées par rôle, permission, périmètre, état et version optimiste. Le test unitaire ne nécessite pas PostgreSQL :

La migration `003_oco_production.sql` nettoie uniquement les `country_flag` historiques des scopes BEC, conserve les sémantiques de rôle, ajoute les contraintes de finalisation OCO, l’immuabilité des avis finalisés et la protection atomique des réaffectations. Un avis brouillon n’est jamais projeté dans les back-offices Antenne/BEC : seuls `status = 'FINALIZED'` avec `finalized_at` non nul sont visibles.

L’affectation OCO est une opération PostgreSQL réservée, sans interface web d’administration :

```bash
npm run oco:assign -- --dossier-id <uuid> --expert-email expert@example.org --reason "Capacité disponible"
npm run oco:assign -- --dossier-id <uuid> --unassign --reason "Réaffectation nécessaire"
```

La commande exige `DATABASE_URL`, vérifie le dossier `TRANSMIS_OCO`, l’expert actif et son rôle PostgreSQL `EXPERT_OCO`, verrouille le dossier et l’affectation dans une transaction, conserve une seule affectation active et journalise `OCO_ASSIGNED` ou `OCO_UNASSIGNED`. Une affectation active est refusée si un avis finalisé existe. Sinon, le brouillon précédent reste attaché à son expert et n’est jamais transféré au nouvel expert.

Pour le PAP, appliquer `004_pap_production.sql` puis utiliser :

```bash
npm run pap:assign -- --dossier-id <uuid> --responsable-email responsable@example.org --reason "Capacité disponible"
npm run pap:assign -- --dossier-id <uuid> --unassign --reason "Cas PAP clôturé"
```

La commande PAP exige `DATABASE_URL`, verrouille le dossier et l’affectation dans une transaction, conserve une seule affectation active et journalise `PAP_ASSIGNED` ou `PAP_UNASSIGNED`. Un cas PAP ouvert interdit la désaffectation ; un cas fermé peut être transféré après désaffectation explicite. Le texte du motif reste dans `pap_assignments` et n’est pas copié dans les espaces OCO, Antenne ou BEC.

L’espace `/pap` est réservé au rôle `RESPONSABLE_PAP`, avec `pap.read`, `pap.alerts.read`, `pap.alerts.write`, `pap.mentorat.read`, `pap.mentorat.write`, `history.read` et `dossiers.read`. Il n’expose ni documents, ni validation BEC, ni avis OCO, ni export. Les repository et Server Actions vérifient la session, le rôle, la permission et l’affectation active côté serveur ; les données affichées se limitent à l’ID-POMRA et aux initiales autorisées. Les mutations utilisent `useActionState`, validation Zod, version optimiste et audit PostgreSQL dans la même transaction. Aucun téléchargement de données PAP n’est fourni.

Les tests PAP sont unitaires et ne nécessitent pas PostgreSQL :

```bash
npm run typecheck
npm test
npm run lint -- app/pap components/pap lib/pap-types.ts lib/server/pap-repository.ts lib/server/pap-workflow.ts
```

Limites : l’affectation PAP est opérationnelle sans pays/antenne, car l’accès est individuel par dossier ; une contrainte pays pourra être ajoutée si le modèle métier impose ce périmètre. Les règles métier de génération automatique des alertes restent à valider avec EA-POMRA. La migration 004 et les commandes PAP ne sont pas exécutées automatiquement par l’application.

Créer un compte initial sans exposer son mot de passe dans la ligne de commande :

```bash
export BACKOFFICE_BOOTSTRAP_PASSWORD='un-mot-de-passe-long-et-unique'
npm run user:create -- --email responsable@example.org --name 'Nom Complet' --title 'Fonction' --role BEC
```

Pour une antenne, ajouter obligatoirement `--country-code SN --country-name Sénégal --country-flag 🇸🇳 --antenna-id SN-DKR --antenna-city Dakar`. Pour un expert OCO, aucun pays ni antenne n'est requis : `--role EXPERT_OCO` crée un compte dont l'accès aux dossiers dépend exclusivement des affectations PostgreSQL. Pour un responsable PAP, aucun pays ni antenne n'est requis : `--role RESPONSABLE_PAP` crée un compte dont l'accès dépend exclusivement des affectations PostgreSQL. Le compte est créé uniquement après application des migrations.

```bash
npm run typecheck
npm run test:unit
```

Les documents sont chiffrés en AES-256-GCM avant stockage PostgreSQL. La taille maximale, les limites de débit, les timeouts et la taille du pool sont configurables dans `.env.local`. En production, `BACKOFFICE_TRUSTED_PROXY_HEADERS` doit identifier les en-têtes définis par le proxy de confiance ; une IP client absente ou invalide ferme l'accès plutôt que de contourner la limitation. Le téléversement refuse les requêtes sans `Content-Length` ou `Transfer-Encoding: chunked` et impose une origine présente dans la liste séparée par des virgules de `NEXT_PUBLIC_SITE_URL` ; le reverse proxy doit donc conserver `Content-Length` et ne jamais convertir les téléversements en chunked. Les nouveaux blobs utilisent un AAD AES-GCM contenant l’identifiant et la version du document ; les blobs historiques sans marqueur AAD restent lisibles pour compatibilité, mais ne bénéficient pas encore de cette liaison.

Purger les sessions expirées et les seaux de limitation expirés par lots bornés :

```bash
npm run maintenance:purge-sessions -- 10000
```