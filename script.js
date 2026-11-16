/* =========================================
   CORROGUARD - JAVASCRIPT
   Corrosion Risk Analysis Platform
========================================= */


/* =========================================
   MATERIAL DATABASE
========================================= */

const metalNames = {
    iron: "Iron",
    steel: "Carbon Steel",
    aluminium: "Aluminium",
    copper: "Copper",
    stainless304: "Stainless Steel 304",
    stainless316: "Stainless Steel 316",
    galvanized: "Galvanized Iron",
    brass: "Brass",
    bronze: "Bronze",
    zinc: "Zinc",
    titanium: "Titanium"
};

const materialNames = metalNames;


/* =========================================
   1. MAIN PAGE INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

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


    /* =====================================
       2. UPDATE SLIDER VALUES
    ===================================== */

    function updateSliderValues() {

        if (temperatureValue && temperature) {
            temperatureValue.textContent = temperature.value + " °C";
        }

        if (humidityValue && humidity) {
            humidityValue.textContent = humidity.value + "%";
        }

        if (phValue && ph) {
            phValue.textContent = Number(ph.value).toFixed(1);
        }

        if (salinityValue && salinity) {
            salinityValue.textContent = salinity.value + "%";
        }

    }

    if (temperature) temperature.addEventListener("input", updateSliderValues);
    if (humidity) humidity.addEventListener("input", updateSliderValues);
    if (ph) ph.addEventListener("input", updateSliderValues);
    if (salinity) salinity.addEventListener("input", updateSliderValues);

    updateSliderValues();


    /* =====================================
       3. CORROSION RISK MODEL
    ===================================== */

    function calculateCorrosionRisk() {

        const temp = Number(temperature?.value || 0);
        const humid = Number(humidity?.value || 0);
        const acidity = Number(ph?.value || 7);
        const salt = Number(salinity?.value || 0);

        const selectedMetal = metal?.value || "iron";

        const humidityRisk = humid;
        const temperatureRisk = (temp / 60) * 100;
        const saltRisk = salt;
        const phRisk = (Math.abs(acidity - 7) / 7) * 100;

        const environmentalScore =
            (humidityRisk * 0.35) +
            (temperatureRisk * 0.20) +
            (saltRisk * 0.30) +
            (phRisk * 0.15);

        const metalFactors = {
            iron: 1.00,
            steel: 0.95,
            aluminium: 0.70,
            copper: 0.75,
            stainless304: 0.35,
            stainless316: 0.25,
            galvanized: 0.45,
            brass: 0.55,
            bronze: 0.45,
            zinc: 0.65,
            titanium: 0.15
        };

        const factor = metalFactors[selectedMetal] ?? 1;

        return Math.min(
            100,
            Math.round(environmentalScore * factor)
        );

    }


    /* =====================================
       4. DISPLAY RISK RESULT
    ===================================== */

    function analyzeCorrosion() {

        if (
            !metal ||
            !riskScore ||
            !riskLevel ||
            !riskDescription ||
            !riskCircle ||
            !resultMetal
        ) return;

        const score = calculateCorrosionRisk();

        const selectedMetal = metalNames[metal.value] || metal.value;

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

        riskScore.textContent = score;
        resultMetal.textContent = selectedMetal;

        riskLevel.textContent = level;
        riskLevel.style.color = color;

        riskDescription.textContent = description;

        const degrees = score * 3.6;

        riskCircle.style.background =
            `conic-gradient(${color} ${degrees}deg, #e7edf4 ${degrees}deg)`;


        /* UPDATE PROJECT DASHBOARD */

        const dashboardRiskScore =
            document.getElementById("dashboardRiskScore");

        const dashboardRiskLevel =
            document.getElementById("dashboardRiskLevel");

        const dashboardMetal =
            document.getElementById("dashboardMetal");

        if (dashboardRiskScore) {
            dashboardRiskScore.textContent = score + " / 100";
        }

        if (dashboardRiskLevel) {
            dashboardRiskLevel.textContent = level;
            dashboardRiskLevel.style.color = color;
        }

        if (dashboardMetal) {
            dashboardMetal.textContent =
                "Selected material: " + selectedMetal;
        }

    }


    /* =====================================
       5. ANALYZE BUTTON
    ===================================== */

    if (analyzeButton) {
        analyzeButton.addEventListener("click", analyzeCorrosion);
    }

    if (metal) {
        metal.addEventListener("change", analyzeCorrosion);
    }

    analyzeCorrosion();


    /* =====================================
       6. ENVIRONMENTAL IMPACT CHART
    ===================================== */

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


    /* =====================================
       7. METAL COMPATIBILITY CHECKER
    ===================================== */

    const metalOne = document.getElementById("metalOne");
    const metalTwo = document.getElementById("metalTwo");

    const checkCompatibility =
        document.getElementById("checkCompatibility");

    const compatibilityResult =
        document.getElementById("compatibilityResult");


    if (
        metalOne &&
        metalTwo &&
        checkCompatibility &&
        compatibilityResult
    ) {

        const galvanicPairs = {

            "copper-iron": {
                anodic: "Iron may corrode preferentially",
                explanation:
                    "Iron is generally less noble than copper in many aqueous environments and may corrode preferentially when electrically connected to copper.",
                precaution:
                    "Consider electrical isolation and suitable protective coatings."
            },

            "copper-steel": {
                anodic: "Carbon Steel may corrode preferentially",
                explanation:
                    "Carbon steel is generally more active than copper in many aqueous environments.",
                precaution:
                    "Consider insulating the connection, applying suitable coatings, and preventing electrolyte accumulation."
            },

            "copper-zinc": {
                anodic: "Zinc may corrode preferentially",
                explanation:
                    "Zinc is generally more active than copper in many aqueous environments.",
                precaution:
                    "Consider electrical insulation, compatible material selection, and suitable protective systems."
            },

            "aluminium-copper": {
                anodic: "Aluminium may corrode preferentially",
                explanation:
                    "Aluminium is generally more active than copper. Its protective oxide film and the environment influence actual behaviour.",
                precaution:
                    "Consider electrical isolation and suitable protective coatings."
            },

            "aluminium-steel": {
                anodic: "Environment dependent",
                explanation:
                    "The galvanic behaviour of aluminium and carbon steel depends on alloy grades, surface films, electrolyte, and exposed areas.",
                precaution:
                    "Consult material-specific galvanic-series data and consider electrical isolation."
            },

            "iron-zinc": {
                anodic: "Zinc may corrode preferentially",
                explanation:
                    "Zinc is generally more active than iron and can provide sacrificial protection to iron when properly connected.",
                precaution:
                    "Monitor zinc consumption and inspect the protective system."
            },

            "aluminium-stainless304": {
                anodic: "Environment dependent",
                explanation:
                    "Aluminium and passive Stainless Steel 304 may form a galvanic couple in conductive environments.",
                precaution:
                    "Consider electrical isolation and suitable joint protection."
            },

            "aluminium-stainless316": {
                anodic: "Environment dependent",
                explanation:
                    "The behaviour of aluminium coupled with Stainless Steel 316 depends on alloy grades, passive films, electrolyte, and exposed areas.",
                precaution:
                    "Consult material-specific galvanic data before selecting the combination."
            },

            "copper-stainless304": {
                anodic: "Environment dependent",
                explanation:
                    "Copper and passive Stainless Steel 304 may have different galvanic behaviour depending on electrolyte and surface condition.",
                precaution:
                    "Check the exact material grade and operating environment."
            },

            "copper-stainless316": {
                anodic: "Environment dependent",
                explanation:
                    "Copper and passive Stainless Steel 316 may have different galvanic behaviour depending on electrolyte, surface condition, and exposed areas.",
                precaution:
                    "Check material-specific galvanic data and consider electrical isolation where appropriate."
            }
        };


        function normalizeMaterial(value) {

            const rawValue = String(value || "").trim().toLowerCase();

            for (const [key, name] of Object.entries(materialNames)) {

                if (
                    key.toLowerCase() === rawValue ||
                    name.trim().toLowerCase() === rawValue
                ) {
                    return key;
                }

            }

            return rawValue.replace(/\s+/g, "");

        }


        function updateCompatibilityResult() {

            const firstValue = metalOne.value;
            const secondValue = metalTwo.value;

            const first = normalizeMaterial(firstValue);
            const second = normalizeMaterial(secondValue);

            const firstName = materialNames[first] || firstValue;
            const secondName = materialNames[second] || secondValue;

            compatibilityResult.replaceChildren();

            if (!firstValue || !secondValue) {

                compatibilityResult.textContent =
                    "Please select both materials.";

                return;

            }

            if (first === second) {

                compatibilityResult.innerHTML = `
                    <h3>Same Material Combination</h3>

                    <p>
                        <strong>Selected materials:</strong>
                        ${firstName} + ${secondName}
                    </p>

                    <p>
                        Coupling identical material grades generally
                        does not create a galvanic driving force
                        between two dissimilar metals.
                    </p>

                    <p>
                        <strong>Important:</strong>
                        Ordinary corrosion can still occur depending
                        on environmental conditions.
                    </p>
                `;

                return;

            }

            const pairKey = [first, second].sort().join("-");
            const pair = galvanicPairs[pairKey];

            if (pair) {

                compatibilityResult.innerHTML = `
                    <h3>Galvanic Compatibility Information</h3>

                    <p>
                        <strong>Selected materials:</strong>
                        ${firstName} + ${secondName}
                    </p>

                    <p>${pair.explanation}</p>

                    <p>
                        <strong>Possible preferentially corroding material:</strong>
                        ${pair.anodic}
                    </p>

                    <p>
                        <strong>Recommended precaution:</strong>
                        ${pair.precaution}
                    </p>
                `;

            } else {

                compatibilityResult.innerHTML = `
                    <h3>Condition-Dependent Compatibility</h3>

                    <p>
                        <strong>Selected materials:</strong>
                        ${firstName} + ${secondName}
                    </p>

                    <p>
                        These materials may behave differently when
                        electrically connected in a conductive
                        environment. Their galvanic behaviour depends
                        on their exact alloy grades, surface films,
                        electrolyte chemistry, and exposed surface areas.
                    </p>

                    <p>
                        <strong>Possible corrosion concern:</strong>
                        Galvanic corrosion should be evaluated before
                        using these materials together in a wet or
                        conductive environment.
                    </p>

                    <p>
                        <strong>Recommended precautions:</strong>
                        Check material-specific galvanic-series data,
                        consider electrical isolation, and use suitable
                        protective systems where appropriate.
                    </p>
                `;

            }

            const note = document.createElement("p");

            note.textContent =
                "Educational estimate only. Galvanic corrosion requires electrical contact and an electrolyte. Actual behaviour also depends on alloy grade, surface condition, electrolyte chemistry, and the relative exposed areas.";

            compatibilityResult.appendChild(note);

        }


        metalOne.addEventListener("change", updateCompatibilityResult);
        metalTwo.addEventListener("change", updateCompatibilityResult);
        checkCompatibility.addEventListener("click", updateCompatibilityResult);

        updateCompatibilityResult();

    }
       /* =====================================
       8. CORROSION PREVENTION RECOMMENDATIONS
    ===================================== */

    const getRecommendations =
        document.getElementById("getRecommendations");

    const recommendationResult =
        document.getElementById("recommendationResult");


    if (getRecommendations && recommendationResult) {

        getRecommendations.addEventListener("click", function () {

            const selectedMetal = metal?.value || "iron";

            const humid = Number(humidity?.value || 0);
            const temp = Number(temperature?.value || 0);
            const acidity = Number(ph?.value || 7);
            const salt = Number(salinity?.value || 0);

            const selectedMetalName = materialNames[selectedMetal] || selectedMetal;

            let recommendations = [];

            recommendations.push(
                "Inspect the material regularly for visible corrosion and coating damage."
            );

            recommendations.push(
                "Keep surfaces clean and avoid unnecessary moisture accumulation."
            );


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

            } else if (
                selectedMetal === "copper" ||
                selectedMetal === "brass" ||
                selectedMetal === "bronze"
            ) {

                recommendations.push(
                    "Select a suitable protective coating when the service environment requires additional protection."
                );

                recommendations.push(
                    "Check connections with dissimilar metals for possible galvanic corrosion."
                );

            } else if (
                selectedMetal === "stainless304" ||
                selectedMetal === "stainless316"
            ) {

                recommendations.push(
                    "Maintain the passive surface film and avoid unnecessary surface contamination."
                );

                recommendations.push(
                    "Consider chloride exposure carefully, particularly for Stainless Steel 304."
                );

                recommendations.push(
                    "Stainless Steel 316 often offers improved chloride resistance compared with 304, but it is not immune to corrosion."
                );

                recommendations.push(
                    "Select the stainless-steel grade based on the actual chemical environment."
                );

            } else if (selectedMetal === "galvanized") {

                recommendations.push(
                    "Inspect the zinc coating for scratches, wear, and exposed steel."
                );

                recommendations.push(
                    "Avoid damaging the protective coating during installation and maintenance."
                );

            } else if (selectedMetal === "zinc") {

                recommendations.push(
                    "Monitor zinc surfaces for coating consumption and deterioration."
                );

                recommendations.push(
                    "Consider the surrounding metals and electrolyte when zinc is used as a sacrificial material."
                );

            } else if (selectedMetal === "titanium") {

                recommendations.push(
                    "Check chemical and temperature compatibility for the specific titanium grade."
                );

                recommendations.push(
                    "Avoid assuming that titanium is resistant to every chemical environment."
                );

            }


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


            recommendationResult.replaceChildren();

            const heading = document.createElement("h3");
            heading.textContent = "Recommended Protection Measures";

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


    /* =====================================
       9. NAVIGATION SMOOTH SCROLL
    ===================================== */

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


    /* =====================================
       10. CORROSION RATE ESTIMATOR
    ===================================== */

    const calculateRate = document.getElementById("calculateRate");
    const rateResult = document.getElementById("rateResult");

    if (calculateRate && rateResult) {

        calculateRate.addEventListener("click", function () {

            const initialInput = document.getElementById("initialWeight");
            const finalInput = document.getElementById("finalWeight");
            const areaInput = document.getElementById("surfaceArea");
            const timeInput = document.getElementById("exposureTime");

            if (
                !initialInput ||
                !finalInput ||
                !areaInput ||
                !timeInput
            ) {
                rateResult.textContent =
                    "The measurement fields could not be found.";

                return;
            }

            const initialWeight = Number(initialInput.value);
            const finalWeight = Number(finalInput.value);
            const surfaceArea = Number(areaInput.value);
            const exposureTime = Number(timeInput.value);

            if (
                initialInput.value === "" ||
                finalInput.value === "" ||
                areaInput.value === "" ||
                timeInput.value === ""
            ) {

                rateResult.innerHTML = `
                    <h3>Missing Measurements</h3>
                    <p>Please fill in all four fields before calculating.</p>
                `;

                return;

            }

            if (
                initialWeight <= 0 ||
                finalWeight < 0 ||
                surfaceArea <= 0 ||
                exposureTime <= 0 ||
                !Number.isFinite(initialWeight) ||
                !Number.isFinite(finalWeight) ||
                !Number.isFinite(surfaceArea) ||
                !Number.isFinite(exposureTime)
            ) {

                rateResult.innerHTML = `
                    <h3>Invalid Measurements</h3>
                    <p>Enter valid positive measurements. Final weight cannot be negative.</p>
                `;

                return;

            }

            if (finalWeight > initialWeight) {

                rateResult.innerHTML = `
                    <h3>Check Your Weights</h3>
                    <p>Final weight is greater than initial weight. Check your measurements before calculating weight loss.</p>
                `;

                return;

            }

            const weightLoss = initialWeight - finalWeight;

            const corrosionRate =
                weightLoss / (surfaceArea * exposureTime);

            rateResult.innerHTML = `
                <h3>Corrosion Rate Result</h3>

                <p><strong>Initial Weight:</strong> ${initialWeight} g</p>
                <p><strong>Final Weight:</strong> ${finalWeight} g</p>
                <p><strong>Total Weight Loss:</strong> ${weightLoss.toFixed(4)} g</p>
                <p><strong>Surface Area:</strong> ${surfaceArea} cm²</p>
                <p><strong>Exposure Time:</strong> ${exposureTime} hours</p>

                <h3>
                    Estimated Mass Loss Rate:
                    <span>${corrosionRate.toFixed(6)}</span>
                </h3>

                <p>Unit: g/cm²/hour</p>

                <p>
                    This is an average mass loss rate based on
                    the measurements entered.
                </p>
            `;

        });

    }


}); // END OF MAIN PAGE INITIALIZATION
/* ==========================================
   11. CORROGUARD VIRTUAL EXPERIMENTAL LAB
========================================== */


