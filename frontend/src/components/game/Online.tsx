'use client';
import { Link } from 'lucide-react'
import styles from '../../app/dashboard/game/page.module.css'
import React from 'react';
import { SketchPicker } from 'react-color';
import Image from 'next/image'


function Online() {
  return (
    <>
        <div className={styles.title}>
            <h1>Game</h1>
        </div>
        <div className={styles.container_for_content}>
            <div className={styles.content_left}>
                <h2 className={styles.typeOfGame}>Preview</h2>
                <div className={styles.game_preview}>
                    <Image
                        className={styles.preview_img}
                        src="/pong.jpg"
                        alt="pong"
                        width={500}
                        height={500}
                        draggable="false"
                        />
                </div>
            </div>
            <div className={styles.content_right}>
                <h2 className={styles.typeOfGame}>Customize</h2>
                <SketchPicker />
            </div>
                
        </div>
    </>
    );
}

export default Online