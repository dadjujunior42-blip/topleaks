# TOPLEAKS – mise en route

## Fichiers
- index.html : page d'entrée UNIQUE (nom exact, à la racine, sans espace). Plus d'iframe.
- supabase-setup.sql : à exécuter dans Supabase > SQL Editor > Run. Peut être relancé sans risque et GARDE les vidéos déjà enregistrées (la colonne « published » devient « is_published », le prix devient numérique).
- À supprimer de l'hébergement : topleaks-auth-fixed.html, "topleaks 5.html", toute page de redirection.

## Connexion et inscription
- Connexion directe : e-mail + mot de passe, ou bouton Google. AUCUN code n'est demandé pour se connecter.
- « Créer un compte » ouvre une fenêtre dédiée (pseudo, pays, e-mail, mot de passe). Le code à usage unique ne sert qu'à CONFIRMER l'e-mail à la création du compte.
- « Mot de passe oublié » envoie un lien ; le lien ramène sur le site pour choisir un nouveau mot de passe. Les comptes créés avant sans mot de passe doivent passer par là une fois.
Réglages Supabase :
1. Authentication > Providers > Email : activé. Pour supprimer toute confirmation par code, désactivez « Confirm email » : le compte est alors utilisable tout de suite.
2. Si « Confirm email » reste activé : dans Authentication > Email Templates > « Confirm signup », le texte doit contenir {{ .Token }} (le code). La longueur du code se règle dans les réglages Email (« Email OTP Length »).
3. Authentication > URL Configuration : Site URL et Redirect URLs = l'adresse de votre site (lien du mot de passe oublié et Google).
4. Google (optionnel) : Providers > Google, Client ID/Secret ; URI de redirection dans Google Cloud : https://ozakwmoftlassrrcdiqg.supabase.co/auth/v1/callback. Google quitte le site puis revient : c'est inévitable.
5. Production : SMTP personnalisé (l'envoi par défaut est très limité).
6. Devenir admin : dernière section du SQL.

## Vidéos payantes protégées
- Un prix > 0 + un FICHIER envoyé depuis l'admin : le fichier va dans le bucket privé « videos-private » ; le lecteur reçoit un lien signé d'une heure, accordé aux admins et aux comptes ayant un achat « paid ».
- Un extrait gratuit est facultatif. Un lien https collé dans le formulaire reste PUBLIC (non protégé).
- Admin > « Valider un achat » : après réception d'un paiement Mobile Money, donner l'accès au compte de l'acheteur (e-mail, spectacle, référence).
- Le paiement 1000 FC du site est une SIMULATION : il n'ouvre pas une vidéo protégée.

## Tests manuels (ordinateur ET téléphone, depuis l'adresse hébergée)
1. Créer un compte (fenêtre d'inscription) : pseudo, e-mail, mot de passe, puis le code de confirmation reçu par e-mail.
2. Se déconnecter, se reconnecter avec e-mail + mot de passe : aucun code demandé.
3. Connecté : commenter. Déconnecté : « Commenter » ouvre l'écran de connexion.
4. J'aime / retrait ; Partager puis ouvrir le lien ; recharger (la session reste).
5. Admin : ajouter une vidéo payante (fichier), vérifier qu'elle reste fermée en navigation privée.

## Limites
- Le vrai paiement automatique n'existe pas (prestataire Mobile Money + serveur nécessaires).
- Les offres pack et abonnement ont été retirées.
- Reprise de lecture et favoris : enregistrés sur l'appareil.
- Les notifications sont un message à l'ouverture (pas de push).
- Les textes sont en français ; swahili et lingala non relus, avec repli sur le français.
