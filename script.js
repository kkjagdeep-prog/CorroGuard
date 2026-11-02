 
/* =========================================
   CORROGUARD - JAVASCRIPT
   Corrosion Risk Analysis Platform
   ========================================= */

// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. GET HTML ELEMENTS
    // =====================================

    const metal = document.getElementById("metal");

    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const ph = document.getElementById("ph");
    const salinity = document.getElementById("salinity");

    const temperatureValue = document.getElementById("temperatureValue");
    const humidityValue = document.getElementById("humidityValue");
    const phValue = document.getElementById("phValue");
    const salinityValue = document.getElementById("salinityValue");

    const analyzeButton = document.getElementById("analyzeButton");

    const riskScore = document.getElementById("riskScore");
    const riskLevel = document.getElementById("riskLevel");
    const riskDescription = document.getElementById("riskDescription");
    const riskCircle = document.getElementById("riskCircle");
    const resultMetal = document.getElementById("resultMetal");

    // =====================================
    // 2. UPDATE SLIDER VALUES
    // =====================================

    function updateSliderValues() {

        temperatureValue.textContent = temperature.value + " °C";

        humidityValue.textContent = humidity.value + "%";

        phValue.textContent = Number(ph.value).toFixed(1);

        salinityValue.textContent = salinity.value + "%";
    }

    temperature.addEventListener("input", updateSliderValues);
    humidity.addEventListener("input", updateSliderValues);
    ph.addEventListener("input", updateSliderValues);
    salinity.addEventListener("input", updateSliderValues);

    updateSliderValues();

    // =====================================
    // 3. CORROSION RISK MODEL
    // =====================================

    function calculateCorrosionRisk() {

        const temp = Number(temperature.value);
        const humid = Number(humidity.value);
        const acidity = Number(ph.value);
        const salt = Number(salinity.value);
        const selectedMetal = metal.value;

        // Environmental factor scores (0-100)

        const humidityRisk = humid;

        const temperatureRisk = (temp / 60) * 100;

        const saltRisk = salt;

        // Greater acidity or alkalinity can affect corrosion,
        // depending on the metal and chemical environment.
        const phRisk = (Math.abs(acidity - 7) / 7) * 100;

        // Weighted educational environmental score
        let environmentalScore =
            (humidityRisk * 0.35) +
            (temperatureRisk * 0.20) +
            (saltRisk * 0.30) +
            (phRisk * 0.15);

        // Illustrative material adjustment factors.
        // These are not experimentally calibrated corrosion rates.
        const metalFactors = {
            iron: 1.00,
            steel: 0.95,
            aluminium: 0.70,
            copper: 0.75
        };

        const finalScore = Math.min(
            100,
            Math.round(environmentalScore * metalFactors[selectedMetal])
        );

        return finalScore;
    }

    // =====================================
    // 4. DISPLAY RISK RESULT
    // =====================================

    function analyzeCorrosion() {

        const score = calculateCorrosionRisk();

        const selectedMetal = metal.options[metal.selectedIndex].text;

        riskScore.textContent = score;

        resultMetal.textContent = selectedMetal;

        let level;
        let description;
        let color;

        if (score < 30) {

            level = "Low Risk";
            color = "#20a878";

            description =
                "The selected conditions produce a relatively low score in this educational model. Continue monitoring the material.";

        } else if (score < 60) {

            level = "Moderate Risk";
            color = "#e5a52b";

            description =
                "The selected conditions produce a moderate score. Consider appropriate material protection and environmental monitoring.";

        } else if (score < 80) {

            level = "High Risk";
            color = "#e47735";

            description =
                "The selected conditions produce a high score. Evaluate protective coatings and suitable corrosion-control methods.";

        } else {

            level = "Very High Risk";
            color = "#d94b55";

            description =
                "The selected conditions produce a very high score. A detailed engineering assessment and suitable protection strategy are recommended.";
        }

        riskLevel.textContent = level;
        riskLevel.style.color = color;

        riskDescription.textContent = description;

        // Update circular risk indicator
        const degrees = score * 3.6;

        riskCircle.style.background =
            `conic-gradient(${color} ${degrees}deg, #e7edf4 ${degrees}deg)`;

    }

    // =====================================
    // 5. ANALYZE BUTTON
    // =====================================

    analyzeButton.addEventListener("click", analyzeCorrosion);

    // Recalculate when material changes
    metal.addEventListener("change", analyzeCorrosion);

    // Initial result
    analyzeCorrosion();

    // =====================================
    // 6. ENVIRONMENTAL IMPACT CHART
    // =====================================

    const chartCanvas = document.getElementById("impactChart");

    if (chartCanvas && typeof Chart !== "undefined") {

        const impactChart = new Chart(chartCanvas, {

            type: "bar",

            data: {

                labels: [
                    "Humidity",
                    "Temperature",
                    "Salt Exposure",
                    "pH Variation"
                ],

                datasets: [{

                    label: "Illustrative Model Weight (%)",

                    data: [35, 20, 30, 15],

                    backgroundColor: [
                        "#2476bd",
                        "#26b6c9",
                        "#e5a52b",
                        "#718096"
                    ],

                    borderRadius: 8,

                    borderSkipped: false

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {
                        backgroundColor: "#10243e",
                        padding: 12
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        title: {
                            display: true,
                            text: "Model Weight (%)"
                        },

                        grid: {
                            color: "#edf1f6"
                        }

                    },

                    x: {

                        grid: {
                            display: false
                        }

                    }

                }

            }

        });

    } else if (chartCanvas) {

        console.warn("Chart.js could not be loaded.");

    }

    // =====================================
    // 7. NAVIGATION LINK SMOOTH SCROLL
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const target = document.querySelector(
                this.getAttribute("href")
            );

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

    console.log("CorroGuard initialized successfully!");

});

