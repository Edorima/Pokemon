package com.example.androidspoonacular

import android.content.Context
import android.util.Log
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

class ApiSpoonacular {
    companion object {
        private const val baseUrl = "https://api.spoonacular.com/"
        private const val key = "bcefedbe027d455cbefea35dda1a9fdc"
        //bcefedbe027d455cbefea35dda1a9fdc
        //2980f9e49c1b48e39cc29ca9fce9180b
        //fe45b7ce7dc3486597142119a88f92d2
        private var typeSelectionner = ""
        private var dietSelectioner = ""
        private var numberSelectionner = "1"
        fun requestSpoonRecipes(callback: (RootReponse?) -> Unit, context: Context) {
            val queue = Volley.newRequestQueue(context)

            val typeURL : String = if (typeSelectionner == "All") {
                ""
            } else {
                "cuisine=$typeSelectionner"
            }

            val dietURL : String = if (dietSelectioner == "All"){
                ""
            } else {
                "&diet=$dietSelectioner"
            }

            val numberURL : String = "&number=$numberSelectionner"

            val url = "$baseUrl/recipes/complexSearch?$typeURL$dietURL$numberURL&apiKey=$key"
            println(url)

            val stringRequest = StringRequest(
                Request.Method.GET, url,
                { response ->
                    // Gérer la réponse de la requête ici
                    val rootResponse = Json.decodeFromString<RootReponse>(response)
                    callback(rootResponse) // Appeler le callback avec la réponse
                },
                { error ->
                    // Gérer les erreurs de la requête ici
                    Log.e("API Error", error.toString())
                    callback(null) // Appeler le callback avec null en cas d'erreur
                })
            queue.add(stringRequest)
        }

        fun setTypeSelectionner(select: String) {
            typeSelectionner = select
        }

        fun setDietSelectioner(select: String) {
            dietSelectioner = select
        }

        fun setNumberSelectionner(select : String){
            numberSelectionner = select
        }
    }
}
