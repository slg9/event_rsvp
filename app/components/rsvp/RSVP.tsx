'use client'

import React, { useCallback, useEffect, useState } from 'react'
import ClickHere from './ClickHere'
import styles from './rsvp.module.css'
import FormAdd from './FormAdd'
import { Attendee } from '@/app/db/models/attendees'
import { redirect } from 'next/navigation'


function RSVP({ id, attendee,code }: { id: string, attendee: Attendee | undefined,code:string }) {
    const [isOpenForm, setOpenForm] = useState(false)
    const toggle = useCallback(() => {
        setOpenForm(o => !o)
    }, [])
    const handleFormSubmit = useCallback(() => {
        setOpenForm(false) // This will close the form
    }, [])

    useEffect(() => {
        if (attendee === undefined) {
          const attendee_id = localStorage.getItem(id)
          if (attendee_id !== null) {
            redirect(`/rsvp/${code}/${attendee_id}`)
          }
        }
      }, [id, code,attendee])
   

    return (
        <>
            <div style={{ position: "fixed", zIndex: 3, right: 20, top: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div onClick={toggle} className={styles.btn_rsvp} > {!isOpenForm ? "RSVP" : "Retour"} </div>
                <ClickHere />
            </div>
            {isOpenForm && <div style={{ zIndex: 2, position: "absolute", backgroundColor: "rgba(0,0,0,0.8)" }}>
                <FormAdd id={id} onFormSubmit={handleFormSubmit} attendee={attendee} />
            </div>}
        </>

    )
}

export default RSVP