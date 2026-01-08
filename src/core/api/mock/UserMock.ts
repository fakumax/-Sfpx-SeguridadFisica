import { mockDelay, MOCK_USER_ROLE } from './mockConfig';

export interface IMockUser {
  Id: number;
  Title: string;
  EMail: string;
  LoginName?: string;
  Roles: string[];
}

const mockUsuarios: IMockUser[] = [
  { 
    Id: 1, 
    Title: 'Roberto García', 
    EMail: 'roberto.garcia@demo.com',
    LoginName: 'i:0#.f|membership|roberto.garcia@demo.com',
    Roles: ['GERENTESREGIONALES', 'Visualizador']
  },
  { 
    Id: 2, 
    Title: 'María López', 
    EMail: 'maria.lopez@demo.com',
    LoginName: 'i:0#.f|membership|maria.lopez@demo.com',
    Roles: ['COS', 'Visualizador']
  },
  { 
    Id: 3, 
    Title: 'Ana Martínez', 
    EMail: 'ana.martinez@demo.com',
    LoginName: 'i:0#.f|membership|ana.martinez@demo.com',
    Roles: ['GERENTESREGIONALES', 'Visualizador']
  },
  { 
    Id: 4, 
    Title: 'Laura Gómez', 
    EMail: 'laura.gomez@demo.com',
    LoginName: 'i:0#.f|membership|laura.gomez@demo.com',
    Roles: ['GERENTESREGIONALES', 'Visualizador']
  },
  { 
    Id: 5, 
    Title: 'Diego Rodríguez', 
    EMail: 'diego.rodriguez@demo.com',
    LoginName: 'i:0#.f|membership|diego.rodriguez@demo.com',
    Roles: ['COS', 'Visualizador']
  },
  { 
    Id: 6, 
    Title: 'Fernando Ruiz', 
    EMail: 'fernando.ruiz@demo.com',
    LoginName: 'i:0#.f|membership|fernando.ruiz@demo.com',
    Roles: ['GERENTESREGIONALES', 'Visualizador']
  },
  { 
    Id: 7, 
    Title: 'Juan Pérez', 
    EMail: 'juan.perez@demo.com',
    LoginName: 'i:0#.f|membership|juan.perez@demo.com',
    Roles: ['Visualizador']
  },
  { 
    Id: 8, 
    Title: 'Admin Demo', 
    EMail: 'admin@demo.com',
    LoginName: 'i:0#.f|membership|admin@demo.com',
    Roles: ['Administrador', 'COS', 'GERENTESREGIONALES', 'Visualizador']
  },
];

const currentMockUser: IMockUser = mockUsuarios.find(u => u.Roles.includes(MOCK_USER_ROLE)) || mockUsuarios[1];

export async function getCurrentUserMock(): Promise<IMockUser> {
  console.log('👤 [MOCK] Obteniendo usuario actual...');
  await mockDelay();
  return currentMockUser;
}

export async function getUserByIdMock(userId: number): Promise<IMockUser | undefined> {
  console.log('👤 [MOCK] Obteniendo usuario por ID...', userId);
  await mockDelay();
  return mockUsuarios.find(u => u.Id === userId);
}

export async function getUsersByRoleMock(role: string): Promise<IMockUser[]> {
  console.log('👥 [MOCK] Obteniendo usuarios por rol...', role);
  await mockDelay();
  return mockUsuarios.filter(u => u.Roles.includes(role));
}

export async function checkUserPermissionMock(permission: string): Promise<boolean> {
  console.log('🔐 [MOCK] Verificando permiso...', permission);
  await mockDelay();
  return currentMockUser.Roles.includes(permission);
}

export async function getGerentesRegionalesMock(): Promise<IMockUser[]> {
  console.log('👥 [MOCK] Obteniendo gerentes regionales...');
  await mockDelay();
  return mockUsuarios.filter(u => u.Roles.includes('GERENTESREGIONALES'));
}

export async function getCOSMock(): Promise<IMockUser[]> {
  console.log('👥 [MOCK] Obteniendo COS...');
  await mockDelay();
  return mockUsuarios.filter(u => u.Roles.includes('COS'));
}

export { mockUsuarios, currentMockUser };
