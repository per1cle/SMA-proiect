package com.example.smishsmashsmosh.ui

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.smishsmashsmosh.ui.history.DetailScreen
import com.example.smishsmashsmosh.ui.history.HistoryScreen
import com.example.smishsmashsmosh.ui.home.HomeScreen

@Composable
fun AppNavigation() {
    val nav = rememberNavController()
    NavHost(nav, startDestination = "home") {
        composable("home") { HomeScreen(onOpenHistory = { nav.navigate("history") }) }
        composable("history") {
            HistoryScreen(onBack = { nav.popBackStack() }, onOpen = { nav.navigate("detail/$it") })
        }
        composable("detail/{id}", arguments = listOf(navArgument("id") { type = NavType.LongType })) {
            DetailScreen(it.arguments!!.getLong("id"), onBack = { nav.popBackStack() })
        }
    }
}
