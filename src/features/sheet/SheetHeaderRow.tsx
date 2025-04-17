import "./Sheet.css"
import type { JSX } from "react"
import { 
    getColumnCount,
    getCustomColumnWidths
 } from "./sheetSlice";
import { useAppSelector, useWindowDimensions } from "../../app/hooks";
import { DefaultColumnCount } from "../../models/SheetInfo";

export const SheetHeaderRow = (): JSX.Element => {
    const columnCount = useAppSelector(state => getColumnCount(state));
    const customColumnWidths = useAppSelector(state => getCustomColumnWidths(state));
    const { width } = useWindowDimensions();
    const headerCellElements = [];

    const getColumnWidth = (columnNumber: number) :string => customColumnWidths[columnNumber] ?? `${(((width) / DefaultColumnCount) - 4).toString()}px`

    for (let i = 0; i < columnCount; i++) {
        headerCellElements.push(
            <th key={i} className="header" style={{width: getColumnWidth(i)}}>
                {i + 1}
            </th>
        )
    }

    return (
        <thead>
            <tr>
                <th></th>
                {headerCellElements}
            </tr>               
        </thead>
    )
};