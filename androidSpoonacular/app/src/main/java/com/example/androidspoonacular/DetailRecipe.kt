package com.example.androidspoonacular
import kotlinx.serialization.Serializable

@Serializable
data class DetailRecipe(
    val id: Int,
    val title : String,
    val image : String,
    val imageType : String,
    val readyInMinutes: Int,
    val summary: String,
    val vegan: Boolean,
    val vegetarian: Boolean
)
