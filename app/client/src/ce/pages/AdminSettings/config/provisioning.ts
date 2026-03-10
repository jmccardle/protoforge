import type { AdminConfigType } from "ee/pages/AdminSettings/config/types";
import {
  CategoryType,
  SettingCategories,
  SettingTypes,
} from "ee/pages/AdminSettings/config/types";
import { ProvisioningUpgradePage } from "../../Upgrade/ProvisioningUpgradePage";

export const config: AdminConfigType = {
  icon: "user-follow-line",
  type: SettingCategories.PROVISIONING,
  categoryType: CategoryType.USER_MANAGEMENT,
  controlType: SettingTypes.PAGE,
  component: ProvisioningUpgradePage,
  title: "Provisioning",
  canSave: false,
  isFeatureEnabled: true,
  isEnterprise: false,
} as AdminConfigType;
