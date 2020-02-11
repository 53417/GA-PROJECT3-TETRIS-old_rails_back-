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
            currentKey: '',
            tempo: 0,
            lines_cleared: 0,
            line_goal: 40
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // if (Object.keys(prevState.board).length !== Object.keys(this.state.board).length) {
        //     setInterval(() => {
            
        //         if (this.state.action === "kill") {
        //             clearInterval()
        //         } else {
        //             console.log()
        //             this.active_down()
        //         }
        //     }, 1000)
        // }
        if(this.state.tempo > 0) {
            setInterval(() => {
                this.active_down()
            }, this.state.tempo)
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress(e) {
        const keyCode = e.keyCode.toString();
        const map = {
            32: () => {this.player_drop_piece()
            console.log('space pressed')}, //space
            37: () => this.player_move_left(), //left arrow
            38: () => this.player_rotate_right(), //up arrow
            39: () => this.player_move_right(), //right arrow
            40: () => this.player_rotate_left(), //down arrow
            66: () => this.active_down() //B
        };
        const func = map[keyCode];
        if (func) {
            func();
        }
    }

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
        this.state.board = data;
        this.piece_random()
    }

    board_render() {
        let c = document.getElementById('canvas');
        let ctx = c.getContext('2d');

        //clear everything
        ctx.clearRect(0, 0, c.width, c.height);

        //draw cells
        for(var key in this.state.board) {
            this.cell_render(key)
        };

        //draw outline
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, c.height);
        ctx.lineTo(c.width, c.height);
        ctx.lineTo(c.width, 0);
        ctx.lineTo(0, 0)
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    show_state() {
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

    //applies correct line data to active cells
    active_border() {
        const { board } = this.state;

        //get active cells
        for(let i = 39; i < 229; i++) {
            if(board[i] !== undefined) {
                if(board[i].state === "active") {
                    //top check
                    if(board[i - 10].state !== "active") {
                        board[i].line_top = true;
                    } else {
                        board[i].line_top = false;
                    };
                    //right check
                    if(board[i + 1].state !== "active") {
                        board[i].line_right = true;
                    } else {
                        board[i].line_right = false;
                    };
                    //bot check
                    if(board[i + 10].state !== "active") {
                        board[i].line_bot = true;
                    } else {
                        board[i].line_bot = false;
                    };
                    //left check
                    if(board[i - 1].state !== "active") {
                        board[i].line_left = true;
                    } else {
                        board[i].line_left = false;
                    }
                } else if(board[i].state === "empty") {
                    board[i].line_top = false;
                    board[i].line_right = false;
                    board[i].line_top = false;
                    board[i].line_left = false
                }
            }
        };
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
            active_piece_direction: 0
        });

        // this.render_active_border()
    }

    piece_mrt(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 20;
        var c4 = start_cell_id + 11;
        const { board } = this.state;
        const col = "purple"

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
            active_piece_name: "mrt",
            active_piece_direction: 0
        });
    }

    piece_phat(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 1; 
        var c3 = start_cell_id + 10;
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
            active_piece_name: "phat",
            active_piece_direction: 0
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
            active_piece_name: "l",
            active_piece_direction: 0
        });
    }

    piece_bkl(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 10; 
        var c3 = start_cell_id + 19;
        var c4 = start_cell_id + 20;
        const { board } = this.state;
        const col = "blue"
        
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
            active_piece_name: "bkl",
            active_piece_direction: 0
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
            active_piece_name: "s",
            active_piece_direction: 0
        });
    }

    piece_bks(start_cell_id) {
        //cells to modify
        var c1 = start_cell_id;
        var c2 = start_cell_id + 9; 
        var c3 = start_cell_id + 10;
        var c4 = start_cell_id + 19;
        const { board } = this.state;
        const col = "red";

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
            active_piece_name: "bks",
            active_piece_direction: 0
        });
    }

    //math.rand 1 of 7 pieces
    piece_random() {
        const map = {
            0: () => this.piece_long(4),
            1: () => this.piece_mrt(4),
            2: () => this.piece_phat(4),
            3: () => this.piece_l(4),
            4: () => this.piece_bkl(5),
            5: () => this.piece_s(4),
            6: () => this.piece_bks(5)
        };
        let random = Math.floor(Math.random() * 7);
        const func = map[random];
        func();
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
            this.check_inactive();
            this.active_border();
            this.board_render()
        });
    }

    //drop
    increment_drop(action){
       this.setState({
           tempo: 500
       })
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
            this.check_inactive()
            this.active_border();
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

        var invalid_counter = 0;
        for(let i = 0; i < active_keys.length; i++) {
            if(board[active_keys[i]].col == 1) {
                invalid_counter += 1
            }
        }

        if(invalid_counter == 0) {
            this.update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4)
        }
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

        var invalid_counter = 0;
        for(let i = 0; i < active_keys.length; i++) {
            if(board[active_keys[i]].col == 10) {
                invalid_counter += 1
            }
        }

        if(invalid_counter == 0) {
            this.update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4)
        }
    }

    player_drop_piece() {
        var active_keys = [];
        const { board } = this.state;
        var drop = -1;
        let r_count = 0

        //find active keys
        for(var key in board) {
            if(board[key].state === "active") {
                active_keys.push(parseInt(key));
            }
        };

        //loop through rows to find the number of rows to drop

        while(drop < 0) {
            var true_counter = 0;
            
            //loop through activ key bottoms for full or null >239's
            for(let i = 0; i < active_keys.length; i++) {
                var test_cell = active_keys[i] + (r_count * 10);
                
                if(test_cell < 240) {
                    if (board[test_cell].row == 24) {
                        true_counter += 1
                    } 
                }

                if(test_cell + 10 < 240) {
                    if (board[test_cell + 10].state == "full") {
                        true_counter += 1
                    }
                } else if(test_cell + 10 > 239){
                    true_counter += 1
                }
            }


            if(true_counter > 0) {
                drop += r_count
            } else {
                r_count += 1
            }
        };

        //update cells
        var a1 = active_keys[0];
        var a2 = active_keys[1];
        var a3 = active_keys[2];
        var a4 = active_keys[3];
        var b1 = active_keys[0] + (r_count * 10);
        var b2 = active_keys[1] + (r_count * 10);
        var b3 = active_keys[2] + (r_count * 10);
        var b4 = active_keys[3] + (r_count * 10);
        this.update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4)
    }

    player_down_piece() {
    }

    piece_rotate(piece, start, end) {
        const map = {
            long01: [9,0,-9,-18],
            long12: [-9,0,9,18],
            long23: [9,0,-9,-18],
            long30: [-9,0,9,18],
            long03: [9,0,-9,-18],
            long10: [-9,0,9,18],
            long21: [9,0,-9,-18],
            long32: [-9,0,9,18],
            mrt01: [9,0,0,0],
            mrt12: [-9,-1,-1,0],
            mrt23: [0,0,0,-9],
            mrt30: [0,1,1,9],
            mrt03: [0,-1,-1,-9],
            mrt10: [-9,0,0,0],
            mrt21: [9,1,1,0],
            mrt32: [0,0,0,9],
            phat01: [0,0,0,0],
            phat12: [0,0,0,0],
            phat23: [0,0,0,0],
            phat30: [0,0,0,0],
            phat03: [0,0,0,0],
            phat10: [0,0,0,0],
            phat21: [0,0,0,0],
            phat32: [0,0,0,0],
            l01: [9,0,-9,-2],
            l12: [-10,-10,-1,1],
            l23: [2,9,0,-9],
            l30: [-1,1,10,10],
            l03: [1,-1,-10,-10],
            l10: [-9,0,9,2],
            l21: [10,10,1,-1],
            l32: [-2,-9,0,9],
            bkl01: [-1,-1,-9,-9],
            bkl12: [1,-8,0,9],
            bkl23: [9,9,1,1],
            bkl30: [-9,0,8,-1],
            bkl03: [9,0,-8,1],
            bkl10: [1,1,9,9],
            bkl21: [-1,8,0,-9],
            bkl32: [-9,-9,-1,-1],
            s01: [0,-9,-2,-11],
            s12: [0,9,2,11],
            s23: [0,-9,-2,-11],
            s30: [0,9,2,11],
            s03: [0,-9,-2,-11],
            s10: [0,9,2,11],
            s21: [0,-9,-2,-11],
            s32: [0,9,2,11],
            bks01: [-2,-10,-1,-9],
            bks12: [2,10,1,9],
            bks23: [-2,-10,-1,-9],
            bks30: [2,10,1,9],
            bks03: [-2,-10,-1,-9],
            bks10: [2,10,1,9],
            bks21: [-2,-10,-1,-9],
            bks32: [2,10,1,9]
        }
        var active_keys = [];
        var str = piece + start + end;
        var moveset = map[str];
        const { board } = this.state;

        //get active cells
        for(var key in board) {
            if(board[key].state === "active") {
                active_keys.push(parseInt(key));
            }
        };

        // move cells
        var a1 = active_keys[0];
        var a2 = active_keys[1];
        var a3 = active_keys[2];
        var a4 = active_keys[3];
        var b1 = active_keys[0] + moveset[0];
        var b2 = active_keys[1] + moveset[1];
        var b3 = active_keys[2] + moveset[2];
        var b4 = active_keys[3] + moveset[3];
        
        var invalid_counter = 0;

        if(board[b1].state == "full") {invalid_counter += 1 };
        if(board[b2].state == "full") {invalid_counter += 1 };
        if(board[b3].state == "full") {invalid_counter += 1 };
        if(board[b4].state == "full") {invalid_counter += 1 };

        if(invalid_counter == 0) {
            this.update_static_cells(a1, a2, a3, a4, b1, b2, b3, b4)
        }
    }

    player_rotate_right() {
        var piece = this.state.active_piece_name;
        var start = this.state.active_piece_direction;
        var end = 0;

        if(start == 3) {
            end = 0
        } else {
            end = start + 1
        };

        this.setState({
            active_piece_direction: end
        });
        this.piece_rotate(piece, start, end)
    }

    player_rotate_left() {
        var piece = this.state.active_piece_name;
        var start = this.state.active_piece_direction;
        var end = 0;

        if(start == 0) {
            end = 3
        } else {
            end = start - 1
        };

        this.setState({
            active_piece_direction: end
        });
        this.piece_rotate(piece, start, end)
    }

    check_inactive() {
        const { board } = this.state;
        var active_keys = [];
        var true_counter = 0;
        //get active cells
        for(var key in board) {
            if(board[key].state === "active") {
                active_keys.push(parseInt(key));
            }
        };

        //cycle through each active bottom to determine if should convert to inactive
        for(let i = 0; i < active_keys.length; i++) {
            if (board[active_keys[i]].row == 24) {
                true_counter += 1
            } else if (board[active_keys[i] + 10].state == "full") {
                true_counter += 1
            }
        };

        if(true_counter > 0) {
            this.setState({
                board: {
                    ...board, 
                    [active_keys[0]]: { 
                        ...board[active_keys[0]],
                        state: "full"
                    },
                    [active_keys[1]]: { 
                        ...board[active_keys[1]],
                        state: "full"
                    },
                    [active_keys[2]]: { 
                        ...board[active_keys[2]],
                        state: "full"
                    },
                    [active_keys[3]]: {
                        ...board[active_keys[3]],
                        state: "full"
                    }
                }
            }, () => {
                this.check_tetris();
                this.piece_random()
            });
            return true;
        } else {
            return false
        }
    }

    check_tetris() {
        const { board } = this.state;
        let upd_board = {};

        //id rows to clear in array
        let row_clear = [];

        //cycle through board and push rows with all states as filled
        for(let chkrow = 0; chkrow < 24; chkrow++) {
            let fill_cell_counter = 0;
            //cycle row and count the filled
            for(let chkrow_cell = 0; chkrow_cell < 10; chkrow_cell++) {
                //id cell with math
                let cell = (chkrow * 10) + chkrow_cell;
                // counting fill logic
                if(board[cell].state == "full") {
                    fill_cell_counter += 1
                };
            };
            //if row is filled push row id to the row_clear array
            if(fill_cell_counter === 10) {
                row_clear.push(chkrow + 1)
            }
        }

        //math based on row_clear array - only run if row_clear.length > 0
        if(row_clear.length > 0) {
            //generate map of all the rows
            let map = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                16: 0,
                17: 0,
                18: 0,
                19: 0,
                20: 0,
                21: 0,
                22: 0,
                23: 0,
                24: 0 //can ignore this row as redundant in loop?
            }

            //looping through the row_clear array
            for(let i = 0; i < row_clear.length; i++) {
                //loop through map and += the numbers less than rows to clear
                for(let x = 1; x <= row_clear[i]; x++) {
                    map[x] += 1;
                }
            }

            //loop through board backwards and perform adjustments to each cell according to value in map
            for(let i = 229; i >= 0; i--) {
                let cell = board[i];
                let row_down = map[cell.row];
                let incre = row_down * 10;

                //perform check to see if adjustmenet is necessary
                if(row_down > 0) {
                    // destination = current
                    upd_board[i + incre] = {
                        row: cell.row + row_down,
                        col: cell.col,
                        state: cell.state,
                        line_top: cell.line_top,
                        line_right: cell.line_right,
                        line_bot: cell.line_bot,
                        line_left: cell.line_left,
                        fill: cell.fill
                    };
                }
            }

            //loop through top rows = to row_clear.length and reset them to empty
            for(let i = 0; i < row_clear.length; i++) {
                for(let x = 0; x < 10; x++) {
                    let cell = (i * 10) + x;
                    
                    // current = blank
                    upd_board[cell] = {
                        row: i + 1,
                        col: x + 1,
                        state: "empty", //empty, full, active
                        line_top: false,
                        line_right: false,
                        line_bot: false,
                        line_left: false,
                        fill: ""
                    };
                }
            }

            this.setState({
                board: upd_board,
                lines_cleared: this.state.lines_cleared += row_clear.length
            });
            this.state.board = upd_board;
        }
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
            <h1>This project is continued at https://github.com/53417/GA-PROJECT3-TETRIS-MERN.git</h1>
            <p>Departing from rails backend - moving on the mongodb (MERN)</p>
            <h1>SinglePlayer</h1>
            <Button variant="primary" onClick={() => this.board_generate_data()}>generate board data</Button>
            <Button variant="success" onClick={() => this.board_render()}>render board</Button>
            <Button variant="success" onClick={() => this.increment_drop()}>start dropping</Button>
            <Button variant="success" onClick={() => this.increment_drop(0)}>stop dropping</Button>
            <Button variant="success" onClick={() => this.show_state()}>show state</Button>
            <br></br>
            <br></br>
            <Button variant="primary" onClick={() => this.check_tetris()}>check tetris</Button>
            <Button variant="primary" onClick={() => this.check_inactive()}>check inactive</Button>
            <br></br>
            <br></br>
            <h3>lines cleared: {this.state.lines_cleared}</h3>
            <canvas id="canvas" width="250" height="600"></canvas>
            </>
        );
    }
}