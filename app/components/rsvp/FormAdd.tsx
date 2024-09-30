'use client'

import { useCallback, useEffect, useState } from 'react';
import styles from './form.module.css';
import { CreateAttendeeController, UpdateAttendeeController } from '@/app/controller/attendees';
import LetterSend from './LetterSend';
import { Attendee } from '@/app/db/models/attendees';
import Success from './Success';
import moment from 'moment';
import { redirect, useRouter } from 'next/navigation';

export default function Form({ id, onFormSubmit, attendee, code }: { id: string, onFormSubmit: () => void, attendee: Attendee | undefined, code: string }) {
    const [loading, setLoading] = useState(false)
    const [isAttending, setIsAttending] = useState<string | null>(null); // État pour gérer le choix "oui/non"
    const [attendeeCreated, setAttendeeCreated] = useState<Attendee | undefined>(attendee)
    const [attendeeIsUpdate, setAttendeeIsUpdated] = useState(false)
    const router = useRouter()
    const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement automatique de la page
        setLoading(true); // Activer l'état de chargement
        const formData = new FormData(e.currentTarget); // Récupérer les données du formulaire
        if (attendee === undefined) {
            CreateAttendeeController(formData,code).then(res => {
                if (res.length > 0 && res[0].id != '') {
                    setAttendeeCreated(res[0])
                    setAttendeeIsUpdated(true)
                    localStorage.setItem(id, res[0].id)
                    router.push(`/rsvp/${code}/${res[0].id}?open_form=true`);
                }
                setLoading(false);
              
            })

        } else {

            UpdateAttendeeController(formData, code, attendee.id).then(res => {
                if (res.length > 0 && res[0].id != '') {
                    setAttendeeCreated(res[0])
                    setAttendeeIsUpdated(true)
                }
                setLoading(false);
            })

        }


    }, []);

    useEffect(() => {
        if (attendee) {
            setIsAttending(attendee.attending)
        }
    }, [attendee])

    useEffect(() => {
        attendeeIsUpdate && setTimeout(() => {
            setAttendeeIsUpdated(false)
        }, 4000)
    }, [attendeeIsUpdate])

    return (
        <div className={styles['page-container']}>

            <form onSubmit={handleFormSubmit} method="post" className={styles['form-container']}>

                <input type="hidden" name="event_id" value={id} />

                {/* Nom et Prénom sur la même ligne */}
                <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="lastname">Nom:</label>
                        <input type="text" id="lastname" name="lastname" required defaultValue={attendeeCreated?.lastname || ''} />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="firstname">Prénom:</label>
                        <input type="text" id="firstname" name="firstname" required defaultValue={attendeeCreated?.firstname || ''} />
                    </div>
                </div>

                {/* Email sur une ligne séparée */}
                <div className={styles['form-group']}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required defaultValue={attendeeCreated?.email || ''} />
                </div>

                {/* Préfixe Téléphone et Téléphone sur la même ligne */}
                <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="phone_prefix">Préfixe Téléphone:</label>
                        <input type="number" id="phone_prefix" name="phone_prefix" required defaultValue={attendeeCreated?.phone_prefix || ''} />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="phone">Téléphone:</label>
                        <input type="number" id="phone" name="phone" required defaultValue={attendeeCreated?.phone || ''} />
                    </div>
                </div>

                {/* Switchbox pour répondre si la personne vient ou non */}
                <div className={styles['form-row']}>

                    <div className={styles['radio-group']}>
                        <label style={{ color: "white" }} htmlFor="attending">Je viens :</label>
                        <label>
                            <input type="radio" checked={isAttending === "oui"} id="attending-yes" name="attending" value="oui" required onChange={() => setIsAttending('oui')} />
                            Oui
                        </label>
                        <label>
                            <input type="radio" id="attending-no" checked={isAttending === "non"} name="attending" value="non" required onChange={() => setIsAttending('non')} />
                            Non
                        </label>
                    </div>
                    {isAttending === "oui" &&
                        <div className={styles['form-group']}>
                            <label htmlFor="adults">Nombre d'adultes:</label>
                            <input type="number" id="adults" name="adults" required defaultValue={attendeeCreated?.adults || ''} />
                        </div>
                    }

                </div>

                {isAttending === "oui" &&
                    <>
                        <div className={styles['form-row']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="comment">Ce que vous apportez:</label>
                                <textarea id="comment" name="comment" defaultValue={attendeeCreated?.comment || ''}></textarea>
                            </div>
                        </div>

                        {/* Date d'arrivée et Date de retour, limitées aux 11, 12, et 13 octobre */}
                        <div className={styles['form-row']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="arrival">Date d'arrivée:</label>
                                <input type="date" id="arrival" name="arrival" min="2024-10-11" max="2024-10-13" required defaultValue={moment(attendeeCreated?.arrival).format("YYYY-MM-DD") || ''} />
                            </div>
                            <div className={styles['form-group']}>
                                <label htmlFor="departure">Date de départ:</label>
                                <input type="date" id="departure" name="departure" min="2024-10-11" max="2024-10-13" required defaultValue={moment(attendeeCreated?.departure).format("YYYY-MM-DD") || ''} />
                            </div>
                        </div>
                    </>
                }

                {/* Bouton de soumission */}
                {loading ? <div style={{ display: "flex", justifyContent: "center" }}> <LetterSend /> </div> :
                    <button type="submit" disabled={loading} className={styles['button']}>
                        {attendee === undefined ? "Envoyer" : "Mettre à jour"}
                    </button>}
                {attendeeIsUpdate &&
                    <div className={styles.message}>
                        <span>{`Votre réponse a bien été ${attendee ? "mise à jour" : "envoyée"}`}</span>
                        <Success />
                    </div>

                }
            </form>





        </div>
    );
};
