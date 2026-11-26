plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "app.precis"
    compileSdk = 36

    defaultConfig {
        applicationId = "app.precis.listen"
        minSdk = 26 // Anthropic Java SDK + java.time need API 26+
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false // Jackson/OkHttp in the Anthropic SDK need keep rules before enabling R8
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures { compose = true }
    packaging {
        resources {
            excludes += setOf(
                "META-INF/AL2.0", "META-INF/LGPL2.1", "META-INF/DEPENDENCIES", "META-INF/INDEX.LIST",
                "META-INF/LICENSE*", "META-INF/NOTICE*", "META-INF/*.kotlin_module",
            )
        }
    }
}

kotlin {
    compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) }
}

dependencies {
    implementation(project(":core"))

    implementation(platform("androidx.compose:compose-bom:2026.11.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.compose.foundation:foundation")

    implementation("androidx.activity:activity-compose:1.13.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.11.1")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.11.1")
    implementation("androidx.core:core-ktx:1.19.1")
    implementation("androidx.media:media:1.8.0") // MediaSessionCompat + MediaStyle notification
    implementation("androidx.security:security-crypto:1.1.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.2")
}
