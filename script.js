
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


    /* =====================================
       3. CORROSION RISK MODEL
    ===================================== */

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

        const score = calculateCorrosionRisk();

        const selectedMetal = metalNames[metal.value] || metal.value;

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

    analyzeButton.addEventListener("click", analyzeCorrosion);

    metal.addEventListener("change", analyzeCorrosion);

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


if (metalOne && metalTwo && checkCompatibility && compatibilityResult) {

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


    /* NORMALIZE MATERIAL VALUES */

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


    /* GET MATERIAL DISPLAY NAME */

    function getMaterialName(value, key) {

        return materialNames[key] ||
               materialNames[value] ||
               String(value).trim();

    }


    /* UPDATE COMPATIBILITY RESULT */

    function updateCompatibilityResult() {

        const firstValue = metalOne.value;
        const secondValue = metalTwo.value;

        const first = normalizeMaterial(firstValue);
        const second = normalizeMaterial(secondValue);

        const firstName = getMaterialName(firstValue, first);
        const secondName = getMaterialName(secondValue, second);

        compatibilityResult.replaceChildren();


        /* CHECK EMPTY SELECTION */

        if (!firstValue || !secondValue) {

            compatibilityResult.textContent =
                "Please select both materials.";

            return;

        }


        /* CHECK SAME MATERIAL */

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


        /* SORT PAIR FOR LOOKUP */

        const pairKey = [first, second].sort().join("-");

        const pair = galvanicPairs[pairKey];


        /* KNOWN COMBINATIONS */

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

            /* OTHER COMBINATIONS */

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


        /* SCIENTIFIC DISCLAIMER */

        const note = document.createElement("p");

        note.textContent =
            "Educational estimate only. Galvanic corrosion requires electrical contact and an electrolyte. Actual behaviour also depends on alloy grade, surface condition, electrolyte chemistry, and the relative exposed areas.";

        compatibilityResult.appendChild(note);

    }


    /* UPDATE WHEN DROPDOWNS CHANGE */

    metalOne.addEventListener(
        "change",
        updateCompatibilityResult
    );

    metalTwo.addEventListener(
        "change",
        updateCompatibilityResult
    );


    /* UPDATE WHEN BUTTON IS CLICKED */

    checkCompatibility.addEventListener(
        "click",
        updateCompatibilityResult
    );


    /* INITIAL RESULT */

    updateCompatibilityResult();


        /* =====================================
           REFRESH COMPATIBILITY RESULT
        ===================================== */

        function updateCompatibilityResult() {

            const first = metalOne.value;
            const second = metalTwo.value;

            const firstName = materialNames[first] || first;
            const secondName = materialNames[second] || second;

            /* Always clear the previous result first */
            compatibilityResult.replaceChildren();

            if (!first || !second) {

                compatibilityResult.textContent =
                    "Please select both materials.";

                return;

            }


            /* SAME MATERIAL */

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


            /* SORT THE PAIR */

            const pairKey = [first, second].sort().join("-");

            const pair = galvanicPairs[pairKey];


            /* KNOWN COMBINATIONS */

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

                /* GENERAL RESULT FOR OTHER COMBINATIONS */

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


            /* SCIENTIFIC DISCLAIMER */

            const note = document.createElement("p");

            note.textContent =
                "Educational estimate only. Galvanic corrosion requires electrical contact and an electrolyte. Actual behaviour also depends on alloy grade, surface condition, electrolyte chemistry, and the relative exposed areas.";

            compatibilityResult.appendChild(note);

        }


        /* UPDATE WHEN EITHER DROPDOWN CHANGES */

        metalOne.addEventListener(
            "change",
            updateCompatibilityResult
        );

        metalTwo.addEventListener(
            "change",
            updateCompatibilityResult
        );


        /* UPDATE WHEN BUTTON IS CLICKED */

        checkCompatibility.addEventListener(
            "click",
            updateCompatibilityResult
        );


        /* SHOW INITIAL RESULT */

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

            const selectedMetal = metal.value;

            const humid = Number(humidity.value);
            const temp = Number(temperature.value);
            const acidity = Number(ph.value);
            const salt = Number(salinity.value);

            const selectedMetalName = materialNames[selectedMetal];

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

            const weightLoss = initialWeight - finalWeight;

            const corrosionRate =
                weightLoss / (surfaceArea * exposureTime);

            rateResult.innerHTML = `
                <h3>✅ Corrosion Rate Result</h3>

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


    console.log("CorroGuard initialized successfully!");

});


/* ==========================================
   CORROGUARD - VIRTUAL EXPERIMENTAL LAB
========================================== */

function openExperiment(type) {

    const title = document.getElementById("experimentTitle");
    const description = document.getElementById("experimentDescription");
    const controls = document.getElementById("experimentControls");
    const result = document.getElementById("experimentResult");

    result.innerHTML =
        "Adjust the experiment settings and click Run Experiment.";


    if (type === "rust") {

        title.textContent = "Experiment 01: Rusting of Iron";

        description.textContent =
            "Explore how the presence of water and oxygen affects iron corrosion.";

        controls.innerHTML = `
            <label for="rustWater">Water availability</label>

            <select id="rustWater">
                <option value="1">Present</option>
                <option value="0">Absent</option>
            </select>

            <label for="rustOxygen">Oxygen availability</label>

            <select id="rustOxygen">
                <option value="1">Present</option>
                <option value="0">Absent</option>
            </select>

            <button onclick="runRustExperiment()">Run Experiment</button>
        `;

    } else if (type === "salt") {

        title.textContent = "Experiment 02: Effect of Salt";

        description.textContent =
            "Compare the simulated corrosion tendency of iron in different water conditions.";

        controls.innerHTML = `
            <label for="saltLevel">Environment</label>

            <select id="saltLevel">
                <option value="0">Fresh Water</option>
                <option value="1">Salt Water</option>
            </select>

            <button onclick="runSaltExperiment()">Run Experiment</button>
        `;

    } else if (type === "galvanic") {

        title.textContent = "Experiment 03: Galvanic Corrosion";

        description.textContent =
            "Explore the effect of connecting two different metals in an electrolyte.";

        controls.innerHTML = `
            <label for="metalPair">Metal combination</label>

            <select id="metalPair">
                <option value="iron-copper">Iron + Copper</option>
                <option value="zinc-copper">Zinc + Copper</option>
                <option value="iron-zinc">Iron + Zinc</option>
                <option value="aluminium-copper">Aluminium + Copper</option>
                <option value="steel-copper">Carbon Steel + Copper</option>
                <option value="stainless316-copper">Stainless Steel 316 + Copper</option>
                <option value="brass-steel">Brass + Carbon Steel</option>
                <option value="bronze-zinc">Bronze + Zinc</option>
                <option value="titanium-aluminium">Titanium + Aluminium</option>
            </select>

            <button onclick="runGalvanicExperiment()">Run Experiment</button>
        `;

    }

    document.getElementById("experimentDisplay").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ==========================================
   EXPERIMENT 01: RUSTING OF IRON
========================================== */

function runRustExperiment() {

    const water = Number(document.getElementById("rustWater").value);
    const oxygen = Number(document.getElementById("rustOxygen").value);

    const result = document.getElementById("experimentResult");

    if (water && oxygen) {

        result.innerHTML = `
            <h4>Result: Rusting Conditions Present</h4>

            <p>
                Both water and oxygen are available. Iron can undergo
                electrochemical corrosion and form rust over time.
            </p>

            <strong>Observation:</strong>
            Rust formation is possible.
        `;

    } else {

        result.innerHTML = `
            <h4>Result: Rusting Conditions Limited</h4>

            <p>
                One of the essential conditions is absent in this simplified
                model, so ordinary rust formation is greatly restricted.
            </p>

            <strong>Observation:</strong>
            Water and oxygen are important for ordinary iron rusting.
        `;

    }

}


/* ==========================================
   EXPERIMENT 02: EFFECT OF SALT
========================================== */

function runSaltExperiment() {

    const salt = Number(document.getElementById("saltLevel").value);

    const result = document.getElementById("experimentResult");

    if (salt === 1) {

        result.innerHTML = `
            <h4>Result: Higher Corrosion Tendency</h4>

            <p>
                Salt water generally increases the electrical conductivity
                of the electrolyte, which can accelerate electrochemical
                corrosion of iron.
            </p>

            <strong>Observation:</strong>
            Salt water generally promotes faster corrosion than fresh water
            under comparable conditions.
        `;

    } else {

        result.innerHTML = `
            <h4>Result: Fresh Water Environment</h4>

            <p>
                Fresh water can still support corrosion when oxygen and
                other conditions are present. Its corrosion behaviour depends
                on water chemistry and environmental conditions.
            </p>

            <strong>Observation:</strong>
            Fresh water does not mean corrosion-free.
        `;

    }

}


/* ==========================================
   EXPERIMENT 03: GALVANIC CORROSION
========================================== */

function runGalvanicExperiment() {

    const pair = document.getElementById("metalPair").value;

    const result = document.getElementById("experimentResult");

    const explanations = {

        "iron-copper": `
            <h4>Result: Iron may act as the anode</h4>
            <p>
                Iron is generally less noble than copper in many aqueous
                environments and may corrode preferentially when electrically
                connected to copper.
            </p>
        `,

        "zinc-copper": `
            <h4>Result: Zinc may act as the anode</h4>
            <p>
                Zinc is generally less noble than copper and may corrode
                preferentially in this galvanic couple.
            </p>
        `,

        "iron-zinc": `
            <h4>Result: Zinc may act as the anode</h4>
            <p>
                Zinc is generally less noble than iron and can provide
                sacrificial protection to iron when properly connected.
            </p>
        `,

        "aluminium-copper": `
            <h4>Result: Environment-dependent galvanic behaviour</h4>
            <p>
                Aluminium is generally more active than copper, but its oxide
                film and the environment influence the actual behaviour.
            </p>
        `,

        "steel-copper": `
            <h4>Result: Carbon steel may corrode preferentially</h4>
            <p>
                Carbon steel is generally more active than copper in many
                aqueous environments. Actual behaviour depends on the
                electrolyte and surface conditions.
            </p>
        `,

        "stainless316-copper": `
            <h4>Result: Grade and environment matter</h4>
            <p>
                Passive Stainless Steel 316 and copper may form a galvanic
                couple. The actual corrosion behaviour depends on the
                electrolyte, surface condition, and exposed areas.
            </p>
        `,

        "brass-steel": `
            <h4>Result: Material details are important</h4>
            <p>
                Brass and carbon steel can have different electrochemical
                behaviour. The exact brass composition and environment
                influence which material corrodes preferentially.
            </p>
        `,

        "bronze-zinc": `
            <h4>Result: Zinc may corrode preferentially</h4>
            <p>
                Zinc is generally more active than many copper-based alloys.
                However, the exact bronze composition and electrolyte
                influence galvanic behaviour.
            </p>
        `,

        "titanium-aluminium": `
            <h4>Result: Environment-dependent galvanic behaviour</h4>
            <p>
                Titanium and aluminium have different passive-film
                characteristics. Their galvanic behaviour depends on the
                alloy grades, electrolyte, and surface conditions.
            </p>
        `

    };

    result.innerHTML = (explanations[pair] || `
        <h4>Result: Condition-Dependent Behaviour</h4>
        <p>
            The galvanic behaviour of this combination depends on the
            exact material grades, electrolyte, surface conditions,
            and relative exposed areas.
        </p>
    `) + `
        <p>
            <strong>Observation:</strong>
            Galvanic corrosion requires electrical contact between
            dissimilar metals and an electrolyte. Actual behaviour
            depends on the environment and material conditions.
        </p>
    `;

}


/* ==========================================
   CORROGUARD KNOWLEDGE QUIZ
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
        explanation: "Corrosion is the gradual deterioration of a material due to reactions with its environment."
    },

    {
        question: "Which metal is commonly used to protect iron through galvanization?",
        options: ["Copper", "Silver", "Zinc", "Gold"],
        answer: 2,
        explanation: "Zinc provides a protective coating and helps protect iron from corrosion."
    },

    {
        question: "What is the common name for iron corrosion?",
        options: ["Rusting", "Scaling", "Cracking", "Melting"],
        answer: 0,
        explanation: "Rusting is the corrosion process that affects iron and many iron-based materials."
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
        explanation: "Water and oxygen are both important for ordinary rust formation."
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
        explanation: "Paint creates a barrier that helps prevent the environment from reaching the metal."
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
        explanation: "pH indicates how acidic or alkaline a solution is."
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
        explanation: "Galvanic corrosion can occur when dissimilar metals are electrically connected in an electrolyte."
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
        explanation: "Stainless steel contains chromium, which helps form a protective passive layer."
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
        explanation: "Corrosion inhibitors are substances that reduce the rate of corrosion."
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
        explanation: "Corrosion rate describes how quickly material deterioration occurs."
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

    document.getElementById("quizProgress").textContent =
        `Question ${currentQuizQuestion + 1} of ${quizQuestions.length}`;

    document.getElementById("quizScore").textContent =
        `Score: ${quizTotalScore}`;

    document.getElementById("quizProgressFill").style.width =
        `${(currentQuizQuestion / quizQuestions.length) * 100}%`;

    document.getElementById("quizQuestion").textContent =
        question.question;

    const optionsContainer = document.getElementById("quizOptions");

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "quiz-option";
        button.textContent = option;

        button.onclick = () => selectQuizAnswer(index);

        optionsContainer.appendChild(button);

    });

    document.getElementById("quizFeedback").textContent = "";

    document.getElementById("nextQuestion").disabled = true;
    document.getElementById("nextQuestion").style.display = "inline-block";

    document.getElementById("restartQuiz").style.display = "none";

    document.getElementById("quizFinalResult").textContent = "";

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

    document.getElementById("quizScore").textContent =
        `Score: ${quizTotalScore}`;

    document.getElementById("nextQuestion").disabled = false;

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

    document.getElementById("quizProgress").textContent =
        "Quiz completed!";

    document.getElementById("quizProgressFill").style.width =
        "100%";

    document.getElementById("quizQuestion").textContent =
        "Your Results";

    document.getElementById("quizOptions").innerHTML = "";

    document.getElementById("quizFeedback").textContent = "";

    document.getElementById("nextQuestion").style.display = "none";

    document.getElementById("restartQuiz").style.display = "inline-block";

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

    document.getElementById("quizFinalResult").innerHTML = `
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
   CORROGUARD - PDF REPORT GENERATOR
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const downloadButton = document.getElementById("downloadReport");

    if (!downloadButton) return;

    downloadButton.addEventListener("click", function () {

        if (!window.jspdf || !window.jspdf.jsPDF) {

            alert("PDF library is not available. Please refresh the page and try again.");

            return;

        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();

        const selectedMetal =
            document.getElementById("metal").selectedOptions[0].text;

        const temperature =
            document.getElementById("temperature").value;

        const humidity =
            document.getElementById("humidity").value;

        const ph =
            document.getElementById("ph").value;

        const salinity =
            document.getElementById("salinity").value;

        const riskScore =
            document.getElementById("riskScore").textContent;

        const riskLevel =
            document.getElementById("riskLevel").textContent;

        const riskDescription =
            document.getElementById("riskDescription").textContent;

        const date = new Date().toLocaleDateString();


        /* PDF HEADER */

        pdf.setFillColor(16, 45, 80);
        pdf.rect(0, 0, 210, 38, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(23);
        pdf.setFont("helvetica", "bold");

        pdf.text("CORROGUARD", 15, 18);

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        pdf.text("Corrosion Analysis Report", 15, 28);


        /* REPORT INFORMATION */

        pdf.setTextColor(30, 45, 65);

        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");

        pdf.text("Analysis Information", 15, 52);

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        pdf.text("Report Date: " + date, 15, 64);
        pdf.text("Selected Metal: " + selectedMetal, 15, 74);


        /* ENVIRONMENTAL CONDITIONS */

        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");

        pdf.text("Environmental Conditions", 15, 94);

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        pdf.text("Temperature: " + temperature + " °C", 15, 106);
        pdf.text("Humidity: " + humidity + "%", 15, 116);
        pdf.text("pH Level: " + ph, 15, 126);
        pdf.text("Salinity: " + salinity + "%", 15, 136);


        /* RISK ASSESSMENT */

        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");

        pdf.text("Corrosion Risk Assessment", 15, 157);

        pdf.setFontSize(13);

        pdf.text("Risk Score: " + riskScore + " / 100", 15, 170);
        pdf.text("Risk Level: " + riskLevel, 15, 181);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        const descriptionLines = pdf.splitTextToSize(
            riskDescription,
            175
        );

        pdf.text(descriptionLines, 15, 194);


        /* DISCLAIMER */

        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");

        pdf.text("Important Note", 15, 225);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        const disclaimer = pdf.splitTextToSize(
            "This report is generated using the CorroGuard educational risk model. Its score is illustrative and is not a measured corrosion rate or a validated engineering prediction. Professional assessment and material-specific data are required for real-world decisions.",
            175
        );

        pdf.text(disclaimer, 15, 235);


        /* FOOTER */

        pdf.setFontSize(9);
        pdf.setTextColor(110, 120, 130);

        pdf.text(
            "Generated by CorroGuard - Engineering Chemistry Capstone Project",
            15,
            280
        );


        /* SAVE PDF */

        pdf.save("CorroGuard_Corrosion_Report.pdf");

    });

});
// ==========================================
// PROTECTIVE COATING SELECTOR
// ==========================================

const coatingRecommendations = {
    iron: {
        indoor: {
            name: "Epoxy Primer with Protective Topcoat",
            mechanism: "Creates a barrier between iron and moisture or oxygen.",
            advantages: "Good adhesion and protection in indoor environments.",
            limitations: "Surface preparation is important.",
            applications: "Indoor iron structures and equipment."
        },
        outdoor: {
            name: "Zinc-Rich Primer with Epoxy and PU Topcoat",
            mechanism: "Provides barrier protection and sacrificial zinc protection.",
            advantages: "Suitable for many outdoor atmospheric conditions.",
            limitations: "Requires proper surface preparation and maintenance.",
            applications: "Outdoor iron structures and machinery."
        },
        coastal: {
            name: "Marine-Grade Epoxy Coating System",
            mechanism: "Forms a protective barrier against moisture and salt.",
            advantages: "Designed for demanding marine exposure.",
            limitations: "Application quality and coating inspection are essential.",
            applications: "Coastal iron structures and marine equipment."
        },
        industrial: {
            name: "Chemical-Resistant Epoxy Coating",
            mechanism: "Provides a barrier against selected industrial chemicals.",
            advantages: "Can offer good chemical resistance when correctly specified.",
            limitations: "Must be matched to the exact chemical exposure.",
            applications: "Industrial iron equipment and structures."
        }
    },

    steel: {
        indoor: {
            name: "Epoxy Primer and Protective Topcoat",
            mechanism: "Separates steel from moisture and oxygen.",
            advantages: "Good general-purpose protection.",
            limitations: "Damaged coating areas may need repair.",
            applications: "Indoor steel frames and equipment."
        },
        outdoor: {
            name: "Zinc-Rich Epoxy Primer and PU Topcoat",
            mechanism: "Combines sacrificial and barrier protection.",
            advantages: "Useful for outdoor structural steel.",
            limitations: "Requires correct preparation and application.",
            applications: "Bridges, railings and structural steel."
        },
        coastal: {
            name: "Marine Protective Epoxy System",
            mechanism: "Creates a barrier against saltwater and humidity.",
            advantages: "Suitable for properly specified marine systems.",
            limitations: "Needs regular inspection and maintenance.",
            applications: "Marine steel structures."
        },
        industrial: {
            name: "Chemical-Resistant Epoxy System",
            mechanism: "Limits contact between steel and corrosive substances.",
            advantages: "Can protect against selected chemicals.",
            limitations: "Chemical compatibility must be checked.",
            applications: "Industrial tanks and steel equipment."
        }
    },

    aluminium: {
        indoor: {
            name: "Clear Protective Anodizing",
            mechanism: "Thickens the naturally occurring aluminium oxide layer.",
            advantages: "Improves surface durability.",
            limitations: "Not suitable for every chemical environment.",
            applications: "Indoor aluminium components."
        },
        outdoor: {
            name: "Anodizing or Exterior-Grade Powder Coating",
            mechanism: "Provides a durable protective surface layer.",
            advantages: "Good weathering performance when properly applied.",
            limitations: "Coating selection depends on the aluminium alloy.",
            applications: "Window frames and outdoor aluminium panels."
        },
        coastal: {
            name: "Marine-Grade Anodizing or Suitable Protective Coating",
            mechanism: "Reduces direct exposure of aluminium to the environment.",
            advantages: "Can improve resistance in coastal conditions.",
            limitations: "Edges, joints and damaged areas need attention.",
            applications: "Coastal aluminium structures."
        },
        industrial: {
            name: "Chemically Compatible Protective Coating",
            mechanism: "Separates aluminium from selected corrosive chemicals.",
            advantages: "Can provide protection for compatible chemical exposures.",
            limitations: "Aluminium can react with some chemicals; compatibility testing is essential.",
            applications: "Industrial aluminium components."
        }
    },

    copper: {
        indoor: {
            name: "Clear Anti-Tarnish Coating",
            mechanism: "Limits contact with air and moisture.",
            advantages: "Helps preserve the surface appearance.",
            limitations: "Coating condition must be maintained.",
            applications: "Indoor copper fittings and decorative items."
        },
        outdoor: {
            name: "Exterior-Grade Protective Clear Coating",
            mechanism: "Provides a barrier against atmospheric exposure.",
            advantages: "Can slow unwanted surface changes.",
            limitations: "Weathering may require recoating.",
            applications: "Outdoor copper surfaces."
        },
        coastal: {
            name: "Marine-Compatible Protective Coating",
            mechanism: "Reduces direct contact with salt and moisture.",
            advantages: "Can reduce surface deterioration.",
            limitations: "Must be selected for the specific copper alloy and exposure.",
            applications: "Coastal copper components."
        },
        industrial: {
            name: "Chemical-Compatible Polymer Coating",
            mechanism: "Acts as a barrier against selected chemicals.",
            advantages: "Provides targeted protection.",
            limitations: "Must be checked against the actual chemical.",
            applications: "Industrial copper equipment."
        }
    },

    stainless304: {
        indoor: {
            name: "Passivation Treatment",
            mechanism: "Supports formation of the protective chromium-rich passive film.",
            advantages: "Maintains the natural corrosion resistance of stainless steel.",
            limitations: "Does not prevent every type of corrosion.",
            applications: "Indoor stainless steel equipment."
        },
        outdoor: {
            name: "Passivation and Suitable Surface Finish",
            mechanism: "Supports the passive surface layer.",
            advantages: "Helps maintain atmospheric corrosion resistance.",
            limitations: "Chloride exposure can still cause corrosion.",
            applications: "Outdoor stainless steel components."
        },
        coastal: {
            name: "Protective Coating or Upgrade to a More Suitable Alloy",
            mechanism: "A coating can reduce direct chloride contact.",
            advantages: "May reduce exposure-related corrosion.",
            limitations: "Grade 304 can be vulnerable to chloride environments.",
            applications: "Coastal equipment after engineering assessment."
        },
        industrial: {
            name: "Chemical-Compatible Protective Coating",
            mechanism: "Provides a barrier against selected chemicals.",
            advantages: "Can extend service life in compatible environments.",
            limitations: "Chemical compatibility must be verified.",
            applications: "Industrial stainless steel equipment."
        }
    },

    stainless316: {
        indoor: {
            name: "Passivation Treatment",
            mechanism: "Supports the protective chromium-rich passive film.",
            advantages: "Maintains the natural corrosion resistance of the alloy.",
            limitations: "Surface contamination should be avoided.",
            applications: "Indoor stainless steel equipment."
        },
        outdoor: {
            name: "Passivation and Suitable Surface Finish",
            mechanism: "Supports the passive surface layer.",
            advantages: "Good general atmospheric corrosion resistance.",
            limitations: "Severe exposure may still require additional protection.",
            applications: "Outdoor stainless steel structures."
        },
        coastal: {
            name: "Passivation with Marine-Compatible Protection if Needed",
            mechanism: "Maintains the passive film and can add a protective barrier.",
            advantages: "Molybdenum improves resistance to chloride-related corrosion compared with 304.",
            limitations: "316 is not immune to seawater corrosion.",
            applications: "Marine fittings and coastal equipment."
        },
        industrial: {
            name: "Chemical-Compatible Protective System",
            mechanism: "Uses the passive alloy surface and, where needed, a compatible barrier coating.",
            advantages: "Can provide protection in selected industrial environments.",
            limitations: "Resistance depends on chemical concentration and temperature.",
            applications: "Industrial stainless steel equipment."
        }
    },

    galvanized: {
        indoor: {
            name: "Compatible Clear Sealer",
            mechanism: "Adds a barrier over the zinc coating.",
            advantages: "Can reduce exposure to moisture and contaminants.",
            limitations: "Must be compatible with galvanized surfaces.",
            applications: "Indoor galvanized components."
        },
        outdoor: {
            name: "Duplex System: Zinc Coating with Compatible Paint",
            mechanism: "Combines sacrificial zinc protection with a paint barrier.",
            advantages: "Can provide extended protection when properly designed.",
            limitations: "Surface preparation and paint compatibility are important.",
            applications: "Outdoor galvanized steel."
        },
        coastal: {
            name: "Marine-Compatible Duplex Coating",
            mechanism: "Combines zinc protection with an additional barrier.",
            advantages: "Can improve protection in salt-rich environments.",
            limitations: "Requires a coating system designed for galvanized surfaces.",
            applications: "Coastal galvanized structures."
        },
        industrial: {
            name: "Chemical-Compatible Sealer or Topcoat",
            mechanism: "Adds a barrier against selected industrial substances.",
            advantages: "Can protect the zinc layer in compatible environments.",
            limitations: "Some chemicals attack zinc; compatibility must be checked.",
            applications: "Industrial galvanized components."
        }
    },

    brass: {
        indoor: {
            name: "Clear Anti-Tarnish Lacquer",
            mechanism: "Reduces contact with air and moisture.",
            advantages: "Helps preserve appearance.",
            limitations: "May wear or require maintenance.",
            applications: "Indoor brass fittings and decorative components."
        },
        outdoor: {
            name: "Exterior-Grade Clear Protective Coating",
            mechanism: "Forms a barrier against atmospheric exposure.",
            advantages: "Can slow tarnishing and surface deterioration.",
            limitations: "Requires periodic inspection.",
            applications: "Outdoor brass fixtures."
        },
        coastal: {
            name: "Marine-Compatible Protective Coating",
            mechanism: "Reduces direct exposure to salt and moisture.",
            advantages: "Can help protect suitable brass alloys.",
            limitations: "Alloy composition and exposure conditions matter.",
            applications: "Coastal brass fittings."
        },
        industrial: {
            name: "Chemical-Compatible Polymer Coating",
            mechanism: "Separates brass from selected chemicals.",
            advantages: "Provides targeted barrier protection.",
            limitations: "Must be checked for chemical compatibility.",
            applications: "Industrial brass components."
        }
    },

    bronze: {
        indoor: {
            name: "Clear Protective Wax or Lacquer",
            mechanism: "Limits contact with moisture and air.",
            advantages: "Helps preserve surface appearance.",
            limitations: "May need periodic renewal.",
            applications: "Indoor bronze objects and fittings."
        },
        outdoor: {
            name: "Exterior-Grade Protective Coating",
            mechanism: "Provides a barrier against atmospheric exposure.",
            advantages: "Can reduce unwanted surface deterioration.",
            limitations: "Maintenance depends on weather exposure.",
            applications: "Outdoor bronze fittings."
        },
        coastal: {
            name: "Marine-Compatible Protective Coating",
            mechanism: "Reduces contact with saltwater and moisture.",
            advantages: "Can provide additional protection.",
            limitations: "Bronze alloy type and service conditions must be assessed.",
            applications: "Marine bronze components."
        },
        industrial: {
            name: "Chemical-Compatible Barrier Coating",
            mechanism: "Limits exposure to selected industrial chemicals.",
            advantages: "Offers targeted protection.",
            limitations: "Requires compatibility verification.",
            applications: "Industrial bronze equipment."
        }
    },

    zinc: {
        indoor: {
            name: "Compatible Clear Sealer",
            mechanism: "Adds a barrier over the zinc surface.",
            advantages: "Can reduce staining and surface exposure.",
            limitations: "Must be compatible with zinc.",
            applications: "Indoor zinc components."
        },
        outdoor: {
            name: "Zinc-Compatible Exterior Coating",
            mechanism: "Provides additional barrier protection.",
            advantages: "Can reduce atmospheric exposure.",
            limitations: "Correct preparation is essential.",
            applications: "Outdoor zinc surfaces."
        },
        coastal: {
            name: "Marine-Compatible Protective Sealer",
            mechanism: "Reduces direct salt and moisture contact.",
            advantages: "Can provide additional protection.",
            limitations: "Zinc can be consumed over time as a sacrificial coating.",
            applications: "Coastal zinc-coated components."
        },
        industrial: {
            name: "Chemical-Compatible Protective Coating",
            mechanism: "Separates zinc from selected corrosive substances.",
            advantages: "Provides targeted barrier protection.",
            limitations: "Zinc is incompatible with some acidic and alkaline environments.",
            applications: "Industrial zinc components."
        }
    },

    titanium: {
        indoor: {
            name: "Natural Oxide Film / Passivation",
            mechanism: "Maintains the stable titanium oxide surface layer.",
            advantages: "Titanium has excellent natural corrosion resistance in many environments.",
            limitations: "Not immune to every chemical or service condition.",
            applications: "Indoor titanium components."
        },
        outdoor: {
            name: "Natural Oxide Film / Passivation",
            mechanism: "Relies on titanium's protective oxide layer.",
            advantages: "Usually does not require a conventional corrosion coating.",
            limitations: "Specific environments may require additional assessment.",
            applications: "Outdoor titanium components."
        },
        coastal: {
            name: "Natural Oxide Film / Passivation",
            mechanism: "The stable oxide film protects titanium in many marine conditions.",
            advantages: "Excellent resistance in many seawater applications.",
            limitations: "Crevices and unusual chemical conditions need assessment.",
            applications: "Marine titanium equipment."
        },
        industrial: {
            name: "Chemical-Specific Protective System if Required",
            mechanism: "Uses titanium's passive film or a compatible additional barrier.",
            advantages: "Titanium resists many industrial chemicals.",
            limitations: "Suitability depends on the exact chemical and temperature.",
            applications: "Industrial titanium equipment."
        }
    }
};

const coatingButton = document.getElementById("findCoating");

if (coatingButton) {
    coatingButton.addEventListener("click", function () {
        const metal = document.getElementById("coatingMetal").value;
        const environment = document.getElementById("coatingEnvironment").value;
        const concern = document.getElementById("coatingConcern").value;
        const resultBox = document.getElementById("coatingResult");

        if (!metal || !environment || !concern) {
            resultBox.innerHTML = `
                <span class="section-tag">MISSING INFORMATION</span>
                <h3>Complete Your Selection</h3>
                <p>Please select a material, environment, and corrosion concern before requesting a recommendation.</p>
            `;
            return;
        }

        const recommendation = coatingRecommendations[metal]?.[environment];

        if (!recommendation) {
            resultBox.innerHTML = `
                <h3>No Recommendation Available</h3>
                <p>Please try another selection.</p>
            `;
            return;
        }

        const concernNames = {
            moisture: "Moisture",
            salt: "Salt Exposure",
            chemical: "Chemical Exposure",
            general: "General Corrosion"
        };

        resultBox.innerHTML = `
            <span class="section-tag">COATING RECOMMENDATION</span>
            <h3>${recommendation.name}</h3>

            <p><strong>Selected Material:</strong> ${document.getElementById("coatingMetal").selectedOptions[0].text}</p>
            <p><strong>Environment:</strong> ${document.getElementById("coatingEnvironment").selectedOptions[0].text}</p>
            <p><strong>Main Concern:</strong> ${concernNames[concern]}</p>

            <div class="coating-detail">
                <h4>How It Works</h4>
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
        `;
    });
}
