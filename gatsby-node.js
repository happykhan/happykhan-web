const path = require(`path`)
const postsPerPage = 5

const graphqlQuery = async graphql => {
  return await graphql(`
    {
      mbposts: allMdx(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { tags: { in: "microbinfie" } } }
      ) {
        edges {
          node {
            frontmatter {
              date(formatString: "MMMM D, YYYY")
              title
              link
            }
            slug
            body
          }
        }
      }
      mainposts: allMdx(filter: { frontmatter: { tags: { in: "Posts" } } }) {
        edges {
          node {
            frontmatter {
              date(formatString: "MMMM D, YYYY")
              title
            }
            slug
            body
          }
        }
      }
      mainpages: allMdx(filter: { frontmatter: { tags: { in: "page" } } }) {
        edges {
          node {
            frontmatter {
              title
              tags
            }
            slug
            body
          }
        }
      }
    }
  `)
}

const createPageWrapper = (postArray, postComponent, prefix, createPage) => {
  postArray.forEach((post, index) => {
    const previous =
      index === postArray.length - 1 ? null : postArray[index + 1].node
    const next = index === 0 ? null : postArray[index - 1].node

    createPage({
      path: `${prefix}/${post.node.slug}`,
      component: postComponent,
      context: {
        slug: post.node.slug,
        title: post.node.frontmatter.title,
        body: post.node.body,
        link: post.node.frontmatter.link,
        date: post.node.frontmatter.date,
        previous,
        next,
      },
    })
  })
}

const createListPages = (
  posts,
  thePostsPerPage,
  theComponent,
  prefix,
  createPage
) => {
  const numPages = Math.ceil(posts.length / thePostsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/${prefix}/` : `/${prefix}/${i}`,
      component: theComponent,
      context: {
        limit: thePostsPerPage,
        skip: i * thePostsPerPage,
        numPages: numPages - 1,
        currentPage: i,
      },
    })
  })
}

const getBib = async () => {
  const bibtexParse = require("bibtex-parse-js")
  const fetch = require("node-fetch")

  const googleScholarUrl =
    "https://scholar.googleusercontent.com/citations?view_op=export_citations&user=BpzrleYAAAAJ&citsig=AMD79ooAAAAAYn0KAkYVENDMkUz2gK9X17r1wFv1Poiq&hl=en"
  const response = await fetch(googleScholarUrl)
  const input = await response.text()
  return bibtexParse.toJSON(input)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // Create Publications page
  const bibJson = await getBib()
  const publicationsTemplate = path.resolve(`./src/templates/publications.js`)

  createPage({
    path: "/publications",
    component: publicationsTemplate,
    context: {
      bibJson,
    },
  })

  const allResults = await graphqlQuery(graphql)
  if (allResults.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create the microbinfie posts
  const mbPostTemplate = path.resolve(`./src/templates/mbpost.js`)
  const mbPosts = allResults.data.mbposts.edges
  createPageWrapper(mbPosts, mbPostTemplate, "/microbinfie", createPage)

  // Create the list page for microbinfie posts
  const mbPostListTemplate = path.resolve(`./src/templates/mblist.js`)
  createListPages(
    mbPosts,
    postsPerPage,
    mbPostListTemplate,
    "microbinfie",
    createPage
  )

  // Create the standard blog posts
  const mainPostTemplate = path.resolve(`./src/templates/posts.js`)
  const mainposts = allResults.data.mainposts.edges
  createPageWrapper(mainposts, mainPostTemplate, "/posts", createPage)

  // Create the list page for standard blog posts
  const postlistTemplate = path.resolve(`./src/templates/postlist.js`)
  createListPages(
    mainposts,
    postsPerPage,
    postlistTemplate,
    "posts",
    createPage
  )

  // Create the standard pages
  const mainPageTemplate = path.resolve(`./src/templates/page.js`)
  const mainpages = allResults.data.mainpages.edges
  createPageWrapper(mainpages, mainPageTemplate, "", createPage)
}
