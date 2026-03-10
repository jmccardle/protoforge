class UsagePulse {
  static userAnonymousId: string | undefined;
  static Timer: ReturnType<typeof setTimeout>;
  static unlistenRouteChange: () => void;
  static isTelemetryEnabled: boolean;
  static isAnonymousUser: boolean;
  static isFreePlan: boolean;
  static isAirgapped = false;

  static async isTrackableUrl(_path: string) {
    return false;
  }

  static sendPulse() {
    // No-op: telemetry removed
  }

  static registerActivityListener() {
    // No-op: telemetry removed
  }

  static deregisterActivityListener() {
    // No-op: telemetry removed
  }

  static scheduleNextActivityListeners() {
    // No-op: telemetry removed
  }

  static async startTrackingActivity(
    _isTelemetryEnabled: boolean,
    _isAnonymousUser: boolean,
    _isFree: boolean,
  ) {
    // No-op: telemetry removed
  }

  static async sendPulseAndScheduleNext() {
    // No-op: telemetry removed
  }

  static stopTrackingActivity() {
    // No-op: telemetry removed
  }
}

export default UsagePulse;
