/*
  Liam Courtot · datos de la página.
  Lo que dejes vacío ('' o []) no se muestra. Después de cambiar algo, corré
  `node tools/build.mjs` para que la tarjeta de contacto (.vcf) se actualice.
*/
window.LIAM = {
  name: 'Liam Courtot',
  email: 'liamcourtot24@gmail.com',

  // Tu número de EE.UU. apenas tengas la SIM, con código de país: '+1 970 555 0123'.
  // Con número, «Message me» abre un SMS; sin número, abre WhatsApp.
  phoneUS: '',
  whatsapp: '5492914380378',          // solo dígitos, con 54 9

  instagram: '',                      // usuario personal, sin @
  instagramStudio: '',                // usuario de Obhivion, sin @
  linkedin: '',                       // enlace completo a tu perfil

  // Video de presentación de 20 a 30 segundos, en inglés. Ej.: '/assets/intro.mp4'
  videoWork: '',
  videoPoster: '',

  // Referencias con su permiso. Ej.: { name: 'Ana Pérez', role: 'F&B Supervisor, Park Hyatt Beaver Creek', contact: '(970) 555-0100' }
  references: [],

  // Nombre lindo para el saludo del QR, si el automático sale raro. Ej.: { 'yeti-s': "Yeti's" }
  places: {},

  // Cuando exista la web de The Obhivion Studio, poné acá su dirección completa.
  // Todos los enlaces al estudio van a ir ahí, y /studio/ redirige solo.
  obhivionUrl: '',

  // Estadísticas sin cookies (GoatCounter, gratis). Poné tu código, ej.: 'liamcourtot'
  goatcounter: ''
};
