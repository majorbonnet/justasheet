import "./Sheet.css"
import type { JSX } from "react"
import { Row } from '../row/Row';
import { 
    getRowCount,
    addRows
 } from "./sheetSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

export const SheetBodyRows = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const rowCount = useAppSelector(state => getRowCount(state));
    const rowElements: React.ReactElement[] = [];

    const onWindowScroll = (_e: Event) => {
        if (document.body.scrollHeight - 200 < window.scrollY + window.innerHeight) {
             dispatch(addRows());
        }
    }

    window.addEventListener('scroll', onWindowScroll);

    for (let i = 0; i < rowCount; i++) {
        rowElements.push(
            (<Row key={i} rowNumber={i} />)
        )
    }

    return (
        <tbody>
            {rowElements}
        </tbody>
    )
};