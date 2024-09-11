export function transitionColor(defColor, color) {
  function rgba(...args) {
    return {
      r: args[0],
      g: args[1],
      b: args[2],
      a: args[3] === undefined ? 1 : args[3],
    };
  }
  const rgb = (...args) => rgba(...args);
  const defColors = eval(defColor);
  const colors = eval(color);

  const gaps = {
    r: colors.r - defColors.r,
    g: colors.g - defColors.g,
    b: colors.b - defColors.b,
    a: colors.a - defColors.a,
  };

  return (ratio) => {
    if (ratio > 1) ratio = 1;
    const rgbaColor = {
      r: gaps.r * ratio + defColors.r,
      g: gaps.g * ratio + defColors.g,
      b: gaps.b * ratio + defColors.b,
      a: gaps.a * ratio + defColors.a,
    };
    return `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b},${rgbaColor.a})`;
  };
}

export function transitionStyleBgColor(...arg) {
  const trColor = transitionColor(...arg);
  return (ratio) => `background: ${trColor(ratio)};`;
}

export function transitionStyleColor(...arg) {
  const trColor = transitionColor(...arg);
  return (ratio) => `color: ${trColor(ratio)};`;
}


export function transitionOpacity(def, tart) {
  const gaps = tart - def;
  return ratio => {
      if (ratio > 1) ratio = 1;
    const opacity = gaps * ratio + def;
    return opacity;
  };
}

export function transitionStyleOpacity(...arg) {
  const trColor = transitionOpacity(...arg);
  return ratio => `opacity: ${trColor(ratio)};`;
}
