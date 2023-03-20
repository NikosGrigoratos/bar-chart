import {
  select,
  line,
  curveCardinal,
  axisBottom,
  axisRight,
  scaleLinear,
  scaleBand,
} from "d3";
import { useRef, useEffect, useState } from "react";
import "./App.css";

const CHART_WIDTH = 700;
const CHART_HEIGHT = 400;

function App() {
  const [data, setData] = useState([
    [25, 0],
    [30, 1],
    [45, 2],
    [60, 3],
    [20, 4],
    [85, 5],
    [5, 6],
  ]);
  const svgRef = useRef();

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  useEffect(() => {
    const svg = select(svgRef.current);

    // const xScale = scaleLinear()
    //   .domain([0, data.length - 1])
    //   .range([0, CHART_WIDTH]);

    const xScale = scaleBand()
      .domain(data.map((d, i) => `DATA-${i}`))
      .range([0, CHART_WIDTH])
      .padding(0.5);

    // const xAxis = axisBottom(xScale)
    //   .ticks(data?.length)
    //   .tickFormat((index) => index + 1);

    const xAxis = axisBottom(xScale).ticks(data?.length);

    svg
      .select(".x-axis")
      .style("transform", `translateY(${CHART_HEIGHT}px)`)
      .call(xAxis);

    const yScale = scaleLinear()
      .domain([0, CHART_HEIGHT])
      .range([CHART_HEIGHT, 0]);

    const colorScale = scaleLinear()
      .domain([75, 110, CHART_HEIGHT])
      .range(["green", "orange", "red"])
      .clamp(true);

    const yAxis = axisRight(yScale);

    svg
      .select(".y-axis")
      .style("transform", `translateX(${CHART_WIDTH}px)`)
      .call(yAxis);

    // const chartLine = line()
    //   .x((value, index) => xScale(index))
    //   .y(yScale)
    //   .curve(curveCardinal);

    // svg
    //   .selectAll(".line")
    //   .data([data])
    //   .join("path")
    //   .attr("class", "line")
    //   .attr("d", chartLine)
    //   .attr("fill", "none")
    //   .attr("stroke", "blue");

    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("r", (value) => value)
    //   .attr("cx", (value) => value * 2)
    //   .attr("cy", (value) => value * 2)
    //   .attr("stroke", "red");

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(`DATA-${index}`))
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (e, value) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) =>
            enter.append("text").attr("y", yScale(value[0]) - 20)
          )
          .attr("class", "tooltip")
          .text(value[0])
          .attr("x", xScale(`DATA-${value[1]}`) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("opacity", 1)
          .attr("y", yScale(value[0]) - 8);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .attr("y", -CHART_HEIGHT)
      .transition()
      .attr("height", (value) => CHART_HEIGHT - yScale(value[0]))
      .attr("fill", (value, index) => colorScale(value[0]));
  }, [data]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <svg
          height={CHART_HEIGHT}
          width={CHART_WIDTH}
          style={{ background: "yellow", overflow: "visible" }}
          ref={svgRef}
        >
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
        <div style={{ marginTop: 50 }}>
          <button
            onClick={() => setData((prev) => prev.map((d, i) => [d[0] + 5, i]))}
          >
            Update Data
          </button>

          <button
            onClick={() =>
              setData((prev) => [...prev, [getRandomInt(10, 400), prev.length]])
            }
          >
            Add Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
