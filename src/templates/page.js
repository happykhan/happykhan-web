import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import { Container, Card, CardContent, Typography } from "@mui/material/"
import Seo from "../components/Seo"
import { useLocation } from "@reach/router"

export const Head = ({ pageContext }) => {
  const location = useLocation()
  return <Seo title={pageContext.title} pathname={location.pathname} />
}

const Page = ({ pageContext }) => {
  const { title, body } = pageContext
  return (
    <Layout>
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
