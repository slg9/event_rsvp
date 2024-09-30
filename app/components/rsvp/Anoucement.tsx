'use client'
import React from 'react'
import Lottie from 'lottie-react';
import animationData from "../../assets/lotties/anouncement.json";
function Anouncement() {
    const style = {
        height: 240,
        width: 240,
    };
    return (

        <Lottie
            animationData={animationData}
            style={style}
        />

    )
}

export default Anouncement