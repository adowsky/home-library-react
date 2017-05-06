function parseQueryParams(query) {
    if (!query) {
        return {};
    }
    if (query[0] === '?')
        query = query.substr(1);
    const entries = query.split("&");
    return entries.reduce((total, entry) => {
        const keyValue = entry.split("=");
        total[keyValue[0]] = keyValue[1];
        return total;
    }, {});
}

export {
    parseQueryParams
}
