module.exports = {
  siteMetadata: {
    title: `Verizon Open Source`,
    description: `Home of the Open Source Program Office and Verizon specific documenting for working with OSS`,
    author: `opensource@verizon.com`,
    siteUrl: `https://verizon.github.io`,
    keywords: [`opensource`, `verizon`, `Verizon`, `OSS`, `OSPO`],
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://verizon.github.io`,
        sitemap: `https://verizon.github.io/sitemap/sitemap-index.xml`,
        policy: [{ userAgent: `*`, allow: `/` }],
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `fonts`,
        path: `${__dirname}/src/fonts`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `verizon.github.io`,
        short_name: `verizon.github.io`,
        background_color: `#FFF`,
        theme_color: `#612578`,
        display: `minimal-ui`,
        icon: `src/images/favicon-180x180.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-gatsby-cloud`
  ],
}
