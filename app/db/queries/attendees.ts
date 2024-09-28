import { sql } from "@vercel/postgres";
import {Attendee } from "../models/attendees";


export async function GetAttendee(id: string) {
    const data = await sql<Attendee>`
    SELECT * FROM attendees
    WHERE id = ${id}
    LIMIT 1
    `
    return data.rows;
}

export async function ListAttendees(id?: string,event_id?: string,query?:string) {
    const data = await sql<Attendee>`
    SELECT * FROM attendees
    WHERE (${id} = '' OR id = ${id})
    AND (${event_id} = '' OR event_id = ${event_id})
    AND (${query} = '' OR firstname ILIKE %${query}% OR lastname ILIKE %${query}% OR email ILIKE %${query}% OR phone ILIKE %${query}% OR phone_prefix ILIKE %${query}%    )
    `
    return data.rows;
}


export async function CreateAttendee(event_id:string,firstname: string, lastname: string, email: string, phone: number, phone_prefix: number) {
    const data = await sql<Attendee>`
    INSERT INTO attendees (event_id,firstname,lastname,email,phone,phone_prefix)
    VALUES (${event_id},${firstname},${lastname},${email},${phone},${phone_prefix})
    RETURNING *
    `
    return data.rows;
}

export async function UpdateAttendee(id: string,firstname: string, lastname: string, email: string, phone: number, phone_prefix: number) {
    const data = await sql<Attendee>`
    UPDATE attendees 
    SET firstname=${firstname},lastname=${lastname},email=${email},phone=${phone},phone_prefix=${phone_prefix}
    WHERE id =${id}
    RETURNING *
    `
    return data.rows;
}

