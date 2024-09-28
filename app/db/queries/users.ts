import { sql } from "@vercel/postgres";
import { User } from "../models/users";


export async function GetUser(id: string) {
    const data = await sql<User>`
    SELECT * FROM users
    WHERE id = ${id}
    LIMIT 1
    `
    return data.rows;
}
export async function ListUsers(id?: string, role?: 'ADMIN | USER') {
    const data = await sql<User>`
    SELECT * FROM users
    WHERE (${id} = '' OR id = ${id})
    AND (${role} = '' OR role = ${role})
    `
    return data.rows;
}

export async function CreateUser(id: string, firstname: string, lastname: string, email: string, password: string, role: 'ADMIN|USER') {
    const data = await sql<User>`
    INSERT INTO users (firstname,lastname,email,role,password)
    VALUES (${firstname},${lastname},${email},${role},${password})
    RETURNING *
    `
    return data.rows;
}

export async function UpdateUser(id: string, firstname: string, lastname: string, email: string, role: 'ADMIN|USER') {
    const data = await sql<User>`
    UPDATE users 
    SET firstname=${firstname},lastname=${lastname},email=${email},role=${role}
    WHERE id =${id}
    RETURNING *
    `
    return data.rows;
}

