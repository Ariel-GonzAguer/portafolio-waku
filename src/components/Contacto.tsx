'use client';

//data
import { servicios } from '../data/servicios';
// toast
import { Toaster, toast } from 'sonner';
// utils
import { info as logInfo } from '../utils/logger';

export default function Contacto() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Guardar referencia del formulario antes de cualquier await para evitar el problema
    // con eventos synthetic que son liberados por React.
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    // Obtener el ID del servicio seleccionado
    const servicioId = data.get('servicio') as string;

    // Buscar el nombre del servicio por su ID
    const servicioSeleccionado = servicios.find(s => s.id.toString() === servicioId);
    const nombreServicio = servicioSeleccionado ? servicioSeleccionado.nombre : 'Otro';

    try {
      const response = await fetch('/api/enviarCorreo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_nombre: data.get('user_nombre'),
          user_email: data.get('user_email'),
          user_mensaje: data.get('user_mensaje'),
          servicio: nombreServicio, // ← Ahora envía el nombre en lugar del ID
        }),
      });

      if (response.ok) {
        toast.success('Mensaje enviado correctamente');
        // Limpiar el formulario después del envío exitoso usando la referencia guardada
        form.reset();
      } else {
        toast.error('Error al enviar el mensaje');
      }
    } catch (error) {
      logInfo('Error:', error);
      toast.error('Error al enviar el mensaje');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-6 bg-gris-heavy"
      title="formulario de contacto"
    >
      <Toaster richColors closeButton />
      <h2 className="text-2xl font-bold mb-4 text-center">Contáctenos</h2>
      <label htmlFor="user_nombre" className="mb-2 font-semibold">
        Nombre:
      </label>
      <input
        type="text"
        id="user_nombre"
        name="user_nombre"
        required
        className="mb-4 p-2 border border-gray-300 rounded focus:ring-6 focus:ring-doradoSK"
      />
      <label htmlFor="user_email" className="mb-2 font-semibold">
        Email:
      </label>
      <input
        type="email"
        id="user_email"
        name="user_email"
        required
        className="mb-4 p-2 border border-gray-300 rounded focus:ring-6 focus:ring-doradoSK"
      />
      <label htmlFor="servicio" className="mb-2 font-semibold">
        Servicio:
      </label>
      <select
        id="servicio"
        name="servicio"
        required
        className="mb-4 p-2 border border-gray-300 rounded focus:ring-6 focus:ring-doradoSK"
      >
        <option value="" disabled defaultChecked className="bg-gris-heavy text-white">
          Seleccione un servicio
        </option>
        {servicios.map(servicio => (
          <option key={servicio.id} value={servicio.id} className="bg-gris-heavy text-white">
            {servicio.nombre}
          </option>
        ))}
        <option value="otro" className="bg-gris-heavy text-white">
          Otro
        </option>
      </select>
      <label htmlFor="user_mensaje" className="mb-2 font-semibold">
        Mensaje:
      </label>
      <textarea
        id="user_mensaje"
        name="user_mensaje"
        rows={5}
        required
        className="mb-4 p-2 border border-gray-300 rounded focus:ring-6 focus:ring-doradoSK"
      ></textarea>
      <button
        type="submit"
        className="bg-doradoSK text-black font-bold w-[200px] m-[0_auto] p-2 rounded hover:bg-doradoSK-dark transition-colors"
      >
        Enviar
      </button>
    </form>
  );
}
