

'use client';
import {motion} from 'framer-motion';
import styles from '../../ui/index.js';
import { navVariants } from '../../utils/motion.js';
const Navbar = () => (
  <motion.nav variants={navVariants} initial="hidden" whileInView="show" className={`${styles.xPaddings} py-8 relative`}>
   <div className="absolute w-[50%] inset-0 gradient-01" />
    <div
      className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}
    >
      <img src="/42_logo.svg" alt="search" className="w-[30px] h-[30px] object-contain "/>
      <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white"> PingPong
      </h2>
      <img src="/pingsvg.svg" alt="menu" className="w-[30px] h-[30px] object-contain"
      />
    </div>
  </motion.nav>
);

export default Navbar;
