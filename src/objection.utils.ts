import {
  OBJECTION_MODULE_CONNECTION,
  OBJECTION_MODULE_CONNECTION_TOKEN,
  OBJECTION_MODULE_OPTIONS_TOKEN,
  OBJECTION_MODULE_BASE_MODEL_TOKEN,
} from './objection.constants';

export function getObjectionOptionsToken(connection: string): string {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_OPTIONS_TOKEN }`;
}

export function getObjectionConnectionToken(connection: string): string {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_CONNECTION_TOKEN }`;
}

export function getObjectionBaseModelToken(connection: string): any {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_BASE_MODEL_TOKEN }`;
}

export function getObjectionModelToken(model, connection: string): string {
  return `${ connection || OBJECTION_MODULE_CONNECTION }_${ OBJECTION_MODULE_CONNECTION_TOKEN }_${ model.name }`;
}
