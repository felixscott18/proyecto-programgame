Documentación del Proyecto: ProgramGame1. IntroducciónProgramGame es una plataforma educativa gamificada diseñada con una estética de 8 bits, cuyo propósito es la enseñanza y el aprendizaje de conceptos fundamentales de programación. A través de un sistema de cuestionarios dinámicos (quizzes), la aplicación permite a los usuarios evaluar sus conocimientos técnicos y avanzar de manera estructurada por diferentes niveles temáticos. El objetivo principal de este proyecto es ofrecer una herramienta interactiva que combine la teoría informática con mecánicas de juego para facilitar la comprensión de la lógica de desarrollo de software.2. Stack TecnológicoPara el desarrollo del backend de la aplicación, se seleccionaron tecnologías basadas en el entorno de ejecución de JavaScript, permitiendo una integración eficiente entre el servidor y el almacenamiento de datos:Entorno de Ejecución: Node.jsFramework del Servidor: Express.jsGestión de Base de Datos: MongoDB / SQLPatrón de Arquitectura: Modelo-Vista-Controller (MVC)Formato de Intercambio de Datos: JSON (API REST)3. Arquitectura del SistemaEl código del backend se encuentra organizado bajo el patrón de diseño Modelo-Vista-Controlador (MVC). Esta estructura permite separar de forma clara la gestión de los datos, la lógica de negocio y las respuestas del sistema, facilitando el mantenimiento y la escalabilidad del proyecto escolar.A continuación, se detalla la distribución de las carpetas en el espacio de trabajo:Plaintextproyecto-programgame/
├── config/               # Configuraciones del entorno y conexión a la base de datos
├── controllers/          # Lógica de negocio y manejo de peticiones HTTP
│   ├── authController.js # Control de registro, inicio de sesión y sesiones de usuario
│   ├── gameController.js # Lógica de los cuestionarios, niveles y puntajes
│   └── userController.js # Gestión de perfiles y progreso de los alumnos
├── models/               # Definición de los esquemas de datos y entidades
│   ├── User.js           # Estructura de datos de usuarios y estadísticas
│   ├── Quiz.js           # Estructura de las preguntas, opciones y respuestas
│   └── Level.js          # Definición de los niveles del juego
├── routes/               # Enrutadores para los endpoints de la API REST
│   ├── authRoutes.js     # Rutas dedicadas a la autenticación
│   ├── gameRoutes.js     # Rutas de los niveles y evaluaciones del juego
│   └── userRoutes.js     # Rutas para la consulta de perfiles de usuario
├── middlewares/          # Funciones de validación y control de acceso
├── app.js                # Punto de entrada principal para arrancar el servidor
└── package.json          # Registro de dependencias y scripts de ejecución
4. Modelo de DatosEl sistema almacena la información necesaria para el funcionamiento del juego educativo mediante tres entidades principales interconectadas de forma relacional:Usuarios (User): Registra las credenciales de acceso de los estudiantes, así como sus estadísticas individuales, incluyendo el puntaje acumulado y el nivel actual alcanzado.Cuestionarios (Quiz): Contiene el banco de preguntas técnicas de programación, las opciones múltiples de respuesta, la indicación de la opción correcta y el valor de puntuación asignado a cada reactivo.Niveles (Level): Bloques temáticos que agrupan un conjunto específico de cuestionarios ordenados por dificultad o tema de estudio (por ejemplo: variables, estructuras de control o funciones).5. Instrucciones de Instalación y Despliegue LocalPara ejecutar el entorno de desarrollo del proyecto de manera local, es necesario cumplir con los prerrequisitos de software y seguir la secuencia de comandos detallada a continuación:PrerrequisitosNode.js instalado (versión 16 o superior).Gestor de bases de datos configurado (instancia local o servicio en la nube).ProcedimientoClonar el repositorio desde la plataforma GitHub:Bashgit clone https://github.com/felixscott18/proyecto-programgame.git
cd proyecto-programgame

2. Instalar los módulos de Node.js especificados en las dependencias:
   ```bash
   npm install
Configurar las variables de entorno creando un archivo .env en la raíz del directorio con los siguientes parámetros:Fragmento de códigoPORT=3000
MONGO_URI=mongodb://localhost:27017/programgame
JWT_SECRET=clave_secreta_de_autenticacion

4. Iniciar el servidor de desarrollo:
   ```bas
npm run dev
El backend se mantendrá escuchando peticiones en el puerto local configurado (http://localhost:3000).6. Especificación de Endpoints de la API RESTLa comunicación e intercambio de información entre la interfaz visual de 8 bits y el servidor se gestiona mediante los siguientes endpoints estructurados:Método HTTPEndpointDescripciónRequiere AutenticaciónPOST/api/auth/registerRealiza el registro de un nuevo estudiante en el sistema.NoPOST/api/auth/loginAutentica al usuario y proporciona un token de acceso.NoGET/api/users/profileRecupera el perfil, puntuación y progreso del alumno actual.SíGET/api/game/levelsDevuelve el listado completo de los niveles de programación disponibles.SíGET/api/game/quiz/:levelIdRetorna los cuestionarios correspondientes al identificador del nivel solicitado.SíPOST/api/game/submitRecibe las respuestas enviadas por el alumno, evalúa el puntaje y actualiza el progreso.Sí7. Conclusión del ProyectoEl desarrollo de ProgramGame demuestra la viabilidad de implementar arquitecturas robustas y organizadas como MVC en aplicaciones educativas. El diseño modular del backend permite que la base de preguntas y niveles sea completamente administrable, lo que facilita la expansión futura del plan de estudios del juego sin necesidad de reescribir la lógica central del servidor.
