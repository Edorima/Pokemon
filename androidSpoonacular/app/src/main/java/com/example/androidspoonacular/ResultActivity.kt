package com.example.androidspoonacular

import android.annotation.SuppressLint
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

        val apiSpoonacular = ApiSpoonacularHolder.apiSpoonacular

        // Appeler la méthode pour récupérer les recettes
        apiSpoonacular?.requestSpoonRecipes { rootResponse ->
            // Vérifier si la réponse n'est pas nulle et s'il y a des résultats
            if (rootResponse != null && rootResponse.results.isNotEmpty()) {
                // Créer un adaptateur pour la ListView
                Log.d("oq,fdqzrfzqd", "$apiSpoonacular.")
                val adapter = ArrayAdapter(
                    this,
                    android.R.layout.simple_list_item_1,
                    rootResponse.results.map { it.title } // Utiliser les titres des recettes comme données
                )
                // Définir l'adaptateur sur la ListView
                listViewRecipes.adapter = adapter
            } else {
                // Gérer le cas où aucune recette n'a été trouvée
                // Par exemple, afficher un message à l'utilisateur
                Toast.makeText(this, "Aucune recette trouvée", Toast.LENGTH_SHORT).show()
            }
        }

        val buttonReturn = findViewById<Button>(R.id.retour_list)

        buttonReturn.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
        }
    }
}
