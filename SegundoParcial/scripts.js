class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    mostrarDatos() {
        return(`ID: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Fecha de Nacimiento: ${this.fechaNacimiento}`);
    }

    toString() {
        return `Persona: ${this.nombre} ${this.apellido}`;
    }

    toJson() {
        return JSON.stringify(this);
    }
}


// Clase Empleado (hereda de Persona)
class Ciudadano extends Persona {
constructor(id, nombre, apellido, fechaNacimiento, dni) {
    super(id, nombre, apellido, fechaNacimiento);
    this.dni = dni;
}

mostrarDatos() {
    return (`${super.mostrarDatos()} ,DNI: ${this.dni}`);
}

toString() {
    return `Ciudadano: ${this.nombre} ${this.apellido}`;
}

toJson() {
    return JSON.stringify(this);
}
}

// Clase Cliente (hereda de Persona)
class Extranjero extends Persona {
constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
    super(id, nombre, apellido, fechaNacimiento);
    this.paisOrigen = paisOrigen;
}
mostrarDatos() {
    return (`${super.mostrarDatos()} ,Compras: ${this.compras} ,Telefono: ${this.telefono}`);
}
toString() {
    return `Cliente: ${this.nombre} ${this.apellido}`;
}

toJson() {
    return JSON.stringify(this);
}
}
function validarFormulario() {
    const nombre = document.getElementById("Nombreinput").value.trim();
    const apellido = document.getElementById("Apellidoinput").value.trim();
    const edad = parseInt(document.getElementById("Edadinput").value.trim());

    if (nombre === '') {
        alert("El nombre no puede estar vacío.");
        return false;
    }

    if (apellido === '') {
        alert("El apellido no puede estar vacío.");
        return false;
    }

    if (isNaN(edad) || edad <= 15) {
        alert("La edad debe ser un número entero mayor a 15.");
        return false;
    }

    return true;
}
document.addEventListener("DOMContentLoaded", function() {
    const tabla = document.getElementById("tabla_empleados_clientes");
    const cuerpoTabla = document.getElementById("datos_tabla");
    const spinnerContainer = document.getElementById("spinnerContainer");
    let personasArray = [];

    class Persona {
        constructor(id, nombre, apellido, fechaNacimiento) {
            this.id = id;
            this.nombre = nombre;
            this.apellido = apellido;
            this.fechaNacimiento = fechaNacimiento;
        }

        mostrarDatos() {
            return `ID: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Edad: ${this.edad}`;
        }
    }

    class Ciudadano extends Persona {
        constructor(id, nombre, apellido, fechaNacimiento, dni) {
            super(id, nombre, apellido, fechaNacimiento, dni);
            this.dni = dni;
        }

        mostrarDatos() {
            return `${super.mostrarDatos()}, DNI: ${this.dni}`;
        }
    }

    class Extranjero extends Persona {
        constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
            super(id, nombre, apellido, fechaNacimiento);
            this.paisOrigen = paisOrigen;
        }

        mostrarDatos() {
            return `${super.mostrarDatos()}, País de origen: ${this.paisOrigen}`;
        }
    }

    function mostrarSpinner() {
        spinnerContainer.style.display = "flex";
    }

    function ocultarSpinner() {
        spinnerContainer.style.display = "none";
    }

    async function cargarDatosDesdeAPI() {
        mostrarSpinner();
        try {
            const response = await fetch("https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero");
            if (response.ok) {
                const datos = await response.json();
                personasArray = datos.map(persona => {
                    if (persona.dni !== undefined) {
                        return new Ciudadano(persona.id, persona.nombre, persona.apellido, persona.fechaNacimiento, persona.dni);
                    } else {
                        return new Extranjero(persona.id, persona.nombre, persona.apellido, persona.fechaNacimiento, persona.paisOrigen);
                    }
                });
                mostrarDatosEnTabla();
            } else {
                alert("Error al cargar los datos desde la API.");
            }
        } catch (error) {
            alert("Error al cargar los datos desde la API.");
        } finally {
            ocultarSpinner();
        }
    }

    function mostrarDatosEnTabla() {
        cuerpoTabla.innerHTML = "";

        personasArray.forEach(persona => {
            const fila = document.createElement("tr");

            const id = document.createElement("td");
            id.textContent = persona.id;

            const nombre = document.createElement("td");
            nombre.textContent = persona.nombre || "N/A";

            const apellido = document.createElement("td");
            apellido.textContent = persona.apellido || "N/A";

            const fechaNacimiento = document.createElement("td");
            fechaNacimiento.textContent = persona.fechaNacimiento || "N/A";

            const dni = document.createElement("td");
            dni.textContent = persona.dni || "N/A";

            const paisOrigen = document.createElement("td");
            paisOrigen.textContent = persona.paisOrigen || "N/A";

            const modificar = document.createElement("td");
            const btnModificar = document.createElement("button");
            btnModificar.textContent = "Modificar";
            btnModificar.classList.add("modificar");
            modificar.appendChild(btnModificar);

            const eliminar = document.createElement("td");
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("eliminar");
            eliminar.appendChild(btnEliminar);

            fila.appendChild(id);
            fila.appendChild(nombre);
            fila.appendChild(apellido);
            fila.appendChild(fechaNacimiento);
            fila.appendChild(dni);
            fila.appendChild(paisOrigen);
            fila.appendChild(modificar);
            fila.appendChild(eliminar);
            cuerpoTabla.appendChild(fila);

            btnModificar.onclick = () => {
                mostrarFormularioABM("Modificar", persona);
            };

            btnEliminar.onclick = () => {
                mostrarFormularioABM("Eliminar", persona);
            };
        });
    }

    cargarDatosDesdeAPI();

    document.getElementById("RegistrarABM").onclick = () => {
        mostrarFormularioABM("Alta");
    };

    function mostrarFormularioABM(accion, persona = {}) {
        document.getElementById("FormDatos").style.display = "none";
        document.getElementById("abm").style.display = "block";
        document.getElementById("IDinput").value = persona.id || "";
        document.getElementById("Nombreinput").value = persona.nombre || "";
        document.getElementById("Apellidoinput").value = persona.apellido || "";
        document.getElementById("Edadinput").value = persona.edad || "";
        document.getElementById("opcionesinput").value = persona.dni ? "Ciudadano" : "Extranjero";
        document.getElementById("DNIinput").value = persona.dni || "";
        document.getElementById("PaisOrigeninput").value = persona.paisOrigen || "";

        if (accion === "Eliminar") {
            document.getElementById("IDinput").disabled = true;
            document.getElementById("Nombreinput").disabled = true;
            document.getElementById("Apellidoinput").disabled = true;
            document.getElementById("Edadinput").disabled = true;
            document.getElementById("DNIinput").disabled = true;
            document.getElementById("PaisOrigeninput").disabled = true;
        } else {
            document.getElementById("IDinput").disabled = false;
            document.getElementById("Nombreinput").disabled = false;
            document.getElementById("Apellidoinput").disabled = false;
            document.getElementById("Edadinput").disabled = false;
            document.getElementById("DNIinput").disabled = false;
            document.getElementById("PaisOrigeninput").disabled = false;
        }

        document.getElementById("btnAgregarRegistro").onclick = async () => {
            if (accion === "Alta" || accion === "Modificar") {
                if (validarFormulario()) {
                    if (accion === "Alta") {
                        agregarElemento().then(()=>
                        {
                            ocultarSpinner();
                            mostrarFormularioLista();
                        })
                    } else if (accion === "Modificar") {
                        modificarElemento(persona.id).then(()=>
                        {
                            ocultarSpinner();
                            mostrarFormularioLista();
                        });
                    }
                }
            } else if (accion === "Eliminar") {
                await eliminarElemento(persona.id);
            }
        };

        document.getElementById("cancelar").onclick = () => {
            mostrarFormularioLista();
        };
    }

    function mostrarFormularioLista() {
        document.getElementById("FormDatos").style.display = "block";
        document.getElementById("abm").style.display = "none";
    }

    function agregarElemento() {
        mostrarSpinner();
        const data = obtenerDatosFormulario();
        delete data.id; 

        return new Promise((resolve, reject) => {
            fetch("https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Error en la respuesta del servidor.");
                }
            })
            .then(newData => {
                newData.id = personasArray.length ? Math.max(...personasArray.map(p => p.id)) + 1 : 1; // Generar nuevo ID

                if (data.dni !== undefined) {
                    const newCiudadano = new Ciudadano(newData.id, data.nombre, data.apellido, data.fechaNacimiento, data.dni);
                    personasArray.push(newCiudadano);
                } else {
                    const newExtranjero = new Extranjero(newData.id, data.nombre, data.apellido, data.fechaNacimiento,  data.paisOrigen);
                    personasArray.push(newExtranjero);
                }
                mostrarDatosEnTabla();
                resolve();
            })
            .catch(error => {
                console.error(error);
                reject();
            });
        });
    }
    


    /*function modificarElemento(id) {
        const data = obtenerDatosFormulario();
        const index = personasArray.findIndex(persona => persona.id === id);
    
        if (index !== -1) {
            mostrarSpinner();
    
            fetch(`https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero?id=${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error al modificar el elemento.");
                }
            })
            .then(() => {
                if (data.paisOrigen !== undefined) {
                    personasArray[index] = new Ciudadano(id, data.nombre, data.apellido, data.fechaNacimiento, data.dni);
                } else {
                    personasArray[index] = new Extranjero(id, data.nombre, data.apellido, data.fechaNacimiento, data.paisOrigen);
                }
                mostrarDatosEnTabla();
                mostrarFormularioLista();
            })
            .catch(error => {
                alert(error.message);
            })
            .finally(() => {
                ocultarSpinner();
            });
        } else {
            alert("Elemento no encontrado para modificar.");
        }
    }*/

    async function eliminarElemento(id) {
        try {
            mostrarSpinner();
            const response = await fetch(`https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            });

            if (response.ok) {
                personasArray = personasArray.filter(persona => persona.id !== id);
                mostrarDatosEnTabla();
                mostrarFormularioLista();
            } else {
                alert("No es posible eliminar el ID 666");
            }
        } catch (error) {
            alert("Error al eliminar el elemento.");
        } finally {
            ocultarSpinner();
        }
    }

    function obtenerDatosFormulario() {
        const nombre = document.getElementById("Nombreinput").value.trim();
        const apellido = document.getElementById("Apellidoinput").value.trim();
        const fechaNacimiento = parseInt(document.getElementById("Edadinput").value.trim());
        const tipoElementoSelect = document.getElementById("opcionesinput").value;
        let data = { nombre, apellido, fechaNacimiento };

        if (tipoElementoSelect === "Ciudadano") {
            data.dni = document.getElementById("DNIinput").value.trim();
        } else if (tipoElementoSelect === "Extranjero") {
            data.paisOrigen = document.getElementById("PaisOrigeninput").value.trim();
        }

        return data;
    }

    function validarFormulario() {
        const nombre = document.getElementById("Nombreinput").value.trim();
        const apellido = document.getElementById("Apellidoinput").value.trim();
        const edad = parseInt(document.getElementById("Edadinput").value.trim());

        if (nombre === '') {
            alert("El nombre no puede estar vacío.");
            return false;
        }

        if (apellido === '') {
            alert("El apellido no puede estar vacío.");
            return false;
        }

        if (isNaN(edad) || edad <= 15) {
            alert("La edad debe ser un número entero mayor a 15.");
            return false;
        }

        return true;
    }
});