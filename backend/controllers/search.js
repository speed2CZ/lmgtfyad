//@ts-check
import expressAsyncHandler from "express-async-handler";

/**
 * Search Google for results, limited to 1 page (10 items)
 * https://developers.google.com/custom-search/v1/overview
 */
const searchViaGoogleAPI = expressAsyncHandler(async (req, res) => {
    console.log("searchGoogleAPI");
    const { query } = req.query;
    if (!query || query === "") {
        res.status(400);
        throw new Error(`Search request missing query.`);
    }
    console.log(`Searching for: ${query}`);

    const G_ID = process.env.GOOGLE_SEARCH_ID;
    const G_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;

    if (!G_ID || !G_API_KEY) {
        console.error("searchViaGoogleAPI: Google search ID or KEY is not loaded");
        throw new Error(`Server is unable to search.`);
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${G_ID}&key=${G_API_KEY}&num=10&start=1`;
    var searchResult = await fetch(url);
    if (!searchResult.ok) {
        throw new Error(`Search request failed.`);
    }

    const data = await searchResult.json();
    //console.log(data);

    // Strip down "pagemap" and "customsearch" from the result. Set empty string as default for values.
    const result = [];
    data.items.forEach(element => {
        result.push({
            "title": element.title || "",
            "htmlTitle": element.htmlTitle || "",
            "link": element.link || "",
            "displayLink": element.displayLink || "",
            "snippet": element.snippet || "",
            "htmlSnippet": element.htmlSnippet || "",
            "formattedUrl": element.formattedUrl || "",
            "htmlFormattedUrl": element.htmlFormattedUrl || "",
        })
    });

    res.status(200).json(result);
});

export {
    searchViaGoogleAPI,
};
