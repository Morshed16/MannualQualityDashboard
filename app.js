/* =========================================
   COPPA EVIDENCE PORTAL
   DOCUMENT DATA
========================================= */



 let evidenceData = {};
 let allDocuments = [];


/* =========================================
   DOM ELEMENTS
========================================= */

const dashboardPage =
    document.getElementById("dashboardPage");

const areaPage =
    document.getElementById("areaPage");

const areaGrid =
    document.getElementById("areaGrid");

    const folderGrid =
    document.getElementById("folderGrid");

const folderPage =
    document.getElementById("folderPage");

const folderDocumentList =
    document.getElementById("folderDocumentList");

const folderDocumentCount =
    document.getElementById("folderDocumentCount");

const folderTitle =
    document.getElementById("folderTitle");

const folderDescription =
    document.getElementById("folderDescription");

const folderCode =
    document.getElementById("folderCode");

const folderSearch =
    document.getElementById("folderSearch");

const folderBackButton =
    document.getElementById("folderBackButton");


const documentList =
    document.getElementById("documentList");

const totalDocuments =
    document.getElementById("totalDocuments");

const externalDocuments =
    document.getElementById("externalDocuments");

const areaDocumentCount =
    document.getElementById("areaDocumentCount");

const areaNumber =
    document.getElementById("areaNumber");

const areaCode =
    document.getElementById("areaCode");

const areaTitle =
    document.getElementById("areaTitle");

const areaDescription =
    document.getElementById("areaDescription");

const breadcrumbText =
    document.getElementById("breadcrumbText");

const areaSearch =
    document.getElementById("areaSearch");

const area2LevelFilter =
    document.getElementById("area2LevelFilter");

const guidelineTypeFilter =
    document.getElementById("guidelineTypeFilter");

const descriptionFilter =
    document.getElementById("descriptionFilter");

const filePathFilter =
    document.getElementById("filePathFilter");

const globalSearch =
    document.getElementById("globalSearch");

const globalSearchResults =
    document.getElementById("globalSearchResults");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const backButton =
    document.getElementById("backButton");

const menuButton =
    document.getElementById("menuButton");

const sidebar =
    document.getElementById("sidebar");


/*=========================================
   CURRENT AREA
=========================================*/

let currentArea = null;
let currentFolder = null;

let areaPieChart = null;

let currentLevel = "Undergraduate";
let currentGuidelineType = "Akademik";

let previousPage = "dashboard";
let areaBarChart = null;



/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadEvidenceData();

        renderAreaCards();
        renderFolderCards();

        updateStatistics();

        setupNavigation();

        createCharts();


    }
);


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    let total = 0;

    let external = 0;


    Object.values(evidenceData).forEach(
        area => {

            total += area.documents.length;


            area.documents.forEach(
                document => {

                    if (
                        document.url &&
                        document.url.includes("drive.google.com")
                    ) {

                        external++;

                    }

                }
            );

        }
    );


    totalDocuments.textContent = total;

    externalDocuments.textContent = external;

}


/* =========================================
   CREATE ANALYTICS CHARTS
========================================= */

function createCharts() {

    const areas =
        Object.values(evidenceData);


    const labels =
        areas.map(
            area => `Area ${area.number}`
        );


    const documentCounts =
        areas.map(
            area => area.documents.length
        );


    /*
        Destroy existing charts
        if they already exist.
    */

    if (areaPieChart) {

        areaPieChart.destroy();

    }


    if (areaBarChart) {

        areaBarChart.destroy();

    }


    /* =====================================
       DOUGHNUT / PIE CHART
    ====================================== */

    const pieCanvas =
        document.getElementById(
            "areaPieChart"
        );


    areaPieChart =
        new Chart(
            pieCanvas,
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            data:
                                documentCounts,

                            backgroundColor: [

                                "#0b1f3a",

                                "#1e4f91",

                                "#d5a928",

                                "#4f8fba",

                                "#5b9b72",

                                "#8064a2",

                                "#c46b5c"

                            ],

                            borderWidth: 3,

                            borderColor: "#ffffff"

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                     
                        legend: {
                                display: false
                        },  

    
                       
                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        const value =
                                            context.raw;

                                        const total =
                                            documentCounts
                                                .reduce(
                                                    (
                                                        sum,
                                                        number
                                                    ) =>
                                                        sum + number,
                                                    0
                                                );


                                        const percentage =
                                            total > 0
                                                ? (
                                                    value /
                                                    total
                                                ) * 100
                                                : 0;


                                        return ` ${context.label}: ${value} documents (${percentage.toFixed(1)}%)`;

                                    }

                            }

                        }

                    }

                }

            }
        );


    /* =====================================
       BAR CHART
    ====================================== */

    const barCanvas =
        document.getElementById(
            "areaBarChart"
        );


    areaBarChart =
        new Chart(
            barCanvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Documents",

                            data:
                                documentCounts,

                            backgroundColor:
                                "#1e4f91",

                            borderRadius: 7,

                            borderSkipped: false

                        }

                    ]

                },


                options: {

                    responsive: true,
                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0,
                                font: {

                                    size: 10

                                }

                            },

                            grid: {

                                color:
                                    "#edf0f5"

                            }

                        },


                        x: {

                            ticks: {

                                display: false,
                                font: {

                                    size: 10

                                }

                            },

                            grid: {

                                display: false

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            display: false

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return ` ${context.raw} documents`;

                                    }

                            }

                        }

                    }

                }

            }
        );

}

