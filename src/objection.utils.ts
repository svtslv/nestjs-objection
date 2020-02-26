import {
  OBJECTION_CONNECTION_NAME,
  OBJECTION_MODULE_ID
} from './objection.constants';

export const getInjectToken = (model, connection) => {
  connection = connection || OBJECTION_CONNECTION_NAME;
  return `${connection}_${OBJECTION_MODULE_ID}_${model.name}`
};
