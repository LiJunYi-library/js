function numFomatterThousand(num, Fixed = 1, unit = "万") {
  if (num < 10000) return num;
  let sum = num / 10000;
  sum = sum.toFixed(Fixed);
  const decimals = sum.match(/\..*/)[0];
  const integer = sum.match(/(.*)(\.)/)[1];
  let nth = 1;
  return (
    integer.split("").reduceRight((add, val, i) => {
      add = val + add;
      if (i === nth * 3) nth++, (add = "," + add);
      return add;
    }, "") +
    decimals +
    unit
  );
}
