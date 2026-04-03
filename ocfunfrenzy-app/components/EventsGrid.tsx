'use client'
import dayjs from 'dayjs';
import { useState } from 'react';

import { DatePickerInput } from '@mantine/dates';
import { Select } from '@mantine/core';

import '@mantine/dates/styles.css';
import classes from './DateRange.module.css';

export default function EventsGrid() {
    const [value, setValue] = useState<[string | null, string | null]>([null, null]);

    return (
        <div className="mt-5">
            {/* SEARCH */}
            <div>
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
            </div>
        </div>
    )
}