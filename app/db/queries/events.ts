import { sql } from "@vercel/postgres";
import { Answer, Event, Question } from "../models/events";


export async function GetEvent(id: string) {
    const data = await sql<Event>`
    SELECT * FROM events
    WHERE id = ${id}
    LIMIT 1
    `
    return data.rows;
}
export async function ListEvents(id?: string,date?:string,query?:string) {
    const data = await sql<Event>`
    SELECT * FROM events
    WHERE deleted_at is null
    AND ${id}::text is null OR id = ${id}
    `
    return data.rows;
}

export async function CreateEvent(user_id:string,name: string, start: string, end: string, code: string) {
    const data = await sql<Event>`
    INSERT INTO events (user_id,name,start,end,code)
    VALUES (${user_id},${name},${start},${end},${code})
    RETURNING *
    `
    return data.rows;
}

export async function UpdateEvent(id: string, name: string, start: string, end: string, code: string) {
    const data = await sql<Event>`
    UPDATE users 
    SET name=${name},start=${start},end=${end},code=${code}
    WHERE id =${id}
    RETURNING *
    `
    return data.rows;
}

