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
  Box,
  Modal,
  Button,
  Link,
  Tooltip,
} from "@mui/material/"
import Seo from "../components/Seo"
import { useLocation } from "@reach/router"

export const Head = () => {
  const location = useLocation()
  return <Seo title="My Publications" pathname={location.pathname} />
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  maxHeight: "75vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "scroll",
  p: 4,
}

const PubItem = ({
  title,
  author,
  year,
  journal = "",
  volume,
  number,
  pages,
  abstract,
  pmid,
  doi,
  url,
  type,
}) => {
  const firstAuthor = author.split(",")[0]
  const safeDoi = doi.replace(/\//g, "_")
  const doilink = "https://doi.org/" + doi
  const pdfFilename = `${firstAuthor
    .toLowerCase()
    .replace(" ", "")}-${year}-${safeDoi}.pdf`
  const pdfLink = "/papers/" + encodeURIComponent(pdfFilename)
  const onlineLink = `https://pubmed.ncbi.nlm.nih.gov/${pmid}`
  const safeTitle = title
    .replace(/[}{\\$]/g, "")
    .replace(/textit/g, "")
    .replace(/textrm/g, "")
  // Modal popup
  const pdfText = `Download pdf: ${pdfFilename}`
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Card key={safeDoi}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {safeTitle}
        </Typography>
        <Typography variant="body1">
          {author.split(",")[0]} et al. ({year}) {journal} {volume}
          {number && `:${number} `}
          {pages && pages.replace("--", "-")}
          {type === "preprint" && " PREPRINT"}
        </Typography>
        <Button onClick={handleOpen}>Read More</Button>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6" component="h2">
              {safeTitle}
            </Typography>
            <Typography variant="body2">
              {author.split("and").length < 40
                ? author.replace(" and ", " ")
                : author.split(",")[0] + " et al."}
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              {journal} ({year}) {volume}
              {number && `:${number} `}
              {pages && " " + pages.replace("--", "-")}
              {type === "preprint" && " PREPRINT "}
              {type === "preprint" && <Link href={url}>{url}</Link>}
            </Typography>
            {doi && <Button href={doilink}>Online link</Button>}
            {pmid && <Button href={onlineLink}>PubMed link</Button>}
            <Tooltip title={pdfText}>
              <Button href={pdfLink}>
                <PictureAsPdfIcon />
              </Button>
            </Tooltip>
            <Typography sx={{ mt: 2 }}>{abstract}</Typography>
          </Box>
        </Modal>
        {doi && <Button href={doilink}>Online link</Button>}
        {pmid && <Button href={onlineLink}>PubMed link</Button>}
        <Tooltip title={pdfText}>
          <Button href={pdfLink}>
            <PictureAsPdfIcon />
          </Button>
        </Tooltip>
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
      <Container maxWidth="md">
        <Typography variant="h3" my={3} gutterBottom>
          Publications ({bibJson.length})
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              key="textSearch"
              id="outlined-basic"
              label="Search by title, year, journal or abstract"
              variant="outlined"
              fullWidth
              onChange={e => setFilterText(e.target.value)}
            />
          </Grid>
          {bibJson
            .filter(
              record =>
                record.entryTags.title
                  .toLowerCase()
                  .includes(filterText.toLowerCase()) ||
                (record.entryTags.journal &&
                  record.entryTags.journal
                    .toLowerCase()
                    .includes(filterText.toLowerCase())) ||
                record.entryTags.year
                  .toLowerCase()
                  .includes(filterText.toLowerCase()) ||
                (record.entryTags.abstract &&
                  record.entryTags.abstract
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
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
