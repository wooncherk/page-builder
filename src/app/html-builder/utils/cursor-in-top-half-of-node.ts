export function cursorInTopHalfOfNode(node: HTMLElement, y: number) {
    const rect = node.getBoundingClientRect();
    const offset = rect.top;
    const height = rect.height;
    const loc = Math.abs(offset - y);
    return loc < height / 2;
}
