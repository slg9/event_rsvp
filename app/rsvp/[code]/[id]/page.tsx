import { GetEventByCode } from "@/app/db/queries/events"
import styles from '@/app/components/rsvp/rsvp.module.css'
import RSVP from "@/app/components/rsvp/RSVP"
import { GetAttendee, ListAttendees } from "@/app/db/queries/attendees"
import IframeLoader from "@/app/components/rsvp/IframeLoader"
import Loading from "@/app/components/rsvp/Loading"
import { AggregateAdultsPerNight, NightOccupancy } from "@/app/utils/utils"


export default async function Home({ params, searchParams }: { params: { code: string, id: string }, searchParams: { open_form: string } }) {
  const event = await GetEventByCode(params.code)
  if (event.length === 0 || (event.length > 0 && !event[0].canva_url)) {
    return <div>not found</div>
  }
  const attendee = await GetAttendee(params.id)
  if (attendee.length === 0 || (attendee.length > 0 && attendee[0].id === '')) {
    return <div>not found</div>
  }

  const attendees = await ListAttendees(undefined, event[0].id)
  let counters: NightOccupancy[] = [];
  if (attendees.length > 0) {
    counters = AggregateAdultsPerNight(attendees)
  }

  return (
    <div className={styles.container}>
      {event[0].canva_url &&
        <IframeLoader
          canvaUrl={event[0].canva_url}
          openForm={searchParams?.open_form === "true"}
        />
      }

      <RSVP
        id={event[0].id}
        attendee={attendee[0]}
        code={params.code}
        audio_url={event[0].audio_url}
        counters={counters}
      />

      


    </div>)
}

export const revalidate = 10; 
