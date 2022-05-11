import React from "react"
import {
  Container,
  SwipeableDrawer,
  List,
  ListItem,
  Link,
  AppBar,
  Toolbar,
  Divider,
  IconButton,
  Box,
} from "@mui/material/"
import { CssBaseline } from "@mui/material/"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import MenuIcon from "@mui/icons-material/Menu"
import { useState } from "react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about/" },
  { name: "Software", href: "/software/" },
  { name: "Publications", href: "/publications/" },
  { name: "Posts", href: "/posts/" },
  { name: "MicroBinfie Podcast", href: "/microbinfie/" },
]

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <CssBaseline />
      <AppBar position="sticky">
        <Container maxWidth="md">
          <Toolbar disableGutters>
            {navLinks.map(item => (
              <Link
                key={item.name}
                color="textPrimary"
                variant="button"
                underline="none"
                href={item.href}
                sx={{
                  marginRight: 5,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {item.name}
              </Link>
            ))}
            <Box component={Link} sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          <div>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {navLinks.map(item => (
              <ListItem key={item.name}>
                <Link
                  key={item.name}
                  color="textPrimary"
                  variant="button"
                  underline="none"
                  href={item.href}
                >
                  {item.name}
                </Link>
              </ListItem>
            ))}
          </List>
        </SwipeableDrawer>
      </AppBar>
      {children}
    </div>
  )
}

export default Layout
