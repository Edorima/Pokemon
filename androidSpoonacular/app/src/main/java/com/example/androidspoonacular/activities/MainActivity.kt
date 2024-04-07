package com.example.androidspoonacular.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.SeekBar
import android.widget.Spinner
import android.widget.TextView
import com.example.androidspoonacular.ApiSpoonacular
import com.example.androidspoonacular.CategoriesTitles
import com.example.androidspoonacular.R

class MainActivity : AppCompatActivity() {
    private lateinit var typeSpinner : Spinner
    private lateinit var dietSpinner : Spinner
    private lateinit var boutonRecherche : Button
    private lateinit var seekBar : SeekBar
    private lateinit var textViewSelectedValue : TextView
    private lateinit var barreRecherche : TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //Récupération des éléments de la page
        typeSpinner = findViewById(R.id.typeSpinner)
        dietSpinner = findViewById(R.id.dietSpinner)
        boutonRecherche = findViewById(R.id.buttonRecherche)
        seekBar = findViewById(R.id.seekBar)
        textViewSelectedValue = findViewById(R.id.numberSeekBar)
        barreRecherche = findViewById<TextView>(R.id.editTextText)
        //Récup des catégories
        val categoriesTitles = CategoriesTitles()

        //Adaptateur
        val adapterType = ArrayAdapter(this, android.R.layout.simple_spinner_item, categoriesTitles.dataListType)
        adapterType.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        val adapterDiet = ArrayAdapter(this, android.R.layout.simple_spinner_item, categoriesTitles.dietCategoriesTitles)
        adapterDiet.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        typeSpinner.adapter = adapterType
        dietSpinner.adapter = adapterDiet


        typeSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                // Récupérer l'élément sélectionné
                val selectedItem = parent?.getItemAtPosition(position).toString()
                ApiSpoonacular.type = selectedItem
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Code à exécuter si rien n'est sélectionné dans le Spinner (optionnel)
            }
        }

        dietSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                // Récupérer l'élément sélectionné
                val selectedItem = parent?.getItemAtPosition(position).toString()
                ApiSpoonacular.diet = selectedItem
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Code à exécuter si rien n'est sélectionné dans le Spinner (optionnel)
            }
        }

        boutonRecherche.setOnClickListener {
            ApiSpoonacular.requestSpoonRecipes({ rootResponse ->
                // Traiter la réponse de l'API ici
                if (rootResponse != null) {
                    // La réponse est disponible
                    Log.d("API response", rootResponse.toString())

                } else {
                    // Une erreur s'est produite lors de la requête
                    Log.e("API Error", "Une erreur s'est produite lors de la requête")
                }
            }, this)

            startActivity(Intent(this, ResultActivity::class.java))
        }

        barreRecherche.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                ApiSpoonacular.query = barreRecherche.text.toString()
                Log.d("query", "")
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Ne rien faire ici
            }
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                // Ne rien faire ici
            }
        })

        seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar, progress: Int, fromUser: Boolean) {
                // Mise à jour de la valeur lorsque le Slider est déplacé
                ApiSpoonacular.number = progress
                textViewSelectedValue.text = progress.toString() //Text en dessous de la seek bar
            }

            override fun onStartTrackingTouch(seekBar: SeekBar?) {}

            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })
    }
}