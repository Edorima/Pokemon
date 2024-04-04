package com.example.androidspoonacular

import android.os.Bundle
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class RecipeActivity : AppCompatActivity() {
    private lateinit var recipeImage: ImageView
    private lateinit var recipeTitle: TextView
    private lateinit var recipePrepTime: TextView
    private lateinit var isVegan: CheckBox
    private lateinit var isVege: CheckBox
    private  lateinit var recipeContent: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.recipe_detail)

        recipeTitle = findViewById(R.id.recipeName)
        recipeImage = findViewById(R.id.recipeImage)
        recipePrepTime = findViewById(R.id.preparationText)
        isVegan = findViewById(R.id.veganCheckBox)
        isVege = findViewById(R.id.veggieCheckBox)
        recipeContent = findViewById(R.id.recipeContent)

        val title = intent.getStringExtra("title")
        val image = intent.getIntExtra("image", 0)

        recipeTitle.text = title
        recipeImage.setImageResource(image)
    }
}
