import { loadState, prune, redo, setName, undo } from './actions';
import { BaseAction } from './actions/types';
import { Action, Attachment, Document, Reducer } from './types';
import { createDocument, loadFromFile, saveToFile } from './utils';

/**
 * This is an abstract class representing a document and provides methods
 * for creating and manipulating documents.
 * @typeparam T - The type of data stored in the document.
 * @typeparam A - The type of action the document can take.
 */
export abstract class BaseDocument<T, A extends Action> {
    protected state: Document<T, A>;
    private reducer: Reducer<T, A | BaseAction>;

    /**
     * Constructs a BaseDocument instance with an initial state.
     * @param reducer - The reducer function that updates the state.
     * @param initialState - The initial state of the document.
     */
    constructor(
        reducer: Reducer<T, A | BaseAction>,
        initialState?: Partial<Document<T, A>> & { data: T }
    ) {
        this.reducer = reducer;
        this.state = createDocument(initialState);
    }

    /**
     * Dispatches an action to update the state of the document.
     * @param action - The action to dispatch.
     * @returns The Document instance.
     */
    protected dispatch(action: A | BaseAction) {
        this.state = this.reducer(this.state, action);
        return this;
    }

    /**
     * Saves the state of the document to a file.
     * @param path - The file path where the state should be saved.
     * @param extension - The file extension to use when saving the state.
     * @returns The file path where the state was saved.
     */
    protected saveToFile(path: string, extension: string) {
        return saveToFile(this.state, path, extension);
    }

    /**
     * Loads the state of the document from a file.
     * @param path - The file path where the state is stored.
     */
    async loadFromFile(path: string) {
        this.state = await loadFromFile<T, A | BaseAction>(path, this.reducer);
    }

    /**
     * Loads the state of the document from a file and returns it.
     * @param path - The file path where the state is stored.
     * @param reducer - The reducer function that updates the state.
     * @returns The state of the document.
     */
    protected static async stateFromFile<T, A extends Action>(
        path: string,
        reducer: Reducer<T, A | BaseAction>
    ) {
        const state = await loadFromFile<T, A>(path, reducer);
        return state;
    }

    /**
     * Gets the name of the document.
     */
    get name() {
        return this.state.name;
    }

    /**
     * Gets the type of document.
     */
    get documentType() {
        return this.state.documentType;
    }

    /**
     * Gets the timestamp of the date the document was created.
     */
    get created() {
        return this.state.created;
    }

    /**
     * Gets the timestamp of the date the document was last modified.
     */
    get lastModified() {
        return this.state.lastModified;
    }

    /**
     * Gets the revision number of the document.
     */
    get revision() {
        return this.state.revision;
    }

    /**
     * Gets the initial state of the document.
     */
    get initialState() {
        return this.state.initialState;
    }

    /**
     *    Gets the list of operations performed on the document.
     */
    get operations() {
        return this.state.operations;
    }

    /**
     * Gets the attachment associated with the given key.
     * @param attachment - The key of the attachment to retrieve.
     */
    public getAttachment(attachment: Attachment) {
        return this.state.fileRegistry[attachment];
    }

    /**
     * Sets the name of the document.
     * @param name - The new name of the document.
     */
    public setName(name: string) {
        this.dispatch(setName(name));
    }

    /**
     * Reverts a number of actions from the document.
     * @param count - The number of actions to revert.
     */
    public undo(count: number) {
        this.dispatch(undo(count));
    }

    /**
     * Reapplies a number of actions to the document.
     * @param count - The number of actions to reapply.
     */
    public redo(count: number) {
        this.dispatch(redo(count));
    }
    /**
     * Removes a range of operations from the document.
     * @param start - The starting index of the range to remove.
     * @param end - The ending index of the range to remove.
     */
    public prune(start?: number | undefined, end?: number | undefined) {
        this.dispatch(prune(start, end));
    }

    /**
     * Loads a document state and a set of operations.
     * @param state - The state to load.
     * @param operations - The operations to apply to the document.
     */
    public loadState(
        state: Pick<Document<T, A>, 'data' | 'name'>,
        operations: number
    ) {
        this.dispatch(loadState(state, operations));
    }
}
/**
 * Applies multiple mixins to a base class.
 * Used to have separate mixins to group methods by actions.
 *
 * @remarks
 * {@link https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern}
 *
 * @param derivedCtor - The class to apply the mixins to.
 * @param constructors - The constructors of the mixins.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null)
            );
        });
    });
}
