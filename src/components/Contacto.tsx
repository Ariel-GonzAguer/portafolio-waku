'use client';

//data
import { servicios } from "../data/servicios";

export default function Contacto() {

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/enviarCorreo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: data.get('user_nombre'),
          user_email: data.get('user_email'),
          user_mensaje: data.get('user_mensaje'),
          servicio: data.get('servicio'),
        }),
      });

      if (response.ok) {
        alert('Mensaje enviado correctamente');
      } else {
        alert('Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el mensaje');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Contáctame</h2>
      <label htmlFor="user_nombre" className="mb-2 font-semibold">Nombre:</label>
      <input type="text" id="user_nombre" name="user_nombre" required className="mb-4 p-2 border border-gray-300 rounded" />
      <label htmlFor="user_email" className="mb-2 font-semibold">Email:</label>
      <input type="email" id="user_email" name="user_email" required className="mb-4 p-2 border border-gray-300 rounded" />
      <label htmlFor="servicio" className="mb-2 font-semibold">Servicio:</label>
      <select id="servicio" name="servicio" required className="mb-4 p-2 border border-gray-300 rounded">
        <option value="">Seleccione un servicio</option>
        {servicios.map((servicio) => (
          <option key={servicio.id} value={servicio.id}>
            {servicio.nombre}
          </option>
        ))}
      </select>
      <label htmlFor="user_mensaje" className="mb-2 font-semibold">Mensaje:</label>
      <textarea id="user_mensaje" name="user_mensaje" rows={5} required className="mb-4 p-2 border border-gray-300 rounded"></textarea>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">Enviar</button>
    </form>
  )
}
