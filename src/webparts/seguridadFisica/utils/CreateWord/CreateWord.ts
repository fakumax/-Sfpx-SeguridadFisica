import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import ImageModule from 'docxtemplater-image-module-free';
import { Actas, Instalacion } from '../../../../core/utils/Constants';

export const handleCreateWord = async (context: any, formData: Record<string, any>) => {
  const complementarios = formData.complementarios;
  const antecedentesCompleto = formData.AlertaDatos?.AntecedentesCompleto;
  const observacionesAlertas = formData.AlertaDatos?.Observaciones;
  const observacionesGIS = formData.AlertaDatos?.ObservacionGIS;

  const mensajeAlertas = formData.MensajesDescripcion || [];
  const obs_comentario =
    observacionesAlertas || observacionesGIS || mensajeAlertas.length > 0
      ? [
          observacionesAlertas,
          observacionesGIS,
          ...mensajeAlertas.map((msg: any) => msg.Comentario || ''),
        ]
          .filter((value) => value != '')
          .join(' / ')
      : Actas.NA;

  let sospechosos = Actas.NA;
  if (formData.InvolucradosActa?.length > 0) {
    sospechosos = formData.InvolucradosActa.map((i: any) => {
      const apellido = i.Apellido || '';
      const nombre = i.Nombre || '';
      return `${apellido}, ${nombre}`;
    }).join(' / ');
  }

  const instalacionValue =
    formData.Instalacion === '' || formData.Instalacion === Instalacion.Ninguna
      ? formData.ReferenciaUbicacion
      : formData.Instalacion;

  let dniSospechosos = Actas.NA;
  if (formData.InvolucradosActa?.length > 0) {
    dniSospechosos = formData.InvolucradosActa.map((i: any) => {
      const dni = i.DNIInvolucrado || Actas.NA;
      return dni;
    }).join(' / ');
  }
  let vehiculos = Actas.NA;
  if (formData.InvolucradosActa?.length > 0) {
    vehiculos = formData.InvolucradosActa.map((i: any) => {
      const patente = i.PatenteVehiculo || '';
      const marca = i.MarcaVehiculo || '';
      const modelo = i.ModeloVehiculo || '';
      const color = i.ColorVehiculo || '';
      return `${marca} ${modelo} ${patente} ${color} `;
    }).join(' / ');
  }

  let huellas = Actas.NA;
  if (complementarios.HuellasEncontradas?.length > 0 || complementarios.OtrasHuellas) {
    let partes = [];
    if (complementarios.HuellasEncontradas?.length > 0) {
      partes.push(complementarios.HuellasEncontradas.join(' / '));
    }
    if (complementarios.OtrasHuellas) {
      partes.push(complementarios.OtrasHuellas);
    }
    huellas = partes.join(' / ');
  }

  let antecedentes = Actas.NA;
  if (antecedentesCompleto?.length > 0) {
    antecedentes = antecedentesCompleto
      .map((i: any) => {
        const idAntecedente = i.Id;
        const instalacion = i.Instalacion || i.ReferenciaUbicacion || '';
        const fechaIncidente = i.FechaHoraIncidente
          ? new Date(i.FechaHoraIncidente).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : '';
        return `${idAntecedente} - ${instalacion}, ${fechaIncidente}`;
      })
      .join(' / ');
  }

  let perdida = formData.ImpactoPerdida?.PerdidaDiariaProduccion || '';
  let UnidadDeMedida = formData.ImpactoPerdida?.UnidadDeMedida || '';
  let perdidaDiariaProduccion = '';
  if (perdida && UnidadDeMedida) {
    perdidaDiariaProduccion = ` ${perdida} ${UnidadDeMedida}`;
  } else {
    perdidaDiariaProduccion = Actas.NA;
  }

  const extensionesPermitidas = ['.png', '.jpg', '.jpeg', '.bmp'];

  const imagenesFiltradas = (formData.Imagenes || []).filter((imagen: any) =>
    extensionesPermitidas.some((ext) => imagen.Name.toLowerCase().endsWith(ext)),
  );

  const imagenes = await Promise.all(
    imagenesFiltradas.map(async (imagen: any) => {
      const arrayBuffer = await fetch(imagen.ServerRelativeUrl).then((res) =>
        res.arrayBuffer(),
      );
      const base64 = arrayBufferToBase64(arrayBuffer);
      const { width, height } = await measureImage(base64);
      return {
        descripcionImagen: imagen.Descripcion || 'Sin descripción',
        base64Image: JSON.stringify({
          base64,
          width,
          height,
        }),
      };
    }),
  );

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function measureImage(base64: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = `data:image/png;base64,${base64}`;
    });
  }

  const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const opts = {
    centered: false,
    fileType: 'docx',
  };

  const imageModule = new ImageModule({
    ...opts,
    getImage: (tagValue: string, tagName: string) => {
      const { base64 } = JSON.parse(tagValue);
      return base64ToUint8Array(base64);
    },
    getSize: (img: Buffer, tagValue: string, tagName: string) => {
      const { width, height } = JSON.parse(tagValue);
      const maxSize = 350;
      let newWidth = width;
      let newHeight = height;
      if (width > height && width > maxSize) {
        newWidth = maxSize;
        newHeight = (height * maxSize) / width;
      } else if (height >= width && height > maxSize) {
        newHeight = maxSize;
        newWidth = (width * maxSize) / height;
      }
      return [Math.round(newWidth), Math.round(newHeight)];
    },
  });

  const mappedData = {
    region: formData.Region ? formData.Region.toUpperCase() : Actas.NA,
    provincia: formData.Provincia || Actas.NA,
    categoriaPrincipal: formData.CategoriaPrincipal?.Title || Actas.NA,
    estado: formData.Estado || Actas.NA,
    Id: formData.ImpactoPerdida?.IDAlerta || Actas.NA,
    anio: formData.Anio || Actas.NA,
    gerRegAsignado: formData.GerenteRegAsignado?.Title || Actas.NA,
    fechaincidente: formData.FechaHoraIncidente
      ? new Date(formData.FechaHoraIncidente).toLocaleDateString()
      : Actas.NA,
    horaincidente: formData.HoraIncidente || Actas.NA,
    instalacion: instalacionValue,
    activo: formData.ActivoActas || Actas.NA,
    objetivoFijo: formData.AlertaDatos?.ObjetivoFijo || Actas.NA,
    latitud: formData.Latitud || Actas.NA,
    longitud: formData.Longitud || Actas.NA,
    obs_comentario,
    materialAfectadoTotal: formData.ImpactoPerdida?.MaterialAfectadoTotal || Actas.NA,
    perdidaDiariaProduccion,
    sospechosos,
    dniSospechosos,
    vehiculos,
    elementosEncontrados: complementarios.ElementosEncontrados || Actas.NA,
    huellas,
    observacionesElementos: complementarios.ObservacionesAdicionales || Actas.NA,
    medidasAdoptadas: complementarios.MedidasAdoptadas || Actas.NA,
    antecedentes,
    imagenes: imagenes,
  };

  try {
    const templateUrl = `${context.pageContext.web.absoluteUrl}/Actas/acta_template.docx`;

    const templateContent = await fetch(templateUrl).then((res) => {
      if (!res.ok) {
        throw new Error(`No se pudo cargar la plantilla: ${res.statusText}`);
      }
      return res.arrayBuffer();
    });

    const zip = new PizZip(templateContent);

    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(mappedData);

    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(output, `Acta ${mappedData.Id}.docx`);
  } catch (error) {
    console.error('Error generando el documento Word:', error);
  }
};
