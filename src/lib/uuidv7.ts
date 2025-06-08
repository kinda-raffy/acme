// Oldest first
const asc = (a: string, b: string) => {
  const aTime = uuidTimestamp(a).getTime();
  const bTime = uuidTimestamp(b).getTime();
  return aTime - bTime;
};

// Newest first
const desc = (a: string, b: string) => {
  const aTime = uuidTimestamp(a).getTime();
  const bTime = uuidTimestamp(b).getTime();
  return bTime - aTime;
};

export const uuidSort = (c: {
  ids: string[];
  order: 'oldest-first' | 'newest-first' | undefined;
}) => {
  return c.ids.sort(c.order === 'oldest-first' ? asc : desc);
};

export const uuidSortBy = <T>(c: {
  items: T[];
  id: (item: T) => string;
  order?: 'oldest-first' | 'newest-first';
}): T[] => {
  return [...c.items].sort((a, b) => {
    const aId = c.id(a);
    const bId = c.id(b);
    return (c.order === 'oldest-first' ? asc : desc)(aId, bId);
  });
};

export const uuidTimestamp = (uuidv7: string) => {
  const parts = uuidv7.split('-');
  // Get the high bits of the timestamp.
  const highBitsHex = parts[0] + parts[1]!.slice(0, 4);
  // Convert to decimal.
  const timestampInMilliseconds = parseInt(highBitsHex, 16);
  // Convert Unix decimal to Date object.
  return new Date(timestampInMilliseconds);
};
