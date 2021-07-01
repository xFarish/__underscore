import { Anzen } from '../../types/global';
import { error } from '../utils/error.js';

export function tokenizer(input: string): Array<Anzen.Token> | never {
    const trimmed = input.trim();
    const tokens: Array<Anzen.Token> = [];
    let count = 0;
    
    while (count < trimmed.length) {
        let now = input[count] as string;

        if (isSpace(now)) {
            count += 1;
        }

        else if (isBracket(now)) {
            count += 1;
            tokens.push({ type: 'Brckt', value: now });
        }

        else if (isNumeric(now)) {
            let value = now;
            count += 1;

            if (count < input.length) {
                now = input[count] as string;

                while (isNumeric(now)) {
                    value += now;
                    count += 1;
                    now = input[count] as string;
                }
            }

            tokens.push({ type: 'Num', value });
        }

        else if (isAlphabetic(now) || now === '_') {
            let value = now;
            count += 1;

            if (count < input.length) {
                now = input[count] as string;

                while (isAlphabetic(now) || isNumeric(now) || now === '_') {
                    value += now;
                    count += 1;
                    now = input[count] as string;
                }
            }

            tokens.push({ type: 'Wrd', value });
        }

        else if (isOperator(now)) {
            let value = now;
            count += 1;

            if (count < input.length) {
                now = input[count] as string;

                while (isOperator(now)) {
                    value += now;
                    count += 1;
                    now = input[count] as string;
                }
            }

            tokens.push({ type: 'Op', value });
        }

        else {
            error('INVALID', 'Invalid character: ' + now);
            return process.exit(1);
        }
    }

    return tokens;
}

function isSpace(c: string): boolean {
    return c === ' ' || c === '\n';
}

function isBracket(c: string): boolean {
    return c === '[' || c === ']' || c === '(' || c === ')' || c === '{' || c === '}';
}

function isNumeric(c: string): boolean {
    return c >= '0' && c <= '9';
}

function isAlphabetic(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isOperator(c: string): boolean {
    return (c >= '!' && c <= '~') && (!isBracket(c) && !isAlphabetic(c) && !isNumeric(c));
}