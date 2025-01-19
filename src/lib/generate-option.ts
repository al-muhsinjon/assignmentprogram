function generateCapitalOption<T>(array: T[]): T[] {
  const sampleSize = Math.min(3, array.length);
  const shuffled = array.slice().sort(() => 0.5 - Math.random());

  return shuffled.slice(0, sampleSize);
}

export default generateCapitalOption;
