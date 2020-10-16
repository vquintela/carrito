window.onload = () => {
    document.getElementById('contenedor').addEventListener('click', e => {
        if(e.target.classList.contains('imagen-producto')) {
            const id = e.target.getAttribute('data-id')    
            location.href = `/ver/${id}`
        }
        if(e.target.classList.contains('agregar-carrito')) {
            const id = e.target.getAttribute('data-id') 
            listProductos(id)
            disabledButton()
        }
        if(e.target.classList.contains('del-item-car')) {
            const id = e.target.getAttribute('data-id') 
            delProductos(id)
            disabledButton()
            shoppingCart()
            dataItem()
        }
    })
    document.getElementById('cart-navbar').addEventListener('click', e => {
        shoppingCart()
    })
    if(!sessionStorage.getItem('cart-product')) {
        const prod = []
        sessionStorage.setItem('cart-product', JSON.stringify(prod))
    }
    dataItem()
    disabledButton()
}

const listProductos = id => {
    let cantidad = 1
    if(document.getElementById('cantidad')) {
        cantidad = document.getElementById('cantidad').value 
    } 
    const prod = JSON.parse(sessionStorage.getItem('cart-product'))
    prod.push({id, cantidad})
    sessionStorage.setItem('cart-product', JSON.stringify(prod))
    dataItem()
}

const dataItem = () => {
    if(sessionStorage.getItem('cart-product')){
        const items = document.getElementById('cart-navbar')
        const products = JSON.parse(sessionStorage.getItem('cart-product'))
        items.setAttribute('data-count', products.length)
    } 
}

const disabledButton = () => {
    const productos = JSON.parse(sessionStorage.getItem('cart-product'))
    if(productos) {
        const idProd = productos.map(producto => producto.id)
        const buttons = document.querySelectorAll('.card-body button')
        buttons.forEach(button => {
            const id = button.getAttribute('data-id')
            if(idProd.includes(id)) {
                button.disabled = true
                button.innerText = 'Agregado'
            }
        })
    }
}

const delProductos = (id) => {
    const products = JSON.parse(sessionStorage.getItem('cart-product'))
    const list = products.filter(producto => producto.id !== id)
    sessionStorage.setItem('cart-product', JSON.stringify(list))
}

const shoppingCart = async () => {
    const res = await fetch('/carrito', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: sessionStorage.getItem('cart-product'),
    })
    const prodCar = JSON.parse(await res.text())
    viewCart(prodCar)
}

const viewCart = productos => {
    const view = document.getElementById('contenedor')
    const viewChild = document.getElementById('contenedor-hijo')
    view.removeChild(viewChild)
    view.insertAdjacentHTML('beforeend', texto)
    if(productos.final.length > 0){
        const fragment = new DocumentFragment()
        productos.final.map(producto => {
            const fila = crearFila(producto)
            fragment.appendChild(fila)
        })
        document.getElementById('insertar-filas').appendChild(fragment)
        document.getElementById('precio-total').innerText = `TOTAL:  $ ${productos.precio}`
        const btnPagar = btnPago(productos.initPoint)
        document.getElementById('btn-pago').appendChild(btnPagar)
        document.getElementById('confirmar-pago').addEventListener('click', e => {
            e.target.disabled = true
            e.preventDefault()
            postbtnpagar()
        })
    } else {
        document.getElementById('precio-total').innerText = `TOTAL:  $ 0`
        document.getElementById('text-cero').innerText = 'No se han agregado productos'
    }
}

const btnPago = () => {
    const btnConfirm = document.createElement('button')
    btnConfirm.setAttribute('class', 'text-white btn btn-primary')
    btnConfirm.id = 'confirmar-pago'
    btnConfirm.type = 'submit'
    btnConfirm.innerText = 'Confirmar Productos'
    return btnConfirm
}

const crearFila = producto => {
    const tr = document.createElement('tr')
    const tdImagen = document.createElement('td')
    const imagen = document.createElement('img')
    imagen.setAttribute('class', 'img-fluid imgtd')
    imagen.src = `../../img/${producto.item.image}`
    tdImagen.appendChild(imagen)
    const tdProd = document.createElement('td')
    tdProd.innerText = producto.item.nombre
    const tdPrecio = document.createElement('td')
    tdPrecio.innerText = producto.item.precio
    const tdCant = document.createElement('td')
    tdCant.innerText = producto.cantidad
    const tdValor = document.createElement('td')
    tdValor.innerText = producto.valor
    const tdAccion = document.createElement('td')
    const btn = document.createElement('button')
    btn.setAttribute('class', 'btn btn-sm btn-danger del-item-car')
    btn.setAttribute('data-id', producto.item.id)
    btn.innerText = 'Eliminar'
    tdAccion.appendChild(btn)
    tr.appendChild(tdImagen)
    tr.appendChild(tdProd)
    tr.appendChild(tdPrecio)
    tr.appendChild(tdCant)
    tr.appendChild(tdValor)
    tr.appendChild(tdAccion)
    return tr
}

const postbtnpagar = async () => {
    const nombre = document.getElementById('nombre'). value
    const apellido = document.getElementById('apellido'). value
    const dni = document.getElementById('dni'). value
    const email = document.getElementById('email'). value
    const user = { nombre, apellido, dni, email }
    const items = JSON.parse(sessionStorage.getItem('cart-product'))
    const resp = await fetch('/confirmpago', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user, items})
    })
    const res = JSON.parse(await resp.text())
    btnMP(res)
}

const btnMP = (res) => {
    document.getElementById('confirmar-pago').remove()
    const at = document.createElement('a')
    at.href = res
    at.classList = 'btn btn-primary'
    at.innerText = 'PAGAR'
    document.getElementById('btn-pago').appendChild(at)
}

const texto = `
<div id="contenedor-hijo">
    <div class="col-md-12 text-center mt-3">
        <table class="table" id="filas">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Imagen</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio Unitario</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Precio Parcial</th>
                    <th scope="col">Accion</th>
                </tr>
            </thead>
            <tbody  id="insertar-filas">
            </tbody>
        </table>
        <span class="text-center h1" id="text-cero"></span>
    </div>
    <hr>
    <div class="d-flex mt-5">
        <h1 id="precio-total"></h1> 
    </div>
    <hr>
    <div class="mt-5 mb-5">
        <h3 class="text-center pb-5">Datos Personales</h3>
        <form action="/confirmpago" method="post">
            <div class="row">
                <div class="col">
                    <input type="text" id="nombre" class="form-control" placeholder="Nombre">
                </div>
                <div class="col">
                    <input type="text" id="apellido" class="form-control" placeholder="Apellido">
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <input type="number" id="dni" class="form-control" placeholder="DNI">
                </div>
                <div class="col">
                    <input type="email" id="email" class="form-control" placeholder="Email">
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <input type="number" id="telefono" class="form-control" placeholder="Telefono">
                </div>
                <div class="ml-auto mr-4" id="btn-pago">
                    <a class="btn btn-success mr-4" href="/">Seguir Comprando</a>        
                </div>
            </div>
        </form>
    </div>
</div>
`;
