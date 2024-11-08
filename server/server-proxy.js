const http = require("http");
const httpProxy = require("http-proxy");

const host = "http://192.168.4.13";

const href = (dk) => host + ":" + dk;

const config = {
  servers: [
    {
      name: "apapia-sqk-weblogic-test.manmanbuy.com",
      target: "http://192.168.2.59:80",
    },
    {
      name: "dev.jd.jingcanmou.com",
      target: "http://192.168.3.120:9997",
    },
    {
      name: "dev.tm.jingcanmou.com",
      target: "http://192.168.3.120:8887",
    },
    {
      name: "http://dev.mmb.h5.com",
      target: "http://spu-test.manmanbuy.com",
    },
    {
      name: "dev-brand.com",
      target: "http://192.168.3.201:9994",
      urls: [
        {
          regExp: /\/mock/,
          target: "https://yapi.manmanbuy.com",
        },
        // {
        //   regExp: /\/api/,
        //   target: "https://t.jingcanmou.com",
        // },
        {
          regExp: /\/api/,
          target: "http://192.168.3.201:5000",
        },
      ],
    },
    ///////////////////
    {
      name: "www.dev-test.d2.com",
      target: href(3333),
      urls: [
        {
          regExp: /\/serve/,
          target: href(5000),
        },
        {
          regExp: /\/img/,
          target: href(8081),
        },
      ],
    },
  ],
};

const proxy = httpProxy.createProxyServer({});

proxy.on("error", function (err, req, res) {
  res.writeHead(500, { "Content-Type": "text/plain" });
  res.end("出错了");
});

const server = http.createServer(function (req, res) {
  const host = req.headers.host;
  const url = req.url;

  let pox = config.servers.find((el) => el.name === host);
  if (pox) {
    let urls = pox.urls || [];
    let urlPox = urls.find((el) => el.regExp.test(url));
    if (urlPox && urlPox.target) {
      let target = urlPox.target;
      console.log(pox.name + url + ">>>>>>>>>" + target);
      proxy.web(req, res, { target: target });
      return;
    }

    console.log(pox.name + ">>>>>>>>>" + pox.target);
    proxy.web(req, res, { target: pox.target });
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
  res.end("这个服务用来做代理!");
});

server.listen(80);
