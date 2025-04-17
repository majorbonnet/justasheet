import "./Sheet.css"
import type { JSX } from "react"
import { Row } from '../row/Row';

const rows: object[] = [];
const cells: object[] = [];

for (let i = 0; i < 100; i++) {
    rows.push([])
}

for (let i = 0; i < 20; i++) {
    cells.push([])
}

export const Sheet = (): JSX.Element => {
    return (
        <table>
            <thead>
                <tr>
                {cells.map((_row: object, i: number) => 
                    <th key={i}>
                        {i}
                    </th>
                )} 
                </tr>               
            </thead>
            <tbody>
                {rows.map((_row: object, i: number) => 
                    <Row key={i} rowNumber={i} />
                )}
            </tbody>
        </table>
    )
};