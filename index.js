const { Service, Characteristic } = require("homebridge");
const { goxlr } = require("goxlr");
const goxlrInstance = new goxlr("192.168.0.125", 14564);

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
      async function getOnOffState() {
        const status = await goxlrInstance.getStatus();
        const mic =
          status.data.Status.mixers.S210500771CQK.button_down.Fader1Mute;
        return mic;
      }
      const state = await getOnOffState();
      callback(null, state);
      await goxlrInstance.close();
    } catch (error) {
      this.log.error("Failed to get light fader state:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the On characteristic
  async handleOnSet(value, callback) {
    try {
      async function toggleOnOffState(value) {
        if (value == true) {
          await goxlrInstance.setFaderMuteState("A", "Unmuted");
          return true;
        } else {
          await goxlrInstance.setFaderMuteState("A", "MutedToX");
          return true;
        }
      }
      await toggleOnOffState(value);
      callback(null);
      await goxlrInstance.close();
    } catch (error) {
      this.log.error("Failed to set light fader state:", error);
      callback(error);
    }
  }

  // Method to handle GET requests for the Brightness characteristic
  async handleBrightnessGet(callback) {
    try {
      async function getBrigtbess() {
        const data = await goxlrInstance.getStatus();
        const num = data.data.Status.mixers.S210500771CQK.levels.volumes.Mic;
        const brightness = Math.round((num / 255) * 100);
        return brightness;
      }
      const brightness = await getBrigtbess();
      callback(null, brightness);
      await goxlrInstance.close();
    } catch (error) {
      this.log.error("Failed to get light fader brightness:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the Brightness characteristic
  async handleBrightnessSet(value, callback) {
    try {
      async function setBrightness(value) {
        await goxlrInstance.setVolume("Mic", value);
      }
      await setBrightness(value);
      callback(null);
      await goxlrInstance.close();
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
