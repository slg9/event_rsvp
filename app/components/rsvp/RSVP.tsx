'use client'

import React, { useCallback, useState } from 'react'
import ClickHere from './ClickHere'
import styles from './rsvp.module.css'
import FormAdd from './FormAdd'

function RSVP({id}:{id:string}) {
    const [isOpenForm, setOpenForm] = useState(false)
    const toggle = useCallback(() => {
        setOpenForm(o => !o)
    }, [])
    const handleFormSubmit = useCallback(() => {
        setOpenForm(false) // This will close the form
    }, [])
    return (
        <>
            <div style={{ position: "fixed",zIndex:3, right: 20, top: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div onClick={toggle} className={styles.btn_rsvp} > {!isOpenForm?"RSVP":"Retour"} </div>
                <ClickHere />
            </div>
            {isOpenForm && <div style={{zIndex:2,position:"absolute",backgroundColor:"rgba(0,0,0,0.8)"}}>
                <FormAdd id={id} onFormSubmit={handleFormSubmit}/>
            </div>}
        </>

    )
}

export default RSVP