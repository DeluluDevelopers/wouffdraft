import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { colors, radius } from "@/theme";

const W = 320;
const H = 200;
const PAD = 26;

function project(route: [number, number][]) {
  const lats = route.map(([lat]) => lat);
  const lngs = route.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  // Longitude degrees shrink with latitude.
  const lngScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = Math.max((maxLng - minLng) * lngScale, 1e-6);
  const spanY = Math.max(maxLat - minLat, 1e-6);
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  const offsetX = (W - spanX * scale) / 2;
  const offsetY = (H - spanY * scale) / 2;
  return route.map(([lat, lng]) => [offsetX + (lng - minLng) * lngScale * scale, offsetY + (maxLat - lat) * scale]);
}

function toPath(points: number[][]) {
  const [first, ...rest] = points;
  let d = `M${first![0]!.toFixed(1)} ${first![1]!.toFixed(1)}`;
  for (let i = 0; i < rest.length - 1; i++) {
    const [x, y] = rest[i]!;
    const [nx, ny] = rest[i + 1]!;
    d += ` Q${x!.toFixed(1)} ${y!.toFixed(1)} ${((x! + nx!) / 2).toFixed(1)} ${((y! + ny!) / 2).toFixed(1)}`;
  }
  const last = rest[rest.length - 1]!;
  return `${d} L${last[0]!.toFixed(1)} ${last[1]!.toFixed(1)}`;
}

// Stylised map of the walked route. Real streets would need a maps SDK; this
// keeps the report light and on-brand.
export function RouteMap({ route, style }: { route: [number, number][]; style?: StyleProp<ViewStyle> }) {
  if (route.length < 2) return null;
  const points = project(route);
  const start = points[0]!;
  const end = points[points.length - 1]!;
  const d = toPath(points);
  return (
    <View style={[styles.map, style]} accessibilityLabel="Map of the walk route">
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <Rect width={W} height={H} fill="#E4EEE9" />
        <Rect x={196} y={18} width={92} height={64} rx={14} fill={colors.sage} opacity={0.55} />
        <Circle cx={70} cy={160} r={26} fill={colors.sage} opacity={0.55} />
        <G stroke={colors.paper} strokeWidth={9} strokeLinecap="round" fill="none">
          <Path d="M-10 52 H330" />
          <Path d="M-10 118 C80 112 160 128 330 116" />
          <Path d="M-10 176 H330" />
          <Path d="M44 -10 V210" />
          <Path d="M128 -10 C122 70 136 140 128 210" />
          <Path d="M226 -10 V210" />
          <Path d="M296 -10 V210" />
        </G>
        <G transform="translate(0 2)">
          <Path
            d={d}
            stroke="rgba(45,45,43,0.12)"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Path
          d={d}
          stroke={colors.terracotta}
          strokeWidth={4.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={start[0]} cy={start[1]} r={7} fill={colors.paper} stroke={colors.charcoal} strokeWidth={2} />
        <Circle cx={start[0]} cy={start[1]} r={3} fill={colors.charcoal} />
        <Circle cx={end[0]} cy={end[1]} r={9} fill={colors.charcoal} />
        <Circle cx={end[0]} cy={end[1]} r={3.5} fill={colors.biscuit} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    aspectRatio: 16 / 10,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.sageSoft,
  },
});
