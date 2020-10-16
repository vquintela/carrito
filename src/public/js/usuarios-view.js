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
    const modal = new Modal('ELIMINAR USUARIO', '¿Seguro desea eliminar este usuario?')
    const acept = await modal.confirm();
    if (acept) {
        const resp = await fetch(`/usuarios/delete/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        const res = JSON.parse(await resp.text());
        message.showMessage(res.message, res.css);
    }
}

const editar = async (id) => {
    const modal = new Modal('EDITAR USUARIO', '¿Seguro desea editar este usuario?')
    const acept = await modal.confirm();
    if (acept) {
        location.href = `/usuarios/editar/${id}`
    }
}