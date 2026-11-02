```javascript
/* =========================================
   CORROGUARD - JAVASCRIPT
   Corrosion Risk Analysis Platform
========================================= */

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

        const humidityRisk = humid;
        const temperatureRisk = (temp / 60) * 100;
        const saltRisk = salt;
        const phRisk = (Math.abs(acidity - 7) / 7) * 100;

        let environmentalScore =
            (humidityRisk * 0.35) +
            (temperatureRisk * 0.20) +
            (saltRisk * 0.30) +
            (phRisk * 0.15);

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

        const degrees = score * 3.6;

        riskCircle.style.background =
 circle.style.background = `conic-gradient($DIL0 $DIL1deg, #e7edf4 $DIL2deg)`;

    }


    // =====================================
    // 5. ANALYZE BUTTON
    // =====================================

    analyzeButton.addEventListener("click", analyzeCorrosion);

    metal.addEventListener("change", analyzeCorrosion);

    analyzeCorrosion();


    // =====================================
    // 6. ENVIRONMENTAL IMPACT CHART
    // =====================================

    const chartCanvas = document.getElementById("impactChart");

    if (chartCanvas && typeof Chart !== "undefined") {

        new Chart(chartCanvas, {

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
    // 7. METAL COMPATIBILITY CHECKER
    // =====================================

    const metalOne = document.getElementById("metalOne");
    const metalTwo = document.getElementById("metalTwo");

    const checkCompatibility =
        document.getElementById("checkCompatibility");

    const compatibilityResult =
        document.getElementById("compatibilityResult");

    if (metalOne && metalTwo && checkCompatibility && compatibilityResult) {

        const metalNames = {
            zinc: "Zinc",
            steel: "Carbon Steel",
            aluminium: "Aluminium",
            copper: "Copper",
            stainless: "Passive Stainless Steel"
        };

        const galvanicPairs = {

            "copper-zinc": {
                anodic: "Zinc",
                explanation:
                    "Zinc is generally more active than copper in common aqueous environments. When electrically connected in an electrolyte, zinc may corrode preferentially.",
                precaution:
                    "Consider electrical insulation, compatible material selection, and suitable protective systems."
            },

            "steel-copper": {
                anodic: "Carbon Steel",
                explanation:
                    "Carbon steel is generally more active than copper in many aqueous environments. The steel may experience accelerated corrosion when the metals are electrically connected.",
                precaution:
                    "Consider insulating the connection, applying suitable coatings, and preventing electrolyte accumulation."
            },

            "aluminium-copper": {
                anodic: "Aluminium",
                explanation:
                    "Aluminium is generally more active than copper. Its protective oxide film can influence the actual behaviour, but galvanic corrosion is a concern in conductive environments.",
                precaution:
                    "Consider electrical isolation and protective coatings designed for the environment."
            },

            "aluminium-steel": {
                anodic: "Environment dependent",
                explanation:
                    "The galvanic behaviour of aluminium and carbon steel depends on the alloys, surface films, electrolyte, and exposure conditions.",
                precaution:
                    "Consult material-specific galvanic-series data and consider electrical isolation."
            },

            "copper-stainless": {
                anodic: "Environment dependent",
                explanation:
                    "Copper and passive stainless steel can have different galvanic behaviour depending on their grades and the electrolyte.",
                precaution:
                    "Check the specific stainless-steel grade and environment before selecting the joint design."
            }

        };


        checkCompatibility.addEventListener("click", function () {

            const first = metalOne.value;
            const second = metalTwo.value;

            const firstName = metalNames[first];
            const secondName = metalNames[second];

            if (first === second) {

                compatibilityResult.innerHTML = `
                    <h3>Same Metal Combination</h3>

                    <p>
                        You selected ${firstName} and ${secondName}.
                        Since both selections represent the same material,
                        there is generally no galvanic driving force caused
                        by coupling two different metals.
                    </p>

                    <strong>Note:</strong>

                    <p>
                        Ordinary corrosion can still occur depending on
                        the environment and material condition.
                    </p>
                `;

                return;

            }

            const pairKey = [first, second].sort().join("-");

            const pair = galvanicPairs[pairKey];

            if (pair) {

                compatibilityResult.innerHTML = `
                    <h3>Galvanic Corrosion: Possible</h3>

                    <p>
                        <strong>Selected metals:</strong>
                        ${firstName} + ${secondName}
                    </p>

                    <p>${pair.explanation}</p>

                    <p>
                        <strong>Metal that may corrode preferentially:</strong>
                        ${pair.anodic}
                    </p>

                    <p>
                        <strong>Precaution:</strong>
                        ${pair.precaution}
                    </p>
                `;

            } else {

                compatibilityResult.innerHTML = `
                    <h3>Further Material Information Needed</h3>

                    <p>
                        You selected ${firstName} and ${secondName}.
                        Their galvanic behaviour cannot be reliably
                        determined from these broad material names alone.
                    </p>

                    <p>
                        <strong>Precaution:</strong>
                        Check the exact alloy grades and galvanic-series
                        data for the electrolyte and operating conditions.
                    </p>
                `;

            }

        });

    }


    // =====================================
    // 8. NAVIGATION SMOOTH SCROLL
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
```
