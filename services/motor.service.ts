var cache = require("memory-cache");

export class MotorService {
  constructor(
    private system: {
      io: any;
      client: any;
    }
  ) {
    this.setup();
  }

  setup() {
    cache.put("options", {});

    this.system.client.on("forward", this.forward.bind(this));
    this.system.client.on("backward", this.backward.bind(this));
    this.system.client.on("stop", this.stop.bind(this));
    this.system.client.on("motor", this.motor.bind(this));
    this.system.client.on("setOnline", this.setOnline.bind(this));
    this.system.client.on("hello", this.hello.bind(this));
    this.system.client.on("disconnect", this.disconnect.bind(this));
  }

  stop(options: { client: string; motor: number }) {
    console.log("###stop ###", this.system.io.emit);
    this.system.io.to(options.client).emit("stop", options);
  }

  forward(options: { client: string; delay: number; rotations: number }) {
    console.log("### forward ###", this.system.io.emit);
    this.system.io.to(options.client).emit("StepperForward", options);
  }

  backward(options: { client: string; delay: number; rotations: number }) {
    console.log("### backward ###", this.system.io.emit);
    this.system.io.to(options.client).emit("StepperBackward", options);
  }

  motor(options: {
    delay: number;
    client: string;
    rotations: number;
    motor: string;
    direction: string;
  }) {
    console.log("### motor ###");
    this.system.io.to(options.client).emit("motor", options);
  }

  setOnline(options: { [motor: string]: string }) {
    const byName = {};
    Object.keys(options).forEach((key) => {
      byName[options[key]] = {
        name: options[key],
        motor: key,
        client: this.system.client.id,
        status: true,
      };
    });

    const currentOptions = cache.get("options");
    const updatedOptions = { ...currentOptions, ...byName };
    console.log("updatedOptions", updatedOptions);
    cache.put("options", updatedOptions);
    // this.system.io.emit("setOnline", options);
  }

  hello(fn) {
    console.log(`> hello`, cache.get("options"));
    this.system.io.emit("sayHello");
    fn(cache.get("options"));
  }

  disconnect() {
    console.log("### disconnect ###");
    let options = cache.get("options");
    Object.keys(options).forEach((key) => {
      if (options[key].client === this.system.client.id) {
        options[key].status = false;
      }
    });
    cache.put("options", options);
  }
}
