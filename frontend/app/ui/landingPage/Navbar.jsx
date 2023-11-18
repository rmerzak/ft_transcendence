

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
      <img src="/pingsvg.svg" alt="menu" className="w-[50px] h-[50px] object-contain"/>
      <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white"> PingPong
      </h2>
      <button type='button' className='flex items-center h-fit py-4 px-6 bg-[#25618b] rounded-[32px] gap-[12px]'>
          <img src="/42_logo.svg" alt="head" className='w-[24px] h-[24px] object-contain' />
          <span className='font-normal text-[16px] text-white'>ENTER PINGPONG</span>
        </button>
    </div>
  </motion.nav>
);

export default Navbar;
