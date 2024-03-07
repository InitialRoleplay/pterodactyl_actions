const axios = require("axios");
const core = require("@actions/core");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function start() {
  const server = core.getInput("server");
  const api_key = core.getInput("api_key");
  const server_id = core.getInput("server_id");
  const power = toString(core.getInput("power"));

  try {
    await axios
      .request({
        method: "post",
        maxBodyLength: Infinity,
        url: `https://${server}/api/client/servers/${server_id}/power`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
        data: JSON.stringify({
          signal: power,
        }),
      })
      .then(async () => {
        console.log("Action on server : " + power + " ...");
        await delay(5000);
      })
      .catch((error) => {
        core.setFailed(error);
      });
  } catch (error) {
    core.setFailed(error);
  }
}

start();