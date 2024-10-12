// From: https://bocoup.com/weblog/2d-picking-in-canvas
let nextCol: number = 1;

export const genColor = (): string => {
    const ret: number[] = [];
    
    // via http://stackoverflow.com/a/15804183
    if (nextCol < 16777215) {
        ret.push(nextCol & 0xff); // R
        ret.push((nextCol & 0xff00) >> 8); // G
        ret.push((nextCol & 0xff0000) >> 16); // B
        nextCol += 1;
    }

    return `rgb(${ret.join(',')})`;
};
