require(`dotenv`).config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    siteTitle: `Nabil-Fareed Alikhan`,
    siteTitleAlt: `Personal website of Nabil-Fareed Alikhan`,
    siteHeadline: `Personal website of Nabil-Fareed Alikhan`,
    siteUrl: `https://happykhan.com`,
    siteDescription: `Nabil-Fareed Alikhan. Bioinformatician. Microbial genomics. Steams a good ham.`,
    author: `@happy_khan`,
    navigation: [
      {
        title: `Blog`,
        slug: `/blog`,
      },
      {
        title: `About`,
        slug: `/about`,
      },
      {
        title: `Press-media`,
        slug: `/media`,
      },
      {
        title: `Publications`,
        slug: `/publications`,
      },
    ],
    externalLinks: [ 
      {
        name: `Twitter`,
        url: `https://twitter.com/happy_khan`,
      },
      {
        name: `GitHub`,
        url: `https://github.com/happykhan`,
      },
    ],
  },
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-minimal-blog`,
      options: {},
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-34202032-1",
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Happykhan.com - Nabil-Fareed Alikhan`,
        short_name: `happykhan.com`,
        description: `Personal website of Nabil-Fareed Alikhan`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#6B46C1`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-netlify`,
    // `gatsby-plugin-webpack-bundle-analyser-v2`,
  ],
}
