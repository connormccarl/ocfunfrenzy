import { prisma } from '../'
import { Search_Event } from './types'

export const getEventById = async (id: string) => {
    try {
        const event = await prisma.events.findUnique({
            where: {
                id: id,
            },
        });
        return event;
    } catch (error) {
        return null;
    }
}

export const getEvents = async (search: Search_Event) => {
    try {
        const { page = 1, pageSize = 10, ...otherSearch } = search;
        
        // TODO: take search object and map it to Prisma filter
        const whereClause: any = Object.entries(otherSearch).forEach(([key, value]) => {
            return [key, {
                containts: value,
                mode: "insensitive"
            }]
        });
        console.log("where clause: ", whereClause);

        const [events, total] = await prisma.$transaction([
            prisma.events.findMany({
                where: whereClause,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    start_date: 'asc'
                }
            }),
            prisma.events.count({
                where: whereClause
            })
        ]);
        
        return { events, total, totalPages: Math.ceil(total / pageSize) };
    } catch (error) {
        return null;
    }
}

export const getDropdownOptions = async () => {
    try {
        const [categories, types] = await Promise.all([
            prisma.categories.findMany({
                orderBy: {
                    name: 'asc'
                },
                omit: {
                    created_at: true,
                    updated_at: true
                }
            }),
            prisma.types.findMany({
                orderBy: {
                    name: 'asc'
                },
                omit: {
                    created_at: true,
                    updated_at: true
                }
            }),
        ]);

        return { categories, types };
    } catch (error) {
        return null;
    }
}