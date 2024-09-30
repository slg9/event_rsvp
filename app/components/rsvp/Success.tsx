'use client'
import React from 'react'
import Lottie from 'lottie-react';
import animationData from "../../assets/lotties/success.json";
function Success() {
    const style = {
        height: 60,
        width: 60,
    };
    return (

        <Lottie
            animationData={animationData}
            style={style}
        />

    )
}

export default Success