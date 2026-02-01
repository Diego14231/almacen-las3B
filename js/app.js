document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    verificarEstadoLocal();
    // Revisar el horario cada 1 minuto por si cambia mientras la ven
    setInterval(verificarEstadoLocal, 60000);
});

// TU NÚMERO DE TELÉFONO (Cámbialo aquí)
const NUMERO_WHATSAPP = "56974280171"; 

async function cargarProductos() {
    const contenedor = document.getElementById("grid-productos");
    
    try {
        // Leemos el archivo JSON
        const respuesta = await fetch(`data/productos.json?v=${Date.now()}`);
        const productos = await respuesta.json();

        // Limpiamos el contenedor
        contenedor.innerHTML = "";

        // Creamos una tarjeta por cada producto
        productos.forEach(producto => {
            
            const imagen = producto.img ? `assets/images/productos/${producto.img}` : "assets/images/productos/SIN-STOCK.jpg";
            
            // Texto para WhatsApp
            const mensaje = `Hola, quiero comprar la oferta de: ${producto.nombre} a $${producto.precio}`;
            const linkWa = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

            const card = `
                <div class="card">
                    <img src="${imagen}" alt="${producto.nombre}" loading ="lazy" height="300" style="object-fit: cover;" onerror="this.src='https://placehold.co/150x150?text=Sin+Foto'">
                    <div class="card-body">
                        <div class="card-title">${producto.nombre}</div>
                        ${producto.detalle ? `<div class="card-detalle">${producto.detalle}</div>` : ''}
                        <div class="price-tag">$${producto.precio}</div>
                        <a href="${linkWa}" class="btn-whatsapp-card" target="_blank">
                            <i class="fab fa-whatsapp"></i> Pedir
                        </a>
                    </div>
                </div>
            `;
            contenedor.innerHTML += card;
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
        contenedor.innerHTML = "<p>Hubo un error cargando las ofertas :(</p>";
    }
}

function verificarEstadoLocal() {
    const ahora = new Date();
    const hora = ahora.getHours(); 
    const dia = ahora.getDay(); 

    // Horarios: 9 a 14 y 16 a 22 (10pm)
    // Nota: hora < 14 incluye hasta las 13:59
    // Nota: hora < 22 incluye hasta las 21:59
    
    const turnoManana = hora >= 9 && hora < 14;
    const turnoTarde = hora >= 16 && hora < 22;
    
    const abierto = turnoManana || turnoTarde;
    
    const estadoElem = document.getElementById("estado-local");

    if (abierto) {
        estadoElem.innerHTML = '<i class="fas fa-door-open"></i> ABIERTO AHORA';
        estadoElem.className = "abierto";
    } else {
        estadoElem.innerHTML = '<i class="fas fa-door-closed"></i> CERRADO AHORA';
        estadoElem.className = "cerrado";
    }
}