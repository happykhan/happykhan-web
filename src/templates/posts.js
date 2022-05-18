import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import { Container, Typography, Link } from "@mui/material/"
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
        <Typography my={3} paragraph>
          Questions or comments? @ me on Twitter
          <Link href="https://twitter.com/happy_khan"> @happy_khan</Link>
        </Typography>
      </Container>
    </Layout>
  )
}

export default Post
