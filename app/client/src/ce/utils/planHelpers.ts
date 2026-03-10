import type { FeatureFlags } from "ee/entities/FeatureFlag";

//all features are always enabled
export const isBrandingEnabled = (featureFlags?: FeatureFlags) => {
  return true;
};

export const isOIDCEnabled = (featureFlags?: FeatureFlags) => {
  return true;
};

export const isSAMLEnabled = (featureFlags?: FeatureFlags) => {
  return true;
};

export const isGACEnabled = (featureFlags?: FeatureFlags) => {
  return true;
};

export const isMultipleEnvEnabled = (featureFlags?: FeatureFlags) => {
  return true;
};

export const isBranchProtectionLicenseEnabled = (
  featureFlags?: FeatureFlags,
) => {
  return true;
};

export const isMultiOrgFFEnabled = (featureFlags?: FeatureFlags) => {
  return true;
};
