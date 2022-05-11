/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `Happykhan.com - Nabil-Fareed Alikhan`,
    short_name: `happykhan.com`,
    description: `Personal website of Nabil-Fareed Alikhan. Bioinformatician. Microbial genomics.`,
    url: `https://happykhan.com`,
    twitterUsername: `@happy_khan`,
    image: "/images/Nabil-FareedAlikhan-portSQ.jpg",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `microbinfie`,
        path: `${__dirname}\\content\\microbinfie`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `posts`,
        path: `${__dirname}\\content\\posts`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `pages`,
        path: `${__dirname}\\content\\pages`,
      },
    },
    "gatsby-plugin-mdx",
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "UA-34202032-1", // Google Analytics / GA
        ],
      },
    },
  ],
}
