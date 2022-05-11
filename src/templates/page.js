import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import { Container, Card, CardContent, Typography } from "@mui/material/"
import Seo from "../components/Seo"
const Page = ({ pageContext }) => {
  const { title, body } = pageContext
  return (
    <Layout>
      <Seo title={title} />
      <Container maxWidth="md">
        <Card>
          <CardContent>
            <Typography variant="h3">{title}</Typography>
            <MDXRenderer>{body}</MDXRenderer>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  )
}

export default Page
