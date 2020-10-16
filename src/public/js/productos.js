document.getElementById("imagen").onchange = (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
        let preview = document.getElementById('preview'),
            image = document.createElement('img');
        image.src = reader.result;
        image.setAttribute('class', 'img-fluid')
        preview.innerHTML = '';
        preview.append(image);
    };
}

document.getElementById('nombre').onchange = e => {
    document.getElementById('title-card').innerText = e.target.value;
}

document.getElementById('descripcion').onchange = e => {
    document.getElementById('descripcion-card').innerText = e.target.value;
}

document.getElementById('precio').onchange = e => {
    document.getElementById('precio-card').innerText = e.target.value;
}