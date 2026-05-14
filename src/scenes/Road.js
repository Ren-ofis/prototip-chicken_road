// Road.js - Manages road lanes, vehicles, and collision detection
export default class Road {
  constructor(scene) {
    this.scene = scene;
    this.lanes = [];
    this.vehicles = [];
    this.laneGraphics = [];
    this.startLane = 0;
    this.initialize();
  }

  initialize() {
    // Draw road background
    const roadBg = this.scene.add.rectangle(960, 540, 1920, 1080, 0x2d2d3d);
    
    // Create road lanes with vehicles
    for (let i = 0; i < 12; i++) {
      const laneY = 900 - (i * 90);
      
      // Draw lane markers
      if (i > 0) {
        const line = this.scene.add.line(960, laneY, 0, 0, 1920, 0, 0x444455);
        line.setLineWidth(2);
      }
      
      this.lanes[i] = {
        y: laneY,
        vehicles: [],
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: 2 + (i * 0.2),
        spacing: 200 + Math.random() * 100,
      };
      
      this.createVehiclesForLane(i);
    }
  }

  createVehiclesForLane(laneIndex) {
    const lane = this.lanes[laneIndex];
    const vehicleCount = 2 + Math.floor(laneIndex / 3);
    
    for (let i = 0; i < vehicleCount; i++) {
      const x = Math.random() * 1920;
      const vehicle = this.scene.add.sprite(x, lane.y, "car");
      vehicle.setScale(0.12);
      if (lane.direction === -1) vehicle.setFlip(true, false);
      
      lane.vehicles.push({
        sprite: vehicle,
        x: x,
        width: 120,
      });
    }
  }

  update() {
    for (let i = 0; i < this.lanes.length; i++) {
      const lane = this.lanes[i];
      
      for (let v = 0; v < lane.vehicles.length; v++) {
        const vehicle = lane.vehicles[v];
        vehicle.x += lane.direction * lane.speed;
        vehicle.sprite.x = vehicle.x;
        
        // Wrap around
        if (lane.direction === 1 && vehicle.x > 2000) {
          vehicle.x = -200;
        } else if (lane.direction === -1 && vehicle.x < -200) {
          vehicle.x = 2000;
        }
      }
    }
  }

  checkCollision(chickenX, laneIndex) {
    if (laneIndex >= this.lanes.length) return false;
    
    const lane = this.lanes[laneIndex];
    const chickenWidth = 60;
    
    for (let v = 0; v < lane.vehicles.length; v++) {
      const vehicle = lane.vehicles[v];
      const vehicleLeft = vehicle.x - 60;
      const vehicleRight = vehicle.x + 60;
      const chickenLeft = chickenX - chickenWidth / 2;
      const chickenRight = chickenX + chickenWidth / 2;
      
      if (chickenLeft < vehicleRight && chickenRight > vehicleLeft) {
        return true;
      }
    }
    
    return false;
  }

  reset() {
    // Clear all vehicles
    for (let i = 0; i < this.lanes.length; i++) {
      for (let v = 0; v < this.lanes[i].vehicles.length; v++) {
        this.lanes[i].vehicles[v].sprite.destroy();
      }
    }
    
    this.lanes = [];
    this.initialize();
  }
}
