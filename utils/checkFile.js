function getType(filename) {
    var parts = filename.split(':');
    return parts[1];
}

export function isImage(filename) {
    const type = getType(filename);
    return type.includes('image');
}