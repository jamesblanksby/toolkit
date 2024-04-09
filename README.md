# 🧰 Toolkit

> A versatile task automation tool that enables you to define and execute various tasks using a configuration file.

## Getting Started

### Install

```shell
$ npm install @jamesblanksby/toolkit
```

### Usage

```js
import Toolkit from 'toolkit';

// Initialise Toolkit
const toolkit = new Toolkit();

// Load task config file
await toolkit.load('/path/to/config.js');

// Run provided tasks
const tasks = [
    'task1',
    'task2',
    ...
];
await toolkit.run(tasks);
```

## API

### Toolkit

#### `load(config)`

Load a configuration file by the provided path and initalise a set of tasks based on the functions found in the loaded module.

**Parameters:**
- `config` (String): The path to the configuration file.

#### `run(tasks...)`

Execute a list of tasks based on their names provided in the tasks parameter.

**Parameters:**
- `tasks` (Array of Strings): An array containing the names of tasks to be executed.

#### `hasFlag(name)`

Check whether a specific flag is present in the set of flags stored within the instance.

**Parameters:**
- `name` (String): The name of the flag to check.

#### `getFlag(name)`

This method retrieves the value associated with a specific flag from the set of flags stored within the instance.

**Parameters:**
- `name` (String): The name of the flag to retrieve.

#### `getTasks()`

Retrieve a map of tasks stored within the instance.

#### `parallel(tasks...)`

Executes a set of tasks simultaneously.

**Parameters:**
- `...tasks` (`Tasks`): A set of tasks to be executed in simultaneously.

#### `series(tasks...)`

Execute a series of tasks sequentially.

**Parameters:**
- `...tasks` (`Tasks`): A set of tasks to be executed sequentially.

#### `src(patterns, [options])`

Creates a `Files` object based on file patterns.

**Parameters:**
- `patterns` (String or Array of Strings): File glob patterns to match files.
- `options` (Object): Additional options for file globbing and matching.

#### `watch(pattern, tasks)`

Watch files from a pattern and trigger a set of tasks in parallel whenever a change event is detected.

**Parameters:**
- `pattern` (String): The file glob pattern to watch for changes.
- `tasks` (`Tasks`): A set of tasks to be executed when a change is detected.

### Files

#### `pipe(hander, args...)`

Create a new instance of a `Files` object by applying a handler function to the current instance.

**Parameters:**
- `handler` (Function): The handler function to be applied to the current instance.
- `...args` (Any): Additional arguments to be passed to the handler function.

#### `dest(files, [directory])`

Write files to a directory (or the same path if not provided).

**Parameters:**
- `files` (`Files` Object): Files to be written.
- `directory` (String, *optional*): The destination directory to write the files. If not provided, files will be written to their original paths.

#### `rm(files)`

Removes files and recursively removes empty parent directories.

**Parameters:**
- `files` (`Files` Object): Files to be removed.

#### `rename(files, target)`

Renames files based on the provided target path or a custom function.

**Parameters:**
- `files` (`Files` Object): An async generator yielding instances of files to be renamed.
- `target` (String or Function): The target path or a function to generate the new path for each file.

### File

#### `read()`

Reads the content of the file and returns a new instance of `MemoryFile` with the same path and the read buffer.

## CLI

### Usage

```shell
$ npm toolkit [tasks] [options]
```

> [!NOTE]
> This package ships with a [default set of tasks](./toolkit.config.js), covering a range of common use cases. You can manually specify a different configuration file using the `--config` option.

#### Options

* `--help`, `-h`: Show help and exit.
* `--config`: Manually set the path of the config file.
* `--tasks`, `-t`: Print the tasks from the loaded config and exit.
* `--quiet`: Minimize logging.
* `--silent`: Suppress all non-essential logging.

#### Examples

```shell
# Show help
$ npm toolkit --help

# Run default tasks
$ npm toolkit

# Run specific tasks
$ npm toolkit task1 task2

# Set a custom config file path
$ npm toolkit --config /path/to/config.js

# Print tasks from the loaded config
$ npm toolkit --tasks
```
