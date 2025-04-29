import type { AppStore } from "../../app/store"
import { makeStore } from "../../app/store"
import type { CellInfo } from "../../models/CellInfo"
import type { CellCollection } from "./cellSlice" 

import {
    updateCell, 
    setActiveCell, 
    deactivateCell,
    selectCell,
    selectActiveCell,
    cellSlice
} from "./cellSlice"

type CellSliceTestContext = {
    store: AppStore
}

describe("cellSlice reducer", () => {
    beforeEach<CellSliceTestContext>(context => {
        const activeCell: CellInfo = {
            columnIndex: 0,
            rowIndex: 4,
            isActive:  true,
            literalValue: "my cell value",
            displayValue: "my cell value",
            valueType: "string",
            typedValue: "my cell value",
            referencedBy: []           
        }

        const secondCell: CellInfo = {
            columnIndex: 1,
            rowIndex: 4,
            isActive:  true,
            literalValue: "my second cell value",
            displayValue: "my second cell value",
            valueType: "string",
            typedValue: "my second cell value",
            referencedBy: []           
        }

        const thirdCell: CellInfo = {
            columnIndex: 10,
            rowIndex: 10,
            isActive:  true,
            literalValue: "my third cell value",
            displayValue: "my third cell value",
            valueType: "string",
            typedValue: "my third cell value",
            referencedBy: []           
        }

        const initialState: CellCollection = {
            activeCellKey: "0:4",
            cells: {
                "0:4": activeCell,
                "1:4": secondCell,
                "10:10": thirdCell              
            }
        }

        const store = makeStore({ cell: initialState });
        context.store = store;
    });

    it("should handle initial state", () => {
        expect(cellSlice.reducer(undefined, { type: "unknown" })).toStrictEqual({
            activeCellKey: "",
            cells: {}
        });
    });

    it<CellSliceTestContext>("should handle deactivating the active cell", ({ store }) => {
        expect(selectActiveCell(store.getState())?.columnIndex).toBe(0);
        expect(selectActiveCell(store.getState())?.rowIndex).toBe(4);
        expect(selectActiveCell(store.getState())?.isActive).toBeTruthy();

        store.dispatch(deactivateCell());

        expect(selectActiveCell(store.getState())).toBeUndefined();
    });

    it<CellSliceTestContext>("should handle switching the active cell", ({ store }) => {
        expect(selectActiveCell(store.getState())?.columnIndex).toBe(0);
        expect(selectActiveCell(store.getState())?.rowIndex).toBe(4);
        expect(selectActiveCell(store.getState())?.isActive).toBeTruthy();

        store.dispatch(setActiveCell({ columnIndex: 3, rowIndex: 5 }));

        expect(selectActiveCell(store.getState())?.columnIndex).toBe(3);
        expect(selectActiveCell(store.getState())?.rowIndex).toBe(5);
        expect(selectActiveCell(store.getState())?.isActive).toBeTruthy();
        expect(selectCell(store.getState(), 0, 4)?.isActive).toBeFalsy();
    });

    it<CellSliceTestContext>("should update a cell value", ({ store }) => {
        const newCellValue = "my updated cell value";
        expect(selectCell(store.getState(), 0, 4)?.literalValue).toBe("my cell value");

        store.dispatch(updateCell({ coords: {columnIndex: 0, rowIndex: 4 }, value: newCellValue }));

        expect(selectCell(store.getState(), 0, 4)?.literalValue).toBe(newCellValue);
    });
});

