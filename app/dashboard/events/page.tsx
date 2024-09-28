import { Event } from "@/app/db/models/events";
import { ListEvents } from "@/app/db/queries/events";

export default async function page(){
    const events = await ListEvents()
  return (
    <div className="container">
      {events.map((e:Event,k:any)=>(
        <div className="event_item" key={k}>{JSON.stringify(e)}</div>
      ))}
    </div>
  );
}