/* ==========================================
   OPEN EXPERIMENT
========================================== */

function openExperiment(type) {

    const experimentDisplay = document.getElementById("experimentDisplay");
    const experimentTitle = document.getElementById("experimentTitle");
    const experimentDescription = document.getElementById("experimentDescription");
    const experimentControls = document.getElementById("experimentControls");
    const experimentResult = document.getElementById("experimentResult");

    if (
        !experimentDisplay ||
        !experimentTitle ||
        !experimentDescription ||
        !experimentControls ||
        !experimentResult
    ) {
        console.warn("Experimental Lab elements could not be found.");
        return;
    }

    experimentDisplay.style.display = "block";
    experimentControls.replaceChildren();
    experimentResult.replaceChildren();

    if (type === "rust") {

        experimentTitle.textContent = "Virtual Rusting Experiment";

        experimentDescription.textContent =
            "Explore how environmental conditions influence an illustrative iron corrosion model. Adjust humidity, oxygen availability, and salt exposure to compare the relative corrosion tendency.";

        experimentControls.innerHTML = `
            <div class="experiment-control">
                <label for="rustHumidity">Humidity (%)</label>
                <input type="range" id="rustHumidity" min="0" max="100" value="60">
                <span id="rustHumidityValue">60%</span>
            </div>

            <div class="experiment-control">
                <label for="rustOxygen">Oxygen Availability (%)</label>
                <input type="range" id="rustOxygen" min="0" max="100" value="70">
                <span id="rustOxygenValue">70%</span>
            </div>

            <div class="experiment-control">
                <label for="rustSalt">Salt Exposure (%)</label>
                <input type="range" id="rustSalt" min="0" max="100" value="30">
                <span id="rustSaltValue">30%</span>
            </div>

            <button type="button" id="runRustExperiment">
                Run Simulation
            </button>
        `;

        const humidityInput = document.getElementById("rustHumidity");
        const oxygenInput = document.getElementById("rustOxygen");
        const saltInput = document.getElementById("rustSalt");

        humidityInput.addEventListener("input", function () {
            document.getElementById("rustHumidityValue").textContent =
                this.value + "%";
        });

        oxygenInput.addEventListener("input", function () {
            document.getElementById("rustOxygenValue").textContent =
                this.value + "%";
        });

        saltInput.addEventListener("input", function () {
            document.getElementById("rustSaltValue").textContent =
                this.value + "%";
        });

        document.getElementById("runRustExperiment")
            .addEventListener("click", runRustExperiment);

    }


    else if (type === "salt") {

        experimentTitle.textContent = "Salt Exposure Experiment";

        experimentDescription.textContent =
            "Compare the illustrative effect of increasing salt exposure on a metal surface. This simulation demonstrates why chloride-rich environments can increase corrosion concerns.";

        experimentControls.innerHTML = `
            <div class="experiment-control">
                <label for="saltConcentration">Salt Exposure (%)</label>
                <input type="range" id="saltConcentration" min="0" max="100" value="20">
                <span id="saltConcentrationValue">20%</span>
            </div>

            <div class="experiment-control">
                <label for="saltHumidity">Humidity (%)</label>
                <input type="range" id="saltHumidity" min="0" max="100" value="50">
                <span id="saltHumidityValue">50%</span>
            </div>

            <button type="button" id="runSaltExperiment">
                Run Simulation
            </button>
        `;

        const concentrationInput =
            document.getElementById("saltConcentration");

        const humidityInput =
            document.getElementById("saltHumidity");

        concentrationInput.addEventListener("input", function () {
            document.getElementById("saltConcentrationValue").textContent =
                this.value + "%";
        });

        humidityInput.addEventListener("input", function () {
            document.getElementById("saltHumidityValue").textContent =
                this.value + "%";
        });

        document.getElementById("runSaltExperiment")
            .addEventListener("click", runSaltExperiment);

    }


    else if (type === "galvanic") {

        experimentTitle.textContent = "Virtual Galvanic Corrosion Experiment";

        experimentDescription.textContent =
            "Explore a simplified galvanic corrosion model. Compare two different metals and see how electrical connection and electrolyte presence affect the possibility of galvanic corrosion.";

        experimentControls.innerHTML = `
            <div class="experiment-control">
                <label for="galvanicMetalOne">First Material</label>
                <select id="galvanicMetalOne">
                    <option value="iron">Iron</option>
                    <option value="steel">Carbon Steel</option>
                    <option value="aluminium">Aluminium</option>
                    <option value="copper">Copper</option>
                    <option value="zinc">Zinc</option>
                </select>
            </div>

            <div class="experiment-control">
                <label for="galvanicMetalTwo">Second Material</label>
                <select id="galvanicMetalTwo">
                    <option value="copper">Copper</option>
                    <option value="iron">Iron</option>
                    <option value="steel">Carbon Steel</option>
                    <option value="aluminium">Aluminium</option>
                    <option value="zinc">Zinc</option>
                </select>
            </div>

            <div class="experiment-control">
                <label for="galvanicContact">Electrical Contact</label>
                <select id="galvanicContact">
                    <option value="yes">Connected</option>
                    <option value="no">Not Connected</option>
                </select>
            </div>

            <div class="experiment-control">
                <label for="galvanicElectrolyte">Electrolyte Present</label>
                <select id="galvanicElectrolyte">
                    <option value="yes">Present</option>
                    <option value="no">Absent</option>
                </select>
            </div>

            <button type="button" id="runGalvanicExperiment">
                Run Simulation
            </button>
        `;

        document.getElementById("runGalvanicExperiment")
            .addEventListener("click", runGalvanicExperiment);

    }

    else {

        experimentTitle.textContent = "Experiment Not Found";

        experimentDescription.textContent =
            "The selected experiment is not available.";

    }

}


