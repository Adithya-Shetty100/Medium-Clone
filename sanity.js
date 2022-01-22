import {
    groq,
    createClient,
    createImageUrlBuilder,
    createPortableTextComponent,
    createPreviewSubscriptionHook,
    createCurrentUserHook,
  } from "next-sanity";
  
  export const config = {
    /**
     * Find your project ID and dataset in `sanity.json` in your studio project.
     * These are considered “public”, but you can use environment variables
     * if you want differ between local dev and production.
     *
     * https://nextjs.org/docs/basic-features/environment-variables
     **/
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-03-25",
    useCdn: process.env.NODE_ENV === "production",
    /**
     * Set useCdn to `false` if your application require the freshest possible
     * data always (potentially slightly slower and a bit more expensive).
     * Authenticated request (like preview) will always bypass the CDN
     **/
  };

//   https://blog.surjithctly.in/how-to-setup-sanity-cms-with-nextjs-and-tailwindcss

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);  

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * In sanity while querying img, some weird details we get, so this function takes those assets and details and 
 * gives image url back. This is done by  helper function
 * Read more: https://www.sanity.io/docs/image-url
 **/
 export const urlFor = (source) => createImageUrlBuilder(config).image(source);

 // Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config);