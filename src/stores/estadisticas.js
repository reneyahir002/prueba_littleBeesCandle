

import { defineStore } from "pinia";

export const useEstadisticasStore = defineStore("estadisticas", {
  state: () => ({
    ventasRealizadas: 0,
    ingresosTotales: 0,
    //mapa: idProducto -> { id, Nombre, unidades }
    productosVendidos: {},
  }),
  getters: {
    //Devuelve el objeto { id, Nombre, unidades } o null
    productoMasVendido(state) {
      const arr = Object.values(state.productosVendidos);
      if (!arr.length) return null;

      arr.sort((a, b) => b.unidades - a.unidades);

      
      return arr[0];
    },

    productoMasVendidoTexto(state) {
      const p = Object.values(state.productosVendidos).sort((a,b)=>b.unidades - a.unidades)[0];
      return p ? `${p.Nombre} (${p.unidades} unidades)` : "N/A";
    }
  },
  actions: {

    registrarVenta(vendidos, total) {
      const arr = Array.isArray(vendidos) ? vendidos : [...vendidos];
      const itemsVendidos = arr.filter(i => i.cantidad > 0);

      if (itemsVendidos.length === 0) {
  
        return;
      }


      this.ventasRealizadas++;
      this.ingresosTotales += Number(total) || 0;

      //Acumular por producto
      itemsVendidos.forEach(item => {
        const id = item.id;
        if (!this.productosVendidos[id]) {
          this.productosVendidos[id] = {
            id,
            Nombre: item.Nombre,
            unidades: item.cantidad,
          };
        } else {
          this.productosVendidos[id].unidades += item.cantidad;
        }
      });
    },

    resetEstadisticas() {
      this.ventasRealizadas = 0;
      this.ingresosTotales = 0;
      this.productosVendidos = {};
    }
  },

  persist: true,
});