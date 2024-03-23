import {useState} from "react"
import LinkButton from "../LinkButton"
import "./Header.css"

function NavigationButton({ href, imgSrc, altText, label }) {
    return (
        <LinkButton className="boutonNavigation" href={href}>
            <img src={imgSrc} alt={altText} width="40" height="40"/>
            {label}
        </LinkButton>
    )
}

export default function Header() {
    const [isSpinning, setIsSpinning] = useState(false)
    const handleMouseEnter = () => setIsSpinning(true)
    const handleAnimationEnd = () => setIsSpinning(false)

    return (
        <header>
            <LinkButton id="boutonAccueil" href="/" onMouseEnter={handleMouseEnter}>
                <img
                    src="/assets/pokeball.svg"
                    alt="Pokeball"
                    className={isSpinning ? 'spinning' : ''}
                    onAnimationEnd={handleAnimationEnd}
                />
                <h1>PokéManager</h1>
            </LinkButton>

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
    )
}