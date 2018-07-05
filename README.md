```
npm install
npm start
```

```
{
  heroes {
    ...MixedTitle
  }
  hot: heroes {
    ...MixedTitle
  }
  popular: heroes {
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
