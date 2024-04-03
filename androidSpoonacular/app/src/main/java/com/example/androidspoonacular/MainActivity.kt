package com.example.androidspoonacular

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Spinner
import android.widget.Toast
import com.google.android.material.chip.Chip

object ApiSpoonacularHolder {
    var apiSpoonacular: ApiSpoonacular? = null
}
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val typeSpinner = findViewById<Spinner>(R.id.typeSpinner)
        val dietSpinner = findViewById<Spinner>(R.id.dietSpinner)
        val bouttonRecherche = findViewById<Button>(R.id.buttonRecherche)
        val categoriesTitles = CategoriesTitles()
        val apiSpoonacular = ApiSpoonacular(this)
        ApiSpoonacularHolder.apiSpoonacular = apiSpoonacular

        val adapterType = ArrayAdapter(this, android.R.layout.simple_spinner_item, categoriesTitles.getType())
        adapterType.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        val adapterDiet = ArrayAdapter(this, android.R.layout.simple_spinner_item, categoriesTitles.getDiet())
        adapterDiet.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

        typeSpinner.adapter = adapterType
        dietSpinner.adapter = adapterDiet





        typeSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                // Récupérer l'élément sélectionné
                val selectedItem = parent?.getItemAtPosition(position).toString()
                apiSpoonacular.setTypeSelectionner(selectedItem)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Code à exécuter si rien n'est sélectionné dans le Spinner (optionnel)
            }
        }

        dietSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                // Récupérer l'élément sélectionné
                val selectedItem = parent?.getItemAtPosition(position).toString()
                apiSpoonacular.setDietSelectioner(selectedItem)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Code à exécuter si rien n'est sélectionné dans le Spinner (optionnel)
            }
        }

        bouttonRecherche.setOnClickListener {
            apiSpoonacular.requestSpoonRecipes {
                    rootResponse ->
                // Traiter la réponse de l'API ici
                if (rootResponse != null) {
                    // La réponse est disponible
                    Log.d("API response", rootResponse.toString())

                } else {
                    // Une erreur s'est produite lors de la requête
                    Log.e("API Error", "Une erreur s'est produite lors de la requête")
                }
            }

            startActivity(Intent(this,ResultActivity::class.java))
        }

    }
}