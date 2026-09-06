# Auditoría de Santos7 Store

## Resultado

- Catálogo revisado: **65 referencias activas**.
- IDs únicos: **sí**.
- Rutas de imágenes comprobadas: **todas existen**.
- Stock por talla comprobado en las referencias con desglose; las nuevas prendas sin cantidad exacta mantienen esa información pendiente.
- Tallas confirmadas de calzado: **normalizadas a EUR**.
- Se conservaron los archivos nuevos; se retiraron del catálogo las referencias sin imagen y las referencias repetidas o incorrectas confirmadas en la grabación.

## Correcciones aplicadas

Las fotos de `caja 1.jpeg`, `caja 2.jpeg`, `caja 3.jpeg`, `imagen 4.jpeg` e `imgaen 4.jpeg` se usaron como fuente principal para las tallas y unidades. Las dos líneas US de algunas etiquetas son equivalencias hombre/mujer del mismo par, no dos unidades distintas.

| ID | Modelo | Tallas / EUR | Unidades | Precio Santos7 |
| --- | --- | ---: | ---: | ---: |
| 29 | Nike Cosmic Runner (GS) | 36 | 1 | S/ 129 |
| 30 | Nike Phantom GX Club TF | 42 | 1 | S/ 159 |
| 31 | Nike Run Swift 2 (W) | 37.5 | 1 | S/ 215 |
| 32 | Nike In-Season TR 13 (W) | 36.5 | 1 | S/ 200 |
| 33 | Nike Legend 10 Club TF | 43 | 1 | S/ 199.90 |
| 34 | Nike Dunk Low Retro | 42.5, 43 y 44 | 3 | S/ 459.90 |
| 35 | Nike AL8 (W) | 36 | 1 | S/ 399.90 |
| 36 | Nike Air Max Nuaxis | 41 | 1 | S/ 225 |
| 37 | Nike Victori One Shower Slide (W) | 39 | 1 | S/ 85 |
| 38 | Nike Victori One Slide | 40 | 1 | S/ 100 |
| 39 | Nike Pacific LTR (W) | 39 | 2 | S/ 139 |
| 40 | Air Jordan 1 Mid SE | 43 | 1 | S/ 329 |
| 41 | Nike Air Force 1 '07 | 42 | 1 | S/ 385 |
| 43 | Puma Palermo Moda Tongue Wns | 36 | 1 | S/ 159 |
| 44 | Puma-180 | 37 | 1 | S/ 199.90 |
| 45 | Puma RS-X Paisley Wns | 37.5 | 1 | S/ 499.90 |
| 47 | Puma Suede XL Jr | 40.5 | 1 | S/ 399.90 |
| 69 | Mochila Air Jordan | — | 2 | S/ 129 |
| 70 | Nike Ava Rover PRM | 42 | 1 | S/ 299 |
| 71 | Air Jordan 1 Retro High OG | 39 | 1 | S/ 359 |
| 72 | Polera Puma BMW | M, L y XL | No indicado | S/ 110 |
| 73 | Polo Air Jordan | S, M y L | No indicado | S/ 119 |
| 74 | Nike Moto 2K | 40 | 1 | S/ 319 |

Cambios destacados:

- Se sustituyeron tallas BR mal mostradas por las tallas EUR impresas en las cajas.
- Se corrigieron unidades: Phantom, Run Swift, In-Season y Legend son 1 par cada uno; las dos filas de la etiqueta son conversiones de talla.
- Dunk Low conserva 3 pares separados: EUR 42.5, 43 y 44.
- Pacific conserva 2 pares de la misma talla EUR 39 porque aparece en dos cajas/fotos.
- “Model Teague WNS” se corrigió a **Puma Suede XL Jr**, código 397255-01, EUR 40.5.
- El Nike AL8 recuperó su imagen: una segunda clave `images: []` estaba anulando la imagen válida.
- El Air Max Nuaxis conserva la oferta Santos7 de S/ 225; S/ 329.90 queda como precio de etiqueta de referencia.
- Se quitaron textos ambiguos con dos precios y se corrigió el registro con precio pendiente para que aparezca como consulta.
- Se añadieron las seis imágenes nuevas como IDs 69–74, manteniendo los precios y condiciones indicadas en sus mensajes.
- La grabación confirmó el precio del **ID 56 — Jordan Flight Modal · pack x2**: se corrigió de S/ 149.90 a **S/ 100**.
- La grabación confirmó el precio del **ID 20 — Polo**: se corrigió de S/ 69 a **S/ 89**.
- Se retiraron del catálogo activo por repetidos o con datos/precio incorrectos: **ID 8 — Polo Puma**, **ID 49 — Nike Victori One Shower Slide**, **ID 54 — Nike Victori One Slide**, **ID 58 — Gorra BMW Motorsport** e **ID 59 — Gorra Guess monogram**. Sus imágenes y objetos originales se conservaron en `products.js` para poder reactivarlos si se confirman.
- Los registros de zapatillas sin talla EUR legible no se eliminaron automáticamente: permanecen como consulta con “Talla por confirmar” para no inventar datos que la grabación no muestra.

## Validación de la grabación reciente

Se revisó `Grabación de pantalla 2026-09-02 111807.mp4` cuadro por cuadro. La grabación muestra una versión anterior del catálogo y confirma:

