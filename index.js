const { Service, Characteristic } = require("homebridge");
const { goxlr } = require("goxlr");
const goxlrInstance = new goxlr("192.168.0.125", 14564);
var currentStatus = null;

(async () => {
  setInterval(async () => {
    currentStatus = await goxlrInstance.getStatus();
  }, 1000);
})();

module.exports = (api) => {
  api.registerAccessory("MicGoXLRFader", MicGoXLRFader);
  api.registerAccessory("ChatoXLRFader", ChatoXLRFader);
  api.registerAccessory("MusicGoXLRFader", MusicGoXLRFader);
  api.registerAccessory("SystemGoXLRFader", SystemGoXLRFader);
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
      if (
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.Mic == 0
      ) {
        callback(null, false);
      } else callback(null, true);
    } catch (error) {
      this.log.error("Failed to get light fader state:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the On characteristic
  async handleOnSet(value, callback) {
    try {
      if (value == true) {
        await goxlrInstance.setFaderMuteState("A", "Unmuted");
      } else {
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
      const num =
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.Mic;
      const brightness = Math.round((num / 255) * 100);
      callback(null, brightness);
    } catch (error) {
      this.log.error("Failed to get light fader brightness:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the Brightness characteristic
  async handleBrightnessSet(value, callback) {
    try {
      await goxlrInstance.setVolume("Mic", value);
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

class ChatoXLRFader {
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
      if (
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.Chat == 0
      ) {
        callback(null, false);
      } else callback(null, true);
    } catch (error) {
      this.log.error("Failed to get light fader state:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the On characteristic
  async handleOnSet(value, callback) {
    try {
      if (value == true) {
        await goxlrInstance.setFaderMuteState("B", "Unmuted");
      } else {
        await goxlrInstance.setFaderMuteState("B", "MutedToX");
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
      const num =
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.Chat;
      const brightness = Math.round((num / 255) * 100);
      callback(null, brightness);
    } catch (error) {
      this.log.error("Failed to get light fader brightness:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the Brightness characteristic
  async handleBrightnessSet(value, callback) {
    try {
      await goxlrInstance.setVolume("Chat", value);
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

class MusicGoXLRFader {
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
      if (
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.Music == 0
      ) {
        callback(null, false);
      } else callback(null, true);
    } catch (error) {
      this.log.error("Failed to get light fader state:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the On characteristic
  async handleOnSet(value, callback) {
    try {
      if (value == true) {
        await goxlrInstance.setFaderMuteState("C", "Unmuted");
      } else {
        await goxlrInstance.setFaderMuteState("C", "MutedToX");
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
      const num =
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.Music;
      const brightness = Math.round((num / 255) * 100);
      callback(null, brightness);
    } catch (error) {
      this.log.error("Failed to get light fader brightness:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the Brightness characteristic
  async handleBrightnessSet(value, callback) {
    try {
      await goxlrInstance.setVolume("Music", value);
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

class SystemGoXLRFader {
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
      if (
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.System ==
        0
      ) {
        callback(null, false);
      } else callback(null, true);
    } catch (error) {
      this.log.error("Failed to get light fader state:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the On characteristic
  async handleOnSet(value, callback) {
    try {
      if (value == true) {
        await goxlrInstance.setFaderMuteState("D", "Unmuted");
      } else {
        await goxlrInstance.setFaderMuteState("D", "MutedToX");
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
      const num =
        currentStatus.data.Status.mixers.S210500771CQK.levels.volumes.System;
      const brightness = Math.round((num / 255) * 100);
      callback(null, brightness);
    } catch (error) {
      this.log.error("Failed to get light fader brightness:", error);
      callback(error);
    }
  }

  // Method to handle SET requests for the Brightness characteristic
  async handleBrightnessSet(value, callback) {
    try {
      await goxlrInstance.setVolume("System", value);
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
