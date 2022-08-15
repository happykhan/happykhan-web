import React from "react"
import { GitHub, Twitter, LinkedIn } from "@mui/icons-material/"
import { Link, Grid, IconButton } from "@mui/material/"

const socialItems = [
  { icon: GitHub, url: "https://github.com/happykhan" },
  { icon: Twitter, url: "https://twitter.com/happy_khan" },
  { icon: LinkedIn, url: "https://www.linkedin.com/in/nabil-fareed-alikhan/" },
]

const Social = ({ direction }) => {
  return (
    <Grid container direction={direction || "row"} spacing={1}>
      {socialItems.map((item, index) => (
        <Grid item key={`social-grid-${index}`}>
          <Link href={item.url}>
            <IconButton>
              <item.icon />
            </IconButton>
          </Link>
        </Grid>
      ))}
    </Grid>
  )
}

export default Social
