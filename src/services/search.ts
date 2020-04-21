// @ts-ignore
import {YouTube} from 'popyt'

const youtube = new YouTube(process.env.GOOGLE_API_KEY || '')

export async function search (query: string, total = 1) {
  return await youtube.searchVideos(query, total)
}

export async function playlist (query: string, total = 25) {
  try {

    return await youtube.getPlaylistItems(query, total)
  } catch (e) {
    const playlists = await youtube.searchPlaylists(query, 1)
    if (playlists.results) {
      return playlists.results[0].fetchVideos()
    }
  }
}