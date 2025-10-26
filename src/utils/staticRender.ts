// config type
export type ConfigProps = {
  render: "static";
  title: string;
  description: string;
  keywords: string;
  imageUrl?: string;
  ogSiteName?: "Gato Rojo Lab";
};

export function getConfig({ title, description, keywords, imageUrl }: Omit<ConfigProps, 'render' | 'ogSiteName'>) {
  return async function getConfig(){
      return {
        render: "static",
        title,
        description,
        keywords,
        imageUrl
      } as const;
  }

}
