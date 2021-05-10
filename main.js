#!/bin/node
const process = require('process');
/**
 * @typedef {{total:number, inCircle: number, calculatedPi: number}} Stats
 * @typedef {{x:number, y:number}} Point
 */

/**
 * @returns {Point} Random tacka sa (x,y) koordinatama
 */
const dajRandomTacku = () => { return { x: Math.random(), y: Math.random() }; };

/**
 * @param {Point} t Tacka
 * @returns {boolean} `true` ako je je tacka unutar kruznice, `false` u suprotnom
 */
const uKrugu = (t) => Math.sqrt(t.x * t.x + t.y * t.y) <= 1;

/**
 * @param {number} n broj koliko puta treba da ponovi generisanje tacke
 * @returns {Stats} statistiku za ovaj prolaz
 */
function ponoviNPuta(n) {
  let inside = 0;
  for (let i = 0; i < n; i++)
    if (uKrugu(dajRandomTacku()))
      inside++;
  return { total: n, inCircle: inside, calculatedPi: 4 * (inside / n) };
}

/**
 * @param {number} brojDecimala koliko decimala treba da se poklopi
 * @returns {Stats} statistiku za ovaj prolaz
 */
function ponavljajDoPreciznosti(brojDecimala) {
  let pi = Math.PI;
  let trebaBitiBarem = ('' + pi).substr(0, brojDecimala + 2);
  let inside = 0, generated = 0;
  let str = '';
  do {
    generated++;
    if (uKrugu(dajRandomTacku()))
      inside++;
    str = (4 * inside / generated).toString();
  } while (!str.startsWith(trebaBitiBarem));
  return { total: generated, inCircle: inside, calculatedPi: 4 * (inside / generated) };
}

/**
 * @param {string} arg 
 * @returns {boolean} `true` ako je naveden taj argument
 */
const imaArg = (arg) => !!process.argv.find(ar => ar === arg)
const argIndex = (arg) => process.argv.indexOf(arg);

/**
 * 
 * @param {number} dummy 
 * @returns {Stats} stats
 */
let metoda = (n) => { return { calculatedPi: 0, inCircle: 0, total: 0 }; }
let argVal = 0;

if (imaArg('-n')) {
  let nIdx = argIndex('-n') + 1;
  if (nIdx >= process.argv.length || nIdx === -1)
    throw new Error("Nakon -n argumenta moras navesti i broj!")
  argVal = parseInt(process.argv[nIdx]);
  metoda = ponoviNPuta;
}
else if (imaArg('-p')) {
  let pIdx = argIndex('-p') + 1;
  if (pIdx >= process.argv.length || pIdx === -1)
    throw new Error("Nakon -p argumenta moras navesti i broj!")
  argVal = parseInt(process.argv[pIdx]);
  metoda = ponavljajDoPreciznosti;
}
else {
  console.log("Moras navesti argument ili -n N za N generisanih tacaka, ili -p P za preciznost do P decimala");
  process.exit(0);
}
let rez = metoda(argVal);
console.log(`Nakon ${rez.total} tacaka njih ${rez.inCircle} je bilo u krugu i mislim da je pi ${rez.calculatedPi}`);
console.log(`JSPI: ${Math.PI}`);
console.log(`MOJPI:${rez.calculatedPi}`);