package com.example.androidspoonacular.activities

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.androidspoonacular.ApiSpoonacular
import com.example.androidspoonacular.R
import com.example.androidspoonacular.Result

class ResultActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.result_search)

        val listViewRecipes = findViewById<ListView>(R.id.maView)

        var tab : List<Result> = listOf()
        // Récupération des données
        ApiSpoonacular.requestSpoonRecipes({ rootResponse ->
            // Vérifier que la réponse n'est pas null
            if (rootResponse != null && rootResponse.results.isNotEmpty()) {

                Log.d("Resultat reçu", "ResultActivity")
                val sortedResults = rootResponse.results.sortedBy { it.title }
                tab = sortedResults

                val adapter = ArrayAdapter(
                    this,
                    android.R.layout.simple_list_item_1,
                    sortedResults.map { it.title } // Utiliser les titres des recettes comme données
                )
                // Définir l'adaptateur sur la ListView
                listViewRecipes.adapter = adapter
            } else {
                // cas où aucune recette n'a été trouvée
                Toast.makeText(this, "Aucune recette trouvée", Toast.LENGTH_SHORT).show()
            }
        }, this)

        val buttonReturn = findViewById<Button>(R.id.retour_list)
        listViewRecipes.setOnItemClickListener { _, _, position, _ ->
            // Récupérer les infos de l'élément cliqué
            val id = tab[position].id

            // Envoyé ces infos sur la page recette
            val intent = Intent(this, RecipeActivity::class.java)
            intent.putExtra("id", id)

            startActivity(intent)
        }
        buttonReturn.setOnClickListener {
            finish()
        }
    }
}
