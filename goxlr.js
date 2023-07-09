const { goxlr } = require("goxlr");
const goxlrInstance = new goxlr("192.168.0.125", 14564);

(async () => {
  await goxlrInstance.setVolume("Mic", 50);
  await goxlrInstance.close();
})();
