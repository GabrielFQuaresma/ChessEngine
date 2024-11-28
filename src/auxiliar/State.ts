import { colors } from "../components/Chessboard/Chessboard";
import { PiecesName } from "../components/Chessboard/Chessboard";

export default class State{
    boards: bigint[];
    currentTurn: colors;

    constructor(initialTurn: colors, boards: bigint[]) {
        this.boards = boards;
        this.currentTurn = initialTurn;
    }

    changeTurn(){
        this.currentTurn = (this.currentTurn === colors.white) ? colors.black : colors.white;
    }


    changeState(currentBoard: bigint[]){
        this.currentTurn = (this.currentTurn === colors.white) ? colors.black : colors.white;

    }

    getBoard(): bigint{
        return this.boards[PiecesName.White] | this.boards[PiecesName.Black];
    }
}