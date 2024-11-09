const { defineConfig } = require("@vue/cli-service");
const os = require('os');

function getIPs() {
  const interfaces = os.networkInterfaces();
  const ipList = [];
  for (const name of Object.keys(interfaces)) {
      for (const interface of interfaces[name]) {
          const {address, family, internal} = interface;
          if (family === 'IPv4' && !internal) {
              ipList.push(address);
          }
      }
  }
  return ipList;
}

const adress =getIPs()[0];

function setHref(prot) {
  console.log( adress )
  return 'http://'+ adress + ':' + prot
}



const config = defineConfig({
  transpileDependencies: true,
  devServer: {
    hot: true,
    allowedHosts: ["www.dev-test.d2.com"],
    proxy: {
      // "": {
      //   target: setHref(6066),
      //   changOrigin: true,
      // },
      "serve": {
        target: setHref(5000),
        changOrigin: true,
      },
 
      "/spu": {
        target: "https://spu.manmanbuy.com",
        changOrigin: true,
        pathRewrite: { "^/spu": "" },
      },
      // "/index_json.ashx":{
      //   target: "http://apapia-test.manmanbuy.com",
      //   changOrigin: true,
      // }
    },
  },
});

module.exports = config;
