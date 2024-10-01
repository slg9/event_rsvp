
import { GetEventByCode } from "@/app/db/queries/events"
import styles from '@/app/components/rsvp/rsvp.module.css'
import RSVP from "@/app/components/rsvp/RSVP"
import { ListAttendees } from "@/app/db/queries/attendees"
import { AggregateAdultsPerNight, NightOccupancy } from "@/app/utils/utils"


export default async function Home({ params, searchParams }: { params: { code: string }, searchParams: { open_form?: string } }) {
  const event = await GetEventByCode(params.code)

  if (event.length === 0 || (event.length > 0 && !event[0].canva_url)) {
    return <div>not found</div>
  }
  const attendees = await ListAttendees(undefined, event[0].id)
  let counters: NightOccupancy[] = [];
  if (attendees.length > 0) {
    counters = AggregateAdultsPerNight(attendees)
  }
  return (
    <div className={styles.container}>

      {searchParams?.open_form === "true" &&
        <iframe loading="lazy" className={styles.iframe}
          src={event[0].canva_url} >
        </iframe>
      }

      <RSVP
        id={event[0].id}
        attendee={undefined}
        code={params.code}
        audio_url={event[0].audio_url}
        counters={counters}
      />




    </div>)
}

