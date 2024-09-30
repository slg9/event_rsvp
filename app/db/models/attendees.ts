export type Attendee = {
    id: string;
    created_at: string;
    event_id: string;
    firstname: string;
    lastname: string;
    email: string;
    attending: 'oui' | 'non '
    phone: number;
    phone_prefix: number;
    adults?: number;
    arrival?: string;
    departure?: string;
    comment?: string;
}