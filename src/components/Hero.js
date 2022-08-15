import React from "react"
import { Container, Paper, Typography, Button, Box, Grid } from "@mui/material/"
import Social from "./Social"
import { StaticImage } from "gatsby-plugin-image"

const Hero = () => {
  return (
    <Paper sx={{ height: "90vh", position: "relative" }}>
      <StaticImage
        src="../../static/images/dna-back.jpg"
        alt="DNA helix"
        style={{
          zIndex: 1,
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
      />
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.9)",
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: 2,
        }}
      ></Box>
      <Container
        maxWidth="md"
        sx={{
          height: "100%",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{
            height: "100%",
            zIndex: 100,
            position: "relative",
          }}
        >
          <Grid item sm={8}>
            <Typography variant="h1">I'm Nabil-Fareed</Typography>
            <Typography variant="h5">
              I'm a scientist who writes software. I'm interested in microbes,
              their genomes and how they interact with us. My fields of interest
              include microbial genomics, pathogenesis and bioinformatics.
            </Typography>
            <Grid container spacing={1} my={3}>
              <Grid item>
                <Button href="/science" variant="outlined" color="secondary">
                  Science
                </Button>
              </Grid>
              <Grid item>
                <Button href="/software" variant="outlined" color="secondary">
                  Software
                </Button>
              </Grid>
              <Grid item>
                <Button href="/cv" variant="outlined" color="secondary">
                  CV
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Box
            component={Grid}
            sx={{
              display: { xs: "none", sm: "inline-block" },
            }}
          >
            <Grid item>
              <Social direction="column" />
            </Grid>
          </Box>
        </Grid>
      </Container>
    </Paper>
  )
}

export default Hero
