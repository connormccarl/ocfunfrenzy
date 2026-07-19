'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'

import { isDate } from '@connormccarl/nextos/utils'
import { Pagination, DateRange, SearchDateRange, SearchInput, SearchSelect } from '@connormccarl/nextos/ui';

// data
import { Search_Options, Search_Event, Page_Events, Event } from '@/prisma'
import { getEvents, getSearchOptions } from '@/prisma'

import EventCard from './EventCard';

const clearObject = (object: Object) => {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => {
        if(value.type === "string"){
            return [key, ""];
        } else if (value.type === "number"){
            if(key === "page")
                return [key, 1];
            else if(key == "pageSize")
                return [key, 10]
            return [key, 1]; // fields: totalPages
        } else {
            return [key, []];
        }
    }));
}

const emptySearchOptions: Search_Options = {
    categories: [],
    types: []
};

const emptySearch: Search_Event = {
    keywords: "",
    location: "",
    start_date: undefined,
    end_date: undefined,
    category: "",
    type: "",
    page: 1,
    pageSize: 10
};

const emptyData: Page_Events = {
    events: [],
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
};

export default function EventsGrid() {
    const searchParams = useSearchParams();
    const [searchOptions, setSearchOptions] = useState<Search_Options>(emptySearchOptions);
    const [search, setSearch] = useState<Search_Event>(emptySearch);
    const [data, setData] = useState<Page_Events>(emptyData);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // initial page load
    useEffect(() => {
        getInitialData();
    }, []);

    // pull not changing page data like search options
    const getInitialData = async () => {
        setSearchOptions(await getSearchOptions());
    }
    
    // refresh the data everytime the search changes
    useEffect(() => {
        getData();
    }, [search]);

    // pull the data from the database
    const getData = async () => {
        // get Data
        setIsLoading(true);
        setErrorMessage("");

        // load searchParams
        Object.entries(searchParams).forEach(([key, value]) => {
            // if it's a date 
            if(isDate(value))
                setSearch(prev => ({ ...prev, [key]: new Date(value) }));
            setSearch(prev => ({ ...prev, [key]: value }));
        });

        // run service
        try {
            const data = await getEvents(search);
            setData(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-5 space-y-2">
            <div className="grid grid-cols-1 justify-between gap-2 sm:grid-cols-3">
                <SearchInput 
                    placeholder='Keywords'
                    value={search.keywords}
                    onChange={(event) => {
                        setSearch(prev => ({ ...prev, keywords: event.target.value, page: 1 }));
                    }}
                />
                <SearchInput
                    placeholder='Location'
                    value={search.location}
                    onChange={(event) => {
                        setSearch(prev => ({ ...prev, location: event.target.value, page: 1 }));
                    }}
                />
                <SearchDateRange
                    value={{
                        start: search.start_date,
                        end: search.end_date
                    }}
                    onChange={(value) => {
                        setSearch(prev => ({ ...prev, start_date: value.start, end_date: value.end, page: 1 }));
                    }}
                />
            </div>
            <div className="grid grid-cols-1 justify-between gap-2 sm:grid-cols-2">
                <SearchSelect
                    placeholder='Choose an Event Category'
                    options={searchOptions.categories}
                    value={search.category}
                    onChange={(event) => {
                        setSearch(prev => ({ ...prev, category: event.target.value, page: 1 }));
                    }}
                />
                <SearchSelect
                    placeholder='Choose an Event Type'
                    options={searchOptions.types}
                    value={search.type}
                    onChange={(event) => {
                        setSearch(prev => ({ ...prev, type: event.target.value, page: 1 }));
                    }}
                />
            </div>

            {errorMessage && (
                <div className="rounded-md border border-red-500 p-3 text-sm text-red-500">
                    {errorMessage}
                </div>
            )}
            <Pagination
                isLoading={isLoading}
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                onPageChange={(event) => 
                    setSearch(prev => ({ ...prev, page: event }))
                }
                top={true}
            />
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="col-span-full py-6 text-center text-gray-500">Loading events...</div>
                ) : (!data.events || data.events.length === 0) ? (
                    <div className="col-span-full py-6 text-center text-gray-500">No events found</div>
                ) : (
                    data.events.map((event) => <EventCard key={event.id} event={event} />)
                )}
            </div>
            <Pagination
                isLoading={isLoading}
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                onPageChange={(event) => setSearch(prev => ({ ...prev, page: event }))}
            />
        </div>
    );
}
