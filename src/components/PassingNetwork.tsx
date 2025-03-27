
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Player } from "@/components/PlayerCard";

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface PassingNetworkProps {
  data: {
    nodes: Node[];
    links: Link[];
  };
  player: Player;
}

export const PassingNetwork = ({ data, player }: PassingNetworkProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = 900;
    const height = 600;
    
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
      .attr("x", 50)
      .attr("y", 50)
      .attr("width", width - 100)
      .attr("height", height - 100)
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
      .attr("y1", 50)
      .attr("x2", width / 2)
      .attr("y2", height - 50)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Create network simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>()
        .id((d: any) => d.id)
        .links(data.links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
        .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX((d: any) => {
        // Use predefined x coordinates
        return d.x * (width - 100) + 50;
      }).strength(0.5))
      .force("y", d3.forceY((d: any) => {
        // Use predefined y coordinates
        return d.y * (height - 100) + 50;
      }).strength(0.5));

    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#4f46e5")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    // Create a group for each node
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Add circle for each node
    node.append("circle")
      .attr("r", (d: Node) => {
        // Make the player's node larger
        return d.name === player.name ? 15 : 10;
      })
      .attr("fill", (d: Node) => {
        // Highlight the player
        return d.name === player.name ? "#ef4444" : "#4f46e5";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Add text labels
    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text((d: Node) => d.name)
      .style("font-size", "10px")
      .style("fill", "#fff")
      .style("stroke", "#000")
      .style("stroke-width", "0.5px");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, any>, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, any>, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, any>, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, 30)`);
    
    // Legend title
    legend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .text("Pass Frequency")
      .style("font-size", "12px")
      .style("font-weight", "bold");
    
    // Legend items
    const legendData = [
      { label: "High", width: 4, y: 20 },
      { label: "Medium", width: 2, y: 40 },
      { label: "Low", width: 1, y: 60 }
    ];
    
    legendData.forEach(item => {
      legend.append("line")
        .attr("x1", 0)
        .attr("y1", item.y)
        .attr("x2", 30)
        .attr("y2", item.y)
        .attr("stroke", "#4f46e5")
        .attr("stroke-width", item.width * 2);
      
      legend.append("text")
        .attr("x", 35)
        .attr("y", item.y + 4)
        .text(item.label)
        .style("font-size", "10px");
    });
    
    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(`${player.name} Passing Network`);

  }, [data, player]);

  return (
    <div className="overflow-auto">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};
