import { GetEventByCode } from "@/app/db/queries/events"
import styles from './rsvp.module.css'

export async function page({ params }: { params: { code: string } }) {

  const event = await GetEventByCode(params.code)
  if (event.length===0 || (event.length>0 && !event[0].canva_url)){
    return <div>not found</div>
  }
  return (
    <div className={styles.container}>
      <iframe loading="lazy" className={styles.iframe}
        src={event[0].canva_url} >
      </iframe>
    </div>)
}

export default page