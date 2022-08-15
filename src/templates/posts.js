import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import { Container, Typography, Link, darkScrollbar } from "@mui/material/"
import Seo from "../components/Seo"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { graphql } from "gatsby"
import { useLocation } from "@reach/router"

export const Head = ({ pageContext, data }) => {
  const { title } = pageContext
  const description = data.allMdx.edges[0].node.excerpt
  const location = useLocation()
  const banner = getImage(
    data.allMdx.edges[0].node.frontmatter.bannerImage.childImageSharp
  )
  console.log(banner.images.fallback.src)
  return (
    <Seo
      title={title}
      description={description}
      image={banner.images.fallback.src}
      pathname={location.pathname}
    />
  )
}

const Post = ({ pageContext, data }) => {
  const { title, body, date, bannerDesc } = pageContext
  const bannerAlt = bannerDesc ? bannerDesc : "No description"
  const banner = getImage(
    data.allMdx.edges[0].node.frontmatter.bannerImage.childImageSharp
  )
  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h3" my={3}>
          {title}
        </Typography>
        <Typography variant="subtitle-1" sx={{ fontStyle: "bold" }}>
          Posted on {date}
        </Typography>
        <Typography my={3} component={"span"}>
          {data.allMdx.edges[0].node.frontmatter.bannerImage && (
            <GatsbyImage image={banner} alt={bannerAlt} />
          )}
        </Typography>
        <MDXRenderer>{body}</MDXRenderer>
        <Typography my={3} paragraph>
          Questions or comments? @ me on Twitter
          <Link href="https://twitter.com/happy_khan"> @happy_khan</Link>
        </Typography>
        {bannerDesc && (
          <Typography
            variant="subtitle-1"
            my={3}
            paragraph
            sx={{ fontStyle: "italic" }}
          >
            The banner image is {bannerDesc}
          </Typography>
        )}
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query bannerQuery($title: String) {
    allMdx(filter: { frontmatter: { tags: {}, title: { eq: $title } } }) {
      edges {
        node {
          excerpt(pruneLength: 200)
          frontmatter {
            bannerImage {
              publicURL
              childImageSharp {
                gatsbyImageData(
                  width: 800
                  height: 300
                  placeholder: BLURRED
                  formats: [AUTO, PNG, WEBP, AVIF]
                )
              }
            }
          }
        }
      }
    }
  }
`

export default Post
