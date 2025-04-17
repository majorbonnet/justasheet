import "./Sheet.css"
import type { JSX } from "react"
import { SheetHeaderRow } from "./SheetHeaderRow";
import { SheetBodyRows } from "./SheetBodyRows";

export const Sheet = (): JSX.Element => {
    return (
        <table>
            <SheetHeaderRow />
            <SheetBodyRows />
        </table>
    )
};