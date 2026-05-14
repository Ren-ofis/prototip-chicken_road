// AssetGenerator.js - Generates simple graphics for the game
export class AssetGenerator {
  static createChickenTexture(graphics) {
    graphics.clear();
    graphics.fillStyle(0xffcc00);
    graphics.fillCircle(50, 30, 15); // Body
    graphics.fillCircle(50, 15, 8); // Head
    graphics.fillStyle(0xff9900);
    graphics.fillCircle(50, 35, 5); // Beak
    graphics.fillStyle(0xff6600);
    graphics.fillRect(45, 40, 4, 8); // Left leg
    graphics.fillRect(55, 40, 4, 8); // Right leg
  }
  
  static createCarTexture(graphics) {
    graphics.clear();
    graphics.fillStyle(0xff3333);
    graphics.fillRect(10, 20, 70, 30); // Body
    graphics.fillStyle(0x333333);
    graphics.fillRect(20, 10, 25, 15); // Front window
    graphics.fillRect(45, 10, 25, 15); // Back window
    graphics.fillStyle(0x222222);
    graphics.fillCircle(25, 50, 8); // Front wheel
    graphics.fillCircle(65, 50, 8); // Back wheel
  }
}
