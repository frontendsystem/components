const clamp = (value: number, [min, max]: [number, number]) => {
    return Math.min(max, Math.max(min, value));
}

export default clamp;