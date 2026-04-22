import {WaitPatternType} from "../types/WaitPatternType";
import {WaitPattern, WaitStructure, HandStructure} from "../types/HandStructures";

export class TempaiService {
    getWaitStructures(hand: number[], possibleTilesToWait: number[]): WaitStructure[] {
        let allStructures = this.run([], this.getSimpleSuitStructure(hand))
        let possibleHandStructures = this.getPossibleStructures(allStructures)
        console.log(possibleHandStructures)

        let structures: WaitStructure[] = []
        possibleHandStructures.forEach(structure => {
            let waitPatterns: WaitPattern[] = []
            structure.waitPatterns.forEach(waitPattern => {
                let possibleTiles = waitPattern.tilesToComplete.filter(tile => possibleTilesToWait.indexOf(tile) !== -1)
                if (possibleTiles.length) {
                    waitPatterns.push({
                        tiles: waitPattern.tiles,
                        type: waitPattern.type,
                        tilesToComplete: possibleTiles,
                    })
                }
            })

            if (waitPatterns.length) {
                structures.push(<WaitStructure>{
                    sets: structure.sets,
                    waitPatterns: waitPatterns,
                    pair: structure.pair,
                })
            }
        })

        console.log(this.getTilesToComplete(structures))
        return structures
    }

    getTilesToComplete(waitStructures: WaitStructure[]) {
        return  this.selectMany(
            this.selectMany(waitStructures, x => x.waitPatterns),
            x => x.tilesToComplete)
            .filter((value, index, self) => self.indexOf(value) === index)
    }

