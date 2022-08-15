import React from "react"
import { useSiteMetadata } from "../hooks/use-site-metadata"

const Seo = ({ title, description, pathname, image, children, article }) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    image: defaultImage,
    url,
    twitterUsername,
  } = useSiteMetadata()

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    image: image ? `${url}${image}` : `${url}${defaultImage}`,
    url: pathname ? `${url}${pathname}` : url,
  }
  const ogType = article ? "article" : "website"
  const cardType = seo.image ? "summary_large_image" : "summary"
  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.url && <meta property="og:url" content={seo.url} />}
      <meta property="og:type" content={ogType} />
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}

      <meta name="twitter:card" content={cardType} />
      {url && <meta property="twitter:domain" content={url} />}
      {twitterUsername && (
        <meta name="twitter:site" content={twitterUsername} />
      )}
      {twitterUsername && (
        <meta property="twitter:creator" content={twitterUsername} />
      )}
      {seo.url && <meta property="twitter:url" content={seo.url} />}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
      {children}
    </>
  )
}

export default Seo
