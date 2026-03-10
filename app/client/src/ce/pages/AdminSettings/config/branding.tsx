import type { AdminConfigType } from "ee/pages/AdminSettings/config/types";
import {
  CategoryType,
  SettingCategories,
  SettingTypes,
} from "ee/pages/AdminSettings/config/types";
import BrandingPage from "pages/AdminSettings/Branding/BrandingPage";

export const config: AdminConfigType = {
  type: SettingCategories.BRANDING,
  categoryType: CategoryType.ORGANIZATION,
  controlType: SettingTypes.PAGE,
  canSave: false,
  title: "Branding",
  icon: "pantone",
  component: BrandingPage,
  isFeatureEnabled: true,
};
