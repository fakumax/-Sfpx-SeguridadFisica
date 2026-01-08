import { IMensajesDescripcion } from '../../interfaces/IMensajesDescripcion';
import SPODataProvider from '../../pnp/sp/SharePointDataProvider';

const fetchComentarios = async (alertaId: number): Promise<IMensajesDescripcion[]> => {
  try {
    //Created = Creado
    //Creado por = Author
    //Modified = Modificado
    //Modificado por = Editor
    const filterQuery = `IDAlerta eq '${alertaId}'`;
    const items = await SPODataProvider.getListItems<IMensajesDescripcion>(
      'Comentarios',
      'Id,Title,Comentario,IDAlerta,Created,Modified,Author/Id,Author/Title,Author/EMail,Editor/Id,Editor/Title,Editor/EMail',
      filterQuery,
      'Author,Editor',
    );

    return items.map((item) => ({
      ...item,
      Author: {
        ...item.Author,
        Picture: getUserImageUrl(item.Author.EMail),
      },
      Editor: {
        ...item.Editor,
        Picture: getUserImageUrl(item.Editor.EMail),
      },
    }));
  } catch (error) {
    console.error('Error fetching data from Comentarios:', error);
    return [];
  }
};
const getUserImageUrl = (email: string): string => {
  return `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${email}&UA=0&size=HR96x96`;
};

const UpdateComentarios = async (
  formData: any,
  setValue: (name: string, value: any) => void,
): Promise<void> => {
  const { MensajesDescripcion } = formData;

  const comentariosParaActualizar = MensajesDescripcion?.filter(
    (comentario) =>
      comentario.Comentario?.trim() !== '' && (comentario.isModified || comentario.isNew),
  );

  if (!comentariosParaActualizar || comentariosParaActualizar.length === 0) {
    return;
  }

  try {
    const updatedComentarios: IMensajesDescripcion[] = [];

    for (const comentario of comentariosParaActualizar) {
      const comentarioMapeado = {
        Title: comentario.Title,
        Comentario: comentario.Comentario,
        IDAlerta: comentario.IDAlerta,
        Modified: comentario.Modified,
        Created: comentario.Created,
        AuthorId: comentario.Author?.Id,
        EditorId: comentario.Editor?.Id,
      };

      if (comentario.Id) {
        const comentarioId = parseInt(comentario.Id, 10);
        await SPODataProvider.update('Comentarios', comentarioId, comentarioMapeado);
        updatedComentarios.push({
          ...comentario,
          Id: comentarioId.toString(),
          isModified: false,
        });
      } else {
        const createdItemId = await SPODataProvider.add('Comentarios', comentarioMapeado);
        updatedComentarios.push({
          ...comentario,
          Id: createdItemId.toString(),
          isNew: false,
        });
      }
    }

    const comentariosNoModificados = MensajesDescripcion.filter(
      (comentario) => !comentario.isModified && !comentario.isNew,
    );

    setValue('MensajesDescripcion', [...comentariosNoModificados, ...updatedComentarios]);
  } catch (error) {
    console.error('Error al guardar o actualizar los comentarios:', error);
  }
};

const deleteComentario = async (comentarioId: number): Promise<void> => {
  try {
    await SPODataProvider.delete('Comentarios', comentarioId);
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
  }
};

export { fetchComentarios, UpdateComentarios, deleteComentario };
