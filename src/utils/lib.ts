export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function boundTime(time: number, limit: number) {
  return (time + Math.floor((time - 1) / limit)) % (limit + 1);
}
