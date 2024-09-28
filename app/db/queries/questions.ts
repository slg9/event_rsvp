import { sql } from "@vercel/postgres";
import { Answer, Event, Question } from "../models/events";






export async function GetQuestion(id: string) {
    const data = await sql<Question>`
    SELECT * FROM questions
    WHERE id = ${id}
    LIMIT 1
    `
    return data.rows;
}
export async function ListQuestions(id?: string,event_id?:string,query?:string) {
    const data = await sql<Question>`
    SELECT * FROM questions
    WHERE (${id} = '' OR id = ${id})
    AND (${event_id} = '' OR event_id = ${event_id})
    AND (${query} = '' OR name ILIKE %${query}% )
    `
    return data.rows;
}


export async function CreateQuestion(event_id:string,name: string, description: string, answer_type:'STRING | STRING[] | NUMBER | NUMBER[] | BOOLEAN') {
    const data = await sql<Question>`
    INSERT INTO questions (event_id,name,description,answer_type)
    VALUES (${event_id},${name},${description},${answer_type})
    RETURNING *
    `
    return data.rows;
}

export async function DeleteQuestion(id:string) {
    const data = await sql<Question>`
    UPDATE questions 
    SET deleted_at = now()
    WHERE id = ${id}
    RETURNING *
    `
    return data.rows;
}



