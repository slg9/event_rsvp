'use client'
import React from 'react'
import Lottie from 'lottie-react';
import animationData from "../../assets/lotties/click-here.json";
function ClickHere() {
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

export default ClickHere