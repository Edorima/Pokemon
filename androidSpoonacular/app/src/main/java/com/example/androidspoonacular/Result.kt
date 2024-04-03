package com.example.androidspoonacular

import kotlinx.serialization.Serializable

@Serializable
data class Result(
    val id: Int,
    val title : String,
    val image : String,
    val imageType : String
)