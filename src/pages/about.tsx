export default async function AboutPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
    </div>

    // Establecer el título y meta tags de la página
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = () => {
  return {
    render: 'static',
  } as const;
};
