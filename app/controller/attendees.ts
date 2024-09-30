'use server'

import { revalidatePath } from "next/cache"
import { CreateAttendee, UpdateAttendee } from "../db/queries/attendees"
import { redirect } from "next/navigation"

export async function  CreateAttendeeController (formdata: FormData,code:string) {
    console.log("click")
    const firstname = formdata.get("firstname") as string || ''
    const lastname = formdata.get("lastname") as string || ''
    const email = formdata.get("email") as string || ''
    const phone_prefix = formdata.get("phone_prefix") as string || ''
    const phone = formdata.get("phone") as string || ''
    const event_id = formdata.get("event_id") as string || ''
    const adults = formdata.get("adults") as string || ''
    const arrival = formdata.get("arrival") as string || ''
    const departure = formdata.get("departure") as string || ''
    const comment = formdata.get("adults") as string || ''
    const attending = formdata.get("attending") as 'oui | non' || 'non'
    let parsedAdults :number | undefined = undefined
    let parsedArrival :string | undefined = undefined
    let parsedDeparture :string | undefined = undefined
    let parsedComment :string | undefined = undefined
    if (adults != ''){
        parsedAdults = parseInt(adults)
    }
    if (arrival != ''){
        parsedArrival = arrival
    }
    if (departure != ''){
        parsedDeparture = departure
    }
    if (comment != ''){
        parsedComment = comment
    }
    const parsedPhone = parseInt(phone);

    if (firstname && lastname && email && !isNaN(parsedPhone) ) {
        const attendee =  await CreateAttendee(event_id, firstname, lastname, email, parsedPhone, phone_prefix,parsedAdults,parsedArrival,parsedDeparture,parsedComment,attending);
        
        
        return attendee
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
}

export async function  UpdateAttendeeController (formdata: FormData,code:string,id:string) {
    console.log("click")
    const firstname = formdata.get("firstname") as string || ''
    const lastname = formdata.get("lastname") as string || ''
    const email = formdata.get("email") as string || ''
    const phone_prefix = formdata.get("phone_prefix") as string || ''
    const phone = formdata.get("phone") as string || ''
    const event_id = formdata.get("event_id") as string || ''
    const adults = formdata.get("adults") as string || ''
    const arrival = formdata.get("arrival") as string || ''
    const departure = formdata.get("departure") as string || ''
    const comment = formdata.get("adults") as string || ''
    const attending = formdata.get("attending") as 'oui | non' || 'non'
    let parsedAdults :number | undefined = undefined
    let parsedArrival :string | undefined = undefined
    let parsedDeparture :string | undefined = undefined
    let parsedComment :string | undefined = undefined
    if (adults != ''){
        parsedAdults = parseInt(adults)
    }
    if (arrival != ''){
        parsedArrival = arrival
    }
    if (departure != ''){
        parsedDeparture = departure
    }
    if (comment != ''){
        parsedComment = comment
    }
    const parsedPhone = parseInt(phone);
   

    if (firstname && lastname && email && !isNaN(parsedPhone)) {
        const attendee = await UpdateAttendee(id, firstname, lastname, email, parsedPhone, phone_prefix,parsedAdults,parsedArrival,parsedDeparture,parsedComment,attending);
        revalidatePath(`/rsvp/${code}/${id}`)
        return attendee
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
}