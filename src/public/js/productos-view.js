import { message, Modal } from './message.js';

window.onload = () => {
    iniciar()
    filtros()
}

const iniciar = () => {
    const btn = document.getElementById('insertar-filas');
    btn.addEventListener('click', e => {
        if(e.target.classList.contains('eliminar')) {
            eliminar(e.target.getAttribute('data-id'))
        }
        if(e.target.classList.contains('editar')) {
            editar(e.target.getAttribute('data-id'))
        }
    })
}

const filtros = () => {
    const filtro = document.getElementById('rol-buscar');
    filtro.addEventListener('change', async (e) => {
        e.preventDefault()
        if(e.target.value === 'Todos') {
            location.href = `/productos`
        } else {
            const data = await fetch(`/productos/filtro/${e.target.value}`)
            const filtro = JSON.parse(await data.text())
            viewFilt(filtro)
        }
    })
}

const eliminar = async (id) => {
    const modal = new Modal('ELIMINAR PRODUCTO', '¿Seguro desea eliminar este producto?')
    const acept = await modal.confirm();
    if (acept) {
        const resp = await fetch(`/productos/delete/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        const res = JSON.parse(await resp.text());
        message.showMessage(res.message, res.css);
    }
}

const editar = async (id) => {
    const modal = new Modal('EDITAR PRODUCTO', '¿Seguro desea editar este producto?')
    const acept = await modal.confirm();
    if (acept) {
        location.href = `/productos/editar/${id}`
    }
}

const viewFilt = productos => {
    const fragmento = new DocumentFragment()
    productos.forEach(producto => {
        const fila = genFila(producto)
        fragmento.appendChild(fila)
    })
    const tabla = document.getElementById('filas')
    const tbody = document.getElementById('insertar-filas')
    tabla.removeChild(tbody)
    const newTbody = document.createElement('tbody')
    newTbody.setAttribute('id', 'insertar-filas')
    newTbody.appendChild(fragmento)
    tabla.appendChild(newTbody)
    iniciar()
}

const genFila = producto => {
    const tr = document.createElement('tr')
    const thId = document.createElement('th')
    thId.innerText = producto.id
    const thNombre = document.createElement('th')
    thNombre.innerText = producto.nombre
    const thPrecio = document.createElement('th')
    thPrecio.innerText = producto.precio
    const thDescripcion = document.createElement('th')
    thDescripcion.innerText = producto.descripcion
    const thStock = document.createElement('th')
    thStock.innerText = producto.stock
    const thCategoria = document.createElement('th')
    thCategoria.innerText = producto.categorium.nombre
    const thAcciones = document.createElement('th')
    const btnEliminar = document.createElement('button')
    btnEliminar.setAttribute('class', 'btn btn-danger eliminar')
    btnEliminar.setAttribute('data-id', `${producto.id}`)
    btnEliminar.innerText = 'Eliminar'
    const btnEditar = document.createElement('button')
    btnEditar.setAttribute('class', 'btn btn-success editar mr-2')
    btnEditar.setAttribute('data-id', `${producto.id}`)
    btnEditar.innerText = 'Editar'
    thAcciones.appendChild(btnEditar)
    thAcciones.appendChild(btnEliminar)
    tr.appendChild(thId)
    tr.appendChild(thNombre)
    tr.appendChild(thPrecio)
    tr.appendChild(thDescripcion)
    tr.appendChild(thStock)
    tr.appendChild(thCategoria)
    tr.appendChild(thAcciones)
    return tr
}