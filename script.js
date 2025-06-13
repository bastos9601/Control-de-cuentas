// Ocultar contenido principal al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".max-w-7xl").style.display = "none";
});

// Login simple
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const usuario = document.getElementById("loginUsuario").value.trim();
  const contrasena = document.getElementById("loginContrasena").value.trim();

  if (usuario === "alfredo" && contrasena === "Alfredo01@") {
    document.getElementById("loginContainer").style.display = "none";
    document.querySelector(".max-w-7xl").style.display = "block";
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
});

// Función para cerrar sesión
function cerrarSesion() {
  // Ocultar el contenido principal
  document.querySelector(".max-w-7xl").style.display = "none";

  // Mostrar el contenedor de login
  document.getElementById("loginContainer").style.display = "flex";

  // Limpiar campos del formulario de login
  document.getElementById("loginUsuario").value = "";
  document.getElementById("loginContrasena").value = "";

  // Ocultar mensaje de error (si lo había)
  document.getElementById("loginError").classList.add("hidden");
}

// Funcionalidad de cuentas
let cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
let editIndex = null;

function renderizarTabla() {
  const tabla = document.getElementById("tablaCuentas");
  tabla.innerHTML = "";
  cuentas.forEach((c, i) => {
    const mensaje = `Hola ${c.nombre}, recordárte que tu cuenta de ${c.servicio} vence el ${c.vencimiento}. Seguirá con el servicio contratado.`;
    const linkWhatsApp = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    tabla.innerHTML += `
      <tr class="border-t">
        <td class="py-2 px-4">${c.servicio}</td>
        <td class="py-2 px-4">${c.tipoCuenta}</td>
        <td class="py-2 px-4">${c.usuario}</td>
        <td class="py-2 px-4">${c.contrasena}</td>
        <td class="py-2 px-4">$${c.precio}</td>
        <td class="py-2 px-4">${c.fechaInicio}</td>
        <td class="py-2 px-4">${c.vencimiento}</td>
        <td class="py-2 px-4">${c.estado}</td>
        <td class="py-2 px-4">${c.nombre} ${c.apellido}<br/><span class="text-blue-600">${c.whatsapp}</span></td>
        <td class="py-2 px-4">${c.metodoPago}</td>
        <td class="py-2 px-4 flex flex-col gap-1">
          <button onclick="editarCuenta(${i})" class="text-blue-600 hover:underline">Editar</button>
          <button onclick="eliminarCuenta(${i})" class="text-red-600 hover:underline">Eliminar</button>
          <a href="${linkWhatsApp}" target="_blank" class="text-green-600 hover:underline">Cobrar</a>
        </td>
      </tr>`;
  });
}

function guardarEnStorage() {
  localStorage.setItem("cuentas", JSON.stringify(cuentas));
}

document.getElementById("formCuenta").addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevaCuenta = {
    servicio: document.getElementById("servicio").value,
    tipoCuenta: document.getElementById("tipoCuenta").value,
    usuario: document.getElementById("usuario").value,
    contrasena: document.getElementById("contrasena").value,
    precio: document.getElementById("precio").value,
    fechaInicio: document.getElementById("fechaInicio").value,
    vencimiento: document.getElementById("vencimiento").value,
    estado: document.getElementById("estado").value,
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    whatsapp: document.getElementById("whatsapp").value,
    metodoPago: document.getElementById("metodoPago").value
  };

  // Validaciones extra
  if (nuevaCuenta.precio <= 0) {
    alert("El precio debe ser mayor que 0.");
    return;
  }
  if (new Date(nuevaCuenta.vencimiento) <= new Date(nuevaCuenta.fechaInicio)) {
    alert("La fecha de vencimiento debe ser posterior a la de inicio.");
    return;
  }
  if (!/^\d+$/.test(nuevaCuenta.whatsapp)) {
    alert("El número de WhatsApp debe contener solo números.");
    return;
  }

  if (editIndex !== null) {
    cuentas[editIndex] = nuevaCuenta;
    editIndex = null;
  } else {
    cuentas.push(nuevaCuenta);
  }

  guardarEnStorage();
  renderizarTabla();
  this.reset();
});

function editarCuenta(i) {
  const c = cuentas[i];
  document.getElementById("servicio").value = c.servicio;
  document.getElementById("tipoCuenta").value = c.tipoCuenta;
  document.getElementById("usuario").value = c.usuario;
  document.getElementById("contrasena").value = c.contrasena;
  document.getElementById("precio").value = c.precio;
  document.getElementById("fechaInicio").value = c.fechaInicio;
  document.getElementById("vencimiento").value = c.vencimiento;
  document.getElementById("estado").value = c.estado;
  document.getElementById("nombre").value = c.nombre;
  document.getElementById("apellido").value = c.apellido;
  document.getElementById("whatsapp").value = c.whatsapp;
  document.getElementById("metodoPago").value = c.metodoPago;
  editIndex = i;
}

function eliminarCuenta(i) {
  if (confirm("¿Eliminar esta cuenta?")) {
    cuentas.splice(i, 1);
    guardarEnStorage();
    renderizarTabla();
  }
}

function limpiarFormulario() {
  document.getElementById("formCuenta").reset();
  editIndex = null;
}

renderizarTabla();
