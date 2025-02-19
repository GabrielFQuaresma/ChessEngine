import React, {useRef, useState} from 'react';
import { PieceType } from '../../pieces/PieceType';

import './Chessboard.css'
import Tile from '../Tile';
import Pawn from '../../pieces/Pawn';
import Rook from '../../pieces/Rook';
import Queen from '../../pieces/Queen';
import King from '../../pieces/King';
import Knight from '../../pieces/Knight';
import Bishop from '../../pieces/Bishop';

import State from '../../auxiliar/State';


const CHESSBOARD_SIZE = 560;
const TILE_SIZE = CHESSBOARD_SIZE / 8;



export enum colors{
    white,
    black
}

//Position in array
export enum PiecesName {
    White,
    Black,
    WhitePawn,
    WhiteKnight,
    WhiteBishop,
    WhiteRook,
    WhiteQueen,
    WhiteKing,
    BlackPawn,
    BlackKnight,
    BlackBishop ,
    BlackRook ,
    BlackQueen ,
    BlackKing
}

export const pieceValues: Record<PiecesName, number> = {
    [PiecesName.White]: 0,
    [PiecesName.Black]: 0,
    [PiecesName.WhitePawn]: 1,
    [PiecesName.WhiteKnight]: 3,
    [PiecesName.WhiteBishop]: 3,
    [PiecesName.WhiteRook]: 5,
    [PiecesName.WhiteQueen]: 9,
    [PiecesName.WhiteKing]: Infinity, // O Rei geralmente não tem valor numérico
    [PiecesName.BlackPawn]: 1,
    [PiecesName.BlackKnight]: 3,
    [PiecesName.BlackBishop]: 3,
    [PiecesName.BlackRook]: 5,
    [PiecesName.BlackQueen]: 9,
    [PiecesName.BlackKing]: Infinity, // O Rei geralmente não tem valor numérico
};

let WhitePoints: number = 0;
let BlackPoints: number = 0;

let Diff: number = Math.abs(WhitePoints - BlackPoints);


const enumLength = Object.keys(PiecesName).length / 2; // Dividido por 2 porque enums têm chaves e valores

let bitboards: bigint[] = new Array(enumLength).fill(BigInt(0)); 

let initialState: boolean = true;

const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

const initialBoardState: PieceType[] = [];
    
let pieces: PieceType[] = [];
let currentState: State;

