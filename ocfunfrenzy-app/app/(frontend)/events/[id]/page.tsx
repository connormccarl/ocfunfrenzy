import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getEventById } from '@/lib/events';

type EventPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatEventDate(startDate: string | null, endDate: string | null) {
    if (!startDate || !endDate) {
        return '24/7';
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return `${formatter.format(new Date(`${startDate}T00:00:00`))} - ${formatter.format(new Date(`${endDate}T00:00:00`))}`;
}

function DetailBadges({ title, labels }: { title: string; labels: string[] }) {
    if (labels.length === 0) {
        return null;
    }

    return (
        <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase text-gray-500">{title}</h2>
            <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                    <span key={label} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                        {label}
                    </span>
                ))}
            </div>
        </section>
    );
}

function contentParagraphs(content: string | null) {
    if (!content) {
        return ['No additional event details are available yet.'];
    }

    return content.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default async function EventPage({ params }: EventPageProps) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    const dateLabel = formatEventDate(event.startDate, event.endDate);

    return (
        <article className="mx-auto max-w-3xl space-y-6">
            <Link href="/" className="inline-flex text-sm font-medium text-gray-600 hover:text-gray-900">
                Back to events
            </Link>

            <header className="space-y-3">
                <div className="text-sm font-medium text-gray-500">{dateLabel}</div>
                <h1 className="text-3xl font-semibold text-gray-900">{event.title}</h1>
                {event.location && (
                    <div className="text-base text-gray-700">
                        {event.location}
                        {event.zipCode ? ` ${event.zipCode}` : ''}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailBadges title="Categories" labels={event.categories.map((category) => category.name)} />
                <DetailBadges title="Types" labels={event.types.map((type) => type.name)} />
            </div>

            <section className="space-y-3 text-base leading-7 text-gray-700">
                {contentParagraphs(event.content).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </section>

            {event.registrationInfo && (
                <a
                    href={event.registrationInfo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full justify-center rounded-md bg-[#f1a236] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d98b22] sm:w-fit"
                >
                    View registration information
                </a>
            )}
        </article>
    );
}
