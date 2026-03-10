import type { ReduxActionType } from "actions/ReduxActionTypes";

export function* sendAnalyticsEventSaga(
  _type: ReduxActionType,
  _payload: unknown,
) {
  // No-op: telemetry removed
}

export default function* root() {
  // No-op: telemetry removed
}
