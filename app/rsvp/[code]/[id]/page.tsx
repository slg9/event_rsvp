import { GetEventByCode } from "@/app/db/queries/events"
import styles from '@/app/components/rsvp/rsvp.module.css'
import RSVP from "@/app/components/rsvp/RSVP"
import { GetAttendee } from "@/app/db/queries/attendees"


export default async function Home({ params }: { params: { code: string,id:string } }) {
  const event = await GetEventByCode(params.code)
  if (event.length === 0 || (event.length > 0 && !event[0].canva_url)) {
    return <div>not found</div>
  }
  const attendee = await GetAttendee(params.id)
  if (attendee.length === 0 || (attendee.length > 0 && attendee[0].id === '')) {
    return <div>not found</div>
  }
  return (
    <div className={styles.container}>
      <iframe loading="lazy" className={styles.iframe}
        src={event[0].canva_url} >
      </iframe>
      <RSVP id={event[0].id} attendee={attendee[0]} code={params.code} />

      
    </div>)
}

