// Phaser import wrapper for Next.js
//phaser.js
let Phaser: any;

if (typeof window !== 'undefined') {
  Phaser = require('phaser');
}

export default Phaser;
export { Phaser };