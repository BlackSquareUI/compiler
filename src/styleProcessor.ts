import { readdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import path from "node:path";
import { arrCount, getUniqueItems, removeSpaces } from "./utils";
import { configType, GeneralClassType, ScreenSize } from "./types/GeneralClassType"

const createCSSBundle = async (config: configType) => {
    const { sourceDir, outputFile } = config.content
    const css = await createCSS(config)
    writeFileSync(`${sourceDir}/${outputFile}`, css)
}

const createCSS = async (config: configType): Promise<string> => {
    const { sourceDir, fileExtension } = config.content
    const allFilesContent = await readTextFromDir(sourceDir, fileExtension)
    const classNames = await collectClasses(allFilesContent)
    return createRootStyles(config) + createClassStyles(classNames, config)
};

const collectClasses = async (text: string) => {
    const regex = /className=(?:"([^"]+)"|'([^']+)'|\{([^}]+)\})/g;
    return getUniqueItems(Array.from(text.matchAll(regex))
        .map((match) => match.slice(1).find(Boolean))
        .filter(Boolean)
        .flatMap(extractStaticClasses)
    )
}

const extractStaticClasses = (className: string) => className ? className.split(" ") : [];

const walkSync = (dir: string): string[] => {
    if (!existsSync(dir)) return []
    const files = readdirSync(dir, { withFileTypes: true });
    return [].concat(
        files
            .map(file =>
                file.isDirectory() ? walkSync(path.join(dir, file.name)) : [path.join(dir, file.name)])
            .flat()
    );
}
const readTextFromDir = async (dir: string, fileExtension: string) => {
    const haveExtension = (filePath: string) => filePath.includes(fileExtension)
    const combineFilesContents = (acc: string, filePath: string) =>
        acc += readFileSync(filePath, 'utf-8')

    return walkSync(dir)
        .filter(haveExtension)
        .reduce(combineFilesContents, "");
}

const createRootStyles = (config: configType): string => {
    const { props, screens } = config;
    const createVar = (props: GeneralClassType[], name: string): string => {
        const getValueWithUnit = ({ val, type }: GeneralClassType) => val + (type === 'range' ? 'rem' : '')
        return props.reduce((acc, prop) => acc + `--${name}-${prop.name}:(${getValueWithUnit(prop)});`, '')
    }
    return `:root{${screens.reduce((acc, { name }: ScreenSize) => acc + createVar(props, name), "")}}`
}

const createRangeStyles = (className: string, props: GeneralClassType[]): string => {
    const [property, multiplier] = className.includes("_") ? className.split("_") : [className];
    const classProps = getPropByClassName(className, props);
    const pos = getDirectionFromClassName(property, props);

    if (!classProps || pos === false) return "";
    return `.${className} {${classProps.property}${pos}:calc(var(--oo-${classProps.name})${multiplier ? ` * ${multiplier}` : ""});}`;
};

const createColorStyles = (className: string, props: GeneralClassType[]): string => {
    const { property, name } = getPropByClassName(className, props);
    return `.${className} {${property}: var(--oo-${name}); }`;
};

const getClassesByPrefix = (classNames: string[], prefix: string): string[] =>
    classNames.filter(c => c.includes(prefix));

const processEEClass = (className: string): string => {
    if (!className.includes("_")) return ""

    const [name, prop] = className.split("_");
    return `.${className}{${name.split("ee-")[1]}:${parseInt(prop) ? prop + "rem" : prop}}`;
}

const processOOClass = (props: GeneralClassType[]) => (className: string): string => {
    const prop = getPropByClassName(className, props);
    const createStylesByType = {
        range: createRangeStyles,
        color: createColorStyles
    }

    return prop ? createStylesByType[prop.type](className, props) : ""
}


const getStyleTypeOrDefault = (styleType: string | undefined, defaultType: string): string => styleType || defaultType;

const processOEClass = (className: string): string => {
    const classNameWithoutPrefix = removePrefix(className)
    const [prop, styleType] = classNameWithoutPrefix.split("-");
    const styleTypeOrDefault = getStyleTypeOrDefault(styleType, "primary")

    return removeSpaces(`.oe - ${prop} -${styleTypeOrDefault}:${prop} {
        color: var(--oo-background-color-${styleTypeOrDefault});
        background-color:var(--oo-text-color-${styleTypeOrDefault})
    } `)
}

const addSeparator = (className: string) => className + "__"

const withoutMediaClass = (className: string) => className.replace(/.*__/, "")

const getClassType = (className: string) =>
    ["oo", "oe", "ee"].reduce((acc, type) => className.includes(type) ? acc + type : acc, "")

const addMediaPrefixToClassName = (className: string, mediaPrefix: string) => className.split(".").join(mediaPrefix)

const createClassInsideMediaScreen = (size: string, cssClass: string) => `@media only screen and (max-width: ${size}) {.${cssClass}}`

const processThoughtMediaClasses = (className: string, { screens, props }: configType): string => {
    if (!isValidClassName(className, props)) return ""

    return screens.reduce((acc, { name, size }: ScreenSize) => {
        const withSeparator = addSeparator(name)
        if (className.includes(withSeparator)) {
            const classWithoutMediaPrefix = withoutMediaClass(className)
            const cssClass = addMediaPrefixToClassName(processClassName(classWithoutMediaPrefix, props), withSeparator)
            return acc + createClassInsideMediaScreen(size, cssClass)
        }
        return acc + processClassName(className, props)
    }, "")
}

const processClassName = (className: string, props: GeneralClassType[]): string => {
    const classType = getClassType(className);
    if (!classType) return ""
    const classTypeProcessors = {
        oe: processOEClass,
        oo: processOOClass(props),
        ee: processEEClass
    }

    return classTypeProcessors[classType](className) || "";
}
const isValidClassName = (className: string, props: GeneralClassType[]): boolean => {
    const classType = getClassType(className);

    if (!className || !classType) return false
    if (classType === "oo") {
        if (!getPropByClassName(className, props)) return false
    }

    return true
}
const createClassStyles = (classNames: string[], config: configType): string =>
    classNames.reduce((acc, className) =>
        acc + processThoughtMediaClasses(className, config)
        , "")

const removePrefix = (className: string): string => className.replace(/^ee-|oo-|oe-/, "");

const getPropByClassName = (className: string, props: GeneralClassType[]) =>
    props.find(cl => className.includes(cl.name));


const getDirectionFromClassName = (className: string, props: GeneralClassType[]) => {
    const classNameWithoutPrefix = removePrefix(className)
    const classProps = getPropByClassName(classNameWithoutPrefix, props)
    const pos = classProps.direction.filter((dir: string) =>
        classProps.property + dir === classNameWithoutPrefix
    )
    return arrCount(pos) === 1 ? pos[0] : false
}

export { createCSSBundle }
export const forTesting = {
    getClassType,
    processThoughtMediaClasses,
    createCSS,
    extractStaticClasses,
    collectClasses,
    createColorStyles,
    createRootStyles,
    createClassStyles,
    removePrefix,
    getPropByClassName,
    getDirectionFromClassName,
    createCSSBundle,
    readTextFromDir,
    walkSync,
    createRangeStyles,
    getClassesByPrefix,
    processEEClass,
    processClassName,
    processOEClass,
    processOOClass
}