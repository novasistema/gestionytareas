import { FerreteriaPreset } from '../types';

export const FERRETERIA_PRESETS: FerreteriaPreset[] = [
  {
    title: 'Recepción y cotejo de remito: Bulonería y Tornillería',
    department: 'deposito',
    priority: 'alta',
    estimatedMinutes: 45,
    description: 'Verificar cajas entrantes de distribuidora de tornillos, cotejar bultos contra remito del transportista y ubicar en gaveteros correspondientes.',
    steps: [
      'Contar bultos físicos cerrados antes de firmar la copia del remito al chofer.',
      'Abrir cajas y verificar que los códigos de roscas y milímetros coincidan con el remito.',
      'Separar tornillos autoperforantes, tirafondos y tuercas en sus respectivas bandejas.',
      'Reabastecer gaveteros de mostrador que tengan menos del 20% de stock.',
      'Guardar el sobrante en el estante de stock pesado del depósito y archivar remito firmado.'
    ]
  },
  {
    title: 'Auditoría y verificación de Herramientas Eléctricas en Vidriera',
    department: 'inventario',
    priority: 'media',
    estimatedMinutes: 60,
    description: 'Revisión exhaustiva de amoladoras, taladros de percusión, sierras circulares y rotomartillos en exhibición.',
    steps: [
      'Limpiar polvo de vidriera y chequear que cada máquina tenga su cable prolijamente atado.',
      'Comprobar presencia de mandriles, llaves de ajuste y empuñaduras auxiliares en cada caja.',
      'Verificar número de serie contra el inventario del sistema.',
      'Asegurarse de que el precio visible y financiación de cuotas esté actualizado.',
      'Reportar si alguna máquina de exhibición tiene rayaduras o accesorios faltantes.'
    ]
  },
  {
    title: 'Armado de pedido para Empresa Constructora (Obra Torres)',
    department: 'despacho',
    priority: 'urgente',
    estimatedMinutes: 50,
    description: 'Reunir materiales de ferretería pesada para entrega programada antes del mediodía en obra.',
    steps: [
      'Imprimir orden de pedido #OBRA y verificar stock disponible en estantería.',
      'Juntar 10 rollos de alambre recocido, 15 cajas de clavos 2½" y 5 palas de punta corazón.',
      'Verificar que las hojas de sierra y discos de corte diamantado estén en su caja protectora.',
      'Zunchar o paletizar bultos para evitar caídas durante el flete.',
      'Generar remito de entrega duplicado para firma del capataz en obra.'
    ]
  },
  {
    title: 'Reposición y control de vencimientos en Químicos y Pinturas',
    department: 'mostrador',
    priority: 'media',
    estimatedMinutes: 40,
    description: 'Ordenar y controlar latas de látex, esmaltes sintéticos, selladores de poliuretano y aerosoles.',
    steps: [
      'Revisar fecha de caducidad en cartuchos de silicona neutra y espuma de poliuretano.',
      'Limpiar estantes de aerosoles y ordenar por gama de color y acabado (brillante/mate).',
      'Rotar latas de pintura colocando las de ingreso más antiguo al frente (sistema PEPS).',
      'Verificar que las tapas de diluyentes, aguarrás y thiner estén herméticamente cerradas.',
      'Anotar en faltantes de stock si quedan menos de 3 unidades de algún producto clave.'
    ]
  },
  {
    title: 'Calibración y limpieza de Máquina Duplicadora de Llaves',
    department: 'mantenimiento',
    priority: 'alta',
    estimatedMinutes: 30,
    description: 'Mantenimiento del sector cerrajería para garantizar cortes precisos sin desgaste anormal de fresas.',
    steps: [
      'Desconectar la máquina y aspirar virutas de bronce del plato y mordazas.',
      'Verificar filo de la fresa de corte y ajustar micrómetro de profundidad.',
      'Probar un duplicado de llave yale estándar con llave testigo para chequear tolerancia.',
      'Lubricar guías de traslación con lubricante seco de teflón.',
      'Revisar stock de llaves vírgenes (yale, cruz, doble paleta) y anotar faltantes.'
    ]
  },
  {
    title: 'Control de Accesorios de Termofusión y Plomería PVC',
    department: 'deposito',
    priority: 'baja',
    estimatedMinutes: 45,
    description: 'Clasificación de codos, cuplas, tee con rosca y caños de agua/gas en cañero.',
    steps: [
      'Separar accesorios de 1/2", 3/4" y 1" en sus canastos rotulados.',
      'Comprobar que los insertos metálicos roscados de bronce no presenten rebabas ni óxido.',
      'Alinear tiras de caños de 4 y 6 metros en los soportes verticales.',
      'Contar sobrantes de adhesivo para PVC y teflón de alta densidad.',
      'Actualizar cantidades en el listado para la próxima ronda de compras.'
    ]
  }
];

export const INITIAL_STAFF_MEMBERS = [
  {
    uid: 'staff_carlos_mostrador',
    email: 'carlos.mostrador@ferreteria.local',
    displayName: 'Carlos Benítez',
    role: 'mostrador' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'disponible' as const,
    phone: '+54 9 11 4455-8811',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'staff_marta_deposito',
    email: 'marta.deposito@ferreteria.local',
    displayName: 'Marta Riquelme',
    role: 'deposito' as const,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ocupado' as const,
    phone: '+54 9 11 4455-8822',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'staff_lucas_despacho',
    email: 'lucas.despacho@ferreteria.local',
    displayName: 'Lucas Alderete',
    role: 'encargado' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'disponible' as const,
    phone: '+54 9 11 4455-8833',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'staff_julian_compras',
    email: 'julian.compras@ferreteria.local',
    displayName: 'Julián Gómez',
    role: 'compras' as const,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'disponible' as const,
    phone: '+54 9 11 4455-8844',
    createdAt: new Date().toISOString()
  }
];
