import React from "react"
import Layout from "../components/Layout"
import {
  Card,
  Typography,
  Button,
  Container,
  CardContent,
} from "@mui/material/"
import Seo from "../components/Seo"

const FOF = () => {
  return (
    <Layout>
      <Seo />
      <Container maxWidth="md">
        <Card>
          <CardContent>
            <Typography variant="h3" my={3}>
              404 - Page not found
            </Typography>
            <Typography paragraph>
              This page has been recently moved or deleted.
            </Typography>
            <Button key="home" href="/">
              Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  )
}

export default FOF