export default function Chessboard() {
    
    if(initialState){
        setInitialState();
        initialState = false;
        currentState = new State(colors.white, bitboards);
    }

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<PieceType[]>(initialBoardState);

    const [whiteCaptures, setWhiteCaptures] = useState<PieceType[]>([]);
    const [blackCaptures, setBlackCaptures] = useState<PieceType[]>([]);

    // Compute point totals from captured pieces using pieceValues mapping
    const whiteCapturedValue = whiteCaptures.reduce((acc, piece) => acc + pieceValues[piece.type], 0);
    const blackCapturedValue = blackCaptures.reduce((acc, piece) => acc + pieceValues[piece.type], 0);
    const diff = Math.abs(whiteCapturedValue - blackCapturedValue);

    const chessboardRef = useRef<HTMLDivElement>(null);
    
    function updatePiecesPosition(
        oldPieces: PieceType[],
        currentPiece: PieceType,
        newX: number,
        newY: number,
        attackedPiece?: PieceType
    ): PieceType[] {
        return oldPieces
            .map(piece => {
                if (piece === currentPiece) {
                    piece.x = newX;
                    piece.y = newY;
                    return piece;
                }
                if (attackedPiece && piece === attackedPiece) return undefined;
                return piece;
            })
            .filter((p): p is PieceType => p != null);
    }

    // function removePieceFromBitboard(piece: PieceType) {
    //     const positionMask = BigInt(1) << BigInt(8 * piece.y + piece.x);
    //     bitboards[piece.color] &= ~positionMask;
    //     bitboards[piece.type] &= ~positionMask;
    // }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const newX = Math.floor((CHESSBOARD_SIZE - (e.clientX - chessboard.offsetLeft)) / TILE_SIZE);
            const newY = Math.floor((CHESSBOARD_SIZE - (e.clientY - chessboard.offsetTop)) / TILE_SIZE);
    
            const currentPiece = pieces.find((p) => p.x === gridX && p.y === gridY);
            let attackedPiece = pieces.find((p) => p.x === newX && p.y === newY);
    
            if (currentPiece) {
                const validMove = currentPiece.isValidMove(newX, newY, currentState);
    
                // En passant logic if needed...
                if(!attackedPiece && currentPiece.isAnAttack(newX, newY, currentState)){
                    const colorDiff = (currentPiece.getEnemyColor() === PiecesName.White) ? 1 : -1;
                    attackedPiece = pieces.find((p) => p.x === newX && p.y === newY + colorDiff);
                }
                
                const isFriendlyFire : Boolean = currentPiece.color === attackedPiece?.color;
                if (validMove && !isFriendlyFire) {
                    // For castling, additional logic can update the rook position.
                    if (currentPiece instanceof King && Math.abs(newX - currentPiece.x) === 2) {
                        const rookX = (newX === 2) ? 0 : 7;
                        const newRookX = (newX === 2) ? 3 : 5;
                        const rook = pieces.find((p) => p.x === rookX && p.y === currentPiece.y);
                        if (rook) {
                            changebitboard(newRookX, currentPiece.y, rook);
                            // currentState.movePiece(rook, newRookX, currentPiece.y);
                            rook.x = newRookX;
                        }
                    }
                    
                    // If a piece is captured, update captured pieces arrays.
                    if (attackedPiece) {
                        currentState.removePiece(attackedPiece);
                        
                        if (currentPiece.color === PiecesName.White) {
                            setWhiteCaptures(prev =>
                                attackedPiece ? [...prev, attackedPiece] : prev
                            );
                        } else {
                            setBlackCaptures(prev =>
                                attackedPiece ? [...prev, attackedPiece] : prev
                            );
                        }
                    }
                    // Update the pieces variable in one call.
                    setPieces(prev => updatePiecesPosition(prev, currentPiece, newX, newY, attackedPiece));
                    // Change the turn after a valid move.
                    currentState.movePiece(currentPiece, newX, newY);
                } else {
                    if (activePiece) {
                        activePiece.style.position = 'relative';
                        activePiece.style.removeProperty('top');
                        activePiece.style.removeProperty('left');
                    }
                }
            }
            setActivePiece(null);
        }
    }

    
    function movePiece(e: React.MouseEvent){
        if(!activePiece) return;
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const minX = chessboard.offsetLeft - 20;
            const minY = chessboard.offsetTop - 20;

            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
            const maxY = chessboard.offsetTop + chessboard.clientHeight  - 50;

            const x = e.clientX - 30;
            const y = e.clientY - 30;
            
            activePiece.style.position = "absolute";

            if(x < minX) activePiece.style.left = `${minX}px`;
            else if (x > maxX) activePiece.style.left = `${maxX}px`;
            else activePiece.style.left = `${x}px`;
            
            if(y < minY) activePiece.style.top = `${minY}px`;
            else if (y > maxY) activePiece.style.top = `${maxY}px`;
            else activePiece.style.top = `${y}px`;
        

            
        }
    }
    

    function grabPiece(e: React.MouseEvent){
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(element.classList.contains("chess-piece") && chessboard){
            setGridX(Math.floor((CHESSBOARD_SIZE - (e.clientX - chessboard.offsetLeft))/TILE_SIZE));
            setGridY(Math.floor((CHESSBOARD_SIZE - (e.clientY - chessboard.offsetTop))/TILE_SIZE));

            const x = e.clientX - 30;
            const y = e.clientY - 30;


            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }


    let board = [];

   

    for (let i = verticalAxis.length - 1; i >= 0; i--){
        for (let j = horizontalAxis.length - 1; j >= 0; j--) {
            const coordinate = j + i;
            let image = undefined;
            
            pieces.forEach(p => {
                if(p.x === j && p.y === i){
                    image = p.image
                }
            });

            board.push(<Tile key={`${j},${i}`} coordinate={coordinate} image={image} />)
        }
    }
    return (
        <>

            <div className="captured-pieces-container">
                <div className="captured-pieces black-captured">
                    {blackCaptures.map((piece, index) => (
                        <img key={index} src={piece.image} alt="Captured black piece" />
                    ))}
                </div>
            </div>
            <div
                onMouseMove={movePiece}
                onMouseDown={grabPiece}
                onMouseUp={dropPiece}
                id="chessboard"
                ref={chessboardRef}
            >
                {board}
            </div>
            <div className="captured-pieces-container">
                <div className="captured-pieces white-captured">
                    {whiteCaptures.map((piece, index) => (
                        <img key={index} src={piece.image} alt="Captured white piece" />
                    ))}
                </div>
            </div>
        </>
    );
    

}



