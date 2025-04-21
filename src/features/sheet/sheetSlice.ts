import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CellInfo } from "../../models/CellInfo"
import type { CellState } from "../../models/CellState"

import cellHandlerService from "../../services/cellHandlerService"
import type { ColumnWidths, RowHeights, SheetInfo } from "../../models/SheetInfo"
import { DefaultRowCount, DefaultColumnCount } from "../../models/SheetInfo"

export type CellUpdate = {
    rowNumber: number
    columnNumber: number
    value: string
}

export type Sheet = {
    populatedCells: object
    activeCell: string
    sheetInfo: SheetInfo
}

let populatedCells: object = {}

let sheetInfo: SheetInfo = {
    rowCount: DefaultRowCount,
    columnCount: DefaultColumnCount,
    rowHeights: [],
    columnWidths: []
}

const populatedCellsStr = localStorage.getItem('populatedCells');
const sheetInfoStr = localStorage.getItem('sheetInfo');
const savedActiveCell = localStorage.getItem('activeCell') ?? "";

if (populatedCellsStr) {
    populatedCells = JSON.parse(populatedCellsStr) as object;
}

if (sheetInfoStr) {
    sheetInfo = JSON.parse(sheetInfoStr) as SheetInfo;
}

const initialState: Sheet = {
    populatedCells: populatedCells,
    activeCell: savedActiveCell,
    sheetInfo: sheetInfo
}

export const sheetSlice = createAppSlice({
    name: 'sheet',
    initialState,
    reducers: create => ({
        updateCell: create.reducer(
            (state, action: PayloadAction<CellUpdate>) => {
                const cellId = `${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()}`  
                const cellState: CellState = state.populatedCells[cellId as keyof typeof state.populatedCells];

                state.populatedCells = { ...state.populatedCells, [cellId]: cellHandlerService.getUpdatedCellInfo(cellState, action.payload.value) };
                localStorage.setItem('populatedCells', JSON.stringify(state.populatedCells));
            },
        ),
        setActiveCell: create.reducer(
            (state, action: PayloadAction<CellUpdate>) => {
                if (state.activeCell !== "")
                {
                    const currentActiveCellState: CellState = state.populatedCells[state.activeCell as keyof typeof state.populatedCells];
                    state.populatedCells = { ...state.populatedCells, [state.activeCell]: { ...currentActiveCellState as CellInfo, isActive: false }};
                }

                state.activeCell = `${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()}`; 
                let newActiveCellState: CellState = state.populatedCells[state.activeCell as keyof typeof state.populatedCells];

                if (typeof newActiveCellState === "undefined") {
                    newActiveCellState = cellHandlerService.getNewCellInfo("");
                } 

                state.populatedCells = { ...state.populatedCells, [state.activeCell]: { ...newActiveCellState, isActive: true }};

                localStorage.setItem('activeCell', state.activeCell);
                localStorage.setItem('populatedCells', JSON.stringify(state.populatedCells));
            }
        ),
        deactivateCell: create.reducer(
            (state) => {
                if (state.activeCell !== "") {
                    const newActiveCellState: CellState = state.populatedCells[state.activeCell as keyof typeof state.populatedCells];
                    
                    if (typeof newActiveCellState !== "undefined") {                 
                        state.populatedCells = { ...state.populatedCells, [state.activeCell]: { ...newActiveCellState as CellInfo, isActive: false }};
                    }

                    state.activeCell = "";

                    localStorage.setItem('activeCell', state.activeCell);
                    localStorage.setItem('populatedCells', JSON.stringify(state.populatedCells));
                }
            }
        ),
        addRows: create.reducer(
            (state) => {
                state.sheetInfo = { ...state.sheetInfo, rowCount: state.sheetInfo.rowCount + 10 };
            }
        ),
        addColumns: create.reducer(
            (state) => {
                state.sheetInfo = { ...state.sheetInfo, columnCount: state.sheetInfo.columnCount + 10 };
            }
        )
    }),
    selectors: {
        selectPopulatedCell: (sheet: Sheet, rowNumber: number, columnNumber: number) : CellState => {
            const cellId = `${rowNumber.toString()}:${columnNumber.toString()}`;
            const cell: CellState = sheet.populatedCells[cellId as keyof typeof sheet.populatedCells];

            return cell;
        },
        getRowCount: (sheet: Sheet) : number => {
            return sheet.sheetInfo.rowCount;
        },
        getColumnCount: (sheet: Sheet) : number => {
            return sheet.sheetInfo.columnCount;
        },
        getCustomColumnWidths: (sheet: Sheet) : ColumnWidths => {
            return sheet.sheetInfo.columnWidths;
        },
        getCustomRowHeights: (sheet: Sheet) : RowHeights => {
            return sheet.sheetInfo.rowHeights;
        }
    }
});




export const { updateCell, setActiveCell, deactivateCell, addRows, addColumns } = sheetSlice.actions
export const { selectPopulatedCell, getRowCount, getColumnCount, getCustomColumnWidths, getCustomRowHeights } = sheetSlice.selectors

