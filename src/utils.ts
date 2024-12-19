export const arrCount = (arr: Array<any>) => arr.length
export const getUniqueItems = (arr: Array<any>) => [...new Set(arr)];
export const removeSpaces = (str: string): string => str.replace(/\s/g, "");