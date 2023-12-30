'use client';
import { motion, MotionValue } from "framer-motion";
import { textContainer, textVariant2 } from "../../utils/motion";

interface TypingTextProps {
  title: string;
}

export const TypingText = ({ title }: TypingTextProps) => (
  <motion.p
    variants={textContainer}
    className={`font-normal text-[14px] text-neutral-100 text-center`}
  >
    {Array.from(title).map((letter: string, index: number) => (
      <motion.span variants={textVariant2} key={index}>
        {letter === ' ' ? '\u00A0' : letter}
      </motion.span>
    ))}
  </motion.p>
);

interface TitleTextProps {
  title: string;
}

export const TitleText = ({ title }: TitleTextProps) => (
  <motion.h2
    variants={textVariant2}
    initial="hidden"
    whileInView="show"
    className={`mt-[8px] font-bold md:text-[64px] text-[40px] text-white text-center`}
  >
    {title}
  </motion.h2>
);