/* ==========================================
   RUSTING EXPERIMENT
========================================== */

function runRustExperiment() {

    const humidity = Number(
        document.getElementById("rustHumidity").value
    );

    const oxygen = Number(
        document.getElementById("rustOxygen").value
    );

    const salt = Number(
        document.getElementById("rustSalt").value
    );

    const result = document.getElementById("experimentResult");

    const score = Math.round(
        (humidity * 0.35) +
        (oxygen * 0.30) +
        (salt * 0.35)
    );

    let level;
    let explanation;

    if (score < 30) {

        level = "Lower Relative Tendency";

        explanation =
            "The selected conditions produce a lower relative corrosion tendency in this simplified model.";

    } else if (score < 60) {

        level = "Moderate Relative Tendency";

        explanation =
            "The selected conditions produce a moderate relative corrosion tendency. Moisture, oxygen, and salt exposure all influence the result.";

    } else {

        level = "Higher Relative Tendency";

        explanation =
            "The selected conditions produce a higher relative corrosion tendency. Moisture, oxygen, and salt can contribute to iron corrosion.";

    }

    result.innerHTML = `
        <h3>Simulation Results</h3>

        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Oxygen availability:</strong> ${oxygen}%</p>
        <p><strong>Salt exposure:</strong> ${salt}%</p>

        <h3>Relative Corrosion Score: ${score}/100</h3>

        <h4>${level}</h4>

        <p>${explanation}</p>

        <p>
            <strong>Scientific concept:</strong>
            Ordinary iron rusting involves electrochemical reactions
            involving iron, water, and oxygen. Dissolved salts can
            increase the conductivity of the moisture layer.
        </p>

        <p>
            This is an illustrative educational simulation,
            not a measured corrosion rate.
        </p>
    `;

}


