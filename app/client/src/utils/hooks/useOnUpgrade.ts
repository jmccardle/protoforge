import type {
  RampFeature,
  RampSection,
} from "utils/ProductRamps/RampsControlList";

interface Props {
  logEventName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logEventData?: any;
  featureName?: RampFeature;
  sectionName?: RampSection;
  isEnterprise?: boolean;
}

const useOnUpgrade = (props: Props) => {
  const onUpgrade = () => {
    // no-op: upgrade prompts removed
  };

  return { onUpgrade };
};

export default useOnUpgrade;
