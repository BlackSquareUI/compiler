# @blacksquareui/compiler

This package simplifies the process of generating CSS files from class definitions.  It leverages class names to create corresponding CSS rules, streamlining your CSS workflow.

## Installation

Install the package using npm or yarn:
```
bash
npm install @blacksquareui/compiler
or
yarn add @blacksquareui/compiler
```

## Development

This project uses TypeScript, Jest for testing, and ESLint for linting.

### Setup

1. Clone the repository: `git clone git+https://github.com/BlackSquareUI/compiler`
2. Install dependencies: `npm install` or `yarn install`

### Scripts

* `npm run test`: Runs the Jest test suite.
* `npm run test:watch`: Runs the Jest test suite in watch mode.
* `npm run test:coverage`: Runs the Jest test suite with coverage reports.
* `npm run start`: Compiles the TypeScript code and starts the application (assuming there's an application).
* `npm run lint`: Runs ESLint to check for code style issues.

### Usage

In BlackSquareUI you have 3 type of classes
 - [oo classes](#oo-classes)
 - [ee classes](#ee-classes)
 - [oe classes](#oe-classes)

For writing styles for different screen size you can use your own or default screen sizes config

```json
 "screens": [
    {
      "name": "sm",
      "size": "640px"
    },
    {
      "name": "lg",
      "size": "1080px"
    }
  ],
```

```

    from .sm:oo-padding-top_2
    to   @media only screen and (max-width: 640px) {.oo-padding-top_2{padding-top:2rem}}

```



# oo classes
    This classes can be edited by client 

    ```css

    .oo-margin {
        margin: var(--oo-margin);
    }

    .oo-margin-top {
        margin-top: var(--oo-margin);
    }

    .oo-margin-top_4 {
        margin-top: calc(var(--oo-margin) * 4);
    }
    ```

# ee classes
    This classes are static

    ```css

    .ee-border-style_solid {
        border-style:solid;
    }

    .ee-padding-top_4 {
        padding-top: 4rem;
    }

    ```

# oe classes
    This classes for handling  state ( not fully finished )

    ```css

    .oe-hover {
        background-color:var(--text-color-primary);
        color:var(--background-color-primary);
    }

    ```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.