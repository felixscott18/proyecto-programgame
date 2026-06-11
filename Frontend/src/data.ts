/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Challenge } from './types';

export const challenges: Challenge[] = [
  // ==================== LEVEL 1 (PRINCIPIANTE / FÁCIL) ====================
  {
    id: 'L1_C01_FIND',
    level: 1,
    mode: 'find',
    filename: 'math_utils.js',
    description: 'Encuentra el error de límites en este cálculo de sumatoria básica.',
    explanation: 'La condición "i <= items.length" causará un error "off-by-one". En Javascript, los arrays están indexados en base cero, por lo que el último elemento está en "items.length - 1". Intentar acceder a "items[items.length]" devolverá "undefined" y sumará "NaN" al total.',
    hint: 'Observa bien la condición de continuación del bucle "for". ¿Qué valor toma "i" en la última iteración?',
    codeLines: [
      'function calculateTotal(items) {',
      '  let total = 0;',
      '  for (let i = 0; i <= items.length; i++) {',
      '    total += items[i].price;',
      '  }',
      '  return total;',
      '}'
    ],
    errorLineIndex: 2,
    errorName: 'OFF_BY_ONE_ERROR'
  },
  {
    id: 'L1_C02_MULTIPLE',
    level: 1,
    mode: 'multiple',
    filename: 'declarations.js',
    description: 'Pregunta de teoría: ¿Cuál es la diferencia principal entre var, let y const?',
    explanation: '"const" impide la reasignación de la variable una vez declarada. "let" está limitada al ámbito de bloque en lugar de ámbito de función (como "var").',
    hint: 'Una de estas palabras clave bloquea por completo la posibilidad de volver a asignar un nuevo valor utilizando el operador "=", aportando inmutabilidad referencial.',
    questionText: '¿Qué palabra clave impide por completo que una variable sea reasignada después de su declaración inicial?',
    options: [
      'const',
      'let',
      'var',
      'immutable'
    ],
    correctOptionIndex: 0
  },
  {
    id: 'L1_C03_FIX',
    level: 1,
    mode: 'fix',
    filename: 'user_auth.js',
    description: 'Corrige la condición de control para evitar la asignación no deseada.',
    explanation: 'El fragmento original usaba el operador de asignación simple "=" en lugar de los operadores de comparación de igualdad estricta "===". Esto causaba que "user.role" siempre se sobrescribiera con "admin" y la validación resultara falsa o verdadera de forma inesperada.',
    hint: 'Usa el operador de comparación de igualdad estricta de JS que evalúa valor y tipo.',
    codePre: 'function verifyUser(user) {\n  let access = false;',
    prefixText: 'if ',
    wrongText: '(user.role = "admin") {',
    correctText: '(user.role === "admin") {',
    codePost: '    access = true;\n  }\n  return access;\n}'
  },

  // ==================== LEVEL 2 (FÁCIL / MEDIO) ====================
  {
    id: 'L2_C01_FIND',
    level: 2,
    mode: 'find',
    filename: 'state_manager.js',
    description: 'Un método para clonar un array e inicializar configuraciones, pero con un bug de tipado.',
    explanation: 'El operador "typeof" en JavaScript devuelve la cadena "object" cuando se evalúa sobre "null". Por lo tanto, comprobar `typeof data === "object"` permitirá que el flujo continúe aun cuando data sea null, lo que provocará un error de ejecución inmediato al intentar llamar a Object.keys.',
    hint: '¿A qué equivale la instrucción typeof null en JavaScript? Es un error histórico muy famoso del lenguaje.',
    codeLines: [
      'function initializeState(data) {',
      '  if (typeof data === "object") {',
      '    const keys = Object.keys(data);',
      '    console.log("Configurando llaves:", keys);',
      '  } else {',
      '    console.log("Datos no válidos");',
      '  }',
      '}'
    ],
    errorLineIndex: 1,
    errorName: 'TYPEOF_NULL_BUG'
  },
  {
    id: 'L2_C02_MULTIPLE',
    level: 2,
    mode: 'multiple',
    filename: 'destructuring.ts',
    description: 'Comportamiento de desestructuración de objetos vacíos o nulos en TypeScript.',
    explanation: 'Intentar desestructurar propiedades de un valor que es "null" o "undefined" arrojará un error de tipo en tiempo de ejecución ("TypeError: Cannot destructure property of... as it is null").',
    hint: 'La asignación por defecto sólo protege si la propiedad no existe en el objeto, pero no si el objeto entero es null.',
    questionText: '¿Qué sucede al ejecutar: const { name = "Invitado" } = null; en ES6?',
    options: [
      'Arroja un TypeError en tiempo de ejecución',
      'La variable name toma por defecto el valor "Invitado"',
      'La variable name toma por defecto el valor undefined',
      'La variable name se convierte en null'
    ],
    correctOptionIndex: 0
  },
  {
    id: 'L2_C03_FIX',
    level: 2,
    mode: 'fix',
    filename: 'welcome.js',
    description: 'Usa plantillas literales de ES6 con comillas invertidas (backticks) para inyectar variables.',
    explanation: 'El script intentaba inyectar variables simulando plantillas literales pero utilizaba comillas simples en lugar de acentos o comillas invertidas (backticks ```). Esto hacía que se imprimiera el texto plano como "${name}" en lugar de interpolar el valor real.',
    hint: 'Para usar marcadores de posición ${...} en JavaScript necesitas encerrar la cadena en comillas invertidas (backticks).',
    codePre: 'function greetUser(name, score) {',
    prefixText: 'return ',
    wrongText: '"Bienvenido ${name}, tu puntuación es ${score}";',
    correctText: '`Bienvenido ${name}, tu puntuación es ${score}`;',
    codePost: '}'
  },

  // ==================== LEVEL 3 (MEDIO) ====================
  {
    id: 'L3_C01_FIND',
    level: 3,
    mode: 'find',
    filename: 'api_fetcher.js',
    description: 'Encuentra el error de asincronía al acumular promesas.',
    explanation: 'La función está definida con "async", pero dentro de la iteración "map" se realiza una llamada "fetch" sin la palabra clave "await" correspondiente. Esto causa que el array resultante esté lleno de promesas sin resolver en lugar de los textos de respuesta reales.',
    hint: 'Para que resuelva la promesa devuelta por fetch(url) dentro del ciclo, debemos indicar explícitamente que espere por su resolución.',
    codeLines: [
      'async function loadURLs(urls) {',
      '  const contents = urls.map(url => {',
      '    const res = fetch(url);',
      '    return res.text();',
      '  });',
      '  return contents;',
      '}'
    ],
    errorLineIndex: 2,
    errorName: 'UNRESOLVED_PROMISE_MAP'
  },
  {
    id: 'L3_C02_MULTIPLE',
    level: 3,
    mode: 'multiple',
    filename: 'coercion.js',
    description: 'Pregunta sobre la coerción implícita de tipos complejos en JS con operadores relacionales.',
    explanation: 'El valor de [] == ![] es "true". Explicación: ![] se evalúa a false. Luego [] == false obliga a convertir ambos a números; [] se convierte en 0 y false se convierte en 0. Dado que 0 == 0 es true, la expresión evalúa a verdadero.',
    hint: 'La coerción convierte el array vacío a cadena vacía, y luego a cero. Analiza el operador de negación booleana lógica en el lado derecho.',
    questionText: '¿Cuál es la salida de la expresión condicional: [] == ![] en Javascript?',
    options: [
      'true',
      'false',
      'TypeError',
      'undefined'
    ],
    correctOptionIndex: 0
  },
  {
    id: 'L3_C03_FIX',
    level: 3,
    mode: 'fix',
    filename: 'phone_validator.js',
    description: 'Corrige la expresión regular para validar números telefónicos de 10 dígitos exactamente.',
    explanation: 'La expresión regular de validación de teléfonos de 10 dígitos requiere coincidir con el inicio "^" y fin "$" de la cadena para asegurar que la entrada completa mida exactamente 10 números y no acepte caracteres adicionales.',
    hint: 'Para buscar que una cadena empiece y termine obligatoriamente con el patrón exacto usa ^ y $.',
    codePre: 'function validatePhone(phone) {',
    prefixText: 'const regex = ',
    wrongText: '/\\d{10}/;',
    correctText: '/^\\d{10}$/;',
    codePost: '  return regex.test(phone);\n}'
  },

  // ==================== LEVEL 4 (MEDIO / DIFÍCIL) ====================
  {
    id: 'L4_C01_FIND',
    level: 4,
    mode: 'find',
    filename: 'closure_loop.js',
    description: 'Un fallo de ámbito clásico con la sincronización con callbacks en bucles.',
    explanation: 'El bucle utiliza "var i = 0", que define un ámbito a nivel de función. Las llamadas en cola a setTimeout se disparan después de que el bucle ha terminado. En ese momento, "i" ha alcanzado el valor de 3, por lo que imprimirá repetidamente "Index: 3". El cambio a "let" crearía una nueva variable de ámbito de bloque en cada vuelta.',
    hint: '¿Cómo afecta declarar un iterador de bucle con var (ámbito de función) a las tareas alojadas en la cola de eventos (setTimeout)?',
    codeLines: [
      'function queueMessages() {',
      '  for (var i = 0; i < 3; i++) {',
      '    setTimeout(() => {',
      '      console.log("Index: " + i);',
      '    }, 1000);',
      '  }',
      '}'
    ],
    errorLineIndex: 1,
    errorName: 'CLOSURE_VAR_SCOPE_LEAK'
  },
  {
    id: 'L4_C02_MULTIPLE',
    level: 4,
    mode: 'multiple',
    filename: 'equality.js',
    description: 'Identificar de forma analítica el funcionamiento estricto del operador Object.is en contraste con ===.',
    explanation: 'Object.is(NaN, NaN) devuelve "true", mientras que NaN === NaN devuelve "false". Así mismo, Object.is(-0, +0) devuelve "false", mientras que -0 === +0 devuelve "true".',
    hint: 'Busca pares donde el triple igual falle con NaN o ignore la diferencia de signo del cero negativo.',
    questionText: '¿En cuál de las siguientes opciones la comparación con Object.is(x, y) da un resultado DIFERENTE a x === y?',
    options: [
      'Object.is(NaN, NaN)',
      'Object.is(null, undefined)',
      'Object.is("A", "A")',
      'Object.is(0, 1)'
    ],
    correctOptionIndex: 0
  },
  {
    id: 'L4_C03_FIX',
    level: 4,
    mode: 'fix',
    filename: 'concurrent_calls.js',
    description: 'Corrige la ejecución concurrente utilizando Promise.all para esperar llamadas paralelas.',
    explanation: 'El método original iteraba con map un array de IDs para invocar fetch concurrentemente, pero los mandaba como promesas sin agrupar. Debemos usar Promise.all(promiseArray) para esperar sistemáticamente a que todas las llamadas asíncronas concurrentes terminen antes de proseguir.',
    hint: '¿Qué estructura del objeto estático Promise sirve para resolver en paralelo un conjunto o lista de promesas?',
    codePre: 'async function fetchAllUsers(ids) {\n  const promises = ids.map(id => fetch(`/api/user/${id}`));',
    prefixText: 'return ',
    wrongText: 'promises.all();',
    correctText: 'Promise.all(promises);',
    codePost: '}'
  },

  // ==================== LEVEL 5 (EXPERTO) ====================
  {
    id: 'L5_C01_FIND',
    level: 5,
    mode: 'find',
    filename: 'react_effect.jsx',
    description: 'Fuga de memoria o re-renderizado infinito en un gancho useEffect de React.',
    explanation: 'En React, incluir un objeto literal o array en los parámetros de dependencias de "useEffect" causa un bucle infinito de actualizaciones. Al recrearse el array "options" en cada render, la comparación de referencia (`oldDeps !== newDeps`) siempre da falso, obligando al efecto a dispararse infinitamente.',
    hint: '¿Por qué colocar dependencias complejas de tipo objeto/array recreadas en cada render es destructivo dentro de useEffect?',
    codeLines: [
      'function UserDashboard({ userId }) {',
      '  const [user, setUser] = useState(null);',
      '  const options = ["admin", "read", "write"];',
      '  useEffect(() => {',
      '    fetchUser(userId, options).then(res => setUser(res));',
      '  }, [userId, options]);',
      '}'
    ],
    errorLineIndex: 5,
    errorName: 'INFINITE_LIFECYCLE_RENDER_LOOP'
  },
  {
    id: 'L5_C02_MULTIPLE',
    level: 5,
    mode: 'multiple',
    filename: 'event_loop.js',
    description: 'Analizar el orden riguroso de ejecución según el bucle de eventos (Event Loop/Microtasks).',
    explanation: 'La salida exacta es "Inicio", "Fin", "Promise", "Timeout". Esto ocurre porque Promise.resolve() se agenda en la cola de microtareas (Microtask Queue) que tiene prioridad máxima y se ejecuta inmediatamente al vaciarse la pila de llamada, antes de que el procesador pase a procesar la cola de macrotareas (Callback Queue) donde se hospeda setTimeout.',
    hint: 'Las microtareas (promesas) siempre se vacían antes de que se pase a la siguiente iteración del procesador central de tareas.',
    questionText: '¿Cuál es el orden de impresión al ejecutar: \nconsole.log("Inicio"); \nsetTimeout(() => console.log("Timeout"), 0); \nPromise.resolve().then(() => console.log("Promise")); \nconsole.log("Fin");?',
    options: [
      'Inicio, Fin, Promise, Timeout',
      'Inicio, Promise, Timeout, Fin',
      'Inicio, Timeout, Promise, Fin',
      'Inicio, Fin, Timeout, Promise'
    ],
    correctOptionIndex: 0
  },
  {
    id: 'L5_C03_FIX',
    level: 5,
    mode: 'fix',
    filename: 'recursion_leak.js',
    description: 'Fallo catastrófico de Stack Overflow en función recursiva matemática.',
    explanation: 'Esta función recursiva no contiene un caso base para terminar cuando "n" sea menor o igual que uno, por lo que continuará llamándose de forma persistente hasta rebasar la pila de llamadas del sistema operativo, desatando un "Maximum call stack size exceeded". El caso base correcto debe verificar if (n <= 1) return 1;.',
    hint: 'Toda función recursiva requiere una condición de control terminal invariable. ¿Qué devuelve factorial cuando n vale 1?',
    codePre: 'function calcFactorial(n) {',
    prefixText: 'if ',
    wrongText: '(n === 0) return 0;',
    correctText: '(n <= 1) return 1;',
    codePost: '  return n * calcFactorial(n - 1);\n}'
  },

  // ==================== NEW BATCH OF CHALLENGES (LEVEL 1 To 5 ADDITIONAL) ====================
  {
    id: 'L1_C04_FIND',
    level: 1,
    mode: 'find',
    filename: 'object_lookup.js',
    description: 'Comprueba el acceso erróneo a llaves dinámicas usando el operador de punto.',
    explanation: 'Para acceder dinámicamente a una propiedad usando una variable ("key"), se deben emplear corchetes "user[key]". El operador de punto "user.key" busca una propiedad literal llamada "key", la cual no existe y devuelve "undefined" en lugar de evaluar el valor contenido en la variable.',
    hint: 'Compara "user.key" vs "user[key]". ¿Cuál permite evaluar el contenido variable dinámico?',
    codeLines: [
      'function getDynamicConfig(user, key) {',
      '  if (!user) return null;',
      '  return user.key;',
      '}'
    ],
    errorLineIndex: 2,
    errorName: 'LITERAL_PROP_LOOKUP_BUG'
  },
  {
    id: 'L1_C05_FIX',
    level: 1,
    mode: 'fix',
    filename: 'array_mapper.js',
    description: 'Corrige la función de mapeo para retornar valores actualizados.',
    explanation: 'El método .map() requiere retornar un valor de forma explícita o implícita en la función callback. El código actual usa llaves "{ num * 2 }" pero sin la palabra clave "return", lo cual devuelve un array lleno de elementos vacíos/undefined.',
    hint: 'Recuerda que si abres llaves en un callback de una línea, debes usar la palabra clave return.',
    codePre: 'function doubleNumbers(arr) {',
    prefixText: '  return arr.map(num => ',
    wrongText: '{ num * 2 });',
    correctText: '{ return num * 2; });',
    codePost: '}'
  },
  {
    id: 'L2_C04_MULTIPLE',
    level: 2,
    mode: 'multiple',
    filename: 'bubbling.js',
    description: 'Pregunta sobre cómo detener la propagación de eventos en un contenedor de interfaz.',
    explanation: 'event.stopPropagation() detiene la propagación del evento hacia los elementos padres (event bubbling), previniendo que sus manejadores de eventos se disparen en cadena.',
    hint: 'Busca el método que impide explícitamente que un evento burbujee hacia arriba en el árbol DOM del navegador.',
    questionText: '¿Qué método del objeto Event previene que un evento continúe propagándose (bubbling) hacia los elementos HTML superiores?',
    options: [
      'event.stopPropagation()',
      'event.preventDefault()',
      'event.stopImmediatePropagation()',
      'event.cancelBubble()'
    ],
    correctOptionIndex: 0
  },
  {
    id: 'L2_C05_FIND',
    level: 2,
    mode: 'find',
    filename: 'strict_sum.js',
    description: 'Encuentra el error de coerción implícita de tipos al recibir datos de entrada HTML de tipo texto.',
    explanation: 'Los valores recuperados de los campos de entrada de un formulario (<input>) siempre son de tipo String. El operador "+" concatenará "5" y "10" como "510" en lugar de sumarlos numéricamente como 15. Se debe usar parseInt() o el constructor Number().',
    hint: '¿Qué tipo de dato devuelve un elemento de entrada de formulario HTML (.value)? Analiza el comportamiento del operador "+" con cadenas.',
    codeLines: [
      'function appendNumbers(inputVal) {',
      '  let base = 5;',
      '  let result = base + inputVal;',
      '  return result;',
      '}'
    ],
    errorLineIndex: 2,
    errorName: 'STRING_CONCATENATION_COERCION'
  },
  {
    id: 'L3_C04_FIX',
    level: 3,
    mode: 'fix',
    filename: 'percentage.js',
    description: 'Asegura que el cálculo de tasa no resulte en división entre cero (NaN/Infinity).',
    explanation: 'Si el total es cero, calcular el porcentaje arrojará un error lógico que produce "NaN" o "Infinity". Debemos proteger la división verificando preventivamente si el total es idéntico a cero.',
    hint: 'Verifica si el denominador es cero antes de efectuar la división de la tasa.',
    codePre: 'function calculateRate(success, total) {',
    prefixText: '  return ',
    wrongText: '(success / total) * 100;',
    correctText: 'total === 0 ? 0 : (success / total) * 100;',
    codePost: '}'
  },
  {
    id: 'L3_C05_MULTIPLE',
    level: 3,
    mode: 'multiple',
    filename: 'lexical_this.js',
    description: 'Diferencia de resolución de "this" contextual en funciones normales vs funciones flecha.',
    explanation: 'Las funciones flecha no tienen su propio "this". En su lugar el valor de "this" se resuelve léxicamente, heredando el "this" de la función o ámbito delimitador inmediato donde fueron declaradas.',
    hint: 'El "this" léxico es la característica definitoria clave introducida en ES6 con las declaraciones de funciones flecha.',
    questionText: '¿Cómo se resuelve el valor de "this" dentro de una función flecha (arrow function) en JavaScript?',
    options: [
      'Se hereda léxicamente del contexto del ámbito circundante',
      'Depende de cómo se invoque la función en tiempo de ejecución',
      'Siempre hace referencia al objeto global de ejecución (window)',
      'Siempre es igual a undefined en modo estricto'
    ],
    correctOptionIndex: 0
  },
  {
    id: 'L4_C04_FIND',
    level: 4,
    mode: 'find',
    filename: 'deep_clone.js',
    description: 'Encuentra la fuga de referencia en este clonador de objetos.',
    explanation: 'El operador de propagación "{ ...obj }" realiza una copia superficial (shallow copy). Las propiedades anidadas copian su referencia en lugar de su valor, por lo que mutar "cloned.profile.role" dañará el perfil del objeto original.',
    hint: 'El spread operator copia propiedades de primer nivel por valor, pero objetos anidados por dirección de memoria.',
    codeLines: [
      'function cloneUser(user) {',
      '  const cloned = { ...user };',
      '  cloned.profile.role = "guest";',
      '  return cloned;',
      '}'
    ],
    errorLineIndex: 2,
    errorName: 'SHALLOW_COPY_MUTATION_BUG'
  },
  {
    id: 'L4_C05_FIX',
    level: 4,
    mode: 'fix',
    filename: 'debounce.js',
    description: 'Corrige la persistencia de la variable de temporizador del debounce.',
    explanation: 'Para que un debounce funcione correctamente, la variable de temporizador debe declararse en el ámbito externo de la closure para persistir entre llamadas. Declararla adentro del retorno crea un nuevo temporizador cada vez, anulando el efecto.',
    hint: 'La referencia del timer debe ser retenida por el closure. Mira dónde se inicializa.',
    codePre: 'function initDebouncer(callback, delay) {\n  let timer;',
    prefixText: '  return ',
    wrongText: '(...args) => { let timer; clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); };',
    correctText: '(...args) => { clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); };',
    codePost: '}'
  },
  {
    id: 'L5_C04_FIND',
    level: 5,
    mode: 'find',
    filename: 'race_condition.js',
    description: 'Fuga de carrera en procesamiento asíncrono sobre arreglos con iteradores síncronos.',
    explanation: 'El método .forEach de los arreglos no espera a que se resuelvan las promesas en su callback asíncrono. Debido a la naturaleza no bloqueante y los tiempos variables de respuesta de red, los elementos se añadirán desordenados e incoherentes.',
    hint: 'La iteración .forEach no asimila ni frena por promesas. Considera utilizar bucles for...of o Promise.all().',
    codeLines: [
      'async function loadConfigData(ids, db) {',
      '  let results = [];',
      '  ids.forEach(async (id) => {',
      '    const item = await db.fetchById(id);',
      '    results.push(item);',
      '  });',
      '  return results;',
      '}'
    ],
    errorLineIndex: 2,
    errorName: 'FOREACH_ASYNC_RACE_CONDITION'
  },
  {
    id: 'L5_C05_FIX',
    level: 5,
    mode: 'fix',
    filename: 'memoization.js',
    description: 'Corrige el guardián de caché de la función de memorización.',
    explanation: 'Utilizar "if (cache[key])" fallará si el valor calculado y guardado en la caché es un valor falsy (como "0", "false" o "null"), recalculándolo de nuevo innecesariamente. Debemos cerciorarnos del registro usando la palabra clave "in".',
    hint: '¿Qué ocurre al memorizar una función que devuelve 0 (valor falsy) si sólo compruebas el estado de verdad simple?',
    codePre: 'function memoize(fn) {\n  const cache = {};',
    prefixText: '  return ',
    wrongText: '(key) => { if (cache[key]) { return cache[key]; } const r = fn(key); cache[key] = r; return r; };',
    correctText: '(key) => { if (key in cache) { return cache[key]; } const r = fn(key); cache[key] = r; return r; };',
    codePost: '}'
  }
];
