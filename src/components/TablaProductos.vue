<template>
  <v-container>
  
    <v-row class="d-flex align-center mb-4">
      <v-col cols="6">
        <v-text-field
          v-model="search"
          label="Buscar producto"
          prepend-inner-icon="mdi-magnify"
          dense
          outlined
        />
      </v-col>
      <v-col cols="6" class="d-flex justify-end">
        <v-btn color="green" class="mr-2" @click="openAddDialog">
          <v-icon left>mdi-plus</v-icon> Agregar Producto
        </v-btn>
        <v-btn color="blue" @click="dialogVenta = true">
          <v-icon left>mdi-cash-register</v-icon> Registrar Venta
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de productos -->
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      class="elevation-1 custom-header"
    >
      <template v-slot:item.Imagen="{ item }">
        <v-img :src="item.Imagen" max-width="80" max-height="80" contain />
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small color="blue" class="mr-2" @click="openEditDialog(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>


    <v-dialog v-model="dialogProducto" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditing ? "Editar Producto" : "Agregar Producto" }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedItem.Nombre" label="Nombre" outlined />
          <v-text-field v-model="editedItem.Descripción" label="Descripción" outlined />
          <v-text-field v-model.number="editedItem.Precio" label="Precio" type="number" outlined />
          <v-text-field v-model.number="editedItem.Cantidad" label="Cantidad" type="number" outlined />

          <!-- Subir imagen -->
          <v-file-input
            label="Seleccionar Imagen"
            accept="image/*"
            @change="onFileChange"
            outlined
            dense
          />
          <v-img
            v-if="editedItem.Imagen"
            :src="editedItem.Imagen"
            max-width="100"
            max-height="100"
            contain
            class="mt-2"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green" @click="saveItem">Guardar</v-btn>
          <v-btn color="red" text @click="dialogProducto = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogVenta" max-width="700px">
      <v-card>
        <v-card-title>Registrar Venta</v-card-title>
        <v-card-text>
    
        <v-text-field
          v-model="cliente"
          label="Nombre del Cliente"
          outlined
          class="mb-4"
        />

        
          <v-data-table
            :headers="ventaHeaders"
            :items="ventaItems"
            class="elevation-1"
          >

        
            <template v-slot:item.cantidad="{ item }">
              <v-text-field
                v-model.number="item.cantidad"
                type="number"
                min="0"
                max="item.maxCantidad"
                @input="calcularTotal"
                dense
              />
            </template>

            <template v-slot:item.Precio="{ item }">
              ${{ item.Precio.toFixed(2) }}
            </template>

            <template v-slot:item.subtotal="{ item }">
              ${{ (item.cantidad * item.Precio).toFixed(2) }}
            </template>


          </v-data-table>
          <div class="text-right mt-4 font-weight-bold">
            Total: ${{ totalVenta.toFixed(2) }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green" @click="confirmarVenta">Confirmar Venta</v-btn>
          <v-btn color="red" text @click="dialogVenta = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import jsPDF from "jspdf";   
import autoTable from "jspdf-autotable";   
import { useEstadisticasStore } from "@/stores/estadisticas";


const estadisticasStore = useEstadisticasStore();

const search = ref("");
const dialogProducto = ref(false);
const dialogVenta = ref(false);
const isEditing = ref(false);


const cliente = ref("");

const headers = [
  { title: "ID", key: "id" },
  { title: "Imagen", key: "Imagen" },
  { title: "Nombre", key: "Nombre" },
  { title: "Descripción", key: "Descripción" },
  { title: "Precio", key: "Precio" },
  { title: "Cantidad", key: "Cantidad" },
  { title: "Acciones", key: "actions", sortable: false },
];

const items = reactive([
  {
    id: 1,
    Imagen: "/images/velaMediana.jpg",
    Nombre: "Vela de Miel Mediano",
    Descripción: "Vela aromatica de miel tamaño mediano",
    Precio: 50.00,
    Cantidad: 25,
  },
  {
    id: 2,
    Imagen: "/images/velaGrande.jpg",
    Nombre: "Vela de Miel Grande",
    Descripción: "Vela aromatica de miel tamaño grande",
    Precio: 75.00,
    Cantidad: 14,
  },
  {
    id: 3,
    Imagen: "/images/velaMini.jpg",
    Nombre: "Vela de Miel pequeña",
    Descripción: "Vela aromatica de miel tamaño pequeño",
    Precio: 15.00,
    Cantidad: 56,
  },
  {
    id: 4,
    Imagen: "/images/paqueteVelaGrande.jpg",
    Nombre: "Paquete de velas Grandes (6 piezas)",
    Descripción: "Paquete de velas grandes ",
    Precio: 460.00,
    Cantidad: 5,
  },
  {
    id: 5,
    Imagen: "/images/velaMiniPaquete.jpg",
    Nombre: "Paquete de velas pequeñas (16 piezas)",
    Descripción: "Paquete de velas pequeñas",
    Precio: 160.00,
    Cantidad: 12,
  },
  {
    id: 6,
    Imagen: "/images/vasoVela.jpg",
    Nombre: "Vaso para vela",
    Descripción: "Vaso para velas",
    Precio: 5.00,
    Cantidad: 15,
  },
]);


const editedItem = reactive({
  id: null,
  Imagen: "",
  Nombre: "",
  Descripción: "",
  Precio: 0,
  Cantidad: 0,
});

const openAddDialog = () => {
  isEditing.value = false;
  Object.assign(editedItem, { id: null, Imagen: "", Nombre: "", Descripción: "", Precio: 0, Cantidad: 0 });
  dialogProducto.value = true;
};

const openEditDialog = (item) => {
  isEditing.value = true;
  Object.assign(editedItem, item);
  dialogProducto.value = true;
};

//Guardar producto
const saveItem = () => {
  if (isEditing.value) {
    const index = items.findIndex((i) => i.id === editedItem.id);
    if (index > -1) Object.assign(items[index], editedItem);
  } else {
    editedItem.id = items.length ? items[items.length - 1].id + 1 : 1;
    items.push({ ...editedItem });
  }
  dialogProducto.value = false;
};

//Eliminar producto
const deleteItem = (item) => {
  if (confirm(`¿Eliminar ${item.Nombre}?`)) {
    const index = items.indexOf(item);
    if (index > -1) items.splice(index, 1);
  }
};

//Manejo de subida de archivos
const onFileChange = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editedItem.Imagen = e.target.result; //Base64
    };
    reader.readAsDataURL(file);
  }
};


