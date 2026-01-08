import * as React from 'react';
import {
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    SelectionMode,
    IDetailsHeaderProps,
    IRenderFunction,
    DefaultButton,
    Stack,
} from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import styles from '../ListaAlerta/Main/Main.module.scss';
import { Link } from 'react-router-dom';
import { Estados, LIST_NAMES } from '../../../../core/utils/Constants';
import { expandFields, getStatusColor, selectFields } from '../../common/helpers';
import { IAlerta } from '../../../../core/interfaces/IAlerta';
import SPODataProvider from '../../../../core/pnp/sp/SharePointDataProvider';
import stylesHeader from '../AltaAlerta/Header/Header.module.scss';
import ExcelJS from 'exceljs';

const CuadroMando = () => {

    const [items, setItems] = React.useState([]);
    const [isSortedDescending, setIsSortedDescending] = React.useState(true);
    const [sortingColumn, setSortingColumn] = React.useState<string>('ID');
    const [sortDescending, setSortDescending] = React.useState<boolean>(false);


    const navigate = useNavigate();

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        const elements = [...items];
        elements.forEach((element) => {
            element.CategoriaPrincipalTitle = element.CategoriaPrincipal && element.CategoriaPrincipal.Title ? element.CategoriaPrincipal.Title : '';
            element.CategoriaSecundariaTitle = element.CategoriaSecundaria && element.CategoriaSecundaria.Title ? element.CategoriaSecundaria.Title : '';
            element.FechaHoraIncidenteFormat = element.FechaHoraIncidente ? formatDate(element.FechaHoraIncidente) : '';
        });
        worksheet.columns = [
            { header: 'ID', key: 'ID' },
            { header: 'Estado', key: 'Estado' },
            { header: 'Tipo de alerta', key: 'TipoAlerta' },
            { header: 'Categoría Principal', key: 'CategoriaPrincipalTitle' },
            { header: 'Categoría Secundaria', key: 'CategoriaSecundariaTitle' },
            { header: 'Región', key: 'Region' },
            { header: 'Instalación', key: 'Instalacion' },
            { header: 'Fecha', key: 'FechaHoraIncidenteFormat' },
            { header: 'Turno', key: 'Turno' },
        ];

        elements.forEach(item => {
            worksheet.addRow(item);
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CDM.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    const onColumnClick = (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const newItems = [...items];
        const newIsSortedDescending = !isSortedDescending;

        newItems.sort((a, b) => {
            if (newIsSortedDescending) {
                return a.CategoriaPrincipal.Title > b.CategoriaPrincipal.Title ? -1 : 1;
            } else {
                return a.CategoriaPrincipal.Title > b.CategoriaPrincipal.Title ? 1 : -1;
            }
        });

        setItems(newItems);
        setIsSortedDescending(newIsSortedDescending);
    };

    const columns: IColumn[] = [
        {
            key: 'column0',
            name: 'ID',
            fieldName: 'ID',
            minWidth: 40,
            maxWidth: 40,
            isResizable: true,
            isSorted: true,
            isSortedDescending,
            onColumnClick,
            onRender: (item) => <Link to={`/alerta/${item.Id}`}>{item.ID}</Link>,
        },
        {
            key: 'column8',
            name: 'Estado',
            fieldName: 'Estado',
            minWidth: 100,
            maxWidth: 160,
            isResizable: true,
            isSorted: false,
            onRender: (item) => {
                return (
                    <div
                        className={styles.status}
                        style={{ backgroundColor: getStatusColor(item?.Estado || '') }}
                    >
                        {item?.Estado}
                    </div>
                );
            },
        },
        {
            key: 'column1',
            name: 'Tipo de alerta',
            fieldName: 'TipoAlerta',
            minWidth: 70,
            maxWidth: 150,
            isSorted: false,
        },
        {
            key: 'column2',
            name: 'Categoría principal',
            fieldName: 'CategoriaPrincipal.Title',
            minWidth: 90,
            maxWidth: 190,
            isResizable: true,
            isSorted: false,
            isSortedDescending,
            onColumnClick,
            onRender: (item) => <span>{item.CategoriaPrincipal?.Title}</span>,
        },
        {
            key: 'column3',
            name: 'Categoría secundaria',
            fieldName: 'CategoriaSecundaria.Title',
            minWidth: 80,
            maxWidth: 180,
            isSorted: false,
            isResizable: true,
            onRender: (item) => <span>{item.CategoriaSecundaria?.Title}</span>,
        },
        {
            key: 'column4',
            name: 'Región',
            fieldName: 'Region',
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
            isSorted: false,
        },
        {
            key: 'column5',
            name: 'Instalación / Otros',
            fieldName: 'Instalacion',
            minWidth: 80,
            maxWidth: 170,
            isResizable: true,
            isSorted: false,
        },
        {
            key: 'column6',
            name: 'Fecha',
            minWidth: 70,
            isResizable: true,
            isSorted: false,
            onRender: (item) => <span>{formatDate(item.FechaHoraIncidente)}</span>,
        },
        {
            key: 'column7',
            name: 'Turno',
            fieldName: 'Turno',
            isSorted: false,
            minWidth: 70,
            onRender: (item) => (
                <div className={styles.centeredCell}>
                    <span>{item.Turno}</span>
                </div>
            ),
        },
    ];

    function copyAndSort<T>(
        itemsToSort: T[],
        columnKey: string,
        isSortedDescending?: boolean,
    ): T[] {
        const key = columnKey as keyof T;
        return itemsToSort
            .slice(0)
            .sort((a: T, b: T) =>
                (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1,
            );
    }

    const handleColumnClick = (
        ev: React.MouseEvent<HTMLElement>,
        column: IColumn,
    ): void => {
        setSortingColumn(column.fieldName!);
        setSortDescending(!column.isSortedDescending);
    };

    const onItemInvoked = (item: IAlerta): void => {
        let ruta = `/alerta/${item.Id}`;
        navigate(ruta);
    };

    const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
        props,
        defaultRender,
    ) => {
        if (!props) {
            return null;
        }

        const customRender = (props: IDetailsHeaderProps) => {
            return defaultRender({
                ...props,
                columns: props.columns,
            });
        };

        return customRender(props);
    };

    const getAlerts = async () => {
        const filter = `Estado eq '${Estados.Bloqueoproceso}' or Estado eq '${Estados.FrustradoIntSSFF}' or Estado eq '${Estados.Finalizado}' or Estado eq '${Estados.Frustrado}' or Estado eq '${Estados.Concretado}' or Estado eq '${Estados.Eninvestigacion}'`;
        let listAlerta = await SPODataProvider.getListItems<IAlerta>(
            LIST_NAMES.ALERTAS,
            selectFields,
            filter,
            expandFields,
        );
        setItems(listAlerta);
    }

    React.useEffect(() => {
        getAlerts();
    }, []);

    return (
        <div>
            <h3 className={stylesHeader.headerTitle}>Cuadro de Mando</h3>
            <Stack horizontalAlign='end'>
                <DefaultButton text="Exportar" onClick={() => exportToExcel()} iconProps={{ iconName: 'Download' }} />
            </Stack>
            <DetailsList
                items={copyAndSort<any>(items, sortingColumn, sortDescending)}
                columns={columns.map((column) =>
                    column.fieldName === sortingColumn
                        ? {
                            ...column,
                            isSorted: true,
                            isSortedDescending: sortDescending,
                            onColumnClick: handleColumnClick,
                        }
                        : { ...column, isSorted: false },
                )}
                setKey="set"
                layoutMode={DetailsListLayoutMode.fixedColumns}
                selectionPreservedOnEmptyClick={true}
                selectionMode={SelectionMode.none}
                onRenderDetailsHeader={onRenderDetailsHeader}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                onItemInvoked={onItemInvoked}
            />
        </div>
    );
}

export default CuadroMando;