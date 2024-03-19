import React from "react"

function ItemCard({ nom, image, description }) {
    return (
        <div className="item-card">
            <img className="item-sprite" src={image} alt={nom}/>
            <span className="item-name">{nom}</span>
            <p className="item-description">{description}</p>
        </div>
    )
}

export default ItemCard