const ventaHeaders = [
  { title: "Nombre", key: "Nombre" },
  { title: "Precio", key: "Precio" },
  { title: "Cantidad", key: "cantidad" },
  { title: "Subtotal", key: "subtotal" },
];

const ventaItems = reactive([]);
const totalVenta = ref(0);

const calcularTotal = () => {
  totalVenta.value = ventaItems.reduce(
    (acc, item) => acc + item.cantidad * item.Precio,
    0
  );
};

//Generar recibo PDF
const generarReciboPDF = () => {
  const doc = new jsPDF();
  const fecha = new Date().toLocaleString();

  doc.setFontSize(16);
  doc.text("Recibo de Venta", 14, 20);

  doc.setFontSize(12);
  doc.text(`Fecha: ${fecha}`, 14, 30);
  doc.text(`Cliente: ${cliente.value || "N/A"}`, 14, 37);

 
  const productos = ventaItems
    .filter((i) => i.cantidad > 0)
    .map((i) => [
      i.Nombre,
      i.cantidad,
      `$${i.Precio.toFixed(2)}`,
      `$${(i.cantidad * i.Precio).toFixed(2)}`,
    ]);

  autoTable(doc, {
    startY: 45,
    head: [["Producto", "Cantidad", "Precio", "Subtotal"]],
    body: productos,
  });


  //Total
  doc.text(
    `Total: $${totalVenta.value.toFixed(2)}`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  doc.save(`recibo_${Date.now()}.pdf`);
};

const confirmarVenta = () => {
  if (!cliente.value.trim()) {
    alert("Por favor ingresa el nombre del cliente.");
    return;
  }


  const vendidos = [...ventaItems]
    .filter(i => i.cantidad > 0)
    .map(i => ({ id: i.id, Nombre: i.Nombre, cantidad: i.cantidad }));

  if (vendidos.length === 0) {
    alert("Selecciona al menos un producto con cantidad mayor a 0.");
    return;
  }


  ventaItems.forEach((venta) => {
    const producto = items.find((i) => i.id === venta.id);
    if (producto) producto.Cantidad -= venta.cantidad;
  });


  if (confirm("¿Desea generar un recibo en PDF de esta venta?")) {
    generarReciboPDF();
  }

  estadisticasStore.registrarVenta(ventaItems, totalVenta.value);
  
  

  generarReciboPDF();

  //Reset
  dialogVenta.value = false;
  cliente.value = "";
  calcularTotal();
};


watch(dialogVenta, (val) => {
  if (val) {
    ventaItems.splice(0, ventaItems.length, ...items.map((p) => ({
      ...p,
      cantidad: 0,
      maxCantidad: p.Cantidad,
    })));
    calcularTotal();
  }
});
</script>

<style>
.custom-header thead th {
  background-color: #1e293b;
  color: #f9fafb;
  font-size: 14px;
  text-transform: uppercase;
}
</style>