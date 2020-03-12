import { Inject } from '@nestjs/common';
import { getObjectionConnectionToken, getObjectionModelToken } from './objection.utils';

export function InjectModel(model: any, connection?: string) {
  return Inject(getObjectionModelToken(model, connection))
}

export function InjectKnex(connection?: string) {
  return Inject(getObjectionConnectionToken(connection));
}

export const InjectConnection = InjectKnex;