export function setInitialState() {
    
    // Setting Black and White Pawns
    for (let i = 0; i < 8; i++) {
        // Black Pawns
        let pawn: Pawn = new Pawn(i, 6, "assets/images/b_pawn.png", PiecesName.Black, PiecesName.BlackPawn);
        initialBoardState.push(pawn);
        setBitboard(6, i, PiecesName.Black);
        setBitboard(6, i, PiecesName.BlackPawn);
        
        // White Pawns
        pawn = new Pawn(i, 1, "assets/images/w_pawn.png", PiecesName.White, PiecesName.WhitePawn);
        initialBoardState.push(pawn);
        setBitboard(1, i, PiecesName.White);
        setBitboard(1, i, PiecesName.WhitePawn);
    }

    // Setting Rooks
    let rook: Rook = new Rook(0, 7, "assets/images/b_rook.png", PiecesName.Black, PiecesName.BlackRook);
    initialBoardState.push(rook);
    setBitboard(7, 0, PiecesName.Black);
    setBitboard(7, 0, PiecesName.BlackRook);

    rook = new Rook(7, 7, "assets/images/b_rook.png", PiecesName.Black, PiecesName.BlackRook);
    initialBoardState.push(rook);
    setBitboard(7, 7, PiecesName.Black);
    setBitboard(7, 7, PiecesName.BlackRook);

    rook = new Rook(0, 0, "assets/images/w_rook.png", PiecesName.White, PiecesName.WhiteRook);
    initialBoardState.push(rook);
    setBitboard(0, 0, PiecesName.White);
    setBitboard(0, 0, PiecesName.WhiteRook);

    rook = new Rook(7, 0, "assets/images/w_rook.png", PiecesName.White, PiecesName.WhiteRook);
    initialBoardState.push(rook);
    setBitboard(0, 7, PiecesName.White);
    setBitboard(0, 7, PiecesName.WhiteRook);

    // Setting Knights
    let knight: Knight = new Knight(1, 7, "assets/images/b_knight.png", PiecesName.Black, PiecesName.BlackKnight);
    initialBoardState.push(knight);
    setBitboard(7, 1, PiecesName.Black);
    setBitboard(7, 1, PiecesName.BlackKnight);

    knight = new Knight(6, 7, "assets/images/b_knight.png", PiecesName.Black, PiecesName.BlackKnight);
    initialBoardState.push(knight);
    setBitboard(7, 6, PiecesName.Black);
    setBitboard(7, 6, PiecesName.BlackKnight);

    knight = new Knight(1, 0, "assets/images/w_knight.png", PiecesName.White, PiecesName.WhiteKnight);
    initialBoardState.push(knight);
    setBitboard(0, 1, PiecesName.White);
    setBitboard(0, 1, PiecesName.WhiteKnight);

    knight = new Knight(6, 0, "assets/images/w_knight.png", PiecesName.White, PiecesName.WhiteKnight);
    initialBoardState.push(knight);
    setBitboard(0, 6, PiecesName.White);
    setBitboard(0, 6, PiecesName.WhiteKnight);

    // Setting Bishops
    let bishop: Bishop = new Bishop(2, 7, "assets/images/b_bishop.png", PiecesName.Black, PiecesName.BlackBishop);
    initialBoardState.push(bishop);
    setBitboard(7, 2, PiecesName.Black);
    setBitboard(7, 2, PiecesName.BlackBishop);

    bishop = new Bishop(5, 7, "assets/images/b_bishop.png", PiecesName.Black, PiecesName.BlackBishop);
    initialBoardState.push(bishop);
    setBitboard(7, 5, PiecesName.Black);
    setBitboard(7, 5, PiecesName.BlackBishop);

    bishop = new Bishop(2, 0, "assets/images/w_bishop.png", PiecesName.White, PiecesName.WhiteBishop);
    initialBoardState.push(bishop);
    setBitboard(0, 2, PiecesName.White);
    setBitboard(0, 2, PiecesName.WhiteBishop);

    bishop = new Bishop(5, 0, "assets/images/w_bishop.png", PiecesName.White, PiecesName.WhiteBishop);
    initialBoardState.push(bishop);
    setBitboard(0, 5, PiecesName.White);
    setBitboard(0, 5, PiecesName.WhiteBishop);

    // Setting Queens
    let queen: Queen = new Queen(3, 7, "assets/images/b_queen.png", PiecesName.Black, PiecesName.BlackQueen);
    initialBoardState.push(queen);
    setBitboard(7, 3, PiecesName.Black);
    setBitboard(7, 3, PiecesName.BlackQueen);

    queen = new Queen(3, 0, "assets/images/w_queen.png", PiecesName.White, PiecesName.WhiteQueen);
    initialBoardState.push(queen);
    setBitboard(0, 3, PiecesName.White);
    setBitboard(0, 3, PiecesName.WhiteQueen);

    // Setting Kings
    let king: King = new King(4, 7, "assets/images/b_king.png", PiecesName.Black, PiecesName.BlackKing);
    initialBoardState.push(king);
    setBitboard(7, 4, PiecesName.Black);
    setBitboard(7, 4, PiecesName.BlackKing);

    king = new King(4, 0, "assets/images/w_king.png", PiecesName.White, PiecesName.WhiteKing);
    initialBoardState.push(king);
    setBitboard(0, 4, PiecesName.White);
    setBitboard(0, 4, PiecesName.WhiteKing);

}

