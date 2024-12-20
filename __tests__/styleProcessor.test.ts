import { forTesting } from '../src/styleProcessor';
const { processEEClass, processOEClass, processOOClass, processThoughtMediaClasses, createCSS, extractStaticClasses, collectClasses, createColorStyles, createRootStyles, createClassStyles, removePrefix, getPropByClassName, getDirectionFromClassName, createCSSBundle, readTextFromDir, walkSync, createRangeStyles, getClassesByPrefix, getClassType, processClassName } = forTesting
import fs, { existsSync, writeFileSync } from 'node:fs';
import {
    describe, test, expect, beforeAll, jest, afterAll, beforeEach, afterEach
} from '@jest/globals';
import { fakeConfig } from '../src/configReader';
import path from 'node:path';
import { ScreenSize } from '../src/types/GeneralClassType';

const config = fakeConfig()

describe('collectClasses', () => {
    test('collectClasses should return an array of unique class names', async () => {
        const text = '<div className="oo-margin oo-margin oo-padding-top ee-margin-top_2">...</div>';
        const classNames = await collectClasses(text);
        expect(classNames).toEqual(['oo-margin', 'oo-padding-top', 'ee-margin-top_2']);
    });
});

describe('createRootStyles', () => {
    test('createRootStyles should generate CSS variables for root element', () => {
        const styles = createRootStyles(config);
        expect(styles).toContain(styles);
    });
})

describe('getPropByClassName', () => {
    test('getPropByClassName should return property object based on class name', () => {
        const className = 'oo-margin-top';
        const prop = getPropByClassName(className, config.props);
        const marginProp = config.props.find(i => i.name === "margin")
        expect(prop).toEqual(marginProp);
    });
})
describe('getClassType', () => {
    test('should return class type', () => {
        const className = 'oo-margin';
        const expected = "oo"
        expect(getClassType(className)).toBe(expected)
    })
})
describe('', () => {
    test('should create css for different screens', () => {
        const sm: ScreenSize = config.screens.filter(i => i.name === "sm")[0]
        const className = `${sm.name}__ee-margin-top_2`;
        const expected = `@media only screen and (max-width: ${sm.size}) {.${sm.name}__ee-margin-top_2{margin-top:2rem}}`
        expect(processThoughtMediaClasses(className, config)).toBe(expected);
    })
})
describe('processClassName', () => {
    test('should create css based on class name', () => {
        const className = 'ee-margin-top_2';
        const expected = `.ee-margin-top_2{margin-top:2rem}`
        expect(processClassName(className, config.props)).toBe(expected);
    })
    test('should return empty string if cant get class type', () => {
        const className = 'or-mmargin-top_2';
        const expected = ``
        expect(processClassName(className, config.props)).toBe(expected);
    })

    test('should return empty string if cant get class name is wrong', () => {
        const className = 'oo-mmargin-top_2';
        const expected = ``
        expect(processClassName(className, config.props)).toBe(expected);
    })
})
describe('processOEClasses', () => {
    test('should process classes correctly', () => {
        const className = 'oe-hover-success';
        const expected = ".oe-hover-success:hover{color:var(--oo-background-color-success);background-color:var(--oo-text-color-success)}";
        expect(processOEClass(className)).toBe(expected);
    })

    test('should use primary colors in default ', () => {
        const className = 'oe-hover';
        const expected = ".oe-hover-primary:hover{color:var(--oo-background-color-primary);background-color:var(--oo-text-color-primary)}";
        expect(processOEClass(className)).toBe(expected);
    })
})
describe('processOOClasses', () => {
    test('processOOClasses should process classes correctly', () => {
        const classNames = 'oo-margin'
        const expected = createRangeStyles('oo-margin', config.props);
        expect(processOOClass(config.props)(classNames)).toBe(expected);
    });

    test('should return empty string', () => {
        const classNames = 'oo-sdcsdc'
        const expected = ''
        expect(processOOClass(config.props)(classNames)).toBe(expected);
    });
})
describe('createRangeStyles', () => {
    test('should return css class', () => {
        expect(createRangeStyles('ee-margin-top_2', config.props)).toBe('.ee-margin-top_2 {margin-top:calc(var(--oo-margin) * 2);}');
    });
    test('should return empty string if class property not found in config.props', () => {
        expect(createRangeStyles('ee-margin-wrong', config.props)).toBe('');
    });
})

