document.addEventListener("DOMContentLoaded", function() {
    // Almacenar la URL del GIF por defecto
    var urlGifPorDefecto = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGw3YnZ2YmNmMHRuNHc4MTU4dnBtNDFsYXZ1N2xzeTh2M3pvc3RiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XuBNdP9Pb7W9i/giphy.gif";

    // Función para cambiar la imagen
    function cambiarImagen(urlImagen) {
        document.getElementById("imagePlaceholder").src = urlImagen;
    }

    // Establecer la imagen por defecto
    cambiarImagen(urlGifPorDefecto);

    // Obtener el elemento de la imagen
    var imagen = document.getElementById("imagePlaceholder");

    // Evitar que la imagen se cambie cuando el cursor está sobre ella
    imagen.addEventListener("mouseover", function(event) {
        event.stopPropagation();
    });

    // Obtener todos los enlaces
    var enlaces = document.querySelectorAll("#points a");

    // Agregar eventos a cada enlace para cambiar la imagen
    enlaces.forEach(function(enlace) {
        enlace.addEventListener("mouseover", function() {
            // Obtener la clase del enlace
            var clase = enlace.classList[0];
            // Definir la URL de la imagen basada en la clase del enlace
            var urlImagen;
            switch (clase) {
                case "link1":
                    urlImagen = "https://sappiencia.com/images/dashboard-inteligentes-sappiencia.gif";
                    break;
                case "link2":
                    urlImagen = "https://cdn.dribbble.com/users/970957/screenshots/5381809/1.gif";
                    break;
                case "link3":
                    urlImagen = "https://i.pinimg.com/originals/cc/3c/8c/cc3c8c6e11c26d1ee8926f54234ab89b.gif";
                    break;
                case "link4":
                    urlImagen = "https://miro.medium.com/v2/resize:fit:640/format:webp/0*Dicd7h75vA0PMHIG.gif";
                    break;
                case "link5":
                    urlImagen = "https://i.pinimg.com/originals/f9/85/78/f98578a4f210b726dfea429f68c0c05b.gif";
                    break;
                case "link6":
                    urlImagen = "https://i.pinimg.com/originals/ff/fa/9b/fffa9b880767231e0d965f4fc8651dc2.gif";
                    break;
                // Agregar más casos para más enlaces
            }
            // Cambiar la imagen al pasar el cursor sobre el enlace
            cambiarImagen(urlImagen);
        });

        // Restaurar la imagen por defecto cuando el cursor sale del enlace
        enlace.addEventListener("mouseout", function() {
            cambiarImagen(urlGifPorDefecto);
        });
    });
});
