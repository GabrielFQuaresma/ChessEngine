import { colors, PiecesName } from "../components/Chessboard/Chessboard";
import { PieceType } from "../pieces/PieceType";
import Pawn from "../pieces/Pawn";
import Rook from "../pieces/Rook";
import Knight from "../pieces/Knight";
import Bishop from "../pieces/Bishop";
import Queen from "../pieces/Queen";
import King from "../pieces/King";

export default class State {
    boards: bigint[];
    currentTurn: colors;

    constructor(initialTurn: colors, boards: bigint[]) {
        this.boards = boards;
        this.currentTurn = initialTurn;
    }

    changeTurn() {
        this.currentTurn = (this.currentTurn === colors.white) ? colors.black : colors.white;
    }

    changeState(currentBoard: bigint[]) {
        this.currentTurn = (this.currentTurn === colors.white) ? colors.black : colors.white;
        this.boards = currentBoard;
    }

    getBoard(): bigint {
        return this.boards[PiecesName.White] | this.boards[PiecesName.Black];
    }

    private mapPieceColorToTurn(pieceColor: PiecesName): colors | null {
        if (pieceColor === PiecesName.White) return colors.white;
        if (pieceColor === PiecesName.Black) return colors.black;
        return null; // Handle unexpected cases if necessary
    }

    isYourTurn(pieceColor: PiecesName): boolean {
        const mappedColor = this.mapPieceColorToTurn(pieceColor);
        if (mappedColor === null) {
            throw new Error(`Invalid piece color: ${pieceColor}`);
        }
        return this.currentTurn === mappedColor;
    }

    getPieceAtPosition(x: number, y: number): PieceType | null {
        for (const piece of this.getAllPieces()) {
            if (piece.x === x && piece.y === y) {
                return piece;
            }
        }
        return null;
    }

    getAllPieces(): PieceType[] {
        const pieces: PieceType[] = [];
        const pieceTypes = [
            { type: PiecesName.WhitePawn, class: Pawn },
            { type: PiecesName.BlackPawn, class: Pawn },
            { type: PiecesName.WhiteRook, class: Rook },
            { type: PiecesName.BlackRook, class: Rook },
            { type: PiecesName.WhiteKnight, class: Knight },
            { type: PiecesName.BlackKnight, class: Knight },
            { type: PiecesName.WhiteBishop, class: Bishop },
            { type: PiecesName.BlackBishop, class: Bishop },
            { type: PiecesName.WhiteQueen, class: Queen },
            { type: PiecesName.BlackQueen, class: Queen },
            { type: PiecesName.WhiteKing, class: King },
            { type: PiecesName.BlackKing, class: King },
        ];

        for (const { type, class: PieceClass } of pieceTypes) {
            const bitboard = this.boards[type];
            for (let i = 0; i < 64; i++) {
                if ((bitboard & (BigInt(1) << BigInt(i))) !== BigInt(0)) {
                    const x = i % 8;
                    const y = Math.floor(i / 8);
                    const color = type < PiecesName.BlackPawn ? PiecesName.White : PiecesName.Black;
                    const image = `assets/images/${color === PiecesName.White ? 'w' : 'b'}_${PieceClass.name.toLowerCase()}.png`;
                    pieces.push(new PieceClass(x, y, image, color, type));
                }
            }
        }

        return pieces;
    }

    movePiece(piece: PieceType, newX: number, newY: number): void {
        const oldPosition = BigInt(1) << BigInt(8 * piece.y + piece.x);
        const newPosition = BigInt(1) << BigInt(8 * newY + newX);

        // Update the bitboards
        this.boards[piece.type] = (this.boards[piece.type] & ~oldPosition) | newPosition;
        this.boards[piece.color] = (this.boards[piece.color] & ~oldPosition) | newPosition;

        // Update the piece's coordinates
        piece.x = newX;
        piece.y = newY;
    }
}