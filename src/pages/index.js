import React from "react"
import Hero from "../components/Hero"
import Layout from "../components/Layout"
import Seo from "../components/Seo"

export const Head = () => {
  return <Seo />
}

const Home = () => (
  <Layout>
    <Hero />
  </Layout>
)

export default Home
