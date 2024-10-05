'use server'

import { revalidatePath } from "next/cache"
import { CreateAttendee, ListAttendees, UpdateAttendee } from "../db/queries/attendees"
import { redirect } from "next/navigation"
import { InputSMS, sendSMS } from "../sms/sms"
import moment from "moment"
import { sendMail } from "../mail/mail"
import { Attendee } from "../db/models/attendees"

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


interface SummaryData {
    solo: number;
    couples: number;
    families: number;
    soloAdults: number;
    coupleAdults: number;
    familyAdults: number;
}

export async function SendRecap(event_id: string) {
    const attendees = await ListAttendees(undefined, event_id);

    const dates = ['2024-10-11', '2024-10-12', '2024-10-13'];

    // Initialize summary and dinner data
    const summaryData: { [key: string]: SummaryData } = {};
    const dinnerData: { [key: string]: number } = {};

    dates.forEach(date => {
        summaryData[date] = {
            solo: 0,
            couples: 0,
            families: 0,
            soloAdults: 0,
            coupleAdults: 0,
            familyAdults: 0
        };
        dinnerData[date] = 0;
    });

    // Helper to check if a date is within the range [arrival, departure]
    function isWithinDateRange(date: string, arrival: string, departure: string): boolean {
        const checkDate = moment(date, 'YYYY-MM-DD');
        const arrivalDate = moment(arrival, 'YYYY-MM-DD');
        const departureDate = moment(departure, 'YYYY-MM-DD');

        // Check if the date is between arrival and departure (inclusive)
        return checkDate.isBetween(arrivalDate, departureDate, undefined, '[]');
    }

    // Process the attendees
    attendees.forEach(attendee => {
        const { arrival, departure, adults, attending } = attendee;

        // Loop over the dates to update summary and dinner data for the range
        if (attending === "oui") {
            dates.forEach(date => {
                if (arrival && departure && adults && isWithinDateRange(date, arrival, departure)) {
                    // Update room summary and aggregate adult numbers
                    if (adults === 1) {
                        summaryData[date].solo++;
                        summaryData[date].soloAdults += adults;
                    } else if (adults === 2) {
                        summaryData[date].couples++;
                        summaryData[date].coupleAdults += adults;
                    } else {
                        summaryData[date].families++;
                        summaryData[date].familyAdults += adults;
                    }

                    // Update dinner count
                    dinnerData[date] += adults;
                }
            });
        }
    });

    // Inline styles for tables and cells
    const tableStyle = `
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        margin-top: 20px;
    `;

    const thStyle = `
        background-color: #f8f9fa;
        color: #333;
        font-weight: bold;
        padding: 12px;
        border: 1px solid #ddd;
    `;

    const tdStyle = `
        padding: 10px;
        border: 1px solid #ddd;
        text-align: center;
    `;

    const headerStyle = `
        text-align: left;
        color: #495057;
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: bold;
    `;

    // Generate the room summary table with actual adult numbers in brackets
    let summaryTableHTML = `
        <h2 style="${headerStyle}">Partage des Chambres la nuits</h2>
        <table style="${tableStyle}">
            <thead>
                <tr>
                    <th style="${thStyle}">Date</th>
                    <th style="${thStyle}">Invité Solo[nb adultes]</th>
                    <th style="${thStyle}">Couples[nb adultes]</th>
                    <th style="${thStyle}">Familles (+2 ads)[nb adultes]</th>
                </tr>
            </thead>
            <tbody>
    `;

    dates.forEach(date => {
        const { solo, couples, families, soloAdults, coupleAdults, familyAdults } = summaryData[date];
        summaryTableHTML += `
            <tr>
                <td style="${tdStyle}">${moment(date).format("DD")} Octobre</td>
                <td style="${tdStyle}">${solo} [${soloAdults}]</td>
                <td style="${tdStyle}">${couples} [${coupleAdults}]</td>
                <td style="${tdStyle}">${families} [${familyAdults}]</td>
            </tr>
        `;
    });

    summaryTableHTML += `</tbody></table>`;

    // Generate the dinner guests table with inline CSS
    let dinnerTableHTML = `
        <h2 style="${headerStyle}">Personnes qui mangent par jour</h2>
        <table style="${tableStyle}">
            <thead>
                <tr>
                    <th style="${thStyle}">Date</th>
                    <th style="${thStyle}">Total Adultes pour Repas</th>
                </tr>
            </thead>
            <tbody>
    `;

    dates.forEach(date => {
        const totalAdults = dinnerData[date];
        dinnerTableHTML += `
            <tr>
                <td style="${tdStyle}">${moment(date).format("DD")} Octobre</td>
                <td style="${tdStyle}">${totalAdults}</td>
            </tr>
        `;
    });

    dinnerTableHTML += `</tbody></table>`;

    // Generate the individual attendee details table with stay period (Séjour du à)
    let attendeeTableHTML = `
        <h2 style="${headerStyle}"> Details des invites</h2>
        <table style="${tableStyle}">
            <thead>
                <tr>
                    <th style="${thStyle};width:70px">Prénom</th>
                    <th style="${thStyle};width:70px">Nom</th>
                    <th style="${thStyle}">Viens?</th>
                    <th style="${thStyle}">Nb adultes</th>
                    <th style="${thStyle}">Séjour</th>
                    <th style="${thStyle}">Commentaire</th>
                </tr>
            </thead>
            <tbody>
    `;

    attendees.forEach(attendee => {
        const { firstname, lastname, adults, comment, attending, arrival, departure } = attendee;
        attendeeTableHTML += `
            <tr>
                <td style="${tdStyle};width:70px">${firstname}</td>
                <td style="${tdStyle};width:70px">${lastname}</td>
                <td style="${tdStyle}">${attending === "oui" ? "Oui" : "Non"}</td>
                <td style="${tdStyle}">${adults || ""}</td>
                <td style="${tdStyle}">${!arrival ? "" : ` du ${moment(arrival).format("DD")} à ${moment(departure).format("DD")}`}</td>
                <td style="${tdStyle}">${comment || ''}</td>
            </tr>
        `;
    });

    attendeeTableHTML += `</tbody></table>`;

    // Construct the email body
    const body = summaryTableHTML + dinnerTableHTML + attendeeTableHTML;
    const vars = {
        recap: body
    };

    const tpl_string = process.env.API_MAILJET_TEMPLATEREC || '0';
    const tpl = parseInt(tpl_string);
    const to = attendees.find(a => a.email === "slegros9@gmail.com");

    // Send the email if a matching attendee is found
    if (to) {
        sendMail(to, tpl, vars)
            .then((response) => console.log('Mail Sent:', response))
            .catch((error) => console.error('Error:', error));
    }
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
    const comment = formdata.get("comment") as string || ''
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
                link = getButton(`${process.env.FRONT_HOST}/rsvp/${code}/${attendee[0].id}`)
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

            const inputSMS: InputSMS = {
                recipient: `${attendee[0].phone_prefix}${attendee[0].phone}`,
                content: `Salut! ${attendee[0].firstname} ${attendee[0].lastname}. On se voit le ${moment(attendee[0].arrival).format("DD-MMM")}. A bientot :) Tu peux modifier ta réponse via le mail que tu as reçu ;)`,
            };

            sendSMS(inputSMS)
                .then((response) => console.log('SMS Sent:', response))
                .catch((error) => console.error('Error:', error));
            SendRecap(event_id)
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
    const comment = formdata.get("comment") as string || ''
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
                link = getButton(`${process.env.FRONT_HOST}/rsvp/${code}/${attendee[0].id}`)
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


            const inputSMS: InputSMS = {
                recipient: `${attendee[0].phone_prefix}${attendee[0].phone}`,
                content: `Salut! ${attendee[0].firstname} ${attendee[0].lastname}.La modif a été prise en compte ;). On se voit le ${moment(attendee[0].arrival).format("DD-MMM")}. A bientot :)`,
            };
            sendSMS(inputSMS)
                .then((response) => console.log('SMS Sent:', response))
                .catch((error) => console.error('Error:', error));

            SendRecap(event_id)
        }
        revalidatePath(`/rsvp/${code}/${id}`)
        return attendee
    } else {
        throw new Error('Données de formulaire manquantes ou incorrectes');
    }
}

function getButton(link: string) {
    return `
    <div style="display: flex; justify-content: space-between; gap: 20px;">
    <a href="${process.env.LYDIA_LINK}" style="
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
                        Contribuer via Lydia
    </a>

    <a href="${link}" style="
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
                        Modifier ma réponse
    </a>
</div>

    `
}