/* ==========================================
   SALT EXPOSURE EXPERIMENT
========================================== */

function runSaltExperiment() {

    const salt = Number(
        document.getElementById("saltConcentration").value
    );

    const humidity = Number(
        document.getElementById("saltHumidity").value
    );

    const result = document.getElementById("experimentResult");

    const score = Math.round(
        (salt * 0.60) +
        (humidity * 0.40)
    );

    let level;
    let explanation;

    if (score < 30) {

        level = "Lower Relative Exposure";

        explanation =
            "The selected salt exposure and humidity produce a lower relative corrosion tendency in this model.";

    } else if (score < 60) {

        level = "Moderate Relative Exposure";

        explanation =
            "The selected conditions produce a moderate relative corrosion tendency. Moisture can help dissolved salts form a conductive surface layer.";

    } else {

        level = "Higher Relative Exposure";

        explanation =
            "The selected conditions produce a higher relative corrosion tendency. Salt-rich moisture can increase corrosion concerns for susceptible metals.";

    }

    result.innerHTML = `
        <h3>Simulation Results</h3>

        <p><strong>Salt exposure:</strong> ${salt}%</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>

        <h3>Relative Exposure Score: ${score}/100</h3>

        <h4>${level}</h4>

        <p>${explanation}</p>

        <p>
            <strong>Scientific concept:</strong>
            Dissolved salts, particularly chloride-containing salts,
            can increase the electrical conductivity of moisture
            on metal surfaces and influence corrosion processes.
        </p>

        <p>
            This is an illustrative educational simulation,
            not a measured corrosion rate.
        </p>
    `;

}


/* ==========================================
   GALVANIC CORROSION EXPERIMENT
========================================== */

function runGalvanicExperiment() {

    const firstMetal =
        document.getElementById("galvanicMetalOne").value;

    const secondMetal =
        document.getElementById("galvanicMetalTwo").value;

    const contact =
        document.getElementById("galvanicContact").value;

    const electrolyte =
        document.getElementById("galvanicElectrolyte").value;

    const result =
        document.getElementById("experimentResult");

    const names = {
        iron: "Iron",
        steel: "Carbon Steel",
        aluminium: "Aluminium",
        copper: "Copper",
        zinc: "Zinc"
    };

    if (firstMetal === secondMetal) {

        result.innerHTML = `
            <h3>Simulation Results</h3>

            <p><strong>Materials:</strong> ${names[firstMetal]} + ${names[secondMetal]}</p>

            <h4>No Dissimilar-Metal Pair</h4>

            <p>
                The selected materials are the same. This simplified
                simulation does not identify a galvanic driving
                force between two identical materials.
            </p>

            <p>
                Ordinary corrosion may still occur depending on
                environmental conditions.
            </p>
        `;

        return;

    }

    if (contact === "no") {

        result.innerHTML = `
            <h3>Simulation Results</h3>

            <p><strong>Materials:</strong> ${names[firstMetal]} + ${names[secondMetal]}</p>

            <h4>Electrical Connection Absent</h4>

            <p>
                The selected metals are not electrically connected.
                The conditions for a galvanic corrosion cell are
                therefore incomplete in this simplified model.
            </p>
        `;

        return;

    }

    if (electrolyte === "no") {

        result.innerHTML = `
            <h3>Simulation Results</h3>

            <p><strong>Materials:</strong> ${names[firstMetal]} + ${names[secondMetal]}</p>

            <h4>Electrolyte Absent</h4>

            <p>
                An electrolyte is absent. The conditions for
                galvanic corrosion are therefore incomplete
                in this simplified model.
            </p>
        `;

        return;

    }

    const activityOrder = [
        "zinc",
        "aluminium",
        "iron",
        "steel",
        "copper"
    ];

    const firstPosition = activityOrder.indexOf(firstMetal);
    const secondPosition = activityOrder.indexOf(secondMetal);

    let explanation;

    if (firstPosition < secondPosition) {

        explanation =
            names[firstMetal] +
            " is generally more active than " +
            names[secondMetal] +
            " in this simplified illustrative material ordering.";

    } else {

        explanation =
            names[secondMetal] +
            " is generally more active than " +
            names[firstMetal] +
            " in this simplified illustrative material ordering.";

    }

    result.innerHTML = `
        <h3>Simulation Results</h3>

        <p><strong>First material:</strong> ${names[firstMetal]}</p>
        <p><strong>Second material:</strong> ${names[secondMetal]}</p>

        <h4>Galvanic Corrosion Conditions Present</h4>

        <p>
            The selected materials are different, electrical
            contact is present, and an electrolyte is present.
        </p>

        <p>${explanation}</p>

        <p>
            <strong>Important:</strong>
            The actual anodic and cathodic behaviour depends on
            the exact alloy grades, surface condition, electrolyte,
            temperature, and exposed surface areas.
        </p>

        <p>
            This is a simplified educational model and does not
            replace material-specific galvanic-series data.
        </p>
    `;

}


/* ==========================================
   12. CORROGUARD KNOWLEDGE QUIZ
========================================== */

