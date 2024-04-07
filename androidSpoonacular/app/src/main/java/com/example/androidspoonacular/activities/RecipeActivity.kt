package com.example.androidspoonacular.activities

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
    private  lateinit var recipeContent: TextView

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.recipe_detail)

        recipeTitle = findViewById(R.id.recipeName)
        recipeImage = findViewById(R.id.recipeImage)
        recipePrepTime = findViewById(R.id.preparationText)
        isVegan = findViewById(R.id.veganCheckBox)
        isVege = findViewById(R.id.veggieCheckBox)
        recipeContent = findViewById(R.id.recipeContent)

        val id = intent.getIntExtra("id", 0)
        var recipe: DetailRecipe
        ApiSpoonacular.detailRequestRecipe({ detailRecipe ->
            // Vérifier que la réponse n'est pas null
            if (detailRecipe != null) {

                Log.d("Resultat reçu", "ResultActivity")
                recipeTitle.text = detailRecipe.title
                Glide.with(this).load(detailRecipe.image).into(recipeImage)
                isVegan.isChecked = detailRecipe.vegan
                isVege.isChecked = detailRecipe.vegetarian
                val formattedText = Html.fromHtml(detailRecipe.summary, Html.FROM_HTML_MODE_LEGACY)
                recipeContent.text = formattedText

            } else {
                // cas où aucune recette n'a été trouvée
                Toast.makeText(this, "Aucune recette trouvée", Toast.LENGTH_SHORT).show()
            }
        }, this, id)


    }
}
