import type { InternalAxiosRequestConfig } from "axios";

type ID = string | null | undefined;

export const addAnonymousUserIdHeader = (
  config: InternalAxiosRequestConfig,
  options: { anonymousId: ID; segmentEnabled?: boolean },
) => {
  const { anonymousId, segmentEnabled } = options;

  config.headers = config.headers || {};

  if (segmentEnabled && anonymousId) {
    config.headers["x-anonymous-user-id"] = anonymousId;
  }

  return config;
};
