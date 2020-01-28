import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';

export default class Sp_game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            board: {},
            rows: 24,
            cols: 10,
            active_piece_name: '',
            active_piece_direction: '',
        };
    }

    // const map = {
    //     long: {
    //         f0t1: [9,0,-9,-18],
    //         f1t2: [-9,0,9,18],
    //         f2t3: [9,0,-9,18],
    //         f3t0: [-9,0,9,18],
    //         f0t3: [9,0,-9,-18],
    //         f1t0: [-9,0,9,18],
    //         f2t1: [9,0,-9,-18],
    //         f3t2: [-9,0,9,18]
    //     }
    // }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.board.size !== this.state.board.size) {
            console.log('hello there')
        }
    };
    
    board_generate_data() {
        var data = {};
        var counter = 0;
        for(let x = 1; x <= this.state.rows; x++) {
            for(let y = 1; y <= this.state.cols; y++) {
                data[counter] = {
                    row: x,
                    col: y,
                    state: "empty", //empty, full, active
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                };
                counter += 1
            }
        };
        this.setState({
            board: data,
        });
        console.log(this.state.board)
    }

    board_render() {
        let c = document.getElementById('canvas');
        let ctx = c.getContext('2d');

        //clear everything
        ctx.clearRect(0, 0, c.width, c.height);

        //draw cells
        for(var key in this.state.board) {
            this.cell_render(key)
        }

        //draw outline
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, c.height);
        ctx.lineTo(c.width, c.height);
        ctx.lineTo(c.width, 0);
        ctx.lineTo(0, 0)
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        console.log(this.state.board)
    }

    cell_render(cell_id) {
        let cell = this.state.board[cell_id];
        let c = document.getElementById('canvas');
        let ctx = c.getContext('2d');
        let cell_width = c.width / this.state.cols;
        let cell_height = c.height / this.state.rows;

        let x1 = (cell.col - 1) * cell_width; // 0, 0
        let y1 = (cell.row - 1) * cell_height;
        let x2 = ((cell.col - 1) * cell_width) + cell_width; // 50, 0
        let y2 = (cell.row - 1) * cell_height;
        let x3 = ((cell.col - 1) * cell_width) + cell_width; //50, 50
        let y3 = ((cell.row - 1) * cell_height) + cell_height;
        let x4 = (cell.col - 1) * cell_width; //0, 50
        let y4 = ((cell.row - 1) * cell_height) + cell_height;
        
        //outline
        if(cell.line_top === true) {
            this.draw_line(x1, y1, x2, y2)
        };
        if(cell.line_right === true) {
            this.draw_line(x2, y2, x3, y3)
        };
        if(cell.line_bot === true) {
            this.draw_line(x3, y3, x4, y4)
        };
        if(cell.line_left === true) {
            this.draw_line(x4, y4, x1, y1)
        };

        //fill color
        if(cell.fill !== "") {
            ctx.beginPath();
            ctx.rect(x1, y1, cell_width, cell_height);
            ctx.fillStyle = cell.fill;
            ctx.fill();
        }
        
    }

    draw_line(x, y, x2, y2) {
        let c = document.getElementById('canvas');
        let ctx = c.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    piece_long(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 20;
        var c4 = start_cell_id + 30;
        const { board } = this.state;
        const col = "cyan";

        //update cells
        this.setState({
            board: {
                ...board, 
                [c1]: { 
                    ...board[c1],
                    state: "active",
                    fill: col
                },
                [c2]: { 
                    ...board[c2],
                    state: "active",
                    fill: col
                },
                [c3]: { 
                    ...board[c3],
                    state: "active",
                    fill: col
                },
                [c4]: { 
                    ...board[c4],
                    state: "active",
                    fill: col
                }
            },
            active_piece_name: "long",
            active_piece_direction: "0"
        });
    }

    piece_mrt(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 11;
        var c4 = start_cell_id + 20;
        const { board } = this.state;
        const col = "purple"

        //update cells
        this.setState({
            board: {
                ...board, 
                [c1]: { 
                    ...board[c1],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c2]: { 
                    ...board[c2],
                    state: "active",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c3]: { 
                    ...board[c3],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: true,
                    line_left: false,
                    fill: col
                },
                [c4]: { 
                    ...board[c4],
                    state: "active",
                    line_top: false,
                    line_right: true,
                    line_bot: true,
                    line_left: true,
                    fill: col
                }
            }
        });
    }

    piece_phat(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 1;
        var c4 = start_cell_id + 11;
        const { board } = this.state;
        const col = "yellow"
        
        //update cells
        this.setState({
            board: {
                ...board, 
                [c1]: { 
                    ...board[c1],
                    state: "active",
                    line_top: true,
                    line_right: false,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c2]: { 
                    ...board[c2],
                    state: "active",
                    line_top: false,
                    line_right: false,
                    line_bot: true,
                    line_left: true,
                    fill: col
                },
                [c3]: { 
                    ...board[c3],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: false,
                    line_left: false,
                    fill: col
                },
                [c4]: { 
                    ...board[c4],
                    state: "active",
                    line_top: false,
                    line_right: true,
                    line_bot: true,
                    line_left: false,
                    fill: col
                }
            }
        });
    }

    piece_l(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 20;
        var c4 = start_cell_id + 21;
        const { board } = this.state;
        const col = "orange"
        
        //update cells
        this.setState({
            board: {
                ...board, 
                [c1]: { 
                    ...board[c1],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c2]: { 
                    ...board[c2],
                    state: "active",
                    line_top: false,
                    line_right: true,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c3]: { 
                    ...board[c3],
                    state: "active",
                    line_top: false,
                    line_right: false,
                    line_bot: true,
                    line_left: true,
                    fill: col
                },
                [c4]: { 
                    ...board[c4],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: true,
                    line_left: false,
                    fill: col
                }
            }
        });
    }

    piece_bkl(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 20;
        var c4 = start_cell_id + 19;
        const { board } = this.state;
        const col = "blue"
        
        //update cells
        this.setState({
            board: {
                ...board, 
                [c1]: { 
                    ...board[c1],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c2]: { 
                    ...board[c2],
                    state: "active",
                    line_top: false,
                    line_right: true,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c3]: { 
                    ...board[c3],
                    state: "active",
                    line_top: false,
                    line_right: true,
                    line_bot: true,
                    line_left: false,
                    fill: col
                },
                [c4]: { 
                    ...board[c4],
                    state: "active",
                    line_top: true,
                    line_right: false,
                    line_bot: true,
                    line_left: true,
                    fill: col
                }
            }
        });
    }

    piece_s(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 11;
        var c4 = start_cell_id + 21;
        const { board } = this.state;
        const col = "green"
        
        //update cells
        this.setState({
            board: {
                ...board, 
                [c1]: { 
                    ...board[c1],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c2]: { 
                    ...board[c2],
                    state: "active",
                    line_top: false,
                    line_right: false,
                    line_bot: true,
                    line_left: true,
                    fill: col
                },
                [c3]: { 
                    ...board[c3],
                    state: "active",
                    line_top: true,
                    line_right: true,
                    line_bot: false,
                    line_left: false,
                    fill: col
                },
                [c4]: { 
                    ...board[c4],
                    state: "active",
                    line_top: false,
                    line_right: true,
                    line_bot: true,
                    line_left: true,
                    fill: col
                }
            }
        });
    }

    piece_bks(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 9;
        var c4 = start_cell_id + 19;
        const { board } = this.state;
        const col = "red"
        
        //update cells
        this.setState({
            board: {
                ...board, 
                [c1]: { 
                    ...board[c1],
                    state: "empty",
                    line_top: true,
                    line_right: true,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c2]: { 
                    ...board[c2],
                    state: "empty",
                    line_top: false,
                    line_right: true,
                    line_bot: true,
                    line_left: false,
                    fill: col
                },
                [c3]: { 
                    ...board[c3],
                    state: "empty",
                    line_top: true,
                    line_right: false,
                    line_bot: false,
                    line_left: true,
                    fill: col
                },
                [c4]: { 
                    ...board[c4],
                    state: "empty",
                    line_top: false,
                    line_right: true,
                    line_bot: true,
                    line_left: true,
                    fill: col
                }
            }
        });
    }

    active_down() {
        var active_keys = [];
        var active_cells = {};
        const { board } = this.state;

        //draw cells
        for(var key in board) {
            if(board[key].state === "active") {
                active_keys.push(parseInt(key));
                active_cells[key] = board[key];
            }
        };

        //setState * 8; active_cells set to empty, active_cells moved down 1 row (id + 10)
        this.setState({
            board: {
                ...board,[active_keys[0]]: { 
                    row: board[active_keys[0]].row,
                    col: board[active_keys[0]].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [active_keys[1]]: {
                    row: board[active_keys[1]].row,
                    col: board[active_keys[1]].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [active_keys[2]]: {
                    row: board[active_keys[2]].row,
                    col: board[active_keys[2]].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [active_keys[3]]: {
                    row: board[active_keys[3]].row,
                    col: board[active_keys[3]].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [active_keys[0] + 10]: { 
                    row: board[active_keys[0] + 10].row,
                    col: board[active_keys[0] + 10].col,
                    state: "active",
                    line_top: active_cells[active_keys[0]].line_top,
                    line_right: active_cells[active_keys[0]].line_right,
                    line_bot: active_cells[active_keys[0]].line_bot,
                    line_left: active_cells[active_keys[0]].line_left,
                    fill: active_cells[active_keys[0]].fill
                },
                [active_keys[1] + 10]: {
                    row: board[active_keys[1] + 10].row,
                    col: board[active_keys[1] + 10].col,
                    state: "active",
                    line_top: active_cells[active_keys[1]].line_top,
                    line_right: active_cells[active_keys[1]].line_right,
                    line_bot: active_cells[active_keys[1]].line_bot,
                    line_left: active_cells[active_keys[1]].line_left,
                    fill: active_cells[active_keys[1]].fill
                },
                [active_keys[2] + 10]: {
                    row: board[active_keys[2] + 10].row,
                    col: board[active_keys[2] + 10].col,
                    state: "active",
                    line_top: active_cells[active_keys[2]].line_top,
                    line_right: active_cells[active_keys[2]].line_right,
                    line_bot: active_cells[active_keys[2]].line_bot,
                    line_left: active_cells[active_keys[2]].line_left,
                    fill: active_cells[active_keys[2]].fill
                },
                [active_keys[3] + 10]: {
                    row: board[active_keys[3] + 10].row,
                    col: board[active_keys[3] + 10].col,
                    state: "active",
                    line_top: active_cells[active_keys[3]].line_top,
                    line_right: active_cells[active_keys[3]].line_right,
                    line_bot: active_cells[active_keys[3]].line_bot,
                    line_left: active_cells[active_keys[3]].line_left,
                    fill: active_cells[active_keys[3]].fill
                }
            }
        }, () => {
            this.board_render();
        });
    }

    //moves cells eg: a1 to b1
    update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4) {
        const { board } = this.state;
        var active_cells = {
            1: board[a1],
            2: board[a2],
            3: board[a3],
            4: board[a4]
        };

        console.log(active_cells);
        // setState * 8; active_cells set to empty, active_cells moved down 1 row (id + 10)
        this.setState({
            board: {
                ...board,
                [a1]: { 
                    row: board[a1].row,
                    col: board[a1].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [a2]: {
                    row: board[a2].row,
                    col: board[a2].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [a3]: {
                    row: board[a3].row,
                    col: board[a3].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [a4]: {
                    row: board[a4].row,
                    col: board[a4].col,
                    state: "empty",
                    line_top: false,
                    line_right: false,
                    line_bot: false,
                    line_left: false,
                    fill: ""
                },
                [b1]: { 
                    row: board[b1].row,
                    col: board[b1].col,
                    state: "active",
                    line_top: active_cells[1].line_top,
                    line_right: active_cells[1].line_right,
                    line_bot: active_cells[1].line_bot,
                    line_left: active_cells[1].line_left,
                    fill: active_cells[1].fill
                },
                [b2]: {
                    row: board[b2].row,
                    col: board[b2].col,
                    state: "active",
                    line_top: active_cells[2].line_top,
                    line_right: active_cells[2].line_right,
                    line_bot: active_cells[2].line_bot,
                    line_left: active_cells[2].line_left,
                    fill: active_cells[2].fill
                },
                [b3]: {
                    row: board[b3].row,
                    col: board[b3].col,
                    state: "active",
                    line_top: active_cells[3].line_top,
                    line_right: active_cells[3].line_right,
                    line_bot: active_cells[3].line_bot,
                    line_left: active_cells[3].line_left,
                    fill: active_cells[3].fill
                },
                [b4]: {
                    row: board[b4].row,
                    col: board[b4].col,
                    state: "active",
                    line_top: active_cells[4].line_top,
                    line_right: active_cells[4].line_right,
                    line_bot: active_cells[4].line_bot,
                    line_left: active_cells[4].line_left,
                    fill: active_cells[4].fill
                }
            }
        }, () => {
            this.board_render();
        });
    }

    player_move_left() {
        var active_keys = [];
        const { board } = this.state;

        //get active cells
        for(var key in board) {
            if(board[key].state === "active") {
                active_keys.push(parseInt(key));
            }
        };

        // - 1 for left
        var a1 = active_keys[0];
        var a2 = active_keys[1];
        var a3 = active_keys[2];
        var a4 = active_keys[3];
        var b1 = active_keys[0] - 1;
        var b2 = active_keys[1] - 1;
        var b3 = active_keys[2] - 1;
        var b4 = active_keys[3] - 1;

        this.update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4)
    }

    player_move_right() {
        var active_keys = [];
        const { board } = this.state;

        //get active cells
        for(var key in board) {
            if(board[key].state === "active") {
                active_keys.push(parseInt(key));
            }
        };

        // - 1 for left
        var a1 = active_keys[0];
        var a2 = active_keys[1];
        var a3 = active_keys[2];
        var a4 = active_keys[3];
        var b1 = active_keys[0] + 1;
        var b2 = active_keys[1] + 1;
        var b3 = active_keys[2] + 1;
        var b4 = active_keys[3] + 1;

        this.update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4)
    }

    player_drop_piece() {
    }

    player_down_piece() {
    }

    rotate_test(piece, start, end) {
        const map = {
            long01: [9,0,-9,-18],
            long12: [-9,0,9,18],
            long23: [9,0,-9,18],
            long30: [-9,0,9,18],
            long03: [9,0,-9,-18],
            long10: [-9,0,9,18],
            long21: [9,0,-9,-18],
            long32: [-9,0,9,18],
            mrt01: [11,0,-11,9],
            mrt12: [9,0,-9,-11],
            mrt23: [-11,0,11,-9],
            mrt30: [-9,0,9,11],
            mrt03: [9,0,-9,-11],
            mrt10: [-11,0,11,-9],
            mrt21: [-9,0,9,11],
            mrt32: [11,0,-11,9],
            phat01: [0,0,0,0],
            phat12: [0,0,0,0],
            phat23: [0,0,0,0],
            phat30: [0,0,0,0],
            phat03: [0,0,0,0],
            phat10: [0,0,0,0],
            phat21: [0,0,0,0],
            phat32: [0,0,0,0],
            l01: [11,0,-11,-2],
            l12: [9,0,-9,-20],
            l23: [-11,0,11,2],
            l30: [-9,0,9,20],
            l03: [9,0,-9,-20],
            l10: [-11,0,11,2],
            l21: [-9,0,9,20],
            l32: [11,0,-11,-2],
            bkl01: [11,0,-11,-20],
            bkl12: [9,0,-9,2],
            bkl23: [-22,-12,-2,-3],
            bkl30: [2,12,22,21],
            bkl03: [-2,-12,-22,-21],
            bkl10: [-11,0,11,20],
            bkl21: [-9,0,9,-2],
            bkl32: [22,12,2,3],
            s01: [1,-10,-1,-12],
            s12: [-1,10,1,12],
            s23: [1,-10,-1,-12],
            s30: [-1,10,1,12],
            s03: [1,-10,-1,-12],
            s10: [-1,10,1,12],
            s21: [1,-10,-1,-12],
            s32: [-1,10,1,12],
            bks01: [10,-1,-10,-21],
            bks12: [-10,1,10,21],
            bks23: [10,-1,-10,-21],
            bks30: [-10,1,10,21],
            bks03: [10,-1,-10,-21],
            bks10: [-10,1,10,21],
            bks21: [10,-1,-10,-21],
            bks32: [-10,1,10,21]
        }
        console.log(map);
        var active_keys = [];
        const { board } = this.state;

        //get active cells
        for(var key in board) {
            if(board[key].state === "active") {
                active_keys.push(parseInt(key));
            }
        };

        // move cells
        var str = piece + start + end;
        var moveset = map[str];

        console.log(str);
        console.log(moveset);

        var a1 = active_keys[0];
        var a2 = active_keys[1];
        var a3 = active_keys[2];
        var a4 = active_keys[3];
        var b1 = active_keys[0] + moveset[0];
        var b2 = active_keys[1] + moveset[1];
        var b3 = active_keys[2] + moveset[2];
        var b4 = active_keys[3] + moveset[3];

        this.update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4)
    }

    // maybe have which piece is active in the state as well as its rotation position to determine cell updates
    player_rotate_left(a1, a2, a3, a4) {
        // piece = this.active_piece_name;
        // if(piece == long_boi)
    }

    player_rotate_right() {

    }

    //game board is 10 wide and 20 high
    // might make it 24 high to accomodate for beginning
    // do a lose check everytime a new piece is placed - if any values in first 4 rows = true then = lose
    // new piece spawned auto when 1 piece is confirm dropped and player hasnt lost yet
    // determine lines of pieces when being thrown down, ignore after placed to achieve cultris look
    // confirm drop by looping each active piece id + 10, if all empty then continue cycle dropping, else set the piece to full and generate next piece

    // 6 keys - required listeners
    // rotate left - down arrow
    // rotate right - up arrow
    // move piece left - left arrow
    // move piece right - right arrow
    // move piece down 1 (need to reset active piece move down 1 row timer each time) - b key
    // drop piece - spacebar

    render() {
        return(
            <>
            <h1>SinglePlayer</h1>
            <Button variant="primary" onClick={() => this.board_generate_data()}>generate board data</Button>
            <Button variant="success" onClick={() => this.board_render()}>render board</Button>
            <br></br>
            <br></br>
            <Button variant="primary" onClick={() => this.piece_long(4)}>input long</Button>
            <Button variant="primary" onClick={() => this.piece_mrt(4)}>input mrt</Button>
            <Button variant="primary" onClick={() => this.piece_phat(4)}>input phat</Button>
            <Button variant="primary" onClick={() => this.piece_l(4)}>input l</Button>
            <Button variant="primary" onClick={() => this.piece_bkl(5)}>input bkl</Button>
            <Button variant="primary" onClick={() => this.piece_s(4)}>input s</Button>
            <Button variant="primary" onClick={() => this.piece_bks(5)}>input bks</Button>
            <br></br>
            <br></br>
            <Button variant="primary" onClick={() => this.player_move_left()}>move left 1</Button>
            <Button variant="primary" onClick={() => this.active_down()}>active down 1</Button>
            <Button variant="primary" onClick={() => this.player_move_right()}>move right 1</Button>
            <br></br>
            <br></br>
            <Button variant="primary" onClick={() => this.rotate_test('long', 0, 1)}>piece rotate calc</Button>
            <br></br>
            <br></br>
            <canvas id="canvas" width="250" height="600"></canvas>;
            </>
        );
    }
}