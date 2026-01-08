import * as React from 'react';
import { IAdjunto } from '../../../entities/Adjunto';
import { useEffect } from 'react';
import { BaseButton, Button, DefaultButton, IStackTokens, Stack, TextField } from '@fluentui/react';
import styles from './InvolucradosCargados.module.scss';
import { ItemInvolucrados } from '../../../entities/Involucrados';
interface PreImagenesVideos {
    Descripcion: string;
    IDAlerta: string;
    Name: string;
}
export interface NewImagenesVideos {
    Involucrados: ItemInvolucrados[];
}

const InvolucradosCargados: React.FunctionComponent<NewImagenesVideos> = ({ Involucrados }) => {

    const [stateInvolucrados, setInvolucrados] = React.useState < ItemInvolucrados[] > ();
    const wrapStackTokens: IStackTokens = { childrenGap: 30 };
    const itemStyles: React.CSSProperties = {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: 500,
    };
    useEffect(() => {
        setInvolucrados(Involucrados);
    }, [Involucrados]);

    const FilesCargados = (dataInfo: ItemInvolucrados, key: number) => {
        return (
            <>
                <span style={itemStyles}>
                    <div>
                        <TextField defaultValue={dataInfo.Nombre}  label="Nombre/s" />
                    </div>
                </span>
            </>
        )
    }

  

    return (
        <>
            {(stateInvolucrados != undefined && stateInvolucrados.length > 0) &&
                <Stack enableScopedSelectors horizontal wrap tokens={wrapStackTokens}>
                    {stateInvolucrados.map((dataInfo, key) => {
                        return (FilesCargados(dataInfo, key))
                    })}
                </Stack>
            }
        </>
    );
};

export { InvolucradosCargados };
