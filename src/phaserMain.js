import Preload from "./preload.js";
import Menu from "./scenes/Menu.js";
import Game from "./scenes/Game.js";
import GameOver from "./scenes/GameOver.js";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  transparent: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    }
  },
  plugins: {
    scene: [{
      key: 'rexUI',
      plugin: window.rexUI,
      mapping: 'rexUI'
    }]
  },
  backgroundColor: '#1a1a2e',
  audio: {
    disableWebAudio: false,
  }
};

const game = new Phaser.Game(config);
game.scene.add("Preload", Preload);
game.scene.add("Menu", Menu);
game.scene.add("Game", Game);
game.scene.add("GameOver", GameOver);
game.scene.start("Preload");
