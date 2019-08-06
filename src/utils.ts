function getRandomInt(min: number, max: number): number
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitary(min: number, max: number): number
{
  return Math.random() * (max - min) + min;
}
