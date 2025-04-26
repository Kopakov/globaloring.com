import algoliasearch from "algoliasearch/lite";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

if (!appId || !searchKey) {
  throw new Error("Missing Algolia environment variables");
}

export const searchClient = algoliasearch(appId, searchKey);
export const ALGOLIA_INDEX_NAME = "products"; // Change this to match your index name 