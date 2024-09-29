'use client'

import { useCallback, useState } from 'react';
import styles from './form.module.css';
import { CreateAttendeeController } from '@/app/controller/attendees';
import LetterSend from './LetterSend';

export default function Form({ id, onFormSubmit }: { id: string, onFormSubmit: () => void }) {
    const [loading, setLoading] = useState(false)
    const [isAttending, setIsAttending] = useState<string | null>(null); // État pour gérer le choix "oui/non"

    const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement automatique de la page
        setLoading(true); // Activer l'état de chargement
        const formData = new FormData(e.currentTarget); // Récupérer les données du formulaire
        try {
            await CreateAttendeeController(formData); // Appeler le contrôleur côté serveur
            ; // Action à effectuer après soumission
        } catch (error) {
            console.error('Erreur lors de la soumission:', error); // Gérer les erreurs
        } finally {
            onFormSubmit()
            setLoading(false); // Désactiver l'état de chargement après la soumission
        }
    }, [onFormSubmit]);

    return (
        <div className={styles['page-container']}>
            <form onSubmit={handleFormSubmit} method="post" className={styles['form-container']}>
                <input type="hidden" name="event_id" value={id} />

                {/* Nom et Prénom sur la même ligne */}
                <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="lastname">Nom:</label>
                        <input type="text" id="lastname" name="lastname" required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="firstname">Prénom:</label>
                        <input type="text" id="firstname" name="firstname" required />
                    </div>
                </div>

                {/* Email sur une ligne séparée */}
                <div className={styles['form-group']}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>

                {/* Préfixe Téléphone et Téléphone sur la même ligne */}
                <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="phone_prefix">Préfixe Téléphone:</label>
                        <input type="number" id="phone_prefix" name="phone_prefix" required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="phone">Téléphone:</label>
                        <input type="number" id="phone" name="phone" required />
                    </div>
                </div>

                {/* Switchbox pour répondre si la personne vient ou non */}
                <div className={styles['form-row']}>

                    <div className={styles['radio-group']}>
                        <label style={{ color: "white" }} htmlFor="attending">Je viens :</label>
                        <label>
                            <input type="radio" id="attending-yes" name="attending" value="oui" required onChange={() => setIsAttending('oui')} />
                            Oui
                        </label>
                        <label>
                            <input type="radio" id="attending-no" name="attending" value="non" required onChange={() => setIsAttending('non')} />
                            Non
                        </label>
                    </div>
                    {isAttending === "oui" &&
                        <div className={styles['form-group']}>
                            <label htmlFor="adults">Nombre d'adultes:</label>
                            <input type="number" id="adults" name="adults" />
                        </div>
                    }

                </div>

                {isAttending === "oui" &&
                    <>
                        <div className={styles['form-row']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="bring">Ce que vous apportez:</label>
                                <textarea id="bring" name="bring"></textarea>
                            </div>
                        </div>

                        {/* Date d'arrivée et Date de retour, limitées aux 11, 12, et 13 octobre */}
                        <div className={styles['form-row']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="arrival">Date d'arrivée:</label>
                                <input type="date" id="arrival" name="arrival" min="2024-10-11" max="2024-10-13" required />
                            </div>
                            <div className={styles['form-group']}>
                                <label htmlFor="departure">Date de départ:</label>
                                <input type="date" id="departure" name="departure" min="2024-10-11" max="2024-10-13" required />
                            </div>
                        </div>
                    </>
                }

                {/* Bouton de soumission */}
                {loading ? <div style={{ display: "flex", justifyContent: "center" }}> <LetterSend /> </div> :
                    <button type="submit" disabled={loading} className={styles['button']}>
                        Envoyer
                    </button>}
            </form>
        </div>
    );
};
