import React from "react"
import { graphql } from "gatsby"
import {
  Card,
  Grid,
  Container,
  Typography,
  CardContent,
  Button,
  Link,
} from "@mui/material/"
import Layout from "../components/Layout"
import Seo from "../components/Seo"
import { useLocation } from "@reach/router"

export const Head = ({ pageContext }) => {
  const { currentPage } = pageContext
  const location = useLocation()

  return (
    <Seo
      title={`Blog posts, page ${currentPage + 1}`}
      pathname={location.pathname}
    />
  )
}

const PostItem = ({ excerpt, frontmatter, slug }) => {
  const url = `/posts/${slug}`
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" paragraph>
            <Link href={url} underline="hover">
              {frontmatter.title}
            </Link>
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {excerpt}
          </Typography>
          <Button href={url}>Read more</Button>
        </CardContent>
      </Card>
    </div>
  )
}

const PostList = ({ pageContext, data }) => {
  const { currentPage, numPages } = pageContext

  const isFirst = currentPage === 0
  const isLast = currentPage === numPages
  const prevPage =
    currentPage - 1 === 0 ? "/posts/" : "/posts/" + (currentPage - 1).toString()
  const nextPage = "/posts/" + (currentPage + 1).toString()

  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h3" my={3} gutterBottom>
          Posts
        </Typography>
        <Grid container spacing={3}>
          {data.allMdx.edges.map(element => (
            <Grid item>
              <PostItem key={element.node.id} {...element.node} />
            </Grid>
          ))}
          <Grid item>
            {!isFirst && (
              <Button href={prevPage} rel="prev">
                ← Previous Page
              </Button>
            )}
            {!isLast && (
              <Button href={nextPage} rel="next">
                Next Page →
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query postListQuery($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { tags: { in: "Posts" } } }
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          slug
          id
          excerpt
        }
      }
    }
  }
`
export default PostList
