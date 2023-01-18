# Songs Microservice (ms-songs)

El microservicio de canciones (ms-songs) es un proyecto desarrollado para la aplicación FastMusik, por el equipo formado por Juan Carlos Cortés Muñoz y Mario Ruano Fernández, en el contexto de la asignatura Fundamentos de Ingeniería del Software (FIS) del Máster en Ingeniería del Software: Cloud, Datos y Gestión TI, de la Universidad de Sevilla (curso académico, 22-23).

Sirva este documento como manifiesto del trabajo realizado por este equipo.

## Nivel de acabado

El equipo se presenta al nivel de acabado correspondiente a la máxima calificación de 9, cumpliendo con los requisitos para tal fin.

## Descripción de la aplicación

De forma general, FastMusik es una aplicación de música.

FastMusik presenta gran parte de las características de las redes sociales y las aplicaciones colaborativas. A través de búsquedas en el sistema, los usuarios pueden ir añadiendo canciones a la aplicación, dar likes a aquellas que más les gustan y completar la información de estas añadiendo la letra y el videoclip. Como resultado de la navegación y de ir haciendo diferentes likes, los usuarios podrán comenzar a chatear con otros con sus mismas preferencias musicales.

Además, FastMusik es una aplicación que cuenta con el respaldo de un sistema de soporte, mediante el cual es posible el envío de tickets de incidencias o solicitudes de cambios, así como reportes de mensajes inadecuados que se envían por los chats.

## Microservicios

FastMusik está compuesta por varios microservicios, entre los que se encuentran los siguientes:

### Microservicio de usuarios

Descripción

### Microservicio de canciones

Este es el microservicio implementado por Juan Carlos Cortés Muñoz y Mario Ruano Fernández, integrantes del ms-songs.

En lo que respecta a la funcionalidad que ofrece el microservicio ms-songs, en FastMusik, los usuarios podrán buscar canciones, tanto en el sistema como en Spotify, acceder a los videoclips y letras de estas y hacer like en aquellas canciones que más les gusten.

Otras funcionalidades que derivan de este microservicio son la de generar un listado de canciones favoritas de cada usuario, crear salas de chat entre usuarios con los mismos gustos musicales y notificar al servicio de soporte de incorrecciones en el videoclip de una canción.

### Microservicio de mensajes

Descripción

### Microservicio de soporte

Descripción

## Customer Agreement

Enlace al CA

## Análisis de la capacidad y pricing

Enlace a ambos

## API REST de ms-songs

