import { IAdjunto, ItemImagenesVideos } from '../../entities/Adjunto';
import SPODataProvider from '../../pnp/sp/SharePointDataProvider';
import { LIST_NAMES } from '../../utils/Constants';

export const UpdateImagen = async (
  alertID: number,
  filesToAdd: IAdjunto[],
  filesToDelete: IAdjunto[],
  filesToUpdate: IAdjunto[],
): Promise<void> => {
  if (filesToDelete && filesToDelete.length > 0) {
    for (let i = 0; i < filesToDelete.length; i++) {
      await SPODataProvider.delete(
        LIST_NAMES.FOTOSYVIDEOS,
        Number(filesToDelete[i].IdItem),
      );
    }
  }

  if (filesToUpdate && filesToUpdate.length > 0) {
    for (let i = 0; i < filesToUpdate.length; i++) {
      let item: ItemImagenesVideos = {
        IDAlerta: alertID.toString(),
        Descripcion: filesToUpdate[i].Descripcion,
      };
      await SPODataProvider.update(
        LIST_NAMES.FOTOSYVIDEOS,
        Number(filesToUpdate[i].IdItem),
        item,
      );
    }
  }
  if (filesToAdd && filesToAdd.length > 0) {
    for (let i = 0; i < filesToAdd.length; i++) {
      const uniqueDate = new Date().getTime();
      const fileExtension = filesToAdd[i].Archivo.name.split('.').pop();
      const newFileName = `${alertID}-${uniqueDate}.${fileExtension}`;

      let item: ItemImagenesVideos = {
        IDAlerta: alertID.toString(),
        Descripcion: filesToAdd[i].Descripcion,
      };
      await SPODataProvider.addImagenVideo(
        LIST_NAMES.FOTOSYVIDEOS,
        new File([filesToAdd[i].Archivo], newFileName),
        item,
      );
    }
  }
};
