const axios = require("axios");
const core = require("@actions/core");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function parse_to_delete(to_delete) {
  const files = [];

  if (!to_delete) {
    return files
  }

  const data = to_delete.split("\n").filter((d) => d != "");

  if (data.length === 0)
    throw new Error(
      "No files were defined, please ensure you enter destinations to upload your files!"
    );

  data.forEach((upload) => {
    const [root, name] = upload.trim().split("=>");

    if (!root || !name) return;

    files.push({
      root: root.trim(),
      files: [name.trim()],
    });
  });

  return files;
}

async function start() {
  const server = core.getInput("server");
  const api_key = core.getInput("api_key");
  const server_id = core.getInput("server_id");

  const power = core.getInput("power");
  const deletes = parse_to_delete(core.getInput("delete"));

  try {
    if (power) {
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
          console.log("Power action on server : " + power + " ...");
          await delay(5000);
        })
        .catch((error) => {
          core.setFailed(error);
        });
    }

    if (deletes) {
      for (const to_delete of deletes) {
        console.log(
          "Deleting file/folder on server : " + to_delete.root + " " + to_delete.files[0]
        )
        await axios
          .request({
            method: "post",
            maxBodyLength: Infinity,
            url: `https://${server}/api/client/servers/${server_id}/power`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${api_key}`,
            },
            data: JSON.stringify(to_delete),
          })
          .then(async () => {
            console.log(
              "Deletes file/folder on server : " + to_delete.root + " " + to_delete.files[0] +  " ... "
            );
            await delay(5000);
          })
          .catch((error) => {
            core.setFailed(error);
          });
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
}

start();
