import type { APP_MODE } from "entities/App";
import type { TriggerMeta } from "ee/sagas/ActionExecution/ActionExecutionSagas";

export interface AppDetails {
  pageId: string;
  appId: string;
  appMode: APP_MODE | undefined;
  appName: string;
  isExampleApp: boolean;
  instanceId: string;
}

export function* getAppDetails(): Generator<unknown, AppDetails, unknown> {
  return {
    pageId: "",
    appId: "",
    appMode: undefined,
    appName: "",
    isExampleApp: false,
    instanceId: "",
  };
}

export function* logDynamicTriggerExecution(_params: {
  dynamicTrigger: string;
  errors: unknown;
  triggerMeta: TriggerMeta;
}) {
  // No-op: telemetry removed
}
