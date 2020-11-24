exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /@vds/,
              use: loaders.null()
            },
            {
              test: /@vds-core/,
              use: loaders.null()
            }
          ],
        },
      })
    }
  }