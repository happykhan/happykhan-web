import React from "react"
import Layout from "../components/Layout"
import {
  Card,
  Grid,
  Container,
  Typography,
  CardContent,
  Link,
  Button,
} from "@mui/material/"
import Seo from "../components/Seo"

const softwareList = [
  {
    title: "Enterobase",
    description:
      "EnteroBase aims to establish a world-class, one-stop, user-friendly, backwards-compatible but forward-looking genome database, Enterobase – together with a set of web-based tools, EnteroBase Backend Pipeline – to enable bacteriologists to identify, analyse, quantify and visualise genomic variation",
    url: "https://enterobase.warwick.ac.uk/",
  },
  {
    title: "GrapeTree",
    description:
      "GrapeTree is a stand-alone program that provides bioinformaticians with a tool for rapidly investigating the relationships of genomes of interest by NJ or minimal spanning trees of SNPs or MLST data. ",
    url: "https://github.com/achtman-lab/GrapeTree",
  },
  {
    title: "BLAST Ring Image Generator (BRIG)",
    description:
      "BRIG is a free cross-platform (Windows/Mac/Unix) application that can display circular comparisons between a large number of genomes, with a focus on handling genome assembly data. ",
    url: "http://brig.sourceforge.net/",
  },
]

const Software = () => {
  return (
    <Layout>
      <Seo title="My software" />
      <Container maxWidth="md">
        <Typography variant="h3" my={3} gutterBottom>
          Software
        </Typography>
        <Grid container spacing={3}>
          {softwareList.map(element => (
            <Grid item>
              <Card>
                <CardContent>
                  <Link href={element.url} underline="hover">
                    <Typography variant="h5">{element.title}</Typography>
                  </Link>
                  <Typography variant="subtitle1" paragraph>
                    {element.description}
                  </Typography>
                  <Button href={element.url}>Visit website</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  )
}

export default Software
