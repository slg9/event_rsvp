

export type Event = {
    id: string;
    user_id:string;
    created_at: string;
    deleted_at?: string;
    name: string;
    start: string;
    end: string;
    code: string;
}

export type Question = {
    id: string;
    created_at: string;
    deleted_at?: string;
    event_id: string;
    name: string;
    description: string;
    answer_type: 'STRING | STRING[] | NUMBER | NUMBER[] | BOOLEAN';
}

export type Answer = {
    id: string;
    created_at: string;
    question_id: string;
    attendee_id:string;
    response: string | string[] | number | number[] | boolean;
    comment?:string;
}



