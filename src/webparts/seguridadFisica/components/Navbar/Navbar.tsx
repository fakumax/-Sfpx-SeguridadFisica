import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import SPODataProvider from '../../../../core/pnp/sp/SharePointDataProvider';
import { IFileInfo } from '@pnp/sp/files';

interface IEnlace {
  title: string;
  url: string;
}

interface INavbarGridProps {
  enlaces?: IEnlace[] | string;
  siteUrl?: string;
}

const Navbar: React.FC<INavbarGridProps> = ({ enlaces, siteUrl }) => {
  const [documents, setDocuments] = React.useState<IFileInfo[]>([]);

  const [showInstructivos, setShowInstructivos] = React.useState(false);

  React.useEffect(() => {
    const getDocuments = async () => {
      const libraryPath = `${siteUrl}/Instructivos`;
      const docs = await SPODataProvider.getDocumentsFromLibrary(libraryPath);
      setDocuments(docs);
    };
    if (siteUrl) {
      getDocuments();
    }
  }, [siteUrl]);

  const parseEnlaces = (): IEnlace[] => {
    if (!enlaces) return [];

    if (typeof enlaces === 'string') {
      try {
        return JSON.parse(enlaces);
      } catch (e) {
        console.error('Error parsing enlaces JSON:', e);
        return [];
      }
    }

    return enlaces;
  };
  const enlacesParsed = parseEnlaces();

  const getFileNameWithoutExtension = (fileName: string): string => {
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  };

  return (
    <div className={styles.gridContainer}>
      <Link to="/" className={styles.gridButton}>
        Listado de alertas
      </Link>
      <Link to="/cuadroMando" className={styles.gridButton}>
        Cuadro de Mando
      </Link>
      {enlacesParsed?.map((enlace, index) => (
        <a
          key={index}
          href={enlace.url}
          className={styles.gridButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          {enlace.title}
        </a>
      ))}
      <div className={styles.instructivosWrapper}>
        <button
          className={styles.gridButton}
          onClick={() => setShowInstructivos(!showInstructivos)}
        >
          Instructivos ▼
        </button>
        {showInstructivos && (
          <div className={styles.instructivosDropdown}>
            {documents.map((doc, index) => (
              <a
                key={index}
                href={doc.ServerRelativeUrl}
                className={styles.dropdownLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getFileNameWithoutExtension(doc.Name)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
