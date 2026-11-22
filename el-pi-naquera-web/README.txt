EL PI DE NÀQUERA — PROTOTIPO WEB COMPLETO

PÁGINAS
- index.html: inicio
- nosotros.html: presentación del restaurante
- carta.html: carta por categorías, con filtros
- galeria.html: galería visual
- reservas.html: contacto y formulario de solicitud de prueba
- admin.html: panel de administración

ADMINISTRADOR (siguiendo el flujo del proyecto de referencia)
- Acceso directo: /admin.html
- También hay enlace discreto "Acceso administración" en el pie de página.
- En el primer acceso, el administrador crea una contraseña de al menos 8 caracteres.
- Después inicia sesión con esa contraseña.
- El panel permite editar nombre, precio y descripción de productos; añadir y eliminar productos; consultar solicitudes, cambiar estados, eliminarlas y descargar una copia JSON.
- Los cambios de carta se reflejan en carta.html al abrirla en el mismo navegador.
- Igual que en el proyecto de referencia, se utiliza localStorage. No hay base de datos ni sincronización entre dispositivos.
- IMPORTANTE: no es un sistema de seguridad de producción. El control de acceso se ejecuta en el navegador. Para un restaurante real se recomienda backend con autenticación y base de datos, HTTPS, control de permisos y política de privacidad.

INFORMACIÓN RECOPILADA
- Nombre: Restaurant El Pi / El Pi de Nàquera.
- Dirección publicada: A Torres, S-N, Av. Burjassot, 0, 46119 Nàquera, Valencia.
- Teléfono listado: +34 961 68 01 70.
- Email listado en un directorio: info@restaurantelpinaquera.com (pendiente de confirmación).
- Web mencionada en directorios: restaurantelpinaquera.com (la web no se pudo consultar durante la elaboración).
- Cocina: mediterránea / española.
- Referencias gastronómicas públicas: almuerzos y bocadillos, tapas, tostadas, mariscos, raciones y arroces/fideuà.
- Horario de referencia encontrado en directorios: 08:30–17:00 lunes, martes y jueves a domingo; miércoles cerrado. Confirmar antes de publicar.
- La carta recoge nombres de platos de una página pública de menú de terceros. Los precios no se han completado porque no había información consistente/actual confirmada.
- La información de directorios puede estar desactualizada. Validar con el restaurante antes de publicar.

FOTOGRAFÍAS
Las fotos son imágenes de referencia de Unsplash, no fotografías oficiales de El Pi. Sustituir por imágenes propias/autorizadas antes de publicar.

PUBLICACIÓN
Sube el contenido de esta carpeta a la carpeta raíz del hosting (por ejemplo htdocs). Mantén la estructura css/ y js/. Abre index.html desde el dominio.
Para probar el administrador en local, abre la carpeta mediante Live Server o un servidor local; no uses file:// porque el administrador necesita leer carta.html.


FOTOGRAFIAS Y PRECIOS (actualizacion)
- Se han sustituido las imagenes de stock por fotografias atribuidas a Restaurant El Pi en su galeria publica de Carta.menu. Las imagenes se cargan desde la publicacion original: https://carta.menu/restaurants/valencia-1/el-pi-naquera
- Antes de publicar comercialmente, confirma con el restaurante los permisos de reutilizacion de esas fotografias.
- No se han añadido precios porque las fuentes publicas consultadas no permiten verificar con fiabilidad los precios actuales. No se deben inventar.


NUEVA VERSION CON RESERVAS EN LA NUBE
- Ver CONFIGURACION_NUBE.md para crear Supabase, ejecutar el SQL y desplegar la función.
- El formulario reservas.html llama al servidor; ya no almacena solicitudes en localStorage.
- Panel compartido: admin-cloud.html. El usuario administrador se crea manualmente en Supabase.
- La confirmación automática depende del aforo provisional (40 personas por turno), que debe revisarse con el restaurante.
- El panel local admin.html sigue existiendo para edición local de carta; la gestión de reservas compartida está en admin-cloud.html.
- No activar el sistema en producción hasta completar configuración, aforo real, horarios, privacidad y pruebas.
