// import { requireVueFilesCom } from "@rainbow_ljy/v-hooks";
// const elements = requireVueFilesCom(require.context("./elements", true, /\.(vue|tsx|jsx)$/), {
//   name: "RChart",
// });
import * as echarts from "echarts";
window.echarts=echarts
import { stringUpperFirstCase } from "@rainbow_ljy/rainbow-js";

const elements = {};
const modules = import.meta.glob("./elements/**/*.vue", { eager: true });
Object.keys(modules).map((filePath) => {
  const fileName = filePath.replace(/\.\/elements\/([^]*?)\.(vue|tsx|jsx)/g, "$1");
  const Key = ["RChart", ...fileName.split("/").filter((el) => (el !== "index") )]
    .filter(Boolean)
    .map((k) => stringUpperFirstCase(k))
    .join("");

  const content = modules[filePath];
  for (const name in content) {
    if (Object.prototype.hasOwnProperty.call(content, name)) {
      if (name === "default" ) {
        elements[Key] = content.default || {};
      }
      if (name !== "default" ) {
        const k = [Key, name].filter(Boolean).join("");
        elements[k] = content[name];
      }
    }
  }
});

console.log(elements);

export const {
  RChartAnnular,
  RChartBubble,
  RChartCake,
  RChartData,
  RChartHoc,
  RChartmerge,
  RChart,
  RChartLinear,
  RChartHistory,
  RChartSerieLinear,
  RChartSerieAnnular,
  RChartSerieAvg,
  RChartSerieBubble,
  RChartSerieCake,
  RChartSerieCount,
  RChartSerieHoc,
  RChartSerie,
  RChartSerieMoney,
  RChartSerieMoneyLinear,
  RChartSerieTreeCake,
  RChartSerieHistoryLine,
  RChartXaxiHistory,
  RChartXaxiBubble,
  RChartXaxiHoc,
  RChartXaxi,
  RChartYaxiHistory,
  RChartYaxiBubble,
  RChartYaxiHoc,
  RChartYaxi,

} = elements;
