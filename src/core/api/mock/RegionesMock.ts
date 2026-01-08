import { IDropdownOption } from '@fluentui/react';
import { mockDelay } from './mockConfig';

export interface IRegion {
  Id: number;
  Title: string;
  Activo: boolean;
}

export interface IActivo {
  Id: number;
  Title: string;
  Region: { Id: number; Title: string };
  VP: { Id: number; Title: string };
  UN: { Id: number; Title: string };
  Activo: boolean;
}

export interface IVicepresidencia {
  Id: number;
  Title: string;
}

export interface IUnidadDeNegocio {
  Id: number;
  Title: string;
  Vicepresidencia: string;
}

const mockRegiones: IRegion[] = [
  { Id: 1, Title: 'Neuquén', Activo: true },
  { Id: 2, Title: 'Mendoza', Activo: true },
  { Id: 3, Title: 'Santa Cruz', Activo: true },
  { Id: 4, Title: 'Chubut', Activo: true },
  { Id: 5, Title: 'Salta', Activo: true },
  { Id: 6, Title: 'Buenos Aires', Activo: true },
];

const mockVicepresidencias: IVicepresidencia[] = [
  { Id: 1, Title: 'Upstream' },
  { Id: 2, Title: 'Downstream' },
  { Id: 3, Title: 'Gas y Energía' },
  { Id: 4, Title: 'Corporativo' },
];

const mockUnidadesDeNegocio: IUnidadDeNegocio[] = [
  { Id: 1, Title: 'Exploración y Producción', Vicepresidencia: 'Upstream' },
  { Id: 2, Title: 'Refinación', Vicepresidencia: 'Downstream' },
  { Id: 3, Title: 'Comercialización', Vicepresidencia: 'Downstream' },
  { Id: 4, Title: 'Generación Eléctrica', Vicepresidencia: 'Gas y Energía' },
  { Id: 5, Title: 'Transporte de Gas', Vicepresidencia: 'Gas y Energía' },
  { Id: 6, Title: 'Recursos Humanos', Vicepresidencia: 'Corporativo' },
  { Id: 7, Title: 'Finanzas', Vicepresidencia: 'Corporativo' },
];

const mockActivos: IActivo[] = [
  { 
    Id: 1, 
    Title: 'Loma Campana Este', 
    Region: { Id: 1, Title: 'Neuquén' },
    VP: { Id: 1, Title: 'Upstream' },
    UN: { Id: 1, Title: 'Exploración y Producción' },
    Activo: true 
  },
  { 
    Id: 2, 
    Title: 'Chachahuén Norte', 
    Region: { Id: 2, Title: 'Mendoza' },
    VP: { Id: 1, Title: 'Upstream' },
    UN: { Id: 1, Title: 'Exploración y Producción' },
    Activo: true 
  },
  { 
    Id: 3, 
    Title: 'Cerro Dragón Sur', 
    Region: { Id: 3, Title: 'Santa Cruz' },
    VP: { Id: 1, Title: 'Upstream' },
    UN: { Id: 1, Title: 'Exploración y Producción' },
    Activo: true 
  },
  { 
    Id: 4, 
    Title: 'El Orejano', 
    Region: { Id: 1, Title: 'Neuquén' },
    VP: { Id: 1, Title: 'Upstream' },
    UN: { Id: 1, Title: 'Exploración y Producción' },
    Activo: true 
  },
  { 
    Id: 5, 
    Title: 'Manantiales Behr', 
    Region: { Id: 4, Title: 'Chubut' },
    VP: { Id: 1, Title: 'Upstream' },
    UN: { Id: 1, Title: 'Exploración y Producción' },
    Activo: true 
  },
  { 
    Id: 6, 
    Title: 'Bandurria Sur', 
    Region: { Id: 1, Title: 'Neuquén' },
    VP: { Id: 1, Title: 'Upstream' },
    UN: { Id: 1, Title: 'Exploración y Producción' },
    Activo: true 
  },
  { 
    Id: 7, 
    Title: 'Refinería La Plata', 
    Region: { Id: 6, Title: 'Buenos Aires' },
    VP: { Id: 2, Title: 'Downstream' },
    UN: { Id: 2, Title: 'Refinación' },
    Activo: true 
  },
  { 
    Id: 8, 
    Title: 'Refinería Luján de Cuyo', 
    Region: { Id: 2, Title: 'Mendoza' },
    VP: { Id: 2, Title: 'Downstream' },
    UN: { Id: 2, Title: 'Refinación' },
    Activo: true 
  },
];

export async function fetchRegionesMock(): Promise<IDropdownOption[]> {
  console.log('🌍 [MOCK] Obteniendo regiones...');
  await mockDelay();
  return mockRegiones
    .filter(r => r.Activo)
    .map(r => ({ key: r.Id, text: r.Title }));
}

export async function fetchVicepresidenciasMock(): Promise<IDropdownOption[]> {
  console.log('🏢 [MOCK] Obteniendo vicepresidencias...');
  await mockDelay();
  return mockVicepresidencias.map(vp => ({ key: vp.Id, text: vp.Title }));
}

export async function fetchUnidadesDeNegocioMock(vicepresidencia?: string): Promise<IDropdownOption[]> {
  console.log('🏭 [MOCK] Obteniendo unidades de negocio...', vicepresidencia);
  await mockDelay();
  let filtered = mockUnidadesDeNegocio;
  if (vicepresidencia) {
    filtered = filtered.filter(un => un.Vicepresidencia === vicepresidencia);
  }
  return filtered.map(un => ({ key: un.Id, text: un.Title }));
}

export async function fetchActivosMock(): Promise<IDropdownOption[]> {
  console.log('📍 [MOCK] Obteniendo activos...');
  await mockDelay();
  return mockActivos
    .filter(a => a.Activo)
    .map(a => ({ key: a.Id, text: a.Title }));
}

export async function fetchActivosByRegionMock(regionTitle: string): Promise<IActivo[]> {
  console.log('📍 [MOCK] Obteniendo activos por región...', regionTitle);
  await mockDelay();
  return mockActivos.filter(a => a.Region.Title === regionTitle && a.Activo);
}

export { mockRegiones, mockVicepresidencias, mockUnidadesDeNegocio, mockActivos };
