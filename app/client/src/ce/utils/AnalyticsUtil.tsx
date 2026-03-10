import type { User } from "constants/userConstants";
import type { EventName } from "ee/utils/analyticsUtilTypes";

import {
  initLicense,
  initInstanceId,
  getEventExtraProperties,
} from "ee/utils/Analytics/getEventExtraProperties";

export enum AnalyticsEventType {
  error = "error",
}

export interface SessionRecordingConfig {
  enabled: boolean;
  mask: boolean;
}

async function initialize(
  _user: User,
  _sessionRecordingConfig: SessionRecordingConfig,
  _shouldTrackUser: boolean,
) {
  // No-op: telemetry removed
}

function logEvent(
  _eventName: EventName,
  _eventData?: Record<string, unknown>,
  _eventType?: AnalyticsEventType,
) {
  // No-op: telemetry removed
}

async function identifyUser(_userData: User, _sendAdditionalData?: boolean) {
  // No-op: telemetry removed
}

function setBlockErrorLogs(_value: boolean) {
  // No-op: telemetry removed
}

function getAnonymousId(): string {
  return "";
}

function reset() {
  // No-op: telemetry removed
}

function avoidTracking() {
  // No-op: telemetry removed
}

export {
  initialize,
  logEvent,
  identifyUser,
  initInstanceId,
  setBlockErrorLogs,
  getAnonymousId,
  reset,
  getEventExtraProperties,
  initLicense,
  avoidTracking,
};
