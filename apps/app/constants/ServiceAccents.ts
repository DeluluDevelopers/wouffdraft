import Colors from "@/constants/Colors";

export type ServiceAccent = {
  bg: string;
  fg: string;
};

const light = Colors.light;

export const ServiceAccents: Record<string, ServiceAccent> = {
  Bathing: { bg: light.primaryContainer, fg: light.primary },
  Cutting: { bg: light.lilac, fg: light.onLilac },
  Hygiene: { bg: light.lemon, fg: light.onLemon },
  BlowDry: { bg: light.lime, fg: light.onLime },
  NailTrim: { bg: light.secondaryContainer, fg: light.onSecondaryContainer },
  Spa: { bg: light.successContainer, fg: light.onSuccessContainer },
  Cleaning: { bg: light.warningContainer, fg: light.onWarningContainer },
};

export const DEFAULT_SERVICE_ACCENT: ServiceAccent = {
  bg: light.primaryContainer,
  fg: light.primary,
};

export function getServiceAccent(service: string): ServiceAccent {
  return ServiceAccents[service] ?? DEFAULT_SERVICE_ACCENT;
}
