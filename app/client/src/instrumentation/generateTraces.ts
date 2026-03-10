// No-op stubs: OpenTelemetry instrumentation has been removed.
import type { Span, Attributes, TimeInput, WebworkerSpanData } from "./types";

const noopSpan: Span = {
  end: () => {},
  setAttributes: () => {},
};

export function startRootSpan(
  _spanName: string,
  _spanAttributes: Attributes = {},
  _startTime?: TimeInput,
): Span {
  return noopSpan;
}

export const generateContext = (_span: Span) => {
  return undefined;
};

export function startNestedSpan(
  _spanName: string,
  _parentSpan: Span,
  _spanAttributes: Attributes = {},
  _startTime?: TimeInput,
): Span {
  return noopSpan;
}

export function endSpan(_span?: Span) {}

export function setAttributesToSpan(
  _span?: Span,
  _spanAttributes: Attributes = {},
) {}

export const startAndEndSpanForFn = <T>(
  _spanName: string,
  _spanAttributes: Attributes = {},
  fn: () => T,
): T => {
  return fn();
};

export function startAndEndSpan(
  _spanName: string,
  _startTime: number,
  _difference: number,
  _spanAttributes: Attributes = {},
) {}

export const convertWebworkerSpansToRegularSpans = (
  _parentSpan: Span,
  _allSpans: Record<string, WebworkerSpanData> = {},
) => {};
