import Link from 'next/link';
import { Event } from '@/prisma'
import { formatDate } from '@connormccarl/nextos/utils'

function TaxonomyBadges({ label, labels }: { label: string; labels: string[] | undefined }) {
    if (!labels || labels.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="min-w-24 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
            <div className="flex flex-wrap gap-2">
                {labels.map((badgeLabel) => (
                    <span key={badgeLabel} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {badgeLabel}
                    </span>
                ))}
            </div>
        </div>
    );
}

function EventImageLink({event, mobileOnly = false }: { event: Event; mobileOnly?: boolean }) {
    if (!event.image) {
        return null;
    }

    return (
        <Link
            href={`/event/${event.id}`}
            className={`${mobileOnly ? 'block sm:hidden' : 'hidden sm:block sm:w-48 md:w-56'} overflow-hidden rounded-md border border-gray-200 bg-gray-50`}
        >
            <img
                src={event.image}
                alt={event.title ?? 'Event image'}
                className={`${mobileOnly ? 'aspect-video' : 'aspect-square'} h-full w-full object-cover transition duration-200 hover:scale-105`}
            />
        </Link>
    );
}

export default function EventCard({event}: { event: Event }) {
    const dateLabel = formatDate(event.start_date, event.end_date);

    return (
        <article className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium text-gray-500">{dateLabel}</div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            <Link href={`/event/${event.id}`} className="hover:text-gray-600">
                                {event.title}
                            </Link>
                        </h3>
                    </div>

                    <EventImageLink event={event} mobileOnly />

                    {event.location && (
                        <div className="text-sm text-gray-600">
                            {event.location}
                            {event.zip_code ? ` ${event.zip_code}` : ''}
                        </div>
                    )}

                    {event.excerpt && (
                        <p className="line-clamp-4 text-sm leading-6 text-gray-700">
                            {event.excerpt}
                        </p>
                    )}

                    <div className="space-y-3">
                        <TaxonomyBadges label="Categories" labels={event.categories?.map((category) => category)} />
                        <TaxonomyBadges label="Types" labels={event.types?.map((type) => type)} />
                    </div>

                    <Link
                        href={`/event/${event.id}`}
                        className="mt-auto inline-flex w-full justify-center rounded-md bg-[#f1a236] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d98b22] sm:w-fit"
                    >
                        Click to see event details
                    </Link>
                </div>

                <div className="shrink-0">
                    <EventImageLink event={event} />
                </div>
            </div>
        </article>
    );
}
