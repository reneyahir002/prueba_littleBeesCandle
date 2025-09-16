<template>
  <v-container>
    <h1>Estadísticas de Ventas</h1>

    <v-card class="pa-4 mt-4">
      <p><strong>Ventas realizadas:</strong> {{ estadisticasStore.ventasRealizadas }}</p>
      <p><strong>Ingresos totales:</strong> ${{ estadisticasStore.ingresosTotales.toFixed(2) }}</p>
      <p><strong>Producto más vendido:</strong> {{ productoMasVendidoTexto }}</p>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useEstadisticasStore } from "@/stores/estadisticas";

const estadisticasStore = useEstadisticasStore();

const productoMasVendidoTexto = computed(() => {
  const p = estadisticasStore.productoMasVendido;
  return p ? `${p.Nombre} (${p.unidades} unidades)` : "N/A";
});
</script>