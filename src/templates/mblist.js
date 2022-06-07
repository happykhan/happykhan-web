import React from "react"
import { graphql } from "gatsby"
import {
  Container,
  Card,
  Avatar,
  Grid,
  AvatarGroup,
  Typography,
  Button,
  CardContent,
  Link,
  Tooltip,
} from "@mui/material/"
import Layout from "../components/Layout"
import HeadphonesIcon from "@mui/icons-material/Headphones"
import Seo from "../components/Seo"

const MbItem = ({ excerpt, frontmatter, slug }) => {
  const url = `/microbinfie/${slug}`
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <Link underline="hover" href={url}>
              {frontmatter.title.replace("MicroBinfie Podcast,", "")}
            </Link>
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {excerpt}
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Button href={url}>Read More</Button>
            </Grid>
            <Grid item>
              <Tooltip key="listentome" title="Listen on SoundCloud">
                <Link href={frontmatter.link}>
                  <HeadphonesIcon />
                </Link>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

const bios = {
  nabil:
    "Dr Nabil-Fareed Alikhan: Bioinformatician with Andrew Page. Interested in Enteric pathogens.",
  lee: "Dr Lee Katz: Public health bioinformatics scientist. Author of Mashtree, Lyve-SET, Fasten, and others.",
  andrew:
    "Dr Andrew Page: Head of Informatics at The Quadram, currently doing SARS-CoV-2 genomics/bioinformatics.",
}

const Mblist = ({ pageContext, data }) => {
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 0
  const isLast = currentPage === numPages
  const prevPage =
    currentPage - 1 === 0
      ? "/microbinfie/"
      : "/microbinfie/" + (currentPage - 1).toString()
  const nextPage = "/microbinfie/" + (currentPage + 1).toString()

  const [text, setText] = React.useState("Meet the hosts! (mouse over)")
  const handleTooltipOpen = bio => {
    setText(bio)
  }
  return (
    <Layout>
      <Seo title="Microbial Bioinformatics Podcast" />
      <Container maxWidth="md">
        <Typography my={3} variant="h3" component="h1" gutterBottom>
          Microbial Bioinformatics Podcast
        </Typography>
        <Typography paragraph>
          Microbial Bioinformatics is a rapidly changing field marrying computer
          science and microbiology. Join us as we share some tips and tricks
          we’ve learnt over the years. If you’re student just getting to grips
          to the field, or someone who just wants to keep tabs on the latest and
          greatest - this podcast is for you.
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <AvatarGroup key="avgroup">
              <Tooltip key="NFAT" title="Hi there!" placement="top">
                <Button
                  key="NFAB"
                  onMouseOver={() => {
                    handleTooltipOpen(bios.nabil)
                  }}
                >
                  <Avatar
                    key="NFA"
                    alt="Nabil-Fareed Alikhan"
                    src="/images/Nabil-FareedAlikhan-portSQ.jpg"
                    sx={{ height: "100px", width: "100px" }}
                  />
                </Button>
              </Tooltip>
              <Tooltip key="LKT" title="Hi there!" placement="top">
                <Button
                  key="LKB"
                  onMouseOver={() => {
                    handleTooltipOpen(bios.lee)
                  }}
                >
                  <Avatar
                    key="LK"
                    alt="Lee Katz"
                    src="/images/lskatz.jpg"
                    sx={{ height: "100px", width: "100px" }}
                  />
                </Button>
              </Tooltip>
              <Tooltip key="APT" title="Hi there!" placement="top">
                <Button
                  key="APB"
                  onMouseOver={() => {
                    handleTooltipOpen(bios.andrew)
                  }}
                >
                  <Avatar
                    key="AP"
                    alt="Andrew Page"
                    src="/images/apage.jpg"
                    sx={{ height: "100px", width: "100px" }}
                  />
                </Button>
              </Tooltip>
            </AvatarGroup>
            <Grid item>
              <Typography
                key="tyk"
                variant="subtitle2"
                align="right"
                paragraph
                mt={2}
              >
                {text}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {data.allMdx.edges.map(element => (
            <Grid item>
              <MbItem key={element.node.id} {...element.node} />
            </Grid>
          ))}
          <Grid item>
            {!isFirst && (
              <Button key="prev" href={prevPage} rel="prev">
                ← Previous Page
              </Button>
            )}
            {!isLast && (
              <Button key="next" href={nextPage} rel="next">
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
  query mbListQuery($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
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
          id
          excerpt
        }
      }
    }
  }
`
export default Mblist