- El polo Puma señalado como repetido, junto con las dos fichas Victori One sin talla EUR confirmada, no deben seguir activos como referencias separadas.
- El polo Nike señalado debe venderse a **S/ 89** y el pack Jordan Flight Modal x2 a **S/ 100**.
- Las gorras BMW Motorsport y Guess monogram aparecen marcadas como repetidas y con precio incorrecto; se retiraron hasta contar con precio real.
- El Air Max Dn y otros pares con talla no legible se conservaron como consulta: el video no proporciona una talla EUR nueva para corregirlos.

- Se priorizaron al inicio del catálogo las tarjetas de presentación clara/blanca, como pediste.
- Se comprobó que el logo adjunto coincide exactamente con `assets/santos7-logo.jpeg`; conserva su versión original en superficies claras y una adaptación monocromática blanca en fondos oscuros, sin recortes.

Para contrastar conversiones Nike se revisaron las tablas oficiales de [calzado hombre Nike Perú](https://www.nike.com.pe/size-charts/calzado-hombre.html), [calzado mujer Nike Perú](https://www.nike.com.pe/size-charts/calzado-mujer.html) y la [tabla Nike Brasil](https://static.nike.com.br/web/prd/tabela-de-medidas.html). También se contrastaron el [Phantom GX Club TF](https://www.nike.com.pe/nike-phantom-gx-club-zapatillas-de-futbol-para-pasto-sintetico-turf/dd9486-446/10809055011.html) y el [Air Max Nuaxis FD4329-104](https://www.nike.com.pe/nike-air-max-nuaxis-zapatillas-para-hombre/fd4329-104/11019465017.html).

## Información que todavía falta

Se retiraron del catálogo las referencias sin imagen: **Adidas · caja negra (ID 42)**, **Puma X Aeith (ID 46)**, **Gorra Puma · referencia (ID 67)** y **Polo Puma Motorsport (ID 68)**. Se conservaron los archivos originales en el workspace.

No se inventaron tallas, precios o modelos cuando no había una etiqueta legible:

- **ID 48 — Adidas Adilette azul:** falta talla EUR y stock confirmado.
- **ID 50 — Fila Drifter Basic:** falta talla EUR y stock confirmado.
- **ID 51 — Nike Air Max Dn:** falta talla EUR y stock confirmado.
- **ID 52 — Puma Leadcat 2.0:** falta talla EUR y stock confirmado.
- **ID 53 — Fila Drifter Basic negro/rojo:** falta talla EUR y stock confirmado.
- **ID 55 — Pack x3 polos New Balance:** falta talla y stock confirmado.
- **ID 63 — Polo Puma F1:** falta talla y stock confirmado.
- **ID 64 — Mochila Kobe / FCB:** faltan medidas y stock confirmado.
- **ID 65 — JR. Mercurial Vapor 16 Academy:** falta talla EUR; hay 1 unidad indicada.
- **ID 66 — Tiempo Legend 9 Academy TF:** falta talla EUR; hay 1 unidad indicada.
- **ID 69 — Mochila Air Jordan:** faltan medidas; hay 2 unidades indicadas.
- **ID 72 — Polera Puma BMW:** falta cantidad exacta por talla; se indicaron M, L y XL y últimas unidades.
- **ID 73 — Polo Air Jordan:** falta cantidad exacta por talla; se indicaron S, M y L como talla completa.

## Proceso del video y diseño

El archivo original `santos store.mp4` se convirtió a `assets/santos-store-web.mp4` y se usa como pieza de campaña en primer plano de la portada, antes de la señal social y el catálogo:

1. Se analizó el archivo original: aproximadamente 39 segundos, resolución 4K (3840×2160), video HEVC/H.265 y audio AAC.
2. Se creó el bloque `campaign-video` con el mensaje de marca **“Lo tuyo se nota.”**.
3. Se añadieron CTAs directos a `#catalogo` y WhatsApp con “Entrar al catálogo” y “Hablar con Santos7”, además de un control accesible para pausar/reproducir.
4. Se creó una copia compatible para web en 1920×1080, H.264/AAC y MP4 `faststart` (aprox. 6.7 MB). El video usa `autoplay`, `muted`, `loop`, `playsinline` y carga diferida mediante `IntersectionObserver`.
5. Se añadió fallback con el logo de Santos7 si el navegador no reproduce el video, y se respeta `prefers-reduced-motion`.
6. Se simplificó la portada: se retiraron la barra superior y las secciones decorativas con fotos antes del catálogo; ahora el video abre la experiencia justo debajo del encabezado, seguido por la señal social y los productos.
7. El video se presenta ahora a ancho completo, con una altura más protagonista y encuadre `cover`, sin tarjeta, bordes redondeados ni marcos negros visibles; conserva una identidad de marca mínima, CTA y control de pausa.
8. El diseño conserva el sistema Santos7: negro editorial, blanco, acento coral, tipografía Poppins/Manrope, etiquetas técnicas y CTA de alto contraste.
9. Se ajustó el orden del catálogo para priorizar tonos claros/blancos, se corrigió el logo para que conserve su composición original y se pulieron los botones del video con estilo premium.
10. Se refinó la primera impresión: el encabezado se integra sobre la campaña, el video ocupa la pantalla inicial y la interfaz dirige la atención desde “Lo tuyo se nota” hacia descubrir y comprar.
11. Se retiró el logo duplicado dentro del video para dejar una portada más limpia; el logo principal queda en el encabezado y el video se apoya en una línea coral, gradiente de lectura y jerarquía tipográfica.

Antes de publicar en Vercel, incluye en el commit `assets/santos-store-web.mp4` y las fotos de cajas. El archivo original `santos store.mp4` puede conservarse como máster, pero la portada usa la copia web compatible.
