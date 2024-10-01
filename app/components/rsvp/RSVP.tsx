'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import ClickHere from './ClickHere'
import styles from './rsvp.module.css'
import FormAdd from './FormAdd'
import { Attendee } from '@/app/db/models/attendees'
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReactAudioPlayer from 'react-audio-player'
import Link from 'next/link'
import Anouncement from './Anoucement'
import gsap, { Elastic, Power4 } from 'gsap'
import Loading from './Loading'

import CounterSVG from '../widget/CounterSVG'
import { NightOccupancy } from '@/app/utils/utils'



function RSVP({ id, attendee, code, audio_url, counters }: { id: string, attendee: Attendee | undefined, code: string, audio_url?: string, counters: NightOccupancy[] }) {
    const [isOpenForm, setOpenForm] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)
    const componentRef = useRef<HTMLDivElement>(null);
    const componentRefFirst = useRef<HTMLDivElement>(null);
    const audioPlayerRef = useRef<ReactAudioPlayer>(null);
    const pathname = usePathname()
    const searchParams = useSearchParams()



    const router = useRouter()

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

    const [showCard, setShowCard] = useState(attendee !== undefined)

    useEffect(() => {
        if (!searchParams.get("open_form")) setShowCard(false)
    }, [searchParams])

    const handleShowCard = () => {
        audioPlayerRef.current && audioPlayerRef.current.audioEl.current?.play();
        setShowCard(true)
        router.push(`${pathname}?open_form=true`)
    }

    useEffect(() => {
        if (isOpenForm && componentRef.current) {
            // Réinitialiser l'animation avant l'apparition
            gsap.set(componentRef.current, { scale: 0.8, opacity: 0, rotationY: 90 });

            // Animation d'apparition avec un effet élastique et rotation 3D
            gsap.to(componentRef.current, {
                scale: 1,
                opacity: 1,
                rotationY: 0,
                duration: 1.2,
                ease: Elastic.easeOut.config(1, 0.75),
                delay: 0.1,
            });
        } else if (!isOpenForm && componentRef.current) {
            // Animation de disparition avec un effet dynamique
            gsap.to(componentRef.current, {
                scale: 0.8,
                opacity: 0,
                rotationY: 90,
                duration: 0.6,
                ease: Power4.easeIn,
                onComplete: () => setOpenForm(false), // Cache l'élément après l'animation
            });
        }
    }, [isOpenForm]);

    useEffect(() => {
        if (!showCard && componentRefFirst.current) {
            // Réinitialiser l'animation avant l'apparition
            gsap.set(componentRefFirst.current, { scale: 0.8, opacity: 0, rotationY: 90 });

            // Animation d'apparition avec un effet élastique et rotation 3D
            gsap.to(componentRefFirst.current, {
                scale: 1,
                opacity: 1,
                rotationY: 0,
                duration: 1.2,
                ease: Elastic.easeOut.config(1, 0.75),
                delay: 0.1,
            });
        } else if (!showCard && componentRefFirst.current) {
            // Animation de disparition avec un effet dynamique
            gsap.to(componentRefFirst.current, {
                scale: 0.8,
                opacity: 0,
                rotationY: 90,
                duration: 0.6,
                ease: Power4.easeIn,
                onComplete: () => setShowCard(false), // Cache l'élément après l'animation
            });
        }
    }, [showCard]);

    useEffect(() => {
        let delay: number = attendee ? 0 : parseInt(process.env.NEXT_PUBLIC_DELAY_TRANSITON || "2") * 1000

        showCard && setTimeout(() => {
            console.log(process.env.NEXT_PUBLIC_DELAY_TRANSITON)
            setShowRSVP(true)
        }, delay)
    }, [showCard, attendee])


    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", zIndex: -1, width: "100vw", height: "100vh" }}>
                <Loading />
            </div>
            <div ref={componentRef} style={{ display: isOpenForm ? "block" : "none", zIndex: 3, position: "absolute", backgroundColor: "rgba(0,0,0,0.8)" }}>
                <FormAdd id={id} code={code} onFormSubmit={handleFormSubmit} attendee={attendee} />
            </div>
            {audio_url &&
                <ReactAudioPlayer
                    ref={audioPlayerRef}
                    src={audio_url}  // Utilise le chemin relatif depuis le dossier public
                    autoPlay={true}
                />
            }
            {
                !showCard ? <div ref={componentRefFirst} className={styles["home_invitation"]}>
                    <div style={{ display: "flex", alignItems: "center", fontWeight: "bold", fontSize: "30px" }}>
                        <img width={"300px"} src="/assets/gif/anouncement.gif" alt="message" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", fontWeight: "bold", fontSize: "30px" }}>
                        <Anouncement />
                    </div>
                    <button onClick={handleShowCard} className={styles["btn_show"]}>Ouvrir</button>
                </div> :
                    <>

                        {showRSVP && <div style={{ position: "sticky", zIndex: 4, right: 0, top: 20, paddingRight: 10, display: "flex", flexDirection: "column", alignItems: "end" }}>
                            <div onClick={toggle} className={styles.btn_rsvp} > {!isOpenForm ? "RSVP" : "Retour"} </div>
                            <ClickHere />

                        </div>}
                    </>

            }
            <div style={{ position: "absolute", zIndex: 2, left: 0, top: 0, paddingLeft: 10, display: "flex", flexDirection: "row", gap: "15px" }}>
                {counters.map((c, k) => (
                    <CounterSVG key={k} {...c} max={32} />
                ))}

            </div>


        </>

    )
}

export default RSVP