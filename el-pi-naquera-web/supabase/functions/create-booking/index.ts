import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_ORIGIN") ?? "https://TU-DOMINIO.es",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);

  try {
    const body = await req.json();
    // Honeypot sencillo contra bots automatizados.
    if (body.website) return json({ error: "Solicitud no válida." }, 400);

    const name = String(body.name ?? "").trim().replace(/\s+/g, " ");
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim().slice(0, 120);
    const notes = String(body.notes ?? "").trim().slice(0, 1000);
    const date = String(body.date ?? "");
    const time = String(body.time ?? "");
    const people = Number(body.people);

    if (name.length < 2 || name.length > 100) return json({ error: "Introduce un nombre válido." }, 400);
    if (!/^[+0-9() .-]{6,25}$/.test(phone)) return json({ error: "Introduce un teléfono válido." }, 400);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Email no válido." }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return json({ error: "Fecha u hora no válida." }, 400);
    if (!Number.isInteger(people) || people < 1 || people > 20) return json({ error: "Número de personas no válido." }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Límite por IP: 5 intentos/hora. Solo se guarda un hash, no la IP en claro.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + (Deno.env.get("RATE_LIMIT_SALT") ?? "")));
    const ipHash = Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2,"0")).join("");
    const { count } = await supabase.from("booking_attempts").select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash).gte("created_at", new Date(Date.now()-60*60*1000).toISOString());
    if ((count ?? 0) >= 5) return json({ error: "Has realizado demasiados intentos. Espera un rato o llama al restaurante." }, 429);
    await supabase.from("booking_attempts").insert({ ip_hash: ipHash });

    const { data, error } = await supabase.rpc("create_booking", {
      p_name: name, p_phone: phone, p_email: email, p_date: date,
      p_time: time, p_people: people, p_notes: notes
    });
    if (error) return json({ error: error.message.includes("capacidad") ? error.message : "No se ha podido confirmar la reserva. Prueba otra hora o contacta con el restaurante." }, 409);
    return json({ ok: true, reference: data, status: "confirmed" });
  } catch {
    return json({ error: "Solicitud no válida. Revisa los datos e inténtalo de nuevo." }, 400);
  }
});
