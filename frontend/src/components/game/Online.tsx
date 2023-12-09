'use client';
import { Link } from 'lucide-react'
import styles from '../../app/dashboard/game/page.module.css'
import React, { useState } from 'react';
import Image from 'next/image'
import { CirclePicker } from 'react-color';


function Online() {

  const [color, setColor] = useState('#ffffff');
  const handleChangeComplete = (color: { hex: React.SetStateAction<string>; }) => {
    setColor(color.hex);
  }

  const [selectedOption, setSelectedOption] = useState('paddle');

  const handleOptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
        <div className={styles.title}>
            <h1>Game</h1>
        </div>
        <div className={styles.container_for_content}>

            <div className={styles.content_left}>
                <div className={styles.game_preview}>
                  <h2 className={styles.typeOfGame}>Preview</h2>
                      <div className={styles.game_preview_div} style={{ backgroundColor: color}}>
                         
                      </div>
                  </div>
            </div>

            <div className={styles.content_right}>
                <div className={styles.color_picker}>
                  <h2 className={styles.typeOfGame}>Customize</h2>
                
                  <CirclePicker
                      color={ color }
                      onChangeComplete={ handleChangeComplete } 
                  />
                </div>

                <div className={styles.color_picker}>
                  <h2 className={styles.typeOfGame}>Choose</h2>
                
                  <div className={styles.radio_div}>
                    <label className={styles.label_op}>
                      <input
                        className={styles.radio_input}
                        type="radio"
                        value="paddle"
                        checked={selectedOption === 'paddle'}
                        onChange={handleOptionChange}
                      />
                      Paddle
                    </label>

                    <label className={styles.label_op}>
                      <input
                        className={styles.radio_input}
                        type="radio"
                        value="ball"
                        checked={selectedOption === 'ball'}
                        onChange={handleOptionChange}
                      />
                      Ball
                    </label>

                    <label className={styles.label_op}>
                      <input
                        className={styles.radio_input}
                        type="radio"
                        value="table"
                        checked={selectedOption === 'table'}
                        onChange={handleOptionChange}
                      />
                      Table
                    </label>

                  </div>
                </div>

            </div>
 
        </div>
    </>
    );
}

export default Online