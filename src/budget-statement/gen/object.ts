import { applyMixins, BaseDocument } from '../../document';
import {
    BudgetStatementAction,
    BudgetStatementDocument,
    reducer,
    State,
} from '../custom';
import { createBudgetStatement } from '../custom/utils';
import AccountObject from './account/object';
import AuditObject from './audit/object';
import InitObject from './init/object';
import LineItemObject from './line-item/object';
import StatusObject from './status/object';
import TopupObject from './topup/object';

/**
 * Represents a BudgetStatement object that extends the {@link BaseDocument} class to provide a convenient
 * interface for managing a budget statement.
 * @extends AccountObject
 * @extends AuditObject
 * @extends InitObject
 * @extends LineItemObject
 * @extends StatusObject
 * @extends TopupObject
 */
interface BudgetStatement
    extends AccountObject,
        AuditObject,
        InitObject,
        LineItemObject,
        StatusObject,
        TopupObject {}

/**
 * Represents a budget statement document.
 *
 * @extends BaseDocument<State, BudgetStatementAction>
 * @implements AccountObject, AuditObject, InitObject, LineItemObject, StatusObject, TopupObject
 */
class BudgetStatement extends BaseDocument<State, BudgetStatementAction> {
    /**
     * The file extension used to save budget statements.
     */
    static fileExtension = 'phbs';

    /**
     *
     * Creates a new BudgetStatement instance.
     * @param initialState - An optional object representing the initial state of the BudgetStatement.
     */
    constructor(
        initialState?: Partial<
            Omit<BudgetStatementDocument, 'data'> & {
                data: Partial<BudgetStatementDocument['data']>;
            }
        >
    ) {
        super(reducer, createBudgetStatement(initialState));
    }

    /**
     * Gets the month of the budget statement.
     */
    get month() {
        return this.state.data.month;
    }

    /**
     * Gets the owner of the budget statement.
     */
    get owner() {
        return this.state.data.owner;
    }

    /**
     * Gets the quote currency of the budget statement.
     */
    get quoteCurrency() {
        return this.state.data.quoteCurrency;
    }

    /**
     * Saves the budget statement to a file.
     *
     * @param path The path to the file to save.
     * @returns A promise that resolves when the save operation completes.
     */
    public saveToFile(path: string) {
        return super.saveToFile(path, BudgetStatement.fileExtension);
    }

    /**
     * Loads the budget statement from a file.
     *
     * @param path The path to the file to load.
     * @returns A promise that resolves with the loaded `BudgetStatement` instance.
     */
    public loadFromFile(path: string) {
        return super.loadFromFile(path);
    }

    /**
     * Creates a new `BudgetStatement` instance from a file.
     *
     * @param path The path to the file to load.
     * @returns A promise that resolves with the loaded `BudgetStatement` instance.
     */
    static async fromFile(path: string) {
        const budgetStatement = new this();
        await budgetStatement.loadFromFile(path);
        return budgetStatement;
    }
}

applyMixins(BudgetStatement, [
    AccountObject,
    AuditObject,
    InitObject,
    LineItemObject,
    StatusObject,
    TopupObject,
]);

/**
 * Represents a BudgetStatement object that extends the {@link BaseDocument} class to provide a convenient
 * interface for managing a budget statement.
 * @extends AccountObject
 * @extends AuditObject
 * @extends InitObject
 * @extends LineItemObject
 * @extends StatusObject
 * @extends TopupObject
 */
export { BudgetStatement };
