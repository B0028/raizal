// Datos hardcodeados temporalmente — reemplazar con fetch a la base de datos cuando esté disponible
// TODO: migrar a API route + DB query (ej: GET /api/plantas)

export interface Plants {
  tipo_de_planta: string;
  nombre: string;
  familia?: string;
  ciclo_completo: string;
  torre_asignada: string;
  temporada_optima: string;
  disponibilidad: boolean;
  // TODO: cuando venga de DB, este campo contendrá la URL real de la imagen almacenada
  imagen: string;
}

export const plants: Plants[] = [
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Lechuga", familia: "Lactuca sativa", ciclo_completo: "25–28 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/crops/lettuce.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Pak choi", familia: "Brassica rapa", ciclo_completo: "20–30 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Espinaca", familia: "Spinacia oleracea", ciclo_completo: "21–30 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Col rizada (kale)", familia: "Brassica oleracea", ciclo_completo: "30–40 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/crops/kale.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Lechuga romana", familia: "Lactuca sativa", ciclo_completo: "30–55 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Acelga suiza", familia: "Beta vulgaris", ciclo_completo: "30–40 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Mostaza (hojas)", familia: "Brassica juncea", ciclo_completo: "20–26 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Rapini", familia: "Brassica rapa", ciclo_completo: "28–37 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Alazán", familia: "Rumex acetosa", ciclo_completo: "20–40 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Endibia", familia: "Cichorium endivia", ciclo_completo: "45–60 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Verdes de hoja (ciclo corto)", nombre: "Apio", familia: "Apium graveolens", ciclo_completo: "60–80 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Otoño-Invierno", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Hierbas aromáticas (ciclo medio)", nombre: "Albahaca", familia: "Ocimum basilicum", ciclo_completo: "25–40 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Primavera-Verano", disponibilidad: true, imagen: "/crops/basil.png?height=150&width=150" },
  { tipo_de_planta: "Hierbas aromáticas (ciclo medio)", nombre: "Cilantro", familia: "Coriandrum sativum", ciclo_completo: "20–30 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Primavera-Verano", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Hierbas aromáticas (ciclo medio)", nombre: "Menta", familia: "Mentha spicata", ciclo_completo: "45–60 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Primavera-Verano", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Hierbas aromáticas (ciclo medio)", nombre: "Perejil", familia: "Petroselinum crispum", ciclo_completo: "45–60 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Primavera-Verano", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Hierbas aromáticas (ciclo medio)", nombre: "Romero", familia: "Salvia rosmarinus", ciclo_completo: "90–180 días", torre_asignada: "Densidad normal (52)", temporada_optima: "Primavera-Verano", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Frutos pequeños (ciclo largo)", nombre: "Tomates cherry", familia: "Solanum lycopersicum", ciclo_completo: "40–50 días", torre_asignada: "Densidad normal (52)", temporada_optima: "Primavera-Verano", disponibilidad: false, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Frutos pequeños (ciclo largo)", nombre: "Pimiento verde", familia: "Capsicum annuum", ciclo_completo: "40–60 días", torre_asignada: "Densidad normal (52)", temporada_optima: "Primavera-Verano", disponibilidad: false, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Frutos pequeños (ciclo largo)", nombre: "Pepino", familia: "Cucumis sativus", ciclo_completo: "60–90 días", torre_asignada: "Densidad normal (52)", temporada_optima: "Primavera-Verano", disponibilidad: false, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Frutos pequeños (ciclo largo)", nombre: "Pimientos morrones", familia: "Capsicum annuum", ciclo_completo: "45–60 días", torre_asignada: "Densidad normal (52)", temporada_optima: "Primavera-Verano", disponibilidad: false, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Frutos pequeños (ciclo largo)", nombre: "Chile tailandés", familia: "Capsicum annuum", ciclo_completo: "50–80 días", torre_asignada: "Densidad normal (52)", temporada_optima: "Primavera-Verano", disponibilidad: false, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Frutos pequeños (ciclo largo)", nombre: "Fresa", familia: "Fragaria × ananassa", ciclo_completo: "90–100 días", torre_asignada: "Densidad normal (52)", temporada_optima: "Primavera-Verano", disponibilidad: false, imagen: "/crops/strawberry.png?height=150&width=150" },
  { tipo_de_planta: "Microgreens (ciclo ultracorto)", nombre: "Microverde de girasol", familia: "Helianthus annuus", ciclo_completo: "4–6 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Microgreens (ciclo ultracorto)", nombre: "Microverde de repollo morado", familia: "Brassica oleracea", ciclo_completo: "5–7 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Microgreens (ciclo ultracorto)", nombre: "Remolacha microverde", familia: "Beta vulgaris", ciclo_completo: "5–10 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Microgreens (ciclo ultracorto)", nombre: "Rábano blanco microverde", familia: "Raphanus sativus", ciclo_completo: "5–7 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Microgreens (ciclo ultracorto)", nombre: "Rábano morado microverde", familia: "Raphanus sativus", ciclo_completo: "4–5 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Microgreens (ciclo ultracorto)", nombre: "Berro", familia: "Nasturtium officinale", ciclo_completo: "7–10 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
  { tipo_de_planta: "Microgreens (ciclo ultracorto)", nombre: "Brotes de rúcula", familia: "Eruca vesicaria", ciclo_completo: "7–10 días", torre_asignada: "Alta densidad (200)", temporada_optima: "Todo el año", disponibilidad: true, imagen: "/placeholder.png?height=150&width=150" },
];
