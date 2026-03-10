import { v4 as uuidv4 } from "uuid";
import type { User } from "constants/userConstants";

class AppsmithTelemetry {
  private static instance: AppsmithTelemetry | null;

  public identifyUser(_userId: string, _userData: User) {
    // No-op: telemetry removed
  }

  public static getInstance() {
    if (!AppsmithTelemetry.instance) {
      AppsmithTelemetry.instance = new AppsmithTelemetry();
    }

    return AppsmithTelemetry.instance;
  }

  public getTraceAndContext() {
    return {
      trace: undefined,
      context: undefined,
      pushError: () => {},
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public captureException(_exception: any, _hint?: Record<string, any>): string {
    return uuidv4();
  }

  public captureMeasurement(
    _value: Record<string, number>,
    _context?: Record<string, string>,
  ) {
    // No-op: telemetry removed
  }

  public captureLog(
    _args: unknown[],
    _level?: unknown,
    _context?: Record<string, string>,
  ) {
    // No-op: telemetry removed
  }
}

export const appsmithTelemetry = AppsmithTelemetry.getInstance();
