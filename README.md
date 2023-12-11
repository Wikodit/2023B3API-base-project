# Project NestJS

## Description
Embauché au sein d'une petite société de service bordelaise, je suis en charge de la création d'un portail interne de gestion de calendrier. Cette application aura pour but de gérer les jours de télétravail et de congé de toute l'entreprise.

## Fonctionnalitées 

Utilisateur: 

- Inscription d'employés 
- Authentification par email et mot de passe (génération JWT)
- Affichage des informations personnelles d'un utilisateur
- Liste de tous les utilisateurs inscrits sur la plateforme
- Affichage des informations personnelles d'un utilisateur
- Consultation du montant des titre restaurants pour un mois donné

Projets:

- Liste de tous les projets de l'entreprise (pour les admins et chef de projet)
- Liste des projets auxquels un utilisateur participe
- Consultation des détails d'un projet spécifique
- Création de novueaux projets avec nom et référent (pour les admins)

Affectations de projets: 

- Liste de toutes les affectations des employés aux différents projets ( pour les admins et chef de projet)
- Liste des affectations d'un employé aux projets( pour les employés)
- Consultation des détails d'une affectation spécifique.
- Création d'affectations d'employés à un projet pour une durée données (pour les admins et chef de projet)

Evenements: 

- Création d'événements de travail ou de congé ( avec validations)
- Affichage de tous les événements planifiés de tous les utilisateurs
- Consultation des détails d'un événement spécifique
- Validation/Refus d'un événement (pour les admins et chef de projet)


## Bonus

- Tracage de toutes les requêtes effectuées sur l'API, stockées dans le fichier logs.txt
- Génération d'un fichier CSV contenant la liste de tous les congés acceptés du mois en cours.
  - Stockage du fichier dans le fichier conges_acceptes.csv
  - Génération automatique le 25 de chaque mois.

## Installation
```bash
$ npm install
```
```bash
$ npm run start
```
## Récupérer les tests
```bash
$ git submodule update --init --recursive
```
## Lancer database / tests
```bash
docker-compose up --force-recreate -V
npm run test
```