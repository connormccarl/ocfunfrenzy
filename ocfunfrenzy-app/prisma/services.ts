import { fetch } from '@connormccarl/nextos/fetch'
import { Search_Event } from '@/prisma'

const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// EVENTS SERVICE
export const getSearchOptions = async() => {
    return await fetch.get(`${api}/${event}`);
}

export const getEvents = async (search: Search_Event) => {
    return await fetch.post(`${api}`, search);
}

export const getEventById = async (id: string) => {
    return await fetch.get(`${api}/${id}`);
}

// POSTS SERVICE
export const getPosts = async() => {
    return await fetch.get(`${api}/posts`);
}