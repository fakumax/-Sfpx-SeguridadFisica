import { IDropdownOption } from '@fluentui/react';
import { mockDelay } from './mockConfig';

export interface ICategoriaPrincipal {
  Id: number;
  Title: string;
  Activo: boolean;
  Formulario?: string;
}

export interface ICategoriaSecundaria {
  Id: number;
  Title: string;
  CategoriaPrincipal: {
    Id: number;
    Title: string;
  };
}

const mockCategoriasPrincipales: ICategoriaPrincipal[] = [
  { Id: 1, Title: 'Robo/Hurto', Activo: true, Formulario: 'FormularioRobo' },
  { Id: 2, Title: 'Intrusión', Activo: true, Formulario: 'FormularioIntrusion' },
  { Id: 3, Title: 'Bloqueo/Corte de acceso', Activo: true, Formulario: 'FormularioBloqueo' },
  { Id: 4, Title: 'Vandalismo', Activo: true, Formulario: 'FormularioVandalismo' },
  { Id: 5, Title: 'Amenaza', Activo: true, Formulario: 'FormularioAmenaza' },
  { Id: 6, Title: 'Accidente vial', Activo: true, Formulario: 'FormularioAccidente' },
  { Id: 7, Title: 'Incendio', Activo: true, Formulario: 'FormularioIncendio' },
  { Id: 8, Title: 'Otros', Activo: true, Formulario: 'FormularioOtros' },
];

const mockCategoriasSecundarias: ICategoriaSecundaria[] = [
  { Id: 1, Title: 'Robo de materiales', CategoriaPrincipal: { Id: 1, Title: 'Robo/Hurto' } },
  { Id: 2, Title: 'Robo de combustible', CategoriaPrincipal: { Id: 1, Title: 'Robo/Hurto' } },
  { Id: 3, Title: 'Ingreso no autorizado', CategoriaPrincipal: { Id: 2, Title: 'Intrusión' } },
  { Id: 4, Title: 'Violación de perímetro', CategoriaPrincipal: { Id: 2, Title: 'Intrusión' } },
  { Id: 5, Title: 'Manifestación', CategoriaPrincipal: { Id: 3, Title: 'Bloqueo/Corte de acceso' } },
  { Id: 6, Title: 'Corte de ruta', CategoriaPrincipal: { Id: 3, Title: 'Bloqueo/Corte de acceso' } },
  { Id: 7, Title: 'Daño a instalaciones', CategoriaPrincipal: { Id: 4, Title: 'Vandalismo' } },
  { Id: 8, Title: 'Grafiti', CategoriaPrincipal: { Id: 4, Title: 'Vandalismo' } },
  { Id: 9, Title: 'Amenaza telefónica', CategoriaPrincipal: { Id: 5, Title: 'Amenaza' } },
  { Id: 10, Title: 'Amenaza personal', CategoriaPrincipal: { Id: 5, Title: 'Amenaza' } },
  { Id: 11, Title: 'Colisión vehicular', CategoriaPrincipal: { Id: 6, Title: 'Accidente vial' } },
  { Id: 12, Title: 'Vuelco', CategoriaPrincipal: { Id: 6, Title: 'Accidente vial' } },
  { Id: 13, Title: 'Incendio de vegetación', CategoriaPrincipal: { Id: 7, Title: 'Incendio' } },
  { Id: 14, Title: 'Incendio de instalación', CategoriaPrincipal: { Id: 7, Title: 'Incendio' } },
  { Id: 15, Title: 'Situación sospechosa', CategoriaPrincipal: { Id: 8, Title: 'Otros' } },
];

export async function fetchCategoriasPrincipalesMock(): Promise<Array<ICategoriaPrincipal & { key: number; text: string }>> {
  console.log('📂 [MOCK] Obteniendo categorías principales...');
  await mockDelay();
  return mockCategoriasPrincipales
    .filter(cat => cat.Activo)
    .map(cat => ({
      ...cat,
      key: cat.Id,
      text: cat.Title,
    }));
}

export async function fetchCategoriasSecundariasMock(): Promise<ICategoriaSecundaria[]> {
  console.log('📂 [MOCK] Obteniendo categorías secundarias...');
  await mockDelay();
  return [...mockCategoriasSecundarias];
}

export async function fetchCategoriasSecundariasByPrincipalMock(
  categoriaPrincipalId: number
): Promise<IDropdownOption[]> {
  console.log('📂 [MOCK] Obteniendo categorías secundarias por principal...', categoriaPrincipalId);
  await mockDelay();
  return mockCategoriasSecundarias
    .filter(cat => cat.CategoriaPrincipal.Id === categoriaPrincipalId)
    .map(cat => ({
      key: cat.Id,
      text: cat.Title,
    }));
}

export { mockCategoriasPrincipales, mockCategoriasSecundarias };
