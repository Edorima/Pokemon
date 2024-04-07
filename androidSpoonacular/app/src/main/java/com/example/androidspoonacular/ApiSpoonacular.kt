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
        private const val BASE_URL = "https://api.spoonacular.com"
        private const val KEY = "bcefedbe027d455cbefea35dda1a9fdc"
        //bcefedbe027d455cbefea35dda1a9fdc
        //2980f9e49c1b48e39cc29ca9fce9180b
        //fe45b7ce7dc3486597142119a88f92d2
        var type = ""
        var diet = ""
        var number = 1
        var query = ""

        fun requestSpoonRecipes(callback: (RootReponse?) -> Unit, context: Context) {
            val queue = Volley.newRequestQueue(context)

            val typeURL = if (type == "All") "" else "cuisine=$type"

            val dietURL = if (diet == "All") "" else "&diet=$diet"

            val queryURL = if (diet == "") "" else "&query=$query"

            val numberURL = "&number=$number"

            val url = "$BASE_URL/recipes/complexSearch?$typeURL$dietURL$numberURL$queryURL&apiKey=$KEY"
            println(url)

            val stringRequest = StringRequest(
                Request.Method.GET, url,
                { response ->
                    // Gérer la réponse de la requête ici
                    val rootResponse = Json.decodeFromString<RootReponse>(response)
                    callback(rootResponse) // Appeler le callback avec la réponse
                }, { error ->
                    // Gérer les erreurs de la requête ici
                    Log.e("API Error", error.toString())
                    callback(null) // Appeler le callback avec null en cas d'erreur
                })
            queue.add(stringRequest)
        }

        fun detailRequestRecipe(callback: (DetailRecipe?) -> Unit, context: Context, number: Int){
            val queue = Volley.newRequestQueue(context)
            val url = "$BASE_URL/recipes/$number/information?&apiKey=$KEY"
            val stringRequest = StringRequest(
                Request.Method.GET, url,
                { response ->
                    // Gérer la réponse de la requête ici
                    val json = Json { ignoreUnknownKeys = true }
                    val detailRecipe = json.decodeFromString<DetailRecipe>(response)
                    callback(detailRecipe) // Appeler le callback avec la réponse
                }, { error ->
                    // Gérer les erreurs de la requête ici
                    Log.e("API Error", error.toString())
                    callback(null) // Appeler le callback avec null en cas d'erreur
                })

            queue.add(stringRequest)

        }
    }
}
