import { createAppSlice } from "../../app/createAppSlice"

import type { ColumnWidths, RowHeights, SheetInfo } from "../../models/SheetInfo"
import { DefaultRowCount, DefaultColumnCount } from "../../models/SheetInfo"


let sheetInfo: SheetInfo = {
    rowCount: DefaultRowCount,
    columnCount: DefaultColumnCount,
    rowHeights: [],
    columnWidths: []
}

const sheetInfoStr = localStorage.getItem('sheetInfo');

if (sheetInfoStr) {
    sheetInfo = JSON.parse(sheetInfoStr) as SheetInfo;
}

const initialState = sheetInfo;

export const sheetSlice = createAppSlice({
    name: 'sheet',
    initialState,
    reducers: create => ({
        addRows: create.reducer(
            (state) => {
                state.rowCount = state.rowCount + 10;
            }
        ),
        addColumns: create.reducer(
            (state) => {
                state.columnCount = state.columnCount + 10;
            }
        )
    }),
    selectors: {
        getRowCount: (sheet: SheetInfo) : number => {
            return sheet.rowCount;
        },
        getColumnCount: (sheet: SheetInfo) : number => {
            return sheet.columnCount;
        },
        getCustomColumnWidths: (sheet: SheetInfo) : ColumnWidths => {
            return sheet.columnWidths;
        },
        getCustomRowHeights: (sheet: SheetInfo) : RowHeights => {
            return sheet.rowHeights;
        }
    }
});




export const { addRows, addColumns } = sheetSlice.actions
export const { getRowCount, getColumnCount, getCustomColumnWidths, getCustomRowHeights } = sheetSlice.selectors

