import type { JSX } from "react"
import { Cell } from './Cell'

const cells: object[] = [];

for (let i = 0; i < 100; i++) {
    cells.push([])
}

export type Row = {
    rowNumber: number
}

export const Row = (props: Row): JSX.Element => {
    return (
        <tr>
        {cells.map((_cell: object, i: number) => 
            <Cell key={i} rowNumber={props.rowNumber} columnNumber={i} />
        )}
        </tr>
    )
}