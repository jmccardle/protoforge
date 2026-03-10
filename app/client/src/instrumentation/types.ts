// Locally-defined stubs replacing @opentelemetry/api types

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Attributes = Record<string, any>;
export type TimeInput = number | Date;

export interface Span {
  end(endTime?: TimeInput): void;
  setAttributes(attributes: Attributes): void;
}

export interface WebworkerSpanData {
  attributes: Attributes;
  spanName: string;
  startTime: TimeInput;
  endTime: TimeInput;
}
