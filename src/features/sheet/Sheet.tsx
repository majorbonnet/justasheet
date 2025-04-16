import type { JSX } from "react"
import { Row } from './Row';

const rows: object[] = [];

for (let i = 0; i < 100; i++) {
    rows.push([])
}

export const Sheet = (): JSX.Element => {
    return (
        <table>
            <tbody>
                {rows.map((_row: object, i) => 
                    <Row key={i} rowNumber={i} />
                )}
            </tbody>
        </table>
    )
};