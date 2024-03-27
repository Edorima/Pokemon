package com.example.androidspoonacular

import android.util.Log
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import android.content.Context


@Serializable
data class RootReponse(
    val results : Array<Result>,
    val offset : Int,
    val number : Int,
    val totalResults : Int
)

@Serializable
data class Result(
    val id: Int,
    val title : String,
    val image : String,
    val imageType : String
)

class ApiSpoonacular(private val context: Context) {

    private val baseUrl = "https://api.spoonacular.com/"
    private val key = "2980f9e49c1b48e39cc29ca9fce9180b"

    fun requestSpoonRecipes(callback: (RootReponse?) -> Unit) {
        val queue = Volley.newRequestQueue(context)
        val url = "$baseUrl/recipes/complexSearch?apiKey=$key"

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
}
