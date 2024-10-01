import { Attendee } from "../db/models/attendees";

export type NightOccupancy = {
    day: string; // format DD
    count: number;
};

export function AggregateAdultsPerNight(attendees: Attendee[]): NightOccupancy[] {
    const occupancyMap: { [key: string]: number } = {};

    attendees.forEach((attendee) => {
        if (attendee.arrival && attendee.departure && attendee.adults) {
            const arrivalDate = new Date(attendee.arrival);
            const departureDate = new Date(attendee.departure);

            // On itère sur chaque jour entre l'arrivée et le départ
            let currentDate = arrivalDate;
            while (currentDate < departureDate) {
                const day = currentDate.getDate().toString().padStart(2, '0');

                // Ajouter le nombre d'adultes pour cette nuit
                if (!occupancyMap[day]) {
                    occupancyMap[day] = 0;
                }
                occupancyMap[day] += attendee.adults;

                // Passer au jour suivant
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

    });

    // Convertir le résultat en tableau d'objets NightOccupancy
    return Object.keys(occupancyMap).map((day) => ({
        day,
        count: occupancyMap[day],
    }));
}