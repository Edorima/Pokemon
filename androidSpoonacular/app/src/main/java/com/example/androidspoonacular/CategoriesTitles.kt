package com.example.androidspoonacular

class CategoriesTitles() {
    private var dataListType = mutableListOf<String>()
    private var dietCategoriesTitles = mutableListOf<String>()

    init {
        dataListType = mutableListOf(
            "All",
            "African",
            "Asian",
            "American",
            "British",
            "Cajun",
            "Caribbean",
            "Chinese",
            "Eastern European",
            "European",
            "French",
            "German",
            "Greek",
            "Indian",
            "Irish",
            "Italian",
            "Japanese",
            "Jewish",
            "Korean",
            "Latin American",
            "Mediterranean",
            "Mexican",
            "Middle Eastern",
            "Nordic",
            "Southern",
            "Spanish",
            "Thai",
            "Vietnamese"
        )

        dietCategoriesTitles = mutableListOf(
            "All",
            "Gluten Free",
            "Ketogenic",
            "Vegetarian",
            "Lacto-Vegetarian",
            "Ovo-Vegetarian",
            "Vegan",
            "Pescetarian",
            "Paleo",
            "Primal",
            "Low FODMAP",
            "Whole30"
        )
    }

    fun getType() : MutableList<String> {
        return dataListType
    }

    fun getDiet() : MutableList<String> {
        return  dietCategoriesTitles
    }
}