const quizQuestions = [

    {
        question: "What is corrosion?",
        options: [
            "Melting of metals",
            "Deterioration of materials due to chemical reactions",
            "Cooling of metals",
            "Polishing of metals"
        ],
        answer: 1,
        explanation:
            "Corrosion is the gradual deterioration of a material due to reactions with its environment."
    },

    {
        question: "Which metal is commonly used to protect iron through galvanization?",
        options: ["Copper", "Silver", "Zinc", "Gold"],
        answer: 2,
        explanation:
            "Zinc provides a protective coating and helps protect iron from corrosion."
    },

    {
        question: "What is the common name for iron corrosion?",
        options: ["Rusting", "Scaling", "Cracking", "Melting"],
        answer: 0,
        explanation:
            "Rusting is the corrosion process that affects iron and many iron-based materials."
    },

    {
        question: "Which conditions are generally needed for ordinary iron rusting?",
        options: [
            "Only sunlight",
            "Water and oxygen",
            "Only nitrogen",
            "Only heat"
        ],
        answer: 1,
        explanation:
            "Water and oxygen are both important for ordinary rust formation."
    },

    {
        question: "Which of these is a method of corrosion prevention?",
        options: [
            "Painting",
            "Adding moisture",
            "Removing protective coatings",
            "Increasing exposure to salt"
        ],
        answer: 0,
        explanation:
            "Paint creates a barrier that helps prevent the environment from reaching the metal."
    },

    {
        question: "What does pH measure?",
        options: [
            "Metal thickness",
            "Electrical resistance",
            "Acidity or alkalinity",
            "Temperature"
        ],
        answer: 2,
        explanation:
            "pH indicates how acidic or alkaline a solution is."
    },

    {
        question: "Which type of corrosion occurs when two dissimilar metals are electrically connected in an electrolyte?",
        options: [
            "Galvanic corrosion",
            "Uniform corrosion",
            "Dry corrosion",
            "Erosion"
        ],
        answer: 0,
        explanation:
            "Galvanic corrosion can occur when dissimilar metals are electrically connected in an electrolyte."
    },

    {
        question: "Which material is commonly used for corrosion-resistant applications?",
        options: [
            "Ordinary untreated iron",
            "Stainless steel",
            "Uncoated carbon steel",
            "Pure iron"
        ],
        answer: 1,
        explanation:
            "Stainless steel contains chromium, which helps form a protective passive layer."
    },

    {
        question: "What is a corrosion inhibitor?",
        options: [
            "A substance that increases corrosion",
            "A substance that slows corrosion",
            "A type of metal",
            "A measuring instrument"
        ],
        answer: 1,
        explanation:
            "Corrosion inhibitors are substances that reduce the rate of corrosion."
    },

    {
        question: "What does corrosion rate describe?",
        options: [
            "How quickly a material corrodes",
            "The colour of a metal",
            "The weight of a metal only",
            "The melting point of a metal"
        ],
        answer: 0,
        explanation:
            "Corrosion rate describes how quickly material deterioration occurs."
    }

];


/* ==========================================
   QUIZ VARIABLES
========================================== */

let currentQuizQuestion = 0;
let quizTotalScore = 0;
let quizAnswered = false;


/* ==========================================
   LOAD QUIZ QUESTION
========================================== */

function loadQuizQuestion() {

    const question = quizQuestions[currentQuizQuestion];

    const progress = document.getElementById("quizProgress");
    const score = document.getElementById("quizScore");
    const progressFill = document.getElementById("quizProgressFill");
    const questionElement = document.getElementById("quizQuestion");
    const optionsContainer = document.getElementById("quizOptions");
    const feedback = document.getElementById("quizFeedback");
    const nextButton = document.getElementById("nextQuestion");
    const restartButton = document.getElementById("restartQuiz");
    const finalResult = document.getElementById("quizFinalResult");

    if (
        !progress ||
        !score ||
        !progressFill ||
        !questionElement ||
        !optionsContainer ||
        !feedback ||
        !nextButton ||
        !restartButton ||
        !finalResult
    ) {
        console.warn("One or more quiz elements could not be found.");
        return;
    }

    progress.textContent =
        `Question ${currentQuizQuestion + 1} of ${quizQuestions.length}`;

    score.textContent =
        `Score: ${quizTotalScore}`;

    progressFill.style.width =
        `${(currentQuizQuestion / quizQuestions.length) * 100}%`;

    questionElement.textContent =
        question.question;

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", function () {
            selectQuizAnswer(index);
        });

        optionsContainer.appendChild(button);

    });

    feedback.textContent = "";

    nextButton.disabled = true;
    nextButton.style.display = "inline-block";

    restartButton.style.display = "none";

    finalResult.textContent = "";

    quizAnswered = false;

}


/* ==========================================
   SELECT QUIZ ANSWER
========================================== */

function selectQuizAnswer(selectedIndex) {

    if (quizAnswered) return;

    quizAnswered = true;

    const question = quizQuestions[currentQuizQuestion];

    const options = document.querySelectorAll(".quiz-option");

    const feedback = document.getElementById("quizFeedback");
    const score = document.getElementById("quizScore");
    const nextButton = document.getElementById("nextQuestion");

    options.forEach(button => {
        button.disabled = true;
    });

    if (selectedIndex === question.answer) {

        quizTotalScore++;

        options[selectedIndex].classList.add("correct");

        feedback.textContent =
            "Correct! " + question.explanation;

    } else {

        options[selectedIndex].classList.add("incorrect");

        options[question.answer].classList.add("correct");

        feedback.textContent =
            "Not quite. " + question.explanation;

    }

    score.textContent =
        `Score: ${quizTotalScore}`;

    nextButton.disabled = false;

}


/* ==========================================
   NEXT QUIZ QUESTION
========================================== */

function nextQuizQuestion() {

    if (!quizAnswered) return;

    currentQuizQuestion++;

    if (currentQuizQuestion < quizQuestions.length) {

        loadQuizQuestion();

    } else {

        showQuizResult();

    }

}


/* ==========================================
   SHOW FINAL QUIZ RESULT
========================================== */

function showQuizResult() {

    const progress = document.getElementById("quizProgress");
    const progressFill = document.getElementById("quizProgressFill");
    const questionElement = document.getElementById("quizQuestion");
    const optionsContainer = document.getElementById("quizOptions");
    const feedback = document.getElementById("quizFeedback");
    const nextButton = document.getElementById("nextQuestion");
    const restartButton = document.getElementById("restartQuiz");
    const finalResult = document.getElementById("quizFinalResult");

    if (
        !progress ||
        !progressFill ||
        !questionElement ||
        !optionsContainer ||
        !feedback ||
        !nextButton ||
        !restartButton ||
        !finalResult
    ) return;

    progress.textContent = "Quiz completed!";

    progressFill.style.width = "100%";

    questionElement.textContent = "Your Results";

    optionsContainer.innerHTML = "";

    feedback.textContent = "";

    nextButton.style.display = "none";

    restartButton.style.display = "inline-block";

    const percentage = Math.round(
        (quizTotalScore / quizQuestions.length) * 100
    );

    let message;

    if (percentage >= 80) {

        message =
            "Excellent work! You have a strong understanding of corrosion.";

    } else if (percentage >= 50) {

        message =
            "Good effort! Keep learning and improving.";

    } else {

        message =
            "Keep practising! Review the CorroGuard learning sections and try again.";

    }

    finalResult.innerHTML = `
        <h3>${quizTotalScore} / ${quizQuestions.length}</h3>
        <h4>${percentage}%</h4>
        <p>${message}</p>
    `;

}


/* ==========================================
   RESTART QUIZ
========================================== */

function restartQuiz() {

    currentQuizQuestion = 0;
    quizTotalScore = 0;
    quizAnswered = false;

    loadQuizQuestion();

}


