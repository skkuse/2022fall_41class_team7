export const epochToDate = (epochDateTime) => {
  const date = new Date(0);
  date.setUTCSeconds(epochDateTime);
  return date;
};

export const formatEpochTime = (epochDateTime) => {
  const date = epochToDate(epochDateTime);
  return date.toISOString();
};
