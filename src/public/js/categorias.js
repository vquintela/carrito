import { message, Modal } from './message.js';

window.onload = () => {
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

const eliminar = async (id) => {
    const modal = new Modal('ELIMINAR CATEGORIA', '¿Seguro desea eliminar esta categoria?')
    const acept = await modal.confirm();
    if (acept) {
        const resp = await fetch(`/categorias/delete/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        const res = JSON.parse(await resp.text());
        message.showMessage(res.message, res.css);
    }
}

const editar = async (id) => {
    const modal = new Modal('EDITAR CATEGORIA', '¿Seguro desea editar esta categoria?')
    const acept = await modal.confirm();
    if (acept) {
        const resp = await fetch(`/categorias/editar/${id}`)
        const categoria = JSON.parse(await resp.text())
        viewEdicion(categoria)
    }
}

const viewEdicion = categoria => {
    const nombre = document.getElementById('nombre')
    nombre.value = categoria.nombre
    const btn = document.getElementById('btn-cat')
    btn.innerText = 'Editar'
    const form = document.getElementById('form-cat')
    form.setAttribute('action', `/categorias/editar/${categoria.id}`)
}