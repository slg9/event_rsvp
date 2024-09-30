export type Attendee = {
    id: string;
    created_at: string;
    event_id:string;
    firstname: string; 
    lastname: string;
    email: string;
    phone: number;
    phone_prefix: number;
    adults?:number;
    arrival?:string;
    departure?:string;
    comment?:string;
}