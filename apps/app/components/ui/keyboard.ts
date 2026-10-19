import { createContext, useContext, useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

// Whether the on-screen keyboard is open, and where its top edge sits on screen.
export function useKeyboard() {
  const [state, setState] = useState({ visible: false, top: 0 });
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, (e) => setState({ visible: true, top: e.endCoordinates.screenY }));
    const hide = Keyboard.addListener(hideEvent, () => setState({ visible: false, top: 0 }));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return state;
}

// Lets a focused field ask its screen to scroll it above the keyboard.
export type ScrollIntoView = (bottomInWindow: number) => void;

export const ScrollIntoViewContext = createContext<ScrollIntoView | null>(null);

export function useScrollIntoView() {
  return useContext(ScrollIntoViewContext);
}
