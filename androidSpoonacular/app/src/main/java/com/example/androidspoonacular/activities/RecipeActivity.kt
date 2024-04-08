package com.example.androidspoonacular.activities

import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import android.text.Html
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.example.androidspoonacular.ApiSpoonacular
import com.example.androidspoonacular.DetailRecipe
import com.example.androidspoonacular.R
import com.bumptech.glide.Glide


class RecipeActivity : AppCompatActivity() {
        private lateinit var recipeImage: ImageView
        private lateinit var recipeTitle: TextView
        private lateinit var recipePrepTime: TextView
        private lateinit var isVegan: CheckBox
        private lateinit var isVege: CheckBox
        private lateinit var recipeContent: TextView
        private var recipe: DetailRecipe? = null

        @RequiresApi(Build.VERSION_CODES.N)
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            if (resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) {
                setContentView(R.layout.recipe_detail_land)
            } else {
                setContentView(R.layout.recipe_detail)
            }
            setupRecipeUI()

        }

        @RequiresApi(Build.VERSION_CODES.N)
        override fun onConfigurationChanged(newConfig: Configuration) {
            super.onConfigurationChanged(newConfig)
            if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
                setContentView(R.layout.recipe_detail_land)
                setupRecipeUI()
            } else {
                setContentView(R.layout.recipe_detail)
                setupRecipeUI()

            }
        }

        @RequiresApi(Build.VERSION_CODES.N)
        private fun setupRecipeUI() {
            Log.d("chargement", "")
            recipeTitle = findViewById(R.id.recipeName)
            recipeImage = findViewById(R.id.recipeImage)
            recipePrepTime = findViewById(R.id.preparationText)
            isVegan = findViewById(R.id.veganCheckBox)
            isVege = findViewById(R.id.veggieCheckBox)
            recipeContent = findViewById(R.id.recipeContent)

            // Récupération de l'ID de la recette depuis l'intent
            val id = intent.getIntExtra("id", 0)

            if (recipe == null) {
                // Appel à l'API pour récupérer les détails de la recette seulement si la variable recipe est nulle
                ApiSpoonacular.detailRequestRecipe({ detailRecipe ->
                    // Vérification de la réponse
                    if (detailRecipe != null) {
                        recipe = detailRecipe
                        // Mise à jour de l'UI avec les détails de la recette
                        recipeTitle.text = detailRecipe.title
                        Glide.with(this).load(detailRecipe.image).into(recipeImage)
                        isVegan.isChecked = detailRecipe.vegan
                        isVege.isChecked = detailRecipe.vegetarian
                        val formattedText = Html.fromHtml(detailRecipe.summary, Html.FROM_HTML_MODE_LEGACY)
                        recipeContent.text = formattedText
                    } else {
                        // Affichage d'un message en cas d'erreur
                        Toast.makeText(this, "Aucune recette trouvée", Toast.LENGTH_SHORT).show()
                    }
                }, this, id)
            } else {
                // Si la variable recipe n'est pas nulle, cela signifie que nous avons déjà les données de la recette
                // Vous pouvez mettre à jour l'UI avec les données existantes ici
                Log.d("coucou", "")
                recipeTitle.text = recipe!!.title
                Glide.with(this).load(recipe!!.image).into(recipeImage)
                isVegan.isChecked = recipe!!.vegan
                isVege.isChecked = recipe!!.vegetarian
                val formattedText = Html.fromHtml(recipe!!.summary, Html.FROM_HTML_MODE_LEGACY)
                recipeContent.text = formattedText
            }
        }
    }
