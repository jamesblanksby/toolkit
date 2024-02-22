function isIterable(value) {
    if (!value || typeof value === 'string') {
        return false;
    }

    return typeof value[Symbol.asyncIterator] === 'function'
        || typeof value[Symbol.iterator] === 'function';
}

async function* flatten(input) {
    input = await input;
    if (!input) {
        return;
    }

    if (isIterable(input)) {
        for await (const entry of input) {
            yield* flatten(entry);
        }
    } else {
        yield input;
    }
}

async function* unique(input) {
    const known = new Set();

    for await (const entry of flatten(input)) {
        if (!known.has(entry)) {
            known.add(entry);
            yield entry;
        }
    }
}

export {
    flatten,
    unique,
};
