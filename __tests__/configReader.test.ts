import fs from 'node:fs';
import { fakeConfig, getConfig } from '../src/configReader';
import {
    describe, test, expect, jest, beforeAll, afterAll
} from '@jest/globals';

jest.mock('fs')
const config = fakeConfig()

describe('getConfig', () => {
    beforeAll(() => {
        fs.writeFileSync("BlackSquareUI.json", JSON.stringify(config))
    });
    test('should return the config from the config file', async () => {
        const buildConfig = await getConfig();
        expect(buildConfig).toEqual(config);
    });
    afterAll(() => {
        fs.unlinkSync("BlackSquareUI.json")
    })
});