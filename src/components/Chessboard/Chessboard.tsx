import React, {useRef, useState} from 'react';

import './Chessboard.css'
import Tile from '../Tile';

//Position in array
enum PiecesName {
    White = 0,
    Black = 1,
    WhitePawn = 2,
    WhiteKnight = 3,
    WhiteBishop = 4,
    WhiteRook = 5,
    WhiteQueen = 6,
    WhiteKing = 7,
    BlackPawn = 8,
    BlackKnight = 9,
    BlackBishop = 10,
    BlackRook = 11,
    BlackQueen = 12,
    BlackKing = 13
}
const enumLength = Object.keys(PiecesName).length / 2; // Dividido por 2 porque enums têm chaves e valores

let bitboards: bigint[] = new Array(enumLength).fill(BigInt(0)); 

const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece{
    image: string;
    x: number;
    y: number;
}

const initialBoardState: Piece[] = [];



let pieces: Piece[] = [];

export default function Chessboard() {

    setInitialState();

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    
    function dropPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const positionX = Math.floor((600 - (e.clientX - chessboard.offsetLeft))/75);
            const positionY = Math.floor((600 - (e.clientY - chessboard.offsetTop))/75);
            console.log(positionX, positionY)
            
            setPieces(value => {
                const pieces = value.map((p => {
                    if(p.x === gridX && p.y === gridY){
                        p.x = positionX;
                        p.y = positionY;
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
    // Setting Black pieces
    for (let i = 0; i < 8; i++) {
        // Black Pawns
        initialBoardState.push({ image: "assets/images/b_pawn.png", x: i, y: 6 });
        setBitboard(6, i, PiecesName.Black);
        setBitboard(6, i, PiecesName.BlackPawn);

        // White Pawns
        initialBoardState.push({ image: "assets/images/w_pawn.png", x: i, y: 1 });
        setBitboard(1, i, PiecesName.White);
        setBitboard(1, i, PiecesName.WhitePawn);
    }

    // Black Rooks
    initialBoardState.push({ image: "assets/images/b_rook.png", x: 0, y: 7 });
    setBitboard(7, 0, PiecesName.Black);
    setBitboard(7, 0, PiecesName.BlackRook);

    initialBoardState.push({ image: "assets/images/b_rook.png", x: 7, y: 7 });
    setBitboard(7, 7, PiecesName.Black);
    setBitboard(7, 7, PiecesName.BlackRook);

    // White Rooks
    initialBoardState.push({ image: "assets/images/w_rook.png", x: 0, y: 0 });
    setBitboard(0, 0, PiecesName.White);
    setBitboard(0, 0, PiecesName.WhiteRook);

    initialBoardState.push({ image: "assets/images/w_rook.png", x: 7, y: 0 });
    setBitboard(0, 7, PiecesName.White);
    setBitboard(0, 7, PiecesName.WhiteRook);

    // Black Knights
    initialBoardState.push({ image: "assets/images/b_knight.png", x: 1, y: 7 });
    setBitboard(7, 1, PiecesName.Black);
    setBitboard(7, 1, PiecesName.BlackKnight);

    initialBoardState.push({ image: "assets/images/b_knight.png", x: 6, y: 7 });
    setBitboard(7, 6, PiecesName.Black);
    setBitboard(7, 6, PiecesName.BlackKnight);

    // White Knights
    initialBoardState.push({ image: "assets/images/w_knight.png", x: 1, y: 0 });
    setBitboard(0, 1, PiecesName.White);
    setBitboard(0, 1, PiecesName.WhiteKnight);

    initialBoardState.push({ image: "assets/images/w_knight.png", x: 6, y: 0 });
    setBitboard(0, 6, PiecesName.White);
    setBitboard(0, 6, PiecesName.WhiteKnight);

    // Black Bishops
    initialBoardState.push({ image: "assets/images/b_bishop.png", x: 2, y: 7 });
    setBitboard(7, 2, PiecesName.Black);
    setBitboard(7, 2, PiecesName.BlackBishop);

    initialBoardState.push({ image: "assets/images/b_bishop.png", x: 5, y: 7 });
    setBitboard(7, 5, PiecesName.Black);
    setBitboard(7, 5, PiecesName.BlackBishop);

    // White Bishops
    initialBoardState.push({ image: "assets/images/w_bishop.png", x: 2, y: 0 });
    setBitboard(0, 2, PiecesName.White);
    setBitboard(0, 2, PiecesName.WhiteBishop);

    initialBoardState.push({ image: "assets/images/w_bishop.png", x: 5, y: 0 });
    setBitboard(0, 5, PiecesName.White);
    setBitboard(0, 5, PiecesName.WhiteBishop);

    // Black Queen
    initialBoardState.push({ image: "assets/images/b_queen.png", x: 3, y: 7 });
    setBitboard(7, 3, PiecesName.Black);
    setBitboard(7, 3, PiecesName.BlackQueen);

    // White Queen
    initialBoardState.push({ image: "assets/images/w_queen.png", x: 3, y: 0 });
    setBitboard(0, 3, PiecesName.White);
    setBitboard(0, 3, PiecesName.WhiteQueen);

    // Black King
    initialBoardState.push({ image: "assets/images/b_king.png", x: 4, y: 7 });
    setBitboard(7, 4, PiecesName.Black);
    setBitboard(7, 4, PiecesName.BlackKing);

    // White King
    initialBoardState.push({ image: "assets/images/w_king.png", x: 4, y: 0 });
    setBitboard(0, 4, PiecesName.White);
    setBitboard(0, 4, PiecesName.WhiteKing);
}


function setBitboard(row: number, column: number, piece: PiecesName) {
    let temp: bigint = BigInt(0);
    temp = BigInt(1) << BigInt(8 * row + column);
    bitboards[piece] = bitboards[piece] | temp;
}

function changeBitboard(row: number, column: number, piece: PiecesName){
    let temp: bigint = BigInt(0);
    temp = BigInt(1) << BigInt(8 * row + column);
    bitboards[piece] = bitboards[piece] | temp;
}