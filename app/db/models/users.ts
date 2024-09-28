
export type User = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    last_login?: string;
    role: 'ADMIN|USER'
}



