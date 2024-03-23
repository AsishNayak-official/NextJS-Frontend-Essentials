export function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 4) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}


export function getRequisitionID(reqID: number | string) {
  if (!reqID) {
    return "--";
  }
  return "RQ-" + reqID;
}

export function makeFirstLetterUpperCase(str: string) {
  if (!str) {
    return "--";
  }
  return str.split("")[0].toUpperCase() + str.slice(1, str.length);
}

export function getPanelistName(name: string) {
  if (!name) {
    return "--";
  }
  const [first, last] = name.split(".");
  return makeFirstLetterUpperCase(first) + " " + makeFirstLetterUpperCase(last);
}

export const debounce = (func: Function, delay: number) => {
  let timerId: any;
  return (...args: any[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
