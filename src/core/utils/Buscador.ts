const obtenerPalabras = (cadena: string): string[] => {
    return cadena.match(/\b\d{2}\/\d{2}\/\d{4}\b|[\wáéíóúÁÉÍÓÚñÑüÜ]+(?:\.\d+)?/g) ?? [];
};

const normalizar = (cadena: string): string => {
    return cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

function agregarIndiceInvertido(indiceInvertido: Map<string, Set<number>>, clave: string, valor: number): void {
    if (!indiceInvertido.has(clave)) {
        indiceInvertido.set(clave, new Set<number>());
    }
    indiceInvertido.get(clave)!.add(valor);
}

function verificarExistenciaDeClaveEnContenido(contenido: string, clave: string): boolean {
    return normalizar(contenido).includes(normalizar(clave));
}

function agregarIndiceAMapaSiPalabraClaveExisteEnRegistro<T extends object>(indiceInvertido: Map<string, Set<number>>, registro: T, palabrasClave: string[], indiceEnColeccion: number, cantidadDePalabrasClaveEncontradas: number): number {
    for (const campo in registro) {
        const valor: unknown = registro[campo];
        if ('object' === typeof valor && null !== valor) {
            cantidadDePalabrasClaveEncontradas = agregarIndiceAMapaSiPalabraClaveExisteEnRegistro(indiceInvertido, valor, palabrasClave, indiceEnColeccion, cantidadDePalabrasClaveEncontradas);
        } else {
            for (const palabraClave of palabrasClave) {
                if (verificarExistenciaDeClaveEnContenido(String(valor), palabraClave)) {
                    agregarIndiceInvertido(indiceInvertido, palabraClave, indiceEnColeccion);
                    cantidadDePalabrasClaveEncontradas++;
                }
            }
        }
    }
    return cantidadDePalabrasClaveEncontradas;
}

function construirIndiceInvertido<T extends object>(coleccion: T[], cadena: string): Map<string, Set<number>> {
    const palabras: string[] = obtenerPalabras(cadena);
    const indiceInvertido: Map<string, Set<number>> = new Map<string, Set<number>>();

    let indiceEnColeccion: number = 0;
    for (const registro of coleccion) {
        let cantidadDePalabrasClaveEncontradas: number = 0;
        agregarIndiceAMapaSiPalabraClaveExisteEnRegistro(indiceInvertido, registro, palabras, indiceEnColeccion, cantidadDePalabrasClaveEncontradas);
        indiceEnColeccion++;
    }

    return indiceInvertido;
}

export function definirIndicesResultadoPorPalabraEncontrada(indiceInvertido: Map<string, Set<number>>): Set<number> {
    const sets: Set<number>[] = Array.from(indiceInvertido.values());
    const cantidadDeSets: number = sets.length;
    if (0 === cantidadDeSets) {
        return new Set();
    }

    const resultado: Set<number> = new Set(sets[0]);
    for (let i = 1; i < cantidadDeSets; i++) {
        for (const valor of Array.from(resultado)) {
            if (!sets[i].has(valor)) {
                resultado.delete(valor);
            }
        }
    }
    return resultado;
}

type DefinirIndices = (indiceInvertido: Map<string, Set<number>>) => Set<number>;
export function buscar<T extends object>(coleccion: T[], cadenaABuscar: string, estrategiaParaDefinirIndices: DefinirIndices): T[] {
    const resultado: T[] = [];
    if ('' === cadenaABuscar.trim()) {
        return resultado;
    }
    const indicesComunes: Set<number> = estrategiaParaDefinirIndices(construirIndiceInvertido(coleccion, cadenaABuscar));
    for (const indice of Array.from(indicesComunes)) {
        resultado.push(coleccion[indice]);
    }
    return resultado;
}