    private selectMany<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U): U {
        // @ts-ignore
        return array.map(callbackfn).reduce((a, b) => {
            // @ts-ignore
            a.push(...b)
            return a
        }, [])
    }

    private getPossibleStructures(structures: HandStructure[]): HandStructure[] {
        return structures.filter(structure => this.isPossibleWaitPatterns(structure.waitPatterns))
    }

    private isPossibleWaitPatterns(patterns: WaitPattern[]): boolean {
        if (!patterns.length) {
            return true
        }
        if (patterns.length > 2) {
            return false
        }
        if (
            patterns.length === 1 &&
            [WaitPatternType.TANKI, WaitPatternType.KANCHAN, WaitPatternType.RYANMEN_PENCHAN].includes(patterns[0].type)
        ) {
            return true
        }
        if (patterns.length === 2 && patterns.every(pattern => pattern.type === WaitPatternType.SHANPON)) {
            return true
        }
        return false
    }

    private getSimpleSuitStructure(tiles: number[]): HandStructure {
        return <HandStructure>{
            sets: [],
            unusedTiles: [],
            waitPatterns: [],
            pair: undefined,
            remainingTiles: tiles,
        }
    }

    private run(allVariations: HandStructure[], structure: HandStructure, isHonors: boolean = false): HandStructure[] {
        if (structure.remainingTiles.length < 3) {
            structure.unusedTiles = structure.unusedTiles.concat(structure.remainingTiles)
            structure.remainingTiles = []
            // return [structure]
            this.trySetStructure(allVariations, structure, isHonors)
            return allVariations
        }

        let unusedTiles = structure.unusedTiles.slice(0)
        let remainingHand = structure.remainingTiles.slice(0)

        // let childStructures: HandStructure[] = []
        for (let tile of structure.remainingTiles) {
            let sets = this.getSets(tile, remainingHand)
            for (let set of sets) {
                let newStructure = <HandStructure>{
                    sets: structure.sets.length ? structure.sets.concat([set]) : [set],
                    remainingTiles: this.nextTiles(remainingHand, ...set),
                    unusedTiles: unusedTiles.slice(0),
                }
                this.run(allVariations, newStructure, isHonors)
            }
            unusedTiles.push(tile)
            remainingHand = this.nextTiles(remainingHand, tile)
        }

        let parentStructure = <HandStructure>{
            sets: structure.sets,
            remainingTiles: remainingHand,
            unusedTiles: unusedTiles,
        }
        this.trySetStructure(allVariations, parentStructure, isHonors)

        return allVariations
    }

    private trySetStructure(allVariations: HandStructure[], structure: HandStructure, isHonors: boolean) {
        let possibleStructures = allVariations.filter(
            x =>
                x.sets.length === structure.sets.length &&
                x.unusedTiles.join('') === structure.unusedTiles.join('') &&
                x.sets.map(n => n.join('')).join(' ') === structure.sets.map(n => n.join('')).join(' ')
        )

        if (!possibleStructures.length) {
            let data = this.getPairsAndWaitings(structure.unusedTiles, isHonors)
            structure.pair = data.pair
            structure.waitPatterns = data.waitPatterns
            allVariations.push(structure)
        }
    }

    private getPairsAndWaitings(
        unusedTiles: number[],
        isHonors: boolean
    ): {pair: number | undefined; waitPatterns: WaitPattern[]} {
        let allPairs = this.getPairs(unusedTiles)

        let availablePair: number | undefined
        let remainingTiles = unusedTiles.slice(0)

        //if wait pattern is shanpon or hand has too mush pairs or pair and other tiles -> there is no pair, it's waitings
        if (allPairs.length === 1) {
            availablePair = allPairs[0]
            let pairTile = allPairs[0]
            remainingTiles = this.nextTiles(remainingTiles, pairTile, pairTile)
        }
        if (!remainingTiles.length) {
            return {pair: availablePair, waitPatterns: []}
        }

        let waitPatterns: WaitPattern[] = []
        while (remainingTiles.length) {
            let waitPattern = this.getWaitPatternFrom(remainingTiles[0], remainingTiles, isHonors)
            waitPatterns.push(waitPattern)
            remainingTiles = this.nextTiles(remainingTiles, ...waitPattern.tiles)
        }

        //it's impossible hand contains pair and tanki wait
        if (waitPatterns.find(x => x.type === WaitPatternType.TANKI)) {
            availablePair = undefined
            waitPatterns = []
            remainingTiles = unusedTiles.slice(0)
            while (remainingTiles.length) {
                let waitPattern = this.getWaitPatternFrom(remainingTiles[0], remainingTiles, isHonors)
                waitPatterns.push(waitPattern)
                remainingTiles = this.nextTiles(remainingTiles, ...waitPattern.tiles)
            }
        }

        return {pair: availablePair, waitPatterns: waitPatterns}
    }

    private nextTiles(hand: number[], ...tiles: number[]): number[] {
        let str = hand.join('')
        for (let tile of tiles) {
            str = str.replace(tile.toString(), '')
        }
        return str.split('').map(x => Number(x))
    }

    private getSets(tile: number, str: number[]): number[][] {
        let sets: number[][] = []
        let chii = this.getChii(tile, str)
        if (chii) {
            sets.push(chii)
        }

        let pon = this.getPon(tile, str)
        if (pon) {
            sets.push(pon)
        }
        return sets
    }

    private includesFrom(handPart: number[], ...tiles: number[]) {
        let str = handPart.join('')
        for (let tile of tiles) {
            if (!str.includes(tile.toString())) {
                return false
            }

            str = str.replace(tile.toString(), '')
        }
        return true
    }

    private getPairs(handPart: number[]): number[] {
        let unique = handPart.filter((x, i, a) => a.indexOf(x) == i)
        let pairs: number[] = []
        for (let tile of unique) {
            if (this.includesFrom(handPart, tile, tile)) {
                pairs.push(tile)
            }
        }

        return pairs
    }

    private getChii(tile: number, handPart: number[]): number[] | undefined {
        if (tile >= 8) {
            return undefined
        }

        let next1 = tile + 1
        let next2 = tile + 2
        if (this.includesFrom(handPart, tile, next1, next2)) {
            return [tile, next1, next2]
        }

        return undefined
    }

    private getPon(tile: number, handPart: number[]): number[] | undefined {
        if (this.includesFrom(handPart, tile, tile, tile)) {
            return [tile, tile, tile]
        }
        return undefined
    }

    private getWaitPatternFrom(tile: number, handPart: number[], isHonors: boolean): WaitPattern {
        if (this.includesFrom(handPart, tile, tile)) {
            return <WaitPattern>{
                tiles: [tile, tile],
                type: WaitPatternType.SHANPON,
                tilesToComplete: [tile],
            }
        }

        if (tile === 9 || isHonors) {
            //not shanpon => only tanki
            return <WaitPattern>{
                tiles: [tile],
                type: WaitPatternType.TANKI,
                tilesToComplete: [tile],
            }
        }

        let next1 = tile + 1
        if (this.includesFrom(handPart, tile, next1)) {
            return <WaitPattern>{
                tiles: [tile, next1],
                type: WaitPatternType.RYANMEN_PENCHAN,
                tilesToComplete: this.getRyanmenPenchanCompleteTiles(tile),
            }
        }

        if (tile === 8) {
            //not shanpon, ryanmen or penchan => only tanki
            return <WaitPattern>{
                tiles: [tile],
                type: WaitPatternType.TANKI,
                tilesToComplete: [tile],
            }
        }

        let next2 = tile + 2
        if (this.includesFrom(handPart, tile, next2)) {
            return <WaitPattern>{
                tiles: [tile, next2],
                type: WaitPatternType.KANCHAN,
                tilesToComplete: [next1],
            }
        }

        //only tanki
        return <WaitPattern>{
            tiles: [tile],
            type: WaitPatternType.TANKI,
            tilesToComplete: [tile],
        }
    }

    getRyanmenPenchanCompleteTiles(fisrtTile: number): number[] {
        if (fisrtTile === 1) {
            return [3]
        }

        if (fisrtTile === 8) {
            return [7]
        }

        return [fisrtTile - 1, fisrtTile + 2]
    }
}