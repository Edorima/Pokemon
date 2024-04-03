package com.example.androidspoonacular

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class ResultActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.result_search)

        val listViewRecipes = findViewById<ListView>(R.id.maView)

        var tab : Array<Result> = arrayOf()
        // Récupération des données
        ApiSpoonacular.requestSpoonRecipes ({ rootResponse ->
            // Vérifier que la réponse n'est pas null
            if (rootResponse != null && rootResponse.results.isNotEmpty()) {

                Log.d("Resultat reçu", "ResultActivity")
                tab = rootResponse.results

                val adapter = ArrayAdapter(
                    this,
                    android.R.layout.simple_list_item_1,
                    rootResponse.results.map { it.title } // Utiliser les titres des recettes comme données
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

            // Récupérer l'élément cliqué

            val clickedItem = tab[position].title


            Toast.makeText(this, "Vous avez cliqué sur $clickedItem", Toast.LENGTH_SHORT).show()


        }
        buttonReturn.setOnClickListener {
            finish()
        }
    }
}
