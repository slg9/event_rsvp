import { GetEventByCode } from "@/app/db/queries/events"
import styles from './rsvp.module.css'
import ClickHere from "@/app/components/rsvp/ClickHere"

export default async function Home({ params }: { params: { code: string } }) {

  const event = await GetEventByCode(params.code)
  if (event.length === 0 || (event.length > 0 && !event[0].canva_url)) {
    return <div>not found</div>
  }
  return (
    <div className={styles.container}>
      <iframe loading="lazy" className={styles.iframe}
        src={event[0].canva_url} >
      </iframe>
      <div style={{position:"absolute",right:20,top:20,display:"flex",flexDirection:"column", alignItems:"center"}}>
        <div className={styles.btn_rsvp} >RSVP</div>
          <ClickHere />
      </div>

    </div>)
}

