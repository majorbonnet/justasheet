import "./Row.css"
import type { JSX } from "react"
import { Cell } from '../cell/Cell'
import { useAppSelector, useWindowDimensions } from "../../app/hooks";
import { DefaultRowCount } from "../../models/SheetInfo";
import { getCustomRowHeights, getColumnCount } from "../sheet/sheetSlice";

export type Row = {
    rowNumber: number
}

export const Row = (props: Row): JSX.Element => {
    const customRowHeights = useAppSelector(state => getCustomRowHeights(state));
    const columnCount = useAppSelector(state => getColumnCount(state));
    const { height } = useWindowDimensions();
    const cells = [];

    const getRowHeight = (rowNumber: number) :string => customRowHeights[rowNumber] ?? `${(Math.floor((height) / DefaultRowCount)).toString()}px`

    for (let i = 0; i < columnCount; i++) {
        cells.push(
            <Cell key={i} rowNumber={props.rowNumber} columnNumber={i} />
        )
    }

    return (
        <tr style={{height: getRowHeight(props.rowNumber)}}>
        <th className="header">{props.rowNumber + 1}</th>
            {cells}
        </tr>
    )
}