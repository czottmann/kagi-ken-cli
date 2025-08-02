/**
 * @fileoverview Search functionality for Kagi.com
 * Handles HTTP requests and HTML parsing to extract search results.
 */

const cheerio = require("cheerio");
const fs = require("fs");

/**
 * User agent string for Kagi requests
 */
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15";

/**
 * Performs a search on Kagi.com and returns structured results
 *
 * @param {string} query - Search query
 * @param {string} token - Kagi session token
 * @returns {Promise<Object>} Object containing data array with search results and related searches
 */
async function performSearch(query, token) {
  try {
    const response = await fetch(
      `https://kagi.com/html/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
          "Cookie": `kagi_session=${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid or expired session token");
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const results = parseSearchResults(html);
    return { data: results };
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new Error("Network error: Unable to connect to Kagi");
    }
    throw error;
  }
}

/**
 * Parses HTML content to extract search results
 *
 * @param {string} html - HTML content from Kagi search page
 * @returns {Array} Array of search results and related searches
 */
function parseSearchResults(html) {
  const $ = cheerio.load(html);
  const results = [];

  try {
    // Extract main search results
    $(".search-result").each((_, element) => {
      const result = extractSearchResult($, element);
      if (result) {
        results.push(result);
      }
    });

    // Extract grouped sub-results
    $(".sr-group .__srgi").each((_, element) => {
      const result = extractGroupedResult($, element);
      if (result) {
        results.push(result);
      }
    });

    // Extract related searches
    const relatedSearches = extractRelatedSearches($);
    if (relatedSearches.length > 0) {
      results.push({
        t: 1,
        list: relatedSearches,
      });
    }

    return results;
  } catch (error) {
    throw new Error(
      "Failed to parse search results - unexpected HTML structure",
    );
  }
}

/**
 * Extracts a single search result from a search-result element
 *
 * @param {CheerioAPI} $ - Cheerio instance
 * @param {CheerioElement} element - Search result element
 * @returns {Object|null} Parsed search result or null if invalid
 */
function extractSearchResult($, element) {
  try {
    const $element = $(element);

    // Extract title and URL
    const titleLink = $element.find(".__sri_title_link").first();
    const title = titleLink.text().trim();
    const url = titleLink.attr("href");

    // Extract snippet
    const snippet = $element.find(".__sri-desc").text().trim();

    if (!title || !url) {
      return null;
    }

    return {
      t: 0,
      url: url,
      title: title,
      snippet: snippet || "",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extracts a grouped search result from a __srgi element
 *
 * @param {CheerioAPI} $ - Cheerio instance
 * @param {CheerioElement} element - Grouped result element
 * @returns {Object|null} Parsed search result or null if invalid
 */
function extractGroupedResult($, element) {
  try {
    const $element = $(element);

    // Extract title and URL
    const titleLink = $element.find(".__srgi-title a").first();
    const title = titleLink.text().trim();
    const url = titleLink.attr("href");

    // Extract snippet
    const snippet = $element.find(".__sri-desc").text().trim();

    if (!title || !url) {
      return null;
    }

    return {
      t: 0,
      url: url,
      title: title,
      snippet: snippet || "",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extracts related search terms
 *
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {Array<string>} Array of related search terms
 */
function extractRelatedSearches($) {
  const relatedSearches = [];

  try {
    $(".related-searches a span").each((_, element) => {
      const term = $(element).text().trim();
      if (term) {
        relatedSearches.push(term);
      }
    });
  } catch (error) {
    // Return empty array if parsing fails
  }

  return relatedSearches;
}

module.exports = {
  performSearch,
  parseSearchResults,
};
