import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateOrganizationConfig } from "ee/actions/organizationActions";
import { toast } from "@appsmith/ads";
import type { Inputs } from "pages/AdminSettings/Branding/BrandingPage";

interface UseBrandingFormProps {
  dirtyFields: Partial<Record<keyof Inputs, boolean | Record<string, boolean>>>;
}

export const useBrandingForm = (props: UseBrandingFormProps) => {
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (data: Inputs) => {
      const config: Record<string, string> = {};

      if (data.brandLogo) {
        config.brandLogoUrl = data.brandLogo;
      }

      if (data.brandFavicon) {
        config.brandFaviconUrl = data.brandFavicon;
      }

      if (data.brandColors) {
        // Send brandColors as a nested object — the server uses
        // copyNestedNonNullProperties which handles Map<String,String>
        (config as Record<string, unknown>).brandColors = data.brandColors;
      }

      if (data.logoWidth !== undefined) {
        config.logoWidth = String(data.logoWidth);
      }

      if (data.logoHeight !== undefined) {
        config.logoHeight = String(data.logoHeight);
      }

      dispatch(
        updateOrganizationConfig({
          organizationConfiguration: config,
          needsRefresh: true,
          isOnlyOrganizationSettings: false,
        }),
      );

      toast.show("Branding settings saved. Reloading...", {
        kind: "success",
      });
    },
    [dispatch],
  );

  return {
    onSubmit,
  };
};
