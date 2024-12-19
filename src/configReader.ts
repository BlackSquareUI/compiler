import { readFile } from 'node:fs';
import { promisify } from "node:util"
import { configType } from './types/GeneralClassType';

export const getConfig = async (configFileName: string = "BlackSquareUI.json"): Promise<configType> =>
    JSON.parse(await promisify(readFile)(configFileName, 'utf-8'));

export const fakeConfig = (): configType => {
    return {
        "content": {
            "sourceDir": "src",
            "fileExtension": "tsx",
            "outputFile": "assets/css/index.css"
        },
        "settings": {
            "unit": "rem"
        },
        "screens": [
            {
                "name": "sm",
                "size": "640px"
            }
        ],
        "props": [
            {
                "name": "margin",
                "type": "range",
                "property": "margin",
                "direction": [
                    "",
                    "-top",
                    "-right",
                    "-bottom",
                    "-left"
                ],
                "val": 1,
                "min": 0,
                "max": 3,
                "step": 0.1
            },
            {
                "name": "padding",
                "type": "range",
                "property": "padding",
                "direction": [
                    "",
                    "-top",
                    "-right",
                    "-bottom",
                    "-left"
                ],
                "val": 1,
                "min": 0,
                "max": 3,
                "step": 0.1
            },
            {
                "name": "border-width",
                "type": "range",
                "property": "border-width",
                "direction": [
                    ""
                ],
                "val": 0.1,
                "min": 0,
                "max": 1,
                "step": 0.01
            },
            {
                "name": "border-radius",
                "type": "range",
                "property": "border-radius",
                "direction": [
                    ""
                ],
                "val": 0.1,
                "min": 0,
                "max": 3,
                "step": 0.01
            },
            {
                "name": "background-color-primary",
                "type": "color",
                "property": "background-color",
                "val": "black"
            },
            {
                "name": "background-color-success",
                "type": "color",
                "property": "background-color",
                "val": "blue"
            },
            {
                "name": "background-color-danger",
                "type": "color",
                "property": "background-color",
                "val": "red"
            },
            {
                "name": "border-color",
                "type": "color",
                "property": "border-color",
                "val": "black"
            },
            {
                "name": "text-color-primary",
                "type": "color",
                "property": "color",
                "val": "black"
            },
            {
                "name": "text-color-success",
                "type": "color",
                "property": "color",
                "val": "blue"
            },
            {
                "name": "text-color-danger",
                "type": "color",
                "property": "color",
                "val": "red"
            }
        ]
    }
};
