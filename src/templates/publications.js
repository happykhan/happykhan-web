import React, { useState } from "react"
import Layout from "../components/Layout"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"

import {
  Card,
  Grid,
  Container,
  Typography,
  CardContent,
  TextField,
  Button,
} from "@mui/material/"
import Seo from "../components/Seo"

const PubItem = ({
  citationKey,
  title,
  author,
  year,
  journal,
  volume,
  number,
  pages,
}) => {
  const pdfLink = `/papers/${citationKey}.pdf`
  const onlineLink = `https://pubmed.ncbi.nlm.nih.gov/?term=${title}`
  const prePrints = ["medrxiv", "preprints", "biorxiv", "arxiv"]

  return (
    <Card key={title}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography variant="body1">
          {author.split(",")[0]} et al. ({year}) {journal} {volume}
          {number && `:${number} `}
          {pages && pages.replace("--", "-")}
          {prePrints.includes(journal.toLowerCase()) && " [PREPRINT]"}
        </Typography>
        <Button href={pdfLink}>
          <PictureAsPdfIcon />
        </Button>
        {prePrints.includes(journal.toLowerCase()) ? (
          ""
        ) : (
          <Button href={onlineLink}>PubMed link</Button>
        )}
      </CardContent>
    </Card>
  )
}

const Publications = ({ pageContext }) => {
  const [filterText, setFilterText] = useState("")
  const { bibJson } = pageContext
  const pubCompare = (a, b) => {
    if (a.entryTags.year === b.entryTags.year) {
      const firstAuthor = a.entryTags.author.split(",")[0].toLowerCase()
      const bFirstAuthor = b.entryTags.author.split(",")[0].toLowerCase()
      if (firstAuthor === bFirstAuthor) {
        return 0
      }
      return firstAuthor < bFirstAuthor ? -1 : 1
    }
    return a.entryTags.year < b.entryTags.year ? 1 : -1
  }
  return (
    <Layout>
      <Seo title="My Publications" />
      <Container maxWidth="md">
        <Typography variant="h3" my={3} gutterBottom>
          Publications ({bibJson.length})
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              key="textSearch"
              id="outlined-basic"
              label="Search by title, year or journal"
              variant="outlined"
              fullWidth
              onChange={e => setFilterText(e.target.value)}
            />
          </Grid>
          {bibJson
            .filter(record => record.entryTags.journal)
            .filter(
              record =>
                record.entryTags.title
                  .toLowerCase()
                  .includes(filterText.toLowerCase()) ||
                record.entryTags.journal
                  .toLowerCase()
                  .includes(filterText.toLowerCase()) ||
                record.entryTags.year
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
            )
            .sort(pubCompare)
            .map((record, index) => (
              <Grid item xs={12}>
                <PubItem
                  key={record.citationKey}
                  citationKey={record.citationKey}
                  {...record.entryTags}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Layout>
  )
}

export default Publications
