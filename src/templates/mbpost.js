import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import { Button, Container } from "@mui/material/"
import Seo from "../components/Seo"
import { useLocation } from "@reach/router"

const makeSCiframe = (
  link,
  width = "100%",
  height = 200,
  color = "#ff5500",
  autoplay = false
) => {
  let frame = "EGG "
  if (
    /https:\/\/soundcloud\.com\/([A-Za-z0-9-_]*)\/(sets\/|)([A-Za-z0-9-_]*)/.test(
      link
    )
  ) {
    const soundcloudURL = link.replace(/(http|https)/, "")
    if (
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(
        soundcloudURL
      )
    ) {
      frame = `<iframe width="${width}" height="${height}" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${encodeURI(
        soundcloudURL
      )}&color=${color.replace(
        "#",
        "%23"
      )}&auto_play=${autoplay.toString()}&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"></iframe>`
    }
  }
  return (
    <div
      className="Container"
      dangerouslySetInnerHTML={{ __html: frame }}
    ></div>
  )
}

export const Head = ({ pageContext }) => {
  const { title } = pageContext
  const location = useLocation()
  return <Seo title={title} description={title} pathname={location.pathname} />
}

const Mbpost = ({ pageContext }) => {
  const { title, body, date, link } = pageContext
  const sFrame = makeSCiframe(link)
  return (
    <Layout>
      <Container maxWidth="md">
        <h1>{title}</h1>
        <p>Released on {date}</p>
        <Button href={"/microbinfie"}>Back to episode list</Button>
        {sFrame}
        <MDXRenderer>{body}</MDXRenderer>
        
      </Container>
    </Layout>
  )
}

export default Mbpost
