const { test } = Deno
import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts"
const assertNotExists = (actual: unknown, msg?: string) => assertEquals(undefined, actual, msg)

import Downpour from "./mod.ts"

test("test movie 1", () => {
    const metadata = new Downpour("Movie.Name.2013.1080p.BluRay.H264.AAC.mp4")
    assertEquals(metadata.title, "Movie Name")
    assertEquals(metadata.year, 2013)
    assertNotExists(metadata.season)
    assertNotExists(metadata.episode)
    assertEquals(metadata.type, "movie")
    assertEquals(metadata.basicPlexName, "Movie Name (2013)")
})

test("test movie 2", () => {
    const metadata = new Downpour("Movie_Name_2_2017_x264_RARBG.avi")
    assertEquals(metadata.title, "Movie Name 2")
    assertEquals(metadata.year, 2017)
    assertNotExists(metadata.season)
    assertNotExists(metadata.episode)
    assertEquals(metadata.type, "movie")
    assertEquals(metadata.basicPlexName, "Movie Name 2 (2017)")
})

test("test standard show 1", () => {
    const metadata = new Downpour("Mr.Show.Name.S01E02.Source.Quality.Etc-Group")
    // assertEquals(metadata.title, "Mr. Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    // assertEquals(metadata.basicPlexName, "Mr. Show Name - S01E02")
})

test("test standard show 2", () => {
    const metadata = new Downpour("Show.Name.S01E02")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})

test("test standard show 3", () => {
    const metadata = new Downpour("Show Name - S01E02 - My Ep Name")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})

test("test standard show 4", () => {
    const metadata = new Downpour("Show.2.0.Name.S01.E03.My.Ep.Name-Group")
    // assertEquals(metadata.title, "Show 2.0 Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 3)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    // assertEquals(metadata.basicPlexName, "Show 2.0 Name - S01E03")
})

test("test standard show 5", () => {
    const metadata = new Downpour("Show Name - S06E01 - 2009-12-20 - Ep Name")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 6)
    assertEquals(metadata.episode, 1)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S06E01")
})

test("test standard show 6", () => {
    const metadata = new Downpour("Show Name - S06E01 - -30-")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 6)
    assertEquals(metadata.episode, 1)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S06E01")
})

test("test standard show 7", () => {
    const metadata = new Downpour("Show.Name.S06E01.Other.WEB-DL")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 6)
    assertEquals(metadata.episode, 1)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S06E01")
})

test("test standard show 8", () => {
    const metadata = new Downpour("Show.Name.S06E01 Some-Stuff Here")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 6)
    assertEquals(metadata.episode, 1)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S06E01")
})

test("test standard show 9", () => {
    const metadata = new Downpour("Show.Name-0.2010.S01E02.Source.Quality.Etc-Group")
    assertEquals(metadata.title, "Show Name-0")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertEquals(metadata.year, 2010)
    assertEquals(metadata.basicPlexName, "Show Name-0 (2010) - S01E02")
})

test("test standard show 10", () => {
    const metadata = new Downpour("Show-Name-S06E01-720p")
    assertEquals(metadata.title, "Show-Name")
    assertEquals(metadata.season, 6)
    assertEquals(metadata.episode, 1)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show-Name - S06E01")
})

test("test standard show 11", () => {
    const metadata = new Downpour("Show Name - s2005e01")
    assertEquals(metadata.title, "Show Name")
    // assertEquals(metadata.season, 2005)
    assertEquals(metadata.episode, 1)
    assertEquals(metadata.type, "tv")
    // assertEquals(metadata.year, 2005)
    // assertEquals(metadata.basicPlexName, "Show Name - S2005E01")
})

test("test standard show 12", () => {
    const metadata = new Downpour("Show Name - s05e01")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 5)
    assertEquals(metadata.episode, 1)
    assertEquals(metadata.type, "tv")
    assertEquals(metadata.basicPlexName, "Show Name - S05E01")
})

test("test FOV show 1", () => {
    const metadata = new Downpour("Show_Name.1x02.Source_Quality_Etc-Group")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})

test("test FOV show 2", () => {
    const metadata = new Downpour("Show Name 1x02")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})

test("test FOV show 3", () => {
    const metadata = new Downpour("Show Name 1x02 x264 Test")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})

test("test FOV show 4", () => {
    const metadata = new Downpour("Show Name - 1x02 - My Ep Name")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})

test("test FOV show 5", () => {
    const metadata = new Downpour("Show Name 1x02 x264 Test")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})

test("test FOV show 6", () => {
    const metadata = new Downpour("Show Name - 1x02 - My Ep Name")
    assertEquals(metadata.title, "Show Name")
    assertEquals(metadata.season, 1)
    assertEquals(metadata.episode, 2)
    assertEquals(metadata.type, "tv")
    assertNotExists(metadata.year)
    assertEquals(metadata.basicPlexName, "Show Name - S01E02")
})
