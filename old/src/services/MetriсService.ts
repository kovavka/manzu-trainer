declare var ym: any

export class MetricService {
    static send(eventName: string) {
        ym(56442517, 'reachGoal', eventName)
    }

    static newGame() {
        this.send('NEW_GAME')
    }

    static selectLength(value: number) {
        ym(56442517, 'reachGoal', 'SELECT_LENGTH', {value: value})
    }
}