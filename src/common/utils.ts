function getRandomInt(min: number, max: number): number
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitary(min: number, max: number): number
{
  return Math.random() * (max - min) + min;
}

function enumValues(en: any): Array<number>
{
  return Object.keys(en).filter(k => typeof en[k] === "number").map(k => en[k] as number);
}