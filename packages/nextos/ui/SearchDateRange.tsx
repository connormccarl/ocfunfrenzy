'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { getClasses } from '../';

export type DateRange = {
    start: Date | undefined;
    end: Date | undefined;
};

type DateRangeProps = {
    value: DateRange;
    onChange: (value: DateRange) => void;
};

const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const monthFormatter = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    year: 'numeric' 
});
const displayFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

const addDays = (date: Date, days: number) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);

    return nextDate;
}

const addMonths = (date: Date, months: number) => {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + months);

    return nextDate;
}

function getMonthDays(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<Date | null> = Array.from({ length: firstDay.getDay() }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(new Date(year, month, day));
    }

    return cells;
}

function isSameDate(firstDate: Date, secondDate: Date) {
    return firstDate.toDateString() === secondDate.toDateString();
}

function isBetweenDates(date: Date, start: Date | undefined, end: Date | undefined) {
    if (!start || !end) {
        return false;
    }

    const currentTime = date.getTime();
    const startTime = start.getTime();
    const endTime = end.getTime();

    return currentTime > startTime && currentTime < endTime;
}

function formatPickerLabel(value: DateRange) {
    if (!value.start && !value.end) {
        return 'Select Date Range...';
    }

    const startLabel = value.start ? displayFormatter.format(value.start) : 'Start';
    const endLabel = value.end ? displayFormatter.format(value.end) : 'End';

    return `${startLabel} - ${endLabel}`;
}

