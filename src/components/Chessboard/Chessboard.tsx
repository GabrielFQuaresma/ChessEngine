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
const enumLength = Object.keys(PiecesName).length / 2; // Dividido por 2 porque enums têm chaves e valores

let bitboards: bigint[] = new Array(enumLength).fill(BigInt(0)); 

let initialState: boolean = true;

const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

// interface Piece{
//     image: string;
//     x: number;
//     y: number;
// }

const initialBoardState: PieceType[] = [];


let pieces: PieceType[] = [];

export default function Chessboard() {
    
    if(initialState){
        setInitialState();
        initialState = false;
    }

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<PieceType[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    
    function dropPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const positionX = Math.floor((600 - (e.clientX - chessboard.offsetLeft))/75);
            const positionY = Math.floor((600 - (e.clientY - chessboard.offsetTop))/75);
            console.log(positionX, positionY)
            
            setPieces(value => {
                const board: bigint = bitboards[PiecesName.White] | bitboards[PiecesName.Black];
                const pieces = value.map((p => {
                    if(p.x === gridX && p.y === gridY){
                        if(p.isValidMove(positionX, positionY, board)) {
                            changebitboard(positionX, positionY, p)
                            p.x = positionX;
                            p.y = positionY;
                        }else{
                            activePiece.style.position = 'relative';
                            activePiece.style.removeProperty('top');
                            activePiece.style.removeProperty('left')
                        }
                    }
                    return p;
                }))
                return pieces;
            })
            setActivePiece(null);
        } 
    }

    function movePiece(e: React.MouseEvent){
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
            setGridX(Math.floor((600 - (e.clientX - chessboard.offsetLeft))/75));
            setGridY(Math.floor((600 - (e.clientY - chessboard.offsetTop))/75));

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
        <div 
            onMouseMove={e => movePiece(e)} 
            onMouseDown={e => grabPiece(e)}
            onMouseUp={e => dropPiece(e)}
            id="chessboard"
            ref = {chessboardRef}
            >
             {board}
        
        </div>);

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

function tileIsEmpty(row: number, column: number){
    const board: bigint = bitboards[PiecesName.White] | bitboards[PiecesName.Black];
    const temp: bigint = BigInt(1) << BigInt(8 * row + column); 
    
    const value: bigint = board & temp;

    return (value === BigInt(0)) ? true : false;
}

function setBitboard(row: number, column: number, pieceName: PiecesName) {
    let temp: bigint = BigInt(1) << BigInt(8 * row + column);
    bitboards[pieceName] = bitboards[pieceName] | temp;
}

function changebitboard(row: number, column: number, piece: PieceType) {
    const fullBoardMask: bigint = (BigInt(1) << BigInt(64)) - BigInt(1); // Máscara de 64 bits
    const newposition: bigint = BigInt(1) << BigInt(8 * row + column); 
    const oldposition: bigint = ~(BigInt(1) << BigInt(8 * piece.y + piece.x)) & fullBoardMask; 
    
    // console.log("newPosition: " + newposition.toString(2).padStart(64, '0'));
    // console.log("oldPosition: " + oldposition.toString(2).padStart(64, '0'));
    
    // Atualizar bitboards
    bitboards[piece.type] = (bitboards[piece.type] | newposition) & oldposition;
    // console.log("bitboards[piece.type]: " + bitboards[piece.type].toString(2));
    
    bitboards[piece.color] = (bitboards[piece.color] | newposition) & oldposition;
    // console.log("bitboards[piece.color]: " + bitboards[piece.color].toString(2));
}
