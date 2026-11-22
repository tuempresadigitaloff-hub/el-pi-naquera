(() => {
  const form = document.getElementById('booking-form');
  if (!form) return;
  const msg = document.getElementById('form-message');
  const submit = form.querySelector('button[type="submit"]');
  const setMessage = (text, error = false) => {
    msg.hidden = false;
    msg.textContent = text;
    msg.style.color = error ? '#a32626' : '#27613b';
  };
  const date = document.getElementById('date');
  date.min = new Date().toISOString().slice(0, 10);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!window.supabase || !window.ELPI_SUPABASE_URL ||
        window.ELPI_SUPABASE_URL.includes('TU-PROYECTO') ||
        !window.ELPI_SUPABASE_ANON_KEY ||
        window.ELPI_SUPABASE_ANON_KEY.includes('TU_CLAVE')) {
      setMessage('La reserva online todavía no está conectada. Contacta con el restaurante por teléfono.', true);
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Comprobando disponibilidad…';
    try {
      const client = window.supabase.createClient(
        window.ELPI_SUPABASE_URL, window.ELPI_SUPABASE_ANON_KEY
      );
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(
        `${window.ELPI_SUPABASE_URL}/functions/v1/create-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': window.ELPI_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            email: data.email,
            date: data.date,
            time: data.time,
            people: data.people === '8 o más' ? 8 : Number(data.people),
            notes: data.notes,
            website: data.website || ''
          })
        }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No se pudo completar la reserva.');
      form.reset();
      date.min = new Date().toISOString().slice(0, 10);
      setMessage(`¡Reserva confirmada automáticamente! Código: ${result.reference}. Te recomendamos guardar este código.`);
    } catch (err) {
      setMessage(err.message || 'Ha ocurrido un error. Prueba por teléfono.', true);
    } finally {
      submit.disabled = false;
      submit.textContent = 'Reservar mesa ↗';
    }
  });
})();