export default function SearchDateRange({ value, onChange }: DateRangeProps) {
    // VARIBLES: refs (for functionality)
    const mainRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // VARIABLES: panel
    const [panelStyle, setPanelStyle] = useState({ left: 16, top: 16, width: 320 });
    const [isOpen, setIsOpen] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState(() => new Date());
    const [pickerStart, setPickerStart] = useState<Date | undefined>(() => value.start);
    const [pickerEnd, setPickerEnd] = useState<Date | undefined>(() => value.end);
    
    useEffect(() => {
        setPickerStart(value.start);
        setPickerEnd(value.end);
    }, [value.start, value.end]);

    useEffect(() => {
        if (!isOpen || !buttonRef.current) {
            return;
        }

        const updatePanelPosition = () => {
            const triggerRect = buttonRef.current?.getBoundingClientRect();

            if (!triggerRect) {
                return;
            }

            const pagePadding = 16;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const panelWidth = Math.min(viewportWidth - pagePadding * 2, 736);
            const left = Math.min(
                Math.max(pagePadding, triggerRect.left),
                viewportWidth - panelWidth - pagePadding,
            );
            const belowTop = triggerRect.bottom + 8;
            const top = belowTop > viewportHeight - 120 ? pagePadding : belowTop;

            setPanelStyle({ left, top, width: panelWidth });
        };

        updatePanelPosition();
        window.addEventListener('resize', updatePanelPosition);
        window.addEventListener('scroll', updatePanelPosition, true);

        return () => {
            window.removeEventListener('resize', updatePanelPosition);
            window.removeEventListener('scroll', updatePanelPosition, true);
        };
    }, [isOpen]);

    const months = useMemo(
        () => [visibleMonth, addMonths(visibleMonth, 1)]
    , [visibleMonth]);

    const presets = [
        {
            label: 'Today',
            getRange: () => {
                const today = new Date();
                return { start: today, end: today };
            },
        },
        {
            label: 'Tomorrow',
            getRange: () => {
                const tomorrow = addDays(new Date(), 1);
                return { start: tomorrow, end: tomorrow };
            },
        },
        {
            label: 'This weekend',
            getRange: () => {
                const today = new Date();
                const saturdayOffset = (6 - today.getDay() + 7) % 7;
                const saturday = addDays(today, saturdayOffset);
                const sunday = addDays(saturday, 1);
                return { start: saturday, end: sunday };
            },
        },
        {
            label: 'Next 7 days',
            getRange: () => ({
                start: new Date(),
                end: addDays(new Date(), 7),
            }),
        },
        {
            label: 'Next 30 days',
            getRange: () => ({
                start: new Date(),
                end: addDays(new Date(), 30),
            }),
        },
    ];

    const selectDate = (date: Date) => {
        const selectedDate = date;

        if (!pickerStart || pickerEnd) {
            setPickerStart(selectedDate);
            setPickerEnd(undefined);
            return;
        }

        if (selectedDate.getTime() < pickerStart.getTime()) {
            setPickerEnd(pickerStart);
            setPickerStart(selectedDate);
            return;
        }

        setPickerEnd(selectedDate);
    };

    const applyRange = () => {
        if (!pickerStart || !pickerEnd) {
            return;
        }

        onChange({
            start: pickerStart,
            end: pickerEnd,
        });
        setIsOpen(false);
    };

    const clearRange = () => {
        const today = new Date();

        setPickerStart(today);
        setPickerEnd(today);
        onChange({ start: today, end: today });
    };

    return (
        <div ref={mainRef} className="relative w-full">
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                style={{
                    color: '#9ca3af'
                }}
                className="h-12 w-full rounded border border-gray-400 bg-white px-3 text-left text-base text-gray-700"
            >
                {formatPickerLabel(value)}
            </button>

            {isOpen && (
                <div
                    style={panelStyle}
                    className="fixed z-50 max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-md border border-gray-300 bg-white text-gray-800 shadow-xl"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-[11rem_1fr]">
                        <div className="border-b border-gray-200 bg-gray-50 p-3 sm:border-b-0 sm:border-r">
                            <div className="mb-2 text-sm font-semibold uppercase text-gray-600">Presets</div>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => {
                                            const range = preset.getRange();
                                            setPickerStart(range.start);
                                            setPickerEnd(range.end);

                                            const today = new Date();
                                            today.setMonth(range.start.getMonth());
                                            setVisibleMonth(today);
                                        }}
                                        className="rounded border border-gray-300 bg-white px-2 py-2 text-left text-sm hover:bg-[#f1a236]"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="mb-3 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                                    className="rounded border border-gray-300 px-3 py-1 text-lg leading-none hover:bg-[#f1a236]"
                                    aria-label="Previous month"
                                >
                                    {'<'}
                                </button>
                                <div className="text-center text-sm font-semibold text-gray-500">
                                    Choose a Date Range
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                                    className="rounded border border-gray-300 px-3 py-1 text-lg leading-none hover:bg-[#f1a236]"
                                    aria-label="Next month"
                                >
                                    {'>'}
                                </button>
                            </div>
                            <div className="flex flex-col">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {months.map((monthDate, monthIndex) => (
                                        <div key={monthDate.toISOString()} className={monthIndex === 1 ? 'hidden sm:block' : ''}>
                                            {/* MONTH HEADER */}
                                            <div className="mb-2 text-center text-sm font-semibold">
                                                {monthFormatter.format(monthDate)}
                                            </div>
                                            {/* DAY OF WEEK HEADER */}
                                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
                                                {dayLabels.map((dayLabel) => (
                                                    <div key={dayLabel} className="py-1">
                                                        {dayLabel}
                                                    </div>
                                                ))}
                                            </div>
                                            {/* MONTH GRID */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {getMonthDays(monthDate).map((date, index) => {
                                                    {/* Empty Cell */}
                                                    if (!date) {
                                                        return <div key={`empty-${index}`} className="aspect-square" />;
                                                    }

                                                    {/* Date Cell */}
                                                    const isSelectedStart = pickerStart ? isSameDate(date, pickerStart) : false;
                                                    const isSelectedEnd = pickerEnd ? isSameDate(date, pickerEnd) : false;
                                                    const isInRange = isBetweenDates(date, pickerStart, pickerEnd);

                                                    return (
                                                        <button
                                                            key={date.toISOString()}
                                                            type="button"
                                                            onClick={() => selectDate(date)}
                                                            className={getClasses([
                                                                'aspect-square rounded text-sm',
                                                                isSelectedStart || isSelectedEnd
                                                                    ? 'bg-[#f1a236] font-semibold text-white hover:bg-[#f8d89a]'
                                                                    : isInRange ? 'bg-[#f8d89a] font-medium text-black hover:border-2 hover:border-[#f1a236]' 
                                                                    : 'hover:bg-gray-200',
                                                            ])}
                                                        >
                                                            {date.getDate()}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 sm:justify-start sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={applyRange}
                                        disabled={!pickerStart || !pickerEnd}
                                        className="rounded bg-[#f1a236] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearRange}
                                        className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-[#f1a236]"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
