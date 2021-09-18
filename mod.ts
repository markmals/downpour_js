import { cleanString, pad } from "./utilities.ts"

const PATTERN = {
    pretty: /S(\d{4}|\d{1,2})[\-\.\s_]?E\d{1,2}/i,
    tricky: /[^\d](\d{4}|\d{1,2})[X\-\.\s_]\d{1,2}([^\d]|$)/i,
    combined: /(?:S)?(\d{4}|\d{1,2})[EX\-\.\s_]\d{1,2}([^\d]|$)/i,
    altSeason: /Season (\d{4}|\d{1,2}) Episode \d{1,2}/i,
    altSeasonSingle: /Season (\d{4}|\d{1,2})/i,
    altEpisodeSingle: /Episode \d{1,2}/i,
    altSeason2: /[\s_\.\-\[]\d{3}[\s_\.\-\]]/i,
    year: /[\(?:\.\s_\[](?:19|(?:[2-9])(?:[0-9]))\d{2}[\]\s_\.\)]/i
}

const SPLIT_CHARSET = /e|E|x|X|-|\.|_/

export type MediaType = "movie" | "tv"

export default class Downpour {
    private rawString: string

    public constructor(name: string) {
        this.rawString = name
    }

    public get description(): string {
        const titleDesc = `Title: ${this.title}\n`
        let episodeDesc = ""
        let seasonDesc = ""
        let yearDesc = ""

        if (this.episode) episodeDesc = `Episode: ${this.episode}\n`
        if (this.season) seasonDesc = `Season: ${this.season}\n`
        if (this.year) yearDesc = `Year: ${this.year}`

        switch (this.type) {
            case "tv":
                return `${titleDesc}${episodeDesc}${seasonDesc}${yearDesc}`
            case "movie":
                return `${titleDesc}${yearDesc}`
        }
    }

    /** The title of the media */
    public get title(): string {
        let tempTitle: string | undefined

        switch (this.type) {
            case "movie": {
                if (this.year) {
                    tempTitle = this.rawString.substring(
                        0,
                        this.rawString.indexOf(String(this.year)) - 1
                    )
                } else {
                    tempTitle = undefined
                }

                break
            }
            case "tv": {
                if (
                    // if seasonEpisode exists
                    this.seasonEpisode &&
                    // if seasonEpisode is in rawString
                    this.rawString.includes(this.seasonEpisode) &&
                    // if seasonEpisode is not at the beginning of rawString
                    this.rawString.substr(0, this.seasonEpisode.length) !== this.seasonEpisode
                ) {
                    // Find the index of the first character of seasonEpisode in rawString
                    const endIndex = this.rawString.indexOf(this.seasonEpisode)
                    // Get the substring of rawString up to the first character of seasonEpisode
                    let string = this.rawString.substring(0, endIndex - 1)

                    if (this.year) {
                        const yearEndIndex = this.rawString.indexOf(String(this.year))
                        // Get the substring of string up to the first character of year
                        // e.g. remove this.year from string
                        string = string.substring(0, yearEndIndex - 1)
                    }

                    tempTitle = string
                } else {
                    tempTitle = undefined
                }
            }
        }

        if (tempTitle) {
            let clean = cleanString(tempTitle)

            const uncleanMatch = tempTitle.match(/\d+\.\d+/)
            const tooCleanMatch = clean.match(/\d+ \d+/)

            if (uncleanMatch && tooCleanMatch && uncleanMatch[0] === tooCleanMatch[0]) {
                clean = clean.replaceAll(tooCleanMatch[0], uncleanMatch[0])
            }

            return clean
        }

        return cleanString(this.rawString)
    }