La documentación de la API REST de ms-songs está disponible en el siguiente [enlace](https://songs-fastmusik-marmolpen3.cloud.okteto.net/docs/).

## Requisitos del microservicio

En función de las distintas entidades de dominio del microservicio ms-songs, los requisitos y la justificación de su implementación han sido los que se citan a continuación.

### Songs

| Requisito                                                                                                                                                                | Justificación                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Como usuario, quiero buscar canciones por su título para obtener un listado de estas.                                                                                    | Se implementa un buscador, mediante una barra de búsqueda, donde el usuario puede insertar el título de la canción que desea buscar. A nivel de microservicio, se ofrecen varios endpoints para esto: se pueden obtener [todas las canciones](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L13) de la aplicación, se puede realizar la búsqueda [filtrando por el título de la canción](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L49) o se puede aplicar la misma búsqueda pero a través del servicio de [Spotify](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L68).       |
| Como usuario, quiero acceder a una canción para ver su información, como la posible letra y el videoclip.                                                                | Se implementa la [vista detalle de una canción](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L30), en la que se muestra toda la información de un tema concreto: carátula, artistas, videoclip o muestra mp3, y letra. Esto es posible a través de un endpoint para devolver una canción a partir de su identificador único (id).                                                                                                                                                                                                                                                                             |
| Como usuario quiero editar la letra de una canción para colaborar con la comunidad de usuarios.                                                                          | Simplemente se implementa la posibilidad de [editar una canción](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L157), limitando esta edición solo a la letra de la canción y a la dirección de su videoclip en YouTube. La edición de la canción para asignarle un valor al atributo de dirección de videoclip (videoUrl) solo será posible en caso de que la canción no disponga de valor para este.                                                                                                                                                                                                          |
| Como usuario quiero notificar acerca de un videoclip incorrecto para aportar la dirección correcta y que puedan modificarla.                                             | Esta [funcionalidad](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L130) es una posible mediante la **[integración](https://github.com/fisg4/ms-songs/blob/main/services/support.js) con el microservicio de soporte ([ms-support](https://github.com/fisg4/ms-support))**. El usuario hace envío de la URL nueva por la que debe ser sustituido el videoclip de una canción. Los responsables de soporte serán los responsables de valorar la petición y aprobar o rechazar dicho ticket que se hace envío por parte del usuario. De ser aceptado, entonces se actualiza el videoclip por la nueva dirección. |
| Como usuario, quiero añadir aquellas canciones que no se encuentran en FastMusik, pero que puedo encontrar en Spotify, para hacer más rico el catálogo de la aplicación. | Tras la [búsqueda en Spotify](https://github.com/fisg4/ms-songs/blob/main/services/spotify.js), el usuario puede [añadir a la base de datos](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L104) de FastMusik cualquiera de los resultados, salvo que ya se encuentre en la aplicación.                                                                                                                                                                                                                                                                                                                        |
| Como administrador, quiero eliminar una canción que no deba estar en FastMusik para poder hacer mantenimiento del estado de la aplicación                                | Aquellos usuarios que tengan el rol de administrador podrán [eliminar las canciones](https://github.com/fisg4/ms-songs/blob/main/routes/songs.js#L185) que deseen. Esta funcionalidad se implementa mediante la acción de borrado a través del identificador único (id) de la canción.                                                                                                                                                                                                                                                                                                                                       |

### Likes

| Requisito                                                                                                                                            | Justificación                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Como usuario, quiero hacer like en aquellas canciones que me gustan para contar con una colección de mis favoritas.                                  | Se implementa la [creación del like](https://github.com/fisg4/ms-songs/blob/main/routes/likes.js#L43) para una canción por parte de un usuario. Esta acción la desencadenará desde el frontend el equipo del microservicio de usuarios (ms-users). El like se realiza desde la vista detalle de una canción. La operación en el microservicio también hace una consulta al ms-users para [obtener toda la información del usuario](https://github.com/fisg4/ms-songs/blob/main/services/users.js) que hace like. |
| Como usuario, quiero deshacer un like en aquellas canciones que me gustan para que ya no aparezcan entre mis favoritas                               | Esta es la acción contraria a la de hacer like a una canción. Como condición, se requiere que el usuario haya hecho like previamente. Consiste en una [acción de eliminación de like](https://github.com/fisg4/ms-songs/blob/main/routes/likes.js#L76), por lo que se ha implementado con el verbo DELETE. Al igual que la acción de hacer like, esta también la desencadena desde la interfaz gráfica de usuario el equipo del microservicio de usuarios (ms-uses).                                             |
| Como usuario, quiero conocer todos los usuarios que hacen like en una canción para poder saber quiénes tienen gustos musicales similares a los míos. | Esta acción se implementa como un [GET con filtrado](https://github.com/fisg4/ms-songs/blob/main/routes/likes.js#L13). El filtro se aplica mediante el identificador único (parámetro songId) de una canción, mostrándose un listado de los usuarios que han hecho like a la misma.                                                                                                                                                                                                                              |
| Como usuario, quiero ver el listado de likes que he otorgado para tener una colección de mis canciones favoritas.                                    | En el caso de esta funcionalidad, se trata de aplicar un [filtrado](https://github.com/fisg4/ms-songs/blob/main/routes/likes.js#L13) distinto al GET que devuelve todos los likes. Se filtra por le identificador único (parámetro userId) del usuario, mostrándose un listado de las canciones a las que ha hecho like.                                                                                                                                                                                         |

## Análisis de esfuerzos

Enlace a pdf exportado al final de Clockify
