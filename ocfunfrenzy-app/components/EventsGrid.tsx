'use client'
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import { DatePickerInput } from '@mantine/dates';
import { Select } from '@mantine/core';

import '@mantine/dates/styles.css';

export default function EventsGrid() {
    const [value, setValue] = useState<[string | null, string | null]>([null, null]);
    const [events, setEvents] = useState([]);

    // get events from database
    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    };

    // run on page load
    useEffect(() => {
        fetchEvents();
        console.log(events);
    }, []);

    return (
        <div className="mt-5 space-y-4">
            {/* SEARCH */}
            <div className="grid grid-cols-1 sm:grid-cols-3 justify-between gap-2 mb-5">
                <input type="text" placeholder="Keywords" className="border border-gray-400 rounded p-2 w-full placeholder-gray-400 text-md h-12" />
                
                <input type="text" placeholder="Location" className="border border-gray-400 rounded p-2 w-full placeholder-gray-400 text-md h-12" />

                <DatePickerInput
                    clearable
                    type="range"
                    placeholder="Select Date Range"
                    value={value}
                    onChange={setValue}
                    classNames={{ 
                        root: '!w-full',
                        input: '!border !border-gray-400 !rounded !p-2 !text-md !h-12',
                        inner: '!text-lg',
                        placeholder: '!text-md font-normal',
                        presetsList: '',
                    }}
                    presets={[
                        { value: [dayjs().subtract(1, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')], label: 'Yesterday' },
                        { value: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')], label: 'Today' },
                        { value: [dayjs().add(1, 'day').format('YYYY-MM-DD'), dayjs().add(1, 'day').format('YYYY-MM-DD')], label: 'Tomorrow' },
                        { value: [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'month').format('YYYY-MM-DD')], label: 'Next month' },
                        { value: [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'year').format('YYYY-MM-DD')], label: 'Next year' },
                        { value: [dayjs().format('YYYY-MM-DD'), dayjs().subtract(1, 'month').format('YYYY-MM-DD')], label: 'Last month' },
                        { value: [dayjs().format('YYYY-MM-DD'), dayjs().subtract(1, 'year').format('YYYY-MM-DD')], label: 'Last year' },
                    ]}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 justify-between gap-2">
                <Select
                    placeholder="Choose an Event Category"
                    data={[
                        'Date Night', 
                        'Family Fun', 
                        'Flying Solo', 
                        'Group Galivanting'
                    ]}
                    classNames={{
                        input: "border !border-gray-400 rounded p-2 w-full placeholder-gray-400 text-md !h-12",
                    }}
                    clearable
                    allowDeselect
                />

                <Select
                    placeholder="Choose an Event Type"
                    data={[
                        'Amusement Parks', 
                        'Animals & Aquariums', 
                        'Beaches', 
                        'Caves',
                        'Chair Champs',
                        'Fairs & Festivals',
                        'Food Halls / Court',
                        'Free is for Me!',
                        'Girls at Night',
                        'Hikes',
                        'Lakes',
                        'Move Your Body',
                        'Museums',
                        'Museums - Art',
                        'Nature Centers',
                        'Parks with Perks',
                        'Race & Endurance Events',
                        'Rainy Day (Indoor activities',
                        'Rentals',
                        'Scavenger Hunts',
                        'Splash Pads',
                        'Tours',
                        'Unique Food Experiences',
                        'Volunteering (with no obligation)',
                        'Wild & Wacky',
                        'Zen Out',
                    ]}
                    classNames={{
                        input: "border !border-gray-400 rounded p-2 w-full placeholder-gray-400 text-md !h-12",
                    }}
                    clearable
                    allowDeselect
                />
            </div>

            { events.length > 0 ?/* EVENTS */
            events.map((event: any) => (
                <article key={event.id} className="flex flex-col items-start justify-between sm:w-1/3">
                    <div className="relative w-full">
                        <img
                        alt=""
                        src=''
                        className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2 dark:bg-gray-800"
                        />
                        <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
                    </div>
                    <div className="flex max-w-xl grow flex-col justify-between">
                        <div className="mt-2 flex items-center gap-x-4 text-xs">
                            <time dateTime={event.start_date} className="text-gray-500 dark:text-gray-400">
                                {new Date(event.start_date).toLocaleDateString('en-US',{
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })} - {new Date(event.end_date).toLocaleDateString('en-US',{
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </time>
                            <a
                                href='#'
                                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                {event.status}
                            </a>
                        </div>
                        <div className="group relative grow">
                            <h3 className="mt-2 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                                <a href='#'>
                                    <span className="absolute inset-0" />
                                    {event.title}
                                </a>
                            </h3>
                            <p className="mt-3 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">{event.excerpt}</p>
                        </div>
                    </div>
                </article>
            ))
            :
            <div className='mt-4 text-center'>No events found</div>
            }
        </div>
    )
}