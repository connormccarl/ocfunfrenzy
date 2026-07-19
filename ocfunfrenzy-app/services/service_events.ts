import { fetch } from '@connormccarl/nextos/lib'
import { Search_Event } from '@/prisma'

const baseURL = '/api/data'

export const getEventById = async (id: string) => {
    return await fetch.get(`${baseURL}/${id}`);
}

export const getSearchOptions = async() => {
    return await fetch.get(`${baseURL}`);
}

export const getEvents = async (search: Search_Event) => {
    return await fetch.post(`${baseURL}`, search);
}
