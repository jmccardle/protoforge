import {
  GoogleOAuthURL,
  GithubOAuthURL,
  OidcOAuthURL,
} from "ee/constants/ApiConstants";

import GithubLogo from "assets/images/Github.png";
import GoogleLogo from "assets/images/Google.png";
import OidcLogo from "assets/images/oidc.svg";
export interface SocialLoginButtonProps {
  url: string;
  name: string;
  logo: string;
  label?: string;
}

export const GoogleSocialLoginButtonProps: SocialLoginButtonProps = {
  url: GoogleOAuthURL,
  name: "Google",
  logo: GoogleLogo,
};

export const GithubSocialLoginButtonProps: SocialLoginButtonProps = {
  url: GithubOAuthURL,
  name: "Github",
  logo: GithubLogo,
};

export const OidcSocialLoginButtonProps: SocialLoginButtonProps = {
  url: OidcOAuthURL,
  name: "OIDC",
  logo: OidcLogo,
};

export const SocialLoginButtonPropsList: Record<
  string,
  SocialLoginButtonProps
> = {
  google: GoogleSocialLoginButtonProps,
  github: GithubSocialLoginButtonProps,
  oidc: OidcSocialLoginButtonProps,
};

export type SocialLoginType = keyof typeof SocialLoginButtonPropsList;
