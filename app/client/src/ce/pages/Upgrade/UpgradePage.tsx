import React from "react";
import styled from "styled-components";
import type { UpgradePageProps } from "./types";

export const Container = styled.div`
  background-color: var(--ads-v2-color-bg-subtle);
  min-height: 0;
  width: 100%;
  position: relative;
`;

export default function UpgradePage(props: UpgradePageProps) {
  return (
    <Container
      className="upgrade-page-container"
      data-testid="t--upgrade-page-container"
    />
  );
}
