# Downpour

downpour_js is a TypeScript/Deno port of the [Swift library of the same name](https://github.com/markmals/Downpour).

Downpour can gather the following from a raw video name:

* TV or movie title
* Year of release
* TV season number
* TV episode number

**Note:** None of the fields are guaranteed to be there or even picked up, since it's kind of hard to extract metadata from file names with only a few clever regular expressions. Please open an issue if you know the data is there, but it's not being picked up. Pull requests are welcome, as well. This also means a lot of members are optional, so be sure to check that the property isn't undefined or nullish coalescing operator (`??`) to program safely 😄

## Usage

Using Downpour is easy. Just create a new instance and it'll do the rest.

```typescript
import Downpour from "https://deno.land/x/downpour/mod.ts"

const metadata = new Downpour("filenameWithoutExtension")

const title = metadata.title
const year = metadata.year

if (metadata.type === "tv") {
    const season = metadata.season
    const episode = metadata.episode
}

const plexName = metadata.basicPlexName
```
