'use server'

import { revalidatePath } from "next/cache"
import { CreateAttendee, UpdateAttendee } from "../db/queries/attendees"
import { redirect } from "next/navigation"
import { InputSMS, sendSMS } from "../sms/sms"
import moment from "moment"
import { sendMail } from "../mail/mail"

function calculateNightsBetweenDates(startDate: string | undefined, endDate: string | undefined): number | undefined {
    if (!startDate || !endDate) {
        return undefined
    }
    const start = moment(startDate);
    const end = moment(endDate);

    // Calculer la différence en jours
    const duration = end.diff(start, 'days');

    // Le nombre de nuits est égal à la différence de jours
    // Si la date de fin est la même que la date de début, il n'y a pas de nuit (retourne 0)
    return duration > 0 ? duration : 0;
}

export async function CreateAttendeeController(formdata: FormData, code: string) {
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
    let parsedAdults: number | undefined = undefined
    let parsedArrival: string | undefined = undefined
    let parsedDeparture: string | undefined = undefined
    let parsedComment: string | undefined = undefined
    if (adults != '') {
        parsedAdults = parseInt(adults)
    }
    if (arrival != '') {
        parsedArrival = arrival
    }
    if (departure != '') {
        parsedDeparture = departure
    }
    if (comment != '') {
        parsedComment = comment
    }
    const parsedPhone = parseInt(phone);

    if (firstname && lastname && email && !isNaN(parsedPhone)) {
        const attendee = await CreateAttendee(event_id, firstname, lastname, email, parsedPhone, phone_prefix, parsedAdults, parsedArrival, parsedDeparture, parsedComment, attending);
        // Example usage
        if (attendee.length > 0 && attendee[0].attending === 'oui') {

            let nb_night = calculateNightsBetweenDates(attendee[0].arrival, attendee[0].departure)
            let info = ''
            let link = ''
            let amount = 0
            if (nb_night) {
                amount = 39 * nb_night * (attendee[0].adults || 1)
                info = `
                Après quelques calculs (et oui, on a fait chauffer la calculette), pour ${attendee[0].adults} adultes et ${nb_night} nuit${nb_night > 1 ? 's' : ''}, ça te fera une modeste contribution de ${amount}€.Tu peux si tu le souhaites déjà envoyé ta contribution sur la cagnotte lydia :)`
                link = `<a href="${process.env.LYDIA_LINK}" style="
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        text-decoration: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 25px;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                        transition: background-color 0.3s ease, box-shadow 0.3s ease;
                    " 
                    onmouseover="this.style.backgroundColor='#0056b3'; this.style.boxShadow='0px 6px 8px rgba(0, 0, 0, 0.2)';"
                    onmouseout="this.style.backgroundColor='#007BFF'; this.style.boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)';"
                    >
                        Contribuer via lydia
                    </a>`
            }
            let vars = {
                firstname: attendee[0].firstname,
                lastname: attendee[0].lastname,
                day: moment(attendee[0].arrival).format("DD"),
                info: info,
                link: link
            }
            let tpl_string = process.env.API_MAILJET_TEMPLATE || '0'
            let tpl = parseInt(tpl_string)
            sendMail(attendee[0], tpl, vars)
                .then((response) => console.log('Mail Sent:', response))
                .catch((error) => console.error('Error:', error));

            /* const inputSMS: InputSMS = {
                recipient: `${attendee[0].phone_prefix}${attendee[0].phone}`,
                content: `Salut! ${attendee[0].firstname} ${attendee[0].lastname}. On se voit le ${moment(attendee[0].arrival).format("DD-MMM")}. A bientot :)`,
            };

            sendSMS(inputSMS)
                .then((response) => console.log('SMS Sent:', response))
                .catch((error) => console.error('Error:', error)); */
        }


        return attendee
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
}

export async function UpdateAttendeeController(formdata: FormData, code: string, id: string) {
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
    let parsedAdults: number | undefined = undefined
    let parsedArrival: string | undefined = undefined
    let parsedDeparture: string | undefined = undefined
    let parsedComment: string | undefined = undefined
    if (adults != '') {
        parsedAdults = parseInt(adults)
    }
    if (arrival != '') {
        parsedArrival = arrival
    }
    if (departure != '') {
        parsedDeparture = departure
    }
    if (comment != '') {
        parsedComment = comment
    }
    const parsedPhone = parseInt(phone);


    if (firstname && lastname && email && !isNaN(parsedPhone)) {
        const attendee = await UpdateAttendee(id, firstname, lastname, email, parsedPhone, phone_prefix, parsedAdults, parsedArrival, parsedDeparture, parsedComment, attending);
        if (attendee.length > 0 && attendee[0].attending === 'oui') {
            let nb_night = calculateNightsBetweenDates(attendee[0].arrival, attendee[0].departure)
            let info = ''
            let link = ''
            let amount = 0
            if (nb_night) {
                amount = 39 * nb_night * (attendee[0].adults || 1)
                info = `
                Après quelques calculs (et oui, on a fait chauffer la calculette), pour ${attendee[0].adults} adultes et ${nb_night} nuit${nb_night > 1 ? 's' : ''}, ça te fera une modeste contribution de ${amount}€.Tu peux si tu le souhaites déjà envoyé ta contribution sur la cagnotte lydia :)`
                link = `<a href="${process.env.LYDIA_LINK}" style="
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        text-decoration: none;
                        background-color: #007BFF;
                        color: white;
                        border-radius: 25px;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                        transition: background-color 0.3s ease, box-shadow 0.3s ease;
                    " 
                    onmouseover="this.style.backgroundColor='#0056b3'; this.style.boxShadow='0px 6px 8px rgba(0, 0, 0, 0.2)';"
                    onmouseout="this.style.backgroundColor='#007BFF'; this.style.boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)';"
                    >
                        Contribuer via lydia
                    </a>`
            }
            let vars = {
                firstname: attendee[0].firstname,
                lastname: attendee[0].lastname,
                day: moment(attendee[0].arrival).format("DD"),
                info: info,
                link: link
            }
            let tpl_string = process.env.API_MAILJET_TEMPLATE || '0'
            let tpl = parseInt(tpl_string)
            sendMail(attendee[0], tpl, vars)
                .then((response) => console.log('Mail Sent:', response))
                .catch((error) => console.error('Error:', error));

                
            /* const inputSMS: InputSMS = {
                recipient: `${attendee[0].phone_prefix}${attendee[0].phone}`,
                content: `Salut! ${attendee[0].firstname} ${attendee[0].lastname}. On se voit le ${moment(attendee[0].arrival).format("DD-MMM")}. A bientot :)`,
            };
            sendSMS(inputSMS)
                .then((response) => console.log('SMS Sent:', response))
                .catch((error) => console.error('Error:', error)); */
        }
        revalidatePath(`/rsvp/${code}/${id}`)
        return attendee
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
}