/* ==========================================
   START QUIZ AFTER PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const quizSection = document.getElementById("quiz");

    if (quizSection) {
        loadQuizQuestion();
    }

});
/* ==========================================
   13. CORROGUARD PDF REPORT GENERATOR
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const downloadButton = document.getElementById("downloadReport");

    if (!downloadButton) return;

    downloadButton.addEventListener("click", function () {

        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("PDF library not found. Please check the jsPDF script in your HTML file.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const metalElement = document.getElementById("metal");
        const temperatureElement = document.getElementById("temperature");
        const humidityElement = document.getElementById("humidity");
        const phElement = document.getElementById("ph");
        const salinityElement = document.getElementById("salinity");

        const riskScoreElement = document.getElementById("riskScore");
        const riskLevelElement = document.getElementById("riskLevel");
        const riskDescriptionElement = document.getElementById("riskDescription");

        const selectedMetal = metalElement
            ? metalElement.options[metalElement.selectedIndex].text
            : "Not selected";

        const temperature = temperatureElement
            ? temperatureElement.value
            : "N/A";

        const humidity = humidityElement
            ? humidityElement.value
            : "N/A";

        const ph = phElement
            ? phElement.value
            : "N/A";

        const salinity = salinityElement
            ? salinityElement.value
            : "N/A";

        const riskScore = riskScoreElement
            ? riskScoreElement.textContent.trim()
            : "Not calculated";

        const riskLevel = riskLevelElement
            ? riskLevelElement.textContent.trim()
            : "Not calculated";

        const riskDescription = riskDescriptionElement
            ? riskDescriptionElement.textContent.trim()
            : "Run the risk calculator to generate an assessment.";

        const date = new Date().toLocaleDateString();

        /* PDF HEADER */

        doc.setFillColor(16, 36, 62);
        doc.rect(0, 0, 210, 38, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(23);
        doc.text("CORROGUARD", 15, 19);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("CORROSION ANALYSIS REPORT", 15, 28);

        doc.setFontSize(9);
        doc.text("Generated: " + date, 195, 28, {
            align: "right"
        });

        /* REPORT INTRODUCTION */

        let y = 51;

        doc.setTextColor(16, 36, 62);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("1. Material Information", 15, y);

        y += 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81);

        doc.text("Selected Material: " + selectedMetal, 15, y);

        y += 8;

        doc.text("Analysis Date: " + date, 15, y);

        /* ENVIRONMENTAL CONDITIONS */

        y += 17;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(16, 36, 62);

        doc.text("2. Environmental Conditions", 15, y);

        y += 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81);

        const environmentalData = [
            ["Temperature", temperature + " °C"],
            ["Relative Humidity", humidity + " %"],
            ["pH Value", ph],
            ["Salt Exposure", salinity + " %"]
        ];

        environmentalData.forEach(function (item) {

            doc.text(item[0] + ": " + item[1], 18, y);

            y += 8;

        });

        /* RISK ASSESSMENT */

        y += 9;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(16, 36, 62);

        doc.text("3. Corrosion Risk Assessment", 15, y);

        y += 11;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81);

        doc.text("Risk Score: " + riskScore, 18, y);

        y += 8;

        doc.text("Risk Classification: " + riskLevel, 18, y);

        y += 12;

        doc.setFont("helvetica", "bold");
        doc.text("Assessment:", 18, y);

        y += 7;

        doc.setFont("helvetica", "normal");

        const descriptionLines = doc.splitTextToSize(
            riskDescription,
            174
        );

        doc.text(descriptionLines, 18, y);

        y += descriptionLines.length * 6 + 12;

        /* DISCLAIMER */

        if (y > 240) {
            doc.addPage();
            y = 25;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(16, 36, 62);

        doc.text("4. Important Disclaimer", 15, y);

        y += 9;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);

        const disclaimer =
            "This report is generated using an illustrative educational corrosion risk model. " +
            "The calculated score is not a validated engineering prediction, laboratory measurement, " +
            "or substitute for professional corrosion assessment. Actual corrosion behaviour depends " +
            "on material grade, surface condition, environmental chemistry, exposure duration, " +
            "and operating conditions.";

        const disclaimerLines = doc.splitTextToSize(
            disclaimer,
            178
        );

        doc.text(disclaimerLines, 15, y);

        /* FOOTER */

        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {

            doc.setPage(i);

            doc.setDrawColor(210, 220, 230);
            doc.line(15, 282, 195, 282);

            doc.setFontSize(8);
            doc.setTextColor(120, 130, 140);

            doc.text(
                "CorroGuard | Engineering Chemistry Project",
                15,
                289
            );

            doc.text(
                "Page " + i + " of " + pageCount,
                195,
                289,
                { align: "right" }
            );

        }

        doc.save("CorroGuard_Corrosion_Report.pdf");

    });

});


/* ==========================================
   14. PROTECTIVE COATING SELECTOR
========================================== */


/*
   Each recommendation contains:
   - name
   - mechanism
   - advantages
   - limitations
   - applications
*/

function makeCoating(name, mechanism, advantages, limitations, applications) {

    return {
        name: name,
        mechanism: mechanism,
        advantages: advantages,
        limitations: limitations,
        applications: applications
    };

}


/* ==========================================
   COATING RECOMMENDATION DATABASE
========================================== */

