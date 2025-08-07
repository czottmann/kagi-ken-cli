/**
 * @fileoverview Kagi web client for search functionality
 * Clean API for HTTP requests and HTML parsing - ready for npm package extraction
 */

import * as cheerio from "cheerio";

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
  if (!query || typeof query !== "string") {
    throw new Error("Search query is required and must be a string");
  }

  if (!token || typeof token !== "string") {
    throw new Error("Session token is required and must be a string");
  }

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

/**
 * Performs a summarization request on Kagi.com and returns the summary
 *
 * @param {string} input - URL or text to summarize
 * @param {string} token - Kagi session token
 * @param {Object} options - Summarization options
 * @param {string} options.type - Type of summary ("summary" or "takeaway")
 * @param {string} options.language - Target language (2-character code, e.g., "EN")
 * @param {boolean} options.isUrl - Whether input is a URL (true) or text (false)
 * @returns {Promise<Object>} Object containing the summary data
 */
async function performSummarize(input, token, options) {
  if (!input || typeof input !== "string") {
    throw new Error("Input is required and must be a string");
  }

  if (!token || typeof token !== "string") {
    throw new Error("Session token is required and must be a string");
  }

  const { type = "summary", language = "EN", isUrl = false } = options || {};

  if (!["summary", "takeaway"].includes(type)) {
    throw new Error("Type must be 'summary' or 'takeaway'");
  }

  try {
    let response;

    if (isUrl) {
      // GET request for URL summarization
      const url = new URL("https://kagi.com/mother/summary_labs");
      url.searchParams.set("url", input);
      url.searchParams.set("stream", "1");
      url.searchParams.set("target_language", language);
      url.searchParams.set("summary_type", type);

      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/vnd.kagi.stream",
          "Connection": "keep-alive",
          "Cookie": `kagi_session=${token}`,
          "Host": "kagi.com",
          "Pragma": "no-cache",
          "Referer": "https://kagi.com/summarizer",
          "User-Agent": USER_AGENT,
        },
      });
    } else {
      // POST request for text summarization
      const formData = new URLSearchParams();
      formData.set("text", input);
      formData.set("stream", "1");
      formData.set("target_language", language);
      formData.set("summary_type", type);

      response = await fetch("https://kagi.com/mother/summary_labs/", {
        method: "POST",
        headers: {
          "Accept": "application/vnd.kagi.stream",
          "Connection": "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "Cookie": `kagi_session=${token}`,
          "Host": "kagi.com",
          "Pragma": "no-cache",
          "Referer": "https://kagi.com/summarizer",
          "User-Agent": USER_AGENT,
        },
        body: formData,
      });
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid or expired session token");
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Parse streaming response
    const streamData = await response.text();
    const parsedResponse = parseStreamingSummary(streamData);

    // Extract output_data.markdown and return as data.output
    const output = parsedResponse?.output_data?.markdown || "";
    return { data: { output } };
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new Error("Network error: Unable to connect to Kagi");
    }
    throw error;
  }
}

/**
 * Parses streaming summary response to extract and parse the final JSON data
 *
 * @param {string} streamData - Raw streaming response data
 * @returns {Object} Parsed JSON data from the final stream message
 */
function parseStreamingSummary(streamData) {
  try {
    // Split by NUL bytes and get the last non-empty message
    const messages = streamData.split("\x00").filter((msg) => msg.trim());

    if (messages.length === 0) {
      throw new Error("No summary data received");
    }

    const lastMessage = messages[messages.length - 1].trim();

    // Remove "final:" prefix if present
    const jsonString = lastMessage.replace(/^final:/, "").trim();

    if (!jsonString) {
      throw new Error("Empty summary received");
    }

    // Parse JSON response
    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse summary JSON response");
    }
    throw new Error("Failed to parse summary response");
  }
}

export { parseSearchResults, performSearch, performSummarize };
