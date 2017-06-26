type PieceLocation = { x: number, y: number };

class Move {
    constructor(public pieceId: number, public i: number, public j: number) { }
}

abstract class Piece {

    public id: number;
    public type: PieceTypes;
    private static currentId: number = 0;

    constructor(public name: string, public owner?: number) {
        this.id = Piece.currentId;
        Piece.currentId++;
    }
}

enum PieceTypes { None, Pawn, Rook, Knight, Bishop, Queen, King }

class BoardMoveManager {

    private static horizontalPossibleMoves(piece: Piece, board: Board, location: PieceLocation) {
        let moves: Move[] = [];

        for (let i = location.x + 1; i < 8; i++) {
            if (board.pieces[i][location.y] instanceof None) {
                moves.push(new Move(piece.id, i, location.y));
            }
            else
                break;
        }

        for (let i = location.x - 1; i >= 0; i--) {
            if (board.pieces[i][location.y] instanceof None) {
                moves.push(new Move(piece.id, i, location.y));
            }
            else
                break;
        }

        for (let i = location.y + 1; i < 8; i++) {
            if (board.pieces[location.x][i] instanceof None) {
                moves.push(new Move(piece.id, location.x, i));
            }
            else
                break;
        }

        for (let i = location.y - 1; i > 0; i--) {
            if (board.pieces[location.x][i] instanceof None) {
                moves.push(new Move(piece.id, location.x, i));
            }
            else
                break;
        }

        return moves;
    }

    private static diagonalPossibleMoves(piece: Piece, board: Board, location: PieceLocation) {
        let moves: Move[] = [];

        for (let i = location.x + 1, j = location.y + 1; i < 8 && j < 8; i++ , j++) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }

        for (let i = location.x + 1, j = location.y - 1; i < 8 && j >= 0; i++ , j--) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }

        for (let i = location.x - 1, j = location.y + 1; i >= 0 && j < 8; i-- , j++) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }

        for (let i = location.x - 1, j = location.y - 1; i >= 0 && j >= 0; i-- , j--) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }
        return moves;
    }

    private static kingPossibleMoves(piece: Piece, board: Board, location: PieceLocation) {
        let moves: Move[] = [];

        let availableMoves = [[0, 1], [1, 0], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]];

        for (let move of availableMoves) {
            if (location.x + move[0] < 8 && location.y + move[1] < 8 && location.x + move[0] >= 0 && location.y + move[1] >= 0)
                moves.push(new Move(piece.id, location.x + move[0], location.y + move[1]));
        }

        return moves;
    }

    private static pawnPossibleMoves(piece: Piece, board: Board, location: PieceLocation) {
        if (piece.owner == undefined)
            return [];
        if (piece.owner == 0 && location.x < 7)
            return [new Move(piece.id, location.x + 1, location.y)];
        if (piece.owner == 1 && location.x > 0)
            return [new Move(piece.id, location.x - 1, location.y)];
    }

    private static knightPossibleMoves(piece: Piece, board: Board, location: PieceLocation) {
        let moves: Move[] = [];

        let availableMoves = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]];

        for (let move of availableMoves) {
            if (location.x + move[0] < 8 && location.y + move[1] < 8 && location.x + move[0] >= 0 && location.y + move[1] >= 0)
                moves.push(new Move(piece.id, location.x + move[0], location.y + move[1]));
        }

        return moves;
    }

    public static possibleMoveList(piece: Piece, board: Board, location: PieceLocation): Move[] {
        let moves: Move[] = [];

        if (piece instanceof Pawn) {
            moves = BoardMoveManager.pawnPossibleMoves(piece, board, location);
        }
        if (piece instanceof Knight) {
            moves = BoardMoveManager.knightPossibleMoves(piece, board, location);
        }
        if (piece instanceof King) {
            moves = BoardMoveManager.kingPossibleMoves(piece, board, location);
        }
        if (piece instanceof Bishop) {
            moves = BoardMoveManager.diagonalPossibleMoves(piece, board, location);
        }
        if (piece instanceof Rook) {
            moves = BoardMoveManager.horizontalPossibleMoves(piece, board, location);
        }
        if (piece instanceof Queen) {
            moves.concat(BoardMoveManager.horizontalPossibleMoves(piece, board, location));
            moves.concat(BoardMoveManager.diagonalPossibleMoves(piece, board, location));
        }

        moves.filter(move => board.pieces[move.i][move.j].owner != piece.owner);

        return moves;
    }
}

