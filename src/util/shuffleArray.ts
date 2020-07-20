// Fisher-Yates shuffle
export const shuffleArray = (anArray: Array<any>): Array<any> => {
  const count = anArray.length - 1;
  for (let i = count; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = anArray[i];
    anArray[i] = anArray[j];
    anArray[j] = temp;
  }
  return anArray;
};
