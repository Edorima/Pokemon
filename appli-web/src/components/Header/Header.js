import React, {useState} from "react"

function NavigationButton({ href, imgSrc, altText, label }) {
    return (
        <a type="button" className="boutonNavigation" href={href}>
            <img src={imgSrc} alt={altText} width="40" height="40"/>
            <span>{label}</span>
        </a>
    )
}

function Header() {
    const [isSpinning, setIsSpinning] = useState(false)

    return (
        <header>
            <a type="button" id="boutonAccueil" href="/" onMouseEnter={() => setIsSpinning(true)}>
                <img
                    src="/assets/pokeball.svg"
                    alt="Pokeball"
                    className={isSpinning ? 'spinning' : ''}
                    onAnimationEnd={() => setIsSpinning(false)}
                />
                <h1>PokéManager</h1>
            </a>

            <nav>
                <NavigationButton
                    href="/pokedex"
                    imgSrc="/assets/hyper_ball.png"
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