/* =========================================
   SPECIAL FOLDER CARDS
========================================= */

function renderFolderCards() {

    folderGrid.innerHTML = "";

    const folders = [
        {
            type: "COPPA Related Documents",
            icon: "fa-file-circle-check",
            title: "COPPA-Related Documents",
            description:
                "Supporting documents and evidence related to COPPA accreditation.",
            color: "blue"
        },

        {
            type: "Folder for APEL",
            icon: "fa-folder-tree",
            title: "Folder for APEL",
            description:
                "Documents and supporting evidence related to APEL.",
            color: "gold"
        },

        {
            type: "Microcredentials",
            icon: "fa-certificate",
            title: "Microcredentials",
            description:
                "Documents and supporting evidence related to Microcredentials.",
            color: "green"
        },

        {
            type: "Other Important Guidelines",
            icon: "fa-book-open",
            title: "Other Important Guidelines",
            description:
                "Important guidelines, references and supporting documents.",
            color: "purple"
        },
        
        {
            type: "Policy",
            icon: "fa-scale-balanced",
            title: "Policy",
            description: "Important policies, references and supporting documents.",
            color: "gold"
        }

    ];


    folders.forEach(folder => {

        const count = allDocuments.filter(
            doc =>
                normalizeFolderType(doc.folderType)
                === normalizeFolderType(folder.type)
        ).length;


        const card = document.createElement("div");

        card.className =
            "area-card special-folder-card";


        card.innerHTML = `

            <div class="area-card-top">

                <div class="card-area-number folder-card-icon">
                    <i class="fa-solid ${folder.icon}"></i>
                </div>

                <i class="fa-solid fa-arrow-right arrow"></i>

            </div>


            <h3>
                ${folder.title}
            </h3>


            <p>
                ${folder.description}
            </p>


            <div class="card-footer">

                <span class="document-total">

                    <strong>
                        ${count}
                    </strong>

                    documents

                </span>


                <span class="document-total">
                    View 
                </span>

            </div>

        `;


        card.addEventListener(
            "click",
            function () {

                openFolder(folder.type);

            }
        );


        folderGrid.appendChild(card);

    });

}

/* =========================================
   NORMALIZE FOLDER TYPE
========================================= */

function normalizeFolderType(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}




/* =========================================
   AREA CARDS
========================================= */

