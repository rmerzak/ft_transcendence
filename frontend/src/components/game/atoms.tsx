import { atom } from 'jotai';

export enum Mode {
    normal = 0,
    challenge = 1,
}

export const themeAtom = atom<number>(-1)
export const botThemeAtom = atom<number>(0)
export const modeAtom = atom<number>(Mode.normal)
