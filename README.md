# PokéManager

Temps passé par Alexis : 158h00
<br>
Dernière mesure le 7 avril à 18h30

## Introduction

Pour terminer notre 2ème année d’IUT, nous avons eu à réaliser pour notre projet de **SAE**, une
application complexe. Pour ce faire nous avons développer des **API RESTful** en *NodeJS* sous
forme de micro-services, un client web en *REACT* ainsi qu’une application mobile Android (nous
nous focaliserons sur les API et le client web dans ce rapport).<br><br>

Le thème de l’application n’était pas imposé. Nous avons donc choisis le thème des Pokémon, voici
une petite explication en quoi elle consiste : <br><br>

> *« L'univers des Pokémon est une franchise multimédia qui a débuté au Japon en 1996,
centrée sur des créatures fictives appelées "Pokémon". Ces créatures vivent dans le
monde Pokémon aux côtés des humains. Les humains, souvent appelés dresseurs,
capturent et entraînent les Pokémon pour les faire combattre, généralement dans un but
sportif ou compétitif. Chaque Pokémon a un ou plusieurs types (comme l'eau, le feu, ou
la plante) qui déterminent ses forces et faiblesses face à d'autres Pokémon.<br><br>
Les informations essentielles sur les Pokémon incluent leur nom, type, évolution, et un ensemble de
capacités qu'ils peuvent utiliser en combat. Les Pokémon évoluent, c'est-à-dire qu'ils peuvent se transformer
en une version plus forte d'eux-mêmes, souvent en atteignant un certain niveau ou en répondant à des
conditions spécifiques.<br><br>
L'univers Pokémon s'étend à travers des jeux vidéo, des séries télévisées, des films, des
cartes à collectionner, et plus encore, permettant aux fans d'explorer cet univers de
manières variées. Les jeux vidéo sont le cœur de la franchise, offrant une expérience
immersive où les joueurs peuvent capturer, élever, et combattre avec des Pokémon dans
le but de devenir le meilleur dresseur.<br><br>
Au fil des années, l'univers Pokémon s'est enrichi de nouvelles régions inspirées de lieux réels, chacune avec
ses propres espèces de Pokémon, ajoutant à la diversité et à la richesse de ce monde. L'interaction entre les
dresseurs et leurs Pokémon est un thème central, soulignant l'importance de l'amitié, du respect, et du
travail d'équipe.<br><br>
En somme, l'univers des Pokémon est un monde vaste et captivant, où la collecte, l'élevage, et les combats de
Pokémon forment la base d'aventures sans fin pour les dresseurs aspirants de tout âge. »*


*Source : explication brève de l’univers des Pokémon pour un adulte ne connaissant pas l’univers – ChatGPT 4*<br><br>


Notre application s’appelle « **PokéManager** », elle permet de consulter la liste des Pokémon, des
objets, des capacités que peuvent apprendre les Pokémon. Le point clé de l’application se situe dans
la partie interaction utilisateur, car ceux-ci peuvent gérer (ajouter, modifier et supprimer) des
équipes qu’ils peuvent constituer à travers un espace profil qui leur est dédié. Une équipe est
constituée de 6 Pokémon maximum et chaque Pokémon peut être personnalisé (attaques, objet qu’il
porte, chromatique ou non).<br>

## Ce qui est améliorable
- Affichage d'erreur page profil lors d'échec de modif/ajout
- Mot de passe à crypter côté client

## Ce qui n'a pas été fait
- Page profil possibilité de définir une équipe préférée
- Page d'accueil