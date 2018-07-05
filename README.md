## Get started

```
$ npm install
$ npm start
$ graphql playground (if installed)
```

## Example query

```
{
  heroes(where: { type: series }) {
    ...MixedTitle
  }
  hot: heroes(where: { filter: hot }) {
    ...MixedTitle
  }
  popularMovies: heroes(where: { type: movie }) {
    ...MixedTitle
  }
}

fragment MixedTitle on Title {
  ... on Movie {
    ...TitleFields
    duration
  }
  ... on Series {
    ...TitleFields
    seasons {
      seasonNumber
      episodes {
        title
      }
    }
  }
}

fragment TitleFields on Title {
  id
  contentProviders {
    name
  }
  title
  type
}
```
