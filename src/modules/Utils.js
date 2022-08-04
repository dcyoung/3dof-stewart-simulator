let getEnumDefault = (theEnum) => {
  let smallestValue = null;
  for (let key in theEnum) {
    //don't consider the properties key
    if (key === "properties") break;
    // Look for indicator of default as an early exit
    let v = theEnum[key];
    if (theEnum.properties[v].bIsDefault) {
      return v;
    } else if (smallestValue == null || v < smallestValue) {
      smallestValue = v;
    }
  }
  return smallestValue;
};

//creates an array of length "len" and filled with the specified itm value
let createArray = (len, itm) => {
  let arr1 = [itm],
    arr2 = [];
  while (len > 0) {
    if (len & 1) arr2 = arr2.concat(arr1);
    arr1 = arr1.concat(arr1);
    len >>>= 1;
  }
  return arr2;
};

let getEqualSpacedIntsFromRange = (min, max, numValues) => {
  // calculate the range
  let range = Math.abs(max - min);
  let increment = Math.floor(range / (numValues - 1));

  // check that the min is actually the min, and floor it
  min = Math.floor(Math.min(min, max));

  let values = [];
  for (let i = 0; i < numValues; i++) {
    values.push(min + i * increment);
  }
  return values;
};

let createGUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

//converts a color encoded in javascript hex (ie: 0x000028) to css formatted hex string (ie: #000028)
let parseCSSColor = (color) => {
  if (typeof color === "number") {
    //make sure our hexadecimal number is padded out
    color = "#" + ("00000" + (color | 0).toString(16)).substr(-6);
  }
  return color;
};

//calculates the contrasting color for determining overlay or text colors given a background
let getContrast50 = (hexcolor) => {
  return parseInt(hexcolor, 16) > 0xffffff / 2 ? "black" : "white";
};

export {
  // Public Methods
  getEnumDefault,
  createArray,
  getEqualSpacedIntsFromRange,
  createGUID,
  parseCSSColor,
  getContrast50,
};
