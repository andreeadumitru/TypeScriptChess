var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Move = (function () {
    function Move(pieceId, i, j) {
        this.pieceId = pieceId;
        this.i = i;
        this.j = j;
    }
    return Move;
}());
var Piece = (function () {
    function Piece(name, owner) {
        this.name = name;
        this.owner = owner;
        this.id = Piece.currentId;
        Piece.currentId++;
    }
    return Piece;
}());
Piece.currentId = 0;
var PieceTypes;
(function (PieceTypes) {
    PieceTypes[PieceTypes["None"] = 0] = "None";
    PieceTypes[PieceTypes["Pawn"] = 1] = "Pawn";
    PieceTypes[PieceTypes["Rook"] = 2] = "Rook";
    PieceTypes[PieceTypes["Knight"] = 3] = "Knight";
    PieceTypes[PieceTypes["Bishop"] = 4] = "Bishop";
    PieceTypes[PieceTypes["Queen"] = 5] = "Queen";
    PieceTypes[PieceTypes["King"] = 6] = "King";
})(PieceTypes || (PieceTypes = {}));
var BoardMoveManager = (function () {
    function BoardMoveManager() {
    }
    BoardMoveManager.horizontalPossibleMoves = function (piece, board, location) {
        var moves = [];
        for (var i = location.x + 1; i < 8; i++) {
            if (board.pieces[i][location.y] instanceof None) {
                moves.push(new Move(piece.id, i, location.y));
            }
            else
                break;
        }
        for (var i = location.x - 1; i >= 0; i--) {
            if (board.pieces[i][location.y] instanceof None) {
                moves.push(new Move(piece.id, i, location.y));
            }
            else
                break;
        }
        for (var i = location.y + 1; i < 8; i++) {
            if (board.pieces[location.x][i] instanceof None) {
                moves.push(new Move(piece.id, location.x, i));
            }
            else
                break;
        }
        for (var i = location.y - 1; i > 0; i--) {
            if (board.pieces[location.x][i] instanceof None) {
                moves.push(new Move(piece.id, location.x, i));
            }
            else
                break;
        }
        return moves;
    };
    BoardMoveManager.diagonalPossibleMoves = function (piece, board, location) {
        var moves = [];
        for (var i = location.x + 1, j = location.y + 1; i < 8 && j < 8; i++, j++) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }
        for (var i = location.x + 1, j = location.y - 1; i < 8 && j >= 0; i++, j--) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }
        for (var i = location.x - 1, j = location.y + 1; i >= 0 && j < 8; i--, j++) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }
        for (var i = location.x - 1, j = location.y - 1; i >= 0 && j >= 0; i--, j--) {
            if (board.pieces[i][j] instanceof None) {
                moves.push(new Move(piece.id, i, j));
            }
            else
                break;
        }
        return moves;
    };
    BoardMoveManager.kingPossibleMoves = function (piece, board, location) {
        var moves = [];
        var availableMoves = [[0, 1], [1, 0], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]];
        for (var _i = 0, availableMoves_1 = availableMoves; _i < availableMoves_1.length; _i++) {
            var move = availableMoves_1[_i];
            if (location.x + move[0] < 8 && location.y + move[1] < 8 && location.x + move[0] >= 0 && location.y + move[1] >= 0)
                moves.push(new Move(piece.id, location.x + move[0], location.y + move[1]));
        }
        return moves;
    };
    BoardMoveManager.pawnPossibleMoves = function (piece, board, location) {
        if (piece.owner == undefined)
            return [];
        if (piece.owner == 0 && location.x < 7)
            return [new Move(piece.id, location.x + 1, location.y)];
        if (piece.owner == 1 && location.x > 0)
            return [new Move(piece.id, location.x - 1, location.y)];
    };
    BoardMoveManager.knightPossibleMoves = function (piece, board, location) {
        var moves = [];
        var availableMoves = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]];
        for (var _i = 0, availableMoves_2 = availableMoves; _i < availableMoves_2.length; _i++) {
            var move = availableMoves_2[_i];
            if (location.x + move[0] < 8 && location.y + move[1] < 8 && location.x + move[0] >= 0 && location.y + move[1] >= 0)
                moves.push(new Move(piece.id, location.x + move[0], location.y + move[1]));
        }
        return moves;
    };
    BoardMoveManager.possibleMoveList = function (piece, board, location) {
        var moves = [];
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
        moves.filter(function (move) { return board.pieces[move.i][move.j].owner != piece.owner; });
        return moves;
    };
    return BoardMoveManager;
}());
var None = (function (_super) {
    __extends(None, _super);
    function None(owner) {
        var _this = _super.call(this, "", owner) || this;
        _this.type = 0;
        return _this;
    }
    None.prototype.possibleMoveList = function (board, location) {
        return [];
    };
    return None;
}(Piece));
var Pawn = (function (_super) {
    __extends(Pawn, _super);
    function Pawn(owner) {
        var _this = _super.call(this, "Pawn", owner) || this;
        _this.type = 1;
        return _this;
    }
    return Pawn;
}(Piece));
var Rook = (function (_super) {
    __extends(Rook, _super);
    function Rook(owner) {
        var _this = _super.call(this, "Rook", owner) || this;
        _this.type = 2;
        return _this;
    }
    return Rook;
}(Piece));
var Knight = (function (_super) {
    __extends(Knight, _super);
    function Knight(owner) {
        var _this = _super.call(this, "Knight", owner) || this;
        _this.type = 3;
        return _this;
    }
    return Knight;
}(Piece));
var Bishop = (function (_super) {
    __extends(Bishop, _super);
    function Bishop(owner) {
        var _this = _super.call(this, "Bishop", owner) || this;
        _this.type = 4;
        return _this;
    }
    return Bishop;
}(Piece));
var Queen = (function (_super) {
    __extends(Queen, _super);
    function Queen(owner) {
        var _this = _super.call(this, "Queen", owner) || this;
        _this.type = 5;
        return _this;
    }
    return Queen;
}(Piece));
var King = (function (_super) {
    __extends(King, _super);
    function King(owner) {
        var _this = _super.call(this, "King", owner) || this;
        _this.type = 6;
        return _this;
    }
    return King;
}(Piece));
var PieceFactory = (function () {
    function PieceFactory() {
    }
    PieceFactory.createPiece = function (type, owner) {
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
    };
    return PieceFactory;
}());
var Board = (function () {
    function Board() {
        this.initialBoardConfiguration = [
            [2, 3, 4, 6, 5, 4, 3, 2],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [2, 3, 4, 6, 5, 4, 3, 2]
        ];
        this.pieces = [];
        for (var i = 0; i < 8; i++) {
            this.pieces[i] = [];
            for (var j = 0; j < 8; j++) {
                this.pieces[i][j] = PieceFactory.createPiece(this.initialBoardConfiguration[i][j], Math.floor(i / 4));
            }
        }
    }
    Board.prototype.setMove = function (move) {
        this.move = move;
    };
    Board.prototype.findPiece = function (pieceId) {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (this.pieces[i][j].id == pieceId)
                    return {
                        piece: this.pieces[i][j], location: { x: i, y: j }
                    };
            }
        }
    };
    Board.prototype.executeMove = function () {
        var _this = this;
        var _a = this.findPiece(this.move.pieceId), piece = _a.piece, location = _a.location;
        var possibleMoves = BoardMoveManager.possibleMoveList(piece, this, location);
        var moves = possibleMoves.filter(function (move) { return move.pieceId == _this.move.pieceId && move.i == _this.move.i && move.j == _this.move.j; });
        if (moves.length == 0)
            console.log("Wrong move");
        else {
            this.pieces[this.move.i][this.move.j] = piece;
            this.pieces[location.x][location.y] = new None();
        }
    };
    return Board;
}());
//# sourceMappingURL=file1.js.map