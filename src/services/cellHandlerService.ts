import type { CellState } from "../models/CellState";
import type { CellInfo, CellValueType } from "../models/CellInfo";

const getNewCellInfo = (literalValue: string) : CellState => {
    return {
        literalValue: literalValue,
        displayValue: getDisplayValue(literalValue),
        valueType: "string",
        isActive: false,
        referencedBy: []
    };
}

const getUpdatedCellInfo = (currentState: CellInfo, literalValue: string) : CellState => {
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

    const parsedInt = Number.parseInt(literalValue, 10);
    const parsedFloat = Number.parseFloat(literalValue);

    if (Number.isNaN(parsedInt) && Number.isNaN(parsedFloat)) return "string";

    return "number";
}

export default {
    getNewCellInfo,
    getUpdatedCellInfo
} 