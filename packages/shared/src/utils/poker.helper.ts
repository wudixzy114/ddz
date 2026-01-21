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
            if (this.isConsecutive(uniqueRanks)) {
                return {type: CardType.STRAIGHT, value: uniqueRanks[0]};
            }
        }

        if (len >= 6 && len % 2 === 0 && maxRepeat === 2 && uniqueRanks.length === len / 2) {
            if (this.isConsecutive(uniqueRanks)) {
                return {type: CardType.STRAIGHT_PAIR, value: uniqueRanks[0]};
            }
        }

        if (len === 6 && maxRepeat === 4) {
            const mainRank = uniqueRanks.find(r => counts[r] === 4);
            return {type: CardType.QUADPLEX_WITH_SINGLE, value: mainRank!};
        }

        if (len === 8 && maxRepeat === 4 && (uniqueRanks.length == 3 || uniqueRanks.length === 2)) {
            const mainRank = uniqueRanks.find(r => counts[r] === 4);
            const pairs = uniqueRanks.filter(r => counts[r] === 2);
            if (pairs.length === 2 || (uniqueRanks.length === 2 && counts[uniqueRanks.find(r => r !== mainRank)!] === 4)) {
                return {type: CardType.QUADPLEX_WITH_PAIR, value: mainRank!};
            }
        }

        const tripleRanks = uniqueRanks.filter(r => counts[r] >= 3).sort((a, b) => b - a);
        if (tripleRanks.length >= 2) {
            for (let i = 0; i <= tripleRanks.length - 2; i++) {
                for (let j = tripleRanks.length; j >= i + 2; j--) {
                    const subTriples = tripleRanks.slice(i, j);
                    if (this.isConsecutive(subTriples)) {
                        const tripleCount = subTriples.length;
                        if (len === tripleCount * 3) {
                            return {type: CardType.PLANE, value: subTriples[0]};
                        }
                        if (len === tripleCount * 4) {
                            return {type: CardType.PLANE_WITH_SINGLE, value: subTriples[0]};
                        }
                        if (len === tripleCount * 5) {
                            const otherCards = [...uniqueRanks];
                            subTriples.forEach(r => {
                                const idx = otherCards.indexOf(r);
                                otherCards.splice(idx, 1);
                            })

                            const allPairs = otherCards.every(r => counts[r] === 2 || counts[r] === 4);
                            if (allPairs && otherCards.length === tripleCount) {
                                return {type: CardType.PLANE_WITH_PAIR, value: subTriples[0]};
                            }
                        }
                    }
                }
            }
        }

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

    private static isConsecutive(ranks: number[]): boolean {
        for (let i = 0; i < ranks.length - 1; i++) {
            if (ranks[i] !== ranks[i + 1] + 1) return false;
            if (ranks[i] >= Rank.Two || ranks[i + 1] >= Rank.Two) return false;
        }
        return true;
    }
}