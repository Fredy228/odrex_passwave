import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

export const generateAvatar = (name: string) => {
  return createAvatar(funEmoji, {
    seed: name,
    scale: 80,
    radius: 50,
    size: 50,
    mouth: [
      "cute",
      "faceMask",
      "kissHeart",
      "lilSmile",
      "smileLol",
      "smileTeeth",
      "tongueOut",
      "wideSmile",
    ],
  }).toString();
};
