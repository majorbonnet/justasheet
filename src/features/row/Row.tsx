import "./Row.css"
import type { JSX } from "react"
import { Cell } from '../cell/Cell'
import { useAppSelector, useWindowDimensions } from "../../app/hooks";
import { DefaultRowCount } from "../../models/SheetInfo";
import { getCustomRowHeights, getColumnCount } from "../sheet/sheetSlice";

export type Row = {
    rowIndex: number
}

export const Row = (props: Row): JSX.Element => {
    const customRowHeights = useAppSelector(state => getCustomRowHeights(state));
    const columnCount = useAppSelector(state => getColumnCount(state));
    const { height } = useWindowDimensions();
    const cells = [];

    const getRowHeight = (rowIndex: number) :string => customRowHeights[rowIndex] ?? `${(Math.floor((height) / DefaultRowCount)).toString()}px`

    for (let i = 0; i < columnCount; i++) {
        cells.push(
            <Cell key={i} rowIndex={props.rowIndex} columnIndex={i} />
        )
    }

    return (
        <tr style={{height: getRowHeight(props.rowIndex)}}>
        <th className="header">{props.rowIndex + 1}</th>
            {cells}
        </tr>
    )
}