describe('createEEStyles', () => {
    test('should handle class names with underscores and numeric properties', () => {
        expect(processEEClass('ee-padding_2')).toBe('.ee-padding_2{padding:2rem}');
        expect(processEEClass('ee-margin_10')).toBe('.ee-margin_10{margin:10rem}');
        expect(processEEClass('ee-margin')).toBe('');
        expect(processEEClass('ee-border-style_solid')).toBe('.ee-border-style_solid{border-style:solid}');
    });
})
describe('getClassesByPrefix', () => {
    test("should return an empty array when classNames is empty", () => {
        expect(getClassesByPrefix([], "prefix")).toEqual([]);
    });

    test("should return class name  when classname contain the prefix", () => {
        expect(getClassesByPrefix(['ee-margin'], "ee")).toEqual(['ee-margin']);
    });

    test("should return empty array if classname doesnt contain the prefix", () => {
        expect(getClassesByPrefix(['oo-margin'], "ee")).toEqual([]);
    });
})
describe('getDirectionFromClassName', () => {
    test('should return position property based on class name', () => {
        const className = 'oo-padding-left';
        const pos = getDirectionFromClassName(className, config.props);
        expect(pos).toEqual('-left');
    });
    test('should return false if direcotion isnt found', () => {
        const className = 'oo-padding-ggg';
        const pos = getDirectionFromClassName(className, config.props);
        expect(pos).toEqual(false);
    });

    test('should return className if its not have direction', () => {
        const className = 'oo-padding';
        const pos = getDirectionFromClassName(className, config.props);
        expect(pos).toEqual("");
    });
})
describe('removePrefix', () => {
    test('should remove prefixes "ee-" and "oo-" from the class name', () => {
        expect(removePrefix('ee-myClass_1')).toBe('myClass_1');
        expect(removePrefix('oo-anotherClass_2')).toBe('anotherClass_2');
    });
    test('should return class name if it dont have prefix', () => {
        expect(removePrefix('regularClass_3')).toBe('regularClass_3');
    })
    test('should handle empty class names', () => {
        expect(removePrefix('')).toBe('');
    });
})
describe("extractStaticClasses", () => {
    test('should extract static classes correctly', () => {
        const result = extractStaticClasses(`oo-margin oo-padding`);
        expect(result).toEqual(['oo-margin', 'oo-padding']);
    });
    test('should handle empty inputs', () => {
        const result = extractStaticClasses('');
        expect(result).toEqual([]);
    });
})
describe('collectClasses', () => {
    test('should correctly extract static and dynamic classes from the given text', async () => {
        const text = `className="static-class1 static-class2 static-class2" className={dynamicClass1} className='static-class3'`;
        const expectedClasses = ['static-class1', 'static-class2', 'static-class3', 'dynamicClass1'];
        const result = await collectClasses(text);

        expect(result).toEqual(expect.arrayContaining(expectedClasses));
    });
    test('should handle empty text and return an empty array', async () => {
        const text = '';
        const expectedClasses = [];
        const result = await collectClasses(text);

        expect(result).toEqual(expectedClasses);
    });
})
describe('readTextFromDir', () => {
    beforeAll(() => {
        fs.mkdirSync('readTextFromDir')
        fs.writeFileSync(`readTextFromDir/test1.txt`, `<div className="oo-margin ee-margin_10">Test</div> <div className="oo-text-color-primary">Test2</div>`);
        fs.writeFileSync(`readTextFromDir/test2.txt`, `<div className="oo-border-color">Test3</div>`)
    });
    test('hould read text files from a directory and concatenate their contents', async () => {
        const result = await readTextFromDir('readTextFromDir', 'txt');
        expect(result).toBe(`<div className=\"oo-margin ee-margin_10\">Test</div> <div className=\"oo-text-color-primary\">Test2</div><div className=\"oo-border-color\">Test3</div>`);
    });
    test('should return if directory doest exist', async () => {
        const result = await readTextFromDir("sdcsdc", 'txt');
        expect(result).toBe("");
    });
    afterAll(() => {

        fs.rmSync(`readTextFromDir/test1.txt`)
        fs.rmSync(`readTextFromDir/test2.txt`)
        fs.rmdirSync('readTextFromDir')
    })
})

// describe('createCSS', () => {
//     beforeAll(() => {
//         fs.mkdirSync('createCSS')
//         fs.writeFileSync(`createCSS/test1.txt`, ` <div className="oo-margin oo-margin-top_2 ee-margin_10">Test</div> <div className="oo-text-color-primary">Test2</div>`);
//         fs.writeFileSync(`createCSS/test2.txt`, `<div className="oo-border-color">Test3</div>`)
//     });
//     test('should correctly process CSS and return styles', async () => {
//         const css = await createCSS(config);
//         expect(css).toContain(':root{--margin: 1rem;--padding: 1rem;--border-width: 0.1rem;--border-radius: 0.1rem;--background-color-primary: black;--background-color-success: blue;--background-color-danger: red;--border-color: black;--text-color-primary: black;--text-color-success: blue;--text-color-danger: red;}.oo-margin {margin:calc(var(--oo-margin));}.oo-margin-top_2 {margin-top:calc(var(--oo-margin) * 2);}.ee-margin_10{margin:10rem}.oo-text-color-primary {color:var(--oo-text-color-primary);}.oo-border-color {border-color:var(--oo-border-color);}');
//     });
//     afterAll(() => {
//         fs.rmSync(`createCSS/test1.txt`)
//         fs.rmSync(`createCSS/test2.txt`)
//         fs.rmdirSync('createCSS')
//     });
// })

describe('walkSync', () => {
    beforeAll(() => {
        fs.mkdirSync('walkSync')
        fs.mkdirSync("walkSync/subDir")
        writeFileSync(path.join('walkSync', 'file1.txt'), '');
        writeFileSync(path.join("walkSync/subDir", 'file2.txt'), '');
    })
    test('should handle a directory with only files', () => {
        const files = Array.from(walkSync('walkSync'));
        expect(files).toEqual([
            path.join('walkSync', 'file1.txt'),
            path.join('walkSync' + "/subDir", 'file2.txt'),
        ]);
    });
    afterAll(() => {
        fs.unlinkSync("walkSync/subDir/file2.txt")
        fs.rmdirSync("walkSync/subDir")
        fs.unlinkSync("walkSync/file1.txt")
        fs.rmdirSync("walkSync")
    })
})
// describe('createCSSBundle', () => {
//     beforeAll(() => {
//         fs.mkdirSync('createCSSBundle')
//     })
//     test('should create a CSS file successfully', async () => {
//         await createCSSBundle(config);
//         expect(existsSync(`${config.content.sourceDir}/${config.content.outputFile}`)).toBe(true);
//     });
//     afterAll(() => {
//         fs.rmSync(`${config.content.sourceDir}/${config.content.outputFile}`)
//         fs.rmdirSync(config.content.sourceDir)
//     })
// })