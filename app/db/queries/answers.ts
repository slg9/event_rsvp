import { sql } from "@vercel/postgres";
import { Answer } from "../models/events";

export async function GetAnswer(id: string) {
    const data = await sql<Answer>`
    SELECT * FROM answers
    WHERE id = ${id}
    LIMIT 1
    `
    return data.rows;
}
export async function ListAnswers(id?: string,question_id?:string,query?:string) {
    const data = await sql<Answer>`
    SELECT * FROM answers
    WHERE (${id} = '' OR id = ${id})
    AND (${question_id} = '' OR question_id = ${question_id})
    AND (${query} = '' OR response ILIKE %${query}% )
    `
    return data.rows;
}


export async function CreateAnswer(event_id:string,name: string, description: string, answer_type:'STRING | STRING[] | NUMBER | NUMBER[] | BOOLEAN') {
    const data = await sql<Answer>`
    INSERT INTO questions (event_id,name,description,answer_type)
    VALUES (${event_id},${name},${description},${answer_type})
    RETURNING *
    `
    return data.rows;
}