function setBitboard(row: number, column: number, pieceName: PiecesName) {
    let temp: bigint = BigInt(1) << BigInt(8 * row + column);
    bitboards[pieceName] = bitboards[pieceName] | temp;
}

function changebitboard(row: number, column: number, piece: PieceType) {
    const fullBoardMask: bigint = (BigInt(1) << BigInt(64)) - BigInt(1); // Máscara de 64 bits
    const newposition: bigint = BigInt(1) << BigInt(8 * column + row); 
    const oldposition: bigint = ~(BigInt(1) << BigInt(8 * piece.y + piece.x)) & fullBoardMask; 


    // Atualizar bitboards
    bitboards[piece.type] = (bitboards[piece.type] | newposition) & oldposition;
    console.log("bitboards[piece.type]: " + bitboards[piece.type].toString(2).padStart(64));
    
    bitboards[piece.color] = (bitboards[piece.color] | newposition) & oldposition;
    console.log("bitboards[piece.color]: " + bitboards[piece.color].toString(2).padStart(64));
}

function stringToBoardMatrix(bitString:string) {
    // Garantir que a string tenha 64 bits, preenchendo com zeros à esquerda, se necessário
    const fullBitString = bitString.padStart(64, '0');
    const matrix = [];
    
    // Dividir a string em blocos de 8 bits para formar as linhas
    for (let i = 0; i < 64; i += 8) {
        const row = fullBitString.slice(i, i + 8).split('').map(Number); // Converter cada linha para um array de números
        matrix.push(row);
    }
    
    return matrix;
}