const coatingRecommendations = {

    /* IRON */

    iron: {

        indoor: makeCoating(
            "Epoxy Primer with Protective Paint",
            "Creates a barrier between iron and moisture or oxygen.",
            "Good indoor protection, strong adhesion, and a smooth finish.",
            "Surface preparation is important. Damaged paint can expose the iron.",
            "Indoor equipment, structural components, and metal furniture."
        ),

        outdoor: makeCoating(
            "Zinc-Rich Primer with Polyurethane Topcoat",
            "Zinc provides sacrificial protection while the topcoat acts as a barrier.",
            "Good atmospheric protection and resistance to weathering.",
            "Requires suitable surface preparation and periodic inspection.",
            "Outdoor iron structures, railings, and support frames."
        ),

        coastal: makeCoating(
            "Multi-Layer Epoxy and Polyurethane Marine Coating",
            "Combines barrier protection with a weather-resistant outer layer.",
            "Designed for demanding marine and salt-exposure environments.",
            "Coating damage and poor application can reduce protection.",
            "Coastal structures, marine equipment, and exposed iron components."
        ),

        industrial: makeCoating(
            "High-Build Epoxy Coating",
            "Forms a thick protective barrier against moisture and selected chemicals.",
            "Good adhesion and chemical resistance when correctly specified.",
            "Chemical compatibility must be checked for the actual process.",
            "Industrial frames, machinery housings, and plant structures."
        )

    },


    /* CARBON STEEL */

    steel: {

        indoor: makeCoating(
            "Epoxy Primer and Enamel Finish",
            "Separates the steel surface from indoor moisture and contaminants.",
            "Good adhesion, appearance, and general indoor protection.",
            "Scratches and exposed edges may become corrosion entry points.",
            "Indoor machinery, equipment frames, and steel furniture."
        ),

        outdoor: makeCoating(
            "Zinc-Rich Primer and Polyurethane Finish",
            "Provides sacrificial zinc protection and a weather-resistant barrier.",
            "Good protection against atmospheric corrosion.",
            "Requires proper application, inspection, and maintenance.",
            "Bridges, outdoor frames, railings, and structural steel."
        ),

        coastal: makeCoating(
            "Marine-Grade Multi-Coat Epoxy System",
            "Uses multiple barrier layers to reduce contact with chloride-rich moisture.",
            "Suitable for severe marine exposure when correctly specified.",
            "Application quality and coating maintenance are critical.",
            "Coastal steel structures, marine supports, and exposed installations."
        ),

        industrial: makeCoating(
            "Chemical-Resistant Epoxy System",
            "Provides a barrier against moisture and selected industrial chemicals.",
            "Good chemical resistance and strong adhesion for suitable environments.",
            "Not every epoxy is compatible with every chemical or temperature.",
            "Industrial platforms, tanks, steel equipment, and plant structures."
        )

    },


    /* ALUMINIUM */

    aluminium: {

        indoor: makeCoating(
            "Clear Protective Conversion Coating",
            "Supports surface protection while maintaining the aluminium appearance.",
            "Preserves the metallic appearance and provides additional surface protection.",
            "Performance depends on the conversion process and service environment.",
            "Indoor aluminium panels, housings, and decorative components."
        ),

        outdoor: makeCoating(
            "Anodizing",
            "Electrochemically forms a thicker aluminium oxide layer.",
            "Good atmospheric corrosion resistance and durable surface finish.",
            "Some highly aggressive environments may require additional protection.",
            "Outdoor aluminium frames, architectural panels, and components."
        ),

        coastal: makeCoating(
            "Marine-Grade Anodizing with Suitable Sealing",
            "Creates a protective oxide layer and seals its porous structure.",
            "Improves resistance to atmospheric exposure and salt contamination.",
            "Correct alloy selection and sealing quality are important.",
            "Coastal aluminium structures, panels, and marine components."
        ),

        industrial: makeCoating(
            "Chemical Conversion Coating with Compatible Topcoat",
            "Creates a conversion layer that improves surface protection and coating adhesion.",
            "Can improve corrosion resistance and provide a base for further coating.",
            "Chemical compatibility and process control are required.",
            "Industrial aluminium housings, equipment, and fabricated components."
        )

    },


    /* COPPER */

    copper: {

        indoor: makeCoating(
            "Clear Lacquer Coating",
            "Forms a transparent barrier that reduces contact with air and contaminants.",
            "Maintains the copper appearance and slows surface tarnishing.",
            "Scratches or damaged areas may allow local surface changes.",
            "Indoor copper fittings, decorative objects, and architectural details."
        ),

        outdoor: makeCoating(
            "UV-Resistant Clear Protective Coating",
            "Creates a barrier against moisture and atmospheric contaminants.",
            "Can preserve the intended copper surface appearance.",
            "Requires compatible application and periodic condition checks.",
            "Outdoor copper details and architectural components."
        ),

        coastal: makeCoating(
            "Marine-Compatible Protective Barrier Coating",
            "Reduces direct contact between copper and chloride-containing moisture.",
            "Provides additional protection in exposed environments.",
            "The coating must be compatible with copper and the service conditions.",
            "Coastal copper fittings and exposed copper components."
        ),

        industrial: makeCoating(
            "Chemical-Compatible Epoxy or Polymer Coating",
            "Separates copper from selected industrial chemicals and moisture.",
            "Can provide a protective barrier in suitable chemical environments.",
            "The exact chemical and operating temperature must be evaluated.",
            "Industrial copper piping exteriors, fittings, and equipment."
        )

    },


    /* STAINLESS STEEL 304 */

    stainless304: {

        indoor: makeCoating(
            "Passivation Treatment",
            "Supports the formation of a clean, chromium-rich passive surface.",
            "Maintains the natural metallic finish and improves surface cleanliness.",
            "Does not make the alloy immune to every corrosive environment.",
            "Indoor stainless equipment, fittings, and fabricated components."
        ),

        outdoor: makeCoating(
            "Passivation with Optional Protective Clear Finish",
            "Maintains the passive surface and can add a barrier where required.",
            "Useful for suitable atmospheric exposure and appearance retention.",
            "Exposure conditions should be evaluated, especially where chlorides are present.",
            "Outdoor architectural fittings and stainless components."
        ),

        coastal: makeCoating(
            "Specialist Protective Coating System",
            "Adds a barrier to reduce chloride contact with the stainless surface.",
            "Can reduce exposure-related surface corrosion concerns.",
            "Type 304 may be unsuitable for some severe chloride environments; material selection is important.",
            "Selected coastal components where the alloy and coating system are suitable."
        ),

        industrial: makeCoating(
            "Chemical-Compatible Protective Coating",
            "Adds a barrier against selected industrial chemicals.",
            "Can provide additional protection for compatible process conditions.",
            "The chemical, temperature, and cleaning regime must be checked.",
            "Industrial stainless housings and equipment exteriors."
        )

    },


    /* STAINLESS STEEL 316 */

    stainless316: {

        indoor: makeCoating(
            "Passivation Treatment",
            "Maintains a clean passive surface and supports corrosion resistance.",
            "Preserves the natural finish and supports surface cleanliness.",
            "Correct cleaning and passivation procedures are still necessary.",
            "Indoor process equipment, fittings, and stainless components."
        ),

        outdoor: makeCoating(
            "Passivation and Optional Protective Finish",
            "Maintains the passive surface with additional protection where needed.",
            "Good general surface protection for suitable atmospheric conditions.",
            "Coating selection depends on exposure and appearance requirements.",
            "Outdoor architectural and industrial stainless components."
        ),

        coastal: makeCoating(
            "Passivation with Marine-Compatible Protective Finish",
            "Combines the passive stainless surface with an additional barrier where appropriate.",
            "Grade 316 has improved chloride resistance compared with grade 304 in many environments.",
            "Severe marine exposure can still cause corrosion; inspection and material assessment remain necessary.",
            "Marine fittings, coastal structures, and exposed stainless equipment."
        ),

        industrial: makeCoating(
            "Chemical-Compatible Protective System",
            "Provides an additional barrier against selected process chemicals.",
            "Can extend protection in suitable industrial environments.",
            "Grade 316 and any added coating must be checked against the actual chemical conditions.",
            "Chemical plant equipment, process housings, and industrial fittings."
        )

    },


    /* GALVANIZED IRON */

    galvanized: {

        indoor: makeCoating(
            "Compatible Clear Sealer",
            "Adds a barrier over the existing zinc coating.",
            "Can reduce surface contamination and help maintain appearance.",
            "The sealer must be compatible with the galvanized surface.",
            "Indoor galvanized panels, supports, and fittings."
        ),

        outdoor: makeCoating(
            "Duplex System: Compatible Primer and Topcoat",
            "Combines the zinc coating with an additional paint barrier.",
            "Provides complementary protection when correctly applied.",
            "Surface preparation and coating compatibility are important.",
            "Outdoor galvanized steel structures and supports."
        ),

        coastal: makeCoating(
            "Marine-Compatible Duplex Coating",
            "Adds a protective paint system over the zinc layer.",
            "Provides additional protection in salt-exposed environments.",
            "Damaged areas and edges require suitable maintenance.",
            "Coastal galvanized structures and outdoor supports."
        ),

        industrial: makeCoating(
            "Chemical-Compatible Protective Topcoat",
            "Provides an additional barrier against selected industrial contaminants.",
            "Can improve service performance in compatible environments.",
            "Strong acids and alkalis may attack zinc; chemical suitability must be assessed.",
            "Industrial galvanized supports and equipment exteriors."
        )

    },


    /* BRASS */

    brass: {

        indoor: makeCoating(
            "Clear Anti-Tarnish Lacquer",
            "Forms a transparent barrier against air and moisture.",
            "Helps maintain the brass finish and reduce tarnishing.",
            "Damaged coating areas may require repair.",
            "Indoor brass fittings, decorative parts, and hardware."
        ),

        outdoor: makeCoating(
            "Weather-Resistant Clear Protective Coating",
            "Reduces direct exposure to moisture and atmospheric contaminants.",
            "Can help preserve the intended surface appearance.",
            "Outdoor exposure may require periodic recoating.",
            "Outdoor brass fixtures and architectural details."
        ),

        coastal: makeCoating(
            "Marine-Compatible Clear Barrier Coating",
            "Reduces contact with salt-containing moisture.",
            "Adds a protective barrier for suitable brass components.",
            "The alloy and coating must be evaluated for marine service.",
            "Selected coastal brass fittings and decorative components."
        ),

        industrial: makeCoating(
            "Chemical-Compatible Polymer Coating",
            "Creates a barrier against selected industrial contaminants.",
            "Can protect brass surfaces in compatible environments.",
            "Ammonia-containing and other aggressive environments require special attention.",
            "Industrial brass fittings and equipment components."
        )

    },


    /* BRONZE */

    bronze: {

        indoor: makeCoating(
            "Clear Protective Wax or Lacquer",
            "Reduces contact with moisture and contaminants.",
            "Can preserve the bronze appearance and slow surface changes.",
            "Protection depends on coating condition and maintenance.",
            "Indoor bronze fittings, sculptures, and decorative objects."
        ),

        outdoor: makeCoating(
            "Weather-Resistant Clear Coating",
            "Forms a barrier against atmospheric moisture and contaminants.",
            "Helps control surface appearance and environmental exposure.",
            "The coating may need periodic inspection and renewal.",
            "Outdoor bronze architectural features and fittings."
        ),

        coastal: makeCoating(
            "Marine-Compatible Protective Coating",
            "Reduces direct exposure to salt-rich moisture.",
            "Adds a barrier for suitable bronze applications.",
            "The bronze alloy and service conditions must be evaluated.",
            "Selected coastal bronze components and fittings."
        ),

        industrial: makeCoating(
            "Chemical-Compatible Protective Polymer",
            "Separates bronze from selected industrial chemicals and moisture.",
            "Can provide additional surface protection.",
            "Chemical compatibility and temperature limits must be checked.",
            "Industrial bronze fittings and equipment components."
        )

    },


    /* ZINC */

    zinc: {

        indoor: makeCoating(
            "Compatible Clear Sealer",
            "Provides an additional barrier over the zinc surface.",
            "Can reduce surface contamination and improve appearance retention.",
            "The coating must be compatible with zinc.",
            "Indoor zinc-coated parts and components."
        ),

        outdoor: makeCoating(
            "Compatible Paint System",
            "Adds a barrier that reduces direct atmospheric exposure.",
            "Can extend the protection of zinc-coated components.",
            "Surface preparation and primer compatibility are important.",
            "Outdoor zinc-coated panels and structures."
        ),

        coastal: makeCoating(
            "Marine-Compatible Protective Paint System",
            "Reduces contact between zinc and chloride-rich moisture.",
            "Adds a barrier in demanding atmospheric environments.",
            "Zinc can be consumed over time; damaged coatings need inspection.",
            "Coastal zinc-coated structures and components."
        ),

        industrial: makeCoating(
            "Chemical-Compatible Barrier Coating",
            "Protects zinc from selected industrial contaminants.",
            "Can reduce exposure to compatible process environments.",
            "Zinc is vulnerable to some acidic and alkaline conditions; verify compatibility.",
            "Industrial zinc-coated equipment and components."
        )

    },


    /* TITANIUM */

    titanium: {

        indoor: makeCoating(
            "Natural Passive Oxide Film",
            "Titanium naturally forms a stable, protective oxide film.",
            "Excellent general corrosion resistance in many indoor environments.",
            "Specific chemical environments may still require evaluation.",
            "Indoor titanium equipment and precision components."
        ),

        outdoor: makeCoating(
            "Natural Passive Oxide Film",
            "The naturally formed oxide layer protects the titanium surface.",
            "Good atmospheric corrosion resistance without a conventional paint coating.",
            "Surface contamination and application-specific conditions should be considered.",
            "Outdoor titanium components and architectural applications."
        ),

        coastal: makeCoating(
            "Natural Passive Oxide Film",
            "The stable oxide layer provides strong resistance in many seawater environments.",
            "Titanium is widely valued for corrosion resistance in marine applications.",
            "Grade, temperature, crevice conditions, and service chemistry still matter.",
            "Marine equipment, seawater systems, and coastal components."
        ),

        industrial: makeCoating(
            "Application-Specific Protective Treatment",
            "Titanium often relies on its naturally stable passive oxide layer.",
            "Strong corrosion resistance in many industrial environments.",
            "Highly specific chemicals and operating conditions require material compatibility checks.",
            "Chemical processing equipment and industrial titanium components."
        )

    }

};


