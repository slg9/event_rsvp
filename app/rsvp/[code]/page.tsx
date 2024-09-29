import { GetEventByCode } from "@/app/db/queries/events"
import styles from '@/app/components/rsvp/rsvp.module.css'
import RSVP from "@/app/components/rsvp/RSVP"


export default async function Home({ params,searchParams }: { params: { code: string },searchParams: { open_form?: string } }) {
  const event = await GetEventByCode(params.code)
  if (event.length === 0 || (event.length > 0 && !event[0].canva_url)) {
    return <div>not found</div>
  }
  return (
    <div className={styles.container}>
      <iframe loading="lazy" className={styles.iframe}
        src={event[0].canva_url} >
      </iframe>
      <RSVP id={event[0].id}/>

      
    </div>)
}

