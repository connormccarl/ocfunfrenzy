export type Search_Options = {
    categories: Search_Dropdown[];
    types: Search_Dropdown[];
}

type Search_Dropdown = {
    id: string;
    name: string;
}

export type Search_Event = {
    keywords?: string;
    location?: string;
    start_date: Date | undefined;
    end_date: Date | undefined;
    category?: string;
    type?: string;
    page?: number;
    pageSize?: number;
}

export type Page_Events = {
    events: Event[]
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export type Event = {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    seo_keyphrase: string;
    zip_code?: string;
    location?: string;
    registration_info: string;
    start_date?: Date;
    end_date?: Date;
    image?: string;
    created_at: Date;
    updated_at: Date;
    categories?: string[];
    types?: string[];
}