/* ==========================================
   15. COATING SELECTOR INTERACTION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const findCoatingButton = document.getElementById("findCoating");

    if (!findCoatingButton) return;

    findCoatingButton.addEventListener("click", function () {

        const metalElement = document.getElementById("coatingMetal");
        const environmentElement = document.getElementById("coatingEnvironment");
        const concernElement = document.getElementById("coatingConcern");
        const resultBox = document.getElementById("coatingResult");

        if (!metalElement || !environmentElement || !concernElement || !resultBox) {
            console.warn("Coating selector elements could not be found.");
            return;
        }

        const metal = metalElement.value;
        const environment = environmentElement.value;
        const concern = concernElement.value;

        if (!metal || !environment || !concern) {

            resultBox.textContent =
                "Please select a material, environment, and corrosion concern.";

            return;

        }

        const recommendation =
            coatingRecommendations[metal]?.[environment];

        if (!recommendation) {

            resultBox.textContent =
                "No coating recommendation is available for this selection.";

            return;

        }

        const concernNames = {
            moisture: "Moisture exposure",
            salt: "Salt exposure",
            chemical: "Chemical exposure",
            general: "General corrosion protection"
        };

        const concernName =
            concernNames[concern] || "General corrosion protection";

        resultBox.innerHTML = `
            <h3>Recommended Protective Coating</h3>

            <h4>${recommendation.name}</h4>

            <p>
                <strong>Selected Material:</strong>
                ${metalNames[metal] || metal}
            </p>

            <p>
                <strong>Environment:</strong>
                ${environment.charAt(0).toUpperCase() + environment.slice(1)}
            </p>

            <p>
                <strong>Main Concern:</strong>
                ${concernName}
            </p>

            <div class="coating-detail">
                <h4>Protection Mechanism</h4>
                <p>${recommendation.mechanism}</p>
            </div>

            <div class="coating-detail">
                <h4>Advantages</h4>
                <p>${recommendation.advantages}</p>
            </div>

            <div class="coating-detail">
                <h4>Limitations</h4>
                <p>${recommendation.limitations}</p>
            </div>

            <div class="coating-detail">
                <h4>Typical Applications</h4>
                <p>${recommendation.applications}</p>
            </div>

            <p class="coating-disclaimer">
                <strong>Engineering note:</strong>
                This is an educational recommendation. Final coating
                selection should consider the exact alloy, surface
                preparation, exposure conditions, operating temperature,
                and coating manufacturer's technical specifications.
            </p>
        `;

    });

});


/* ==========================================
   END OF CORROGUARD JAVASCRIPT
========================================== */
