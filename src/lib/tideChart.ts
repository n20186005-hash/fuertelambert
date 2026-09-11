/**
 * Geometry for the tide chart, kept separate from the two places that draw it
 * (the server-rendered SVG and the browser refresh) so the curve can never
 * disagree with itself after a live update.
 *
 * Pure numbers in, pure numbers out: no markup, no DOM.
 */

import { tideGeometry, type TideEvent, type TidePoint } from './weather';

export interface TideChartMarker {
  x: number;
  y: number;
  high: boolean;
  time: string;
  height: number;
}

export interface TideChart {
  width: number;
  height: number;
  /** Polyline for the water-level curve. */
  line: string;
  /** Same curve closed along the bottom, for the shaded fill. */
  area: string;
  /** Horizontal position of "now", or null when the clock is outside the day. */
  nowX: number | null;
  nowY: number | null;
  markers: TideChartMarker[];
}

export function buildTideChart(
  series: TidePoint[],
  dayStart: number,
  events: TideEvent[],
  nowOffset: number | null,
  nowHeight: number | null,
  width = 720,
  height = 150,
  pad = 8
): TideChart | null {
  const geometry = tideGeometry(series, dayStart, width, height, pad);
  if (!geometry) return null;

  const floor = height - pad;
  return {
    width,
    height,
    line: geometry.path,
    area: `${geometry.path} ${width - pad},${floor} ${pad},${floor}`,
    nowX: nowOffset === null ? null : geometry.x(nowOffset),
    nowY: nowHeight === null ? null : geometry.y(nowHeight),
    markers: events.map((event) => ({
      x: geometry.x(event.offset),
      y: geometry.y(event.height),
      high: event.type === 'high',
      time: event.time,
      height: event.height,
    })),
  };
}
