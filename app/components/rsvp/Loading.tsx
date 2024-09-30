'use client'
import React from 'react'
import Lottie from 'lottie-react';
import animationData from "../../assets/lotties/loading.json";
function Loading() {
    const style = {
        height: 400,
        width: 400,
    };
    return (

        <Lottie
            animationData={animationData}
            style={style}
        />

    )
}

export default Loading