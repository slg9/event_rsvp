'use client'
import React from 'react'
import Lottie from 'lottie-react';
import animationData from "../../assets/lotties/letter-send.json";
function LetterSend() {
    const style = {
        height: 120,
        width: 120,
    };
    return (

        <Lottie
            animationData={animationData}
            style={style}
        />

    )
}

export default LetterSend