    /** Used internally for determining other metadata */
    private get seasonEpisode(): string | undefined {
        let match: string | undefined = undefined
        let patternMatched: string | undefined = undefined

        for (const pattern in PATTERN) {
            if (pattern === "year") continue

            // @ts-ignore
            const _match = this.rawString.match(PATTERN[pattern])
            if (_match && _match[0]) {
                match = _match[0]
                patternMatched = pattern
                break
            }
        }

        if (!match || !patternMatched) {
            return undefined
        }

        let matchString: string | undefined = undefined

        switch (patternMatched) {
            case "tricky": {
                const lowerBound = this.rawString.indexOf(match) + 1
                const upperBound = this.rawString.lastIndexOf(match) - 1
                matchString = this.rawString.substring(lowerBound, upperBound)
            }
            case "combined": {
                const lowerBound = this.rawString.indexOf(match)
                const upperBound = this.rawString.lastIndexOf(match) - 1
                matchString = this.rawString.substring(lowerBound, upperBound)
            }
            case "altSeason2": {
                const string = cleanString(match)
                if (!["264", "720"].includes(string.substring(1, 3))) return string
                break
            }
            default:
                matchString = cleanString(match)
        }

        return matchString
    }

    /**
     * The season number
     *
     * Not avaliable if `this.type` is `"movie"`
     */
    public get season(): number | undefined {
        if (!this.seasonEpisode) return undefined
        const both = cleanString(this.seasonEpisode)
        const seasonLabel = /Season /i

        if (both.match(seasonLabel)) {
            const match = this.rawString.match(PATTERN.altSeasonSingle)
            if (!match) return undefined
            const string = match[0]

            return Number(cleanString(string.replace(String(seasonLabel), "")))
        }

        if (both.length === 3) {
            return Number(cleanString(both.substring(1, 2)))
        }

        const pieces = both.split(SPLIT_CHARSET)

        // If we didn't cause a split above, then the following code can not be
        // reliably run
        if (pieces.length < 1) return undefined
        const first = pieces[0]

        // The size of the first part needs to be between 1 and 2
        if (first.length <= 2 && first.length >= 1) {
            return Number(cleanString(first))
        }

        return Number(cleanString(first.substring(1, first.length)))
    }

    /**
     * The episode number
     *
     * Not avaliable if `this.type` is `"movie"`
     */
    public get episode(): number | undefined {
        if (!this.seasonEpisode) return undefined
        const both = cleanString(this.seasonEpisode)
        const episodeLabel = /Episode /i

        if (both.match(episodeLabel)) {
            const match = this.rawString.match(PATTERN.altEpisodeSingle)
            if (!match) return undefined
            const string = match[0]

            return Number(cleanString(string.replace(String(episodeLabel), "")))
        }

        if (both.length === 3) {
            return Number(cleanString(both.substring(1, 2)))
        }

        const pieces = both.split(SPLIT_CHARSET)
        let i = 1

        while (pieces[i] === "" && i < pieces.length) {
            i += 1
        }

        return Number(cleanString(pieces[i]))
    }

    /** The type of the media */
    public get type(): MediaType {
        // The Swift version used to mistake the x/h 264 as season 2, episode 64.
        // I don't know of any shows that have 64 episode in a single season, so
        // checking that the episode < 64 should be safe and will resolve these
        // false positives.
        if (this.season && this.episode) return "tv"
        return "movie"
    }

    /** The year number */
    public get year(): number | undefined {
        const matches = this.rawString.match(PATTERN.year)
        if (!matches) return undefined
        return parseInt(cleanString(matches[0]))
    }

    private format(number?: number): string | undefined {
        if (number) return String(pad(number))
        return undefined
    }

    /** The season, with at most one leading zero */
    public get formattedSeason(): string | undefined {
        return this.format(this.season)
    }

    /** The episode, with at most one leading zero */
    public get formattedEpisode(): string | undefined {
        return this.format(this.episode)
    }

    /** Both the season and the episode together, in the format "S##E##" */
    public get formattedSeasonEpisode(): string {
        let season = ""
        let episode = ""

        if (this.formattedSeason) season = `S${this.formattedSeason}`
        if (this.formattedEpisode) episode = `E${this.formattedEpisode}`

        return `${season}${episode}`
    }

    /**
     * The basic name file name in the Plex Media Server format of "Name (Year) - S##E##"
     *
     * More information on the [Plex Media Server file naming format](https://support.plex.tv/articles/200220687-naming-series-season-based-tv-shows/)
     */
    public get basicPlexName(): string {
        let yearDesc = ""
        if (this.year) yearDesc = ` (${this.year})`

        switch (this.type) {
            case "tv":
                return `${this.title}${yearDesc} - ${this.formattedSeasonEpisode}`
            case "movie":
                return `${this.title}${yearDesc}`
        }
    }
}
