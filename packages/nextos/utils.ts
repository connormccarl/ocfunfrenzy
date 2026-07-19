export const getClasses = (classes: string[]) => {
    return classes.join(" ");
}

export const isDate = (value: any) => typeof value !== 'number' && !isNaN(Date.parse(value));

export const formatDate = (startDate: Date | undefined | null, endDate: Date | undefined | null) => {
    if (!startDate || !endDate) {
        return '24/7';
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}
