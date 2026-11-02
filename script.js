
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
            `conic-gradient(${color} ${degrees}deg, #e7edf4 ${degrees}deg)`;

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
    // 8. CORROSION PREVENTION RECOMMENDATIONS
    // =====================================

    const getRecommendations =
        document.getElementById("getRecommendations");

    const recommendationResult =
        document.getElementById("recommendationResult");

    if (getRecommendations && recommendationResult) {

        getRecommendations.addEventListener("click", function () {

            const selectedMetal = metal.value;

            const humid = Number(humidity.value);
            const temp = Number(temperature.value);
            const acidity = Number(ph.value);
            const salt = Number(salinity.value);

            const selectedMetalName =
                metal.options[metal.selectedIndex].text;

            let recommendations = [];

            // General recommendations
            recommendations.push(
                "Inspect the material regularly for visible corrosion and coating damage."
            );

            recommendations.push(
                "Keep surfaces clean and avoid unnecessary moisture accumulation."
            );


            // Material-specific recommendations
            if (selectedMetal === "iron" || selectedMetal === "steel") {

                recommendations.push(
                    "Consider suitable protective coatings or painting systems to reduce direct environmental exposure."
                );

                recommendations.push(
                    "Evaluate galvanization where appropriate for the application."
                );

            } else if (selectedMetal === "aluminium") {

                recommendations.push(
                    "Preserve the protective oxide layer and consider suitable anodizing or coating systems."
                );

                recommendations.push(
                    "Evaluate electrical isolation when aluminium is joined to dissimilar metals."
                );

            } else if (selectedMetal === "copper") {

                recommendations.push(
                    "Select a suitable protective coating when the service environment requires additional protection."
                );

                recommendations.push(
                    "Check connections with dissimilar metals for possible galvanic corrosion."
                );

            }


            // Environmental recommendations
            if (humid >= 70) {

                recommendations.push(
                    "High humidity detected: improve drainage and ventilation where possible to reduce moisture accumulation."
                );

            }

            if (temp >= 40) {

                recommendations.push(
                    "Elevated temperature detected: verify that the selected material and coating are suitable for the operating temperature."
                );

            }

            if (salt >= 50) {

                recommendations.push(
                    "High salt exposure detected: consider suitable marine-environment protective systems and regular removal of salt deposits."
                );

            }

            if (acidity < 5 || acidity > 9) {

                recommendations.push(
                    "The selected pH is outside the near-neutral range: verify chemical compatibility and consider suitable corrosion-resistant materials."
                );

            }


            // Build recommendation list safely
            recommendationResult.replaceChildren();

            const heading = document.createElement("h3");
            heading.textContent = "🛡️ Recommended Protection Measures";

            const materialInfo = document.createElement("p");
            materialInfo.textContent =
                "Selected material: " + selectedMetalName;

            const environmentInfo = document.createElement("p");
            environmentInfo.textContent =
                "Environmental conditions: " +
                humid + "% humidity, " +
                temp + " °C, pH " +
                acidity.toFixed(1) + ", " +
                salt + "% salinity.";

            const listHeading = document.createElement("h4");
            listHeading.textContent = "Suggested Actions";

            const list = document.createElement("ul");

            recommendations.forEach(function (item) {

                const listItem = document.createElement("li");
                listItem.textContent = item;

                list.appendChild(listItem);

            });

            const note = document.createElement("p");
            note.textContent =
                "These suggestions are preliminary educational guidance, not a validated engineering design. Actual corrosion-control decisions require material specifications and professional assessment.";

            recommendationResult.append(
                heading,
                materialInfo,
                environmentInfo,
                listHeading,
                list,
                note
            );

        });

    }


    // =====================================
    // 9. NAVIGATION SMOOTH SCROLL
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

    // =====================================
    // 10. CORROSION RATE ESTIMATOR
    // =====================================

    const calculateRate = document.getElementById("calculateRate");
    const rateResult = document.getElementById("rateResult");

    if (calculateRate && rateResult) {

        calculateRate.addEventListener("click", function () {

            const initialWeight = Number(
                document.getElementById("initialWeight").value
            );

            const finalWeight = Number(
                document.getElementById("finalWeight").value
            );

            const surfaceArea = Number(
                document.getElementById("surfaceArea").value
            );

            const exposureTime = Number(
                document.getElementById("exposureTime").value
            );

            // Validate inputs

            if (
                document.getElementById("initialWeight").value === "" ||
                document.getElementById("finalWeight").value === "" ||
                document.getElementById("surfaceArea").value === "" ||
                document.getElementById("exposureTime").value === ""
            ) {
                rateResult.innerHTML = `
                    <h3>⚠️ Missing Measurements</h3>
                    <p>Please fill in all four fields before calculating.</p>
                `;
                return;
            }

            if (
                initialWeight <= 0 ||
                finalWeight < 0 ||
                surfaceArea <= 0 ||
                exposureTime <= 0
            ) {
                rateResult.innerHTML = `
                    <h3>⚠️ Invalid Measurements</h3>
                    <p>Weights, surface area, and exposure time must be valid positive measurements. Final weight cannot be negative.</p>
                `;
                return;
            }

            if (finalWeight > initialWeight) {
                rateResult.innerHTML = `
                    <h3>⚠️ Check Your Weights</h3>
                    <p>Final weight is greater than initial weight. Check your measurements before calculating weight loss.</p>
                `;
                return;
            }

            // Calculate weight loss

            const weightLoss = initialWeight - finalWeight;

            // Calculate mass loss rate

            const corrosionRate =
                weightLoss / (surfaceArea * exposureTime);

            // Display result

            rateResult.innerHTML = `
                <h3>✅ Corrosion Rate Result</h3>

                <p>
                    <strong>Initial Weight:</strong>
                    ${initialWeight} g
                </p>

                <p>
                    <strong>Final Weight:</strong>
                    ${finalWeight} g
                </p>

                <p>
                    <strong>Total Weight Loss:</strong>
                    ${weightLoss.toFixed(4)} g
                </p>

                <p>
                    <strong>Surface Area:</strong>
                    ${surfaceArea} cm²
                </p>

                <p>
                    <strong>Exposure Time:</strong>
                    ${exposureTime} hours
                </p>

                <h3>
                    Estimated Mass Loss Rate:
                    <span>${corrosionRate.toFixed(6)}</span>
                </h3>

                <p>
                    Unit: g/cm²/hour
                </p>

                <p>
                    This is an average mass loss rate based on
                    the measurements entered.
                </p>
            `;

        });

    }

});
