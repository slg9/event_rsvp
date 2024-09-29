'use server'

import { revalidatePath } from "next/cache"
import { CreateAttendee } from "../db/queries/attendees"
import { redirect } from 'next/navigation';

export async function  CreateAttendeeController (formdata: FormData) {
    console.log("click")
    const firstname = formdata.get("firstname") as string || ''
    const lastname = formdata.get("lastname") as string || ''
    const email = formdata.get("email") as string || ''
    const phone_prefix = formdata.get("phone_prefix") as string || ''
    const phone = formdata.get("phone") as string || ''
    const event_id = formdata.get("event_id") as string || ''
    const parsedPhone = parseInt(phone);
    const parsedPhonePrefix = parseInt(phone_prefix);

    if (firstname && lastname && email && !isNaN(parsedPhone) && !isNaN(parsedPhonePrefix)) {
        await CreateAttendee(event_id, firstname, lastname, email, parsedPhone, parsedPhonePrefix);
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
    revalidatePath('/rsvp/1234');
    redirect('/rsvp/1234');
}