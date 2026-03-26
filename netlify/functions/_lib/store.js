import { getStore } from '@netlify/blobs';

export const usersStore = getStore({ name: 'studiopro_users' });
export const keysStore = getStore({ name: 'studiopro_keys' });
export const auditStore = getStore({ name: 'studiopro_audit' });
