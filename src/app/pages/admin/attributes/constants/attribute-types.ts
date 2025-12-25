// modules/attributes/constants/attribute-types.constants.ts

/**
 * Tipos de valores permitidos para los atributos de producto
 */
export enum AttributeInputType {
  SELECT = 'select',      // Selector simple (dropdown) - un solo valor
  MULTI = 'multi',        // Selector múltiple (checkboxes/multiselect) - múltiples valores
  FILE = 'file',          // Archivo (upload)
  TEXT = 'text',          // Texto simple
  NUMBER = 'number'       // Número
}

/**
 * Configuración para cada tipo de atributo (UI/Validación)
 */
export const ATTRIBUTE_TYPE_CONFIG = {
  [AttributeInputType.SELECT]: {
    label: 'Selector Simple',
    description: 'El usuario selecciona UNA opción de una lista',
    icon: 'pi pi-list',
    supportsValues: true,           // Requiere valores predefinidos (AttributeValues)
    isMultiple: false,
    needsFileUpload: false
  },
  [AttributeInputType.MULTI]: {
    label: 'Selector Múltiple',
    description: 'El usuario selecciona MÚLTIPLES opciones de una lista',
    icon: 'pi pi-check-square',
    supportsValues: true,           // Requiere valores predefinidos
    isMultiple: true,
    needsFileUpload: false
  },
  [AttributeInputType.FILE]: {
    label: 'Archivo',
    description: 'El usuario sube un archivo (imagen, PDF, etc.)',
    icon: 'pi pi-upload',
    supportsValues: false,          // No requiere valores predefinidos
    isMultiple: false,
    needsFileUpload: true
  },
  [AttributeInputType.TEXT]: {
    label: 'Texto',
    description: 'El usuario ingresa texto libre',
    icon: 'pi pi-font',
    supportsValues: false,          // No requiere valores predefinidos
    isMultiple: false,
    needsFileUpload: false
  },
  [AttributeInputType.NUMBER]: {
    label: 'Número',
    description: 'El usuario ingresa un valor numérico',
    icon: 'pi pi-hashtag',
    supportsValues: false,          // No requiere valores predefinidos
    isMultiple: false,
    needsFileUpload: false
  }
} as const;

/**
 * Tipos que REQUIEREN valores predefinidos (AttributeValues)
 * Solo SELECT y MULTI necesitan valores pre-creados
 */
export const TYPES_REQUIRING_VALUES = [
  AttributeInputType.SELECT,
  AttributeInputType.MULTI
];

/**
 * Tipos que PERMITEN valores predefinidos (opcional)
 * En tu caso, solo SELECT y MULTI usan valores
 */
export const TYPES_SUPPORTING_VALUES = [
  AttributeInputType.SELECT,
  AttributeInputType.MULTI
];

/**
 * Obtener configuración para un tipo específico
 */
export function getAttributeTypeConfig(type: AttributeInputType) {
  return ATTRIBUTE_TYPE_CONFIG[type] || ATTRIBUTE_TYPE_CONFIG[AttributeInputType.TEXT];
}

/**
 * Obtener opciones para dropdowns/selects (formateadas para PrimeNG)
 */
export const ATTRIBUTE_TYPE_OPTIONS = Object.entries(ATTRIBUTE_TYPE_CONFIG).map(([value, config]) => ({
  label: config.label,
  value: value as AttributeInputType,
  icon: config.icon,
  description: config.description
}));

/**
 * Validar si un tipo requiere valores predefinidos
 */
export function requiresValues(type: AttributeInputType): boolean {
  return TYPES_REQUIRING_VALUES.includes(type);
}

/**
 * Validar si un tipo soporta valores predefinidos
 */
export function supportsValues(type: AttributeInputType): boolean {
  return TYPES_SUPPORTING_VALUES.includes(type);
}
