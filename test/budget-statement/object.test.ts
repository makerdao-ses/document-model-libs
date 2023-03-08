import { BudgetStatementObject } from '../../src/budget-statement/gen/object';

describe('Budget Statement Class', () => {
    it('should set initial state', async () => {
        const budgetStatement = new BudgetStatementObject({
            data: { month: '03/2023' },
        });

        expect(budgetStatement.getState().data.month).toBe('03/2023');
        expect(budgetStatement.getState().data.quoteCurrency).toBe(null);
    });

    it('should add account', async () => {
        const budgetStatement = new BudgetStatementObject();
        budgetStatement.addAccount([
            {
                address: 'eth:0xb5eB779cE300024EDB3dF9b6C007E312584f6F4f',
                name: 'Grants Program',
            },
        ]);

        expect(budgetStatement.getState().data.accounts).toStrictEqual([
            {
                address: 'eth:0xb5eB779cE300024EDB3dF9b6C007E312584f6F4f',
                name: 'Grants Program',
                accountBalance: {
                    timestamp: null,
                    value: null,
                },
                targetBalance: {
                    comment: null,
                    value: null,
                },
                topupTransaction: {
                    id: null,
                    requestedValue: null,
                    value: null,
                },
                lineItems: [],
            },
        ]);
    });

    it('should chain add account calls', async () => {
        const budgetStatement = new BudgetStatementObject();
        budgetStatement
            .addAccount([
                {
                    address: 'eth:0xb5eB779cE300024EDB3dF9b6C007E312584f6F4f',
                    name: 'Grants Program',
                },
            ])
            .addAccount([
                {
                    address: 'eth:0x7c09ff9b59baaebfd721cbda3676826aa6d7bae8',
                    name: 'Incubation Program',
                },
            ]);

        expect(budgetStatement.getState().data.accounts).toStrictEqual([
            {
                address: 'eth:0xb5eB779cE300024EDB3dF9b6C007E312584f6F4f',
                name: 'Grants Program',
                accountBalance: {
                    timestamp: null,
                    value: null,
                },
                targetBalance: {
                    comment: null,
                    value: null,
                },
                topupTransaction: {
                    id: null,
                    requestedValue: null,
                    value: null,
                },
                lineItems: [],
            },
            {
                address: 'eth:0x7c09ff9b59baaebfd721cbda3676826aa6d7bae8',
                name: 'Incubation Program',
                accountBalance: {
                    timestamp: null,
                    value: null,
                },
                targetBalance: {
                    comment: null,
                    value: null,
                },
                topupTransaction: {
                    id: null,
                    requestedValue: null,
                    value: null,
                },
                lineItems: [],
            },
        ]);
    });
});