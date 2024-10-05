import { QueryResult, sql } from "@vercel/postgres";
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
    WHERE (${id}::text is null OR id = ${id})
    AND (${event_id}::text is null OR event_id = ${event_id})
    `
    return data.rows;
}

export async function ListAttendeesByPeriodAndAdultsAndEventID(event_id: string,nbAdults:number,from:string,to:string) {
    const data = await sql<Attendee>`
    SELECT * FROM attendees
    WHERE event_id = ${event_id}
    AND adults = ${nbAdults}
    AND arrival = ${from}
    AND departure = ${to}
    `
    return data.rows;
}


export async function CreateAttendee(event_id:string,firstname: string, lastname: string, email: string, phone: number, phone_prefix: string,adults: number | undefined,arrival: string | undefined,departure: string | undefined,comment: string | undefined,attending:'oui | non') {
    const data = await sql<Attendee>`
    INSERT INTO attendees (event_id,firstname,lastname,email,phone,phone_prefix,adults,arrival,departure,comment,attending)
    VALUES (${event_id},${firstname},${lastname},${email},${phone},${phone_prefix},${adults},${arrival},${departure},${comment},${attending})
    RETURNING *
    `
    return data.rows;
}

export async function UpdateAttendee(id: string,firstname: string, lastname: string, email: string, phone: number, phone_prefix: string,adults: number | undefined,arrival: string | undefined,departure: string | undefined,comment: string | undefined,attending:'oui | non') {
    const data = await sql<Attendee>`
    UPDATE attendees 
    SET firstname=${firstname},lastname=${lastname},email=${email},phone=${phone},phone_prefix=${phone_prefix},adults=${adults},arrival=${arrival},departure=${departure},comment=${comment},attending=${attending}
    WHERE id =${id}
    RETURNING *
    `
    return data.rows;
}

