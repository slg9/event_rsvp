'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import ClickHere from './ClickHere'
import styles from './rsvp.module.css'
import FormAdd from './FormAdd'
import { Attendee } from '@/app/db/models/attendees'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import ReactAudioPlayer from 'react-audio-player'
import Link from 'next/link'
import Anouncement from './Anoucement'



function RSVP({ id, attendee, code, audio_url }: { id: string, attendee: Attendee | undefined, code: string, audio_url?: string }) {
    const [isOpenForm, setOpenForm] = useState(false)
    const audioPlayerRef = useRef<ReactAudioPlayer>(null);
    const pathname = usePathname()
    const searchParams = useSearchParams()

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
    }, [id, code, attendee])

    useEffect(() => {
        audioPlayerRef.current && audioPlayerRef.current.audioEl.current?.play();
        console.log(audioPlayerRef)
    }, [audioPlayerRef])


    const [showCard, setShowCard] = useState(false)

    useEffect(() => {
        let o = searchParams.get("open_form")
        if (o && o === "true") {
            setShowCard(true)
        }
    }, [searchParams])

    if (!showCard) {
        return <div className={styles["home_invitation"]}>
            <div style={{ display: "flex",alignItems:"center",fontWeight:"bold",fontSize:"30px" }}>
                <Anouncement />
                <div style={{ fontFamily: "'Patrick Hand', cursive", color: "#c2a767" }}>
                    Vous êtes invité!!
                </div>
            </div>

            <Link href={`${pathname}?open_form=true`} className={styles["btn_show"]}>Voir l'invitation</Link>
        </div>
    }
    return (
        <>
            {audio_url &&
                <ReactAudioPlayer
                    ref={audioPlayerRef}
                    src={audio_url}  // Utilise le chemin relatif depuis le dossier public
                    autoPlay={true}
                />
            }
            <div style={{ position: "fixed", zIndex: 3, right: 20, top: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div onClick={toggle} className={styles.btn_rsvp} > {!isOpenForm ? "RSVP" : "Retour"} </div>
                <ClickHere />
            </div>
            {isOpenForm && <div style={{ zIndex: 2, position: "absolute", backgroundColor: "rgba(0,0,0,0.8)" }}>
                <FormAdd id={id} code={code} onFormSubmit={handleFormSubmit} attendee={attendee} />
            </div>}
        </>

    )
}

export default RSVP