export type configType = {
    settings: {
        unit: string
    };
    screens: ScreenSize[]
    content: ClassContentType;
    props: Array<GeneralClassType>
}
export type ScreenSize = {
    name: string;
    size: string;
}
export type ClassContentType = {
    sourceDir: string
    fileExtension: string
    outputFile: string
}
export type GeneralClassType = {
    name: string;
    type: string;
    val: string | number;
    direction?: string[]
    min?: number;
    property: string
    max?: number;
    step?: number;
}
