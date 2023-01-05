const createSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
    agency: { type: 'string' },
    account: { type: 'string' },
    workNumber: { type: 'string' },
    mobileNumber: { type: 'string' },
  },
  required: ['email', 'name', 'password', 'agency', 'account'],
} as const;

const updateSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
    agency: { type: 'string' },
    account: { type: 'string' },
    workNumber: { type: 'string' },
    mobileNumber: { type: 'string' },
  },
  required: ['email', 'name', 'agency', 'account'],
} as const;

export { createSchema, updateSchema };
