//Constantes a utilizar a lo largo del desarrollo
const formulario = document.getElementById('formulario');
const input = document.getElementById('input');
const listaTareas = document.getElementById('lista-tareas');
const template = document.getElementById('template').content;
const fragment = document.createDocumentFragment();
//Objeto vacio para almacenar las tareas
let tareas = {};

//Evento para el boton submit
formulario.addEventListener('submit', e => {
    //Para prevenir los eventos default del submit
    e.preventDefault();
    //Llamado a la funcion
    setTarea();
})

//Evento que ocurre al cargar toda la pagina y el almacenado en localstorage
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')) tareas = JSON.parse(localStorage.getItem('tareas'))
    //Llamado de funcion
    pintarTareas()
})

//Evento que ocurre al hacer click de lista de tareas
listaTareas.addEventListener('click', e => btnAccion(e))

//Funcion al anadir tarea
const setTarea = e =>{
    //Si la tarea esta vacia lo indicara en consola
    //Return para detener el proceso
    if(input.value.trim() === ''){
        console.log('Esta Vacio');
        return
    }
    //Dando los valoores que tendra el objeto
    const tarea={
        id: Date.now(),
        texto: input.value,
        //Estado predeterminado
        estado: false
    }
    //Decimos que la constante tarea sera igual al objeto con un id unico
    tareas[tarea.id] = tarea;
    //Se resetea la informa una vez dado agregar
    formulario.reset();
    //Queda seleccionado para seguir escribiendo tareas
    input.focus();
    //Llamado de funcion
    pintarTareas()
}

const pintarTareas = () => {
    //Pasado con stringify
    localStorage.setItem('tareas', JSON.stringify(tareas));
    //Condicion que se aplica si no hay tareas para el mostrado en pantalla
    if(Object.values(tareas).length === 0){
        listaTareas.innerHTML = `
        <div class="alert alert-dark text-center">
            No hay tareas pendientes
        </div>
        `
        //Detiene el proceso
        return
    }
    //Se muestra vacio para su llenado proximo
    listaTareas.innerHTML = null
    //Realizamos un bucle y clonamos el template creado en HTML
    Object.values(tareas).forEach(tarea => {
        const clone = template.cloneNode(true);
        //Indicamos las diferentes areas del template que seran llenada de forma dinamica
        clone.querySelector('p').textContent = tarea.texto; 
        //Aplicamos condicion en caso de que el estado de la tarea sea verdadera
        if(tarea.estado) {
            //Se remplaza la clase 
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle','fa-undo-alt')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }
        //Le damos los mismos valores ID a los botones
        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        fragment.appendChild(clone)
    })
    //Mostramos evitando reflow
    listaTareas.appendChild(fragment);
}

//Funcion del boton
const btnAccion = (e) => {
    //Si el boton seleccionado contiene la clase
    if(e.target.classList.contains('fa-check-circle')) {
        //el estado de la tarea cambiara
        tareas[e.target.dataset.id].estado = true;
        //Mostaremos en pantalla las tareas
        pintarTareas()
    }
    //Si el boton contiene la clase 
    if(e.target.classList.contains('fa-minus-circle')){
        //Se hara limpieza de la tarea con el id
        delete tareas[e.target.dataset.id]
        //Se pinta en pantalla
        pintarTareas();
    }
    //Si el boton seleccionado contiene la clase
    if(e.target.classList.contains('fa-undo-alt')){
        //Volvemos a cambiar su estado a false para repetir tarea
        tareas[e.target.dataset.id].estado= false;
        //Se pinta en pantalla
        pintarTareas();
    }
    //Detenemos al propagacion del evento
    e.stopPropagation();
}