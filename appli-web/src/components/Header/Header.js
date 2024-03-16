import React from "react";
import './Header.css'

function NavigationButton({ href, imgSrc, altText, label }) {
    return (
        <a type="button" className="boutonNavigation" href={href}>
            <img src={imgSrc} alt={altText} />
            <span>{label}</span>
        </a>
    );
}

function Header() {
    return (
        <header>
            <a type="button" id="boutonAccueil" href="/">
                <img src="/assets/pokeball.svg" alt="Pokeball"/>
                <h1>PokéManager</h1>
            </a>

            <nav>
                <NavigationButton
                    href="/pokedex"
                    imgSrc="/assets/hyper_ball.svg"
                    altText="Hyper Ball"
                    label="Pokédex"
                />
                <NavigationButton
                    href="/objets"
                    imgSrc="/assets/potion.svg"
                    altText="Potion"
                    label="Objets"
                />
                <NavigationButton
                    href="/capacites"
                    imgSrc="/assets/ct.svg"
                    altText="CT"
                    label="Capacités"
                />
            </nav>

            <NavigationButton
                href="/profil"
                imgSrc="/assets/dresseur.svg"
                altText="Dresseur"
                label="Mon compte"
            />
        </header>
    );
}

export default Header;