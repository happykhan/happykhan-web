import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import { Container, Typography } from "@mui/material/"
import Seo from "../components/Seo"

const Post = ({ pageContext }) => {
  const { title, body, date } = pageContext
  return (
    <Layout>
      <Seo title={title} />
      <Container maxWidth="md">
        <Typography variant="h3" my={3}>
          {title}
        </Typography>
        <Typography variant="subtitle-1">Posted on {date}</Typography>
        <MDXRenderer>{body}</MDXRenderer>
      </Container>
    </Layout>
  )
}

export default Post
