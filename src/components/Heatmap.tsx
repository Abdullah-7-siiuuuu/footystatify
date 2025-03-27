
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Player } from "@/components/PlayerCard";

interface HeatmapProps {
  data: { x: number; y: number; value: number }[];
  player: Player;
}

export const Heatmap = ({ data, player }: HeatmapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const width = 900;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Draw football pitch
    const pitch = svg.append("g");
    
    // Outer rectangle (full pitch)
    pitch.append("rect")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", "#2b8a3e")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    // Center circle
    pitch.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", 60)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    // Center line
    pitch.append("line")
      .attr("x1", width / 2)
      .attr("y1", marginTop)
      .attr("x2", width / 2)
      .attr("y2", height - marginBottom)
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    // Penalty areas
    // Left
    pitch.append("rect")
      .attr("x", marginLeft)
      .attr("y", height / 2 - 100)
      .attr("width", 120)
      .attr("height", 200)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    // Right
    pitch.append("rect")
      .attr("x", width - marginRight - 120)
      .attr("y", height / 2 - 100)
      .attr("width", 120)
      .attr("height", 200)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    // Generate heat map
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([marginLeft, width - marginRight]);
    
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([marginTop, height - marginBottom]);
    
    // Create a color scale
    const color = d3.scaleSequential(d3.interpolateInferno)
      .domain([0, d3.max(data, d => d.value) || 10]);
    
    // Generate contours
    const contours = d3.contourDensity<{ x: number; y: number; value: number }>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .weight(d => d.value)
      .size([width, height])
      .bandwidth(30)
      .thresholds(15)
      (data);
    
    // Draw contours
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(contours)
      .join("path")
      .attr("fill", d => color(d.value))
      .attr("opacity", 0.7)
      .attr("d", d3.geoPath());
    
    // Add legend
    const legendWidth = 300;
    const legendHeight = 15;
    
    const legend = svg.append("g")
      .attr("transform", `translate(${width - marginRight - legendWidth}, ${height - marginBottom + 20})`);
    
    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 10])
      .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickSize(15);
    
    // Add legend gradient
    const defs = svg.append("defs");
    
    const gradient = defs.append("linearGradient")
      .attr("id", "heatmap-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    
    // Add gradient stops
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const offset = i / numStops;
      gradient.append("stop")
        .attr("offset", `${offset * 100}%`)
        .attr("stop-color", color(offset * (d3.max(data, d => d.value) || 10)))
        .attr("stop-opacity", 0.7);
    }
    
    // Add gradient rect
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#heatmap-gradient)");
    
    // Add legend axis
    legend.append("g")
      .call(legendAxis);
    
    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", marginTop - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(`${player.name} Positional Heatmap`);

  }, [data, player]);

  return (
    <div className="overflow-auto">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};
