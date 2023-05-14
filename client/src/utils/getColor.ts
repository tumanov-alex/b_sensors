import { colors } from '../constants/colors.ts';

function getRandomColor(): string {
  const maxVal = 0xffffff; // 16777215
  let randomValue: number | string = Math.random() * maxVal;
  randomValue = Math.floor(randomValue);
  randomValue = randomValue.toString(16);
  const randColor = randomValue.padStart(6, '0');

  return `#${randColor.toUpperCase()}`;
}

export function getColor(id: string | number): string {
  return colors[Number(id)] || getRandomColor();
}
