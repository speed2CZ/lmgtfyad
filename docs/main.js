const isLocal = window.location.hostname === "localhost" || window.location.hostname === "";
const baseURL = isLocal ? "http://localhost:3020/api" : "https://lmgtfyad.onrender.com/api";
const fileName = "vysledky_hledani";
let lastQuery = "";
let lastResults = [];

// Add event listeners for searching
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("query");
    const button = document.getElementById("search-button");

    // Focus the line input
    input.focus();

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    button.addEventListener("click", performSearch);
});

/**
 * Calls backend API to search the Google
 * 
 * Displays the search results, or an error text.
 */
async function performSearch() {
    const button = document.getElementById("search-button");
    const query = document.getElementById("query").value.trim();
    if (!query) return alert("Prosím vložte text pro vyhledávání.");

    lastQuery = query;
    const container = document.getElementById("results-container");
    container.innerHTML = "Načítání...";
    document.getElementById("download-section").style.display = "none";
    button.disabled = true;

    try {
        const res = await fetch(`${baseURL}/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = "<p>Nic nenalezeno.</p>";
            return;
        }

        // Save the search result to allow downloading later
        lastResults = data;

        container.innerHTML = "";

        // Add the items from the search result
        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "result";
            div.innerHTML = `
        <h3><a href="${item.link}" target="_blank">${item.htmlTitle}</a></h3>
        <p>${item.htmlSnippet}</p>
      `;
            container.appendChild(div);
        });

        document.getElementById("download-section").style.display = "block";
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color:red;">Chyba při hledání.</p>';
    }

    button.disabled = false;
}

// Input event to trigger file download with the search results.
document.getElementById("download-btn").addEventListener("click", () => {
    const format = document.getElementById("format").value;
    if (!lastResults || lastResults.length === 0) return alert("Žádná data ke stažení.");
    downloadResults(format);
});

/**
 * Helper function to format XML
 * @param {String} str 
 * @returns 
 */
function escapeXML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/**
 * Converts the search results into the requested format and downloads it as a file.
 */
function downloadResults(format) {
    let dataStr = "";
    let mimeType = "application/octet-stream";
    let extension = format;

    switch (format) {
        case "json":
            dataStr = JSON.stringify(lastResults, null, 2);
            mimeType = "application/json";
            break;

        case "csv":
            const csvHeader = Object.keys(lastResults[0]).join(",");
            const csvRows = lastResults.map(row =>
                Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
            );
            dataStr = [csvHeader, ...csvRows].join('\n');
            mimeType = "text/csv";
            break;

        case "ndjson":
            dataStr = lastResults.map(item => JSON.stringify(item)).join("\n");
            mimeType = "application/x-ndjson";
            break;

        case "xml":
            dataStr = "<results>\n" + lastResults.map(item => (
                "  <result>\n" +
                Object.entries(item).map(([key, val]) => `    <${key}>${escapeXML(val)}</${key}>`).join("\n") +
                "\n  </result>"
            )).join('\n') + "\n</results>";
            mimeType = "application/xml";
            break;

        default:
            alert("Neznámý formát.");
            return;
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
}
