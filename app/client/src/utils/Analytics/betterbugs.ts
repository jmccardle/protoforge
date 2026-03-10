import type { User } from "constants/userConstants";

export interface BetterbugsMetadata {
  instanceId: string;
  tenantId: string | undefined;
  applicationId: string | null;
  pageId: string | null;
}

class BetterbugsUtil {
  public static async init(
    _user?: User,
    _betterbugsMetadata?: BetterbugsMetadata,
  ) {
    // No-op: telemetry removed
  }

  public static destroy() {
    // No-op: telemetry removed
  }

  public static async show(
    _user?: User,
    _betterbugsMetadata?: BetterbugsMetadata,
  ) {
    // No-op: telemetry removed
  }

  public static updateMetadata(_betterbugsMetadata?: BetterbugsMetadata) {
    // No-op: telemetry removed
  }

  public static hide() {
    // No-op: telemetry removed
  }
}

export default BetterbugsUtil;