class None extends Piece {

    type = 0;
    constructor(owner?: number) {
        super("", owner)
    }

    possibleMoveList(board: Board, location: PieceLocation): Move[] {
        return [];
    }
}

class Pawn extends Piece {

    type = 1;
    constructor(owner?: number) {
        super("Pawn", owner)
    }
}

class Rook extends Piece {

    type = 2;
    constructor(owner?: number) {
        super("Rook", owner)
    }
}

class Knight extends Piece {

    type = 3;
    constructor(owner?: number) {
        super("Knight", owner)
    }
}

class Bishop extends Piece {

    type = 4;
    constructor(owner?: number) {
        super("Bishop", owner)
    }

}

class Queen extends Piece {

    type = 5;
    constructor(owner?: number) {
        super("Queen", owner)
    }
}

class King extends Piece {
    type = 6;
    constructor(owner?: number) {
        super("King", owner)
    }

}

class PieceFactory {

    public static createPiece(type: PieceTypes, owner?: number): Piece {

        switch (type) {
            case 0: return new None();
            case 1: return new Pawn(owner);
            case 2: return new Rook(owner);
            case 3: return new Knight(owner);
            case 4: return new Bishop(owner);
            case 5: return new Queen(owner);
            case 6: return new King(owner);
            default: return new None(owner);
        }
    }
}


class Board {

    private initialBoardConfiguration = [
        [2, 3, 4, 6, 5, 4, 3, 2],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [2, 3, 4, 6, 5, 4, 3, 2]
    ];

    pieces: Piece[][];
    move: Move;
    constructor() {
        this.pieces = [];
        for (let i = 0; i < 8; i++) {
            this.pieces[i] = [];
            for (let j = 0; j < 8; j++) {
                this.pieces[i][j] = PieceFactory.createPiece(this.initialBoardConfiguration[i][j], Math.floor(i / 4));
            }
        }
    }

    setMove(move: Move): void {
        this.move = move;
    }

    findPiece(pieceId: number): { piece?: Piece, location?: PieceLocation } {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.pieces[i][j].id == pieceId)
                    return {
                        piece: this.pieces[i][j], location: { x: i, y: j }
                    }
            }
        }
    }

    executeMove(): void {

        let { piece, location } = this.findPiece(this.move.pieceId);
        let possibleMoves = BoardMoveManager.possibleMoveList(piece, this, location);
        let moves = possibleMoves.filter(move => move.pieceId == this.move.pieceId && move.i == this.move.i && move.j == this.move.j);

        if (moves.length == 0)
            console.log("Wrong move");
        else {
            this.pieces[this.move.i][this.move.j] = piece;
            this.pieces[location.x][location.y] = new None();
        }
    }

}




class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

var blackPiecesCode = ["", "&#9817;", "&#9814;", "&#9816;", "&#9815;", "&#9813;", "&#9812;"];
var whitePiecesCode = ["", "&#9823;", "&#9820;", "&#9822;", "&#9821;", "&#9819;", "&#9818;"];

class BoardElementBuilder {

    static buildCell(x: number, y: number): HTMLElement {
        let cell = document.createElement("div");
        cell.id = x.toString() + "_" + y.toString() + "_cell";
        if ((x + y) % 2 == 0)
            cell.className = "whiteCell";
        else
            cell.className = "blackCell";
        return cell;
    }

    static buildRow(x: number): HTMLElement {
        let row = document.createElement("div");
        row.className = "row";
        for (let i = 0; i < 8; i++)
            row.appendChild(BoardElementBuilder.buildCell(x, i));
        return row;
    }


    static buildBoard(element: HTMLElement) {
        for (let i = 0; i < 8; i++)
            element.appendChild(BoardElementBuilder.buildRow(i));
    }

    static drawPieces(board: Board) {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let id = i.toString() + "_" + j.toString() + "_cell";
                var cell: HTMLElement = document.getElementById(id);

                if (board.pieces[i][j].owner == 0)
                    cell.innerHTML = whitePiecesCode[board.pieces[i][j].type];
                else
                    cell.innerHTML = blackPiecesCode[board.pieces[i][j].type];
            }
        }
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var board = new Board();
    var boardElement = document.getElementById('board');
    BoardElementBuilder.buildBoard(boardElement);
    BoardElementBuilder.drawPieces(board);
    board.setMove(new Move(1, 2, 0));
    board.executeMove();
    this.timerToken = setInterval(() => BoardElementBuilder.drawPieces(board), 500);
 
    

};