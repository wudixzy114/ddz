import {ICard} from "../interfaces/core";
import {CardType, Rank, Suit} from "../enums";

export class PokerHelper {
    static createDeck(): ICard[] {
        const deck: ICard[] = [];
        for (let r = 3; r <= 15; r++) {
            for (let s = 1; s <= 4; s++) {
                deck.push({rank: r as Rank, suit: s as Suit})
            }
        }
        deck.push({rank: Rank.SmallJoker, suit: Suit.Spade});
        deck.push({rank: Rank.BigJoker, suit: Suit.Heart});
        return deck;
    }

    static shuffle(deck: ICard[]): ICard[] {
        const newDeck = [...deck];
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
    }

    static sortCards(cards: ICard[]): ICard[] {
        return [...cards].sort((a, b) => {
            if (b.rank !== a.rank) {
                return b.rank - a.rank;
            }
            return b.suit - a.suit;
        })
    }

    static analyzeCardType(cards: ICard[]): { type: CardType; value: number } {
        const len = cards.length;
        if (len === 0) return {type: CardType.INVALID, value: 0};

        const sorted = this.sortCards(cards);

        const counts: Record<number, number> = {}
        sorted.forEach(c => {
            counts[c.rank] = (counts[c.rank] || 0) + 1;
        })

        const uniqueRanks = Object.keys(counts).map(Number);
        const maxRepeat = Math.max(...Object.values(counts));

        if (len === 2 && sorted[0].rank === Rank.BigJoker && sorted[1].rank === Rank.SmallJoker) {
            return {type: CardType.ROCKET, value: 999}
        }

        if (len === 4 && maxRepeat === 4) {
            return {type: CardType.BOMB, value: sorted[0].rank}
        }

        if (len === 1) {
            return {type: CardType.SINGLE, value: sorted[0].rank};
        }

        if (len === 2 && maxRepeat === 2) {
            return {type: CardType.PAIR, value: sorted[0].rank};
        }

        if (len === 3 && maxRepeat === 3) {
            return {type: CardType.TRIPLE, value: sorted[0].rank};
        }

        if (len === 4 && maxRepeat === 3) {
            const mainRank = uniqueRanks.find(r => counts[r] === 3);
            return {type: CardType.TRIPLE_WITH_ONE, value: mainRank!}
        }

        if (len === 5 && maxRepeat === 3 && uniqueRanks.length === 2) {
            const mainRank = uniqueRanks.find(r => counts[r] === 3);
            return {type: CardType.TRIPLE_WITH_PAIR, value: mainRank!};
        }

        if (len >= 5 && maxRepeat === 1) {
            const hasSpecial = sorted.some(c => c.rank >= Rank.Two);
            if (!hasSpecial) {
                let isStraight = true;
                for (let i = 0; i < len - 1; i++) {
                    if (sorted[i].rank !== sorted[i + 1].rank + 1) {
                        isStraight = false;
                        break;
                    }
                }
                if (isStraight) {
                    return {type: CardType.STRAIGHT, value: sorted[0].rank};
                }
            }
        }

        // TODO

        return {type: CardType.INVALID, value: 0};
    }

    static canBeat(prevCards: ICard[], newCards: ICard[]): boolean {
        const prev = this.analyzeCardType(prevCards);
        const curr = this.analyzeCardType(newCards);

        if (curr.type === CardType.INVALID) return false;
        if (curr.type === CardType.ROCKET) return true;
        if (prev.type === CardType.ROCKET) return false;

        if (curr.type === CardType.BOMB) {
            if (prev.type !== CardType.BOMB) return true;
            return curr.value > prev.value;
        }

        if (curr.type === prev.type && newCards.length === prevCards.length) {
            return curr.value > prev.value;
        }

        return false;
    }
}