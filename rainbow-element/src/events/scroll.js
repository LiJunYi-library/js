import { SlideEvent } from "./slide";

export class ScrollEvent extends SlideEvent {
  scrollTop = undefined;
}

export function inheritSlideEvent(
  name,
  event = {},
  eventInitDict = { bubbles: true, cancelable: true },
) {
  const newEvent = new ScrollEvent(name, eventInitDict);
  for (const key in event) {
    try {
      if (newEvent[key] === undefined) newEvent[key] = event[key];
    } catch (error) {
      console.warn(error);
    }
  }
  return newEvent;
}
