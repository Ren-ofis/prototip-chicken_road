import Preload from "./preload.js";
import Main from "./scenes/Main.js";

var config = {
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
          debug: true   
      }
    },
    backgroundColor: '#9a9a9a'
  };
var game = new Phaser.Game(config);
game.scene.add("Preload", Preload);
game.scene.add("Main", Main);
game.scene.start("Preload");

