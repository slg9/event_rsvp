'use server'

import { CreateAttendee, UpdateAttendee } from "../db/queries/attendees"

export async function  CreateAttendeeController (formdata: FormData) {
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
    const parsedPhonePrefix = parseInt(phone_prefix);

    if (firstname && lastname && email && !isNaN(parsedPhone) && !isNaN(parsedPhonePrefix)) {
        return await CreateAttendee(event_id, firstname, lastname, email, parsedPhone, parsedPhonePrefix,parsedAdults,parsedArrival,parsedDeparture,parsedComment);
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
}

export async function  UpdateAttendeeController (formdata: FormData,id:string) {
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
    const parsedPhonePrefix = parseInt(phone_prefix);

    if (firstname && lastname && email && !isNaN(parsedPhone) && !isNaN(parsedPhonePrefix)) {
        return await UpdateAttendee(event_id, firstname, lastname, email, parsedPhone, parsedPhonePrefix,parsedAdults,parsedArrival,parsedDeparture,parsedComment);
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
}