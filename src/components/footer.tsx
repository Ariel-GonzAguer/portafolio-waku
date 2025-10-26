export const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center gap-4 p-6 border-t mt-8 border-blue-400">
        <form action="" className="flex gap-2 items-center">
          <p>Agregar código:</p>
          <label htmlFor="code" className="mt-2">
            <input
              type="text"
              name="code"
              placeholder="Ingresa tu código aquí"
              className="border border-gray-300 rounded-md p-2 mr-2"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          >
            OK
          </button>

        </form>
    </footer>
  );
};