function renderAreaCards(targetGrid = areaGrid) {

    targetGrid.innerHTML = "";

    Object.entries(evidenceData).forEach(
        ([key, area]) => {

            const card =
                document.createElement("div");


            card.className =
                "area-card";


            card.innerHTML = `

                <div class="area-card-top">

                    <div class="card-area-number">
                        ${area.number}
                    </div>

                    <i class="fa-solid fa-arrow-right arrow"></i>

                </div>


                <h3>
                    Area ${area.number}
                </h3>


                <p>
                    ${area.title}
                </p>


                <div class="card-footer">

                    <span class="document-total">

                        <strong>
                            ${area.documents.length}
                        </strong>

                        documents

                    </span>


                    <span class="document-total">
                        View evidence
                    </span>

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    openArea(key);

                }
            );


            targetGrid.appendChild(card);

        }
    );

}


/* =========================================
   POPULATE AREA FILTERS
========================================= */

function populateAreaFilters(documents) {

    /* ================================
       DESCRIPTION FILTER
    ================================ */

    descriptionFilter.innerHTML = `
        <option value="">
            All Descriptions
        </option>
    `;


    const descriptions =
        [...new Set(
            documents
                .map(doc => doc.description)
                .filter(value => value)
        )]
        .sort();


    descriptions.forEach(description => {

        const option =
            document.createElement("option");

        option.value = description;

        option.textContent = description;

        descriptionFilter.appendChild(option);

    });


    /* ================================
       FILE PATH FILTER
    ================================ */

    filePathFilter.innerHTML = `
        <option value="">
            All File Paths
        </option>
    `;


    const filePaths =
        [...new Set(
            documents
                .map(doc => doc.fileLocation)
                .filter(value => value)
        )]
        .sort();


    filePaths.forEach(filePath => {

        const option =
            document.createElement("option");

        option.value = filePath;

        option.textContent = filePath;

        filePathFilter.appendChild(option);

    });

}


/* =========================================
   OPEN SPECIAL FOLDER
========================================= */

function openFolder(folderType) {

    const normalizedType = normalizeFolderType(folderType);

    const documents = allDocuments.filter(
        doc =>
            normalizeFolderType(doc.folderType) === normalizedType
    );

    currentFolder = folderType;
    currentArea = null;
    currentGuidelineType = "Akademik";
    previousPage = "dashboard";

    dashboardPage.classList.remove("active-page");
    areaPage.classList.remove("active-page");
    folderPage.classList.add("active-page");

    folderCode.textContent = "DOCUMENT COLLECTION";
    folderTitle.textContent = folderType;
    folderDescription.textContent =
        `Browse all available documents in ${folderType}.`;

    folderDocumentCount.textContent = documents.length;
    folderSearch.value = "";

    /* =====================================================
       SPECIAL BEHAVIOUR ONLY FOR COPPA RELATED DOCUMENTS
       ===================================================== */

    const folderAreaGrid = document.getElementById("folderAreaGrid");

     if (
    normalizedType ===
    normalizeFolderType("COPPA Related Documents")
) {

    /*
     * =========================================
     * COPPA RELATED DOCUMENTS
     * =========================================
     */

    folderAreaGrid.style.display = "grid";

    folderDocumentList.style.display = "none";

    guidelineTypeFilter.style.display = "none";

    renderAreaCards(folderAreaGrid);

}

    else if (
    normalizedType ===
        normalizeFolderType("Other Important Guidelines") ||
    normalizedType ===
        normalizeFolderType("Policy")
) {

    /*
     * =========================================
     * OTHER IMPORTANT GUIDELINES
     * =========================================
     */

    folderAreaGrid.style.display = "none";

    folderDocumentList.style.display = "";

    guidelineTypeFilter.style.display = "flex";

    /*
     * Start with Akademik
     * exactly like Area 2 starts
     * with Undergraduate.
     */

    currentGuidelineType = "Akademik";

    document
        .querySelectorAll(
            "#guidelineTypeFilter .level-button"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.guidelineType ===
                currentGuidelineType
            );

        });

    /*
     * Filter documents by Akademik
     */

    const filteredDocuments =
        documents.filter(doc => {

            return String(
                doc.guidelineType || ""
            )
                .trim()
                .toLowerCase()
                ===
                currentGuidelineType
                    .toLowerCase();

        });

    folderDocumentCount.textContent =
        filteredDocuments.length;

    renderDocumentsInFolder(
        filteredDocuments
    );

}
else {

    /*
     NORMAL SPECIAL FOLDERS
     */

    folderAreaGrid.style.display = "none";

    folderDocumentList.style.display = "";

    guidelineTypeFilter.style.display = "none";

    renderDocumentsInFolder(
        documents
    );
}

    breadcrumbText.textContent = folderType;
    updateSidebarActive("dashboard");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================
   RENDER FOLDER DOCUMENTS
========================================= */

function renderDocumentsInFolder(documents) {

    folderDocumentList.innerHTML = "";


    if (documents.length === 0) {

        folderDocumentList.innerHTML = `

            <div class="empty-state">

                <i class="fa-regular fa-folder-open"></i>

                <h3>
                    No documents available
                </h3>

                <p>
                    Documents for this collection
                    have not been added yet.
                </p>

            </div>

        `;

        return;

    }


    documents.forEach(doc => {

        const item =
            document.createElement("div");


        item.className =
            "document-item";


        const safeUrl =
            doc.url || "#";


        item.innerHTML = `

            <div class="file-icon">

                <i class="fa-solid fa-file-pdf"></i>

            </div>


            <div class="document-info">

                <h4>
                    ${doc.name}
                </h4>


                <div class="file-location">

                    <i class="fa-solid fa-folder"></i>

                    <span>
                        ${doc.fileLocation ||
                        "Location not specified"}
                    </span>

                </div>


                <p>

                    <span class="file-type">
                        ${doc.type}
                    </span>

                    ${doc.description || ""}

                </p>

            </div>


            <a
                class="open-button"
                href="${safeUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >

                <i class="fa-solid fa-arrow-up-right-from-square"></i>

                <span>
                    Open File
                </span>

            </a>

        `;


        folderDocumentList.appendChild(item);

    });

}

/* =========================================
   SEARCH INSIDE FOLDER
========================================= */

folderSearch.addEventListener(
    "input",
    function () {

        if (!currentFolder) {
            return;
        }


        const keyword =
            folderSearch.value
                .toLowerCase()
                .trim();


        const folderType =
            normalizeFolderType(
                currentFolder
            );


       

    const documents =
    allDocuments.filter(doc => {

        if (
            normalizeFolderType(
                doc.folderType
            ) !== folderType
        ) {
            return false;
        }

        /*
         * Only apply guideline type filter
         * inside Other Important Guidelines
         */

        if (
            folderType ===
            normalizeFolderType(
                "Other Important Guidelines")    ||
        folderType ===
        normalizeFolderType("Policy")
        ) {

            return String(
                doc.guidelineType || ""
            )
                .trim()
                .toLowerCase()
                ===
                currentGuidelineType
                    .toLowerCase();

        }

        return true;

    });


        const filtered =
            documents.filter(doc =>

                String(doc.name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(doc.description || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(doc.type || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(doc.fileLocation || "")
                    .toLowerCase()
                    .includes(keyword)

            );


        renderDocumentsInFolder(filtered);


        folderDocumentCount.textContent =
            filtered.length;

    }
);


/* =========================================
   OPEN AREA
========================================= */

function openArea(areaKey) {

    const area = evidenceData[areaKey];

    if (!area) {
        return;
    }

     // Hide special folder area cards
    const folderAreaGrid = document.getElementById("folderAreaGrid");

    if (folderAreaGrid) {
        folderAreaGrid.style.display = "none";
    }

    if (folderPage.classList.contains("active-page")) {
    previousPage = "coppa";
    } else {
        previousPage = "dashboard";
    }

    currentArea = areaKey;

    dashboardPage.classList.remove("active-page");
    folderPage.classList.remove("active-page");

    areaPage.classList.add("active-page");

    areaNumber.textContent =
        area.number;

    areaCode.textContent =
        `AREA ${area.number}`;

    areaTitle.textContent =
        area.title;

    areaDescription.textContent =
        area.description;

    breadcrumbText.textContent =
        `Area ${area.number}`;

    areaSearch.value = "";

    /*
     * ================================
     * AREA 2 LEVEL FILTER
     * ================================
     */

    if (areaKey === "area2") {

        area2LevelFilter.style.display = "flex";

        /*
         * Always start with Undergraduate
         * when entering Area 2.
         */
        currentLevel = "Undergraduate";

        document
            .querySelectorAll(".level-button")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.level === currentLevel
                );

            });

        const filteredDocuments =
        area.documents.filter(document => {

            const levels =
                String(document.level || "")
                    .split(",")
                    .map(level => level.trim().toLowerCase());

            return levels.includes(
                currentLevel.toLowerCase()
            );

        });

    areaDocumentCount.textContent =
        filteredDocuments.length;

    renderDocuments(filteredDocuments);

    } else {

        /*
         * Hide Level filter for other areas
         */
        area2LevelFilter.style.display = "none";

        areaDocumentCount.textContent =
            area.documents.length;

        renderDocuments(area.documents);
    }

    updateSidebarActive(areaKey);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   RENDER DOCUMENTS
========================================= */

function renderDocuments(documents) {

    documentList.innerHTML = "";


    if (documents.length === 0) {

        documentList.innerHTML = `

            <div class="empty-state">

                <i class="fa-regular fa-folder-open"></i>

                <h3>
                    No documents available
                </h3>

                <p>
                    Evidence documents for this area
                    have not been added yet.
                </p>

            </div>

        `;

        return;
    }


    documents.forEach(doc => {

        const item =
            document.createElement("div");


        item.className =
            "document-item";


        const safeUrl =
            doc.url || "#";


        item.innerHTML = `

            <div class="file-icon">

                <i class="fa-solid fa-file-pdf"></i>

            </div>


            <div class="document-info">

                <h4>
                    ${doc.name}
                </h4>

                <div class="file-location">

                    <i class="fa-solid fa-folder"></i>

                    <span>
                        ${doc.fileLocation || "Location not specified"}
                    </span>

                </div>


                <p>

                    <span class="file-type">
                        ${doc.type}
                    </span>

                    ${doc.description}

                </p>

            </div>


            <a
                class="open-button"
                href="${safeUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >

                <i class="fa-solid fa-arrow-up-right-from-square"></i>

                <span>
                    Open File
                </span>

            </a>

        `;


        documentList.appendChild(item);

    });

}
/* =========================================
   SEARCH INSIDE AREA
========================================= */

areaSearch.addEventListener(
    "input",
    function () {

        if (!currentArea) {
            return;
        }


        const keyword =
            areaSearch.value
                .toLowerCase()
                .trim();


        const documents =
            evidenceData[currentArea]
                .documents;


        const filtered =
            documents.filter(
                document =>

                    document.name
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    document.description
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    document.type
                        .toLowerCase()
                        .includes(keyword)

                    ||
                    
                    document.fileLocation
                        .toLowerCase()
                        .includes(keyword)

            );


        renderDocuments(filtered);


        areaDocumentCount.textContent =
            filtered.length;

    }
);


/* =========================================
   GLOBAL SEARCH
   SMART DOCUMENT SEARCH
========================================= */


/*
    Escape HTML characters.

    This keeps document data safe when
    inserted into the search result UI.
*/

function escapeSearchHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/*
    Get a readable source name
    for each document.
*/

function getSearchSource(document) {

    /*
        If document belongs to an Area,
        show Area number.
    */

    if (
        document.area &&
        evidenceData[document.area]
    ) {

        return `Area ${evidenceData[document.area].number}`;

    }


    /*
        Otherwise show its folder.
    */

    if (document.folderType) {

        return document.folderType;

    }


    return "Documentation Portal";

}


/*
    Get a secondary label.

    Example:

    PDF
    Akademik
    Staff
*/

function getSearchSecondary(document) {

    if (document.guidelineType) {

        return document.guidelineType;

    }

    if (document.type) {

        return document.type;

    }

    return "Document";

}


/*
    Search through ALL documents.

    This includes:

    - Area 1–7
    - COPPA Related Documents
    - Folder for APEL
    - Microcredentials
    - Other Important Guidelines
    - Policy
*/

function searchAllDocuments(keyword) {

    const searchTerm =
        keyword
            .toLowerCase()
            .trim();


    if (!searchTerm) {

        return [];

    }


    return allDocuments
        .filter(document => {

            const searchableText = [

                document.name,

                document.description,

                document.type,

                document.fileLocation,

                document.filePath,

                document.folderType,

                document.guidelineType,

                document.level,

                document.status,

                document.owner

            ]
                .map(value =>
                    String(value || "")
                        .toLowerCase()
                )
                .join(" ");


            return searchableText
                .includes(searchTerm);

        })

        .slice(0, 8);

}


/*
    Render search results.
*/

function renderGlobalSearchResults(
    keyword,
    results
) {

    if (!globalSearchResults) {

        return;

    }


    /*
        Nothing typed.
    */

    if (!keyword) {

        globalSearchResults.classList.remove(
            "show"
        );

        globalSearchResults.innerHTML = "";

        return;

    }


    /*
        No matching documents.
    */

    if (results.length === 0) {

        globalSearchResults.innerHTML = `

            <div class="search-no-results">

                <i class="fa-regular fa-folder-open"></i>

                <strong>
                    No documents found
                </strong>

                <span>
                    Try another keyword or document name.
                </span>

            </div>

        `;

        globalSearchResults.classList.add(
            "show"
        );

        return;

    }


    /*
        Build result list.
    */

    let html = `

        <div class="search-result-header">

            Search results for
            "${escapeSearchHTML(keyword)}"

        </div>

    `;


    results.forEach(document => {

        const name =
            escapeSearchHTML(
                document.name ||
                "Untitled Document"
            );


        const source =
            escapeSearchHTML(
                getSearchSource(document)
            );


        const secondary =
            escapeSearchHTML(
                getSearchSecondary(document)
            );


        const url =
            escapeSearchHTML(
                document.url || "#"
            );


        html += `

            <a
                class="search-result-item"
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
            >

                <div class="search-result-icon">

                    <i class="fa-solid fa-file-lines"></i>

                </div>


                <div class="search-result-info">

                    <div class="search-result-title">

                        ${name}

                    </div>


                    <div class="search-result-meta">

                        <span class="search-source">

                            ${source}

                        </span>

                        <span>
                            •
                        </span>

                        <span>

                            ${secondary}

                        </span>

                    </div>

                </div>


                <i
                    class="fa-solid fa-arrow-up-right-from-square search-result-arrow"
                ></i>

            </a>

        `;

    });


    html += `

        <div class="search-result-footer">

            Showing ${results.length}
            matching document${results.length === 1 ? "" : "s"}

        </div>

    `;


    globalSearchResults.innerHTML =
        html;


    globalSearchResults.classList.add(
        "show"
    );

}


/*
    MAIN SEARCH EVENT
*/

globalSearch.addEventListener(
    "input",
    function () {

        const keyword =
            globalSearch.value
                .trim();


        /*
            Hide dropdown when empty.
        */

        if (!keyword) {

            renderGlobalSearchResults(
                "",
                []
            );

            return;

        }


        /*
            Start searching after
            at least 2 characters.
        */

        if (keyword.length < 2) {

            globalSearchResults.innerHTML = `

                <div class="search-no-results">

                    <i class="fa-solid fa-keyboard"></i>

                    <strong>
                        Keep typing...
                    </strong>

                    <span>
                        Enter at least 2 characters.
                    </span>

                </div>

            `;

            globalSearchResults.classList.add(
                "show"
            );

            return;

        }


        /*
            Search ALL documents.
        */

        const results =
            searchAllDocuments(
                keyword
            );


        /*
            Display results.
        */

        renderGlobalSearchResults(
            keyword,
            results
        );

    }
);


/*
    CLOSE SEARCH WHEN USER
    CLICKS OUTSIDE.
*/

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                "#globalSearchBox"
            )
        ) {

            globalSearchResults
                .classList
                .remove("show");

        }

    }
);


/*
    CLOSE SEARCH WITH ESC KEY.
*/

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            globalSearchResults
                .classList
                .remove("show");

            globalSearch.blur();

        }

    }
);

/* =========================================
   AREA 2 LEVEL FILTER
========================================= */

document
    .querySelectorAll(".level-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                if (currentArea !== "area2") {
                    return;
                }

                currentLevel =
                    this.dataset.level;

                /*
                 * Update active button
                 */
                document
                    .querySelectorAll(".level-button")
                    .forEach(btn => {

                        btn.classList.remove("active");

                    });

                this.classList.add("active");

                /*
                 * Get Area 2 documents
                 */
                const documents =
                    evidenceData.area2.documents;

                /*
                 * Filter by Level
                 */
                const filtered =
                documents.filter(document => {

                    const levels =
                        String(document.level || "")
                            .split(",")
                            .map(level => level.trim().toLowerCase());

                    return levels.includes(
                        currentLevel.toLowerCase()
                    );

                });

                /*
                 * Update document count
                 */
                areaDocumentCount.textContent =
                    filtered.length;

                /*
                 * Display documents
                 */
                renderDocuments(filtered);

            }
        );

    });

    /* =========================================
   OTHER IMPORTANT GUIDELINES TYPE FILTER
========================================= */

document
    .querySelectorAll(
        "#guidelineTypeFilter .level-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                if (
                    currentFolder !==
                    "Other Important Guidelines"   && currentFolder !== "Policy"

                ) {
                    return;
                }

                /*
                 * Get selected type
                 */

                currentGuidelineType =
                    this.dataset.guidelineType;

                /*
                 * Update active button
                 */

                document
                    .querySelectorAll(
                        "#guidelineTypeFilter .level-button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });

                this.classList.add(
                    "active"
                );

                /*
                 * Get all documents
                 * from Other Important Guidelines
                 */

                const documents =
                allDocuments.filter(doc => {
                    return (
                        normalizeFolderType(doc.folderType) ===
                        normalizeFolderType(currentFolder)
                    );
                });

                /*
                 * Filter by Akademik / Staf
                 */

                const filtered =
                    documents.filter(doc => {

                        return String(
                            doc.guidelineType || ""
                        )
                            .trim()
                            .toLowerCase()
                            ===
                            currentGuidelineType
                                .toLowerCase();

                    });

                /*
                 * Update count
                 */

                folderDocumentCount.textContent =
                    filtered.length;

                /*
                 * Display documents
                 */

                renderDocumentsInFolder(
                    filtered
                );

            }
        );

    });

/* =========================================
   BACK TO DASHBOARD
========================================= */
/*
backButton.addEventListener(
    "click",
    function () {

        showDashboard();

    }
);  */

backButton.addEventListener(
    "click",
    function () {

        if (previousPage === "coppa") {

            openFolder("COPPA Related Documents");

        } else {

            showDashboard();

        }

    }
);


folderBackButton.addEventListener(
    "click",
    function () {

        showDashboard();

    }
);


function showDashboard() {

    areaPage.classList.remove(
        "active-page"
    );

    folderPage.classList.remove(
        "active-page"
    );


    dashboardPage.classList.add(
        "active-page"
    );


    breadcrumbText.textContent =
        "Dashboard";


    currentArea = null;
    currentFolder = null;

    currentGuidelineType = "Akademik";

if (guidelineTypeFilter) {
    guidelineTypeFilter.style.display = "none";
}


    areaSearch.value = "";
    folderSearch.value = "";

    globalSearch.value = "";


    updateSidebarActive(
        "dashboard"
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =========================================
   SIDEBAR NAVIGATION
========================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const page =
                        item.dataset.page;


                    if (
                        page === "dashboard"
                    ) {

                        showDashboard();

                    } else {

                        openArea(page);

                    }


                    sidebar.classList.remove(
                        "open"
                    );

                }
            );

        }
    );

}


/* =========================================
   ACTIVE SIDEBAR
========================================= */

function updateSidebarActive(
    page
) {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.page === page
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );

}




    /* =========================================
    SIDEBAR TOGGLE
    ========================================= */

    menuButton.addEventListener(
        "click",
        function () {

            if (window.innerWidth <= 800) {

                /* Mobile */

                sidebar.classList.toggle("open");

            } else {

                /* Desktop */

                sidebar.classList.toggle("collapsed");

            }

        }
    );


    /* =========================================
    LOAD EVIDENCE DATA FROM EXCEL
    ========================================= */

    async function loadEvidenceData() {

        try {
/*
        const response = await fetch(
            "https://docs.google.com/spreadsheets/d/1cKOMleZWg4bmpDZ-mTls_Os4PmFqFsPkINmNl7gMa74/export?format=csv"
        );

        const csvText = await response.text();

        const workbook = XLSX.read(csvText, {
            type: "string"
        });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(worksheet, {
            defval: ""
        });   */
        
    const response = await fetch(
        "https://docs.google.com/spreadsheets/d/1cKOMleZWg4bmpDZ-mTls_Os4PmFqFsPkINmNl7gMa74/export?format=xlsx"
    );

    if (!response.ok) {
        throw new Error("Unable to fetch Google Spreadsheet");
    }

    const excelData = await response.arrayBuffer();

    const workbook = XLSX.read(excelData, {
        type: "array"
    });

/*
    Read data from ALL tabs in the spreadsheet.
*/

    const rows = workbook.SheetNames.flatMap(sheetName => {

        const worksheet = workbook.Sheets[sheetName];

        const sheetRows = XLSX.utils.sheet_to_json(worksheet, {
            defval: ""
        });

        const isAreaTab = /^Area\s*\d+$/i.test(sheetName);

        return sheetRows.map(row => ({
            ...row,

            // Use tab name when Area column is empty
            "Area":
                String(row["Area"] || "").trim() ||
                (isAreaTab ? sheetName : ""),

            // Use tab name as Folder Type for special folders
            "Folder Type":
                String(row["Folder Type"] || "").trim() ||
                (!isAreaTab ? sheetName : "")
        }));
    });


            evidenceData = {};
            allDocuments = [];

            rows.forEach(row => {

            
            const areaText =
                String(row["Area"] || "").trim();

            let areaKey = null;

            if (areaText) {

        const areaNumberMatch =
            areaText.match(/\d+/);

        if (areaNumberMatch) {

        const areaNumber =
            Number(areaNumberMatch[0]);

        areaKey =
            `area${areaNumber}`;

        if (!evidenceData[areaKey]) {

            evidenceData[areaKey] = {
                number: areaNumber,

                title:
                    row["Description"] ||
                    `Area ${areaNumber}`,

                description:
                    row["Description"] ||
                    "",

                documents: []
            };
        }
    }
}

            const documentTitle =
                String(
                    row["Document Title"] || ""
                ).trim();

                const folderType =
                    String(
                        row["Folder Type"] || ""
                    ).trim();

                    const guidelineType =
                String(
                    row["Guideline Type"] || ""
                ).trim();

            const fileLocation =
                String(
                    row["File Location"] || ""
                ).trim();

            const filePath =
                String(
                    row["File Path"] || ""
                ).trim();

            const driveLink =
                String(
                    row["Drive link"] || ""
                ).trim();

            const status =
                String(
                    row["Status"] || ""
                ).trim();

            const dateAdded =
                String(
                    row["Date Added"] || ""
                ).trim();

            const owner =
                String(
                    row["Owner"] || ""
                ).trim();

            let level =
                String(
                    row["Level"] || ""
                ).trim();

            if (!level) {
                level = "Undergraduate";
            }

            if (
                !documentTitle &&
                !driveLink
            ) {
                return;
            }

            let fileType = "FILE";

            const extensionMatch =
                documentTitle.match(
                    /\.([a-zA-Z0-9]+)(?:\)|$)/
                );

            if (extensionMatch) {

                fileType =
                    extensionMatch[1]
                        .toUpperCase();

            }


            const documentData = {
            name: documentTitle,
            type: fileType,
            fileLocation: fileLocation,
            description: filePath,
            url: driveLink,
            status: status,
            dateAdded: dateAdded,
            owner: owner,
            level: level,
            folderType: folderType,
            guidelineType: guidelineType,
            area: areaKey
        };

    /* =========================================
    ADD DOCUMENT
    ========================================= */

    allDocuments.push(documentData);

    /*
        Only add to an Area if this row
        actually has a valid Area.
    */
    if (areaKey && evidenceData[areaKey]) {
        evidenceData[areaKey].documents.push(documentData);
    }

        });

        console.log(
            "Evidence data loaded from Excel:",
            evidenceData
        );

    } catch (error) {

        console.error(
            "Error loading Excel:",
            error
        );

        alert(
            "Unable to load the evidence Excel file. Please check that data/evidence.xlsx exists."
        );

    }

}


/* =========================================
   AUTOMATIC DATA REFRESH
========================================= *//*

async function refreshPortalData() {

    await loadEvidenceData();

    renderAreaCards();
    renderFolderCards();
    updateStatistics();
    createCharts();

    // Refresh currently open page too
    if (currentArea && evidenceData[currentArea]) {
        openArea(currentArea);
    } else if (currentFolder) {
        openFolder(currentFolder);
    }
}

// Refresh every 1 minutes
setInterval(() => {
    if (!document.hidden) {
        refreshPortalData();
    }
}, 1 * 60 * 1000);

*/

/* =========================================
   DARK MODE
========================================= */



    // Apply selected theme.

    function applyTheme(theme) {

        if (theme === "dark") {

            document.body.classList.add(
                "dark-mode"
            );

            themeIcon.className =
                "fa-solid fa-sun";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to light mode"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

            themeIcon.className =
                "fa-solid fa-moon";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark mode"
            );

        }

    }


/* Check saved theme.

    If nothing has been saved,
    use light mode.  */

    const savedTheme =
        localStorage.getItem(
            "upsiTheme"
        );


    if (savedTheme === "dark") {

        applyTheme("dark");

    } else {

        applyTheme("light");

    }



   // Toggle theme.

    themeToggle.addEventListener(
        "click",
        function () {

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            if (isDark) {

                applyTheme("light");

                localStorage.setItem(
                    "upsiTheme",
                    "light"
                );

            } else {

                applyTheme("dark");

                localStorage.setItem(
                    "upsiTheme",
                    "dark"
                );

            }

        }
    );

