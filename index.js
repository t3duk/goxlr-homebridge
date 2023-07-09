const { Service, Characteristic } = require("homebridge");
const { goxlr } = require("goxlr");
const goxlrInstance = new goxlr("192.168.0.125", 14564);

(async () => {
  const data = await goxlrInstance.getStatus();
  console.log(data);
  const num = data.data.Status.mixers.S210500771CQK.levels.volumes.Mic;
  console.log(Math.round((num / 255) * 100));
})();

module.exports = (api) => {
  api.registerAccessory("MicGoXLRFader", MicGoXLRFader);
};

class MicGoXLRFader {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.service = new this.api.hap.Service.Lightbulb(this.config.name);

    // Add the On characteristic
    this.service
      .getCharacteristic(this.api.hap.Characteristic.On)
      .on("get", this.handleOnGet.bind(this))
      .on("set", this.handleOnSet.bind(this));

    // Add the Brightness characteristic
    this.service
      .getCharacteristic(this.api.hap.Characteristic.Brightness)
      .on("get", this.handleBrightnessGet.bind(this))
      .on("set", this.handleBrightnessSet.bind(this));
  }

  // Method to handle GET requests for the On characteristic
  async handleOnGet(callback) {
    try {
      console.log("GLFS | Getting light fader state...");
      const status = await goxlrInstance.getStatus();
      console.log("GLFS | " + status);
      console.log(
        "GLFS | " +
          status.data.Status.mixers.S210500771CQK.button_down.Fader1Mute
      );
      callback(
        null,
        status.data.Status.mixers.S210500771CQK.button_down.Fader1Mute
      );
    } catch (error) {
      this.log.error("Failed to get light fader state:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the On characteristic
  async handleOnSet(value, callback) {
    try {
      console.log("SLFS | Setting light fader state...");
      if (value == true) {
        console.log("SLFS | Unmuting...");
        await goxlrInstance.setFaderMuteState("A", "Unmuted");
      } else {
        console.log("SLFS | Muting...");
        await goxlrInstance.setFaderMuteState("A", "MutedToX");
      }
      callback(null);
    } catch (error) {
      this.log.error("Failed to set light fader state:", error);
      callback(error);
    }
  }

  // Method to handle GET requests for the Brightness characteristic
  async handleBrightnessGet(callback) {
    try {
      console.log("GLFB | Getting light fader brightness...");
      const data = await goxlrInstance.getStatus();
      console.log("GLFB | " + data);
      const num = data.data.Status.mixers.S210500771CQK.levels.volumes.Mic;
      console.log("GLFB | " + num);
      const brightness = Math.round((num / 255) * 100);
      console.log("GLFB | " + brightness);
      callback(null, brightness);
    } catch (error) {
      this.log.error("Failed to get light fader brightness:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the Brightness characteristic
  async handleBrightnessSet(value, callback) {
    try {
      console.log("SLFB | Setting light fader brightness...");
      await goxlrInstance.setVolume("Mic", value);
      console.log("SLFB | Set light fader brightness to %s", value);
      callback(null);
    } catch (error) {
      this.log.error("Failed to set light fader brightness:", error);
      callback(error);
    }
  }

  // Method to expose the light fader's services and characteristics to Homebridge
  getServices() {
    return [this.service];
  }
}
