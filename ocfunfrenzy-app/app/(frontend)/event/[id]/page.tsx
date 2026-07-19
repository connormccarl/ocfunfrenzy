import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getEventById } from '@/prisma';
import { Event } from '@/prisma'
import { formatDate } from '@connormccarl/nextos'

type EventPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function DetailBadges({ title, labels }: { title: string; labels?: string[] }) {
    if (!labels || labels.length === 0) {
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

    try {
        const event: Event = await getEventById(id);
        const dateLabel = formatDate(event.start_date, event.end_date);

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
                            {event.zip_code ? ` ${event.zip_code}` : ''}
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailBadges title="Categories" labels={event.categories?.map((category) => category)} />
                    <DetailBadges title="Types" labels={event.types?.map((type) => type)} />
                </div>

                <section className="space-y-3 text-base leading-7 text-gray-700">
                    {contentParagraphs(event.content).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </section>

                {event.registration_info && (
                    <a
                        href={event.registration_info}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full justify-center rounded-md bg-[#f1a236] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d98b22] sm:w-fit"
                    >
                        View registration information
                    </a>
                )}
            </article>
        );
    } catch (error) {
        notFound();
    }
}
