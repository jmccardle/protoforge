export interface SessionRecordingConfig {
  enabled: boolean;
  mask: boolean;
}

class MixpanelSingleton {
  private static instance: MixpanelSingleton;

  public static getInstance(): MixpanelSingleton {
    if (!MixpanelSingleton.instance) {
      MixpanelSingleton.instance = new MixpanelSingleton();
    }

    return MixpanelSingleton.instance;
  }

  public async init(_config: SessionRecordingConfig): Promise<boolean> {
    return false;
  }

  public startRecording() {
    // No-op: telemetry removed
  }

  public stopRecording() {
    // No-op: telemetry removed
  }
}

export default MixpanelSingleton;
