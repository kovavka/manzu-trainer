export class TileService {
    static getSvg(value: number) {
        if (value > 0 && value < 10) {
            return `man${value}`
        }
        throw new Error(`${value} is incorrect value for man suit`)
    }
}