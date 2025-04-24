import type { AppStore } from "../../app/store"
import { makeStore } from "../../app/store"
import type { SheetInfo } from "../../models/SheetInfo"
import { DefaultColumnCount, DefaultRowCount, MaxColumnCount, MaxRowCount } from "../../models/SheetInfo"

import {
    addColumns,
    addRows,
    sheetSlice
} from "./sheetSlice"

type SheetSliceTestContext = {
    store: AppStore
}

describe("sheetSlice reducer", () => {
    beforeEach<SheetSliceTestContext>(context => {
        const initialState: SheetInfo = {
            rowCount: 50,
            columnCount: 25,
            rowHeights: [ "100px" ],
            columnWidths: [ "120px" ]
        }

        const store = makeStore({ sheet: initialState });
        context.store = store;
    });

    it("should handle initial state", () => {
        expect(sheetSlice.reducer(undefined, { type: "unknown" })).toStrictEqual({
            rowCount: DefaultRowCount,
            columnCount: DefaultColumnCount,
            rowHeights: [],
            columnWidths: []
        });
    });

    it<SheetSliceTestContext>("should add 10 rows if count is under max", ({ store }) => {
        expect(store.getState().sheet.rowCount).toBe(50);

        store.dispatch(addRows());

        expect(store.getState().sheet.rowCount).toBe(60);
    });

    it<SheetSliceTestContext>("should not set row count to more than max", ({ store }) => {
        expect(store.getState().sheet.rowCount).toBe(50);

        let count = 50;

        while (count < MaxRowCount + 100) {
            store.dispatch(addRows());
            count += 10;
        }

        expect(store.getState().sheet.rowCount).toBe(MaxRowCount);
    });

    it<SheetSliceTestContext>("should add 10  columns if count is under max", ({ store }) => {
        expect(store.getState().sheet.columnCount).toBe(25);

        store.dispatch(addColumns());

        expect(store.getState().sheet.columnCount).toBe(35);
    });

    it<SheetSliceTestContext>("should not set column count to more than max", ({ store }) => {
        expect(store.getState().sheet.columnCount).toBe(25);

        let count = 25;

        while (count < MaxColumnCount + 100) {
            store.dispatch(addColumns());
            count += 10;
        }

        expect(store.getState().sheet.columnCount).toBe(MaxColumnCount);
    });
});