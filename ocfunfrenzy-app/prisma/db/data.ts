import { prisma } from '../'
import { Search_Event } from './types'

export const db_getEventById = async (id: string) => {
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

export const db_getEvents = async (search: Search_Event) => {
    try {
        const { page = 1, pageSize = 10, ...otherSearch } = search;

        const startDate = () => {
            // if undefined
            if(!otherSearch.start_date) {
                return {
                    end_date: otherSearch.start_date
                };
            }

            return {
                OR: [
                    {end_date: {
                        gte: otherSearch.start_date
                    }},
                    {end_date: null}
                ]
            };
        }

        const endDate = () => {
            // if undefined
            if(!otherSearch.end_date) {
                return {
                    start_date: otherSearch.end_date
                };
            }

            return {
                OR: [
                    {start_date: {
                        lte: otherSearch.end_date
                    }},
                    {start_date: otherSearch.end_date ? null : otherSearch.end_date }
                ]
            };
        }
        
        // TODO: take search object and map it to Prisma filter
        const whereClause: any = {
            AND: 
            [
                startDate(),
                endDate(),
                {OR: [
                    {title: { 
                        contains: otherSearch.keywords,
                        mode: "insensitive"
                    }},
                    {content: { 
                        contains: otherSearch.keywords,
                        mode: "insensitive"
                    }},
                    {excerpt: { 
                        contains: otherSearch.keywords,
                        mode: "insensitive"
                    }},
                    {seo_keyphrase: { 
                        contains: otherSearch.keywords,
                        mode: "insensitive"
                    }},
                    {registration_info: { 
                        contains: otherSearch.keywords,
                        mode: "insensitive"
                    }},
                ]},
                {location: { 
                    contains: otherSearch.location,
                    mode: "insensitive"
                }},
                {events_categories: {
                    some: {
                        category_id: otherSearch.category
                    }
                }},
                {events_types: {
                    some: {
                        type_id: otherSearch.type
                    }
                }}
            ]
        };

        const [events, total] = await prisma.$transaction([
            prisma.events.findMany({
                where: whereClause,
                include: {
                    events_categories: {
                        select: {
                            categories: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    events_types: {
                        select: {
                            types: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
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

        // flatten nested columns
        const flattenedEvents = events.map(({events_categories, events_types, ...events}) => {
            return {
                ...events,
                categories: events_categories.map(({categories}) => categories?.name || null),
                types: events_types.map(({types}) => types?.name || null)
            };
        });
        
        return { events: flattenedEvents, total, totalPages: Math.ceil(total / pageSize) };
    } catch (error) {
        return null;
    }
}

export const db_getDropdownOptions = async () => {
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