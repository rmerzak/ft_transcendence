'use client';
import { Link } from 'lucide-react'
import styles from '../../app/dashboard/game/page.module.css'
import Image from 'next/image'


function OnlineOrBot() {
  return (
    <div className={styles.container}>
      
      <div className={styles.title}>
        <h1>Game</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.type_container}>

          <div className={styles.row}>
            <h2 className={styles.typeOfGame}>Bot</h2>
            <button className={styles.game_choice}>

                <Image 
                  className={styles.game_img}
                  src='/bot.png'
                  alt="bot"
                  width={500}
                  height={500}
                  draggable="false"
                  />


            </button>
          </div>
          <div className={styles.row}>
            <h2 className={styles.typeOfGame}>Online</h2>
            <button className={styles.game_choice}>

                  <Image
                    className={styles.game_img}
                    src="/pong.jpg"
                    alt="pong"
                    width={500}
                    height={500}
                    draggable="false"
                    />

            </button>
          </div>
        </div>
          <p className={styles.paragraph}>
          Hello User, welcome to the game page. Here you can choose to play against a bot or online against another user.
          </p>
      </div>
    </div>
  )
}

export default OnlineOrBot