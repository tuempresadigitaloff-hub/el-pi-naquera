# Activar reservas en la nube — El Pi de Nàquera

## Qué incluye
- Reservas compartidas en una base de datos Supabase: se consultan desde varios móviles/ordenadores.
- Confirmación automática únicamente cuando la función del servidor verifica que queda capacidad.
- Bloqueo transaccional por fecha y turno para evitar que dos solicitudes simultáneas ocupen las últimas plazas.
- Panel privado en `admin-cloud.html`, con acceso mediante Supabase Auth.
- Protección: validación en servidor, límite de 5 intentos por IP y hora (hash de IP), campo trampa anti-bots, RLS y clave secreta solo en servidor.

## Importante antes de publicar
La web no queda conectada solo por añadir un dominio. Hace falta crear y configurar el proyecto de base de datos. La capacidad inicial se ha fijado provisionalmente en **40 comensales por turno**. Debe ajustarse a la capacidad real del restaurante y a sus horarios antes de activar reservas automáticas. El sistema no conoce por sí solo las mesas físicas, turnos especiales, cierres, festivos ni reservas telefónicas.

## 1. Crear Supabase
1. Crea un proyecto en https://supabase.com.
2. En SQL Editor ejecuta `supabase/migrations/001_reservations.sql`.
3. En Authentication > Providers, deja Email habilitado y desactiva los registros públicos (Disable signups).
4. Crea manualmente un usuario administrador desde Authentication > Users. No publiques un formulario de registro.
5. En Project Settings > API copia Project URL y la clave `anon`/publishable.

## 2. Configurar la web
Edita `js/supabase-config.js`:
- `ELPI_SUPABASE_URL`: URL del proyecto.
- `ELPI_SUPABASE_ANON_KEY`: clave pública anon/publishable.

Nunca pongas `service_role` en archivos HTML o JavaScript públicos.

## 3. Desplegar la función de reservas
Instala Supabase CLI y vincula el proyecto:
```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase functions deploy create-booking
supabase secrets set SITE_ORIGIN=https://TU-DOMINIO.es RATE_LIMIT_SALT=una-frase-larga-aleatoria
```
La plataforma proporciona `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` al entorno de la Edge Function. No los copies al navegador.
Configura `SITE_ORIGIN` con el dominio real, incluyendo `https://` y sin barra final.

## 4. Publicar
Sube la carpeta `el-pi-naquera-web` a tu hosting estático y conecta el dominio. Prueba el formulario desde dos dispositivos y el panel `admin-cloud.html`.

## 5. Ajustar capacidad
En SQL Editor:
```sql
update public.booking_settings set value = 40 where key = 'default_capacity';
```
Sustituye 40 por el aforo máximo real que el restaurante quiera aceptar por cada hora/turno. Las reservas por teléfono deben descontarse manualmente o integrarse para evitar sobreventa.

## Seguridad y privacidad
- Activa HTTPS en el dominio.
- No actives registros públicos de usuarios.
- Crea cuentas individuales para cada persona autorizada y elimina accesos cuando ya no deban entrar.
- Añade una política de privacidad y define el plazo de conservación de los datos.
- La protección anti-bots incluida (honeypot y límite por IP) es una base; para exposición pública se recomienda añadir Cloudflare Turnstile y monitorización.
- No se envían emails/SMS de confirmación en esta versión. La confirmación aparece en pantalla con un código de reserva.
- La función confirma automáticamente según aforo global por hora, no por distribución de mesas. Verifica horarios, turnos, aforo y cierres antes de producción.
