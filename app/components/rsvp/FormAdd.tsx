

import styles from './form.module.css';

export default function Form({id}:{id:string}){
    console.log(id)
    return (
        <div className={styles['page-container']}>
            <form className={styles['form-container']}>
                <div className={styles['form-group']}>
                    <label htmlFor="nom">Nom:</label>
                    <input type="text" id="nom" name="nom" required />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="prenom">Prénom:</label>
                    <input type="text" id="prenom" name="prenom" required />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="prefix_phone">Préfixe Téléphone:</label>
                    <input type="text" id="prefix_phone" name="prefix_phone" required />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="phone">Téléphone:</label>
                    <input type="tel" id="phone" name="phone" required />
                </div>
                <button type="submit" className={styles['button']}>
                    Soumettre
                </button>
            </form>
        </div>
    );
};


