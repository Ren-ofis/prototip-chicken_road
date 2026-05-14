export default class Main extends Phaser.Scene {
  constructor() {
    super("Main");
    this.lanes = [210, 360, 510, 660, 810, 960, 1110]; // X positions based on your image
    this.currentLane = -1; // -1 means the chicken is on the sidewalk
    this.isGameOver = false;
  }

  preload() {
    // Ensure your assets are loaded here
  }

  create() {
    // 1. Setup Physics Groups
    this.cars = this.physics.add.group();

    // 2. Add Chicken (Enabled for Physics)
    this.ch = this.physics.add.image(60, 600, "chicken").setScale(0.1, 0.1);
    this.ch.setDepth(10); // Keep chicken above road elements

    // 3. Static Elements (Manholes)
    this.lanes.forEach(laneX => {
      this.add.image(laneX, 600, "manhole").setScale(0.1).setAlpha(0.5);
    });

    // 4. Input: Move chicken to the next lane
    this.input.on('pointerdown', () => {
      if (this.isGameOver) return;

      this.currentLane++;
      if (this.currentLane < this.lanes.length) {
        this.ch.x = this.lanes[this.currentLane];
        // Optional: Add a little "jump" feel
        this.tweens.add({
          targets: this.ch,
          y: 580,
          duration: 100,
          yoyo: true
        });
      } else {
        console.log("You crossed the road!");
        // Reset or Reward logic here
      }
    });

    // 5. Spawn Cars Loop
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnCar,
      callbackScope: this,
      loop: true
    });

    // 6. Collision Detection
    this.physics.add.overlap(this.ch, this.cars, this.hitCar, null, this);
  }

  spawnCar() {
    if (this.isGameOver) return;

    // Pick a random lane
    const randomLane = Phaser.Utils.Array.GetRandom(this.lanes);
    
    // Create car at the top of the screen
    const car = this.cars.create(randomLane, -100, "car");
    car.setScale(0.1).setAngle(90);
    car.body.rotation = Math.PI;
    
    // Set speed (increase this for higher difficulty)
    car.setVelocityY(400); 
  }

  hitCar(chicken, car) {
    this.isGameOver = true;
    this.physics.pause();
    this.ch.setTint(0xff0000); // Turn red on death
    
    console.log("Game Over!");
    
    // Restart after 2 seconds
    this.time.delayedCall(2000, () => {
      this.scene.restart();
      this.currentLane = -1;
      this.isGameOver = false;
    });
  }

  update() {
    // Clean up cars that leave the screen to save memory
    this.cars.getChildren().forEach(car => {
      if (car.y > 800) {
        car.destroy();
      }
    });
  }
}