"use client";

import { useState, useEffect } from 'react';
import styles from './rsvp.module.css';

interface IframeLoaderProps {
    canvaUrl: string;
    openForm: boolean;
}

export default function IframeLoader({ canvaUrl, openForm }: IframeLoaderProps) {
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);

    useEffect(() => {
        if (openForm && canvaUrl) {
            setIframeUrl(canvaUrl);
        } else {
            setIframeUrl(null);
        }
    }, [openForm, canvaUrl]);

    return (
        <>
            {iframeUrl && (
                <iframe
                    loading="lazy"
                    className={styles.iframe}
                    src={iframeUrl}
                ></iframe>
            )}
        </>
    );
}
