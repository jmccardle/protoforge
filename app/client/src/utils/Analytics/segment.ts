class SegmentSingleton {
  private static instance: SegmentSingleton;

  public static getInstance(): SegmentSingleton {
    if (!SegmentSingleton.instance) {
      SegmentSingleton.instance = new SegmentSingleton();
    }

    return SegmentSingleton.instance;
  }

  public getUser() {
    return undefined;
  }

  public async init(_shouldTrackUser?: boolean): Promise<boolean> {
    return true;
  }

  public track(_eventName: string, _eventData?: Record<string, unknown>) {
    // No-op: telemetry removed
  }

  public async identify(_userId: string, _traits?: Record<string, unknown>) {
    // No-op: telemetry removed
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async addMiddleware(_middleware: any) {
    // No-op: telemetry removed
  }

  public avoidTracking() {
    // No-op: telemetry removed
  }

  public reset() {
    // No-op: telemetry removed
  }
}

export default SegmentSingleton;
