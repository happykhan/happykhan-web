import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Code from "./Code"

const components = {
  pre: props => <Code {...props} />,
}

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={components}>{element}</MDXProvider>
}
