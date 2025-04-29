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

    const getColumnWidth = (columnIndex: number) :string => customColumnWidths[columnIndex] ?? `${(((width) / DefaultColumnCount) - 4).toString()}px`

    const getColumnLabel = (columnIndex: number): string => {
        const charIndex = columnIndex % 26;
        const charCount = Math.floor(columnIndex / 26) + 1;

        return (String.fromCharCode(65 + charIndex)).repeat(charCount);
    }


    for (let i = 0; i < columnCount; i++) {

        headerCellElements.push(
            <th key={i} className="header" style={{width: getColumnWidth(i)}}>
                {getColumnLabel(i)}
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