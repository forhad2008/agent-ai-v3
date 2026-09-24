import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface LatencyDataPoint {
  timestamp: number; // Unix timestamp ms
  timeLabel: string; // e.g. "07:29:15"
  latencyMs: number;
}

interface LatencyD3ChartProps {
  data: LatencyDataPoint[];
  warningThreshold: number;
  criticalThreshold: number;
  height?: number;
}

export const LatencyD3Chart: React.FC<LatencyD3ChartProps> = ({
  data,
  warningThreshold,
  criticalThreshold,
  height = 200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<LatencyDataPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth || 450;
    const margin = { top: 24, right: 30, bottom: 30, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Filter or ensure 60 second window
    const now = Date.now();
    const startTime = now - 60000;

    // Prepare chart data: if data is empty or short, fallback safely
    const chartData = data.length > 0 ? data : [
      { timestamp: now - 30000, timeLabel: 'Now', latencyMs: 25 },
      { timestamp: now, timeLabel: 'Now', latencyMs: 25 }
    ];

    // X Scale (Time over last 60s)
    const minTime = Math.min(startTime, d3.min(chartData, d => d.timestamp) || startTime);
    const maxTime = Math.max(now, d3.max(chartData, d => d.timestamp) || now);

    const xScale = d3.scaleTime()
      .domain([new Date(minTime), new Date(maxTime)])
      .range([margin.left, width - margin.right]);

    // Y Scale (Latency ms)
    const maxDataLatency = d3.max(chartData, d => d.latencyMs) || 100;
    const maxScaleY = Math.max(maxDataLatency * 1.2, criticalThreshold * 1.25, 120);

    const yScale = d3.scaleLinear()
      .domain([0, maxScaleY])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // SVG Defs: Gradients & Glow Filters
    const defs = svg.append('defs');

    // Main Gradient for Chart Area (Transitions smoothly)
    const areaGradient = defs.append('linearGradient')
      .attr('id', 'latency-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FF204E')
      .attr('stop-opacity', '0.35');

    areaGradient.append('stop')
      .attr('offset', '60%')
      .attr('stop-color', '#E50914')
      .attr('stop-opacity', '0.12');

    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10B981')
      .attr('stop-opacity', '0.02');

    // Glow Filter
    const filter = defs.append('filter')
      .attr('id', 'line-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Grid lines
    const yAxisGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(4);

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', '#ffffff')
      .attr('stroke-opacity', 0.05)
      .attr('stroke-dasharray', '2,2');

    svg.selectAll('.grid .domain').remove();

    // D3 Area Generator
    const area = d3.area<LatencyDataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.latencyMs))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(chartData)
      .attr('fill', 'url(#latency-area-gradient)')
      .attr('d', area);

    // D3 Line Generator
    const line = d3.line<LatencyDataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.latencyMs))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#FF204E')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#line-glow)')
      .attr('d', line);

    // D3 THRESHOLD LINES (Warning & Critical)
    // 1. Warning Threshold Line (Yellow)
    if (warningThreshold <= maxScaleY) {
      const warningY = yScale(warningThreshold);

      svg.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', warningY)
        .attr('y2', warningY)
        .attr('stroke', '#F59E0B')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');

      svg.append('text')
        .attr('x', width - margin.right - 4)
        .attr('y', warningY - 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#F59E0B')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('font-family', 'monospace')
        .text(`WARN: ${warningThreshold}ms`);
    }

    // 2. Critical Threshold Line (Red)
    if (criticalThreshold <= maxScaleY) {
      const criticalY = yScale(criticalThreshold);

      svg.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', criticalY)
        .attr('y2', criticalY)
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      svg.append('text')
        .attr('x', width - margin.right - 4)
        .attr('y', criticalY - 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#EF4444')
        .attr('font-size', '9px')
        .attr('font-weight', '800')
        .attr('font-family', 'monospace')
        .text(`CRIT: ${criticalThreshold}ms`);
    }

    // Data Point Circles with threshold coloring
    svg.selectAll('.data-dot')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'data-dot')
      .attr('cx', d => xScale(new Date(d.timestamp)))
      .attr('cy', d => yScale(d.latencyMs))
      .attr('r', (d, i) => i === chartData.length - 1 ? 4.5 : 3)
      .attr('fill', d => {
        if (d.latencyMs >= criticalThreshold) return '#EF4444';
        if (d.latencyMs >= warningThreshold) return '#F59E0B';
        return '#10B981';
      })
      .attr('stroke', '#121212')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer');

    // Axes Rendering
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => d3.timeFormat('%H:%M:%S')(d as Date));

    const yAxis = d3.axisLeft(yScale)
      .ticks(4)
      .tickFormat(d => `${d}ms`);

    // X Axis group
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    svg.select(`g[transform="translate(0, ${height - margin.bottom})"] .domain`)
      .attr('stroke', 'rgba(255, 255, 255, 0.15)');

    // Y Axis group
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .selectAll('text')
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    svg.select(`g[transform="translate(${margin.left}, 0)"] .domain`)
      .attr('stroke', 'rgba(255, 255, 255, 0.15)');

    // Overlay Mouse Interactivity for Tooltips
    const overlay = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    overlay.on('mousemove', (event) => {
      const [mouseX] = d3.pointer(event);
      const xDate = xScale.invert(mouseX);
      const bisect = d3.bisector<LatencyDataPoint, Date>(d => new Date(d.timestamp)).left;
      const index = bisect(chartData, xDate, 1);
      const a = chartData[index - 1];
      const b = chartData[index];

      let closest = a;
      if (b && a) {
        closest = (xDate.getTime() - a.timestamp > b.timestamp - xDate.getTime()) ? b : a;
      } else if (b) {
        closest = b;
      }

      if (closest) {
        setHoveredPoint(closest);
        setHoverPos({
          x: xScale(new Date(closest.timestamp)),
          y: yScale(closest.latencyMs),
        });
      }
    });

    overlay.on('mouseleave', () => {
      setHoveredPoint(null);
      setHoverPos(null);
    });

  }, [data, warningThreshold, criticalThreshold, height]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full overflow-visible"
        style={{ height: `${height}px` }}
      />

      {/* Floating Hover Tooltip */}
      {hoveredPoint && hoverPos && (
        <div
          className="pointer-events-none absolute z-30 flex flex-col rounded-xl bg-black/95 p-2 text-[10px] text-white shadow-xl backdrop-blur-md border border-white/20 transition-all duration-75"
          style={{
            left: `${Math.min(Math.max(20, hoverPos.x - 50), 320)}px`,
            top: `${Math.max(0, hoverPos.y - 55)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 font-mono">
            <span className="text-white/60">{hoveredPoint.timeLabel}</span>
            <span
              className={`font-extrabold ${
                hoveredPoint.latencyMs >= criticalThreshold
                  ? 'text-red-400'
                  : hoveredPoint.latencyMs >= warningThreshold
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {hoveredPoint.latencyMs >= criticalThreshold
                ? 'CRITICAL'
                : hoveredPoint.latencyMs >= warningThreshold
                ? 'WARNING'
                : 'OPTIMAL'}
            </span>
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="font-mono text-xs font-black text-white">{hoveredPoint.latencyMs}</span>
            <span className="text-[#FF204E] font-bold">ms</span>
            <span className="text-white/40 ml-auto font-mono text-[9px]">
              {Math.round((Date.now() - hoveredPoint.timestamp) / 1000)}s ago
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
