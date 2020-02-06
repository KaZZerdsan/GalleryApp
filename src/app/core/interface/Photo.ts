export interface Photos {
    totalItems:   number;
    itemsPerPage: number;
    countOfPages: number;
    data:         Datum[];
}

export interface Datum {
    id:          number;
    name:        string;
    description: string;
    new:         boolean;
    popular:     boolean;
    image:       Image;
}

export interface Image {
    id:         number;
    contentUrl: string;
}

export interface Media {
    id: string;
    file: string;
    contentUrl: string;
}