/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */
const path = require(`path`)

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
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `microbinfie`,
        path: path.join(__dirname, "content", "microbinfie"),
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `posts`,
        path: path.join(__dirname, "content", "posts"),
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `pages`,
        path: path.join(__dirname, "content", "pages"),
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
        ],
        plugins: [`gatsby-remark-images`],
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "UA-34202032-1", // Google Analytics / GA
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                url
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.url + "/posts/" + node.slug,
                  guid: site.siteMetadata.url + node.slug,
                })
              })
            },
            query: `
              {
                allMdx(
                  sort: {order: DESC, fields: [frontmatter___date]}
                  filter: {frontmatter: {tags: {in: "Posts"}}}
                ) {
                  nodes {
                    frontmatter {
                      date
                      title
                      tags
                    }
                    excerpt(pruneLength: 500)
                    slug
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Happykhan.com RSS Feed",
          },
        ],
      },
    },
  ],
}
