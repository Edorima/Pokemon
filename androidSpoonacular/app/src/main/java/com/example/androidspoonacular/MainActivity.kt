package com.example.androidspoonacular

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.SeekBar
import android.widget.Spinner
import android.widget.TextView
import com.example.androidspoonacular.ApiSpoonacular.Companion.setNumberSelectionner

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //Récupération des éléments de la page
        val typeSpinner = findViewById<Spinner>(R.id.typeSpinner)
        val dietSpinner = findViewById<Spinner>(R.id.dietSpinner)
        val bouttonRecherche = findViewById<Button>(R.id.buttonRecherche)
        val seekBar = findViewById<SeekBar>(R.id.seekBar)
        val textViewSelectedValue = findViewById<TextView>(R.id.numberSeekBar)
        //Récup des catégories
        val categoriesTitles = CategoriesTitles()

        //Adaptateur
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
                ApiSpoonacular.setTypeSelectionner(selectedItem)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Code à exécuter si rien n'est sélectionné dans le Spinner (optionnel)
            }
        }

        dietSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                // Récupérer l'élément sélectionné
                val selectedItem = parent?.getItemAtPosition(position).toString()
                ApiSpoonacular.setDietSelectioner(selectedItem)
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Code à exécuter si rien n'est sélectionné dans le Spinner (optionnel)
            }
        }

        bouttonRecherche.setOnClickListener {
            ApiSpoonacular.requestSpoonRecipes({
                    rootResponse ->
                // Traiter la réponse de l'API ici
                if (rootResponse != null) {
                    // La réponse est disponible
                    Log.d("API response", rootResponse.toString())

                } else {
                    // Une erreur s'est produite lors de la requête
                    Log.e("API Error", "Une erreur s'est produite lors de la requête")
                }
            }, this)

            startActivity(Intent(this,ResultActivity::class.java))
        }



        seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                // Mise à jour de la valeur lorsque le Slider est déplacé
                val selectedValue = progress.toString()
                setNumberSelectionner(selectedValue)       //Modifie
                textViewSelectedValue.text = selectedValue //Text en dessous de la seek bar
            }

            override fun onStartTrackingTouch(seekBar: SeekBar?) {
            }

            override fun onStopTrackingTouch(seekBar: SeekBar?) {
            }
        })
    }
}