export const getConfig = (type: string) => {
  return {
    render: type,
  } as const;
};
