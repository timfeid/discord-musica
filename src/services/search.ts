// @ts-ignore
import {YouTube} from 'popyt'

const youtube = new YouTube(process.env.GOOGLE_API_KEY || '')

export default async function search (query: string, total = 1) {
  return await youtube.searchVideos(query, total)
}

export default async function playlist (query: string, total = 25) {
  return await youtube.getPlaylistItems(query, total)
}