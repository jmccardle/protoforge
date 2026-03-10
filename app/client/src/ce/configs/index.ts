import type { AppsmithUIConfigs } from "./types";

export interface INJECTED_CONFIGS {
  sentry: {
    dsn: string;
    release: string;
    environment: string;
  };
  smartLook: {
    id: string;
  };
  betterbugs: {
    apiKey: string;
  };
  segment: {
    apiKey: string;
    ceKey: string;
  };
  observability: {
    deploymentName: string;
    serviceInstanceId: string;
    tracingUrl: string;
  };
  fusioncharts: {
    licenseKey: string;
  };
  mixpanel: {
    enabled: boolean;
    apiKey: string;
  };
  cloudHosting: boolean;
  logLevel: "debug" | "error";
  appVersion: {
    id: string;
    sha: string;
    releaseDate: string;
    edition: string;
  };
  intercomAppID: string;
  mailEnabled: boolean;
  googleRecaptchaSiteKey: string;
  supportEmail: string;
  disableIframeWidgetSandbox: boolean;
  pricingUrl: string;
  customerPortalUrl: string;
}

const capitalizeText = (text: string) => {
  const rest = text.slice(1);
  const first = text[0].toUpperCase();

  return `${first}${rest}`;
};

export const getConfigsFromEnvVars = (): INJECTED_CONFIGS => {
  return {
    sentry: {
      dsn: "",
      release: "",
      environment: "",
    },
    smartLook: {
      id: "",
    },
    betterbugs: {
      apiKey: "",
    },
    segment: {
      apiKey: "",
      ceKey: "",
    },
    fusioncharts: {
      licenseKey: process.env.REACT_APP_FUSIONCHARTS_LICENSE_KEY || "",
    },
    mixpanel: {
      enabled: false,
      apiKey: "",
    },
    observability: {
      deploymentName: "",
      serviceInstanceId: "",
      tracingUrl: "",
    },
    logLevel:
      (process.env.REACT_APP_CLIENT_LOG_LEVEL as
        | "debug"
        | "error"
        | undefined) || "error",
    cloudHosting: process.env.REACT_APP_CLOUD_HOSTING
      ? process.env.REACT_APP_CLOUD_HOSTING.length > 0
      : false,
    appVersion: {
      id: "",
      sha: "",
      releaseDate: "",
      edition: process.env.REACT_APP_VERSION_EDITION || "",
    },
    intercomAppID: "",
    mailEnabled: process.env.REACT_APP_MAIL_ENABLED
      ? process.env.REACT_APP_MAIL_ENABLED.length > 0
      : false,
    googleRecaptchaSiteKey:
      process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY || "",
    supportEmail: process.env.APPSMITH_SUPPORT_EMAIL || "support@appsmith.com",

    disableIframeWidgetSandbox: process.env
      .APPSMITH_DISABLE_IFRAME_WIDGET_SANDBOX
      ? process.env.APPSMITH_DISABLE_IFRAME_WIDGET_SANDBOX.length > 0
      : false,
    pricingUrl: process.env.REACT_APP_PRICING_URL || "",
    customerPortalUrl: process.env.REACT_APP_CUSTOMER_PORTAL_URL || "",
  };
};

const getConfig = (fromENV: string, fromWindow = "") => {
  if (fromWindow.length > 0) return { enabled: true, value: fromWindow };
  else if (fromENV.length > 0) return { enabled: true, value: fromENV };

  return { enabled: false, value: "" };
};

// TODO(Abhinav): See if this is called so many times, that we may need some form of memoization.
export const getAppsmithConfigs = (): AppsmithUIConfigs => {
  const APPSMITH_FEATURE_CONFIGS =
    // This code might be called both from the main thread and a web worker
    typeof window === "undefined" ? undefined : window.APPSMITH_FEATURE_CONFIGS;
  const ENV_CONFIG = getConfigsFromEnvVars();
  // Telemetry configs disabled — all set to empty/disabled
  const sentryDSN = { enabled: false, value: "" };
  const sentryRelease = { enabled: false, value: "" };
  const sentryENV = { enabled: false, value: "" };
  const segment = { enabled: false, value: "" };
  const mixpanel = { enabled: false, value: "" };
  const observabilityDeploymentName = { enabled: false, value: "" };
  const observabilityServiceInstanceId = { enabled: false, value: "" };
  const observabilityFrontendTracingUrl = { enabled: false, value: "" };
  const fusioncharts = getConfig(
    ENV_CONFIG.fusioncharts.licenseKey,
    APPSMITH_FEATURE_CONFIGS?.fusioncharts.licenseKey,
  );

  const googleRecaptchaSiteKey = getConfig(
    ENV_CONFIG.googleRecaptchaSiteKey,
    APPSMITH_FEATURE_CONFIGS?.googleRecaptchaSiteKey,
  );

  const smartLook = { enabled: false, value: "" };
  const betterbugs = { enabled: false, value: "" };
  const segmentCEKey = { enabled: false, value: "" };

  return {
    sentry: {
      enabled: false,
      dsn: "",
      release: "",
      environment: "",
      normalizeDepth: 3,
      tracesSampleRate: 0,
    },
    smartLook: {
      enabled: false,
      id: "",
    },
    betterbugs: {
      enabled: false,
      apiKey: "",
    },
    segment: {
      enabled: false,
      apiKey: "",
      ceKey: "",
    },
    observability: {
      deploymentName: "",
      serviceInstanceId: "",
      serviceName: "",
      tracingUrl: "",
    },
    fusioncharts: {
      enabled: fusioncharts.enabled,
      licenseKey: fusioncharts.value,
    },
    googleRecaptchaSiteKey: {
      enabled: googleRecaptchaSiteKey.enabled,
      apiKey: googleRecaptchaSiteKey.value,
    },
    mixpanel: {
      enabled: false,
      apiKey: "",
    },
    cloudHosting:
      ENV_CONFIG.cloudHosting ||
      APPSMITH_FEATURE_CONFIGS?.cloudHosting ||
      false,
    logLevel:
      ENV_CONFIG.logLevel || APPSMITH_FEATURE_CONFIGS?.logLevel || false,
    appVersion: {
      id: APPSMITH_FEATURE_CONFIGS?.appVersion?.id || "",
      sha: APPSMITH_FEATURE_CONFIGS?.appVersion?.sha || "",
      releaseDate: APPSMITH_FEATURE_CONFIGS?.appVersion?.releaseDate || "",
      edition:
        ENV_CONFIG.appVersion?.edition ||
        APPSMITH_FEATURE_CONFIGS?.appVersion?.edition ||
        "",
    },
    intercomAppID: "",
    mailEnabled:
      ENV_CONFIG.mailEnabled || APPSMITH_FEATURE_CONFIGS?.mailEnabled || false,
    appsmithSupportEmail: ENV_CONFIG.supportEmail,
    disableIframeWidgetSandbox:
      ENV_CONFIG.disableIframeWidgetSandbox ||
      APPSMITH_FEATURE_CONFIGS?.disableIframeWidgetSandbox ||
      false,
    pricingUrl:
      ENV_CONFIG.pricingUrl || APPSMITH_FEATURE_CONFIGS?.pricingUrl || "",
    customerPortalUrl:
      ENV_CONFIG.customerPortalUrl ||
      APPSMITH_FEATURE_CONFIGS?.customerPortalUrl ||
      "",
  };
};
