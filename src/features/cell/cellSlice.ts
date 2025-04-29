import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CellInfo, CellValueType } from "../../models/CellInfo";
import type { CellState } from "../../models/CellState"
import type { CellUpdate } from "../../models/CellUpdate"
import type { CellCoords } from "../../models/CellCoords"

// we are using an object as a dictionary to store cell state rather than a 2d array
// so that we don't have to worry about instantiating rows when trying a cell lookup
export type CellCollection = {
    cells: object
    activeCellKey: string
}

let cells: object = {}
let activeCellKey = "";

const savedCells = localStorage.getItem('cells');
const savedActiveCellKey = localStorage.getItem('activeCellKey') ?? "";

if (savedCells) {
    cells = JSON.parse(savedCells) as object;
}

if (savedActiveCellKey) {
    activeCellKey = savedActiveCellKey;
}

const initialState: CellCollection = {
    cells: cells,
    activeCellKey: activeCellKey
}

export const cellSlice = createAppSlice({
    name: 'cell',
    initialState,
    reducers: create => ({
        updateCell: create.reducer(
            (state, action: PayloadAction<CellUpdate>) => {
                const cellKey = getCellKey(action.payload.coords.columnIndex, action.payload.coords.rowIndex);
                const cellState: CellState = state.cells[cellKey as keyof typeof state.cells];

                state.cells = { ...state.cells, [cellKey]: getUpdatedCellState(cellState, action.payload.value) };
                localStorage.setItem('cells', JSON.stringify(state.cells));
            },
        ),
        setActiveCell: create.reducer(
            (state, action: PayloadAction<CellCoords>) => {
                if (state.activeCellKey)
                {
                    const activeCell = state.cells[state.activeCellKey as keyof typeof state.cells];
                    state.cells = { ...state.cells, [state.activeCellKey]: { ...activeCell as CellInfo, isActive: false }};
                }

                state.activeCellKey = getCellKey(action.payload.columnIndex, action.payload.rowIndex);
                let newActiveCellState: CellState = state.cells[state.activeCellKey as keyof typeof state.cells];

                if (typeof newActiveCellState === "undefined") {
                    newActiveCellState = getNewCellInfo({ coords: action.payload, value: "" });
                } 

                state.cells = { ...state.cells, [state.activeCellKey]: { ...newActiveCellState, isActive: true }};

                localStorage.setItem('activeCellKey', state.activeCellKey);
                localStorage.setItem('cells', JSON.stringify(state.cells));
            }
        ),
        deactivateCell: create.reducer(
            (state) => {
                if (state.activeCellKey !== "") {
                    const activeCell = state.cells[state.activeCellKey as keyof typeof state.cells];

                    state.cells = { ...state.cells, [state.activeCellKey]: { ...activeCell as CellInfo, isActive: false }};
                    state.activeCellKey = "";

                    localStorage.setItem('activeCellKey', JSON.stringify(state.activeCellKey));
                    localStorage.setItem('cells', JSON.stringify(state.cells));
                }
            }
        )
    }),
    selectors: {
        selectCell: (cellCollection: CellCollection, columnIndex: number, rowIndex: number) : CellState => {
            const cell: CellState = cellCollection.cells[getCellKey(columnIndex, rowIndex) as keyof typeof cellCollection.cells];

            return cell;
        },
        selectActiveCell: (cellCollection: CellCollection) : CellState => {
            if (cellCollection.activeCellKey === "") return undefined;

            const cell: CellState = cellCollection.cells[cellCollection.activeCellKey as keyof typeof cellCollection.cells];

            return cell;
        }
    }
});

const getCellKey = (columnIndex: number, rowIndex: number) => `${columnIndex.toString()}:${rowIndex.toString()}`

const getNewCellInfo = (cellUpdate: CellUpdate) : CellInfo => {
    return {
        columnIndex: cellUpdate.coords.columnIndex,
        rowIndex: cellUpdate.coords.rowIndex,
        literalValue: cellUpdate.value,
        displayValue: getDisplayValue(cellUpdate.value),
        typedValue: {},
        valueType: "string",
        isActive: false,
        referencedBy: []
    };
}

const getUpdatedCellState = (currentState: CellInfo, literalValue: string) : CellState => {
    // no cell value and the cell is not referenced by any other cell, we can remove the value
    if (literalValue === "" && 
        typeof currentState !== "undefined" &&
        currentState.referencedBy.length == 0
    ) return undefined;

    const newState: CellInfo = { ...currentState, 
        literalValue: literalValue, 
        displayValue: getDisplayValue(literalValue),
        valueType: getValueType(literalValue)
    }

    return newState;
}

const getDisplayValue = (literalValue: string): string => {
    if (!literalValue) return "";

    if (literalValue.startsWith("=")) {
        return "FORMULA";
    }

    return literalValue;
}

const getValueType = (literalValue: string): CellValueType => {
    if (!literalValue) return "string";

    if (literalValue.startsWith("=")) return "formula";

    if (literalValue.toUpperCase() === "TRUE" || literalValue.toUpperCase() === "FALSE") return "boolean"

    const parsedInt = Number.parseInt(literalValue, 10);
    const parsedFloat = Number.parseFloat(literalValue);

    if (Number.isNaN(parsedInt) && Number.isNaN(parsedFloat)) return "string";

    return "number";
}

export const { updateCell, setActiveCell, deactivateCell } = cellSlice.actions
export const { selectCell, selectActiveCell } = cellSlice.selectors


